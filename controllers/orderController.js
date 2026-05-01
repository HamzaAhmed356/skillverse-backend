import Order from "../Models/orderSchema.js";
import Gig from "../Models/gigschema.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import User from "../Models/userSchema.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * 1. CREATE STRIPE CHECKOUT SESSION
 * This starts the payment process and returns a Stripe URL to the frontend.
 */
export const createOrder = async (req, res) => {
  try {
    const { gigId, buyerId, package: packageName, image } = req.body;

    // Fetch the Gig to get pricing and seller details
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    // Extract the correct package data
    const selectedPackageKey = packageName.toLowerCase();
    const packageData = gig.packages[selectedPackageKey];

    if (!packageData) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid package selected" });
    }

    // Calculate Totals (Stripe requires amounts in CENTS)
    const packagePrice = packageData.price;
    const serviceFee = Number((packagePrice * 0.01).toFixed(2)); // 1% fee
    const totalAmount = packagePrice + serviceFee;
    const unitAmountInCents = Math.round(totalAmount * 100);

    // Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${gig.title} (${packageName} Package)`,
              images: [image || (gig.images && gig.images[0])],
            },
            unit_amount: unitAmountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Metadata allows us to keep track of our data while it's on Stripe's servers
      metadata: {
        gigId: gigId.toString(),
        buyerId: buyerId.toString(),
        sellerId: gig.creator.toString(),
        packageName: packageName,
        packagePrice: packagePrice.toString(),
        serviceFee: serviceFee.toString(),
        totalAmount: totalAmount.toString(),
        deliveryTime: packageData.deliveryTime.toString(),
      },
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    // Send the URL back to frontend for redirection
    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. CONFIRM ORDER & SAVE TO DB
 * This runs after the user returns from Stripe. It verifies payment and creates the DB record.
 */
export const confirmOrder = async (req, res) => {
  try {
    const { session_id } = req.body;

    // 1. Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not verified" });
    }

    // 2. Prevent duplicate processing
    const existingOrder = await Order.findOne({ paymentIntentId: session.id });
    if (existingOrder) {
      return res.status(200).json({ success: true, data: existingOrder });
    }

    // 3. Extract metadata
    const {
      gigId,
      buyerId,
      sellerId,
      packageName,
      packagePrice,
      serviceFee,
      totalAmount,
      deliveryTime,
    } = session.metadata;

    const originalPrice = parseFloat(packagePrice);

    /**
     * 4. CALCULATE SELLER EARNINGS
     * Logic: Deduct 1% Platform Fee from the package price.
     * Example: $100 package -> $1 fee -> $99 to Seller Pending Balance
     */
    const platformFeeDeduction = originalPrice * 0.01;
    const sellerNetEarnings = parseFloat(
      (originalPrice - platformFeeDeduction).toFixed(2),
    );

    // 5. Save the Order to MongoDB
    const newOrder = new Order({
      gigId,
      buyerId,
      sellerId,
      packageName,
      packagePrice: originalPrice,
      serviceFee: parseFloat(serviceFee),
      totalAmount: parseFloat(totalAmount),
      deliveryTime: parseInt(deliveryTime),
      paymentIntentId: session.id,
      paymentStatus: "paid",
      status: "active",
      sellerStripeAccountId: "NOT_APPLICABLE",
    });

    const savedOrder = await newOrder.save();

    // 6. Update Gig Stats (Total Orders)
    await Gig.findByIdAndUpdate(gigId, { $inc: { totalOrders: 1 } });

    /**
     * 7. UPDATE SELLER PENDING BALANCE
     * We add the net amount (Price minus 1% platform fee)
     */
    await User.findByIdAndUpdate(sellerId, {
      $inc: { PendingBalance: sellerNetEarnings },
    });

    // 8. Final Response
    res.status(201).json({
      success: true,
      message: "Order confirmed. Pending balance updated (1% fee deducted).",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Confirmation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * 3. GET BUYER ORDERS
 */
export const getBuyerOrders = async (req, res) => {
  try {
    const { buyerId } = req.query;
    const orders = await Order.find({ buyerId })
      .populate("gigId", "title images")
      .populate("sellerId", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. GET SELLER ORDERS
 */
export const getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.query;
    const orders = await Order.find({ sellerId })
      .populate("gigId", "title images")
      .populate("buyerId", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. UPDATE STATUS
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };

    if (status === "delivered") updateData.deliveredAt = Date.now();
    if (status === "completed") updateData.completedAt = Date.now();

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true },
    );

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
