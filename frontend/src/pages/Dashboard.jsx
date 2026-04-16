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
        const posts = postsRes.data?.data || [];
        const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);
        const totalLikes = posts.reduce((acc, post) => acc + (post.likesCount || 0), 0);

        setStats({
          articles: posts.length,
          views: totalViews,
          likes: totalLikes,
          saved: savedRes.data?.data?.length || 0
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
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="metric-card">
              <p className="metric-label">Articles</p>
              <p className="metric-value">{stats.articles}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Total Views</p>
              <p className="metric-value">{stats.views?.toLocaleString() || 0}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Total Likes</p>
              <p className="metric-value">{stats.likes?.toLocaleString() || 0}</p>
            </div>
            <div className="metric-card">
              <p className="metric-label">Saved by Others</p>
              <p className="metric-value">{stats.saved?.toLocaleString() || 0}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
