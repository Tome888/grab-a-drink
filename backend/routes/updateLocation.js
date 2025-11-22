const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

const validateLat = (lat) => typeof lat === "number" && lat >= -90 && lat <= 90;
const validateLon = (lon) => typeof lon === "number" && lon >= -180 && lon <= 180;
const validateRadius = (radius) => typeof radius === "number" && radius > 0 && radius <= 1000; 

router.put("/", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ ok: false, message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }

    const { lat, lon, radius } = req.body;

    if (!validateLat(lat)) return res.status(400).json({ ok: false, message: "Invalid latitude" });
    if (!validateLon(lon)) return res.status(400).json({ ok: false, message: "Invalid longitude" });
    if (!validateRadius(radius)) return res.status(400).json({ ok: false, message: "Invalid radius" });

    const user = db.prepare("SELECT * FROM user WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    db.prepare(`UPDATE user SET lat = ?, lon = ?, radius = ? WHERE id = ?`).run(lat, lon, radius, user.id);

    res.json({ ok: true, message: "Location & radius updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
