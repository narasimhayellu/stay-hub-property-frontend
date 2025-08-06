import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Contact Us</h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          We're here to help! Whether you have a question, need assistance with a booking, or want to list your property — feel free to reach out. 
          The StayHub team is always ready to assist you.
        </p>

        <div className="space-y-8">
          {/* General Inquiries */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">General Inquiries</h2>
            <p className="text-gray-700 mb-3">For any general questions about StayHub, our services, or how to use the platform:</p>
            <div className="space-y-2 text-gray-600">
              <p>Email: <a href="mailto:support@stayhub.com" className="text-indigo-600 hover:underline">support@stayhub.com</a></p>
              <p>Phone: <a href="tel:+919876543210" className="text-indigo-600 hover:underline">+91-98765-43210</a></p>
              <p>Address: StayHub Pvt. Ltd., 2nd Floor, Tech Park, Hyderabad, India</p>
            </div>
          </div>

          {/* Technical Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Technical Support</h2>
            <p className="text-gray-700 mb-3">Having trouble using the app or facing a bug?</p>
            <p className="text-gray-600"> Email us at: <a href="mailto:tech@stayhub.com" className="text-indigo-600 hover:underline">tech@stayhub.com</a></p>
          </div>

          {/* List Your Property */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">List Your Property</h2>
            <p className="text-gray-700 mb-3">Want to become a StayHub host and reach thousands of users?</p>
            <p className="text-gray-600"> Email our partnerships team at: <a href="mailto:partners@stayhub.com" className="text-indigo-600 hover:underline">partners@stayhub.com</a></p>
          </div>

          {/* Follow Us */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Follow Us</h2>
            <p className="text-gray-700 mb-3">Stay connected and get updates about new listings, features, and offers:</p>
            <div className="space-y-2 text-gray-600">
              <p>Instagram: <a href="https://instagram.com/stayhub_official" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">@stayhub_official</a></p>
              <p>Facebook: <a href="https://facebook.com/stayhub" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">facebook.com/stayhub</a></p>
              <p>Twitter/X: <a href="https://twitter.com/stayhub" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">@stayhub</a></p>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Feedback or Suggestions?</h2>
            <p className="text-gray-700 mb-3">We value your feedback! Let us know how we can improve or what you'd like to see next.</p>
            <p className="text-gray-600">Submit your suggestions at: <a href="https://feedback.stayhub.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">feedback.stayhub.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;