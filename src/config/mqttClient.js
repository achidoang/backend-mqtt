// src/config/mqttClient.js
const mqtt = require("mqtt");
const dotenv = require("dotenv");

dotenv.config();

const client = mqtt.connect({
  host: process.env.MQTT_BROKER_URL,
  port: process.env.MQTT_PORT,
});

client.on("connect", () => {
  console.log("Connected to MQTT broker");
});

client.on("error", (err) => {
  console.error("MQTT connection error:", err);
});

module.exports = client;
