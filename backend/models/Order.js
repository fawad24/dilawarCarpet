import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    shippingInfo: {
      name: String,
      address: String,
      phone: String,
      email: String,
    },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    total: Number,
    paymentMethod: { type: String, enum: ["iban", "kapida"] },
    paid: { type: Boolean, default: false },
    paymentStatus: { type: String, default: "bekliyor" },

    deliveryStatus: {
      type: String,
      enum: ["hazirlaniyor", "kargoda", "teslim_edildi"],
      default: "hazirlaniyor"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
