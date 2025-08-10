// src/components/LogoutButton.jsx
import { useNavigate } from 'react-router-dom';

const LogoutBtn = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session (e.g., localStorage, cookie)
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

export default LogoutBtn;
