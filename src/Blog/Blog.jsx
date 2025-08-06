import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import BlogList from './BlogList';
import { PlusCircle } from 'lucide-react';
import { enqueueSnackbar } from 'notistack';

const Blog = () => {
  const navigate = useNavigate();
  const { isLogin, user } = useContext(AuthContext);

  const handleAddBlog = () => {
    if (!isLogin) {
      enqueueSnackbar('Please login to create a blog', { variant: 'warning' });
      navigate('/login');
    } else if (user && user.role !== 'content_creator') {
      enqueueSnackbar('Only content creators can add blogs. Please login as a content creator.', { variant: 'warning' });
    } else {
      navigate('/blog/add');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm mb-8">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Stay Hub Blog</h1>
          <button
            onClick={handleAddBlog}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle size={20} />
            Add Blog
          </button>
        </div>
      </div>
      
      <BlogList />
    </div>
  );
};

export default Blog;