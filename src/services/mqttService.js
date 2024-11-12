// src/services/mqttService.js
const mqtt = require("mqtt");
const Monitoring = require("../models/Monitoring");
const Aktuator = require("../models/Aktuator");
const Setpoint = require("../models/Setpoint");
const { wss } = require("../server"); // Import WebSocket Server

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
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Fungsi untuk menangani pesan yang diterima dan menyimpan data ke database
client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    if (topic === "herbalawu/monitoring") {
      // Kirim data monitoring ke WebSocket setiap kali ada pesan masuk
      broadcastWebSocket({ topic, data });

      // Simpan data ke buffer untuk disimpan ke database nanti (10 menit)
      monitoringDataBuffer = data;
      console.log("Monitoring data buffered:", monitoringDataBuffer);
    } else if (topic === "herbalawu/aktuator") {
      const aktuatorData = new Aktuator(data);
      await aktuatorData.save();
      console.log("Aktuator data saved:", aktuatorData);

      // Broadcast data ke WebSocket
      broadcastWebSocket({ topic, data: aktuatorData });
    } else if (topic === "herbalawu/setpoint") {
      const setpointData = new Setpoint(data);
      await setpointData.save();
      console.log("Setpoint data saved:", setpointData);

      // Broadcast data ke WebSocket
      broadcastWebSocket({ topic, data: setpointData });
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

// Fungsi untuk menyimpan data monitoring ke database setiap 10 menit
setInterval(async () => {
  try {
    if (monitoringDataBuffer) {
      const monitoringData = new Monitoring(monitoringDataBuffer);
      await monitoringData.save();
      console.log("Monitoring data saved:", monitoringData);
      monitoringDataBuffer = null; // Reset buffer setelah data disimpan
    }
  } catch (error) {
    console.error("Error saving monitoring data to database:", error);
  }
}, 10 * 60 * 1000); // Interval 10 menit untuk topik herbalawu/monitoring

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
};
