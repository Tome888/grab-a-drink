const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

router.delete("/:id", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ ok: false, message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }

    const tableId = parseInt(req.params.id);
    if (isNaN(tableId)) return res.status(400).json({ ok: false, message: "Invalid table ID" });

    const stmt = db.prepare("DELETE FROM tables WHERE id = ?");
    const info = stmt.run(tableId);

    if (info.changes === 0) {
      return res.status(404).json({ ok: false, message: "Table not found" });
    }

    res.json({ ok: true, message: "Table deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
