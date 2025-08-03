import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import CourseGrid from './CourseGrid';
import CulturalSection from './CulturalSection';

const DashboardMain = () => {
  // State for subject/grade navigation
  const [selectedUnitView, setSelectedUnitView] = useState(null); // { subject, grade }

  return (
    <main style={{ flex: 1, padding: '2.5rem 3rem', background: '#f7f6f2', minHeight: '100vh' }}>
      <ProfileHeader />
      <div style={{ margin: '2.5rem 0' }}>
        <CourseGrid
          selectedUnitView={selectedUnitView}
          setSelectedUnitView={setSelectedUnitView}
        />
      </div>
      {/* Only show CulturalSection if not in subject/grade/unit/lesson navigation */}
      {!selectedUnitView && <CulturalSection />}
    </main>
  );
};

export default DashboardMain; 