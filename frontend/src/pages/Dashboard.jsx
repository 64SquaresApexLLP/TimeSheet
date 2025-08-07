import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import AddTaskForm from "../components/AddTaskForm";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Set dummy user if nothing in localStorage
      const dummyUser = {
        name: "Sudarshan Sase",
        email: "sudarshan@example.com",
      };
      localStorage.setItem("user", JSON.stringify(dummyUser));
      setUser(dummyUser);
    }
  }, []);

  const groupedTasks = {
    "2025-08-06": [
      { text: "Finish React project" },
      { text: "Team meeting at 3 PM" },
    ],
    "2025-08-07": [
      { text: "Write documentation" },
      { text: "Push code to GitHub" },
    ],
  };

  return (
    <div className="p-6 relative min-h-screen bg-gray-50">
      {/* Top Bar with User Info */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">📋 Daily Task Tracker</h1>
        {user && (
          <div className="text-right">
            <p className="text-sm text-gray-600">👤 Logged in as</p>
            <p className="font-medium text-gray-800">{user.name}</p>
          </div>
        )}
      </div>

      <AddTaskForm onTaskAdded={() => {}} />

      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <TaskCard key={date} date={date} tasks={tasks} />
      ))}
    </div>
  );
}
