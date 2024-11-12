// src/models/Setpoint.js
const mongoose = require("mongoose");

const SetpointSchema = new mongoose.Schema({
  watertemp: Number,
  waterppm: Number,
  waterph: Number,
  airtemp: Number,
  airhum: Number,
  profile: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Setpoint", SetpointSchema);
