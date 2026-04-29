import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const brandName = 'Blog Mafia';
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
        <div className="auth-shell">
            <div className="auth-grid">
                <section
                    className="auth-visual"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')"
                    }}
                >
                    <div className="auth-visual-content">
                        <div className="auth-brand">
                            <span className="auth-brand-mark">BM</span>
                            <span>{brandName}</span>
                        </div>
                        <p className="auth-highlight">
                            Log in to continue your stories, follow new creators, and keep your reading list in sync.
                        </p>
                        <div className="glass-panel rounded-2xl px-4 py-3 text-sm">
                            <p className="font-semibold">Today&apos;s highlight</p>
                            <p className="text-white/80">Write, publish, and share with your community in minutes.</p>
                        </div>
                    </div>
                </section>

                <section className="auth-card">
                    <div className="mb-8">
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in with your email to pick up where you left off.</p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="auth-field">
                            <label className="auth-label">Email address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="auth-input"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="auth-field">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="auth-input"
                                placeholder="Your password"
                            />
                            <div className="flex justify-end">
                                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="auth-primary w-full">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-divider">Or continue with</div>

                    <div className="auth-social">
                        {/* Note: This requires VITE_GOOGLE_CLIENT_ID in your .env */}
                        <a href="/api/auth/google" className="auth-social-btn">
                            <svg className="h-5 w-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.649-3.34-11.124-7.99l-6.57 4.821C9.656 39.663 16.318 44 24 44z" />
                                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                            </svg>
                            Sign in with Google
                        </a>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="auth-footer-link">
                            Sign up
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;