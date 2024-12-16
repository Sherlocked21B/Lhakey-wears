import mongoose from "mongoose";
require("./productqa"); // Ensure ProductQA is imported before using it
require("./review");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    price: Number,
    gender: String,
    category: String,
    season: String,
    onSale: String,
    discountPercentage: Number,
    discountLabel: String,
    imageUrl: String,
    sizeImageUrl: String,
    variants: Array,
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("qas", {
  ref: "ProductQA",
  foreignField: "productId",
  localField: "_id",
  justOne: false,
});

ProductSchema.virtual("reviews", {
  ref: "ProductReview",
  foreignField: "product",
  localField: "_id",
  justOne: false,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
