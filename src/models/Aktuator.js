// src/models/Aktuator.js
const mongoose = require("mongoose");

const AktuatorSchema = new mongoose.Schema({
  actuator_nutrisi: Number,
  actuator_ph_up: Number,
  actuator_ph_down: Number,
  actuator_air_baku: Number,
  actuator_pompa_utama_1: Number,
  actuator_pompa_utama_2: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Aktuator", AktuatorSchema);
