// src/repositories/UserRepository.js
const User = require("../models/User");

const createUser = async (userData) => {
  const user = await User.create(userData);
  return user;
};

const findUserByUsername = async (username) => {
  return await User.findOne({
    where: { username: username },
  });
};

const findUserByEmail = async (email) => {
  return await User.findOne({
    where: { email: email },
  });
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserByEmail,
};
