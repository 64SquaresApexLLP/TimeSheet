import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardWeeklyView from "../components/DashboardWeeklyView";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const navigate = useNavigate();

  // --- Fetch user from localStorage ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const dummyUser = { name: "Sudarshan Sase", email: "sudarshan@example.com" };
      localStorage.setItem("user", JSON.stringify(dummyUser));
      setUser(dummyUser);
    }
  }, []);

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

  // --- Fetch tasks ---
  const fetchTasks = () => {
    if (!user?.email) return;

    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/tasks/${user.email}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error fetching tasks:", errorText);
          setTasks([]);
          return;
        }
        return res.json();
      })
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Fetch error:", err);
        setTasks([]);
      });
  };

  useEffect(() => {
    if (user?.email) fetchTasks();
  }, [user]);

  // --- Handle profile click ---
  const handleProfileClick = () => navigate("/profile");

  return (
    <div className="p-6 relative min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">📋 Daily Task Tracker</h1>
        {user && (
          <div onClick={handleProfileClick} className="text-right cursor-pointer">
            <p className="text-sm text-gray-600">👤 Logged in as</p>
            <p className="font-medium text-gray-800">{user.email}</p>
          </div>
        )}
      </div>

   
      {/* Weekly Timesheet Table */}
      {user?.email && <DashboardWeeklyView email={user.email} />}

      {/* Download Button */}
      <div className="mt-4">
        {!showDownloadOptions ? (
          <button
            onClick={() => setShowDownloadOptions(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            📥 Download
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              📄 PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              📊 Excel
            </button>
            <button
              onClick={() => setShowDownloadOptions(false)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              ❌ Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
