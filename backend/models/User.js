const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  aadhar: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: String, 
});

module.exports = mongoose.model("User", userSchema);
