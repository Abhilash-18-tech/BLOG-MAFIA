import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[75vh] px-4">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
                    <p className="text-gray-500 mt-3 text-sm">Enter your credentials to access your account.</p>
                </div>

                {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-md text-sm font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 text-white font-semibold py-3.5 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 mt-4 shadow-sm"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-between">
                    <span className="border-b w-1/5 lg:w-1/4 filter border-gray-200"></span>
                    <span className="text-xs text-center text-gray-400 font-semibold uppercase relative px-2">or continue with</span>
                    <span className="border-b w-1/5 lg:w-1/4 filter border-gray-200"></span>
                </div>

                <div className="mt-6 text-center text-sm">
                    {/* Note: This requires VITE_GOOGLE_CLIENT_ID in your .env */}
                    <a 
                        href="/api/auth/google"
                        className="w-full bg-white text-gray-700 font-semibold py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-3 shadow-sm">
                        <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                            <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.649-3.34-11.124-7.99l-6.57 4.821C9.656 39.663 16.318 44 24 44z" />
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                        </svg>
                        Sign in with Google
                    </a>
                    <p className="mt-2 text-xs text-gray-500">Google sign-in available soon</p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm font-medium text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;