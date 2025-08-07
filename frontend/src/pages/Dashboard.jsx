import TaskCard from "../components/TaskCard";
import AddTaskForm from "../components/AddTaskForm";

export default function Dashboard() {
  // Static grouped task data
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📋 Daily Task Tracker</h1>
      <AddTaskForm onTaskAdded={() => {}} /> {/* Placeholder */}
      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <TaskCard key={date} date={date} tasks={tasks} />
      ))}
    </div>
  );
}
