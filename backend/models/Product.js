import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    images: { 
        type: [String], 
        required: true, 
        validate: {
          validator: (v) => v.length >= 6,
          message: "En az 6 resim yuklenmelidir",
        },
     },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
