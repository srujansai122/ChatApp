import express from "express";
import {
  Login,
  Signup,
  Logout,
  updateProfile,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import protectedRoute from "../middleware/auth.protectedRoute.js";
const router = express.Router();

router.post("/login", Login);
router.post("/signup", Signup);
router.post("/logout", Logout);

router.put("/update-profile", protectedRoute, updateProfile);

router.get("/check", protectedRoute, getCurrentUser);
export default router;
