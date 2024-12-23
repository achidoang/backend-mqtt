// src/services/mqttService.js
const mqtt = require("mqtt");
const Monitoring = require("../models/Monitoring");
const Aktuator = require("../models/Aktuator");
const Setpoint = require("../models/Setpoint");
const client = require("../config/mqttClient");

// Variabel untuk menyimpan data sementara untuk topik herbalawu/monitoring
let monitoringDataBuffer = null;
let lastSavedTimestamp = null;

// WebSocket Server instance
let wss;

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

// Fungsi untuk menginisialisasi WebSocket Server di mqttService
const initializeWebSocket = (webSocketServer) => {
  wss = webSocketServer;
};

// Fungsi untuk menyimpan data monitoring ke database setiap 10 menit
const saveMonitoringData = async () => {
  try {
    if (monitoringDataBuffer) {
      const currentTimestamp = new Date();
      if (
        !lastSavedTimestamp ||
        currentTimestamp - lastSavedTimestamp >= 10 * 60 * 1000
      ) {
        const monitoringData = new Monitoring(monitoringDataBuffer);
        await monitoringData.save();
        console.log("Monitoring data saved:", monitoringData);
        lastSavedTimestamp = currentTimestamp; // Perbarui timestamp terakhir
      }
    }
  } catch (error) {
    console.error("Error saving monitoring data to database:", error);
  }
};

// Interval untuk memeriksa dan menyimpan data monitoring setiap 10 menit
setInterval(saveMonitoringData, 10 * 60 * 1000);

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
      const csvData = message.toString().split(",");
      if (csvData.length === 7) {
        const [watertemp, waterppm, waterph, airtemp, airhum, hours, date] =
          csvData.map((val) => val.trim());

        const parsedWatertemp = parseFloat(watertemp);
        const parsedWaterppm = parseFloat(waterppm);
        const parsedWaterph = parseFloat(waterph);
        const parsedAirtemp = parseFloat(airtemp);
        const parsedAirhum = parseFloat(airhum);

        const [day, month, year] = date.split("-");
        const timestampString = `${year}-${month}-${day}T${hours}`;
        const timestamp = new Date(timestampString);

        if (isNaN(timestamp.getTime())) {
          throw new Error(`Invalid timestamp: ${timestampString}`);
        }

        if (
          isNaN(parsedWatertemp) ||
          isNaN(parsedWaterppm) ||
          isNaN(parsedWaterph) ||
          isNaN(parsedAirtemp) ||
          isNaN(parsedAirhum)
        ) {
          throw new Error("Invalid sensor data detected");
        }

        const delayLogData = await Monitoring.create({
          watertemp: parsedWatertemp,
          waterppm: parsedWaterppm,
          waterph: parsedWaterph,
          airtemp: parsedAirtemp,
          airhum: parsedAirhum,
          timestamp:
            timestamp.getFullYear() +
            "-" +
            ("0" + (timestamp.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + timestamp.getDate()).slice(-2) +
            " " +
            ("0" + timestamp.getHours()).slice(-2) +
            ":" +
            ("0" + timestamp.getMinutes()).slice(-2) +
            ":" +
            ("0" + timestamp.getSeconds()).slice(-2),
        });

        console.log("Delay log data saved:", delayLogData);

        broadcastWebSocket({ topic, data: delayLogData });
      } else {
        console.warn("Invalid CSV format received on delaylog topic");
      }
    } else {
      const data = JSON.parse(message.toString());

      if (topic === "herbalawu/mode") {
        if (data && typeof data.automode === "number") {
          console.log("Received valid mode data:", data);
          broadcastWebSocket({ topic, data });
        } else {
          console.warn(
            "Invalid JSON format for mode topic:",
            message.toString()
          );
        }
      } else if (topic === "herbalawu/monitoring") {
        data.timestamp = data.timestamp || new Date();
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
      } else {
        console.warn("Unhandled topic:", topic);
      }
    }
  } catch (error) {
    console.error(
      `Error processing MQTT message on topic ${topic}: ${error.message}`
    );
  }
});

module.exports = {
  publishToTopic,
  initializeWebSocket,
};
