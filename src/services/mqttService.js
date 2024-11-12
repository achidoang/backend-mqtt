// src/services/mqttService.js
const mqtt = require("mqtt");
const Monitoring = require("../models/Monitoring");
const Aktuator = require("../models/Aktuator");
const Setpoint = require("../models/Setpoint");

// const client = mqtt.connect("mqtt://broker.emqx.io:1883");
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

// Fungsi untuk menangani pesan yang diterima dan menyimpan data ke database sesuai kebutuhan
client.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    if (topic === "herbalawu/monitoring") {
      // Simpan data monitoring ke buffer dan tunggu interval 10 menit
      monitoringDataBuffer = data;
      console.log(
        "Monitoring data received and buffered:",
        monitoringDataBuffer
      );
    } else if (topic === "herbalawu/aktuator") {
      // Simpan data aktuator setiap kali ada data baru
      const aktuatorData = new Aktuator(data);
      await aktuatorData.save();
      console.log("Aktuator data saved:", aktuatorData);
    } else if (topic === "herbalawu/setpoint") {
      // Simpan data setpoint setiap kali ada data baru
      const setpointData = new Setpoint(data);
      await setpointData.save();
      console.log("Setpoint data saved:", setpointData);
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
