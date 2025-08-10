import { useState, useEffect } from "react";
import LogoutBtn from "../components/LogoutBtn";
import UserCard from "../components/UserCard";

export default function AdminDashboard() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/users");
        const data = await res.json();
        setUsersData(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

      <div className="mb-8 mt-4">
        <h2 className="text-2xl font-bold text-gray-800">📋 Users</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-700 text-lg italic">Loading users...</p>
      ) : usersData.length === 0 ? (
        <p className="text-center text-gray-700 text-lg italic">No users found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {usersData.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
