// User.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String, required: true },
  status: {
    type: String,
    enum: [ "in-progress", "completed"],
    default: "in-progress"
  }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, default: "User" },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  tasks: { type: [taskSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
