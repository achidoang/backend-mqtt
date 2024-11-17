// src/models/Guide.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Guide = sequelize.define(
  "Guide",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON, // Ubah ke tipe JSON agar bisa menyimpan objek
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON, // Tetap sebagai JSON untuk array URL gambar
      allowNull: true,
    },
  },
  {
    tableName: "guides",
    timestamps: false, // Tidak perlu createdAt dan updatedAt
  }
);

module.exports = Guide;
