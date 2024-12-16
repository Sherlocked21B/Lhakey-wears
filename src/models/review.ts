import mongoose from "mongoose";

const ProductReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: Number,
    comment: String,
    imageGallery: [{ type: String }],
  },
  { timestamps: true }
);

const ProductReview =
  mongoose.models.ProductReview ||
  mongoose.model("ProductReview", ProductReviewSchema);
export default ProductReview;
