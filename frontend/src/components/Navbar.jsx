import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Search,
  PenSquare,
  Moon,
  Sun,
  Bookmark,
  Heart,
  LayoutDashboard,
  Settings,
  Bell,
  LogOut,
  FileText,
  Sparkles,
  MessageCircle
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const notifications = [
    { id: 1, title: 'New like on "Designing with Depth"', time: '2m ago' },
    { id: 2, title: '3 new followers this week', time: '1h ago' },
    { id: 3, title: 'Comment on "The Writer\'s Ritual"', time: '5h ago' }
  ];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get('q') || '');
  }, [location.search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (location.pathname !== '/') {
        return;
      }
      const params = new URLSearchParams(location.search);
      const nextValue = searchValue.trim();

      if (nextValue) {
        params.set('q', nextValue);
      } else {
        params.delete('q');
      }

      const query = params.toString();
      const targetUrl = query ? `/?${query}` : '/';

      if (targetUrl !== `${location.pathname}${location.search}`) {
        navigate(targetUrl, { replace: true });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, location.pathname, location.search, navigate]);

  return (
    <nav className="sticky top-0 z-50 w-full nav-shell">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-3xl font-brand font-black tracking-tight text-[var(--ink)]">
              Blog Mafia
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center space-x-6 flex-1 px-8 text-sm font-medium text-[var(--ink)]">
            <Link to="/" className="hover:text-[var(--accent)] transition">Home</Link>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Pages section coming soon!'); }} className="hover:text-[var(--accent)] transition">Pages</a>
            <Link to="/" className="hover:text-[var(--accent)] transition">Blog</Link>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Categories are in the sidebar on the Home page!'); }} className="hover:text-[var(--accent)] transition">Categories</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Shop section coming soon!'); }} className="hover:text-[var(--accent)] transition">Shop</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Elements section coming soon!'); }} className="hover:text-[var(--accent)] transition">Elements</a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="h-10 w-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:scale-105 transition"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-[var(--gold)]" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--ink)]" />
              )}
            </button>
            {user ? (
              <>
                <Link to="/create-post" className="btn-accent flex items-center px-4 py-2 rounded-full text-sm font-semibold">
                  <PenSquare className="w-5 h-5 mr-1" />
                  Write
                </Link>
                <Link to="/chat" className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition text-[var(--muted)]">
                  <MessageCircle className="w-5 h-5" />
                </Link>
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="flex items-center text-sm rounded-full focus:outline-none ring-2 ring-transparent hover:scale-[1.03] hover:ring-[var(--border)] transition avatar-trigger"
                    aria-expanded={isMenuOpen}
                    aria-haspopup="menu"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="relative h-10 w-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center font-bold uppercase shadow-inner">
                      {user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      <span className="avatar-badge">{notifications.length}</span>
                    </div>
                  </button>
                  {isMenuOpen && (
                    <>
                      <div className="user-menu-overlay" onClick={() => setIsMenuOpen(false)} />
                      <div className="user-menu-panel" role="menu">
                        <div className="user-menu-top">
                          <div className="user-menu-avatar">
                            {user?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-base font-semibold">{user?.username || 'User'}</p>
                            <p className="text-xs text-[var(--muted)] truncate">{user?.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            className="user-menu-close md:hidden"
                          >
                            Close
                          </button>
                        </div>

                        <div className="user-menu-section">
                          <p className="user-menu-title">Content</p>
                          <Link
                            to="/chat"
                            className="user-menu-item"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Messages
                          </Link>
                          <Link
                            to="/my-articles"
                            className="user-menu-item"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <FileText className="w-4 h-4" />
                            My Articles
                          </Link>
                          <Link
                            to="/saved-posts"
                            className="user-menu-item"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Bookmark className="w-4 h-4" />
                            Saved Posts
                          </Link>
                          <Link
                            to="/liked-posts"
                            className="user-menu-item"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Heart className="w-4 h-4" />
                            Liked Posts
                          </Link>
                          <Link
                            to="/dashboard"
                            className="user-menu-item"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                        </div>

                        <div className="user-menu-section">
                          <p className="user-menu-title">Account</p>
                          <Link to="/settings" className="user-menu-item" onClick={() => setIsMenuOpen(false)}>
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          <button
                            type="button"
                            className="user-menu-item"
                            onClick={() => setIsDark((prev) => !prev)}
                          >
                            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            {isDark ? 'Light Mode' : 'Dark Mode'}
                          </button>
                          <button type="button" className="user-menu-item">
                            <Bell className="w-4 h-4" />
                            Notifications
                          </button>
                        </div>

                        <div className="user-menu-section">
                          <p className="user-menu-title">Recent</p>
                          <div className="user-menu-activity">
                            {notifications.map((item) => (
                              <div key={item.id} className="user-menu-activity-item">
                                <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                                <div>
                                  <p className="text-sm text-[var(--ink)]">{item.title}</p>
                                  <p className="text-xs text-[var(--muted)]">{item.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="user-menu-section">
                          <button
                            type="button"
                            onClick={logout}
                            className="user-menu-item user-menu-logout"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[var(--muted)] hover:text-[var(--ink)] px-3 py-2 text-sm font-medium transition">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
