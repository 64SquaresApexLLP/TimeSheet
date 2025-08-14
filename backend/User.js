import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },              // added name here
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "User" },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
