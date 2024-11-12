// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { WebSocketServer } = require("ws");
const connectDB = require("./config/database");
const mqttClient = require("./config/mqttClient");
const app = require("./app");
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

// Buat HTTP server untuk WebSocket
const server = http.createServer(app);

// Inisialisasi WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { wss };
