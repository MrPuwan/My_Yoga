import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50">
      <Header />
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
};

export default Layout;
