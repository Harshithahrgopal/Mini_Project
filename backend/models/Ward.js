const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema({
  wardName: String,
  wardNumber: Number,
  population: Number,
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election" }
});

module.exports = mongoose.model("Ward", wardSchema);
