import React from 'react';
import ProfileOverview from '../components/layout/ProfileOverview';
import ProfileAchievements from '../components/layout/ProfileAchievements';
import TopBar from '../components/layout/TopBar';

export default function Profile() {
  return (
    <div className="profile-page-main" style={{ maxWidth: 1100, margin: '0 auto', padding: '1.2rem 1rem 2.5rem 1rem' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      <ProfileOverview />
      <ProfileAchievements />
    </div>
  );
} 
 