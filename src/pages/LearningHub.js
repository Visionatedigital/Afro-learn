import React from 'react';
import Hero from '../components/common/Hero';
import ExploreCoursesSection from '../components/common/ExploreCoursesSection';
import StudentEngagementSection from '../components/common/StudentEngagementSection';
import TestimonialSection from '../components/common/TestimonialSection';
import AfroLearnCTASection from '../components/common/AfroLearnCTASection';
// import Footer from '../components/common/Footer';

const benefits = [
  {
    title: 'Personalized Learning Paths',
    desc: 'Our AI adapts to each child\'s learning style, providing customized lessons and challenges.',
    icon: '📊',
  },
  {
    title: 'Culturally Relevant Content',
    desc: 'Curriculum that reflects diverse cultures and histories, fostering inclusivity and understanding.',
    icon: '🌍',
  },
  {
    title: 'Fun and Engaging Activities',
    desc: 'Interactive games, videos, and stories that make learning an exciting adventure.',
    icon: '🎲',
  },
];

function LearningHub() {
  return (
    <div className="learning-hub">
      {/* <Navbar /> */}
      <Hero />
      <ExploreCoursesSection />
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Key Benefits */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Key Benefits</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {benefits.map((b) => (
            <div key={b.title} className="card shadow" style={{ flex: 1, minWidth: 220, maxWidth: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{b.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}>{b.title}</h3>
              <p style={{ color: 'var(--color-secondary)', fontSize: '0.95rem', textAlign: 'center' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <StudentEngagementSection />
      <TestimonialSection />
      <AfroLearnCTASection />
      {/* <Footer /> */}
    </div>
  );
}

export default LearningHub; 
