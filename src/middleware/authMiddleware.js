// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware untuk autentikasi
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    console.log("Token tidak ditemukan");
    return res.status(401).json({ message: "Autentikasi diperlukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Pastikan req.user berisi id dan role
    console.log("Token valid, user:", req.user);
    next();
  } catch (error) {
    console.log("Token tidak valid");
    res.status(403).json({ message: "Token tidak valid" });
  }
};

// Middleware untuk cek role admin
const adminMiddleware = async (req, res, next) => {
  try {
    // Pastikan data user dari req.user benar-benar ada
    if (req.user && req.user.role === "admin") {
      console.log("Akses diberikan, user adalah admin");
      next();
    } else {
      console.log("Akses ditolak, user bukan admin");
      res.status(403).json({ message: "Akses ditolak, user bukan admin" });
    }
  } catch (error) {
    console.log("Kesalahan saat memeriksa role user");
    res.status(500).json({ message: "Kesalahan server" });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
