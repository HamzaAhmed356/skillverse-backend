import express from "express";
import {
  createReview,
  getReviewsByGig,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/:gigId", getReviewsByGig);

export default router;
