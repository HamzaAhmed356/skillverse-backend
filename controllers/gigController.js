import Gig from "../Models/gigschema.js";

import cloudinary from "../Config/cloudinary.js";
//for uploading gig image
export const uploadGigImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "gigs",
    });

    res.status(200).json({
      url: result.secure_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed" });
  }
};

export const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate("creator", "name profilePic") // optional if you store creator ref
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: gigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gigs",
    });
  }
};

export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate(
      "creator",
      "fullName profilePic email",
    );

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gig",
    });
  }
};
