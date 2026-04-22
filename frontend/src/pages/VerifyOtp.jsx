import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is missing. Try again from the beginning.');
      return;
    }
    try {
      await API.post('/auth/verify-otp', { email, otp });
      setMessage('OTP Verified successfully.');
      setError('');
      setTimeout(() => navigate('/reset-password', { state: { email, otp } }), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP');
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-md">
        <h1 className="text-2xl font-bold text-center">Verify OTP</h1>
        <p className="text-sm text-center text-gray-500">Enter the OTP sent to {email}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1 text-sm">
            <label htmlFor="otp" className="block text-gray-600">OTP</label>
            <input
              type="text"
              name="otp"
              id="otp"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button className="block w-full p-3 text-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;