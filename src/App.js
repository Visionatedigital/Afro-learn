import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/common/MainLayout';
import LearningHub from './pages/LearningHub';
import MathPage from './pages/MathPage';
import EnglishPage from './pages/EnglishPage';
import SciencePage from './pages/SciencePage';
import SocialStudiesPage from './pages/SocialStudiesPage';
import CulturalCorner from './pages/CulturalCorner';
import MoneySmart from './pages/MoneySmart';
import CodeClub from './pages/CodeClub';
import ParentPortal from './pages/ParentPortal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardPage from './pages/DashboardPage';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Community from './pages/Community';
import TeachersMentors from './pages/TeachersMentors';
import JoinClass from './pages/JoinClass';
import Settings from './pages/Settings';
import TeacherDashboard from './pages/TeacherDashboard';
import ClassDetailsPage from './pages/ClassDetailsPage';
import ParentDashboard from './pages/ParentDashboard';
import { useEffect, useState } from 'react';

function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/lesson/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch lesson');
        return res.json();
      })
      .then(data => {
        setLesson(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);
  if (loading) return <div style={{ padding: 40 }}>Loading lesson...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>{error}</div>;
  if (!lesson) return <div style={{ padding: 40 }}>Lesson not found.</div>;
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '2rem 2.5rem', minHeight: 500 }}>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#2d3a2e', marginBottom: 12 }}>{lesson.name}</div>
      {lesson.videoUrl ? (
        lesson.videoUrl.includes('youtube.com') ? (
          <iframe width="100%" height="320" src={lesson.videoUrl} title={lesson.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ borderRadius: 12, marginBottom: 18 }} />
        ) : (
          <video width="100%" height="320" controls style={{ borderRadius: 12, marginBottom: 18 }}>
            <source src={lesson.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      ) : (
        <div style={{ background: '#f7f7fa', borderRadius: 12, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', marginBottom: 18 }}>
          <span>No video for this lesson</span>
        </div>
      )}
      <div style={{ fontSize: 16, color: '#2d3a2e', marginBottom: 18 }}>{lesson.content}</div>
    </div>
  );
}

function UnitPage() {
  const { id } = useParams();
  return <div style={{ padding: 40 }}><h2>Unit {id}</h2><p>Unit details coming soon.</p></div>;
}
function SubjectPage() {
  const { id } = useParams();
  return <div style={{ padding: 40 }}><h2>Subject {id}</h2><p>Subject details coming soon.</p></div>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth pages: no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Main pages: with layout */}
          <Route element={<MainLayout />}>
                  <Route path="/math" element={<MathPage />} />
                  <Route path="/english" element={<EnglishPage />} />
                  <Route path="/science" element={<SciencePage />} />
                  <Route path="/social-studies" element={<SocialStudiesPage />} />
                  <Route path="/cultural-corner" element={<CulturalCorner />} />
                  <Route path="/money-smart" element={<MoneySmart />} />
                  <Route path="/code-club" element={<CodeClub />} />
                  <Route path="/parent-portal" element={<ParentPortal />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/community" element={<Community />} />
            <Route path="/teachers" element={<TeachersMentors />} />
            <Route path="/join-class" element={<JoinClass />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher-dashboard/class/:id" element={<ClassDetailsPage />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/lesson/:id" element={<LessonPage />} />
            <Route path="/unit/:id" element={<UnitPage />} />
            <Route path="/subject/:id" element={<SubjectPage />} />
            <Route path="/" element={<LearningHub hideSidebar={true} />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;