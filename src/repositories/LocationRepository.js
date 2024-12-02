const Location = require("../models/Location");

const getLocation = async () => {
  return await Location.findOne();
};

const updateLocation = async (latitude, longitude) => {
  const location = await getLocation();
  if (location) {
    // Jika lokasi sudah ada, lakukan update
    return await location.update({ latitude, longitude });
  } else {
    // Jika belum ada, buat entri baru
    return await Location.create({ latitude, longitude });
  }
};

module.exports = { getLocation, updateLocation };
