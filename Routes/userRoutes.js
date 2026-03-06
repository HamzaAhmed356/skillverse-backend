import express from "express";
import User from "../Models/userschema.js";
import cloudinary from "../Config/cloudinary.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// 🔹 GET USER BY ID (only required fields)
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    //const gigs = await Gig.find({ creator: req.params.id });

    res.status(200).json({
      user,
      //gigs,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});
//for edit page on frontend
router.put("/user/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        fullName: req.body.fullName,
        email: req.body.email,
        profilePic: req.body.profilePic,
        headline: req.body.headline,
        role: req.body.role,
        skills: Array.isArray(req.body.skills)
          ? req.body.skills
          : req.body.skills
            ? req.body.skills.split(",").map((s) => s.trim())
            : [],
      },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/upload-profile-image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "profile",
      });

      res.status(200).json({
        url: result.secure_url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Image upload failed" });
    }
  },
);

export default router;
