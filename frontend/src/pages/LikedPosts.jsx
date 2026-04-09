import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const LikedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLiked = async () => {
      if (!user) {
        setLoading(false);
        setPosts([]);
        return;
      }

      try {
        setLoading(true);
        const [likedRes, savedRes] = await Promise.all([
          api.get('/users/me/liked'),
          api.get('/users/me/saved')
        ]);
        setPosts(likedRes.data?.data || []);
        setSavedIds(savedRes.data?.data?.map((post) => post._id) || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch liked posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiked();
  }, [user]);

  return (
    <section className="settings-shell">
      <div className="settings-card">
        <h1 className="text-3xl font-brand font-bold mb-3">Liked Posts</h1>
        <p className="text-sm text-[var(--muted)]">Posts you have liked will appear here.</p>

        {loading ? (
          <div className="py-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : posts.length === 0 ? (
          <div className="mt-6 text-[var(--muted)]">No liked posts yet.</div>
        ) : (
          <div className="mt-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                isInitiallyLiked={true}
                isInitiallySaved={savedIds.includes(post._id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LikedPosts;
