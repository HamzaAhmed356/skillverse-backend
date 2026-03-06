import Order from "../Models/orderSchema.js";
import Gig from "../Models/gigschema.js";

export const createOrder = async (req, res) => {
  try {
    const { gigId, buyerId, package: packageNameFromFrontend } = req.body;

    // 1. Fetch the Gig to get pricing and seller details
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig not found" });
    }

    // 2. Extract the correct package data (case-insensitive check)
    const selectedPackageKey = packageNameFromFrontend.toLowerCase(); // "basic", "standard", or "premium"
    const packageData = gig.packages[selectedPackageKey];

    if (!packageData) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid package selected" });
    }

    // 3. Calculate Fees
    const packagePrice = packageData.price;
    // Service fee: 0.01% (Note: 0.01% is 0.0001 as a decimal. If you meant 1%, use 0.01)
    const serviceFee = Number((packagePrice * 0.0001).toFixed(2));
    const totalAmount = packagePrice + serviceFee;

    // 4. Create the Order
    const newOrder = new Order({
      gigId,
      buyerId,
      sellerId: gig.creator,
      packageName: packageNameFromFrontend, // "Basic", "Standard", etc.
      packagePrice,
      serviceFee,
      totalAmount,
      deliveryTime: packageData.deliveryTime,
      paymentIntentId: `MOCK_PI_${Date.now()}`, // Placeholder until Stripe integration
      paymentStatus: "paid",
      status: "active",
    });

    const savedOrder = await newOrder.save();

    // 5. Update Gig stats (Increment total orders)
    await Gig.findByIdAndUpdate(gigId, { $inc: { totalOrders: 1 } });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getBuyerOrders = async (req, res) => {
  try {
    // For now, we expect buyerId in query: /api/orders/buyer?buyerId=123
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

export const getSellerOrders = async (req, res) => {
  try {
    // For now, we expect sellerId in query: /api/orders/seller?sellerId=456
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
