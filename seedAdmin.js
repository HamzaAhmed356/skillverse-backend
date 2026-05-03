import mongoose from "mongoose";
import Admin from "./Models/Admin/adminSchema.js";

const MONGO_URI =
  "mongodb+srv://hamza:xFtIs8fWpYhrt5RM@freelancer.lni7ak9.mongodb.net/?appName=Freelancer"; // change if needed

const createAdmin = async () => {
  try {
    // ✅ CONNECT FIRST
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    const existing = await Admin.findOne();

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await Admin.create({
      email: "admin@gmail.com",
      password: "admin123",
    });

    console.log("Admin created:", admin.email);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
