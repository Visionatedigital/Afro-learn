import React from 'react';
import './FloatingPatterns.css';
import patternSun from '../../assets/images/pattern-sun.svg';
import patternStar1 from '../../assets/images/pattern-star1.svg';
import patternStar2 from '../../assets/images/pattern-star2.svg';

export default function FloatingPatterns() {
  return (
    <div className="floating-patterns">
      <img src={patternSun} className="pattern pattern-sun pattern1" alt="African sun pattern" />
      <img src={patternStar1} className="pattern pattern-star1 pattern2" alt="African star pattern 1" />
      <img src={patternStar2} className="pattern pattern-star2 pattern3" alt="African star pattern 2" />
      <img src={patternStar1} className="pattern pattern-star1 pattern4" alt="African star pattern 1" />
      <img src={patternSun} className="pattern pattern-sun pattern5" alt="African sun pattern" />
      <img src={patternStar2} className="pattern pattern-star2 pattern6" alt="African star pattern 2" />
    </div>
  );
} 