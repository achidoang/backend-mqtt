// src/controllers/GuideController.js
const Guide = require("../models/Guide");

class GuideController {
  // Mendapatkan semua panduan atau mencari berdasarkan title
  static async getGuides(req, res) {
    try {
      const { title } = req.query;
      const condition = title ? { title: { [Op.like]: `%${title}%` } } : {};
      const guides = await Guide.findAll({ where: condition });
      res.status(200).json(guides);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching guides", error: error.message });
    }
  }

  // Menambahkan panduan baru
  static async createGuide(req, res) {
    try {
      const { title, description, tools, steps } = req.body;
      const guide = await Guide.create({ title, description, tools, steps });
      res.status(201).json({ message: "Guide created", guide });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating guide", error: error.message });
    }
  }

  // Menghapus panduan berdasarkan ID
  static async deleteGuide(req, res) {
    try {
      const { id } = req.params;
      const guide = await Guide.findByPk(id);
      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }
      await guide.destroy();
      res.status(200).json({ message: "Guide deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting guide", error: error.message });
    }
  }
}

module.exports = GuideController;
