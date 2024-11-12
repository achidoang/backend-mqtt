// src/routes/userRoutes.js
const express = require("express");
const UserController = require("../controllers/UserController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Mendapatkan semua user (hanya untuk admin)
router.get("/", authMiddleware, adminMiddleware, UserController.getAllUsers);

// Mendapatkan user berdasarkan ID
router.get("/:id", authMiddleware, UserController.getUserById);

// Mengupdate user berdasarkan ID (hanya untuk admin)
router.put("/:id", authMiddleware, adminMiddleware, UserController.updateUser);

// Menghapus user berdasarkan ID (hanya untuk admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  UserController.deleteUser
);

module.exports = router;
