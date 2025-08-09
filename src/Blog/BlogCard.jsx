import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, Heart, Trash2, MoreVertical } from 'lucide-react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const BlogCard = ({ blog, onDelete }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  // User from login has 'id', blog author has '_id'
  const isOwner = currentUser && blog.author && 
                  currentUser.id === blog.author._id;

  const handleClick = (e) => {
    // Don't navigate if clicking on menu or delete button
    if (e.target.closest('.menu-button') || e.target.closest('.menu-dropdown')) {
      return;
    }
    navigate(`/blog/${blog._id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/blogs/${blog._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      enqueueSnackbar('Blog deleted successfully!', { variant: 'success' });
      if (onDelete) {
        onDelete(blog._id);
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to delete blog', { variant: 'error' });
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden relative"
    >
      {blog.coverImage && (
        <div className="h-48 overflow-hidden">
          <img 
            src={blog.coverImage} 
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-800 line-clamp-2 flex-1">
            {blog.title}
          </h2>
          {isOwner && (
            <button
              className="menu-button ml-2 p-1 hover:bg-gray-100 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
              disabled={isDeleting}
            >
              <Trash2 size={18} className={`${isDeleting ? 'text-gray-400' : 'text-red-500 hover:text-red-600'}`} />
            </button>
          )}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content.replace(/<[^>]*>/g, '')}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <User size={16} />
              {blog.author?.name || 'Anonymous'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye size={16} />
              {blog.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={16} />
              {blog.likes || 0}
            </span>
          </div>
        </div>
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCard;