import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String, // e.g., "2025-08-06"
    required: true,
  },
  status: {
    type: String,
    enum: [ "in-progress", "completed"], // allowed values
    default: "in-progress",
  },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
