import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowerCase: true },
    password: { type: String, required: true},
    confirmPassword: { type: String },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 0,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
