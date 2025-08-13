import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import logo from '../../assets/images/Afrolearn Logo_edited_edited.png';
 
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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
        {/* Right: Auth buttons (only when logged out) and hamburger */}
        <div className="afl-navbar-right">
          {!user && (
            <>
              <a href="/login" className="afl-login">Log in</a>
              <a href="/signup" className="afl-signup">Sign up</a>
            </>
          )}
          <button className="afl-hamburger" aria-label="Open menu" onClick={() => setMobileMenu((s) => !s)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      
      {/* Mobile menu overlay */}
      {mobileMenu && (
        <div 
          className="afl-mobile-overlay" 
          onClick={() => setMobileMenu(false)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 9998 
          }}
        />
      )}
      {/* Mobile menu */}
      {mobileMenu && (
        <div className="afl-mobile-menu active" role="menu" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#fff', zIndex: 9999, padding: '1rem', overflowY: 'auto' }}>
          <div className="afl-mobile-menu-header">
            <span className="afl-logo-text">Menu</span>
            <button className="afl-mobile-close" aria-label="Close menu" onClick={() => setMobileMenu(false)}>
              <FaTimes size={20} />
            </button>
          </div>
          <div className="afl-mobile-menu-content">
            <div className="afl-mobile-nav-section">
              <a href="/" role="menuitem">Home</a>
              <a href="/courses" role="menuitem">Courses</a>
              <a href="/about" role="menuitem">About</a>
            </div>
            {user ? (
              <>
                <div className="afl-mobile-nav-section">
                  <div className="afl-mobile-nav-section-title">Quick Links</div>
                  <a href="/dashboard" role="menuitem">Dashboard</a>
                  <a href="/profile" role="menuitem">Profile</a>
                  <a href="/settings" role="menuitem">Settings</a>
                </div>
                <div className="afl-mobile-nav-section">
                  <div className="afl-mobile-nav-section-title">Account</div>
                  <div className="afl-user-name">Hi, {user.name}!</div>
                  <button className="afl-logout" onClick={handleLogout}>Log out</button>
                </div>
              </>
            ) : (
              <div className="afl-mobile-nav-section">
                <div className="afl-mobile-nav-section-title">Get Started</div>
                <a href="/login" className="afl-login" role="menuitem">Log in</a>
                <a href="/signup" className="afl-signup" role="menuitem">Sign up</a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 