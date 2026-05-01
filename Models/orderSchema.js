import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ===== RELATIONSHIPS =====
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===== STRIPE =====
    sellerStripeAccountId: {
      type: String,
      required: true,
    },

    paymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },

    // ===== ORDER DETAILS =====
    packageName: String,
    packagePrice: Number,
    serviceFee: Number,
    totalAmount: Number,
    deliveryTime: Number,

    // ===== PLATFORM SPLIT =====
    platformFee: Number,
    sellerEarning: Number,

    // ===== STATUS =====
    status: {
      type: String,
      enum: [
        "paid", // created after payment
        "active",
        "delivered",
        "completed",
        "cancelled",
        "refunded",
      ],
      default: "paid",
    },

    // ===== TRANSFER =====
    transferId: String,
    transferStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    // ===== TIMELINES =====
    deliveredAt: Date,
    completedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
