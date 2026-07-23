import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-[#d8decb] bg-[#eaeee3]/95 px-4 py-3 backdrop-blur sm:px-6">
      <Link to="/" className="home-display flex items-center gap-2 text-xl font-semibold italic text-[#1f2a24]">
        <span className="size-5 rounded-full bg-gradient-to-b from-[#c0812e] to-[#233329]" />
        MyYoga
      </Link>
      <nav className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs font-medium text-[#5b6b5e] sm:w-auto sm:justify-end sm:gap-x-4 sm:text-sm">
        <Link to="/" className="hover:text-[#1f2a24]">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-[#1f2a24]">Dashboard</Link>
            <Link to="/health-profile" className="hover:text-[#1f2a24]">
              Health Profile
            </Link>
            <Link to="/recommendations" className="hover:text-[#1f2a24]">
              Recommendations
            </Link>
            <Link to="/yoga-poses" className="hover:text-[#1f2a24]">
              Yoga Poses
            </Link>
            {user.role === 'ADMIN' && (
              <Link
                to="/admin/yoga-poses"
                className="hover:text-[#1f2a24]"
              >
                Manage Poses
              </Link>
            )}
            <button type="button" onClick={handleLogout} className="hover:text-[#1f2a24]">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-[#1f2a24]">Login</Link>
            <Link
              to="/register"
              className="rounded-full bg-[#c0812e] px-4 py-2 text-[#1a261f] hover:bg-[#a66e24]"
            >
              Get started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
