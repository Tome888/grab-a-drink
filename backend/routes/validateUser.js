const express = require("express");
const router = express.Router();
const db = require("../db");
const { z } = require("zod");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "THIS-SHOULD-BE-IN-ENV-FILE";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

router.post("/", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: parsed.error.errors });
  }

  const { username, password } = parsed.data;

  const user = db
    .prepare("SELECT * FROM user WHERE username = ? AND password = ?")
    .get(username, password);

  if (!user) {
    return res.status(401).json({ ok: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

  res.json({
    ok: true,
    message: "Login successful!",
    user: {
      id: user.id,
      username: user.username,
    },
    token,
  });
});

module.exports = router;
