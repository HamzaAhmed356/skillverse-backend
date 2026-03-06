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

    // ===== ORDER DETAILS (Snapshotted from Frontend) =====
    packageName: {
      type: String, // e.g., "Basic", "Standard", "Premium"
      required: true,
    },
    packagePrice: {
      type: Number,
      required: true,
    },
    serviceFee: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryTime: {
      type: Number, // In days
      required: true,
    },

    // ===== STATUS TRACKING =====
    status: {
      type: String,
      enum: [
        "pending",
        "active",
        "delivered",
        "completed",
        "cancelled",
        "refunded",
        "new",
      ],
      default: "pending",
    },

    // ===== PAYMENT INFO =====
    paymentIntentId: {
      type: String, // Useful if using Stripe/PayPal to track the transaction
      unique: true,
      sparse: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },

    // ===== MILESTONES =====
    deliveredAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
