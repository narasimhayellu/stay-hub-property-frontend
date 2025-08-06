import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">About StayHub</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Welcome to StayHub – your trusted platform for finding, listing, and managing stays with ease and convenience.
        </p>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          At StayHub, we believe that finding the perfect home, rental, or vacation property shouldn't be complicated. 
          Whether you're a traveler seeking short-term accommodation, a student looking for a budget-friendly room, 
          or a host wanting to list your property, StayHub makes the entire process smooth, secure, and simple.
        </p>
        <div className="bg-indigo-50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-800">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To connect people with stays they love — offering reliability, transparency, and a platform where every listing feels like home.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;