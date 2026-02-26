import express from "express";
import User from "../Models/userschema.js";

const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    // Find User by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Simple password check (plaintext for now; later hash in production)
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect password" });
    }

    res.json({ success: true, message: "Login successful", data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
export default router;
