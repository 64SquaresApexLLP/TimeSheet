import { useState, useEffect } from "react";
import LogoutBtn from "../components/LogoutBtn";
import TimesheetTable from "../components/TimesheetTable";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const AdminPanel = () => {
  const [view, setView] = useState("weekly");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [timesheetData, setTimesheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Calculate date range with offset
  const getDateRange = () => {
    const today = new Date();

    if (view === "weekly") {
      // Find start of the week
      const start = new Date(today);
      start.setDate(start.getDate() - start.getDay() + weekOffset * 7);

      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });
    } else {
      // Monthly view with offset
      const start = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
      const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();

      return Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(start);
        d.setDate(i + 1);
        return d;
      });
    }
  };

  const dateRange = getDateRange();

  // Fetch timesheet data
  const fetchTimesheetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/users/`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTimesheetData(data);
    } catch (err) {
      setError("Failed to load timesheet data");
      console.error("Error fetching timesheet data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Export Excel
  const exportToExcel = () => {
    const table = document.querySelector("table");
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timesheet");
    XLSX.writeFile(wb, "timesheet.xlsx");
  };

  // Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      html: "#timesheet-table",
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save("timesheet.pdf");
  };

  useEffect(() => {
    fetchTimesheetData();
  }, [view, weekOffset, monthOffset]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-blue-50 to-pink-100 p-8 relative">
      {/* Logout */}
      <div className="absolute top-6 right-6">
        <LogoutBtn />
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 text-center mt-6 mb-6 drop-shadow-lg">
        Admin Dashboard
      </h1>
      <hr className="border-t-4 border-blue-500 w-full mx-auto my-6 rounded-full" />

      {/* View toggle + Week navigation */}
      <div className="flex flex-col items-center mb-6 max-w-3xl mx-auto gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setView("weekly"); setWeekOffset(0); }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === "weekly" ? "bg-indigo-500 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => { setView("monthly"); setMonthOffset(0); }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              view === "monthly" ? "bg-indigo-500 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Navigation buttons */}
        {view === "weekly" ? (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setWeekOffset(weekOffset - 1)}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg"
            >
              ⬅️ Prev Week
            </button>
            <span className="font-semibold">
              Week of {dateRange[0].toLocaleDateString()} - {dateRange[6].toLocaleDateString()}
            </span>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg"
            >
              Next Week ➡️
            </button>
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setMonthOffset(monthOffset - 1)}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg"
            >
              ⬅️ Prev Month
            </button>
            <span className="font-semibold">
              {dateRange[0].toLocaleString("default", { month: "long", year: "numeric" })}
            </span>
            <button
              onClick={() => setMonthOffset(monthOffset + 1)}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg"
            >
              Next Month ➡️
            </button>
          </div>
        )}
      </div>

      {/* Data */}
      {loading ? (
        <p className="text-center text-gray-600 mt-10">Loading timesheet data...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-10">{error}</p>
      ) : (
        <TimesheetTable timesheetData={timesheetData} dateRange={dateRange} />
      )}

      {/* Download button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          📊 Excel
        </button>
        <button
          onClick={exportToPDF}
          className="ml-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          📄 PDF
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
