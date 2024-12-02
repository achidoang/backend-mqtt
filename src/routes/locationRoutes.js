// src/routes/locationRoutes.js

const express = require("express");
const {
  fetchLocation,
  saveLocation,
} = require("../controllers/LocationController");
const router = express.Router();

router.get("/", fetchLocation);
router.post("/", saveLocation);

module.exports = router;
