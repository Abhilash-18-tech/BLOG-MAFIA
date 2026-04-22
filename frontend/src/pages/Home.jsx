import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [listError, setListError] = useState('');
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef(null);

  const searchTerm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('q') || '').trim().toLowerCase();
  }, [location.search]);

  // Client-side filtering is retained for search terms on currently fetched subset.
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    return posts.filter((post) => {
      const title = post.title?.toLowerCase() || '';
      const description = post.description?.toLowerCase() || '';
      const author = post.author?.username?.toLowerCase() || '';
      const category = post.category?.name?.toLowerCase() || '';
      return (
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        author.includes(searchTerm) ||
        category.includes(searchTerm)
      );
    });
  }, [posts, searchTerm]);

  // Reset pagination when category changes
  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to fetch categories:');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (page === 1) setLoading(true);
      else setIsFetchingMore(true);

      try {
        let url = `/posts?page=${page}&limit=5`;
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }
        
        const res = await api.get(url);
        const { data, currentPage, totalPages } = res.data;

        if (page === 1) {
          setPosts(data);
        } else {
          setPosts(prev => {
            const newPosts = data.filter(p => !prev.some(ep => ep._id === p._id));
            return [...prev, ...newPosts];
          });
        }

        setTotalPages(totalPages);
        setHasMore(currentPage < totalPages);
        setError('');
      } catch (err) {
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };
    
    // In case user searches, we don't spam the paginated API as search is client-side right now
    fetchPosts();
  }, [selectedCategory, page, searchTerm]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!observerTarget.current || !hasMore || loading || isFetchingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerTarget.current);
    
    return () => observer.disconnect();
  }, [hasMore, loading, isFetchingMore]);

  useEffect(() => {
    const fetchUserLists = async () => {
      if (!user) {
        setLikedIds([]);
        setSavedIds([]);
        setListError('');
        return;
      }

      try {
        const [savedRes, likedRes] = await Promise.all([
          api.get('/users/me/saved'),
          api.get('/users/me/liked')
        ]);
        setSavedIds(savedRes.data?.data?.map((post) => post._id) || []);
        setLikedIds(likedRes.data?.data?.map((post) => post._id) || []);
        setListError('');
      } catch (err) {
        setListError(err.response?.data?.error || 'Failed to fetch saved/liked posts.');
      }
    };

    fetchUserLists();
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
    <div className="w-full flex justify-center flex-col items-center pb-20">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 w-full">
                <div className="mb-10 pb-6 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Curated for you</p>
                <h1 className="text-4xl font-brand font-bold text-[var(--ink)] mt-3">
                {selectedCategory 
                  ? `${categories.find(c => c._id === selectedCategory)?.name || ''} Articles` 
                  : 'Latest Articles'}
                </h1>
              </div>
            </div>
            
            {loading && page === 1 ? (
              <div className="py-6"><Loader /></div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-[var(--muted)] text-center py-20 flex flex-col items-center bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-sm">
                 <div className="w-16 h-16 bg-[var(--accent-soft)] rounded-full flex items-center justify-center mb-4 text-[var(--accent)]">
                    <span className="text-2xl">B</span>
                 </div>
                 <h3 className="text-2xl font-brand font-bold text-[var(--ink)] mb-2">
                   {searchTerm ? 'No matches found' : 'No articles yet'}
                 </h3>
                 <p className="mb-6 max-w-sm">
                   {searchTerm
                     ? 'Try a different keyword or clear your search.'
                     : 'There are no stories published in this category right now. Be the first to share your thoughts.'}
                 </p>
                 {!searchTerm && (user ? (
                   <Link to="/create-post" className="btn-primary px-6 py-3 rounded-full text-sm font-semibold">
                     Start writing
                   </Link>
                 ) : (
                   <Link to="/register" className="btn-primary px-6 py-3 rounded-full text-sm font-semibold">
                     Create your first post
                   </Link>
                 ))}
              </div>
            ) : (
              <>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                >
                  {listError && (
                    <div className="col-span-1 md:col-span-2 mb-6 bg-amber-50 text-amber-700 p-4 rounded-md">
                      {listError}
                    </div>
                  )}
                  {actionError && (
                    <div className="col-span-1 md:col-span-2 mb-6 bg-red-50 text-red-600 p-4 rounded-md">
                      {actionError}
                    </div>
                  )}
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      user={user}
                      onDelete={handleDeletePost}
                      isInitiallyLiked={likedIds.includes(post._id)}
                      isInitiallySaved={savedIds.includes(post._id)}
                    />
                  ))}
                </motion.div>
                
                {hasMore && (
                  <div className="mt-12 flex justify-center pb-8" ref={observerTarget}>
                    <button 
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={isFetchingMore}
                      className="px-8 py-3 bg-[var(--ink)] hover:bg-black text-white font-medium rounded-full transition-all hover:scale-105 shadow-md disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isFetchingMore ? 'Loading More...' : 'Load More'}
                    </button>
                  </div>
                )}
                {!hasMore && filteredPosts.length > 0 && (
                  <div className="mt-12 flex justify-center pb-8 text-[var(--muted)] text-sm">
                    No more posts to load.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 lg:border-l border-[var(--border)] lg:pl-10">
            <div className="sticky top-24 self-start">
              <Sidebar 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;