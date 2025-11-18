const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

const validateUsername = (username) => typeof username === "string" && username.trim().length >= 3;
const validatePassword = (password) =>
  typeof password === "string" &&
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[\W_]/.test(password); 

router.put("/:field", (req, res) => {
  try {
    const field = req.params.field;
    if (!["username", "password"].includes(field)) {
      return res.status(400).json({ ok: false, message: "Invalid field parameter" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ ok: false, message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }

    const value = req.body[field];
    if (!value) {
      return res.status(400).json({ ok: false, message: `${field} is required` });
    }

    if (field === "username" && !validateUsername(value)) {
      return res.status(400).json({ ok: false, message: "Username must be at least 3 characters" });
    }

    if (field === "password" && !validatePassword(value)) {
      return res.status(400).json({
        ok: false,
        message:
          "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 symbol",
      });
    }

    const user = db.prepare("SELECT * FROM user WHERE id = ?").get(decoded.id);
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });

    if (user[field] === value) {
      return res.json({ ok: true, message: "Nothing changed" });
    }

    db.prepare(`UPDATE user SET ${field} = ? WHERE id = ?`).run(value, user.id);

    res.json({ ok: true, message: `${field} updated successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;
