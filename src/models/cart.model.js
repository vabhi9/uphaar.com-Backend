import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: false,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: {
          type: Number,
        },
        // quantity: {
        //   type: Number,
        //   default: 1,
        // },
      },
    ],
    // totalPrice: Number,
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
