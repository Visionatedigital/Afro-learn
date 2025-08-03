import React, { useState } from 'react';
import { FaStar, FaBookOpen, FaFlask, FaFire, FaTrophy, FaLock, FaMedal, FaCalendarCheck, FaCode, FaUsers } from 'react-icons/fa';

const mockBadges = [
  { id: 1, label: 'Math Star', icon: <FaStar />, description: 'Completed 10 math lessons', category: 'Subject', earned: true, dateEarned: '2024-06-01', pinned: true },
  { id: 2, label: 'Storyteller', icon: <FaBookOpen />, description: 'Read 5 stories', category: 'Subject', earned: true, dateEarned: '2024-06-03', pinned: true },
  { id: 3, label: 'Science Explorer', icon: <FaFlask />, description: 'Completed 5 science lessons', category: 'Subject', earned: true, dateEarned: '2024-06-05', pinned: true },
  { id: 4, label: '7-Day Streak', icon: <FaFire />, description: 'Logged in 7 days in a row', category: 'Streak', earned: true, dateEarned: '2024-06-10' },
  { id: 5, label: 'Quiz Master', icon: <FaTrophy />, description: 'Scored 100% on a quiz', category: 'Milestone', earned: true, dateEarned: '2024-06-12' },
  { id: 6, label: '30-Day Streak', icon: <FaFire />, description: 'Logged in 30 days in a row', category: 'Streak', earned: false, progress: 7, goal: 30, howToEarn: 'Log in for 30 days in a row.' },
  { id: 7, label: 'Super Scholar', icon: <FaMedal />, description: 'Mastered all subjects', category: 'Milestone', earned: false, progress: 3, goal: 5, howToEarn: 'Master all subjects.' },
  { id: 8, label: 'Attendance Star', icon: <FaCalendarCheck />, description: 'Attended 30 days', category: 'Milestone', earned: false, progress: 12, goal: 30, howToEarn: 'Attend 30 days.' },
  { id: 9, label: 'Code Champion', icon: <FaCode />, description: 'Completed 5 coding challenges', category: 'Subject', earned: false, progress: 2, goal: 5, howToEarn: 'Complete 5 coding challenges.' },
  { id: 10, label: 'Community Helper', icon: <FaUsers />, description: 'Helped 3 classmates', category: 'Special', earned: false, progress: 0, goal: 3, howToEarn: 'Help 3 classmates.' },
];

const categories = [
  { key: 'Showcase', label: 'Showcase' },
  { key: 'All', label: 'All' },
  { key: 'Milestone', label: 'Milestones' },
  { key: 'Streak', label: 'Streaks' },
  { key: 'Subject', label: 'Subject Mastery' },
  { key: 'Special', label: 'Special' },
];

function BadgeTooltip({ badge, children }) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
    >
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '110%',
          transform: 'translateX(-50%)',
          background: '#222',
          color: '#fff',
          padding: '0.7rem 1rem',
          borderRadius: 8,
          fontSize: 14,
          minWidth: 180,
          zIndex: 10,
          boxShadow: '0 2px 8px #0002',
          whiteSpace: 'pre-line',
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{badge.label}</div>
          <div>{badge.description}</div>
          {!badge.earned && badge.howToEarn && (
            <div style={{ color: '#ffe082', marginTop: 6, fontSize: 13 }}>How to earn: {badge.howToEarn}</div>
          )}
        </div>
      )}
    </div>
  );
}

function MinimalBadge({ badge }) {
  const isLocked = !badge.earned;
  return (
    <BadgeTooltip badge={badge}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, maxWidth: 80, margin: '0 0.2rem', position: 'relative', cursor: 'pointer' }}>
        <div style={{ fontSize: 26, color: isLocked ? '#bbb' : '#ff9800', position: 'relative' }}>
          {badge.icon}
          {isLocked && <FaLock style={{ position: 'absolute', top: 0, right: -6, color: '#bbb', fontSize: 12 }} />}
        </div>
        <span style={{ fontWeight: 500, color: isLocked ? '#bbb' : '#2d3a2e', fontSize: 11, textAlign: 'center', marginTop: 3 }}>{badge.label}</span>
      </div>
    </BadgeTooltip>
  );
}

export default function ProfileBadges() {
  const [selectedCategory, setSelectedCategory] = useState('Showcase');

  let badgesToShow = [];
  if (selectedCategory === 'Showcase') {
    badgesToShow = mockBadges.filter(b => b.pinned);
  } else if (selectedCategory === 'All') {
    badgesToShow = mockBadges;
  } else {
    badgesToShow = mockBadges.filter(b => b.category === selectedCategory);
  }

  return (
    <section style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 8px #eee',
      padding: '1.5rem 1rem',
      marginBottom: 32,
      maxWidth: 700,
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      flexDirection: 'row',
      gap: 32,
      alignItems: 'flex-start',
    }}>
      {/* Vertical Category Tabs */}
      <div style={{ minWidth: 120, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            style={{
              background: selectedCategory === cat.key ? '#ffe082' : '#f7f6f2',
              color: selectedCategory === cat.key ? '#ff9800' : '#2d3a2e',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 0.7rem',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: selectedCategory === cat.key ? '0 1px 4px #ffe082' : 'none',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {/* Minimalist Badge Grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
        gap: 16,
        justifyItems: 'center',
        padding: '0 0.5rem',
      }}>
        {badgesToShow.length === 0 && (
          <div style={{ color: '#888', fontSize: 14, margin: '1.5rem 0' }}>No badges in this category yet.</div>
        )}
        {badgesToShow.map(badge => (
          <MinimalBadge key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  );
} 
 