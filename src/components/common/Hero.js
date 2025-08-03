import React from 'react';
import './Hero.css';
import FloatingPatterns from './FloatingPatterns';

export default function Hero() {
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
            <button className="hero-cta primary">For Students</button>
            <button className="hero-cta secondary">For Teachers</button>
            <button className="hero-cta secondary">For Parents</button>
          </div>
        </div>
      </div>
    </section>
  );
} 