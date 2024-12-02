// src/routes/weatherRoutes.js

const express = require("express");
const { fetchWeather } = require("../controllers/WeatherController");
const router = express.Router();

// Route untuk mendapatkan data cuaca
router.get("/", fetchWeather);

module.exports = router;
