import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import { QuickExplainerModal } from '../components/QuickExplainer';

const ToolIcon = ({ type, color = '#2bb6bb' }) => {
  const common = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
  switch (type) {
    default:
  return (
        <svg {...common}><circle cx="12" cy="12" r="8" fill={color}/></svg>
      );
  }
};

const UbongoTools = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('learn');
  const [showQuickExplainer, setShowQuickExplainer] = useState(false);
  
  const userProfile = {
    name: 'Student',
    age: 12,
    grade: '6th',
    subject: 'Math',
    level: 'Intermediate',
    learning_style: 'Visual',
    last_score: 75,
    focus: 'Fractions'
  };

  const ubongoTools = {
    learn: [
      { name: 'Brain Burst', slug: 'brain-burst', icon: 'bolt', description: "Get a quick, clear explanation of any topic you're studying.", color: '#2bb6bb' },
      { name: 'Word Wizard', slug: 'word-wizard', icon: 'wand', description: 'Stuck on a word? Get the meaning, usage, and a sentence.', color: '#ff9800' },
      { name: 'Lightning Summary', slug: 'lightning-summary', icon: 'bolt', description: 'Finished a lesson? Get a fast summary of the key points.', color: '#00796b' },
      { name: 'Picture Decoder', slug: 'picture-decoder', icon: 'image', description: 'Upload or select a picture and get an easy explanation.', color: '#6ecb63' },
      { name: 'Fun Sparks', slug: 'fun-sparks', icon: 'star', description: "Discover fun, surprising facts related to what you're learning.", color: '#3f51b5' },
      { name: 'Reading Simplifier', slug: 'reading-simplifier', icon: 'book', description: 'Paste text → simplified version with glossed terms.', color: '#8e44ad' },
      { name: 'Vocabulary Roots (Etymology)', slug: 'vocabulary-roots', icon: 'palette', description: 'See roots/prefixes/suffixes and related family words.', color: '#c0392b' },
      { name: 'Memory Hooks (Mnemonics)', slug: 'memory-hooks', icon: 'star', description: '2–3 mnemonics tailored to the topic and age.', color: '#16a085' },
    ],
    practice: [
      { name: 'Quest Quiz', slug: 'quest-quiz', icon: 'question', description: 'Test your knowledge with AI-generated questions and instant feedback.', color: '#2bb6bb' },
      { name: 'Step Sensei', slug: 'step-sensei', icon: 'path', description: 'See step-by-step solutions for math or science problems.', color: '#ff9800' },
      { name: 'Flash Forge', slug: 'flash-forge', icon: 'layers', description: 'Auto-create flashcards from your learning and review quickly.', color: '#00796b' },
      { name: 'Exam Oracle', slug: 'exam-oracle', icon: 'eye', description: 'Practice with past-style questions, auto-selected by topic.', color: '#6ecb63' },
      { name: 'Error Eraser', slug: 'error-eraser', icon: 'eraser', description: 'Paste your work and get mistakes highlighted with fixes.', color: '#3f51b5' },
    ],
    create: [
      { name: 'Visual Forge', slug: 'visual-forge', icon: 'palette', description: 'See diagrams and visuals that make tricky concepts clear.', color: '#2bb6bb' },
      { name: 'Story Spinner', slug: 'story-spinner', icon: 'book', description: 'Turn your topic into a story with characters and action.', color: '#ff9800' },
      { name: 'Voice Mentor', slug: 'voice-mentor', icon: 'mic', description: 'Read aloud and get tips on pronunciation and speaking.', color: '#00796b' },
      { name: 'XP Mode', slug: 'xp-mode', icon: 'gamepad', description: 'Turn practice into a game. Earn points and unlock challenges.', color: '#6ecb63' },
    ],
    plan: [
      { name: 'Master Plan', slug: 'master-plan', icon: 'map', description: 'Get a personalized study plan to keep you on track.', color: '#2bb6bb' },
      { name: 'Next Level', slug: 'next-level', icon: 'arrow-up', description: "AI suggests the next best topic based on what you've learned.", color: '#ff9800' },
      { name: 'Squad Builder', slug: 'squad-builder', icon: 'users', description: 'Group work? Split tasks and plan together with AI help.', color: '#00796b' },
    ],
    advanced: [
      { name: 'Debate Arena', slug: 'debate-arena', icon: 'scales', description: 'Practice arguments for or against a topic and hear both sides.', color: '#2bb6bb' },
      { name: 'Real-World Radar', slug: 'real-world-radar', icon: 'globe', description: 'See how your lesson connects to real jobs and inventions.', color: '#ff9800' },
      { name: 'Teachback Turbo', slug: 'teachback-turbo', icon: 'repeat', description: 'Explain what you learned while AI asks questions like a student.', color: '#00796b' },
    ],
  };

  const ubongoTabs = [
    { key: 'learn', label: 'Learn' },
    { key: 'practice', label: 'Practice' },
    { key: 'create', label: 'Create' },
    { key: 'plan', label: 'Plan' },
    { key: 'advanced', label: 'Advanced' },
  ];

  const handleToolClick = (tool) => {
    if (tool.name === 'Brain Burst') {
      setShowQuickExplainer(true);
      return;
    }
    if (tool.slug) navigate(`/tools/${tool.slug}`);
  };

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '2rem 0.5rem'
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        boxShadow: '0 2px 8px #eee', 
        padding: '2rem', 
        marginBottom: '2rem'
      }}>
        <h1 style={{ 
          fontWeight: 800, 
          fontSize: 28, 
          color: '#2d3a2e', 
          marginBottom: '1rem'
        }}>
          Ubongo Tools
        </h1>
        
        <p style={{ 
          color: '#4e5d52', 
          fontSize: 16,
          lineHeight: '1.6',
          margin: 0
        }}>
          Welcome to your AI-powered learning tools! Here you can access various educational resources and get help with your studies.
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '2rem',
        background: '#fff',
        borderRadius: 12,
        padding: '0.5rem',
        boxShadow: '0 2px 8px #eee'
      }}>
        {ubongoTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: 8,
              background: activeTab === tab.key ? '#2bb6bb' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#4e5d52',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? '700' : '600',
              fontSize: 14,
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {ubongoTools[activeTab]?.map((tool, index) => (
          <div
            key={index}
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 2px 8px #eee',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: `2px solid ${tool.color}20`,
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 16px #eee';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px #eee';
            }}
            onClick={() => handleToolClick(tool)}
          >
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '4px',
              height: '100%',
              background: tool.color
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
    <div style={{ 
                width: 36, height: 36, borderRadius: 10,
                background: `${tool.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ToolIcon type={tool.icon} color={tool.color} />
      </div>
            <h3 style={{ 
                margin: 0, 
              fontSize: 18,
              fontWeight: '700',
              color: '#2d3a2e'
            }}>
              {tool.name}
            </h3>
      </div>

            <p style={{ 
              margin: '0', 
              color: '#4e5d52',
              lineHeight: '1.5',
              fontSize: 14
            }}>
              {tool.description}
            </p>
          </div>
        ))}
      </div>

      <QuickExplainerModal
        isOpen={showQuickExplainer}
        onClose={() => setShowQuickExplainer(false)}
        userProfile={userProfile}
      />

      <Chatbot userProfile={userProfile} showInUbongoTools={true} />
    </div>
  );
};

export default UbongoTools;
