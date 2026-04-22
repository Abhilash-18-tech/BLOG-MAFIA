import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/forgot-password', { email });
      setMessage('OTP has been sent to your email.');
      setError('');
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-white shadow-md">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button className="block w-full p-3 text-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Send OTP
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Remember it? <Link to="/login" className="underline text-indigo-600">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;