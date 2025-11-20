import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
export async function Signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    if (newUser) {
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      await newUser.save();
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
        },
      });
    } else return res.status(400).json({ message: "Invalid user data" });
  } catch (err) {
    console.error("error in signup controller:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function Login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error("error in login controller:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function Logout(req, res) {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("error in logout controller:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    if (!avatar || !avatar.startsWith("http")) {
      return res.status(400).json({
        success: false,
        message: "Valid Cloudinary image URL is required",
      });
    }

    const user = await User.findById(userId);
    if (user.avatar) {
      const publicId = extractPublicId(user.avatar);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    user.avatar = avatar;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user,
    });
  } catch (err) {
    console.error("Error in updateProfile controller:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
}

function extractPublicId(url) {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split(".")[0];
    return publicId;
  } catch {
    return null;
  }
}

export async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (err) {
    console.error("error in getCurrentUser controller:", err);
    res.status(500).json({ message: "Server error" });
  }
}
