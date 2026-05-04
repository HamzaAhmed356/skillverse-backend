import Admin from "../Models/Admin/adminSchema.js";
import jwt from "jsonwebtoken";

import User from "../Models/userschema.js";
import Order from "../Models/orderSchema.js";
//get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpires")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    // ===== USERS =====
    const totalUsers = await User.countDocuments();

    const freelancers = await User.countDocuments({
      role: { $in: ["freelancer", "both"] },
    });

    // ===== ORDERS =====
    const totalOrders = await Order.countDocuments();

    // ===== REVENUE (PLATFORM EARNINGS) =====
    const revenueResult = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$platformFee" },
        },
      },
    ]);

    const revenue = revenueResult[0]?.totalRevenue || 0;

    // ===== ACTIVE ORDERS (optional but useful) =====
    const activeOrders = await Order.countDocuments({
      status: "active",
    });

    res.json({
      totalUsers,
      freelancers,
      totalOrders,
      activeOrders,
      revenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// admin login section

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===============================
// BAN / UNBAN USER
// ===============================
export const toggleBanUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
      success: true,
      message: user.isBanned ? "User banned" : "User unbanned",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
