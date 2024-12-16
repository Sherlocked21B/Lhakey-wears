// import mongoose from "mongoose";

// const ProductQASchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     question: {
//       type: String,
//       required: true,
//     },
//     questionCreatedAt: { type: Date, required: true },
//     questionUpdatedAt: { type: Date, required: false },
//     answer: String,
//     answerCreatedAt: { type: Date, required: false },
//     answerUpdatedAt: { type: Date, required: false },
//   },
//   { timestamps: true }
// );

// const ProductQA =
//   mongoose.models.ProductQA || mongoose.model("ProductQA", ProductQASchema);
// export default ProductQA;

import mongoose from "mongoose";
require("@/models/user");

const ProductQASchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    questionCreatedAt: { type: Date, required: true },
    questionUpdatedAt: { type: Date },
    answer: String,
    answerCreatedAt: { type: Date },
    answerUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

const ProductQA =
  mongoose.models.ProductQA || mongoose.model("ProductQA", ProductQASchema);

export default ProductQA;
