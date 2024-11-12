// src/models/Setpoint.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Setpoint = sequelize.define(
  "Setpoint",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    watertemp: DataTypes.FLOAT,
    waterppm: DataTypes.FLOAT,
    waterph: DataTypes.FLOAT,
    profile: DataTypes.STRING,
    status: DataTypes.TINYINT,
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "setpoint",
    timestamps: false, // Menonaktifkan createdAt dan updatedAt
  }
);

module.exports = Setpoint;
