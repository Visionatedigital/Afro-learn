import React, { useState } from 'react';
import { FaQuoteLeft, FaBookOpen, FaGlobeAfrica, FaPlayCircle, FaVolumeUp, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const mockCulturalItems = [
  {
    id: 1,
    type: 'proverb',
    title: 'African Proverb',
    content: 'Wisdom is like a baobab tree; no one individual can embrace it.',
    explanation: 'This Ghanaian proverb means that wisdom is best shared and no one person has all the answers.',
    imageUrl: null,
  },
  {
    id: 2,
    type: 'fact',
    title: 'Did You Know?',
    content: 'The Great Mosque of Djenné in Mali is the largest mud-brick building in the world.',
    imageUrl: null,
  },
  {
    id: 3,
    type: 'story',
    title: 'Why the Lion Roars',
    content: 'Long ago, in the savannah, the lion lost his voice. He went on a journey to find it... (full story)',
    snippet: 'Long ago, in the savannah, the lion lost his voice...',
    imageUrl: null,
    audioUrl: null,
    videoUrl: null,
  },
  {
    id: 4,
    type: 'video',
    title: 'Storytelling: The Clever Hare',
    content: null,
    videoUrl: 'https://www.youtube.com/embed/O-6q-siuMik',
    imageUrl: null,
  },
];

const typeIcon = {
  proverb: <FaQuoteLeft style={{ color: '#ff9800', fontSize: 22 }} />,
  fact: <FaGlobeAfrica style={{ color: '#2bb6bb', fontSize: 22 }} />,
  story: <FaBookOpen style={{ color: '#6ecb63', fontSize: 22 }} />,
  video: <FaPlayCircle style={{ color: '#e82630', fontSize: 22 }} />,
  audio: <FaVolumeUp style={{ color: '#2d3a2e', fontSize: 22 }} />,
};

export default function CulturalSection() {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const item = mockCulturalItems[index];

  const handleNext = () => setIndex((i) => (i + 1) % mockCulturalItems.length);
  const handlePrev = () => setIndex((i) => (i - 1 + mockCulturalItems.length) % mockCulturalItems.length);

  return (
    <section className="afl-cultural-section" style={{ background: '#fff9ec', borderRadius: 16, boxShadow: '0 2px 8px #ffe082', padding: '1.5rem 2rem', margin: '2rem 0', maxWidth: 500 }}>
      <div style={{ fontWeight: 700, fontSize: 22, color: '#e82630', marginBottom: 10, letterSpacing: 1 }}>Cultural Corner</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        {typeIcon[item.type]}
        <span style={{ fontWeight: 600, fontSize: 18, color: '#2d3a2e' }}>{item.title}</span>
      </div>
      <div style={{ fontSize: 17, color: '#2d3a2e', marginBottom: 10 }}>
        {item.type === 'story' && item.snippet ? item.snippet : item.content}
      </div>
      {item.type === 'video' && item.videoUrl && (
        <div style={{ margin: '1rem 0' }}>
          <iframe
            width="100%"
            height="220"
            src={item.videoUrl}
            title={item.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 12 }}
          />
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button onClick={handlePrev} style={{ background: 'none', border: 'none', color: '#2d3a2e', fontSize: 18, cursor: 'pointer' }} title="Previous"><FaArrowLeft /></button>
        <button onClick={() => setShowModal(true)} style={{ background: '#2d3a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>
          {item.type === 'proverb' ? 'Learn More' : item.type === 'story' ? 'Read' : item.type === 'video' ? 'Watch' : 'More'}
        </button>
        <button onClick={handleNext} style={{ background: 'none', border: 'none', color: '#2d3a2e', fontSize: 18, cursor: 'pointer' }} title="Next"><FaArrowRight /></button>
      </div>
      {/* Modal for full content */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #bbb', padding: '2rem 2.5rem', minWidth: 320, maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
              {typeIcon[item.type]}
              <span style={{ fontWeight: 600, fontSize: 20, color: '#2d3a2e' }}>{item.title}</span>
            </div>
            {item.type === 'video' && item.videoUrl ? (
              <iframe
                width="100%"
                height="260"
                src={item.videoUrl}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 12, marginBottom: 18 }}
              />
            ) : (
              <div style={{ fontSize: 17, color: '#2d3a2e', marginBottom: 10 }}>
                {item.content}
              </div>
            )}
            {item.explanation && (
              <div style={{ fontSize: 15, color: '#4e5d52', marginBottom: 10 }}>{item.explanation}</div>
            )}
            <button onClick={() => setShowModal(false)} style={{ background: '#2d3a2e', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginTop: 18 }}>
              Close
            </button>
          </div>
      </div>
      )}
    </section>
  );
} 