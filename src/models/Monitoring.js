// src/models/Monitoring.js
const mongoose = require("mongoose");

const MonitoringSchema = new mongoose.Schema({
  watertemp: Number,
  waterppm: Number,
  waterph: Number,
  airtemp: Number,
  airhum: Number,
  device: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Monitoring", MonitoringSchema);
