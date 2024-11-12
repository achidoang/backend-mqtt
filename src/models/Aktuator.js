// src/models/Aktuator.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Aktuator = sequelize.define(
  "Aktuator",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    actuator_nutrisi: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    actuator_ph_up: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    actuator_ph_down: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    actuator_air_baku: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    actuator_pompa_utama_1: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    actuator_pompa_utama_2: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "aktuator",
    timestamps: false, // Menonaktifkan createdAt dan updatedAt
  }
);

module.exports = Aktuator;
