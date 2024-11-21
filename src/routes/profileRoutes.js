const express = require("express");
const ProfileController = require("../controllers/ProfileController");
const {
  adminMiddleware,
  verifyToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, ProfileController.getAllProfiles);
router.get("/:id", verifyToken, ProfileController.getProfileById);
router.post("/", verifyToken, ProfileController.createProfile);
router.put("/:id", verifyToken, ProfileController.updateProfile);
router.delete("/:id", verifyToken, ProfileController.deleteProfile);

// Route untuk mengaktifkan profile tertentu
router.put("/:id/activate", verifyToken, ProfileController.activateProfile);

module.exports = router;
