// src/routes/guideRoutes.js
const express = require("express");
const GuideController = require("../controllers/GuideController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Endpoint untuk mendapatkan panduan hidroponik
router.get("/hidroponik", verifyToken, GuideController.getGuide);

// Endpoint untuk menambahkan panduan baru
router.post("/add", verifyToken, GuideController.createGuide);
module.exports = router;
