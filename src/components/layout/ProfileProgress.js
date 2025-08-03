import React from 'react';
import { FaMedal, FaFire, FaTrophy, FaStar, FaBookOpen, FaFlask, FaCalculator } from 'react-icons/fa';

const mockProgress = {
  overall: 62,
  subjects: [
    { key: 'math', label: 'Math', percent: 43, icon: <FaCalculator style={{ color: '#ff9800' }} /> },
    { key: 'english', label: 'English', percent: 62, icon: <FaBookOpen style={{ color: '#00796b' }} /> },
    { key: 'science', label: 'Science', percent: 33, icon: <FaFlask style={{ color: '#6ecb63' }} /> },
  ],
  milestones: [
    { id: 1, label: 'Skills Mastered', icon: <FaStar />, progress: 12, goal: 20, description: 'Master 20 skills' },
    { id: 2, label: 'Streak', icon: <FaFire />, progress: 5, goal: 10, description: '10-day streak' },
    { id: 3, label: 'Quizzes Passed', icon: <FaTrophy />, progress: 3, goal: 5, description: 'Pass 5 quizzes' },
    { id: 4, label: 'Lessons Completed', icon: <FaMedal />, progress: 8, goal: 15, description: 'Complete 15 lessons' },
  ],
  nextGoal: { label: 'Master 2 more skills to earn the "Skills Mastered" badge!', icon: <FaStar style={{ color: '#ff9800' }} /> },
};

export default function ProfileProgress() {
  return (
    <section style={{
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 2px 8px #eee',
      padding: '1.5rem 1rem',
      maxWidth: 340,
      minWidth: 220,
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      alignItems: 'stretch',
    }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#2d3a2e', marginBottom: 10, textAlign: 'center' }}>Progress & Milestones</h2>
      {/* Overall Progress */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#2d3a2e', marginBottom: 4 }}>Overall Progress</div>
        <div style={{ height: 10, background: '#e0e0e0', borderRadius: 5, width: '100%' }}>
          <div style={{ width: `${mockProgress.overall}%`, height: '100%', background: '#2d3a2e', borderRadius: 5 }} />
        </div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{mockProgress.overall}% complete</div>
      </div>
      {/* Subject Progress */}
      <div style={{ marginBottom: 10 }}>
        {mockProgress.subjects.map(subj => (
          <div key={subj.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            {subj.icon}
            <span style={{ fontWeight: 500, fontSize: 14, color: '#2d3a2e', minWidth: 60 }}>{subj.label}</span>
            <div style={{ flex: 1, height: 7, background: '#e0e0e0', borderRadius: 4, margin: '0 8px' }}>
              <div style={{ width: `${subj.percent}%`, height: '100%', background: '#ff9800', borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 13, color: '#888', minWidth: 28, textAlign: 'right' }}>{subj.percent}%</span>
          </div>
        ))}
      </div>
      {/* Milestones */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#2d3a2e', marginBottom: 4 }}>Milestones</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mockProgress.milestones.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f7f6f2', borderRadius: 8, padding: '0.5rem 0.7rem' }} title={m.description}>
              <span style={{ fontSize: 18, color: '#ff9800' }}>{m.icon}</span>
              <span style={{ fontWeight: 500, fontSize: 14, color: '#2d3a2e', minWidth: 60 }}>{m.label}</span>
              <div style={{ flex: 1, height: 7, background: '#e0e0e0', borderRadius: 4, margin: '0 8px' }}>
                <div style={{ width: `${(m.progress / m.goal) * 100}%`, height: '100%', background: '#6ecb63', borderRadius: 4 }} />
              </div>
              <span style={{ fontSize: 13, color: '#888', minWidth: 38, textAlign: 'right' }}>{m.progress} / {m.goal}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Next Goal */}
      <div style={{ background: '#fff9ec', borderRadius: 8, padding: '0.7rem 1rem', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 4px #ffe082' }}>
        <span style={{ fontSize: 18 }}>{mockProgress.nextGoal.icon}</span>
        <span style={{ fontSize: 14, color: '#2d3a2e' }}>{mockProgress.nextGoal.label}</span>
      </div>
    </section>
  );
} 
 