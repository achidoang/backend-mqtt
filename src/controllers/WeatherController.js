const axios = require("axios");
const { getLocation } = require("../repositories/LocationRepository");

const fetchWeather = async (req, res) => {
  try {
    // Ambil koordinat dari query atau fallback ke database
    const lat = req.query.lat;
    const lon = req.query.lon;

    let latitude = lat;
    let longitude = lon;

    if (!lat || !lon) {
      const location = await getLocation();
      if (!location) {
        return res.status(404).json({
          success: false,
          message: "No coordinates provided, and no location is locked.",
        });
      }
      latitude = location.latitude;
      longitude = location.longitude;
    }

    // Panggil API OpenWeather
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);

    // Kirim data cuaca ke klien
    return res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error fetching weather data:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weather data.",
    });
  }
};

module.exports = { fetchWeather };
