// src/app.js
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mqttRoutes = require("./routes/mqttRoutes");
require("./config/database");

const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan route untuk autentikasi
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/mqtt", mqttRoutes);
module.exports = app;
