// src/config/sequelize.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nama database
  process.env.DB_USER, // Username database
  process.env.DB_PASS, // Password database
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log, // Log semua query
    timezone: "+07:00",
  }
);

module.exports = sequelize;
