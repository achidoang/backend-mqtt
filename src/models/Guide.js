const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Guide = sequelize.define(
  "Guide",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tools: {
      type: DataTypes.TEXT, // Simpan array sebagai JSON
      get() {
        return JSON.parse(this.getDataValue("tools") || "[]");
      },
      set(value) {
        this.setDataValue("tools", JSON.stringify(value));
      },
    },
    steps: {
      type: DataTypes.TEXT, // Simpan array sebagai JSON
      get() {
        return JSON.parse(this.getDataValue("steps") || "[]");
      },
      set(value) {
        this.setDataValue("steps", JSON.stringify(value));
      },
    },
  },
  {
    tableName: "guides", // Nama tabel di database
    timestamps: false, // Menonaktifkan createdAt dan updatedAt
  }
);

module.exports = Guide;
