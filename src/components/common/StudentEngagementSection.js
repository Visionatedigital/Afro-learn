import React from 'react';
import kid1 from '../../assets/images/kid1.jpg';
import kid2 from '../../assets/images/kid2.jpg';
import kid3 from '../../assets/images/kid3.jpg';
import kid4 from '../../assets/images/kid4.jpg';
import './StudentEngagementSection.css';

const studentImages = [kid1, kid2, kid3, kid4];

const StudentEngagementSection = () => {
  return (
    <section className="student-engagement-section">
      <div className="engagement-container">
        {/* Left: Logo-shaped photo cluster */}
        <div className="photo-cluster logo-accurate">
          <div className="circle main" style={{ borderColor: '#3a4046' }}>
            <img src={studentImages[0]} alt="AfroLearn student" />
          </div>
          <div className="circle top-left" style={{ borderColor: '#2bb6bb' }}>
            <img src={studentImages[1]} alt="AfroLearn student" />
          </div>
          <div className="circle top-center" style={{ borderColor: '#e82630' }}>
            <img src={studentImages[2]} alt="AfroLearn student" />
          </div>
          <div className="circle top-right" style={{ borderColor: '#ffd24a' }}>
            <img src={studentImages[3]} alt="AfroLearn student" />
          </div>
          {/* Floating SVG motifs */}
          <svg className="motif motif-1" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="#FFD700" opacity="0.3" /></svg>
          <svg className="motif motif-2" width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#2EC4B6" opacity="0.2" /></svg>
          <svg className="motif motif-3" width="20" height="20" viewBox="0 0 20 20"><polygon points="10,2 18,18 2,18" fill="#FF6B35" opacity="0.2" /></svg>
        </div>
        {/* Right: Text and CTA */}
        <div className="engagement-content">
          <h2 className="engagement-title">Give Every Child the AfroLearn Advantage</h2>
          <p className="engagement-subheading">
            Every learner deserves a culturally relevant, future-ready education. With AfroLearn, students gain life skills, STEM literacy, and a sense of belonging.
          </p>
          <button className="cta-btn">Students, Start Here &rarr;</button>
        </div>
      </div>
    </section>
  );
};

export default StudentEngagementSection; 