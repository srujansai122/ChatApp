import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function protectedRoute(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) res.status(401).json({ message: "Unauthorized User no token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded)
    res.status(401).json({ message: "Unauthorized User invalid token" });

  const user = await User.findById(decoded.id).select("-password");
  req.user = user;
  next();
}
export default protectedRoute;
