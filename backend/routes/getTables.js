const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (_, res) => {
  try {
    const tables = db.prepare("SELECT * FROM tables").all();
    res.json({ ok: true, tables });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;