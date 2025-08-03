import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import logo from '../../assets/images/Afrolearn Logo_edited_edited.png';
import { FaChevronDown, FaBell } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchTimeout = useRef();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenu]);

  // Fetch notifications when bell is opened
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

  const unreadCount = notifications.filter(n => !n.read).length;

  // Debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setSearchError(null);
    setSearchResults([]);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value.trim().length < 2) {
      setSearchOpen(false);
      return;
    }
    setSearchLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/courses?query=${encodeURIComponent(value)}`);
        if (!res.ok) throw new Error('Failed to search');
        const data = await res.json();
        setSearchResults(data);
        setSearchOpen(true);
      } catch (err) {
        setSearchError('Failed to search');
        setSearchOpen(true);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  const handleSearchSelect = async (item) => {
    setSearchOpen(false);
    setSearch('');
    setSearchResults([]);
    if (item.type === 'lesson') {
      // Fetch lesson, unit, subject, grade
      try {
        const lessonRes = await fetch(`/api/lesson/${item.id}`);
        if (!lessonRes.ok) throw new Error('Lesson fetch failed');
        const lesson = await lessonRes.json();
        const unitRes = await fetch(`/api/unit/${lesson.unitId}`);
        if (!unitRes.ok) throw new Error('Unit fetch failed');
        const unit = await unitRes.json();
        const subjectRes = await fetch('/api/subjects');
        if (!subjectRes.ok) throw new Error('Subjects fetch failed');
        const subjects = await subjectRes.json();
        const subject = Array.isArray(subjects) ? subjects.find(s => s.id === unit.subjectId) : null;
        const gradeRes = await fetch('/api/grades');
        if (!gradeRes.ok) throw new Error('Grades fetch failed');
        const grades = await gradeRes.json();
        const grade = Array.isArray(grades) ? grades.find(g => g.id === unit.gradeId) : null;
        if (lesson && unit && subject && grade) {
          navigate('/dashboard', { state: { lesson, unit, subject, grade } });
        } else {
          alert('Could not find all required data for this lesson.');
        }
      } catch (err) {
        alert('Failed to load lesson context: ' + err.message);
      }
    } else if (item.type === 'unit') {
      navigate(`/unit/${item.id}`);
    } else if (item.type === 'subject') {
      navigate(`/subject/${item.id}`);
    } else {
      navigate('/dashboard');
      alert('Unknown type: ' + item.type);
    }
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenu(false);
    navigate('/');
  };

  return (
    <header className="afl-navbar">
      <nav className="afl-navbar-inner">
        {/* Left: Explore + Search */}
        <div className="afl-navbar-left">
          <div className="afl-dropdown" onMouseEnter={() => setExploreOpen(true)} onMouseLeave={() => setExploreOpen(false)}>
            <button className="afl-dropdown-btn" aria-haspopup="true" aria-expanded={exploreOpen}>
              Explore <span aria-hidden>▼</span>
            </button>
            {exploreOpen && (
              <ul className="afl-dropdown-menu" role="menu">
                <li role="menuitem"><a href="/math">Math</a></li>
                <li role="menuitem"><a href="/english">English</a></li>
                <li role="menuitem"><a href="/science">Science</a></li>
                <li role="menuitem"><a href="/social-studies">Social Studies</a></li>
                <li role="menuitem"><a href="/cultural-corner">Culture</a></li>
                <li role="menuitem"><a href="/money-smart">Financial Literacy</a></li>
                <li role="menuitem"><a href="/code-club">Programming</a></li>
              </ul>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <form className="afl-search" role="search" aria-label="Site search" autoComplete="off" onSubmit={e => e.preventDefault()}>
              <input
                type="search"
                placeholder="Search courses, lessons..."
                aria-label="Search"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                style={{ minWidth: 180 }}
              />
              <button type="submit" aria-label="Submit search">🔍</button>
            </form>
            {searchOpen && (
              <div style={{ position: 'absolute', left: 0, top: '110%', background: '#fff', boxShadow: '0 2px 8px #eee', borderRadius: 8, minWidth: 260, zIndex: 30, maxHeight: 350, overflowY: 'auto' }}>
                {searchLoading ? (
                  <div style={{ padding: '1rem', color: '#888' }}>Searching...</div>
                ) : searchError ? (
                  <div style={{ padding: '1rem', color: 'red' }}>{searchError}</div>
                ) : searchResults.length === 0 ? (
                  <div style={{ padding: '1rem', color: '#888' }}>No results found.</div>
                ) : (
                  searchResults.map(item => (
                    <div key={item.type + '-' + item.id} style={{ padding: '0.7rem 1rem', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: '#fff' }} onMouseDown={() => handleSearchSelect(item)}>
                      <div style={{ fontWeight: 600, color: '#2bb6bb', fontSize: 14 }}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      {item.snippet && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.snippet}</div>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {/* Center: Logo + Text */}
        <div className="afl-navbar-center" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {logo ? (
            <>
              <img src={logo} alt="Afro-Learn logo" className="afl-logo" />
              <span className="afl-logo-text">AfroLearn</span>
            </>
          ) : (
            <span className="afl-logo-text">AfroLearn</span>
          )}
        </div>
        {/* Right: User info or Auth buttons */}
        <div className="afl-navbar-right">
          {user && (
            <div style={{ position: 'relative', marginRight: 18, display: 'inline-block' }}>
              <button
                className="afl-bell"
                style={{ background: 'none', border: 'none', color: '#2d3a2e', fontSize: 22, cursor: 'pointer', position: 'relative' }}
                onClick={handleBellClick}
                aria-label="Notifications"
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, background: '#e82630', color: '#fff', borderRadius: '50%', fontSize: 12, fontWeight: 700, padding: '2px 6px', minWidth: 18, textAlign: 'center' }}>{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div style={{ position: 'absolute', right: 0, top: 36, background: '#fff', boxShadow: '0 2px 8px #eee', borderRadius: 10, minWidth: 320, zIndex: 20, maxHeight: 400, overflowY: 'auto' }}>
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
          {user ? (
            <div className="afl-user-dropdown" style={{ position: 'relative' }}>
              <button
                className="afl-user-name"
                style={{ background: 'none', border: 'none', color: '#2d3a2e', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                Hi, {user.name}! <FaChevronDown style={{ fontSize: 14 }} />
              </button>
              {userMenuOpen && (
                <div className="afl-user-menu" style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', boxShadow: '0 2px 8px #eee', borderRadius: 8, minWidth: 120, zIndex: 10 }}>
                  <button className="afl-logout" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', color: '#e82630', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 500, cursor: 'pointer', borderRadius: 8 }}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login" className="afl-login">Log in</a>
              <a href="/signup" className="afl-signup">Sign up</a>
            </>
          )}
          <button className="afl-hamburger" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      {/* Mobile menu overlay */}
      {mobileMenu && <div className="afl-mobile-overlay" onClick={() => setMobileMenu(false)} />}
      {/* Mobile menu */}
      {mobileMenu && (
        <div className="afl-mobile-menu" role="menu" style={{ animation: 'slideIn 0.3s' }}>
          <button className="afl-mobile-close" aria-label="Close menu" onClick={() => setMobileMenu(false)}><FaTimes size={24} /></button>
          {/* Search bar */}
          <form className="afl-search" role="search" aria-label="Site search" autoComplete="off" onSubmit={e => e.preventDefault()} style={{ marginBottom: 12 }}>
            <input
              type="search"
              placeholder="Search courses, lessons..."
              aria-label="Search"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              style={{ minWidth: 120 }}
            />
            <button type="submit" aria-label="Submit search">🔍</button>
          </form>
          {searchOpen && (
            <div style={{ background: '#fff', boxShadow: '0 2px 8px #eee', borderRadius: 8, minWidth: 220, zIndex: 30, maxHeight: 250, overflowY: 'auto', marginBottom: 12 }}>
              {searchLoading ? (
                <div style={{ padding: '1rem', color: '#888' }}>Searching...</div>
              ) : searchError ? (
                <div style={{ padding: '1rem', color: 'red' }}>{searchError}</div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: '1rem', color: '#888' }}>No results found.</div>
              ) : (
                searchResults.map(item => (
                  <div key={item.type + '-' + item.id} style={{ padding: '0.7rem 1rem', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: '#fff' }} onMouseDown={() => handleSearchSelect(item)}>
                    <div style={{ fontWeight: 600, color: '#2bb6bb', fontSize: 14 }}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    {item.snippet && <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{item.snippet}</div>}
                  </div>
                ))
              )}
            </div>
          )}
          {/* Explore links */}
          <a href="/math" role="menuitem">Math</a>
          <a href="/english" role="menuitem">English</a>
          <a href="/science" role="menuitem">Science</a>
          <a href="/social-studies" role="menuitem">Social Studies</a>
          <a href="/cultural-corner" role="menuitem">Culture</a>
          <a href="/money-smart" role="menuitem">Financial Literacy</a>
          <a href="/code-club" role="menuitem">Programming</a>
          {/* Notification bell */}
          {user && (
            <button className="afl-bell" style={{ background: 'none', border: 'none', color: '#2d3a2e', fontSize: 22, cursor: 'pointer', position: 'relative', margin: '10px 0' }} onClick={handleBellClick} aria-label="Notifications">
              <FaBell />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: '#e82630', color: '#fff', borderRadius: '50%', fontSize: 12, fontWeight: 700, padding: '2px 6px', minWidth: 18, textAlign: 'center' }}>{unreadCount}</span>
              )}
            </button>
          )}
          {notifOpen && (
            <div style={{ background: '#fff', boxShadow: '0 2px 8px #eee', borderRadius: 10, minWidth: 220, zIndex: 20, maxHeight: 250, overflowY: 'auto', marginBottom: 12 }}>
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
          {/* User menu */}
          {user ? (
            <div className="afl-user-dropdown" style={{ position: 'relative', margin: '10px 0' }}>
              <button
                className="afl-user-name"
                style={{ background: 'none', border: 'none', color: '#2d3a2e', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                Hi, {user.name}! <FaChevronDown style={{ fontSize: 14 }} />
              </button>
              {userMenuOpen && (
                <div className="afl-user-menu" style={{ position: 'absolute', right: 0, top: '100%', background: '#fff', boxShadow: '0 2px 8px #eee', borderRadius: 8, minWidth: 120, zIndex: 10 }}>
                  <button className="afl-logout" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', color: '#e82630', padding: '0.7rem 1rem', textAlign: 'left', fontWeight: 500, cursor: 'pointer', borderRadius: 8 }}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login" className="afl-login" role="menuitem">Log in</a>
              <a href="/signup" className="afl-signup" role="menuitem">Sign up</a>
            </>
          )}
        </div>
      )}
    </header>
  );
} 