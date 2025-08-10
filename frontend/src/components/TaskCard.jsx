import { useState } from 'react';

export default function TaskCard({ date, tasks }) {
  const [taskList, setTaskList] = useState(tasks);

  const handleStatusChange = (index, newStatus) => {
    const updatedTasks = [...taskList];
    updatedTasks[index].status = newStatus;
    setTaskList(updatedTasks);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition">
      <h2 className="text-sm text-gray-400 mb-2">📅 {date}</h2>
      <ul className="space-y-2">
        {taskList.map((task, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 rounded bg-gray-100"
          >
            <span className="text-gray-800">🔹 {task.text}</span>
            <select
              className={`ml-4 text-xs font-semibold rounded px-2 py-1 outline-none ${
                task.status === 'completed'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-yellow-200 text-yellow-800'
              }`}
              value={task.status}
              onChange={(e) => handleStatusChange(index, e.target.value)}
            >
              <option value="in-progress">⏳ In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
