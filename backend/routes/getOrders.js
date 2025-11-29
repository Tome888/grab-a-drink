const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

router.get("/", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ ok: false, message: "No token provided" });
    }
    
    try {
        jwt.verify(token, SECRET);
    } catch (err) {
        return res
        .status(401)
        .json({ ok: false, message: "Invalid or expired token" });
    }
    
    const orders = db.prepare("SELECT * FROM orders").all();;

    res.json({ ok: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
