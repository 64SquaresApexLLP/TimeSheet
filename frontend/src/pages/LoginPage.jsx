import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setOtpSent(true);
      setMessage(res.data.message);
    } catch (err) {
      setMessage("❌ Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      setMessage(`✅ ${res.data.message}`);
      navigate("/dashboard");

    } catch (err) {
      setMessage("❌ Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full transition-all duration-500 ease-in-out hover:shadow-purple-300">
        {/* Title */}
        <h1 className="text-5xl font-serif font-extrabold text-center text-purple-700 mb-10 tracking-tight drop-shadow-md">
          Timesheet
        </h1>

        {/* Form Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Login with OTP
        </h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="📧 Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
        />

        {/* OTP Input & Buttons */}
        {!otpSent ? (
          <button
            onClick={sendOtp}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-purple-600 hover:to-pink-500"
            }`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="🔑 Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mt-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-pink-500 hover:to-red-500"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* Message */}
        {message && (
          <p
            className={`mt-6 text-center text-sm ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("❌")
                ? "text-red-600"
                : "text-gray-600"
            } transition duration-300`}
          >
            {message}
          </p>
        )}

        {/* Divider */}
        <div className="mt-10 text-center text-xs text-gray-400">
          © 2025 Timesheet App. All rights reserved.
        </div>
      </div>
    </div>
  );
}
