import React from 'react';
import './KeyBenefits.css';

const KeyBenefits = () => {
  const benefits = [
    {
      icon: '🌍',
      title: 'Culturally Relevant Learning',
      subtitle: 'Rooted in African stories, values, languages, and visual identity.',
      description: 'Most platforms ignore local identity — AfroLearn embraces it. It gives parents pride and kids familiarity.'
    },
    {
      icon: '🤖',
      title: 'AI-Powered, Personalized Education',
      subtitle: 'Adaptive content tailored to every learner\'s pace and level.',
      description: 'This brings modern credibility. It positions AfroLearn as tech-forward, even if the user is in a low-tech context — making it future-proof.'
    },
    {
      icon: '🤝',
      title: 'Life Skills That Matter',
      subtitle: 'Empathy, hygiene, confidence — because school isn\'t just books.',
      description: 'Parents care deeply about their child\'s character. This shows AfroLearn goes beyond academics and builds strong humans.'
    }
  ];

  return (
    <section className="key-benefits">
      <div className="container">
        <div className="benefits-header">
          <h2>Why Choose AfroLearn?</h2>
          <p>Discover what makes our platform unique and powerful for your child's growth</p>
        </div>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">
                <span className="icon">{benefit.icon}</span>
                <div className="medal">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                </div>
              </div>
              
              <div className="benefit-content">
                <h3>{benefit.title}</h3>
                <p className="subtitle">{benefit.subtitle}</p>
                <p className="description">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits; 