// src/routes/mqttRoutes.js

const express = require("express");
const MqttController = require("../controllers/MqttController");

const router = express.Router();

// Endpoint untuk mendapatkan data Monitoring
router.get("/monitoring", MqttController.getMonitoringData);

// Endpoint untuk mendapatkan data Aktuator
router.get("/aktuator", MqttController.getAktuatorData);

// Endpoint untuk mendapatkan data Setpoint
router.get("/setpoint", MqttController.getSetpointData);

// Endpoint untuk mendapatkan data historis Monitoring
router.get("/history/monitoring", MqttController.getMonitoringHistory);

// Endpoint untuk mendapatkan data historis mingguan Monitoring
router.get(
  "/history/monitoring/weekly",
  MqttController.getWeeklyMonitoringData
);

// Endpoint untuk mendapatkan data historis bulanan Monitoring
router.get(
  "/history/monitoring/monthly",
  MqttController.getMonthlyMonitoringData
);

// Endpoint untuk mendapatkan data historis Aktuator
router.get("/history/aktuator", MqttController.getAktuatorHistory);

// Endpoint untuk mendapatkan data historis Setpoint
router.get("/history/setpoint", MqttController.getSetpointHistory);

// Endpoint untuk publish data ke MQTT
router.post("/publish", MqttController.publishData);

module.exports = router;
