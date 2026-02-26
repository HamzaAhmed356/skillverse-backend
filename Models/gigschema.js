import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deliveryTime: {
    type: Number,
    required: true,
  },
  revisions: {
    type: Number,
    default: 0,
  },
});

const gigSchema = new mongoose.Schema(
  {
    // ===== CREATOR =====
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👇 ADD THIS
    creatorProfilePic: {
      type: String,
      default: "",
    },

    creatorName: {
      type: String,
      default: "",
    },

    // ===== BASIC INFO =====
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
      default: "",
    },

    // ===== PRICING PACKAGES =====
    packages: {
      basic: {
        type: packageSchema,
        required: true,
      },
      standard: {
        type: packageSchema,
      },
      premium: {
        type: packageSchema,
      },
    },

    images: [String],
    tags: [String],

    isActive: {
      type: Boolean,
      default: true,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;
