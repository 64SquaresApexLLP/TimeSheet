import mongoose from 'mongoose';

const projectEntrySchema = new mongoose.Schema({
  project: { type: String, required: true },
  hours: { type: Number, default: 0, min: 0 }
});

const taskSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },  // e.g. "2025-08-05"
  projects: { type: [projectEntrySchema], default: [] },
}, { timestamps: true });

// Ensure one record per user per date
taskSchema.index({ userEmail: 1, date: 1 }, { unique: true });

export default mongoose.model("Task", taskSchema);
