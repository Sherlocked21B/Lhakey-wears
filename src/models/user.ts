import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  image: String,
  emailVerified: Date,
  phoneNumber: String,
  address: String,
});

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
