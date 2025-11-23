const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  status: String, // upcoming, active, ended
  description: String
});

module.exports = mongoose.model("Election", electionSchema);
