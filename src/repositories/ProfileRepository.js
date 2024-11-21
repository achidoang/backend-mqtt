const Profile = require("../models/Profile");

class ProfileRepository {
  // Get all profiles
  static async getAllProfiles() {
    return await Profile.findAll();
  }

  // Get profile by ID
  static async getProfileById(id) {
    return await Profile.findByPk(id);
  }

  // Create a new profile
  static async createProfile(data) {
    const { watertemp, waterppm, waterph, profile } = data;
    return await Profile.create({ watertemp, waterppm, waterph, profile });
  }

  // Update a profile by ID
  static async updateProfile(id, data) {
    const profile = await Profile.findByPk(id);
    if (profile) {
      return await profile.update(data);
    }
    return null;
  }

  // Delete a profile by ID
  static async deleteProfile(id) {
    const profile = await Profile.findByPk(id);
    if (profile) {
      await profile.destroy();
      return true;
    }
    return false;
  }

  // Deactivate all profiles (set status to 0)
  static async deactivateAllProfiles() {
    return await Profile.update({ status: 0 }, { where: {} });
  }
}

module.exports = ProfileRepository;
