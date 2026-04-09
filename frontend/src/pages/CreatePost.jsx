import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category || !description) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      let dataToUpload = { title, description, content, category };
      let config = {};

      if (image) {
        dataToUpload = new FormData();
        dataToUpload.append('title', title);
        dataToUpload.append('description', description);
        dataToUpload.append('content', content);
        dataToUpload.append('category', category);
        dataToUpload.append('image', image);
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }

      await api.post('/posts', dataToUpload, config);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl lg:text-5xl font-bold placeholder-gray-300 border-none focus:ring-0 p-0 bg-transparent text-gray-900"
            autoFocus
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Short description (max 500 chars)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xl text-gray-500 placeholder-gray-300 border-none focus:ring-0 p-0 bg-transparent"
            maxLength={500}
          />
        </div>

        <div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full max-w-xs border-gray-300 text-gray-600 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full max-w-xs text-sm text-gray-600"
          />
        </div>

        <div className="min-h-[400px]">
          <textarea
            placeholder="Start writing your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[500px] text-lg text-gray-800 placeholder-gray-300 border-none focus:ring-0 p-0 bg-transparent resize-none leading-relaxed"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
