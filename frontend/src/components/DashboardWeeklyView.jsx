import React, { useState } from "react";
import dayjs from "dayjs";

const DashboardWeeklyView = ({ email }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week").add(1, "day") // Monday
  );

  const getWeekDates = (start) => {
    return Array.from({ length: 5 }, (_, i) =>
      start.add(i, "day").format("YYYY-MM-DD")
    );
  };

  const weekDates = getWeekDates(currentWeekStart);

  // 🔹 Define all projects in one place
  const projectsList = ["KPI", "AUM", "IMDP", "APM", "KA", "IM One"];

  const [tableData, setTableData] = useState(
    projectsList.reduce((acc, project) => {
      acc[project] = weekDates.map(() => "");
      return acc;
    }, {})
  );

  const handleInputChange = (row, colIndex, value) => {
    setTableData((prev) => {
      const updatedRow = [...prev[row]];
      updatedRow[colIndex] = value;
      return { ...prev, [row]: updatedRow };
    });
  };

  const handleSave = async () => {
    if (!email) {
      alert("User email is missing. Cannot save.");
      return;
    }

    try {
      const res = await fetch(
        `/api/auth/tasks/weekly/${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            weekDates,
            tableData,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Weekly data saved successfully!");
        console.log("Saved Data:", data);
      } else {
        alert(data.error || "Error saving data");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => prev.subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => prev.add(1, "week"));
  };

  return (
    <div className="p-5 border border-gray-300 rounded-lg relative bg-white shadow-sm">
      {/* Top controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            ←
          </button>
          <span className="font-medium">
            Week of {currentWeekStart.format("YYYY-MM-DD")}
          </span>
          <button
            onClick={handleNextWeek}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            →
          </button>
        </div>

        <button
          onClick={handleSave}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
        >
          Save
        </button>
      </div>

      {/* Table */}
      <table id="UserTimesheet" className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 bg-gray-100">Project</th>
            {weekDates.map((date, idx) => (
              <th
                key={idx}
                className="border border-gray-300 p-2 bg-gray-100 text-center"
              >
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projectsList.map((row) => (
            <tr key={row}>
              <td className="border border-gray-300 p-2 font-semibold">{row}</td>
              {weekDates.map((_, colIndex) => (
                <td key={colIndex} className="border border-gray-300 p-2">
                  <input
                    type="number"
                    value={tableData[row][colIndex]}
                    onChange={(e) =>
                      handleInputChange(row, colIndex, e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardWeeklyView;
