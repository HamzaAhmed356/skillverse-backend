import express from "express";
import {
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Public routes for now (add JWT middleware here later)
router.post("/", createOrder);
router.get("/buyer", getBuyerOrders);
router.get("/seller", getSellerOrders);
router.patch("/:id/status", updateOrderStatus);

export default router;
