import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, Heart } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${blog._id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
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
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
          {blog.title}
        </h2>
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