import express from "express";
import Gig from "../Models/gigschema.js";
import User from "../Models/userschema.js";
import upload from "../middleware/upload.js";

import {
  uploadGigImage,
  getAllGigs,
  getGigById,
} from "../controllers/gigController.js";
const router = express.Router();
//for uploading gigs
router.post("/create", async (req, res) => {
  try {
    const { creator, title, description, category, packages, images, tags } =
      req.body;

    // 🔹 Get user info
    const user = await User.findById(creator);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newGig = new Gig({
      creator,
      creatorProfilePic: user.profilePic,
      creatorName: user.fullName,
      title,
      description,
      category,
      packages,
      images,
      tags,
    });

    await newGig.save();

    res.status(201).json(newGig);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// ✅ Get gigs by creator ID
router.get("/user/:userId", async (req, res) => {
  try {
    const gigs = await Gig.find({ creator: req.params.userId });
    console.log(gigs);
    res.status(200).json({ success: true, gigs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post("/upload-image", upload.single("image"), uploadGigImage);
router.get("/get/gigs", getAllGigs);
router.get("/:id", getGigById); //just 1 gig
export default router;
