const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (_, res) => {
  try {
    const menu = db.prepare("SELECT * FROM menu").all();
    res.json({ ok: true, menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to fetch menu" });
  }
});

module.exports = router;