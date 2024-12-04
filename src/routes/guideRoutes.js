// src/routes/guideRoutes.js
const express = require("express");
const GuideController = require("../controllers/GuideController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Endpoint untuk mendapatkan semua panduan atau berdasarkan title
router.get("/", verifyToken, GuideController.getGuides);

// Endpoint untuk menambahkan panduan baru
router.post("/add", verifyToken, GuideController.createGuide);

// Endpoint untuk menghapus panduan berdasarkan ID
router.delete("/:id", verifyToken, GuideController.deleteGuide);

module.exports = router;
