import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';
import { useAuth } from '../hooks/useAuth';

const MyArticles = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        setLoading(false);
        setPosts([]);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/posts?author=${user.id}`);
        setPosts(res.data.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch your articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setActionError('');
    } catch (err) {
      setActionError('Failed to delete post. Please try again.');
    }
  };

  return (
    <section className="settings-shell">
      <div className="settings-card">
        <h1 className="text-3xl font-brand font-bold mb-3">My Articles</h1>
        <p className="text-sm text-[var(--muted)]">Your published and draft stories will appear here.</p>

        {loading ? (
          <div className="py-6">
            <Loader />
          </div>
        ) : error ? (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : posts.length === 0 ? (
          <div className="mt-6 text-[var(--muted)]">No articles yet.</div>
        ) : (
          <div className="mt-8">
            {actionError && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md">
                {actionError}
              </div>
            )}
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                user={user}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyArticles;
