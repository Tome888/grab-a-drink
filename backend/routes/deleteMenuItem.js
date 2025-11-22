const express = require("express");
const router = express.Router();
const db = require("../db");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

router.delete("/:id", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ ok: false, message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ ok: false, message: "Invalid token" });

  try {
    jwt.verify(token, SECRET);
  } catch (err) {
    return res.status(403).json({ ok: false, message: "Invalid token" });
  }

  const id = req.params.id;

  try {
    const item = db.prepare("SELECT * FROM menu WHERE id = ?").get(id);

    if (!item) {
      return res.status(404).json({ ok: false, message: "Menu item not found" });
    }

    if (item.img_path) {
      const filePath = path.join(__dirname, "..", item.img_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.prepare("DELETE FROM menu WHERE id = ?").run(id);

    res.json({ ok: true, message: "Menu item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to delete menu item" });
  }
});

module.exports = router;
