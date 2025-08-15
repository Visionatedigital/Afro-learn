import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegCircle, FaPlayCircle, FaQuestionCircle } from 'react-icons/fa';
import LessonContentPage from './LessonContentPage';
import './UnitLessonView.css';

const masteryIcons = [
  { label: 'Mastered', icon: <FaCheckCircle style={{ color: '#6ecb63' }} /> },
  { label: 'Not started', icon: <FaRegCircle style={{ color: '#bbb' }} /> },
];

const UnitLessonView = ({ subject, grade, onBack, initialLessonId, initialLesson, initialUnit, initialSubject, initialGrade }) => {
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [unitsError, setUnitsError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsError, setLessonsError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonDetail, setLessonDetail] = useState(null);
  const [lessonDetailLoading, setLessonDetailLoading] = useState(false);
  const [lessonDetailError, setLessonDetailError] = useState(null);
  const [showOverview, setShowOverview] = useState(true);
  const [sidebarMode, setSidebarMode] = useState('units'); // 'units' or 'lessons'
  const [didAutoSelect, setDidAutoSelect] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track mobile viewport (<=420px)
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.matchMedia('(max-width: 420px)').matches);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  // Fetch units on mount
  useEffect(() => {
    setUnitsLoading(true);
    fetch(`/api/units?subjectId=${subject.id}&gradeId=${grade.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch units');
        return res.json();
      })
      .then(data => {
        setUnits(data);
        setUnitsLoading(false);
        if (data.length > 0) setSelectedUnit(data[0]);
      })
      .catch(err => {
        setUnitsError(err.message);
        setUnitsLoading(false);
      });
  }, [subject.id, grade.id]);

  // Fetch lessons when selectedUnit changes
  useEffect(() => {
    if (!selectedUnit) return;
    setLessonsLoading(true);
    fetch(`/api/lessons?unitId=${selectedUnit.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch lessons');
        return res.json();
      })
      .then(data => {
        setLessons(data);
        setLessonsLoading(false);
      })
      .catch(err => {
        setLessonsError(err.message);
        setLessonsLoading(false);
      });
  }, [selectedUnit]);

  // Fetch lesson details when selectedLesson changes
  useEffect(() => {
    if (!selectedLesson) return;
    setLessonDetailLoading(true);
    fetch(`/api/lesson/${selectedLesson.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch lesson details');
        return res.json();
      })
      .then(data => {
        setLessonDetail(data);
        setLessonDetailLoading(false);
      })
      .catch(err => {
        setLessonDetailError(err.message);
        setLessonDetailLoading(false);
      });
  }, [selectedLesson]);

  // Auto-select unit/lesson if initialLesson/unit/subject/grade are provided
  useEffect(() => {
    if (didAutoSelect) return;
    if (initialLesson && initialUnit && initialSubject && initialGrade) {
      // Use provided context
      setSelectedUnit({ ...initialUnit });
      setShowOverview(false);
      setSidebarMode('lessons');
      setTimeout(() => {
        setSelectedLesson({ id: initialLesson.id, name: initialLesson.name, videoUrl: initialLesson.videoUrl });
      }, 500);
      setDidAutoSelect(true);
    } else if (initialLessonId && !didAutoSelect && units.length) {
      // Fallback: fetch lesson and unit
      const fetchLesson = async () => {
        const res = await fetch(`/api/lesson/${initialLessonId}`);
        if (!res.ok) return;
        const lesson = await res.json();
        const unit = units.find(u => u.id === lesson.unitId);
        if (unit) {
          setSelectedUnit(unit);
          setShowOverview(false);
          setSidebarMode('lessons');
          setTimeout(() => {
            setSelectedLesson({ id: lesson.id, name: lesson.name, videoUrl: lesson.videoUrl });
          }, 500);
          setDidAutoSelect(true);
        }
      };
      fetchLesson();
    }
  }, [initialLesson, initialUnit, initialSubject, initialGrade, initialLessonId, didAutoSelect, units]);

  // Handler for next lesson
  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const idx = lessons.findIndex(l => l.id === selectedLesson.id);
    if (idx < lessons.length - 1) {
      setSelectedLesson(lessons[idx + 1]);
    }
  };

  // When a new unit is selected, reset to overview and switch sidebar to lessons
  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    // On mobile, skip the overview panel (📚 + Start Unit) and go straight to lessons
    setShowOverview(!isMobile);
    setSelectedLesson(null);
    setSidebarMode('lessons');
  };

  // When a lesson is selected from the sidebar
  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  // If a lesson is selected, show the lesson content page
  if (selectedLesson && lessonDetail) {
    return (
      <LessonContentPage
        lesson={lessonDetail}
        unit={selectedUnit}
        subject={subject}
        grade={grade}
        onBack={() => setSelectedLesson(null)}
        onNext={handleNextLesson}
      />
    );
  }
  if (selectedLesson && lessonDetailLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading lesson...</div>;
  }
  if (selectedLesson && lessonDetailError) {
    return <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>{lessonDetailError}</div>;
  }

  return (
    <div className={`ulv-container ${sidebarMode === 'lessons' ? 'mode-lessons' : 'mode-units'}`}>
      {/* Sidebar: Units or Lessons */}
      <aside className="ulv-sidebar">
        <div style={{ fontWeight: 600, fontSize: 17, color: '#2d3a2e', marginBottom: 12 }}>{grade.name} {subject.name}</div>
        {sidebarMode === 'units' ? (
          <>
            {unitsLoading ? (
              <div style={{ padding: '1rem', textAlign: 'center' }}>Loading units...</div>
            ) : unitsError ? (
              <div style={{ color: 'red', padding: '1rem', textAlign: 'center' }}>{unitsError}</div>
            ) : (
              units.map(unit => (
              <button
                key={unit.id}
                onClick={() => handleUnitSelect(unit)}
                style={{
                    background: selectedUnit && selectedUnit.id === unit.id ? '#ffe082' : 'none',
                    color: selectedUnit && selectedUnit.id === unit.id ? '#ff9800' : '#2d3a2e',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.7rem 1rem',
                  fontWeight: 500,
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: 2,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                  UNIT {unit.id}: {unit.name}
              </button>
              ))
            )}
            <button style={{ marginTop: 18, background: 'none', color: '#e82630', border: 'none', fontSize: 15, cursor: 'pointer' }} onClick={onBack}>
              ← Back to Grades/Subjects
            </button>
          </>
        ) : (
          <>
            <button style={{ marginBottom: 10, background: 'none', color: '#2d3a2e', border: 'none', fontSize: 15, cursor: 'pointer', textAlign: 'left' }} onClick={() => setSidebarMode('units')}>
              ← Back to Units
            </button>
            <div style={{ fontWeight: 600, fontSize: 15, color: '#2d3a2e', marginBottom: 8 }}>Lessons in {selectedUnit && selectedUnit.name}</div>
            {lessonsLoading ? (
              <div style={{ padding: '1rem', textAlign: 'center' }}>Loading lessons...</div>
            ) : lessonsError ? (
              <div style={{ color: 'red', padding: '1rem', textAlign: 'center' }}>{lessonsError}</div>
            ) : (
              lessons.map(lesson => (
              <button
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson)}
                style={{
                  background: 'none',
                  color: '#2d3a2e',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.5rem 1rem',
                  fontWeight: 500,
                  fontSize: 14,
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: 2,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                  {lesson.videoUrl ? <FaPlayCircle style={{ color: '#b0b3b8', fontSize: 16, marginRight: 6 }} /> : <FaQuestionCircle style={{ color: '#b0b3b8', fontSize: 16, marginRight: 6 }} />}
                  {lesson.name}
              </button>
              ))
            )}
          </>
        )}
      </aside>
      {/* Main Content: Unit Overview or Lessons */}
      <main className="ulv-main">
        {/* Mobile-only back to Units when in lessons mode */}
        {sidebarMode === 'lessons' && (
          <button
            className="ulv-mobile-only ulv-back-btn"
            onClick={() => setSidebarMode('units')}
          >
            ← Back to Units
          </button>
        )}
        {showOverview ? (
          // Unit Overview Panel
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>📚</span>
              <span style={{ fontSize: 22, fontWeight: 600, color: '#2d3a2e' }}>
                {selectedUnit ? `Unit ${selectedUnit.id}: ${selectedUnit.name}` : 'Select a Unit'}
              </span>
            </div>
            <div style={{ color: '#4e5d52', fontSize: 15, marginBottom: 16 }}>{selectedUnit && selectedUnit.description}</div>
            {/* Mastery bar (placeholder) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
              {masteryIcons.map(m => (
                <span key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15 }}>
                  {m.icon} {m.label}
                </span>
              ))}
            </div>
            {/* Start Unit Button */}
            {selectedUnit && (
            <button
              style={{ background: '#2d3a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2rem', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginTop: 18 }}
              onClick={() => setShowOverview(false)}
            >
              Start Unit
            </button>
            )}
          </div>
        ) : (
          // Lessons List
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#2d3a2e', marginBottom: 8 }}>
              {selectedUnit ? `Unit ${selectedUnit.id}: ${selectedUnit.name}` : 'Select a Unit'}
            </div>
            <div style={{ color: '#4e5d52', fontSize: 15, marginBottom: 16 }}>{selectedUnit && selectedUnit.description}</div>
            {/* Mastery bar (placeholder) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
              {masteryIcons.map(m => (
                <span key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15 }}>
                  {m.icon} {m.label}
                </span>
              ))}
            </div>
            {/* Lessons List (mobile-only). Hidden on desktop to avoid duplicate lists */}
            <div className="ulv-lessons-list-main" style={{ marginTop: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 17, color: '#2d3a2e', marginBottom: 10 }}>Lessons</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {lessons.map(lesson => (
                  <div key={lesson.id} className="ulv-lesson-item">
                    {lesson.videoUrl ? <FaPlayCircle style={{ color: '#b0b3b8', fontSize: 20 }} /> : <FaQuestionCircle style={{ color: '#b0b3b8', fontSize: 20 }} />}
                    <span className="ulv-lesson-name">{lesson.name}</span>
                    <button className="ulv-start-btn" onClick={() => setSelectedLesson(lesson)}>Start</button>
                  </div>
                ))}
              </div>
            </div>
            {/* Back to Overview Button */}
            <button
              style={{ background: 'none', color: '#2d3a2e', border: '1px solid #2d3a2e', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginTop: 32 }}
              onClick={() => setShowOverview(true)}
            >
              ← Back to Unit Overview
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UnitLessonView; 