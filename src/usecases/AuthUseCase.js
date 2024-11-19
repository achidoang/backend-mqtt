// src/usecases/AuthUseCase.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/UserRepository");
const dotenv = require("dotenv");

dotenv.config();

const registerUser = async (userData) => {
  // Cek apakah username sudah ada
  const existingUserByUsername = await UserRepository.findUserByUsername(
    userData.username
  );
  if (existingUserByUsername) {
    throw new Error("Username already exists");
  }

  // Cek apakah email sudah ada
  const existingUserByEmail = await UserRepository.findUserByEmail(
    userData.email
  );
  if (existingUserByEmail) {
    throw new Error("Email already exists");
  }

  // Hash password sebelum disimpan
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);

  // Buat user baru
  const newUser = await UserRepository.createUser(userData);
  return newUser;
};

const loginUser = async (username, password) => {
  const user = await UserRepository.findUserByUsername(username);
  if (!user) {
    throw new Error("User not found");
  }

  // Cek apakah password cocok
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Buat token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "120h",
    }
  );

  return { token };
};

module.exports = {
  registerUser,
  loginUser,
};
