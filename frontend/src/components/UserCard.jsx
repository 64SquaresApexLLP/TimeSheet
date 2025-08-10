import React, { useState } from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

export default function UserCard({ user }) {
  const tasks = user.tasks || [];
  const [expandedDates, setExpandedDates] = useState({});
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest first, "asc" = oldest first

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {});

  const toggleDate = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {/* User Info */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-blue-700">
          <strong>{user.email}</strong>
        </h2>
      </div>

      {/* Task History Header with Icon Sort Button */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-bold text-gray-900">🗓️ Task History:</h3>
        <button
          onClick={toggleSortOrder}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
          title={sortOrder === "desc" ? "Newest First" : "Oldest First"}
        >
          {sortOrder === "desc" ? <FaSortAmountDown /> : <FaSortAmountUp />}
        </button>
      </div>

      {/* Scrollable Task List */}
      <div className="max-h-64 overflow-y-auto p-3 bg-gray-100 rounded-lg shadow-inner">
        {tasks.length === 0 ? (
          <p className="text-gray-400 italic">No tasks available.</p>
        ) : (
          Object.keys(groupedTasks)
            .sort((a, b) =>
              sortOrder === "desc"
                ? new Date(b) - new Date(a)
                : new Date(a) - new Date(b)
            )
            .map((date) => (
              <div key={date} className="mb-3 border rounded">
                {/* Date Header */}
                <button
                  onClick={() => toggleDate(date)}
                  className="w-full flex justify-between items-center px-3 py-2 bg-white hover:bg-gray-200 text-left font-medium"
                >
                  <span>{date}</span>
                  <span>{expandedDates[date] ? "▲" : "▼"}</span>
                </button>

                {/* Tasks for that date */}
                {expandedDates[date] && (
                  <ul className="divide-y">
                    {groupedTasks[date].map((task, index) => (
                      <li key={index} className="p-2 flex justify-between">
                        <span className="font-medium">{task.text}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {task.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}
