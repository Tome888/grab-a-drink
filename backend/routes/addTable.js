const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

const validateTableName = (name) => typeof name === "string" && name.trim().length >= 1;

router.post("/", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ ok: false, message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }

    const { name } = req.body;
    if (!validateTableName(name)) {
      return res.status(400).json({ ok: false, message: "Table name is required" });
    }

    const stmt = db.prepare("INSERT INTO tables (name) VALUES (?)");
    const info = stmt.run(name);

    res.json({
      ok: true,
      message: "Table added successfully",
      table: { id: info.lastInsertRowid, name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
