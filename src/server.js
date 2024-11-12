// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const mqttClient = require("./config/mqttClient");
const app = require("./app");
// src/server.js
const sequelize = require("./config/sequelize");

dotenv.config(); // Memuat variabel lingkungan dari file .env

// Sinkronisasi model
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

// const app = express();
const PORT = process.env.PORT || 4000;

// Middleware untuk parsing JSON
app.use(express.json());

// Koneksi ke Database
connectDB();

// Inisialisasi MQTT Client
mqttClient;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
