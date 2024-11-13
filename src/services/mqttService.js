// src/services/mqttService.js
const mqtt = require("mqtt");
const Monitoring = require("../models/Monitoring");
const Aktuator = require("../models/Aktuator");
const Setpoint = require("../models/Setpoint");
// const { wss } = require("../server"); // Import WebSocket Server

let wss;
const client = require("../config/mqttClient");

// Variabel untuk menyimpan data sementara untuk topik herbalawu/monitoring
let monitoringDataBuffer = null;

// Fungsi subscribe untuk setiap topik
client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe(
    ["herbalawu/monitoring", "herbalawu/aktuator", "herbalawu/setpoint"],
    (err) => {
      if (err) {
        console.error("Error subscribing to topics:", err);
      }
    }
  );
});

// Fungsi untuk broadcast data ke semua klien WebSocket yang terhubung
const broadcastWebSocket = (data) => {
  if (wss && wss.clients) {
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } else {
    console.error("WebSocket server is not initialized");
  }
};

// Fungsi untuk menangani pesan yang diterima dari topik MQTT dan broadcast ke WebSocket
client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    // Broadcast ke WebSocket tanpa menyimpan ke database
    if (
      [
        "herbalawu/monitoring",
        "herbalawu/aktuator",
        "herbalawu/setpoint",
      ].includes(topic)
    ) {
      broadcastWebSocket({ topic, data });
      console.log(`Data broadcasted for topic ${topic}:`, data);
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

// Fungsi untuk menginisialisasi WebSocket Server di mqttService
const initializeWebSocket = (webSocketServer) => {
  wss = webSocketServer;
};

// // Fungsi untuk menyimpan data monitoring ke database setiap 10 menit
// setInterval(async () => {
//   try {
//     if (monitoringDataBuffer) {
//       const monitoringData = new Monitoring(monitoringDataBuffer);
//       await monitoringData.save();
//       console.log("Monitoring data saved:", monitoringData);
//       monitoringDataBuffer = null; // Reset buffer setelah data disimpan
//     }
//   } catch (error) {
//     console.error("Error saving monitoring data to database:", error);
//   }
// }, 10 * 60 * 1000); // Interval 10 menit untuk topik herbalawu/monitoring

// Fungsi untuk publish ke topik tertentu
const publishToTopic = (topic, message) => {
  client.publish(topic, JSON.stringify(message), (err) => {
    if (err) {
      console.error("Error publishing to topic:", err);
    } else {
      console.log(`Message published to ${topic}`);
    }
  });
};

module.exports = {
  publishToTopic,
  initializeWebSocket,
};
