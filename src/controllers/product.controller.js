import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const registerProduct = asyncHandler(async (req, res) => {
  const { category } = req.params;

  let products = await Product.find({ category });

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }
  console.log("Fetched Products: ", products);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products Fetched Successfully"));
});

const getFixedProductsOnFrontPage = async (req, res) => {
  try {
    // Fetch first 8 products sorted by _id (or any field)
    const fixedProducts = await Product.find()
      .sort({ _id: 1 }) // sort ascending by _id
      .limit(8);

    res.status(200).json({
      success: true,
      data: fixedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get other products from same category
const getOtherProducts = async (req, res) => {
  try {
    const { category, excludeId } = req.query; // pass category & current product ID

    if (!category || !excludeId) {
      return res.status(400).json({ message: "Category and excludeId are required" });
    }

    const products = await Product.find({
      category,
      _id: { $ne: excludeId } // exclude the current product
    }).limit(10); // limit to 10 products (optional)

    res.status(200).json(products);
  } catch (error) {
    console.error("Get other products error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export { registerProduct, getFixedProductsOnFrontPage, getOtherProducts };
