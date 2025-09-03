import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },   // 👈 unique
    email: { type: String, required: true, unique: true },  // 👈 unique
    role: { type: String, default: "User" },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null }
  },
  { timestamps: true }
);

// Ensure indexes are applied
userSchema.index({ name: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);