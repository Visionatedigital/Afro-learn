import React from 'react';

export default function MascotSelector({ mascots, onSelect }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Choose your Study Buddy!</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 24 }}>
        {mascots.map(mascot => (
          <button
            key={mascot.key}
            onClick={() => onSelect(mascot.key)}
            style={{
              background: '#f5f5f5',
              border: '2px solid #eee',
              borderRadius: 16,
              padding: 16,
              width: 100,
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: 24,
              transition: 'box-shadow 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}
          >
            <span style={{ fontSize: 48 }}>{mascot.emoji}</span>
            <span style={{ marginTop: 8, fontWeight: 'bold', fontSize: 14 }}>{mascot.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 