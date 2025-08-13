import React from 'react';

export default function StaticPage({ title, subtitle, children }) {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 2px 8px #eee',
          padding: '2rem 2.5rem',
          minHeight: 360,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: 28, color: '#2d3a2e' }}>{title}</h1>
        {subtitle && (
          <p style={{ marginTop: 0, color: '#556', fontSize: 16 }}>{subtitle}</p>
        )}
        <div style={{ marginTop: 18, color: '#2d3a2e', lineHeight: 1.6, fontSize: 16 }}>
          {children}
        </div>
      </div>
    </div>
  );
}





