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
    [
      "herbalawu/monitoring",
      "herbalawu/state",
      "herbalawu/setpoint",
      "herbalawu/mode",
      "herbalawu/delaylog",
    ],
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

client.on("message", async (topic, message) => {
  try {
    if (topic === "herbalawu/delaylog") {
      // Parsing data dari format string
      const dataString = message.toString();
      const [watertemp, waterppm, waterph, airtemp, airhum, hours, date] =
        dataString.split(",").map((item) => item.trim());

      // Validasi format data
      if (
        watertemp &&
        waterppm &&
        waterph &&
        airtemp &&
        airhum &&
        hours &&
        date
      ) {
        console.log("Received delaylog data:", dataString);

        // Broadcast ke WebSocket
        broadcastWebSocket({
          topic,
          data: { watertemp, waterppm, waterph, airtemp, airhum, hours, date },
        });

        // Mengonversi jam dan tanggal menjadi format Date
        const [day, month, year] = date
          .split("-")
          .map((item) => parseInt(item, 10));
        const [hour, minute, second] = hours
          .split(":")
          .map((item) => parseInt(item, 10));
        const timestamp = new Date(year, month - 1, day, hour, minute, second);

        // Menyimpan data ke tabel monitoring
        const monitoringData = new Monitoring({
          watertemp: parseFloat(watertemp),
          waterppm: parseFloat(waterppm),
          waterph: parseFloat(waterph),
          airtemp: parseFloat(airtemp),
          airhum: parseFloat(airhum),
          timestamp, // Timestamp yang sudah di-generate
        });

        await monitoringData.save();
        console.log("Delaylog data saved to monitoring table:", monitoringData);
      } else {
        console.warn("Invalid delaylog data format:", message.toString());
      }
    }

    // Logika untuk topik lainnya tetap sama
    else if (topic === "herbalawu/mode") {
      // Validasi format JSON
      if (data && typeof data.automode === "number") {
        console.log("Received valid mode data:", data);

        // Broadcast ke WebSocket
        broadcastWebSocket({ topic, data });
      } else {
        console.warn("Invalid JSON format for mode topic:", message.toString());
      }
    } else if (topic === "herbalawu/monitoring") {
      // Existing logic untuk topik monitoring
      broadcastWebSocket({ topic, data });
      monitoringDataBuffer = data;
      console.log("Monitoring data buffered:", monitoringDataBuffer);
    } else if (topic === "herbalawu/state") {
      const aktuatorData = new Aktuator(data);
      await aktuatorData.save();
      console.log("Aktuator data saved:", aktuatorData);
      broadcastWebSocket({ topic, data: aktuatorData });
    } else if (topic === "herbalawu/setpoint") {
      const setpointData = new Setpoint(data);
      await setpointData.save();
      console.log("Setpoint data saved:", setpointData);
      broadcastWebSocket({ topic, data: setpointData });
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

// // Fungsi untuk menangani pesan yang diterima dan menyimpan data ke database
// client.on("message", async (topic, message) => {
//   try {
//     const data = JSON.parse(message.toString());

//     if (topic === "herbalawu/mode") {
//       // Validasi format JSON
//       if (data && typeof data.automode === "number") {
//         console.log("Received valid mode data:", data);

//         // Broadcast ke WebSocket
//         broadcastWebSocket({ topic, data });
//       } else {
//         console.warn("Invalid JSON format for mode topic:", message.toString());
//       }
//     } else if (topic === "herbalawu/monitoring") {
//       // Existing logic untuk topik monitoring
//       broadcastWebSocket({ topic, data });
//       monitoringDataBuffer = data;
//       console.log("Monitoring data buffered:", monitoringDataBuffer);
//     } else if (topic === "herbalawu/state") {
//       const aktuatorData = new Aktuator(data);
//       await aktuatorData.save();
//       console.log("Aktuator data saved:", aktuatorData);
//       broadcastWebSocket({ topic, data: aktuatorData });
//     } else if (topic === "herbalawu/setpoint") {
//       const setpointData = new Setpoint(data);
//       await setpointData.save();
//       console.log("Setpoint data saved:", setpointData);
//       broadcastWebSocket({ topic, data: setpointData });
//     }
//   } catch (error) {
//     console.error("Error processing MQTT message:", error);
//   }
// });

// Fungsi untuk menginisialisasi WebSocket Server di mqttService
const initializeWebSocket = (webSocketServer) => {
  wss = webSocketServer;
};

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
  initializeWebSocket,
};
