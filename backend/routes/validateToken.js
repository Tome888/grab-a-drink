const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const JWT_SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

router.post("/", (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ ok: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ ok: false, message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      ok: true,
      message: "Token is valid",
      user: decoded, // { id, username, iat, exp }
    });
  } catch (err) {
    res.status(401).json({ ok: false, message: "Invalid or expired token" });
  }
});

module.exports = router;
