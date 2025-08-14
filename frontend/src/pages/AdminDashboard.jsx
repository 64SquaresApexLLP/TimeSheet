import { useState, useEffect } from "react";
import LogoutBtn from "../components/LogoutBtn";
import TimesheetTable from "../components/TimesheetTable";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

const AdminPanel = () => {
  const [view, setView] = useState("weekly");
  const [timesheetData, setTimesheetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Calculate date range
  const getDateRange = () => {
    const today = new Date();
    const start = new Date(today);
    if (view === "weekly") {
      start.setDate(today.getDate() - today.getDay());
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });
    } else {
      start.setDate(1);
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(start);
        d.setDate(i + 1);
        return d;
      });
    }
  };

  const dateRange = getDateRange();

  // Fetch data
  const fetchTimesheetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/auth/users`);
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

  // Handle single download button
  const handleDownloadClick = () => {
    setShowDownloadModal(true);
  };

  const handleDownloadChoice = (type) => {
    if (type === "pdf") {
      exportToPDF();
    } else if (type === "excel") {
      exportToExcel();
    }
    setShowDownloadModal(false);
  };

  useEffect(() => {
    fetchTimesheetData();
  }, [view]);

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

      {/* View toggle */}
      <div className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">📊 Timesheet</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView("weekly")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${view === "weekly"
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${view === "monthly"
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Single download button */}
      {/* Single download button in the top-right corner */}
      <div className="absolute top-6 right-">
        <button
          onClick={handleDownloadClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          📥 Download
        </button>
      </div>

      {/* Data */}
      {loading ? (
        <p className="text-center text-gray-600 mt-10">Loading timesheet data...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-10">{error}</p>
      ) : (
        <TimesheetTable timesheetData={timesheetData} dateRange={dateRange} />
      )}

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Choose download format</h2>
            <div className="flex justify-around mb-4">
              <button
                onClick={() => handleDownloadChoice("pdf")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                PDF
              </button>
              <button
                onClick={() => handleDownloadChoice("excel")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Excel
              </button>
            </div>
            <button
              onClick={() => setShowDownloadModal(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
