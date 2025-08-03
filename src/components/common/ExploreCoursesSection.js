import React from 'react';
import './ExploreCoursesSection.css';
import patternSun from '../../assets/images/pattern-sun.svg';
import patternStar1 from '../../assets/images/pattern-star1.svg';
import patternStar2 from '../../assets/images/pattern-star2.svg';

const courses = [
  {
    title: 'Science Explorers',
    subtitle: 'AI-driven discovery for young minds',
    img: patternSun,
  },
  {
    title: 'Math Wizards',
    subtitle: 'Build numeracy from P1 to P7',
    img: patternStar1,
  },
  {
    title: 'English & Literature',
    subtitle: 'Words, reading, and stories',
    img: patternStar2,
  },
  {
    title: 'Social Studies',
    subtitle: 'Understand culture, civics, and place',
    img: patternSun,
  },
  {
    title: 'Life Skills',
    subtitle: 'Hygiene, empathy, emotional growth',
    img: patternStar1,
  },
  {
    title: 'Coding Club',
    subtitle: 'Code & logic for children (intro to ML)',
    img: patternStar2,
  },
  {
    title: 'African Heritage',
    subtitle: 'Stories, history, music',
    img: patternSun,
  },
  {
    title: 'Folk Tales',
    subtitle: 'Animated storytelling through African folklore',
    img: patternStar1,
  },
];

export default function ExploreCoursesSection() {
  return (
    <section className="explore-courses-section">
      <div className="explore-courses-left">
        <div className="motif motif1"><img src={patternSun} alt="African motif" /></div>
        <div className="motif motif2"><img src={patternStar1} alt="African motif" /></div>
        <div className="motif motif3"><img src={patternStar2} alt="African motif" /></div>
        <h1 className="explore-courses-header">Explore Our Courses</h1>
        <div className="what-we-do-block">
          <h2 className="what-we-do-title">What We Do</h2>
          <p className="what-we-do-desc">
            At AfroLearn, we blend AI with African values to offer early learners across the continent engaging, skill-based learning in science, storytelling, coding, and more. Our courses are designed with culture, creativity, and clarity.
          </p>
        </div>
        <button className="mission-btn">Meet Our Mission</button>
      </div>
      <div className="explore-courses-right">
        <div className="courses-grid-2x4">
          {courses.map((course) => (
            <div className="explore-course-card" key={course.title}>
              <div className="explore-course-img"><img src={course.img} alt="" /></div>
              <div className="explore-course-info">
                <h3 className="explore-course-title">{course.title}</h3>
                <p className="explore-course-subtitle">{course.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
 
 
 