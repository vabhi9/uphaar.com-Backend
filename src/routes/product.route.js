import express from "express";
import {
  getFixedProductsOnFrontPage,
  registerProduct,
  getOtherProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/register/:category", registerProduct);
router.get("/frontProducts", getFixedProductsOnFrontPage);
router.get("/other-products", getOtherProducts);

export default router;
