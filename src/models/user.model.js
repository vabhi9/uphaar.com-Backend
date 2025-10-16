import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First Name must be of length 3"],
    },
    lastName: {
      type: String,
      minlength: [3, "First Name must be of length 3"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    console.log(err);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  console.log(
    "Password is",
    password,
    "&&",
    "this.password is",
    this.password,
    "isMatch :",
    isMatch
  );
  return isMatch;
};

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

export const User = mongoose.model("User", userSchema);
