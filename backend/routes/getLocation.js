const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

router.get("/", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ ok: false, message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }

    const user = db.prepare("SELECT lat, lon, radius FROM user WHERE id = ?").get(decoded.id);

    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    res.json({ ok: true, lat: user.lat, lon: user.lon, radius: user.radius });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
