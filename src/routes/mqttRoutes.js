// src/routes/mqttRoutes.js

const express = require("express");
const MqttController = require("../controllers/MqttController");
const { verifyToken } = require("../middleware/authMiddleware"); // Perbaikan import

const router = express.Router();

// Endpoint untuk mendapatkan data Monitoring
router.get("/monitoring", verifyToken, MqttController.getMonitoringData);

// Endpoint untuk mendapatkan data Aktuator
router.get("/aktuator", verifyToken, MqttController.getAktuatorData);

// Endpoint untuk mendapatkan data Setpoint
router.get("/setpoint", verifyToken, MqttController.getSetpointData);

// Endpoint untuk mendapatkan data historis Monitoring
router.get(
  "/history/monitoring",
  verifyToken,
  MqttController.getMonitoringHistory
);

// Endpoint untuk mendapatkan data historis mingguan Monitoring
router.get(
  "/history/monitoring/weekly",
  verifyToken,
  MqttController.getWeeklyMonitoringData
);

// Endpoint untuk mendapatkan data historis bulanan Monitoring
router.get(
  "/history/monitoring/monthly",
  verifyToken,
  MqttController.getMonthlyMonitoringData
);

router.get(
  "/history/monitoring/daily",
  verifyToken,
  MqttController.getDailyMonitoringData
);

// Endpoint untuk mendapatkan data historis Aktuator
router.get("/history/aktuator", verifyToken, MqttController.getAktuatorHistory);

// Endpoint untuk mendapatkan data historis Setpoint
router.get("/history/setpoint", MqttController.getSetpointHistory);

// Endpoint untuk publish data ke MQTT
router.post("/publish", verifyToken, MqttController.publishData);

// Endpoint untuk mendapatkan data historis Monitoring dengan pagination, filter tanggal, dan sorting
router.get(
  "/history/monitoring/paginated",
  verifyToken,
  MqttController.getMonitoringHistoryPaginated
);

// Endpoint delete data
router.delete(
  "/history/monitoring",
  verifyToken,
  MqttController.deleteDataByDate
);

module.exports = router;
