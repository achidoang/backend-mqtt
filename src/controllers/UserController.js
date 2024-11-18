// src/controllers/UserController.js
const User = require("../models/User");

// Mendapatkan semua user atau data user sendiri
const getUsers = async (req, res) => {
  try {
    let users;

    if (req.user.role === "admin") {
      // Jika admin, ambil semua user
      users = await User.findAll();
    } else {
      // Jika bukan admin, hanya ambil data diri sendiri
      users = await User.findAll({
        where: { id: req.user.id },
      });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan user berdasarkan ID (hanya untuk user itu sendiri atau admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengupdate user berdasarkan ID (hanya untuk admin)
const bcrypt = require("bcryptjs");

const updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const [updated] = await User.update(updates, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const updatedUser = await User.findByPk(req.params.id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus user
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
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
  getUsers,
};
