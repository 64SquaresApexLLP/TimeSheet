import { useState } from "react";

export default function AddTaskForm({ onTaskAdded }) {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, date }),
    });
    const newTask = await res.json();
    onTaskAdded((prev) => [...prev, newTask]);
    setText("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col md:flex-row gap-2">
      <input
        type="text"
        placeholder="Task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border rounded flex-1"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-2 border rounded"
        required
      />
      <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
        Add
      </button>
    </form>
  );
}
