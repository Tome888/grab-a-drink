const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "THIS-SHOULD-BE-IN-ENV-FILE"; 

const imagesDir = path.join(__dirname, "..", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, imagesDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || ".webp";
    const timestamp = Date.now();
    cb(null, `${file.fieldname}-${timestamp}${ext}`);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ ok: false, message: "No token provided" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ ok: false, message: "Invalid token" });
  }

  const { name, price } = req.body;
  const file = req.file;

  if (!name || !price || !file) {
    return res
      .status(400)
      .json({ ok: false, message: "Name, price, and image are required" });
  }

  try {
    const imgPath = `/images/${file.filename}`;
    db.prepare("INSERT INTO menu (name, price, img_path) VALUES (?, ?, ?)").run(
      name,
      parseFloat(price),
      imgPath
    );

    res.json({
      ok: true,
      message: "Menu item added successfully",
      img_path: imgPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to add menu item" });
  }
});

module.exports = router;
