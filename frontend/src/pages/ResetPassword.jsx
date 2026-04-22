import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otp = location.state?.otp || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) {
      setError('Session expired. Try from the beginning.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await API.post('/auth/reset-password', { email, otp, password });
      setMessage('Password reset successfully. You can now login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-md">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block text-gray-600">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="confirmPassword" className="block text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button className="block w-full p-3 text-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;