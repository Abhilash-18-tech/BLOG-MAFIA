import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [commentCount, setCommentCount] = useState(post.commentsCount ?? 3);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [comments, setComments] = useState([
    { id: 1, name: 'Ava Reed', text: 'Loved this insight. Clean and sharp.' },
    { id: 2, name: 'Marco Li', text: 'This made my morning routine better.' }
  ]);
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

  const handleAddComment = (event) => {
    event.preventDefault();
    if (!commentValue.trim()) return;
    const newComment = {
      id: Date.now(),
      name: user?.username || 'Guest',
      text: commentValue.trim()
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentValue('');
    setCommentCount((prev) => prev + 1);
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
    <div
      ref={cardRef}
      className={`post-card mb-10 card-reveal ${isVisible ? 'card-visible' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-[var(--accent)] to-[var(--gold)] rounded-full flex items-center justify-center font-semibold text-white text-[11px] uppercase shadow-sm">
          {post.author?.username?.charAt(0) || '?'}
        </div>
        <span className="text-[13px] font-medium text-[var(--ink)] border-b border-transparent group-hover:border-[var(--ink)] transition">
          {post.author?.username || 'Unknown Author'}
        </span>
        <span className="text-gray-300 text-xs">•</span>
        <span className="text-[13px] text-[var(--muted)]">
          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      
      <Link to={`/posts/${post._id}`} className="block mt-2 flex-1">
         <div className="flex justify-between items-start gap-6">
            <div className="max-w-[75%]">
              <h2 className="text-2xl font-brand font-bold text-[var(--ink)] mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors">
                {post.title}
              </h2>
              <p className="text-[var(--muted)] text-[15px] leading-relaxed line-clamp-3">
                {post.description}
              </p>
            </div>
            
            {/* Optional Thumbnail on the right */}
            <div className="w-[140px] h-[140px] bg-slate-100/50 rounded-2xl hidden sm:block overflow-hidden relative">
              {post.image ? (
                <img
                  src={post.image.startsWith('http') ? post.image : `/uploads/${post.image}`}
                  alt={post.title}
                  className="post-image w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <span className="text-4xl font-brand text-slate-400 italic">B</span>
                </div>
              )}
            </div>
         </div>
      </Link>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium pill cursor-pointer">
            {post.category?.name || 'Uncategorized'}
          </span>
          <span className="text-[13px] text-[var(--muted)]">4 min read</span>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <Link
              to={`/edit/${post._id}`}
              className="px-3 py-1 text-xs bg-[var(--gold)] text-white rounded-full hover:opacity-90"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => onDelete?.(post._id)}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="interaction-bar mt-6">
        <div className="interaction-left">
          <button
            type="button"
            onClick={handleLike}
            className={`action-btn ${isLiked ? 'action-active' : ''} ${isLikeBump ? 'action-bump' : ''}`}
            disabled={isActionBusy}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCommentOpen((prev) => !prev)}
            className="action-btn"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{commentCount}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`action-btn ${isSaved ? 'action-active' : ''}`}
            disabled={isActionBusy}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
        <div className="interaction-right" ref={shareRef}>
          <button
            type="button"
            className="action-btn"
            onClick={() => setIsSharing((prev) => !prev)}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          {isSharing && (
            <div className="share-menu">
              <button type="button" onClick={handleCopyLink} className="share-item">
                <Copy className="w-4 h-4" />
                Copy link
              </button>
              <button type="button" className="share-item">
                <Link2 className="w-4 h-4" />
                Twitter
              </button>
              <button type="button" className="share-item">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>

      {isCommentOpen && (
        <div className="comment-panel">
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentValue}
              onChange={(event) => setCommentValue(event.target.value)}
              className="comment-input"
            />
            <button type="submit" className="comment-submit">
              Post
            </button>
          </form>
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar">
                  {comment.name.charAt(0)}
                </div>
                <div>
                  <p className="comment-name">{comment.name}</p>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
