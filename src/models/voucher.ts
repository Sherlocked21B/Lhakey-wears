const mongoose = require("mongoose");
const { Schema } = mongoose;

const voucherSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    min: [0, "Discount must be at least 0"],
  },
  category: {
    type: String,
    required: true,
  },
  minimumAmount: {
    type: Number,
    required: true,
    min: [0, "Amount must be at least 0"],
  },
  maximumDiscount: {
    type: Number,
    required: true,
    min: [0, "Amount must be at least 0"],
  },
  start: {
    type: Date,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  totalVoucher: {
    type: Number,
    required: true,
    min: [0, "Total Count must be at least 0"],
  },
});

// Model creation
const Voucher =
  mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema);

export default Voucher;
