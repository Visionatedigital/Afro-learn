import React, { useState } from 'react';

const videoLessonTitle = 'Adding within 20 using place value blocks';
const videoSrc = require('../../assets/images/Adding with place value blocks.mp4');

const mockExplanation = 'In this lesson, you will learn how to add numbers within 20 using place value blocks. Place value blocks help you visualize numbers and make addition easier!';
const mockQuestions = [
  { id: 1, question: 'What is 7 + 6 using place value blocks?', answer: '13' },
  { id: 2, question: 'If you have 10 blocks and add 4 more, how many do you have?', answer: '14' },
];

const mockAbout = `Where did the word "Algebra" and its underlying ideas come from? Algebra, a key branch of mathematics, has a rich history. The term 'algebra' comes from an Arabic word meaning 'restoration' or 'completion'. Significant contributions to algebra were made by Diophantus in Greece, Brahmagupta in India, and al-Khwarizmi in Baghdad, who is often credited with giving algebra its name.`;

const mockTranscript = `And if you go to 600 AD-- so if you go to about 600 AD, another famous mathematician in the history of algebra was Brahmagupta, in India. ... And then you have al-Khwarizmi, who shows up right there, al-Khwarizmi. And he is the gentleman that definitely we credit with the name algebra, comes from Arabic for restoration, and some people also consider him to be, if not the father of algebra, although some people say he is the father, he is one of the fathers of algebra because he really started to think about algebra in the abstract sense, devoid of some specific problems and a lot of the way a modern mathematician would start to think about the field.`;

const mockComments = [
  { id: 1, user: 'DevinLarsen', time: '13 years ago', text: 'How does a person or group of people discover/invent a new type of math like Algebra? How did Newton invent calculus?' },
  { id: 2, user: 'Captain', time: '12 years ago', text: 'Sometimes there is a problem that we cannot answer using the current type of math, so we must discover a way to answer the new problem.' },
];

const LessonContentPage = ({ lesson, unit, subject, grade, onBack, onNext }) => {
  // Breadcrumbs
  const breadcrumbs = [
    { label: 'Dashboard', onClick: null },
    { label: grade.name, onClick: null },
    { label: subject.name, onClick: null },
    { label: `Unit ${unit.id}`, onClick: null },
    { label: lesson.name, onClick: null },
  ];

  const [tab, setTab] = useState('about');
  const [comments, setComments] = useState(mockComments);
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === '') return;
    setComments([
      ...comments,
      { id: comments.length + 1, user: 'CurrentUser', time: 'just now', text: commentText }
    ]);
    setCommentText('');
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '2rem 2.5rem', minHeight: 500 }}>
      {/* Breadcrumbs */}
      <div style={{ marginBottom: 18, fontSize: 14, color: '#888' }}>
        {breadcrumbs.map((b, i) => (
          <span key={i}>
            {b.label}
            {i < breadcrumbs.length - 1 && ' > '}
          </span>
        ))}
      </div>
      {/* Lesson Title */}
      <div style={{ fontSize: 22, fontWeight: 600, color: '#2d3a2e', marginBottom: 12 }}>{lesson.name}</div>
      {/* Video (if available) */}
      {lesson.videoUrl && lesson.videoUrl.includes('youtube.com') ? (
        <iframe
          width="100%"
          height="320"
          src={lesson.videoUrl}
          title={lesson.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: 12, marginBottom: 18 }}
        />
      ) : lesson.videoUrl ? (
        <video width="100%" height="320" controls style={{ borderRadius: 12, marginBottom: 18 }}>
          <source src={lesson.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={{ background: '#f7f7fa', borderRadius: 12, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', marginBottom: 18 }}>
          <span>No video for this lesson</span>
        </div>
      )}
      {/* Tabs for About/Transcript */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #eee', marginBottom: 18 }}>
        <button
          style={{
            background: tab === 'about' ? '#fff' : '#f7f7fa',
            border: 'none',
            borderBottom: tab === 'about' ? '2px solid #2d3a2e' : 'none',
            color: tab === 'about' ? '#2d3a2e' : '#888',
            fontWeight: tab === 'about' ? 600 : 500,
            fontSize: 16,
            padding: '0.7rem 1.5rem',
            cursor: 'pointer',
            outline: 'none',
          }}
          onClick={() => setTab('about')}
        >
          About
        </button>
        <button
          style={{
            background: tab === 'transcript' ? '#fff' : '#f7f7fa',
            border: 'none',
            borderBottom: tab === 'transcript' ? '2px solid #2d3a2e' : 'none',
            color: tab === 'transcript' ? '#2d3a2e' : '#888',
            fontWeight: tab === 'transcript' ? 600 : 500,
            fontSize: 16,
            padding: '0.7rem 1.5rem',
            cursor: 'pointer',
            outline: 'none',
          }}
          onClick={() => setTab('transcript')}
        >
          Transcript
        </button>
      </div>
      <div style={{ minHeight: 80, marginBottom: 18, fontSize: 15, color: '#444', background: '#f7f7fa', borderRadius: 8, padding: '1rem 1.2rem' }}>
        {tab === 'about' ? mockAbout : mockTranscript}
      </div>
      {/* Concept Explanation */}
      <div style={{ fontSize: 16, color: '#2d3a2e', marginBottom: 18 }}>{mockExplanation}</div>
      {/* Progress Bar (mock) */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ height: 8, background: '#e0e0e0', borderRadius: 4, width: '100%' }}>
          <div style={{ width: '40%', height: '100%', background: '#2d3a2e', borderRadius: 4 }} />
        </div>
        <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Lesson progress: 40%</div>
      </div>
      {/* Practice Questions (mock) */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: '#2d3a2e', marginBottom: 8 }}>Practice Questions</div>
        <ul style={{ paddingLeft: 18 }}>
          {mockQuestions.map(q => (
            <li key={q.id} style={{ marginBottom: 6 }}>{q.question}</li>
          ))}
        </ul>
      </div>
      {/* Comments Section */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: '#2d3a2e', marginBottom: 8 }}>Discussion</div>
        <form onSubmit={handleCommentSubmit} className="lesson-content-comments-form" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #ccc', fontSize: 15 }}
          />
          <button type="submit" style={{ background: '#2d3a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>
            Post
          </button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {comments.map(c => (
            <div key={c.id} style={{ background: '#f7f7fa', borderRadius: 8, padding: '0.7rem 1.2rem', fontSize: 15, color: '#2d3a2e' }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#2d3a2e', marginBottom: 2 }}>{c.user} <span style={{ color: '#888', fontWeight: 400, fontSize: 13 }}>· {c.time}</span></div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <button style={{ background: 'none', color: '#e82630', border: '1px solid #e82630', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500, fontSize: 15, cursor: 'pointer' }} onClick={onBack}>
          Back to Unit
        </button>
        <button style={{ background: '#2d3a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500, fontSize: 15, cursor: 'pointer' }} onClick={onNext}>
          Next Lesson
        </button>
      </div>
    </div>
  );
};

export default LessonContentPage; 