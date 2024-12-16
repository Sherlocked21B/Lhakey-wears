import mongoose, { Schema } from "mongoose";

// Define the nested schema for the sizes
const sizeSchema = new Schema(
  {
    sizeName: String, // Example field for size details, adjust according to actual data structure
    sizeStock: Number, // Example field for size stock, adjust according to actual data structure
  },
  { _id: false }
);

// Define the nested schema for the variant
const variantSchema = new Schema(
  {
    color: { type: String, required: true },
    sizes: [sizeSchema], // Array of sizeSchema objects
    imageGallery: [{ type: String, required: true }], // Array of image URLs
  },
  { _id: false }
);

// Define the main schema
const cartSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, required: true, ref: "User" }, // Assuming ObjectId for MongoDB reference
    productID: { type: Schema.Types.ObjectId, required: true, ref: "Product" }, // Assuming ObjectId for MongoDB reference
    quantity: { type: Number, required: true },
    variant: { type: variantSchema, required: true },
    size: { type: String, required: true },
    selected: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
