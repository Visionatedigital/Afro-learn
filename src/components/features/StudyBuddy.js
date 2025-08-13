import React, { useState } from 'react';
import MascotSelector from './StudyBuddyMascotSelector';
import Mascot3DViewer from './Mascot3DViewer';

const mascotList = [
  { key: 'owl', name: 'Ollie the Owl', emoji: '🦉' },
  // removed robot option per request
  { key: 'bear', name: 'Bella the Bear', emoji: '🐻' },
  { key: 'lion', name: 'Leo the Lion', emoji: '🦁' },
  { key: 'rabbit', name: 'Ruby the Rabbit', emoji: '🐰' },
  { key: 'butterfly', name: 'Bella the Butterfly', emoji: '🦋' },
];

const pastelPalette = [
  '#F6F7FB', '#E3F6F5', '#FFF6E9', '#F9F9F9', '#E4E9FD', '#FDE2E4'
];

const actionButtons = [
  { label: 'Ask', icon: '❓' },
  { label: 'Practice', icon: '📝' },
  { label: 'Game', icon: '🎮' },
  { label: 'Progress', icon: '🏆' },
  { label: 'Schedule', icon: '📅' },
];

export default function StudyBuddy() {
  const [selectedMascot, setSelectedMascot] = useState(() => {
    const saved = localStorage.getItem('studyBuddyMascot') || '';
    // if previously set to robot, clear it
    return saved === 'robot' ? '' : saved;
  });
  const [messages, setMessages] = useState([
    { from: 'mascot', text: "Hi! I'm your Study Buddy. What would you like to do today?" }
  ]);

  const handleMascotSelect = (mascotKey) => {
    setSelectedMascot(mascotKey);
    localStorage.setItem('studyBuddyMascot', mascotKey);
  };

  const handleAction = (action) => {
    setMessages(msgs => [
      ...msgs,
      { from: 'user', text: action.label },
      { from: 'mascot', text: `You chose '${action.label}'. This feature is coming soon!` }
    ]);
  };

  const mascot = mascotList.find(m => m.key === selectedMascot);
  const pastelBg = pastelPalette[mascotList.findIndex(m => m.key === selectedMascot) % pastelPalette.length];

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(255,255,255,0.7)',
      borderRadius: 32,
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      minHeight: 420,
      padding: 0,
      overflow: 'visible',
      border: '1.5px solid rgba(255,255,255,0.25)',
      marginTop: 32,
    }}>
      {!selectedMascot ? (
        <MascotSelector mascots={mascotList} onSelect={handleMascotSelect} />
      ) : (
        <>
          {/* Floating mascot with bounce animation */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: -56,
            transform: 'translateX(-50%)',
            zIndex: 2,
            filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.10))',
            animation: 'studybuddy-bounce 1.6s infinite',
            background: pastelBg,
            borderRadius: '50%',
            width: 96,
            height: 96,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #fff',
          }}>
            <Mascot3DViewer mascotKey={selectedMascot} />
          </div>
          {/* Card content */}
          <div style={{ padding: '72px 24px 24px 24px', background: 'transparent', borderRadius: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: 20, color: '#222', letterSpacing: 0.5 }}>{mascot.name}</h2>
              <button style={{ marginTop: 6, fontSize: 12, background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: 8, padding: '2px 10px', cursor: 'pointer' }} onClick={() => setSelectedMascot('')}>Change Mascot</button>
            </div>
            {/* Minimal chat area */}
            <div style={{ background: 'rgba(255,255,255,0.55)', minHeight: 90, maxHeight: 120, overflowY: 'auto', padding: 14, borderRadius: 18, boxShadow: '0 2px 8px rgba(31,38,135,0.04)', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {messages.slice(-3).map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.from === 'mascot' ? 'flex-start' : 'flex-end',
                  background: msg.from === 'mascot' ? pastelBg : 'rgba(240,240,240,0.7)',
                  color: '#222',
                  borderRadius: 16,
                  padding: '7px 14px',
                  maxWidth: '80%',
                  fontSize: 15,
                  boxShadow: msg.from === 'mascot' ? '0 1px 4px rgba(31,38,135,0.04)' : 'none',
                  fontWeight: 500,
                  border: msg.from === 'mascot' ? '1px solid #f0f0f0' : 'none',
                }}>
                  {msg.text}
                </div>
              ))}
            </div>
            {/* Minimal, 3D action buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 8 }}>
              {actionButtons.map(btn => (
                <button
                  key={btn.label}
                  onClick={() => handleAction(btn)}
                  style={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    boxShadow: '0 4px 16px 0 rgba(31,38,135,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: '#444',
                    cursor: 'pointer',
                    transition: 'transform 0.12s',
                    outline: 'none',
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: 24 }}>{btn.icon}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Bounce animation keyframes */}
          <style>{`
            @keyframes studybuddy-bounce {
              0%, 100% { transform: translateX(-50%) translateY(0); }
              20% { transform: translateX(-50%) translateY(-10px); }
              40% { transform: translateX(-50%) translateY(0); }
              60% { transform: translateX(-50%) translateY(-6px); }
              80% { transform: translateX(-50%) translateY(0); }
            }
          `}</style>
        </>
      )}
    </div>
  );
} 