import express from "express";
const router = express.Router();
import User from "../Models/userschema.js";
import sendEmail from "../utils/sendEmail.js";
router.post("/signup/step1", async (req, res) => {
  try {
    const { fullName, email, dob } = req.body;

    if (!fullName || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and Email are required" });
    }

    // 1. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    let user = await User.findOne({ email });

    if (user) {
      if (user.isProfileCompleted) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }
      // If profile is incomplete, update the existing record with new OTP
      user.fullName = fullName;
      user.dob = dob;
      user.otp = otp;
      user.otpExpires = otpExpires;
    } else {
      // Create new unverified user
      user = new User({ fullName, email, dob, otp, otpExpires });
    }

    await user.save();

    // 2. Send the OTP Email
    const htmlContent = `
      <div style="font-family: Arial; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1dbf73;">SkillVerse Verification</h2>
        <p>Hi ${fullName},</p>
        <p>Your verification code is: <b style="font-size: 24px;">${otp}</b></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `;

    await sendEmail(email, "Verify your SkillVerse Account", htmlContent);

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
      email: email, // Pass back so frontend can use it
    });
  } catch (err) {
    console.error("Step 1 Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Clear OTP but don't set isProfileCompleted yet (that's Step 2)
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: "OTP Verified" });
  } catch (error) {
    console.log(error.message);
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
