// src/routes/guideRoutes.js
const express = require("express");
const GuideController = require("../controllers/GuideController");

const router = express.Router();

// Endpoint untuk mendapatkan panduan hidroponik
router.get("/hidroponik", GuideController.getGuide);

// Endpoint untuk menambahkan panduan baru
router.post("/hidroponik/add", GuideController.createGuide);

module.exports = router;
