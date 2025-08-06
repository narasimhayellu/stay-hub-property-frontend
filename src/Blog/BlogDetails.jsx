import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, Heart, ArrowLeft, Tag } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
      setBlog(response.data);
      setError(null);
      
      // Increment view count
      await axios.post(`${API_BASE_URL}/api/blogs/${id}/view`);
    } catch (err) {
      setError('Failed to fetch blog details');
      console.error('Error fetching blog details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/blogs/${id}/like`);
      setBlog(prev => ({
        ...prev,
        likes: liked ? prev.likes - 1 : prev.likes + 1
      }));
      setLiked(!liked);
    } catch (err) {
      console.error('Error liking blog:', err);
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {blog.title}
          </h1>

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
    </div>
  );
};

export default BlogDetails;