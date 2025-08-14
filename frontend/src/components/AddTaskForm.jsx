import { useState } from "react";
import axios from "axios";

const AddTaskForm = ({ email, onTaskAdded, existingTasks }) => {
  // existingTasks is an array of tasks already added, needed to calculate total hours per day

  const [project, setProject] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    if (!project.trim() || !date || !hours) {
      alert("Please fill out project name, date, and hours worked");
      return;
    }

    const hrsNum = Number(hours);
    if (isNaN(hrsNum) || hrsNum <= 0) {
      alert("Please enter a valid number of hours greater than 0");
      return;
    }

    // Calculate total hours already logged on that date (including this new entry)
    const existingHours = existingTasks
      ?.filter((task) => task.date === date)
      .reduce((sum, task) => sum + (Number(task.hours) || 0), 0);

    if (existingHours + hrsNum > 8) {
      alert(
        `Total working hours for ${date} cannot exceed 8 hours. You have already logged ${existingHours} hours.`
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/tasks/${email}`,
        { project: project.trim(), date, hours: hrsNum }
      );

      // Reset form fields
      setProject("");
      setDate("");
      setHours("");

      // Update parent task list
      if (onTaskAdded) {
        onTaskAdded(res.data);
      }
    } catch (err) {
      console.error("Error adding task:", err);
      alert(err.response?.data?.error || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <input
        type="text"
        placeholder="Project Name"
        value={project}
        onChange={(e) => setProject(e.target.value)}
        className="border rounded-lg px-4 py-2 flex-1 min-w-[200px]"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border rounded-lg px-4 py-2"
      />

      <input
        type="number"
        min="0"
        step="1"
        placeholder="Hours Worked"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        className="border rounded-lg px-4 py-2 w-[120px]"
      />

      <button
        onClick={handleAddTask}
        disabled={loading}
        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
};

export default AddTaskForm;
