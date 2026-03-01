import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ===== AUTH INFO =====
    googleId: {
      type: String,
      default: null,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // password added (optional for google users)
    password: {
      type: String,
      default: null,
      minlength: 6,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    // ===== PERSONAL INFO =====
    dob: Date,

    country: String,

    city: String,

    profilePic: {
      type: String,
      default: "",
    },

    headline: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },

    // ===== PROFESSIONAL INFO =====
    role: {
      type: String,
      enum: ["client", "freelancer", "both"],
      default: "client",
    },

    niche: [String],

    softwareTools: [String],

    skills: [String],

    // ===== SYSTEM =====
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// 🔐 AUTO HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 PASSWORD CHECK METHOD (for login)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
