const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Profile = sequelize.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    watertemp: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    waterppm: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    waterph: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "profile", // Pastikan nama tabel sesuai dengan tabel di database
    timestamps: false, // Jika tabel tidak menggunakan kolom createdAt/updatedAt
  }
);

module.exports = Profile;
