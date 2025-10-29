import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = await req.cookies.token || await req.headers.authorization?.split(" ")[1];
  console.log("Cookies received in authUser:", req.cookies);
  if (!token) {
    return res.status(401).json({ message: "You're Unauthorized #1" });
  }

  const isBlacklisted = await User.findOne({ token: token });
  if(isBlacklisted){
    return res.status(401).json('Unauthorized Access')
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    req.user = user;
    return next();
  } catch (err) {
    if (!token) {
      return res.status(401).json({ message: "You're Unauthorized #2" });
    }
  }
};

export default authUser;
