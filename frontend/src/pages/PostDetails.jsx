import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import { io } from 'socket.io-client';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Real-time comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const socketRef = useRef(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const socketBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.data);
        setComments(res.data.data.comments || []);
        checkFollowStatus(res.data.data.author?._id);
      } catch (err) {
        setError('Failed to fetch post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();

    // Fetch author follow status if user is logged in
    const checkFollowStatus = async (authorId) => {
      if (user && user.id !== authorId) {
        try {
          const profileRes = await api.get(`/users/${authorId}`);
          setIsFollowing(profileRes.data.data.isFollowing);
        } catch (err) {
          console.error('Failed to check follow status', err);
        }
      }
    };

    // Setup Socket.io connection
    socketRef.current = io(socketBaseUrl);
    
    // Join the specific post room
    socketRef.current.emit('join_post', id);

    // Listen for new comments
    socketRef.current.on('new_comment', (comment) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setIsSubmitting(true);
      await api.post(`/posts/${id}/comments`, { text: newComment });
      setNewComment('');
    } catch (err) {
      console.error('Failed to submit comment', err);
      alert('Failed to post your comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      alert("Please login to follow authors");
      return;
    }
    try {
      if (isFollowing) {
        await api.delete(`/users/${post.author._id}/follow`);
        setIsFollowing(false);
      } else {
        await api.post(`/users/${post.author._id}/follow`);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Follow error:', err);
      alert('Failed to follow/unfollow');
    }
  };

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

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;
  if (!post) return <div className="py-20 text-center">Post not found</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12 w-full">
      {/* Floating Actions Sidebar (Left) */}
      <aside className="hidden lg:flex w-20 flex-col items-center flex-shrink-0">
        <div className="floating-actions">
          <button className="p-3 text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-full transition-colors" aria-label="Like">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-3 text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-full transition-colors" aria-label="Comment">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button className="p-3 text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-full transition-colors" aria-label="Save">
            <Bookmark className="w-5 h-5" />
          </button>
          <div className="w-full h-px bg-[var(--border)] my-2"></div>
          <button className="p-3 text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-full transition-colors" aria-label="Share">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <article className="flex-1 max-w-3xl">
        {/* Cover Image */}
        {post.image ? (
          <img
            src={post.image.startsWith('http') ? post.image : `/uploads/${post.image}`}
            alt={post.title}
            className="blog-cover"
          />
        ) : (
          <div className="blog-cover bg-gradient-to-br from-[var(--accent-soft)] flex items-center justify-center border border-[var(--border)]">
             <span className="text-opacity-20 text-6xl font-brand italic text-[var(--ink)]">B</span>
          </div>
        )}

        {/* Title and Meta */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-brand font-black text-[var(--ink)] leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between pb-8 border-b border-[var(--border)]">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                  {post.author?.profilePicture ? (
                    <img src={post.author.profilePicture} alt={post.author.username} className="w-full h-full object-cover" />
                  ) : (
                    post.author?.username?.charAt(0).toUpperCase() || '?'
                  )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-[var(--ink)]">{post.author?.username || 'Unknown Author'}</p>
                  {user && user.id !== post.author?._id && (
                    <button 
                      onClick={handleFollow}
                      className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        isFollowing 
                          ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600' 
                          : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                  {user && user.id !== post.author?._id && (
                    <Link
                      to="/chat"
                      state={{ contact: post.author }}
                      className="text-xs font-semibold px-3 py-1 rounded-full border border-[var(--border)] text-[var(--ink)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" /> Message
                    </Link>
                  )}
                </div>
                <div className="flex items-center text-sm text-[var(--muted)] gap-2 mt-1">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{post.readTime || Math.max(1, Math.ceil((post.content || '').split(' ').length / 200))} min read</span>
                  <span>·</span>
                  <span>{post.views?.toLocaleString() || 0} views</span>
                  {post.category && (
                    <>
                      <span>·</span>
                      <span className="text-[var(--accent)]">{post.category?.name || post.category}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {user && user.id === (post.author?._id || post.author) && (
              <div className="flex gap-2">
                <Link
                  to={`/edit/${post._id}`}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-[var(--border)] text-red-500 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="blog-content whitespace-pre-wrap mb-16">
          {post.content}
        </div>

        {/* Comments Section */}
        <section id="comments" className="pt-12 border-t border-[var(--border)]">
          <h2 className="text-2xl font-bold font-brand text-[var(--ink)] mb-8 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" /> Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-10 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm">
              <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold flex-shrink-0 overflow-hidden">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user.username?.charAt(0).toUpperCase() || '?'
                    )}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="w-full bg-transparent resize-none outline-none placeholder-[var(--muted)] text-[var(--ink)] min-h-[60px]"
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newComment.trim()}
                      className="px-5 py-2 bg-[var(--ink)] text-[var(--bg)] font-medium rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
             <div className="mb-10 p-6 bg-[var(--accent-soft)] rounded-2xl border border-[var(--border)] text-center">
               <p className="text-[var(--ink)] mb-4">Want to join the conversation?</p>
               <Link to="/login" className="px-6 py-2 bg-[var(--ink)] text-[var(--bg)] font-medium rounded-full inline-block">Sign in to comment</Link>
             </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.slice().reverse().map((comment) => (
              <div key={comment._id} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold flex-shrink-0 overflow-hidden">
                   {comment.user?.profilePicture ? (
                     <img src={comment.user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     comment.user?.username?.charAt(0).toUpperCase() || '?'
                   )}
                </div>
                <div className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-2xl rounded-tl-sm p-4 relative group-hover:border-[var(--accent)] transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-[var(--ink)]">{comment.user?.username || 'Unknown User'}</h4>
                    <span className="text-xs text-[var(--muted)]">
                      {new Date(comment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                  <p className="text-[var(--ink)] whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-12 text-[var(--muted)] border border-dashed border-[var(--border)] rounded-2xl">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </section>
      </article>

      {/* Right Sidebar (Table of Contents / Discover) */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="blog-sidebar">
          <h3 className="font-semibold text-[var(--ink)] mb-4 text-sm uppercase tracking-wider">In this article</h3>
          <ul className="space-y-3 text-sm text-[var(--muted)]">
             <li className="hover:text-[var(--accent)] cursor-pointer transition-colors">Introduction</li>
             <li className="hover:text-[var(--accent)] cursor-pointer transition-colors">Key Points</li>
             <li className="hover:text-[var(--accent)] cursor-pointer transition-colors">Conclusion</li>
          </ul>
        </div>
      </aside>
    </main>
  );
};

export default PostDetails;
