import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import { ArrowLeft, Upload, X } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { enqueueSnackbar } from 'notistack';

const AddBlog = () => {
  const navigate = useNavigate();
  const { isLogin, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    coverImage: null
  });
  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    if (!isLogin) {
      enqueueSnackbar('Please login to create a blog', { variant: 'error' });
      navigate('/login');
    }
  }, [isLogin, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar('Image size should be less than 5MB', { variant: 'error' });
        return;
      }
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: null
    }));
    setImagePreview(null);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('tags', JSON.stringify(formData.tags));
      if (formData.coverImage) {
        data.append('coverImage', formData.coverImage);
      }

      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/api/blogs`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      enqueueSnackbar('Blog created successfully!', { variant: 'success' });
      navigate(`/blog/${response.data._id}`);
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to create blog', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <button
        onClick={() => navigate('/blog')}
        className="mb-6 text-indigo-600 hover:underline flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Blogs
      </button>

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create New Blog</h1>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-gray-700 font-semibold mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              placeholder="Enter your blog title"
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-gray-700 font-semibold mb-2">
              Cover Image
            </label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="coverImage"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <span className="text-gray-600">Click to upload cover image</span>
                  <span className="text-sm text-gray-500 mt-2">Maximum size: 5MB</span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-gray-700 font-semibold mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder="Write your blog content here..."
              required
              style={{ minHeight: '400px' }}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-gray-700 font-semibold mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type a tag and press Enter"
            />
            {formData.tags.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full flex items-center gap-2"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-indigo-800 hover:text-indigo-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white transition-colors`}
            >
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;