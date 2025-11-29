const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "THIS-SHOULD-BE-IN-ENV-FILE-ORDER";
const TOKEN_EXPIRY = "120m";

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.post("/", (req, res) => {
  const { location } = req.body;
  const { lat, lon, tableId } = location;

  if (lat == null || lon == null || !tableId)
    return res.status(400).json({ message: "Missing coordinates or tableId" });

  const table = db
    .prepare("SELECT id, name FROM tables WHERE id = ?")
    .get(Number(tableId));

  if (!table) return res.status(404).json({ message: "Table not found" });

  const admin = db.prepare("SELECT lat, lon, radius FROM user LIMIT 1").get();

  if (!admin)
    return res.status(500).json({ message: "Admin location not found" });

  const distance = getDistanceFromLatLonInKm(lat, lon, admin.lat, admin.lon);

  if (distance <= admin.radius / 1000) {
    const token = jwt.sign({ tableId: table.id }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });
    return res.json({ valid: true, token, tableId: table.id });
  } else {
    return res
      .status(403)
      .json({ valid: false, message: "You are too far from the bar" });
  }
});

module.exports = router;
