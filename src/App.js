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
import UbongoTools from './pages/UbongoTools';
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
import WordWizardPage from './pages/tools/WordWizardPage';
import ReadingSimplifierPage from './pages/tools/ReadingSimplifierPage';
import VocabularyRootsPage from './pages/tools/VocabularyRootsPage';
import MemoryHooksPage from './pages/tools/MemoryHooksPage';
import BrainBurstPage from './pages/tools/BrainBurstPage';
import LightningSummaryPage from './pages/tools/LightningSummaryPage';
import PictureDecoderPage from './pages/tools/PictureDecoderPage';
import FunSparksPage from './pages/tools/FunSparksPage';
import QuestQuizPage from './pages/tools/QuestQuizPage';
import StaticPage from './pages/StaticPage';

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
                  <Route path="/ubongo-tools" element={<UbongoTools />} />
                  <Route path="/tools/brain-burst" element={<BrainBurstPage />} />
                  <Route path="/tools/lightning-summary" element={<LightningSummaryPage />} />
                  <Route path="/tools/picture-decoder" element={<PictureDecoderPage />} />
                  <Route path="/tools/fun-sparks" element={<FunSparksPage />} />
                  <Route path="/tools/word-wizard" element={<WordWizardPage />} />
                  <Route path="/tools/reading-simplifier" element={<ReadingSimplifierPage />} />
                  <Route path="/tools/vocabulary-roots" element={<VocabularyRootsPage />} />
                  <Route path="/tools/memory-hooks" element={<MemoryHooksPage />} />
                  <Route path="/tools/quest-quiz" element={<QuestQuizPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/community" element={<Community />} />
                  {/* Static content pages wired from footer */}
                  <Route path="/about" element={<StaticPage title="About AfroLearn">AfroLearn is a nonprofit initiative dedicated to empowering every African child with culturally relevant, world-class education and life skills.</StaticPage>} />
                  <Route path="/team" element={<StaticPage title="Our Team">Meet the passionate educators, technologists, and community leaders behind AfroLearn.</StaticPage>} />
                  <Route path="/impact" element={<StaticPage title="Our Impact">We measure impact through learning outcomes, engagement, and community reach.</StaticPage>} />
                  <Route path="/partners" element={<StaticPage title="Partners">We collaborate with schools, NGOs, governments, and industry partners to scale learning.</StaticPage>} />
                  <Route path="/careers" element={<StaticPage title="Careers">Join our mission—explore roles in education, engineering, design, and operations.</StaticPage>} />
                  <Route path="/help" element={<StaticPage title="Help Center">Find answers to common questions and get support.</StaticPage>} />
                  <Route path="/press" element={<StaticPage title="Press">Media resources and press inquiries.</StaticPage>} />
                  <Route path="/volunteer" element={<StaticPage title="Volunteer">Contribute your time and skills to support learners.</StaticPage>} />
                  <Route path="/courses" element={<StaticPage title="Explore Courses">Browse subjects and skills tailored to your level.</StaticPage>} />
                  <Route path="/life-skills" element={<StaticPage title="Life Skills">Practical life skills for the 21st century.</StaticPage>} />
                  <Route path="/culturally-relevant" element={<StaticPage title="Culturally Relevant Learning">Learning that reflects African histories, languages, and stories.</StaticPage>} />
                  <Route path="/ai-education" element={<StaticPage title="AI-Powered Education">Personalized learning powered by safe, ethical AI.</StaticPage>} />
                  <Route path="/blog" element={<StaticPage title="Blog / Stories">Stories from classrooms, homes, and communities.</StaticPage>} />
                  <Route path="/events" element={<StaticPage title="Events">Workshops, webinars, and community meetups.</StaticPage>} />
                  <Route path="/join-teacher" element={<StaticPage title="Join as Teacher">Bring AfroLearn to your students.</StaticPage>} />
                  <Route path="/join-parent" element={<StaticPage title="Join as Parent">Support your child’s learning journey with AfroLearn.</StaticPage>} />
                  <Route path="/join" element={<StaticPage title="Join AfroLearn">Become part of our learning community.</StaticPage>} />
                  <Route path="/donate" element={<StaticPage title="Donate">Support our nonprofit mission.</StaticPage>} />
                  <Route path="/terms" element={<StaticPage title="Terms of Use">Please review the terms governing the use of AfroLearn.</StaticPage>} />
                  <Route path="/privacy" element={<StaticPage title="Privacy Policy">How we collect, use, and protect your data.</StaticPage>} />
                  <Route path="/cookies" element={<StaticPage title="Cookie Notice">Learn how we use cookies to improve your experience.</StaticPage>} />
                  <Route path="/accessibility" element={<StaticPage title="Accessibility Statement">Our commitment to accessible learning experiences.</StaticPage>} />
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