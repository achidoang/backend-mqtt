// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { WebSocketServer } = require("ws");
const connectDB = require("./config/database");
const mqttClient = require("./config/mqttClient");
const app = require("./app");
const sequelize = require("./config/sequelize");
const { initializeWebSocket } = require("./services/mqttService");

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

// Inisialisasi WebSocket server pada port yang berbeda (untuk debugging)
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  // Hanya izinkan koneksi WebSocket pada path "/ws"
  if (request.url === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

initializeWebSocket(wss); // Inisialisasi WebSocket di mqttService

// Tambahkan pesan log di event WebSocket
wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  ws.on("message", (message) => {
    console.log("Received message from client:", message);
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
});
