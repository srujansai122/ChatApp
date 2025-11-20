import express from "express";
import {
  getUsers,
  getMessages,
  sendMessage,
  deleteMessage,
} from "../controllers/message.controller.js";
import protectedRoute from "../middleware/auth.protectedRoute.js";

const router = express.Router();

router.get("/users/", protectedRoute, getUsers);
router.get("/:id", protectedRoute, getMessages);

router.post("/send/:id", protectedRoute, sendMessage);

router.delete("/:id", protectedRoute, deleteMessage);

export default router;
