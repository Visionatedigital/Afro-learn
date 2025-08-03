import React from 'react';
import motif19 from '../../assets/images/motif_19.png';
import motif23717 from '../../assets/images/motif_23717.png';
import motif13 from '../../assets/images/motif_13.png';
import './AfroLearnCTASection.css';

const AfroLearnCTASection = () => {
  return (
    <section className="afrolearn-cta-minimal">
      {/* Motif behind/left of buttons */}
      <img src={motif19} alt="Motif 19" className="cta-motif motif-main" />
      {/* Motif bottom left */}
      <img src={motif23717} alt="Motif 23717" className="cta-motif motif-bottom-left" />
      {/* Motif bottom right */}
      <img src={motif13} alt="Motif 13" className="cta-motif motif-bottom-right" />

      <div className="cta-content-minimal">
        <h2 className="cta-heading-minimal">Join AfroLearn today</h2>
        <div className="cta-buttons-minimal">
          <button className="cta-btn-minimal">Learners</button>
          <button className="cta-btn-minimal">Teachers</button>
          <button className="cta-btn-minimal">Parents</button>
          <button className="cta-btn-minimal">Support AfroLearn</button>
        </div>
      </div>
    </section>
  );
};

export default AfroLearnCTASection; 