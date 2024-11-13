// src/routes/authRoutes.js
const express = require("express");
const AuthController = require("../controllers/AuthController");
const {
  adminMiddleware,
  verifyToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post(
  "/add-account",
  adminMiddleware,
  verifyToken,
  AuthController.addAccount
);

module.exports = router;
