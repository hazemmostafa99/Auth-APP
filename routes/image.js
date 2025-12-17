const express = require("express");
const authMiddleware = require("../middleware/auth");
const isAdminUser = require("../middleware/admin");
const uploadMiddleware = require("../middleware/upload");
const {
  uploadImage,
  getImages,
  deleteImageById,
} = require("../controllers/image");

const router = express.Router();

// upload image
router.post(
  "/upload",
  authMiddleware,
  isAdminUser,
  uploadMiddleware.single("image"),
  uploadImage
);

// fetch images
router.get("/", authMiddleware, getImages);
router.delete("/:id", authMiddleware, isAdminUser, deleteImageById);

module.exports = router;
