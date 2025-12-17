const { uploadToCloudinary } = require("../helpers/cloudinary");
const Image = require("../models/image");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    console.log("req.body", req.body);

    // check the file
    if (!req.file) {
      res.status(400).json({
        message: "the file is required",
      });
    }
    console.log("file", req.file);

    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    const newImage = await Image.create({
      url,
      publicId,
      uploadedBy: req.user.userId,
    });

    // fs.unlinkSync(req.file.path);
    res.status(201).json({
      message: "The image created successfylly",
      image: newImage,
    });
  } catch (error) {
    console.log("error from uploding Image controller", error);
  }
};

// fetch all images
const getImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortOBJ = {};
    sortOBJ[sortBy] = sortOrder;
    const images = await Image.find().sort(sortOBJ).skip(skip).limit(limit);
    res.status(200).json({
      message: "The images fetched successfylly",
      currentPage: page,
      totalPages: totalPages,
      totalImages: totalImages,
      data: images,
    });
  } catch (error) {
    console.log("error from getImages Image controller", error);
  }
};

// delete Images

const deleteImageById = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    // get image from DB by id
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({
        message: "the Image not exist in DB",
      });
    }

    // check if the user who upload the image or not
    const isSameUser = image.uploadedBy.toString() === userId;
    if (!isSameUser) {
      return res.status(403).json({
        message: "you're not the same user who upload the image",
      });
    }

    // delete it from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    // delete from DB

    await Image.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "The image deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  uploadImage,
  getImages,
  deleteImageById,
};
