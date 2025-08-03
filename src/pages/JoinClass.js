import React, { useState } from 'react';
import { FaRocket, FaArrowLeft } from 'react-icons/fa';
import joinClassBg from '../assets/images/afro-learn-join-class.png';

export default function JoinClassModal({ open, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = e => {
    e.preventDefault();
    if (!/^\d{8}$/.test(code)) {
      setError('Please enter a valid 8-digit class code.');
    } else {
      setError('');
      alert('Joining class with code: ' + code);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div
        className="join-class-modal"
        style={{
          maxWidth: 340,
          width: '95vw',
          background: `url(${joinClassBg}) center center/cover no-repeat`,
          borderRadius: 14,
          border: '2px solid #e0e0e0',
          boxShadow: '0 2px 8px #e0e0e0',
          padding: '0.8rem 0.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', left: 10, top: 10, background: 'none', border: 'none', color: '#2bb6bb', fontSize: 22, cursor: 'pointer' }} title="Close">
          <FaArrowLeft />
        </button>
        <FaRocket style={{ fontSize: 36, color: '#ff9800', marginBottom: 12, marginTop: 6 }} />
        <h2 style={{ fontWeight: 800, fontSize: 20, color: '#2d3a2e', marginBottom: 5, textAlign: 'center', textShadow: '0 1px 4px #fff8' }}>Join Your Class</h2>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 14, textAlign: 'center', textShadow: '0 1px 4px #fff8' }}>
          Enter your class code below. Ask your teacher for the code!
        </div>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="12345678"
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textAlign: 'center',
              borderRadius: 10,
              border: '2px solid #2bb6bb',
              padding: '0.5rem 0.4rem',
              width: '100%',
              maxWidth: 180,
              background: 'rgba(255,255,255,0.92)',
              color: '#2d3a2e',
              outline: 'none',
              marginBottom: 4,
              boxShadow: '0 1px 4px #fff8',
            }}
            inputMode="numeric"
            pattern="\d{8}"
            required
          />
          {error && <div style={{ color: '#c2185b', fontWeight: 600, fontSize: 12, marginBottom: 4, textShadow: '0 1px 4px #fff8' }}>{error}</div>}
          <button type="submit" style={{ background: '#2bb6bb', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, padding: '0.6rem 1rem', cursor: 'pointer', boxShadow: '0 1px 4px #eee', marginTop: 4 }}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
} 