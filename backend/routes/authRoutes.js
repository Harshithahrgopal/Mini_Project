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

// LOGIN API (fixed login logic)
router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // First find user using email or phone
    const user = await User.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check password separately
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Check role separately
    if (user.role !== role) {
      return res.status(401).json({ error: "Invalid role" });
    }

    // Success
    res.json({ msg: "Login OK", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
