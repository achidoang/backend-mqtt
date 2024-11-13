// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware untuk verifikasi token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) {
    console.log("Token tidak ditemukan");
    return res.status(401).json({ message: "Autentikasi diperlukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan informasi pengguna di req.user
    console.log("Token valid, user:", req.user);
    next();
  } catch (error) {
    console.log("Token tidak valid");
    return res.status(403).json({ message: "Token tidak valid" });
  }
};

// Middleware untuk cek role admin
const adminMiddleware = (req, res, next) => {
  // Pastikan req.user berisi informasi pengguna
  if (req.user && req.user.role === "admin") {
    console.log("Akses diberikan, anda adalah admin");
    next();
  } else {
    console.log("Akses ditolak, user bukan admin");
    return res.status(403).json({ message: "Akses ditolak, anda bukan admin" });
  }
};
module.exports = {
  adminMiddleware,
  verifyToken,
};
