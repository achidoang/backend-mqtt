// src/models/Location.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Location = sequelize.define(
  "Location",
  {
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
  },
  {
    tableName: "locations",
    timestamps: false, // Mematikan timestamps
  }
);

module.exports = Location;
