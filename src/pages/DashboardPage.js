import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileHeader from '../../src/components/layout/ProfileHeader';
import CourseGrid from '../../src/components/layout/CourseGrid';
import CulturalSection from '../../src/components/layout/CulturalSection';
import TopBar from '../../src/components/layout/TopBar';
import StudyBuddy from '../components/features/StudyBuddy';

const DashboardPage = () => {
  const [selectedUnitView, setSelectedUnitView] = useState(null);
  const [initialLessonId, setInitialLessonId] = useState(null);
  const [initialUnitView, setInitialUnitView] = useState(null);
  const [initialLesson, setInitialLesson] = useState(null);
  const [initialUnit, setInitialUnit] = useState(null);
  const [initialSubject, setInitialSubject] = useState(null);
  const [initialGrade, setInitialGrade] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      if (location.state.lesson && location.state.unit && location.state.subject && location.state.grade) {
        setInitialLesson(location.state.lesson);
        setInitialUnit(location.state.unit);
        setInitialSubject(location.state.subject);
        setInitialGrade(location.state.grade);
        setInitialUnitView({ subject: location.state.subject, grade: location.state.grade });
        setSelectedUnitView({ subject: location.state.subject, grade: location.state.grade });
      } else if (location.state.lessonId) {
        const lessonId = location.state.lessonId;
        setInitialLessonId(lessonId);
        // Fallback: fetch context as before
        fetch(`/api/lesson/${lessonId}`)
          .then(res => res.json())
          .then(lesson => {
            if (!lesson || !lesson.unitId) return;
            fetch(`/api/unit/${lesson.unitId}`)
              .then(res => res.json())
              .then(unit => {
                if (!unit) return;
                fetch(`/api/subjects`)
                  .then(res => res.json())
                  .then(subjects => {
                    const subject = Array.isArray(subjects) ? subjects.find(s => s.id === unit.subjectId) : null;
                    fetch(`/api/grades`)
                      .then(res => res.json())
                      .then(grades => {
                        const grade = Array.isArray(grades) ? grades.find(g => g.id === unit.gradeId) : null;
                        if (subject && grade) {
                          setInitialUnitView({ subject, grade });
                          setSelectedUnitView({ subject, grade });
                        }
                      });
                  });
              });
          });
      }
    }
    // eslint-disable-next-line
  }, [location.state]);

  return (
    <>
      <TopBar />
      <div className="afl-topbar-spacer" />
      <ProfileHeader />
      <div style={{ margin: '2.5rem 0' }}>
        <CourseGrid
          selectedUnitView={selectedUnitView}
          setSelectedUnitView={setSelectedUnitView}
          initialLessonId={initialLessonId}
          initialLesson={initialLesson}
          initialUnit={initialUnit}
          initialSubject={initialSubject}
          initialGrade={initialGrade}
        />
      </div>
      {!selectedUnitView && (
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', margin: '2rem 0' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <CulturalSection />
          </div>
          <div style={{ flex: 1, minWidth: 0, maxWidth: 420 }}>
            <StudyBuddy />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage; 