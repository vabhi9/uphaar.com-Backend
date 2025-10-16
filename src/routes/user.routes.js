import express from "express";
const router = express.Router();
import { body } from "express-validator";
import authUser from "../middleware/auth.middleware.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  registerQuery,
} from "../controllers/user.controller.js";

router.post(
  "/register",
  [
    //Validating Email
    body("email").isEmail().withMessage("Invalid Email"),
    //Validating First Name
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First Name must be atleast 3 Characters"),
    //Validating Password
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be of atleast 6 Characters"),
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    // body("password").isLength({ min: 6 }).withMessage("Password is Required"),
    body("password").isLength({ min: 6 }).withMessage("Password is Required"),
  ],
  loginUser
);

router.get("/profile", authUser, getUserProfile);
router.get("/logout", authUser, logoutUser);
router.post(
  "/query",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    // body("email").isMobilePhone().withMessage("Invalid Email")
  ],
  registerQuery
);
export default router;
