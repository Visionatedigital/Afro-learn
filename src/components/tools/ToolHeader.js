import React from 'react';
import { useNavigate } from 'react-router-dom';

const Icon = ({ type, color = '#2bb6bb' }) => {
  const common = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch (type) {
    case 'bolt':
      return <svg {...common}><path d="M13 2L3 14H11L9 22L21 10H13L13 2Z" fill={color}/></svg>;
    case 'wand':
      return <svg {...common}><path d="M3 21L14 10L12 8L1 19L3 21ZM15.5 8.5L17 7L15.5 5.5L14 7L15.5 8.5ZM19 6L21 4L19 2L17 4L19 6ZM19.5 12.5L21 11L19.5 9.5L18 11L19.5 12.5Z" fill={color}/></svg>;
    case 'image':
      return <svg {...common}><path d="M21 19V5C21 3.895 20.105 3 19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19ZM8.5 7C9.328 7 10 7.672 10 8.5C10 9.328 9.328 10 8.5 10C7.672 10 7 9.328 7 8.5C7 7.672 7.672 7 8.5 7ZM5 19L11 13L14 16L17 13L19 15V19H5Z" fill={color}/></svg>;
    case 'star':
      return <svg {...common}><path d="M12 2L14.9 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L9.1 8.26L12 2Z" fill={color}/></svg>;
    case 'book':
      return <svg {...common}><path d="M4 4C4 2.895 4.895 2 6 2H18C19.105 2 20 2.895 20 4V20C20 21.105 19.105 22 18 22H6C4.895 22 4 21.105 4 20V4ZM6 4V20H18V4H6Z" fill={color}/></svg>;
    case 'palette':
      return <svg {...common}><path d="M12 2C6.48 2 2 6.03 2 10.5C2 13.54 4.5 16 7.5 16H9C9.55 16 10 16.45 10 17C10 18.66 11.34 20 13 20C14.66 20 16 18.66 16 17V16H16.5C19.54 16 22 13.54 22 10.5C22 6.03 17.52 2 12 2ZM7 9C6.45 9 6 8.55 6 8C6 7.45 6.45 7 7 7C7.55 7 8 7.45 8 8C8 8.55 7.55 9 7 9ZM10 6C9.45 6 9 5.55 9 5C9 4.45 9.45 4 10 4C10.55 4 11 4.45 11 5C11 5.55 10.55 6 10 6ZM14 6C13.45 6 13 5.55 13 5C13 4.45 13.45 4 14 4C14.55 4 15 4.45 15 5C15 5.55 14.55 6 14 6ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9Z" fill={color}/></svg>;
    case 'mic':
      return <svg {...common}><path d="M12 14C13.657 14 15 12.657 15 11V5C15 3.343 13.657 2 12 2C10.343 2 9 3.343 9 5V11C9 12.657 10.343 14 12 14ZM19 11C19 14.313 16.313 17 13 17H11C7.687 17 5 14.313 5 11H7C7 13.209 8.791 15 11 15H13C15.209 15 17 13.209 17 11H19ZM13 19V22H11V19H13Z" fill={color}/></svg>;
    case 'map':
      return <svg {...common}><path d="M9 3L15 5L21 3V19L15 21L9 19L3 21V5L9 3ZM9 17L15 19V7L9 5V17Z" fill={color}/></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" fill={color}/></svg>;
  }
};

export default function ToolHeader({ icon = 'bolt', title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/ubongo-tools')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#667eea', fontWeight: 700 }}>← Back to Tools</button>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon type={icon} color="#667eea" />
        </div>
        <div>
          <h2 style={{ margin: 0, color: '#2d3a2e' }}>{title}</h2>
          {subtitle && <div style={{ color: '#4e5d52', fontSize: 13 }}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}













