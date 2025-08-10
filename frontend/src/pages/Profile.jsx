import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoutBtn from '../components/LogoutBtn';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?.email) {
      console.log(storedUser?.email);
      fetch(`http://localhost:3000/api/auth/users/${storedUser.email}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(err => console.error("Error fetching user details:", err));
    } else {
      navigate("/"); // Redirect to login if no user in localStorage
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-pink-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md transition duration-300 ease-in-out hover:shadow-2xl">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
          <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
        </div>

        {/* Profile Details */}
        <div className="mb-6 space-y-2">
          <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
          <LogoutBtn />
        </div>
      </div>
    </div>
  );
};

export default Profile;
