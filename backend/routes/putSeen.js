const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

router.put("/:id", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ ok: false, message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid or expired token" });
    }

    const orderId = parseInt(req.params.id);
    if (isNaN(orderId))
      return res.status(400).json({ ok: false, message: "Invalid order ID" });

    const { seen } = req.body;
    if (typeof seen !== "boolean") {
      return res
        .status(400)
        .json({ ok: false, message: "'seen' must be boolean" });
    }

    const stmt = db.prepare("UPDATE orders SET seen = ? WHERE id = ?");
    const info = stmt.run(seen ? 1 : 0, orderId);

    if (info.changes === 0) {
      return res.status(404).json({ ok: false, message: "Order not found" });
    }

    res.json({
      ok: true,
      message: "Order 'seen' status updated successfully",
      orderId,
      seen,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
