import { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ categories, onSelectCategory, selectedCategory }) => {
  const [searchValue, setSearchValue] = useState('');

  // Dummy top posts
  const topPosts = [
    { id: 1, title: 'Understanding the minimal lifestyle', count: '10.5k' },
    { id: 2, title: 'Why white space is your friend', count: '8.2k' },
    { id: 3, title: 'How to make your blog stand out', count: '7.1k' },
    { id: 4, title: '10 React tips for beginners', count: '5.4k' }
  ];

  const popularTags = ['Design', 'Minimalism', 'React', 'Lifestyle', 'Coding', 'UI/UX', 'Productivity', 'Self Improvement'];

  return (
    <aside className="w-full flex flex-col gap-10">
      {/* 1. Search */}
      <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold font-brand text-[var(--ink)] mb-4">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] transition-shadow text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* 2. Categories with thumbnails */}
      <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold font-brand text-[var(--ink)] mb-4">Categories</h3>
        <div className="flex flex-col gap-3">
          <button
             onClick={() => onSelectCategory(null)}
             className={`flex items-center p-2 rounded-lg transition-colors text-left ${selectedCategory === null ? 'bg-gray-50 font-semibold text-[var(--accent)]' : 'text-gray-600 hover:bg-gray-50'}`}
          >
             <div className="w-10 h-10 rounded bg-gray-200 mr-3 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-400">All</div>
             <span className="text-sm">All Categories</span>
          </button>
          {categories.map((category, index) => (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              className={`flex items-center p-2 rounded-lg transition-colors text-left ${selectedCategory === category._id ? 'bg-gray-50 font-semibold text-[var(--accent)]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="w-10 h-10 rounded bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&auto=format&fit=crop&q=60&random=${index}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm flex-1">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Top Posts */}
      <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold font-brand text-[var(--ink)] mb-4">Top Posts</h3>
        <div className="flex flex-col gap-4">
          {topPosts.map((post, i) => (
            <Link key={post.id} to="#" className="flex gap-4 group">
              <span className="text-3xl font-brand font-black text-gray-200 group-hover:text-[var(--accent-soft)] transition-colors">
                0{i + 1}
              </span>
              <div className="flex flex-col justify-center">
                <h4 className="text-sm font-bold text-[var(--ink)] leading-tight group-hover:text-[var(--accent)] transition-colors mb-1">
                  {post.title}
                </h4>
                <span className="text-xs text-gray-400">{post.count} views</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Popular Tags / Newsletter */}
      <div className="bg-white rounded-[12px] shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold font-brand text-[var(--ink)] mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {popularTags.map((tag, i) => (
            <Link key={i} to={`/?q=${tag.toLowerCase()}`} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-500 text-xs font-medium rounded hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors">
              {tag}
            </Link>
          ))}
        </div>

        <div className="bg-[var(--ink)] p-5 rounded-lg text-center">
          <h4 className="text-white font-brand font-bold mb-2">Join our Newsletter</h4>
          <p className="text-gray-400 text-xs mb-4">Get the best stories delivered strictly to your inbox.</p>
          <div className="flex flex-col gap-2">
            <input type="email" placeholder="Email address" className="w-full py-2 px-3 text-sm rounded bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] placeholder:text-gray-500" />
            <button className="w-full py-2 bg-[var(--accent)] hover:bg-[var(--gold)] transition-colors text-white text-sm font-semibold rounded">Subscribe</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
