import React, { useState, useEffect } from 'react';
import { FaCalculator, FaBook, FaFlask, FaMedal, FaChevronDown, FaChevronUp, FaPlayCircle, FaQuestionCircle, FaCheckCircle, FaRegCircle, FaClipboardList, FaGlobeAfrica, FaMoneyBillWave, FaCode } from 'react-icons/fa';
import TopBar from '../components/layout/TopBar';

const iconMap = {
  FaCalculator: <FaCalculator style={{ color: '#ff9800', fontSize: 28 }} />,
  FaBook: <FaBook style={{ color: '#00796b', fontSize: 28 }} />,
  FaFlask: <FaFlask style={{ color: '#6ecb63', fontSize: 28 }} />,
  FaGlobeAfrica: <FaGlobeAfrica style={{ color: '#3f51b5', fontSize: 28 }} />,
  FaMoneyBillWave: <FaMoneyBillWave style={{ color: '#388e3c', fontSize: 28 }} />,
  FaCode: <FaCode style={{ color: '#ff5722', fontSize: 28 }} />,
};

function getToken() {
  return localStorage.getItem('token');
}

const Progress = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/progress', {
      headers: { 'Authorization': `Bearer ${getToken()}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch progress');
        return res.json();
      })
      .then(data => {
        setSubjects(data.subjects);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Overall summary
  const totalSkills = subjects.reduce((sum, s) => sum + s.totalSkills, 0);
  const totalMastered = subjects.reduce((sum, s) => sum + s.skillsMastered, 0);
  const overallPercent = totalSkills > 0 ? Math.round((totalMastered / totalSkills) * 100) : 0;

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading progress...</div>;
  if (error) return <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>{error}</div>;

  return (
    <div className="progress-page-main" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 0.5rem' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      {/* Overall Progress Summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24, background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #eee', padding: '1rem 1.5rem' }}>
        <FaMedal style={{ color: '#2d3a2e', fontSize: 28 }} />
        <div style={{ fontSize: 18, fontWeight: 600, color: '#2d3a2e' }}>My Progress</div>
        <div style={{ marginLeft: 'auto', fontSize: 14, color: '#4e5d52' }}>
          <span style={{ fontWeight: 600 }}>{totalMastered}</span> / {totalSkills} skills mastered
        </div>
        <div style={{ width: 100, height: 8, background: '#e0e0e0', borderRadius: 4, marginLeft: 14 }}>
          <div style={{ width: `${overallPercent}%`, height: '100%', background: '#2d3a2e', borderRadius: 4 }} />
        </div>
        <span style={{ fontWeight: 600, color: '#2d3a2e', marginLeft: 8 }}>{overallPercent}%</span>
      </div>
      {/* Subject Progress Panels */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 18,
          justifyItems: 'center',
          alignItems: 'stretch',
          margin: '0 auto',
          maxWidth: 1100,
        }}
      >
        {subjects.map(subject => (
          <div
            key={subject.key}
            style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 8px #eee',
              padding: '1rem 0.7rem',
              minWidth: 0,
              width: '100%',
              maxWidth: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 0,
              position: 'relative',
              transition: 'box-shadow 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, width: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {iconMap[subject.icon] || <FaBook style={{ color: '#888', fontSize: 22 }} />}
                <span style={{ fontSize: 15, fontWeight: 600, color: '#2d3a2e' }}>{subject.label}</span>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2d3a2e', fontSize: 16, padding: 0 }}
                onClick={() => setExpanded(expanded === subject.key ? null : subject.key)}
                title={expanded === subject.key ? 'Hide details' : 'Show details'}
              >
                {expanded === subject.key ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            <div style={{ fontSize: 12, color: '#4e5d52', marginBottom: 4 }}>Level {subject.level}</div>
            <div style={{ width: '100%', height: 6, background: '#e0e0e0', borderRadius: 3, marginBottom: 4 }}>
              <div style={{ width: `${subject.percent}%`, height: '100%', background: '#ff9800', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>{subject.skillsMastered} / {subject.totalSkills} skills</div>
            <button style={{ background: '#2d3a2e', color: '#fff', border: 'none', borderRadius: 7, padding: '0.4rem 0.7rem', fontWeight: 500, fontSize: 12, cursor: 'pointer', marginTop: 4 }}>
              Continue
            </button>
            {/* Expanded details */}
            {expanded === subject.key && (
              <div style={{ width: '100%', marginTop: 12, background: '#f7f7fa', borderRadius: 8, padding: '0.7rem 0.7rem', zIndex: 2, position: 'absolute', left: 0, top: '100%', boxShadow: '0 2px 8px #ddd' }}>
                {subject.units.map((unit, idx) => (
                  <div key={unit.title} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#2d3a2e', marginBottom: 4 }}>Unit {idx + 1}: {unit.title}</div>
                    {/* Videos */}
                    {unit.videos && unit.videos.length > 0 && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 500, color: '#4e5d52', fontSize: 12 }}><FaPlayCircle style={{ color: '#b0b3b8', marginRight: 3, fontSize: 12 }} /> Videos:</span>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {unit.videos.map((v, i) => (
                            <li key={i} style={{ color: v.completed ? '#6ecb63' : '#888', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {v.completed ? <FaCheckCircle style={{ color: '#6ecb63', fontSize: 12 }} /> : <FaRegCircle style={{ color: '#bbb', fontSize: 12 }} />}
                              {v.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Quizzes */}
                    {unit.quizzes && unit.quizzes.length > 0 && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 500, color: '#4e5d52', fontSize: 12 }}><FaQuestionCircle style={{ color: '#b0b3b8', marginRight: 3, fontSize: 12 }} /> Quizzes:</span>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {unit.quizzes.map((q, i) => (
                            <li key={i} style={{ color: q.passed ? '#6ecb63' : '#888', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {q.passed ? <FaCheckCircle style={{ color: '#6ecb63', fontSize: 12 }} /> : <FaRegCircle style={{ color: '#bbb', fontSize: 12 }} />}
                              {q.title} {q.score !== null ? `(Score: ${q.score}/${q.total})` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Practices */}
                    {unit.practices && unit.practices.length > 0 && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 500, color: '#4e5d52', fontSize: 12 }}><FaClipboardList style={{ color: '#b0b3b8', marginRight: 3, fontSize: 12 }} /> Practice:</span>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {unit.practices.map((p, i) => (
                            <li key={i} style={{ color: p.completed ? '#6ecb63' : '#888', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {p.completed ? <FaCheckCircle style={{ color: '#6ecb63', fontSize: 12 }} /> : <FaRegCircle style={{ color: '#bbb', fontSize: 12 }} />}
                              {p.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress; 
 