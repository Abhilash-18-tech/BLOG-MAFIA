import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    image: null
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setFormData({
          title: data.data.title,
          description: data.data.description,
          content: data.data.content,
          category: data.data.category?._id || data.data.category || '',
          image: null // We don't preload the file input
        });
      } catch (err) {
        setError('Failed to fetch post details');
      }
    };
    
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };

    fetchPost();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let config = {};

      let DataToUpload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category
      };

      if (formData.image) {
        config.headers = {
          'Content-Type': 'multipart/form-data'
        };
        DataToUpload = new FormData();
        DataToUpload.append('title', formData.title);
        DataToUpload.append('description', formData.description);
        DataToUpload.append('content', formData.content);
        DataToUpload.append('category', formData.category);
        DataToUpload.append('image', formData.image);
      }

      await api.put(`/posts/${id}`, DataToUpload, config);
      navigate(`/post/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-8 bg-white rounded shadow">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-600 hover:text-gray-900"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Post</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700">Short Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            maxLength={500}
            required
          />
        </div>

        <div>
            <label className="block text-gray-700">Content</label>
            <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded h-40"
                required
            />
        </div>

        <div>
           <label className="block text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
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
          <label className="block text-gray-700">Image (optional)</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
