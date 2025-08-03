import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import FloatingPatterns from './FloatingPatterns';

export default function Hero() {
  const navigate = useNavigate();

  const handleSignupClick = (role) => {
    navigate(`/signup?role=${role.toLowerCase()}`);
  };

  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <FloatingPatterns />
      <div className="hero-content">
        <div className="hero-illustration">
          <img
            src={require('../../assets/images/hero-img.png')}
            alt="Child learning on a laptop"
            className="hero-img pronounced"
          />
        </div>
        <div className="hero-text">
          <h1 className="hero-headline">
            Where <span className="headline-coral">African Roots</span> Meet <span className="headline-teal">Future Learning</span>
          </h1>
          <p className="hero-subheading">
            A non-profit platform bringing AI-powered, culturally grounded education to every child—because quality learning should be for all.
          </p>
          <div className="hero-cta-group">
            <button 
              className="hero-cta primary" 
              onClick={() => handleSignupClick('learner')}
            >
              For Students
            </button>
            <button 
              className="hero-cta secondary" 
              onClick={() => handleSignupClick('teacher')}
            >
              For Teachers
            </button>
            <button 
              className="hero-cta secondary" 
              onClick={() => handleSignupClick('parent')}
            >
              For Parents
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 