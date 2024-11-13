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

const getGuide = async (req, res) => {
  try {
    const guide = await Guide.findOne({
      where: { title: "Panduan Menanam Hidroponik" },
    });

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving guide", error });
  }
};

module.exports = {
  getGuide,
  createGuide,
};
