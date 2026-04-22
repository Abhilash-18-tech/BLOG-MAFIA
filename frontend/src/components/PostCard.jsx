import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Copy,
  Link2,
  MessageCircle
} from 'lucide-react';

const PostCard = ({ post, user, onDelete, isInitiallyLiked, isInitiallySaved }) => {
  const isOwner = user && user.id === (post.author?._id || post.author);
  const cardRef = useRef(null);
  const shareRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(Boolean(isInitiallyLiked));
  const [isSaved, setIsSaved] = useState(Boolean(isInitiallySaved));
  const [likeCount, setLikeCount] = useState(post.likesCount ?? 12);
  const [commentCount, setCommentCount] = useState(post.comments?.length || post.commentsCount || 0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [isSharing, setIsSharing] = useState(false);
  const [isLikeBump, setIsLikeBump] = useState(false);
  const [isActionBusy, setIsActionBusy] = useState(false);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsSharing(false);
      }
    };
    if (isSharing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSharing]);

  useEffect(() => {
    setIsLiked(Boolean(isInitiallyLiked));
    setIsSaved(Boolean(isInitiallySaved));
  }, [isInitiallyLiked, isInitiallySaved, post._id]);

  const handleLike = async () => {
    if (isActionBusy) return;
    if (!user) {
      alert('Please sign in to like posts.');
      return;
    }
    setIsActionBusy(true);
    const prevLiked = isLiked;
    const prevCount = likeCount;
    const nextLiked = !prevLiked;

    setIsLiked(nextLiked);
    setLikeCount(nextLiked ? prevCount + 1 : Math.max(prevCount - 1, 0));
    setIsLikeBump(true);
    setTimeout(() => setIsLikeBump(false), 260);

    try {
      const response = nextLiked
        ? await api.post(`/posts/${post._id}/like`)
        : await api.delete(`/posts/${post._id}/like`);
      const serverCount = response.data?.data?.likesCount;
      if (typeof serverCount === 'number') {
        setLikeCount(serverCount);
      }
    } catch (error) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setTimeout(() => setIsActionBusy(false), 400);
    }
  };

  const handleSave = async () => {
    if (isActionBusy) return;
    if (!user) {
      alert('Please sign in to save posts.');
      return;
    }
    setIsActionBusy(true);
    const prevSaved = isSaved;
    const nextSaved = !prevSaved;
    setIsSaved(nextSaved);

    try {
      if (nextSaved) {
        await api.post(`/posts/${post._id}/save`);
      } else {
        await api.delete(`/posts/${post._id}/save`);
      }
    } catch (error) {
      setIsSaved(prevSaved);
    } finally {
      setTimeout(() => setIsActionBusy(false), 300);
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!commentValue.trim() || isActionBusy) return;
    
    setIsActionBusy(true);
    try {
      const res = await api.post(`/posts/${post._id}/comments`, { text: commentValue.trim() });
      const addedComment = res.data.data;
      setComments((prev) => [...prev, addedComment]);
      setCommentValue('');
      setCommentCount((prev) => prev + 1);
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/posts/${post._id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
    setIsSharing(false);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
      }}
      className="bg-white rounded-[12px] shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col group transition-all duration-300 ease-out hover:-translate-y-1"
    >
      <Link to={`/posts/${post._id}`} className="block relative h-48 sm:h-[220px] overflow-hidden bg-gray-50 flex-shrink-0">
        {post.image ? (
          <img
            src={post.image.startsWith('http') ? post.image : `/uploads/${post.image}`}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <img
            src={`https://loremflickr.com/600/400/${encodeURIComponent(post.category?.name || 'blog').toLowerCase()}?lock=${post._id}`}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/${post._id}/600/400`;
            }}
          />
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-[var(--accent)] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {post.category?.name || 'Uncategorized'}
          </span>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center text-xs text-gray-400 mb-3 space-x-2 font-medium">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-white text-[9px] uppercase overflow-hidden">
              {post.author?.profilePicture ? (
                <img src={post.author.profilePicture} alt={post.author.username} className="w-full h-full object-cover" />
              ) : (
                post.author?.username?.charAt(0) || '?'
              )}
          </div>
          <span className="text-[var(--ink)]">{post.author?.username || 'Unknown'}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>•</span>
          <span>{post.readTime || 1} min read</span>
        </div>
        
        <Link to={`/posts/${post._id}`} className="block flex-1 group-hover:text-[var(--accent)] transition-colors">
          <h2 className="text-xl font-bold font-brand text-[var(--ink)] leading-snug mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
            {post.description || 'No description provided for this post...'}
          </p>
        </Link>
        
        {/* Actions Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleLike}
              disabled={isActionBusy}
              className={`flex items-center gap-1.5 text-xs font-medium transition ${
                isLiked ? 'text-red-500' : 'text-gray-400 hover:text-[var(--accent)]'
              }`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-4 h-4 ${isLikeBump ? 'scale-125' : 'scale-100'} transition-transform ${
                  isLiked ? 'fill-current' : ''
                }`}
              />
              {likeCount}
            </button>
            <button
              onClick={() => setIsCommentOpen(!isCommentOpen)}
              className={`flex items-center gap-1.5 text-xs font-medium transition ${
                isCommentOpen ? 'text-[var(--accent)]' : 'text-gray-400 hover:text-[var(--accent)]'
              }`}
              aria-label="Comments"
            >
              <MessageCircle className="w-4 h-4" />
              {commentCount}
            </button>
          </div>
          
          <div className="flex gap-2">
             <button
                type="button"
                onClick={handleSave}
                disabled={isActionBusy}
                className={`flex items-center justify-center p-1.5 rounded-full transition ${
                  isSaved ? 'text-[var(--accent)] bg-[var(--accent-soft)]' : 'text-gray-400 hover:text-[var(--accent)] hover:bg-gray-100'
                }`}
                aria-label={isSaved ? 'Unsave' : 'Save'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
             </button>
             {isOwner && (
                <button
                  type="button"
                  onClick={() => onDelete(post._id)}
                  className="flex items-center justify-center p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                  aria-label="Delete post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
             )}
          </div>
        </div>

        {/* Inline Comments Area (simplified) */}
        {isCommentOpen && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
             {user ? (
               <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                  placeholder="Add a comment..." 
                  className="w-full text-sm py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
                <button type="submit" disabled={!commentValue.trim()} className="bg-[var(--ink)] text-white px-3 py-1.5 text-xs font-semibold rounded-lg flex-shrink-0 disabled:opacity-50">
                  Post
                </button>
               </form>
             ) : (
               <div className="bg-gray-50 p-2 rounded text-center mb-4 text-xs text-gray-500">
                 Please <Link to="/login" className="text-[var(--accent)] font-semibold hover:underline">sign in</Link> to reply.
               </div>
             )}
             
             <div className="space-y-3">
                {comments.map(c => (
                  <div key={c._id || c.id} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                      {(c.user?.username || c.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 bg-gray-50 p-2 rounded-lg text-xs border border-gray-100">
                      <p className="font-bold text-gray-800 mb-0.5">{c.user?.username || c.name}</p>
                      <p className="text-gray-600 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;
