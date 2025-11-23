const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
  wardId: { type: mongoose.Schema.Types.ObjectId, ref: "Ward" },
  timestamp: { type: Date, default: Date.now },
  transactionHash: String // from blockchain
});

module.exports = mongoose.model("Vote", voteSchema);
