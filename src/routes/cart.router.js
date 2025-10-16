import express from "express";
import {
  addToCart,
  getCart,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.delete("/remove", removeCartItem);
router.delete("/clear", clearCart);

export default router;
