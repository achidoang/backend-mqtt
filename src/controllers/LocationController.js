// src/controllers/LocationController.js

const {
  getLocation,
  updateLocation,
} = require("../repositories/LocationRepository");

const fetchLocation = async (req, res) => {
  try {
    const location = await getLocation();
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude are required" });
    }
    const updatedLocation = await updateLocation(latitude, longitude);
    res.json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fetchLocation, saveLocation };
