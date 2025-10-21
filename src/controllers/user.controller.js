import { User } from "../models/user.model.js";
import { Query } from "../models/query.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";
import { BlackListToken } from "../models/blackListToken.model.js";
import nodemailer from "nodemailer";
import { response } from "express";

const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  const user = await createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password,
  });

  const token = user.generateAuthToken();
  res.status(201).json({ token, user });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      message: "It seems like you are Trying to Login without Register 🥱",
    });
  }

  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  const token = user.generateAuthToken();
  console.log("Generated Token", token);
  // res.cookie("token", token);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true only in production
    sameSite: "lax",
  });
  console.log("Cookie set to client Successfully");
  res.status(200).json({ message: "Cookie Set!", token, user });
};

const getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

const logoutUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];
  res.clearCookie("token", token);
  res.status(200).json({ message: "Logged Out" });
};

const registerQuery = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, mobileNumber, email, message } = req.body;
    console.log("Received Body:", req.body);
    const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "It Seems Like You are Not Registered yet! soo Register First.",
    //   });
    // }
    const newQuery = await Query.create({
      fullName,
      mobileNumber,
      email,
      message,
    });

    const auth = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Sender's Email or Admin's Email Address
        pass: process.env.EMAIL_PASS,
      },
    });

    const receiver = {
      from: "abhinavverma2809@gmail.com",
      to: email,
      subject: "Node.JS Modemailer Testing",
      text: `Hey ${fullName}, Thanks for Contact Us, Your Query is registered with us & Our Team will Contact You Shortly!`,
    };

    auth.sendMail(receiver, (err, emailResponse) => {
      if (err) {
        console.log("An Error arrived", err);
      }
      console.log("success!", emailResponse);
      response.end();
    });

    res.status(201).json({
      success: true,
      message: "Query Submitted Successfully!",
      data: newQuery,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { registerUser, loginUser, getUserProfile, logoutUser, registerQuery };
