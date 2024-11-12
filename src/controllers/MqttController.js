// src/controllers/MqttController.js
const Monitoring = require("../models/Monitoring");
const Aktuator = require("../models/Aktuator");
const Setpoint = require("../models/Setpoint");
const { publishToTopic } = require("../services/mqttService");

// Mendapatkan data Monitoring
const getMonitoringData = async (req, res) => {
  try {
    const data = await Monitoring.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan data Aktuator
const getAktuatorData = async (req, res) => {
  try {
    const data = await Aktuator.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan data Setpoint
const getSetpointData = async (req, res) => {
  try {
    const data = await Setpoint.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Publish data ke topik tertentu
const publishData = (req, res) => {
  const { topic, payload } = req.body;

  if (!topic || !payload) {
    return res.status(400).json({ message: "Topic and payload are required" });
  }

  // Kirim hanya `payload` ke topik yang ditentukan
  publishToTopic(topic, payload);
  res.status(200).json({ message: `Data published to ${topic}` });
};

// Mendapatkan data historis Monitoring
const getMonitoringHistory = async (req, res) => {
  try {
    const historyData = await Monitoring.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(historyData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching monitoring history data", error });
  }
};

// Mendapatkan data historis Aktuator
const getAktuatorHistory = async (req, res) => {
  try {
    const historyData = await Aktuator.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(historyData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching aktuator history data", error });
  }
};

// Mendapatkan data historis Setpoint
const getSetpointHistory = async (req, res) => {
  try {
    const historyData = await Setpoint.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(historyData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching setpoint history data", error });
  }
};

module.exports = {
  getMonitoringData,
  getMonitoringHistory,
  getAktuatorData,
  getAktuatorHistory,
  getSetpointData,
  getSetpointHistory,
  publishData,
};
