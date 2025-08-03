import React, { useEffect, useState } from 'react';
import { FaMedal, FaFire, FaStar } from 'react-icons/fa';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?name=User&background=eee&color=888&size=128';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

export default function ProfileOverview() {
  const [xpStats, setXpStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(u);
    if (!u.id) {
      setError('User not found');
      setLoading(false);
      return;
    }
    const fetchXP = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/xp/${u.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch XP stats');
        setXpStats(await res.json());
      } catch (err) {
        setError('Failed to load XP stats');
      } finally {
        setLoading(false);
      }
    };
    fetchXP();
  }, []);

  if (loading) return <section style={{ padding: '2rem' }}>Loading profile...</section>;
  if (error || !user) return <section style={{ padding: '2rem', color: 'red' }}>{error || 'User not found'}</section>;

  // Level logic (simple: every 500 XP = 1 level)
  const xp = xpStats?.totalXP || 0;
  const level = Math.floor(xp / 500) + 1;
  const nextLevelXp = (level) * 500;
  const levelLabel = ['Learner', 'Scholar', 'Master', 'Legend'][Math.min(level - 1, 3)];

  return (
    <section style={{
      background: 'rgba(255,255,255,0.18)', // glassmorphism
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.28)',
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
      padding: '2rem',
      marginBottom: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        {/* Avatar */}
        <img src={user.picture || FALLBACK_AVATAR} alt="User avatar" style={{ width: 90, height: 90, borderRadius: '50%', border: '3px solid #2d3a2e', background: '#f7f6f2' }} />
        {/* Name & Level */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#2d3a2e', marginBottom: 6 }}>{user.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ background: '#f7f6f2', color: '#2d3a2e', borderRadius: 8, padding: '0.2rem 0.7rem', fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FaMedal style={{ color: '#ff9800' }} /> Level {level}: {levelLabel}
            </span>
            <span style={{ color: '#888', fontSize: 14 }}>
              {xp} XP
            </span>
          </div>
          <div style={{ height: 8, background: '#e0e0e0', borderRadius: 4, width: 180, marginBottom: 6 }}>
            <div style={{ width: `${(xp / nextLevelXp) * 100}%`, height: '100%', background: '#2d3a2e', borderRadius: 4 }} />
          </div>
          <div style={{ color: '#888', fontSize: 13 }}>
            {xp} / {nextLevelXp} XP to next level
          </div>
        </div>
        {/* Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 160 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4e5d52', fontSize: 15 }}>
            <FaStar style={{ color: '#ff9800' }} />
            <span><b>{xpStats?.lessonsCompleted || 0}</b> lessons completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4e5d52', fontSize: 15 }}>
            <FaStar style={{ color: '#ff9800' }} />
            <span><b>{xpStats?.skillsMastered || 0}</b> skills mastered</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4e5d52', fontSize: 15 }}>
            <FaFire style={{ color: '#ff9800' }} />
            <span><b>{xpStats?.streakDays || 0}</b>-day streak</span>
          </div>
          <div style={{ color: '#888', fontSize: 14 }}>
            Joined: {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
          </div>
        </div>
      </div>
    </section>
  );
} 
 