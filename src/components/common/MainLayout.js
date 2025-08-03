import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SidebarNav from '../layout/SidebarNav';
import { useLocation, Outlet } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/' || location.pathname === '/teacher-dashboard' || location.pathname.startsWith('/teacher-dashboard/class/') || location.pathname.startsWith('/parent-dashboard');
  return (
  <>
    <Navbar />
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 120px)' }}>
        {!hideSidebar && <SidebarNav />}
      <main style={{ flex: 1, padding: '2.5rem 3rem', background: '#f7f6f2', minHeight: '100vh', overflowY: 'auto' }}>
          <Outlet />
      </main>
    </div>
    <Footer />
  </>
);
};

export default MainLayout; 
 
 