// src/config/database.js
const sequelize = require("./sequelize");

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQL database");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
