import React from 'react';

const CourseCard = ({ course }) => {
  return (
    <div style={{ background: course.color, borderRadius: 16, boxShadow: '0 2px 8px #e0e0e0', padding: '1.5rem 1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minHeight: 210 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{course.icon}</div>
      <div style={{ fontWeight: 600, fontSize: 20, color: '#2d3a2e', marginBottom: 6 }}>{course.subject}</div>
      <div style={{ height: 8, background: '#fff', borderRadius: 4, width: '100%', margin: '8px 0' }}>
        <div style={{ width: `${course.progress * 100}%`, height: '100%', background: '#2d3a2e', borderRadius: 4 }} />
      </div>
      <div style={{ fontSize: 14, color: '#2d3a2e', margin: '8px 0 12px 0' }}>
        {course.modules.join(', ')}
      </div>
      <button style={{ background: '#2d3a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginTop: 'auto' }}>
        {course.action}
      </button>
    </div>
  );
};

export default CourseCard; 