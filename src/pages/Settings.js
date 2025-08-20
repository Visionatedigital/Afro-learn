import React, { useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaImage, FaLock, FaSignOutAlt, FaMoon, FaSun, FaBell, FaQuestionCircle } from 'react-icons/fa';
import TopBar from '../components/layout/TopBar';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?name=User&background=eee&color=888&size=128';

export default function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') !== 'off');
  // const [showTooltip, setShowTooltip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ currentPassword: '', newPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setName(u.name || '');
    setEmail(u.email || '');
    setAvatar(u.picture || '');
    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  const handleSave = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, email, picture: avatar })
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to update profile');
        return;
      }
      const data = await res.json();
      setSuccess('Profile updated!');
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleAvatarChange = async e => {
    setAvatarError(null);
    setAvatarUploading(true);
    const file = e.target.files[0];
    if (!file) return;
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        setAvatarError(err.error || 'Failed to upload avatar');
        setAvatarUploading(false);
        return;
      }
      const data = await res.json();
      setAvatar(data.url);
      // Immediately PATCH user profile with new avatar URL
      const patchRes = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ picture: data.url })
      });
      if (patchRes.ok) {
        const updated = await patchRes.json();
        localStorage.setItem('user', JSON.stringify(updated.user));
      }
      setAvatarUploading(false);
    } catch (err) {
      setAvatarError('Failed to upload avatar');
      setAvatarUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };

  const handleNotificationsChange = () => {
    setNotifications(n => {
      localStorage.setItem('notifications', !n ? 'on' : 'off');
      return !n;
    });
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    setPasswordMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(passwordFields)
      });
      if (!res.ok) {
        const err = await res.json();
        setPasswordMsg(err.error || 'Failed to change password');
        return;
      }
      setPasswordMsg('Password changed!');
      setShowPasswordModal(false);
      setPasswordFields({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMsg('Failed to change password');
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading settings...</div>;

  return (
    <div className="settings-page-main" style={{ maxWidth: 600, margin: '0 auto', padding: '0.2rem 1rem 2rem 1rem', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      <h1 style={{ fontWeight: 800, fontSize: 28, color: '#2d3a2e', marginBottom: 24 }}>Settings</h1>
      {/* Profile Settings */}
      <form onSubmit={handleSave} style={{ background: '#f7f6f2', borderRadius: 18, padding: '1.5rem', marginBottom: 28, boxShadow: '0 2px 8px #eee', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={avatar || FALLBACK_AVATAR} alt="Avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #2bb6bb', background: '#fff' }} />
          <label style={{ cursor: 'pointer', color: '#2bb6bb', fontWeight: 600 }}>
            <FaImage style={{ marginRight: 6 }} /> Change Avatar
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </label>
          {avatarUploading && <span style={{ color: '#2bb6bb', marginLeft: 10 }}>Uploading...</span>}
          {avatarError && <span style={{ color: 'red', marginLeft: 10 }}>{avatarError}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaUser style={{ color: '#2bb6bb', fontSize: 18 }} />
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={{ flex: 1, fontSize: 18, borderRadius: 12, border: '2px solid #2bb6bb', padding: '0.7rem 1rem', background: '#fff', color: '#2d3a2e', outline: 'none' }} required />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaEnvelope style={{ color: '#2bb6bb', fontSize: 18 }} />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ flex: 1, fontSize: 18, borderRadius: 12, border: '2px solid #2bb6bb', padding: '0.7rem 1rem', background: '#fff', color: '#2d3a2e', outline: 'none' }} required />
        </div>
        <button type="submit" style={{ background: '#2bb6bb', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '0.7rem 1.5rem', cursor: 'pointer', marginTop: 8 }}>Save Changes</button>
        {error && <div style={{ color: 'red', marginTop: 6 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 6 }}>{success}</div>}
      </form>
      {/* Account Actions */}
      <div style={{ background: '#fff9ec', borderRadius: 18, padding: '1.2rem', marginBottom: 28, boxShadow: '0 2px 8px #ffe082', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button style={{ background: '#e0e0e0', color: '#2d3a2e', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => setShowPasswordModal(true)}> <FaLock /> Change Password</button>
        <button style={{ background: '#c2185b', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 10, padding: '0.7rem 1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={handleLogout}> <FaSignOutAlt /> Log Out</button>
      </div>
      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', minWidth: 320, boxShadow: '0 2px 16px #eee', position: 'relative' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2d3a2e', marginBottom: 18 }}>Change Password</h2>
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="password" value={passwordFields.currentPassword} onChange={e => setPasswordFields(f => ({ ...f, currentPassword: e.target.value }))} placeholder="Current password" style={{ fontSize: 16, borderRadius: 8, border: '1px solid #ccc', padding: '0.7rem 1rem' }} required />
              <input type="password" value={passwordFields.newPassword} onChange={e => setPasswordFields(f => ({ ...f, newPassword: e.target.value }))} placeholder="New password" style={{ fontSize: 16, borderRadius: 8, border: '1px solid #ccc', padding: '0.7rem 1rem' }} required />
              <button type="submit" style={{ background: '#2bb6bb', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '0.7rem 1.2rem', cursor: 'pointer' }}>Change Password</button>
              {passwordMsg && <div style={{ color: passwordMsg.includes('changed') ? 'green' : 'red', marginTop: 6 }}>{passwordMsg}</div>}
            </form>
            <button onClick={() => setShowPasswordModal(false)} style={{ position: 'absolute', top: 10, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer' }}>&times;</button>
          </div>
        </div>
      )}
      {/* App Preferences */}
      <div style={{ background: '#e0f7fa', borderRadius: 18, padding: '1.2rem', marginBottom: 28, boxShadow: '0 2px 8px #b2ebf2', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaMoon style={{ color: theme === 'dark' ? '#2bb6bb' : '#888', fontSize: 18 }} />
          <FaSun style={{ color: theme === 'light' ? '#ff9800' : '#888', fontSize: 18 }} />
          <span style={{ fontWeight: 600, fontSize: 16 }}>Theme:</span>
          <button onClick={handleThemeChange} style={{ background: theme === 'dark' ? '#2bb6bb' : '#fff', color: theme === 'dark' ? '#fff' : '#2d3a2e', border: '2px solid #2bb6bb', borderRadius: 10, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 16, marginLeft: 8, cursor: 'pointer' }}>{theme === 'light' ? 'Light' : 'Dark'}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaBell style={{ color: notifications ? '#2bb6bb' : '#888', fontSize: 18 }} />
          <span style={{ fontWeight: 600, fontSize: 16 }}>Notifications:</span>
          <button onClick={handleNotificationsChange} style={{ background: notifications ? '#2bb6bb' : '#fff', color: notifications ? '#fff' : '#2d3a2e', border: '2px solid #2bb6bb', borderRadius: 10, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: 16, marginLeft: 8, cursor: 'pointer' }}>{notifications ? 'On' : 'Off'}</button>
        </div>
      </div>
      {/* Support/Help */}
      <div style={{ background: '#fce4ec', borderRadius: 18, padding: '1.2rem', marginBottom: 28, boxShadow: '0 2px 8px #f8bbd0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <FaQuestionCircle style={{ color: '#c2185b', fontSize: 22 }} />
        <span style={{ fontWeight: 600, fontSize: 16, color: '#c2185b' }}>Need help?</span>
        <span style={{ color: '#888', fontSize: 15 }}>Contact support at <a href="mailto:support@afro-learn.com" style={{ color: '#c2185b', textDecoration: 'underline' }}>support@afro-learn.com</a></span>
      </div>
    </div>
  );
} 