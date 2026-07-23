import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="p-8 max-w-md mx-auto text-center space-y-4 mt-16">
      <h1 className="text-4xl font-bold text-slate-800">404</h1>
      <p className="text-slate-600">Page Not Found</p>
      <Link to="/" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Return Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
