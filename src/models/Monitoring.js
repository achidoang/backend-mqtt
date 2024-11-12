// src/models/Monitoring.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Monitoring = sequelize.define("Monitoring", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  watertemp: DataTypes.FLOAT,
  waterppm: DataTypes.FLOAT,
  waterph: DataTypes.FLOAT,
  airtemp: DataTypes.FLOAT,
  airhum: DataTypes.FLOAT,
  device: DataTypes.INTEGER,
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Monitoring;
