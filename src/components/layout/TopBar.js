import React, { useState } from 'react';
import { FaBell, FaBars, FaTimes, FaBookOpen, FaChartBar, FaUser, FaChalkboardTeacher, FaCog, FaUsers } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/Afrolearn Logo_edited_edited.png';

const navLinks = [
  { to: '/dashboard', label: 'My Courses', icon: <FaBookOpen /> },
  { to: '/progress', label: 'Progress', icon: <FaChartBar /> },
  { to: '/profile', label: 'Profile', icon: <FaUser /> },
  { to: '/community', label: 'Community', icon: <FaUsers /> },
  { to: '/teachers', label: 'Teachers/Mentors', icon: <FaChalkboardTeacher /> },
  { to: '/settings', label: 'Settings', icon: <FaCog /> },
];

const TopBar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      setNotifications(await res.json());
    } catch (err) {
      setNotifError('Failed to load notifications');
    } finally {
      setNotifLoading(false);
    }
  };

  const handleBellClick = () => {
    setNotifOpen((open) => !open);
    if (!notifOpen) fetchNotifications();
  };

  const handleMarkRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    } catch {}
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className="afl-topbar-mobile" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.7rem 1rem',
        background: '#fff',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        minHeight: 56,
      }}>
        {/* Logo (center) */}
        <div style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo} alt="AfroLearn logo" style={{ height: 32, width: 'auto', marginRight: 8 }} />
          <span style={{ fontWeight: 700, fontSize: 20, color: '#2bb6bb', letterSpacing: 1 }}>AfroLearn</span>
        </div>
        {/* Bell icon (notifications) */}
        {user && (
          <div style={{ position: 'relative', marginRight: 8, display: 'inline-block' }}>
            <button
              className="afl-bell"
              style={{ background: 'none', border: 'none', color: '#ff9800', fontSize: 20, cursor: 'pointer', position: 'relative' }}
              onClick={handleBellClick}
              aria-label="Notifications"
            >
              <FaBell />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: '#e82630', color: '#fff', borderRadius: '50%', fontSize: 12, fontWeight: 700, padding: '2px 6px', minWidth: 18, textAlign: 'center' }}>{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute', right: 0, top: 36, background: '#fff', boxShadow: '0 2px 8px #eee', borderRadius: 10, minWidth: 260, zIndex: 201, maxWidth: '90vw', maxHeight: 350, overflowY: 'auto' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#2d3a2e', padding: '0.7rem 1rem', borderBottom: '1px solid #eee' }}>Notifications</div>
                {notifLoading ? (
                  <div style={{ padding: '1rem', color: '#888' }}>Loading...</div>
                ) : notifError ? (
                  <div style={{ padding: '1rem', color: 'red' }}>{notifError}</div>
                ) : notifications.length === 0 ? (
                  <div style={{ padding: '1rem', color: '#888' }}>No notifications yet.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #f0f0f0', background: n.read ? '#fff' : '#ffe08222', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: n.read ? 400 : 700, color: n.read ? '#888' : '#2d3a2e' }}>{n.message}</div>
                        <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                      {!n.read && (
                        <button onClick={() => handleMarkRead(n.id)} style={{ background: 'none', border: 'none', color: '#2bb6bb', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Mark read</button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {/* Hamburger menu (right) */}
        <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#2d3a2e' }}>
          <FaBars />
        </button>
      </nav>
      {/* Mobile nav drawer */}
      {menuOpen && (
        <>
          <div
            className="afl-mobile-nav-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.32)',
              zIndex: 200,
            }}
            onClick={() => setMenuOpen(false)}
          />
          <aside
            className="afl-mobile-nav-drawer"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 260,
              height: '100vh',
              background: '#fff',
              boxShadow: '2px 0 16px rgba(0,0,0,0.08)',
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              padding: '1.2rem 1rem 1rem 1rem',
              animation: 'slideInLeft 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <img src={logo} alt="AfroLearn logo" style={{ height: 28, width: 'auto' }} />
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: 26, color: '#2d3a2e', cursor: 'pointer' }}>
                <FaTimes />
              </button>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 'afl-mobile-nav-link' + (isActive ? ' active' : '')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '0.7rem 0.8rem', borderRadius: 8, color: '#2d3a2e', fontWeight: 500, fontSize: 16, textDecoration: 'none', transition: 'background 0.15s',
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <span style={{ fontSize: 20 }}>{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
            {user && (
              <button
                onClick={handleLogout}
                style={{
                  marginTop: 'auto',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#e82630',
                  fontWeight: 600,
                  fontSize: 16,
                  padding: '0.9rem 0',
                  borderRadius: 8,
                  cursor: 'pointer',
                  marginBottom: 8,
                }}
              >
                Log out
              </button>
            )}
          </aside>
        </>
      )}
    </>
  );
};

export default TopBar; 

