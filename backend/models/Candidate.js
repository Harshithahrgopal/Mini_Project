const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  party: String,
  symbol: String, // image URL or name
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward" },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
  candidateNumber: Number // optional for blockchain
});

module.exports = mongoose.model("Candidate", candidateSchema);
