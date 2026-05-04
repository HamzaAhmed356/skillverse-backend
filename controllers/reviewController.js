import Review from "../Models/reviewModel.js";
import Order from "../Models/orderSchema.js";
import Gig from "../Models/gigschema.js"; // ✅ add this

export const createReview = async (req, res) => {
  try {
    const { gigId, rating, comment, userId } = req.body;

    // ✅ Get gig to check owner
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // ❗ BLOCK OWNER
    if (gig.creator.toString() === userId) {
      return res.status(403).json({
        message: "You cannot review your own gig",
      });
    }

    // ❗ Prevent duplicate review
    const existing = await Review.findOne({
      gigId,
      reviewerId: userId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already reviewed this gig",
      });
    }

    // ✅ Create review
    const review = await Review.create({
      gigId,
      reviewerId: userId,
      sellerId: gig.creator, // ✅ correct now
      rating,
      comment,
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ✅ GET REVIEWS BY GIG
export const getReviewsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const reviews = await Review.find({ gigId })
      .populate("reviewerId", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
