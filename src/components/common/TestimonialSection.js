import React from 'react';
import kid2 from '../../assets/images/kid2.jpg';
import './TestimonialSection.css';

const TestimonialSection = () => (
  <section className="testimonial-section">
    <div className="testimonial-bg-shape"></div>
    <div className="testimonial-content container">
      <blockquote className="testimonial-quote">
        “AfroLearn makes me feel proud of who I am. I love learning about science and stories from Africa. Now, I believe I can do anything!”
      </blockquote>
      <div className="testimonial-person">
        <div className="testimonial-img-frame">
          <img src={kid2} alt="Amina, Kenya - AfroLearn student" />
        </div>
        <div className="testimonial-meta">
          <div className="testimonial-name">AMINA</div>
          <div className="testimonial-country">KENYA</div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialSection; 
 
 
 