// src/services/mqttService.js
const mqtt = require("mqtt");
const Monitoring = require("../models/Monitoring");
const Aktuator = require("../models/Aktuator");
const Setpoint = require("../models/Setpoint");

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
      // Parsing CSV data
      const csvData = message.toString().split(",");
      if (csvData.length === 7) {
        const [watertemp, waterppm, waterph, airtemp, airhum, hours, date] =
          csvData.map((val) => val.trim());

        // Validasi dan parsing data
        const parsedWatertemp = parseFloat(watertemp);
        const parsedWaterppm = parseFloat(waterppm);
        const parsedWaterph = parseFloat(waterph);
        const parsedAirtemp = parseFloat(airtemp);
        const parsedAirhum = parseFloat(airhum);

        // Validasi timestamp
        const timestampString = `${date} ${hours}`;
        const timestamp = new Date(timestampString);
        if (isNaN(timestamp.getTime())) {
          throw new Error(`Invalid timestamp: ${timestampString}`);
        }

        // Validasi data lainnya
        if (
          isNaN(parsedWatertemp) ||
          isNaN(parsedWaterppm) ||
          isNaN(parsedWaterph) ||
          isNaN(parsedAirtemp) ||
          isNaN(parsedAirhum)
        ) {
          throw new Error("Invalid sensor data detected");
        }

        // Menyimpan ke database
        const delayLogData = await Monitoring.create({
          watertemp: parsedWatertemp,
          waterppm: parsedWaterppm,
          waterph: parsedWaterph,
          airtemp: parsedAirtemp,
          airhum: parsedAirhum,
          timestamp,
        });

        console.log("Delay log data saved:", delayLogData);

        // Broadcast ke WebSocket
        broadcastWebSocket({ topic, data: delayLogData });
      } else {
        console.warn("Invalid CSV format received on delaylog topic");
      }
    }
  } catch (error) {
    console.error(`Error processing MQTT message: ${error.message}`);
  }
});

module.exports = {
  client,
  setWebSocketServer: (webSocketServer) => (wss = webSocketServer),
};
