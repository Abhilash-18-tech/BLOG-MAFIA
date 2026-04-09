import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const SavedPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) {
        setLoading(false);
        setPosts([]);
        return;
      }

      try {
        setLoading(true);
        const [savedRes, likedRes] = await Promise.all([
          api.get('/users/me/saved'),
          api.get('/users/me/liked')
        ]);
        setPosts(savedRes.data?.data || []);
        setLikedIds(likedRes.data?.data?.map((post) => post._id) || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch saved posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [user]);

  return (
    <section className="settings-shell">
      <div className="settings-card">
        <h1 className="text-3xl font-brand font-bold mb-3">Saved Posts</h1>
        <p className="text-sm text-[var(--muted)]">Your saved reads will show up here.</p>

        {loading ? (
          <div className="py-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : posts.length === 0 ? (
          <div className="mt-6 text-[var(--muted)]">No saved posts yet.</div>
        ) : (
          <div className="mt-8">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                isInitiallySaved={true}
                isInitiallyLiked={likedIds.includes(post._id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedPosts;
