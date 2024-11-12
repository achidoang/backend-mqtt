// src/routes/authRoutes.js
const express = require("express");
const AuthController = require("../controllers/AuthController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post(
  "/add-account",
  authMiddleware,
  adminMiddleware,
  AuthController.addAccount
);

module.exports = router;
