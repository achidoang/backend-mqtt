// src/app.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mqttRoutes = require("./routes/mqttRoutes");
const guideRoutes = require("./routes/guideRoutes");

require("./config/database");

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by CORS"));
      }
    },
  })
);

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan route untuk autentikasi
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/users", userRoutes);
app.use("/api/v2/mqtt", mqttRoutes);
app.use("/api/v2/guides", guideRoutes);
module.exports = app;
