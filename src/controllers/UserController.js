// src/controllers/UserController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Mendapatkan semua user (hanya admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan user berdasarkan ID (hanya untuk user itu sendiri atau admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // Cek apakah user ada
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Cek akses: jika role user, hanya boleh akses data sendiri
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengupdate user berdasarkan ID (hanya untuk admin)
const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    // Jika password disertakan dalam update, hash password terlebih dahulu
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json({ message: "User berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
