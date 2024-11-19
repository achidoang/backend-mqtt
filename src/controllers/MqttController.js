// src/controllers/MqttController.js
const Monitoring = require("../models/Monitoring");
const Aktuator = require("../models/Aktuator");
const Setpoint = require("../models/Setpoint");
const { publishToTopic } = require("../services/mqttService");
const { Op, fn, col, literal } = require("sequelize");

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

// Fungsi untuk mengambil data rata-rata mingguan
const getWeeklyMonitoringData = async (req, res) => {
  try {
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const data = await Monitoring.findAll({
      attributes: [
        [fn("YEAR", col("timestamp")), "year"],
        [fn("WEEK", col("timestamp")), "week"],
        [fn("AVG", col("watertemp")), "avg_watertemp"],
        [fn("AVG", col("waterppm")), "avg_waterppm"],
        [fn("AVG", col("waterph")), "avg_waterph"],
        [fn("AVG", col("airtemp")), "avg_airtemp"],
        [fn("AVG", col("airhum")), "avg_airhum"],
      ],
      group: [literal("year"), literal("week")],
      order: [
        [literal("year"), order],
        [literal("week"), order],
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weekly monitoring data", error });
  }
};

// Fungsi untuk mengambil data rata-rata bulanan
const getMonthlyMonitoringData = async (req, res) => {
  try {
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const data = await Monitoring.findAll({
      attributes: [
        [fn("YEAR", col("timestamp")), "year"],
        [fn("MONTH", col("timestamp")), "month"],
        [fn("AVG", col("watertemp")), "avg_watertemp"],
        [fn("AVG", col("waterppm")), "avg_waterppm"],
        [fn("AVG", col("waterph")), "avg_waterph"],
        [fn("AVG", col("airtemp")), "avg_airtemp"],
        [fn("AVG", col("airhum")), "avg_airhum"],
      ],
      group: [literal("year"), literal("month")],
      order: [
        [literal("year"), order],
        [literal("month"), order],
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching monthly monitoring data", error });
  }
};

// Fungsi untuk mengambil data rata-rata harian
const getDailyMonitoringData = async (req, res) => {
  try {
    const order = req.query.order === "desc" ? "DESC" : "ASC";

    const data = await Monitoring.findAll({
      attributes: [
        [fn("YEAR", col("timestamp")), "year"],
        [fn("MONTH", col("timestamp")), "month"],
        [fn("DAY", col("timestamp")), "day"],
        [fn("AVG", col("watertemp")), "avg_watertemp"],
        [fn("AVG", col("waterppm")), "avg_waterppm"],
        [fn("AVG", col("waterph")), "avg_waterph"],
        [fn("AVG", col("airtemp")), "avg_airtemp"],
        [fn("AVG", col("airhum")), "avg_airhum"],
      ],
      group: [literal("year"), literal("month"), literal("day")],
      order: [
        [literal("year"), order],
        [literal("month"), order],
        [literal("day"), order],
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching daily monitoring data", error });
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
  getWeeklyMonitoringData,
  getMonthlyMonitoringData,
  getDailyMonitoringData,
};
