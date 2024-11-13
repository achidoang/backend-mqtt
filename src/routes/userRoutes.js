// src/routes/userRoutes.js
const express = require("express");
const UserController = require("../controllers/UserController");
const {
  adminMiddleware,
  verifyToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Mendapatkan semua user (hanya untuk admin)
router.get("/", verifyToken, adminMiddleware, UserController.getAllUsers);

// Mendapatkan user berdasarkan ID
router.get("/:id", verifyToken, UserController.getUserById);

// Mengupdate user berdasarkan ID (hanya untuk admin)
router.put("/:id", verifyToken, adminMiddleware, UserController.updateUser);

// Menghapus user berdasarkan ID (hanya untuk admin)
router.delete("/:id", adminMiddleware, verifyToken, UserController.deleteUser);

module.exports = router;
