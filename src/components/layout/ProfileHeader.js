import React from 'react';
import { useAuth } from '../../context/AuthContext';

// StreakWidget removed (unused)

// OverallLevelBadge removed (unused)

const ProfileHeader = () => {
  const { user } = useAuth();

  if (!user) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
  }

  // Example fallback avatar if none is set
  const avatar = user.picture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=amina';

  return (
    <section
      className="afl-profile-header"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 8px #eee',
        padding: '1.5rem 2rem',
      }}
    >
      {/* Mobile-only: Welcome, avatar, and stats */}
      <div className="afl-profile-mobile" style={{ display: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img
            src={avatar}
            alt="User avatar"
            style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #2d3a2e', background: '#f7f6f2' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#2d3a2e' }}>
              Welcome back, {user.name?.split(' ')[0] || 'Learner'}!
            </div>
            <div style={{ marginTop: 2, color: '#4e5d52', fontSize: 15 }}>
              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner'}
            </div>
            {/* Add more stats here if available, e.g. XP, level, streak, etc. */}
          </div>
        </div>
      </div>
      {/* Desktop: original widgets and info */}
      <div className="afl-profile-desktop">
        {/* Dashboard widgets row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#2d3a2e' }}>Welcome back!</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <img src={avatar} alt="User avatar" style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #2d3a2e', background: '#f7f6f2' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: '#2d3a2e' }}>{user.name}</div>
            <div style={{ marginTop: 8, color: '#4e5d52', fontSize: 16 }}>{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Learner'}</div>
          </div>
          <button style={{ background: '#2d3a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>
            Edit Profile
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader; 
 