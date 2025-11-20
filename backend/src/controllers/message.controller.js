import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId } from "../config/socket.io.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { io } from "../config/socket.io.js";
export async function getUsers(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users: in getUsers Controllers Message", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: receiverId } = req.params;
    const app_user_id = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: app_user_id, receiverId: receiverId },
        { senderId: receiverId, receiverId: app_user_id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getting Messages between you and Receiver:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const app_user_id = req.user._id;

    const newMessage = new Message({
      senderId: app_user_id,
      receiverId,
      text,
      image,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
}

export async function deleteMessage(req, res) {
  try {
    const messageId = req.params.id;
    const app_user_id = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== app_user_id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this message" });
    }

    if (message.image) {
      const publicId = extractCloudinaryPublicId(message.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Message.deleteOne({ _id: messageId });

    const senderSocketId = getReceiverSocketId(app_user_id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageDeleted", messageId);
    }

    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }

    res.status(200).json({ message: "Message and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Failed to delete message" });
  }
}

function extractCloudinaryPublicId(imageUrl) {
  try {
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split(".")[0];
    return publicId;
  } catch {
    return null;
  }
}
