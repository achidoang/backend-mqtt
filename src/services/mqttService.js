// src/services/mqttService.js
const mqtt = require("mqtt");
const Monitoring = require("../models/Monitoring");
const Aktuator = require("../models/Aktuator");
const Setpoint = require("../models/Setpoint");

const client = mqtt.connect("mqtt://broker.emqx.io:1883");

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

// Simpan data yang diterima ke database
client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    if (topic === "herbalawu/monitoring") {
      const monitoringData = new Monitoring(data);
      await monitoringData.save();
      console.log("Monitoring data saved:", monitoringData);
    } else if (topic === "herbalawu/aktuator") {
      const aktuatorData = new Aktuator(data);
      await aktuatorData.save();
      console.log("Aktuator data saved:", aktuatorData);
    } else if (topic === "herbalawu/setpoint") {
      const setpointData = new Setpoint(data);
      await setpointData.save();
      console.log("Setpoint data saved:", setpointData);
    }
  } catch (error) {
    console.error("Error processing MQTT message:", error);
  }
});

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
