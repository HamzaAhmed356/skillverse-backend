import express from "express";
import { loginAdmin } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  getAdminDashboard,
  getAllUsers,
} from "../controllers/adminController.js";
const router = express.Router();
//admin login route
router.post("/login", loginAdmin);
//protected admin route
router.get("/dashboard", adminAuth, getAdminDashboard);
router.get("/users", adminAuth, getAllUsers);

export default router;
