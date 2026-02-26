import express from "express";
const router = express.Router();
import User from "../Models/userschema.js";

router.post("/signup/step1", async (req, res) => {
  try {
    const { fullName, email, dob } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and Email are required",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.isProfileCompleted) {
        return res.status(200).json({
          success: true,
          message: "User exists but profile incomplete",
          userId: user._id,
        });
      }

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = new User({ fullName, email, dob });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User created",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// STEP 2: Complete profile
// STEP 2: Complete profile
router.post("/signup/complete", async (req, res) => {
  try {
    const {
      email,
      username,
      dob,
      country,
      city,
      niche,
      software,
      customSoftware,
      password,
      role, // Add role here if you're sending it from frontend
    } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Use findOneAndUpdate to bypass 'required' checks on fields not provided in this step
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          username,
          dob,
          country,
          city,
          niche,
          password,
          softwareTools: software || [], // Matching your schema name 'softwareTools'
          isProfileCompleted: true,
          // Ensure role is one of: "client", "freelancer", "both"
          role: ["client", "freelancer", "both"].includes(role)
            ? role
            : "client",
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found " });

    console.log("Profile completed for:", updatedUser.email);
    res.status(200).json({
      message: "Profile completed successfully",
      _id: updatedUser._id,
      flag: true,
    });
  } catch (err) {
    console.error("Signup Complete Error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
      flag: false,
      _id: null,
    });
  }
});

export default router;
