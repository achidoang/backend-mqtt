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

// Fungsi untuk membulatkan rata-rata ke dua angka di belakang koma
const roundToTwoDecimals = (data) => {
  return data.map((item) => ({
    ...item,
    avg_watertemp: parseFloat(item.avg_watertemp).toFixed(2),
    avg_waterppm: parseFloat(item.avg_waterppm).toFixed(2),
    avg_waterph: parseFloat(item.avg_waterph).toFixed(2),
    avg_airtemp: parseFloat(item.avg_airtemp).toFixed(2),
    avg_airhum: parseFloat(item.avg_airhum).toFixed(2),
  }));
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
      raw: true, // Mengembalikan data sebagai objek JSON murni
    });

    // Membulatkan rata-rata ke dua angka di belakang koma
    const roundedData = roundToTwoDecimals(data);

    res.status(200).json(roundedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching daily monitoring data", error });
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
      raw: true,
    });

    const roundedData = roundToTwoDecimals(data);

    res.status(200).json(roundedData);
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
      raw: true,
    });

    const roundedData = roundToTwoDecimals(data);

    res.status(200).json(roundedData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching monthly monitoring data", error });
  }
};

// Mendapatkan data historis Monitoring dengan pagination, sorting, dan filter tanggal
const getMonitoringHistoryPaginated = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      sortBy = "timestamp",
      order = "DESC",
      maxLimit = 200,
    } = req.query;

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // Validasi limit
    if (parseInt(limit) > maxLimit) {
      return res
        .status(400)
        .json({ message: `Limit cannot exceed ${maxLimit}.` });
    }

    // Validasi page dan limit
    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ message: "Page and limit must be positive integers." });
    }

    const offset = (page - 1) * limit;

    // Query filter tanggal
    const dateFilter = {};
    if (startDate) {
      dateFilter[Op.gte] = new Date(startDate); // Gunakan Op.gte untuk startDate
    }
    if (endDate) {
      dateFilter[Op.lte] = new Date(endDate); // Gunakan Op.lte untuk endDate
    }

    console.log("Date Filter:", dateFilter);

    // Pastikan whereClause menggunakan timestamp
    const whereClause =
      dateFilter[Op.gte] || dateFilter[Op.lte] ? { timestamp: dateFilter } : {};

    console.log("Final whereClause:", whereClause);

    // Query dengan filter, sorting, pagination
    const { count, rows } = await Monitoring.findAndCountAll({
      where: whereClause, // Pastikan filter diterapkan di sini
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      data: rows,
      currentPage: parseInt(page),
      totalPages,
      totalItems: count,
    });
  } catch (error) {
    console.error("Error in getMonitoringHistoryPaginated:", error);
    res.status(500).json({
      message: "Error fetching paginated monitoring history data",
      error,
    });
  }
};

// Menghapus data berdasarkan tanggal
const deleteDataByDate = async (req, res) => {
  const { date } = req.query; // Mengambil tanggal dari query parameter

  if (!date) {
    return res
      .status(400)
      .json({ message: "Tanggal (date) harus disediakan." });
  }

  try {
    // Validasi tanggal
    const targetDate = new Date(date);
    if (isNaN(targetDate)) {
      return res.status(400).json({
        message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD.",
      });
    }

    // Format tanggal sebagai string (YYYY-MM-DD)
    const formattedDate = targetDate.toISOString().split("T")[0];

    // Menghapus data berdasarkan tanggal di Monitoring
    const deletedMonitoring = await Monitoring.destroy({
      where: literal(`DATE(timestamp) = '${formattedDate}'`),
    });

    // Menghapus data berdasarkan tanggal di Aktuator
    const deletedAktuator = await Aktuator.destroy({
      where: literal(`DATE(timestamp) = '${formattedDate}'`),
    });

    // Menghapus data berdasarkan tanggal di Setpoint (opsional)
    const deletedSetpoint = await Setpoint.destroy({
      where: literal(`DATE(timestamp) = '${formattedDate}'`),
    });

    res.status(200).json({
      message: "Data berhasil dihapus.",
      deletedMonitoring,
      deletedAktuator,
      deletedSetpoint,
    });
  } catch (error) {
    console.error("Error saat menghapus data berdasarkan tanggal:", error);
    res.status(500).json({
      message: "Error saat menghapus data berdasarkan tanggal.",
      error,
    });
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
  getMonitoringHistoryPaginated,
  deleteDataByDate,
};
