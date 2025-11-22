const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER API
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ msg: "User Registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN API (no OTP logic here)
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  const user = await User.findOne({
    $or: [{ email: username }, { phone: username }],
    password,
    role,
  });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ msg: "Login OK", user });
});

module.exports = router;
