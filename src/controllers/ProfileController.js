const ProfileRepository = require("../repositories/ProfileRepository");
const mqttService = require("../services/mqttService"); // Ganti dengan path yang benar

class ProfileController {
  static async getAllProfiles(req, res) {
    try {
      const profiles = await ProfileRepository.getAllProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfileById(req, res) {
    try {
      const { id } = req.params;
      const profile = await ProfileRepository.getProfileById(id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProfile(req, res) {
    try {
      const newProfile = await ProfileRepository.createProfile(req.body);
      res.status(201).json(newProfile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const updatedProfile = await ProfileRepository.updateProfile(
        id,
        req.body
      );
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteProfile(req, res) {
    try {
      const { id } = req.params;
      const isDeleted = await ProfileRepository.deleteProfile(id);
      if (!isDeleted) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async activateProfile(req, res) {
    const { id } = req.params;

    try {
      // Nonaktifkan semua profil
      await ProfileRepository.deactivateAllProfiles();

      // Aktifkan profil berdasarkan ID
      const updatedProfile = await ProfileRepository.updateProfile(id, {
        status: 1,
      });

      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Buat payload untuk MQTT
      const mqttPayload = {
        watertemp: updatedProfile.watertemp,
        waterppm: updatedProfile.waterppm,
        waterph: updatedProfile.waterph,
        profile: updatedProfile.profile,
        status: updatedProfile.status,
      };

      // Publish pesan ke topik MQTT
      mqttService.publishToTopic(
        "herbalawu/setpoint",
        JSON.stringify(mqttPayload)
      );

      // Kirim respon sukses
      return res.status(200).json({
        message: "Profile activated and MQTT message published successfully",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error activating profile:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = ProfileController;
