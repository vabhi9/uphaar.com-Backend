import mongoose, { Schema } from "mongoose";

const querySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: [3, "Full Name must be of length 3"],
    },

    mobileNumber: {
      type: String,
      required: true,
      minlength: [5],
    },
    email: {
      type: String,
      required: true,
      minlength: [5],
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Query = mongoose.model("Query", querySchema);
