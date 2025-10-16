import { Cart } from "../models/cart.model.js";

// 🧩 Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// 🧾 Get user's cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    console.log("cart: ", cart);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 🗑️ Remove a specific product from cart
export const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body; // get both from request body
    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // remove the item
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: "Item removed", items: cart.items });
  } catch (error) {
    console.error("Error removing item:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


// 🧹 Clear entire cart
// controllers/cart.controller.js
// controllers/cart.controller.js
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body; // get userId from frontend
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully", items: cart.items });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


