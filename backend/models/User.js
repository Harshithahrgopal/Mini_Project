const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  aadhar: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: String, // admin, voter, verifier
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward" },
  hasVoted: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
