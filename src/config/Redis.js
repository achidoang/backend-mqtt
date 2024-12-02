// src/config/Redis.js

const redis = require("redis");

const redisClient = redis.createClient({
  host: "127.0.0.1", // atau URL Redis Cloud jika menggunakan cloud
  port: 6379,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redisClient;
