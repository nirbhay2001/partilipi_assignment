const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const PurchaseHistorySchema = new mongoose.Schema({
  products: [ProductSchema],
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    preferences: {
      type: [String],
      enum: ["promotions", "order_updates", "recommendations"],
      default: ["order_updates"],
    },
    orders: [ProductSchema],
    order_status: {
      type: String,
      enum: ["none", "Placed", "Shipped", "Delivered", "Cancelled"],
      default: "none",
    },
    purchase_history: [PurchaseHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
