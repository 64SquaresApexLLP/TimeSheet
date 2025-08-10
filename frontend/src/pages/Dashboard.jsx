import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import AddTaskForm from "../components/AddTaskForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${user.email}`);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect if no user is found
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.email) {
      fetchTasks(user.email);
    }
  }, [user]);

  const fetchTasks = (email) => {
    fetch(`http://localhost:3000/api/auth/tasks/${email}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {});

  return (
    <div className="p-6 relative min-h-screen bg-gray-50">
      {/* Top Bar with User Info */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">📋 Daily Task Tracker</h1>
        {user && (
          <div onClick={handleProfileClick} className="text-right cursor-pointer">
            <p className="text-sm text-gray-600">👤 Logged in as</p>
            <p className="font-medium text-gray-800">{user.name}</p>
          </div>
        )}
      </div>

      {/* Add Task Form */}
      <AddTaskForm
        user={user}
        onTaskAdded={() => {
          fetch(`http://localhost:3000/api/auth/tasks/${user.email}`)
            .then((res) => res.json())
            .then((data) => setTasks(data));
        }}
      />

      {/* Render tasks by date */}
      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <TaskCard key={date} date={date} tasks={tasks} />
      ))}
    </div>
  );
}
