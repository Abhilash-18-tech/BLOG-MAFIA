import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.data);
      } catch (err) {
        setError('Failed to fetch post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Failed to delete', err);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!post) return <div className="p-4 text-center">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8 bg-white rounded shadow">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back
      </button>
      {post.image && (
        <img
          src={post.image.startsWith('http') ? post.image : `/uploads/${post.image}`}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex justify-between items-center text-gray-500 mb-6 border-b pb-4">
        <div>
          <span>By {post.author?.username || 'Unknown'}</span>
          <span className="mx-2">|</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.category && (
             <>
              <span className="mx-2">|</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {post.category?.name || post.category}
              </span>
             </>
          )}
        </div>
        
        {user && user.id === (post.author?._id || post.author) && (
          <div className="flex space-x-2">
            <Link
              to={`/edit/${post._id}`}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="prose max-w-none whitespace-pre-line">
        {post.content}
      </div>
    </div>
  );
};

export default PostDetails;
