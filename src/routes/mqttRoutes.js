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

// Endpoint untuk mendapatkan data historis Aktuator
router.get("/history/aktuator", verifyToken, MqttController.getAktuatorHistory);

// Endpoint untuk mendapatkan data historis Setpoint
router.get("/history/setpoint", verifyToken, MqttController.getSetpointHistory);

// Endpoint untuk publish data ke MQTT
router.post("/publish", verifyToken, MqttController.publishData);

module.exports = router;
