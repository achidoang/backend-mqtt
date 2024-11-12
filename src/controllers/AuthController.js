// src/controllers/AuthController.js
const AuthUseCase = require("../usecases/AuthUseCase");

const register = async (req, res) => {
  try {
    const newUser = await AuthUseCase.registerUser(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await AuthUseCase.loginUser(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fungsi tambah akun yang hanya bisa diakses admin
const addAccount = async (req, res) => {
  try {
    const newUser = await AuthUseCase.registerUser(req.body); // Mirip proses registrasi
    res
      .status(201)
      .json({ message: "User added successfully by admin", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  addAccount,
};
