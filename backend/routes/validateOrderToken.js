const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = "THIS-SHOULD-BE-IN-ENV-FILE-ORDER";

router.post("/", (req, res) => {
  const authHeader = req.headers.authorization;
  const { tableId } = req.body;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, message: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (!tableId) {
    return res.status(400).json({ valid: false, message: "Missing tableId" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.tableId !== Number(tableId)) {
      return res.status(403).json({ valid: false, message: "Token does not match table" });
    }

    return res.json({
      token
    });
  } catch (err) {
    return res.status(401).json({ valid: false, message: "Invalid or expired token" });
  }
});

module.exports = router;
