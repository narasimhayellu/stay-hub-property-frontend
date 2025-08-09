import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, Heart, ArrowLeft, Tag, Trash2, Edit2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useSnackbar } from 'notistack';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Debug logging
  useEffect(() => {
    if (blog && currentUser) {
      console.log('Current user:', currentUser);
      console.log('Blog author:', blog.author);
      console.log('User ID:', currentUser.id || currentUser._id);
      console.log('Author ID:', blog.author?._id || blog.author);
    }
  }, [blog, currentUser]);

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blogs/${id}`);
      setBlog(response.data);
      setError(null);
      
      // Increment view count
      await axios.post(`/api/blogs/${id}/view`);
    } catch (err) {
      setError('Failed to fetch blog details');
      console.error('Error fetching blog details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/blogs/${id}/like`);
      setBlog(prev => ({
        ...prev,
        likes: liked ? prev.likes - 1 : prev.likes + 1
      }));
      setLiked(!liked);
    } catch (err) {
      console.error('Error liking blog:', err);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      enqueueSnackbar('Blog deleted successfully!', { variant: 'success' });
      navigate('/blogs');
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to delete blog', { variant: 'error' });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">{error || 'Blog not found'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="text-indigo-600 hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} />
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate('/blog')}
        className="mb-6 text-indigo-600 hover:underline flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Blogs
      </button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {blog.coverImage && (
          <div className="h-96 overflow-hidden">
            <img 
              src={blog.coverImage} 
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              {blog.title}
            </h1>
            {/* Show edit and delete buttons only if current user is the author */}
            {currentUser && blog.author && 
             currentUser.id === blog.author._id && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/blog/${id}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <div className="flex items-center gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <User size={18} />
                {blog.author?.name || 'Anonymous'}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-gray-600">
                <Eye size={18} />
                {blog.views || 0} views
              </span>
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                {blog.likes || 0}
              </button>
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <Tag size={18} className="text-gray-500" />
              <div className="flex gap-2 flex-wrap">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;