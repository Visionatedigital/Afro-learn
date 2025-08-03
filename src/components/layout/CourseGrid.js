import React, { useState, useEffect } from 'react';
import { FaCalculator, FaBook, FaFlask, FaGlobeAfrica, FaCode, FaHandsHelping } from 'react-icons/fa';
import UnitLessonView from './UnitLessonView';

const iconMap = {
  FaCalculator: <FaCalculator />,
  FaBook: <FaBook />,
  FaFlask: <FaFlask />,
  FaGlobeAfrica: <FaGlobeAfrica />,
  FaCode: <FaCode />,
  FaHandsHelping: <FaHandsHelping />,
};

const currentGrade = 'Primary 4'; // Placeholder for user's grade

const cardStyle = {
  background: '#f7f7fa',
  borderRadius: 14,
  boxShadow: '0 1px 4px #ececec',
  padding: '1.2rem 1.5rem',
  minWidth: 140,
  minHeight: 90,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'box-shadow 0.2s, background 0.2s',
  cursor: 'pointer',
  border: '1px solid #e0e0e0',
};

const cardHoverStyle = {
  boxShadow: '0 4px 16px #e0e0e0',
  background: '#f0f0f5',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 4px 32px #bbb',
  padding: '2rem 2.5rem',
  minWidth: 320,
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const gradeButtonStyle = (isCurrent) => ({
  background: isCurrent ? '#ffe082' : '#f7f7fa',
  color: isCurrent ? '#ff9800' : '#2d3a2e',
  border: isCurrent ? '2px solid #ffb300' : '1px solid #e0e0e0',
  borderRadius: 10,
  padding: '0.7rem 1.5rem',
  fontWeight: 600,
  fontSize: 16,
  margin: '0.3rem 0',
  cursor: 'pointer',
  width: '100%',
  transition: 'background 0.2s, color 0.2s, border 0.2s',
});

const CourseGrid = ({ selectedUnitView, setSelectedUnitView, initialLessonId, initialLesson, initialUnit, initialSubject, initialGrade }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/subjects')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch subjects');
        return res.json();
      })
      .then(data => {
        setSubjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Fetch grades when modal opens
  useEffect(() => {
    if (modalOpen) {
      setGradesLoading(true);
      fetch('/api/grades')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch grades');
          return res.json();
        })
        .then(data => {
          setGrades(data);
          setGradesLoading(false);
        })
        .catch(err => {
          setGradesError(err.message);
          setGradesLoading(false);
        });
    }
  }, [modalOpen]);

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setModalOpen(true);
  };

  const handleGradeSelect = (grade) => {
    setModalOpen(false);
    setSelectedUnitView({ subject: selectedSubject, grade });
  };

  if (selectedUnitView) {
    return (
      <UnitLessonView
        subject={selectedUnitView.subject}
        grade={selectedUnitView.grade}
        onBack={() => setSelectedUnitView(null)}
        initialLessonId={initialLessonId}
        initialLesson={initialLesson}
        initialUnit={initialUnit}
        initialSubject={initialSubject}
        initialGrade={initialGrade}
      />
    );
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#2d3a2e', margin: 0 }}>Subjects</h2>
      </div>
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading subjects...</div>
      ) : error ? (
        <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>{error}</div>
      ) : (
      <div className="courses-grid" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
        {subjects.map(subject => (
          <div
              key={subject.id}
            className="course-card"
            style={cardStyle}
            onMouseOver={e => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseOut={e => Object.assign(e.currentTarget.style, cardStyle)}
            onClick={() => handleSubjectClick(subject)}
          >
              <div style={{ fontSize: 32, color: '#b0b3b8', marginBottom: 10 }}>
                {iconMap[subject.icon] || <FaBook />}
              </div>
              <div style={{ fontWeight: 500, fontSize: 16, color: '#2d3a2e' }}>{subject.name}</div>
          </div>
        ))}
      </div>
      )}
      {modalOpen && (
        <div style={modalOverlayStyle} onClick={() => setModalOpen(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#2d3a2e', marginBottom: 18 }}>
              Select Grade for {selectedSubject?.name}
            </h3>
            {gradesLoading ? (
              <div style={{ padding: '1rem', textAlign: 'center' }}>Loading grades...</div>
            ) : gradesError ? (
              <div style={{ color: 'red', padding: '1rem', textAlign: 'center' }}>{gradesError}</div>
            ) : (
              grades.map(grade => (
              <button
                  key={grade.id}
                  style={gradeButtonStyle(grade.name === currentGrade)}
                onClick={() => handleGradeSelect(grade)}
              >
                  {grade.name}
                  {grade.name === currentGrade && <span style={{ marginLeft: 8, fontSize: 14 }}>(Your Level)</span>}
              </button>
              ))
            )}
            <button style={{ marginTop: 18, background: 'none', color: '#e82630', border: 'none', fontSize: 15, cursor: 'pointer' }} onClick={() => setModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CourseGrid; 