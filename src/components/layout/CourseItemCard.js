import React from 'react';

const statusColors = {
  completed: '#b2dfdb',
  active: '#fffde7',
  locked: '#eee',
};

const CourseItemCard = ({ topic, groupColor, action }) => {
  return (
    <div style={{
      background: statusColors[topic.status] || '#fff',
      borderRadius: 10,
      boxShadow: '0 1px 4px #e0e0e0',
      padding: '0.8rem 1.1rem',
      minWidth: 140,
      minHeight: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'relative',
      border: topic.status === 'active' ? `2px solid ${groupColor}` : '2px solid transparent',
      opacity: topic.status === 'locked' ? 0.6 : 1,
    }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{topic.icon}</div>
      <div style={{ fontWeight: 500, fontSize: 15, color: '#2d3a2e', marginBottom: 6 }}>{topic.title}</div>
      {topic.status === 'active' && (
        <button style={{ background: groupColor, color: '#2d3a2e', border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 500, fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
          {action}
        </button>
      )}
      {topic.status === 'completed' && (
        <span style={{ color: '#388e3c', fontWeight: 600, fontSize: 12, marginTop: 4 }}>✓ Completed</span>
      )}
      {topic.status === 'locked' && (
        <span style={{ color: '#aaa', fontWeight: 500, fontSize: 12, marginTop: 4 }}>Locked</span>
      )}
    </div>
  );
};

export default CourseItemCard; 
 
 