import { useState } from "react";
import LogoutBtn from "../components/LogoutBtn";
import dayjs from "dayjs";

const AdminPanel = () => {
  const [view, setView] = useState("weekly"); // weekly | monthly

  // Dummy data for testing
  const timesheetData = [
    {
      name: "Vaibhav",
      project: "KPI",
      entries: {
        "2025-08-04": 0,
        "2025-08-05": 8,
        "2025-08-06": 8,
      },
    },
    {
      name: "Vaibhav",
      project: "AUM",
      entries: {
        "2025-08-06": 8,
      },
    },
    {
      name: "Jyoti",
      project: "KPI",
      entries: {
        "2025-08-04": 0,
        "2025-08-05": 8,
        "2025-08-06": 8,
      },
    },
  ];

  const getDateRange = () => {
    if (view === "weekly") {
      // Weekly: Monday to Friday of current week
      const start = dayjs().startOf("week").add(1, "day"); // Monday
      return Array.from({ length: 5 }, (_, i) => start.add(i, "day").toDate());
    } else {
      // Monthly: first 5 working days (Mon-Fri) of current month
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      let dates = [];
      let dayCounter = 1;

      while (dates.length < 5) {
        const d = new Date(year, month, dayCounter);
        const dayOfWeek = d.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Not Sunday (0) or Saturday (6)
          dates.push(d);
        }
        dayCounter++;
      }

      return dates;
    }
  };

  const dateRange = getDateRange();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-50 to-pink-100 p-8 relative">
      {/* Logout Button */}
      <div className="absolute top-6 right-6">
        <LogoutBtn />
      </div>

      {/* Page Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 text-center mt-6 mb-6 drop-shadow-lg">
        Admin Dashboard
      </h1>

      <hr className="border-t-4 border-blue-500 w-full mx-auto my-6 rounded-full" />

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Timesheet</h2>
        <div>
          <button
            onClick={() => setView("weekly")}
            className={`px-4 py-2 mr-2 rounded-lg font-medium transition-all ${
              view === "weekly"
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === "monthly"
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Timesheet Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-indigo-100">
              <th className="border p-3 text-left font-semibold">Team Member</th>
              <th className="border p-3 text-left font-semibold">Project</th>
              {dateRange.map((date, i) => (
                <th key={i} className="border p-3 text-center font-semibold">
                  {date.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timesheetData.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="border p-3">{row.name}</td>
                <td className="border p-3">{row.project}</td>
                {dateRange.map((date, i) => {
                  const key = date.toISOString().split("T")[0];
                  return (
                    <td key={i} className="border p-3 text-center">
                      {row.entries[key] ?? ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
