// src/controllers/GuideController.js
const Guide = require("../models/Guide");

// Fungsi untuk menambahkan panduan baru
const createGuide = async (req, res) => {
  try {
    const { title, content, images } = req.body;

    // Validasi data
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Simpan panduan baru ke database
    const newGuide = await Guide.create({
      title,
      content,
      images,
    });

    res.status(201).json({
      message: "Guide created successfully",
      guide: newGuide,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating guide", error });
  }
};

// Fungsi untuk mendapatkan panduan berdasarkan query atau semua panduan
const getGuides = async (req, res) => {
  try {
    const { title } = req.query;

    // Jika ada query title, cari berdasarkan title
    const guides = title
      ? await Guide.findAll({ where: { title } })
      : await Guide.findAll();

    if (guides.length === 0) {
      return res.status(404).json({ message: "No guides found" });
    }

    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving guides", error });
  }
};

// Fungsi untuk menghapus panduan berdasarkan ID
const deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;

    const guide = await Guide.findByPk(id);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    await guide.destroy();
    res.status(200).json({ message: "Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting guide", error });
  }
};

module.exports = {
  createGuide,
  getGuides,
  deleteGuide,
};
