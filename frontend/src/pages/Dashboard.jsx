import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    articles: 0,
    saved: 0,
    liked: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !user.id) {
        setLoading(false);
        setError('Please sign in to view your dashboard.');
        return;
      }

      try {
        setLoading(true);
        const [postsRes, savedRes, likedRes] = await Promise.all([
          api.get(`/posts?author=${user.id}`),
          api.get('/users/me/saved'),
          api.get('/users/me/liked')
        ]);
        setStats({
          articles: postsRes.data?.data?.length || 0,
          saved: savedRes.data?.data?.length || 0,
          liked: likedRes.data?.data?.length || 0
        });
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <section className="settings-shell">
      <div className="settings-card">
        <h1 className="text-3xl font-brand font-bold mb-3">Dashboard</h1>
        <p className="text-sm text-[var(--muted)]">Views, stats, and engagement will live here.</p>

        {loading ? (
          <div className="mt-6 text-[var(--muted)]">Loading stats...</div>
        ) : error ? (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="settings-section">
              <p className="settings-label">Articles</p>
              <p className="text-2xl font-semibold text-[var(--ink)]">{stats.articles}</p>
            </div>
            <div className="settings-section">
              <p className="settings-label">Saved</p>
              <p className="text-2xl font-semibold text-[var(--ink)]">{stats.saved}</p>
            </div>
            <div className="settings-section">
              <p className="settings-label">Liked</p>
              <p className="text-2xl font-semibold text-[var(--ink)]">{stats.liked}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
