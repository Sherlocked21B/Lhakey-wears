import mongoose from "mongoose";

const CurrencySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  rates: { type: Object, required: true },
});

const Currency =
  mongoose.models?.Currency || mongoose.model("Currency", CurrencySchema);

export default Currency;
