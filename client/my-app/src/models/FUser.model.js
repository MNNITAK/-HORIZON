import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,"name is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Use index for searchable fields
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshtoken: {
      type: String, // Token for refresh authentication
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const FUserModel = mongoose.model("User", userSchema);

export default FUserModel;