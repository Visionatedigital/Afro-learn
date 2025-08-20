import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaUsers, FaBook, FaRegLightbulb, FaHome, FaChevronRight, FaTasks, FaTrophy, FaUserCheck, FaPlus, FaArchive, FaEye, FaExclamationTriangle } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

const tabs = [
  { key: 'overview', label: 'Overview', icon: <FaHome /> },
  { key: 'classes', label: 'Classes', icon: <FaBook /> },
  { key: 'students', label: 'Students', icon: <FaUsers /> },
  { key: 'resources', label: 'Resources', icon: <FaRegLightbulb /> },
  { key: 'assistant', label: 'AI Assistant', icon: <FaChalkboardTeacher /> },
];

const mockTeacher = { name: 'Ms. Achieng', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=achieng' };
const mockResources = [
  {
    id: 1,
    title: 'Effective Lesson Planning',
    description: 'A step-by-step guide to planning engaging and effective lessons for primary students.',
    link: '#',
  },
  {
    id: 2,
    title: 'Classroom Management Strategies',
    description: 'Tips and techniques for maintaining a positive and productive classroom environment.',
    link: '#',
  },
  {
    id: 3,
    title: 'Inclusive Teaching Practices',
    description: 'How to ensure all students feel welcome and supported in your classroom.',
    link: '#',
  },
  {
    id: 4,
    title: 'Using Technology in the Classroom',
    description: 'Best practices for integrating digital tools and resources into your teaching.',
    link: '#',
  },
];

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  // removed unused showClassModal/selectedClass
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState(null);
  const [addForm, setAddForm] = useState({ name: '', grade: '', subject: '', students: '' });
  const [addError, setAddError] = useState('');
  const [weeklyData, setWeeklyData] = useState([0,0,0,0,0,0,0]);
  const [weeklyLoading, setWeeklyLoading] = useState(true);
  const [weeklyError, setWeeklyError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState(null);
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState(null);
  const [showClassSummaryModal, setShowClassSummaryModal] = useState(false);
  const [classSummary, setClassSummary] = useState(null);
  const [classSummaryLoading, setClassSummaryLoading] = useState(false);
  const [classSummaryError, setClassSummaryError] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);
  const [aiTab, setAiTab] = useState('plan');

  const aiTools = {
    plan: [
      'Lesson Roadmap',
      'Weekly Guide',
      'Learning Target Builder',
      'Group Work Planner',
      'Quick Planner',
    ],
    create: [
      'Quick Quiz Maker',
      'Story Spinner',
      'Lesson Builder',
      'Poster Pro',
      'Rhyme Time',
      'AfroArt Prompt',
      'Explain with a Skit',
    ],
    differentiate: [
      'Level Up/Down',
      'Home Helper',
      'Tailor Talk',
      'Visual Aid Wizard',
      'Translate It',
    ],
    support: [
      'Parent Talk',
      'Teacher Buddy',
      'Class Whisper',
      'Time Saver',
      'Learning Checkpoint',
    ],
    learn: [
      'Teacher Tips',
      'Know Your Learner',
      'What Works',
      'Mini Workshop',
      'Culture Boost',
    ],
  };
  const aiTabs = [
    { key: 'plan', label: 'Plan' },
    { key: 'create', label: 'Create' },
    { key: 'differentiate', label: 'Differentiate' },
    { key: 'support', label: 'Support' },
    { key: 'learn', label: 'Learn' },
  ];

  // const navigate = useNavigate(); // not used

  // Note: removed unused mockStudents to satisfy lint

  // Compute summary stats
  // const totalStudents = mockStudents.length;
  // const avgProgress = Math.round(mockStudents.reduce((sum, s) => sum + s.progress, 0) / totalStudents);
  // const topPerformer = mockStudents.reduce((top, s) => (s.progress > top.progress ? s : top), mockStudents[0]);

  const handleViewClass = (cls) => {
    setShowClassSummaryModal(true);
    setClassSummary(null);
    setClassSummaryLoading(true);
    setClassSummaryError(null);
    const token = localStorage.getItem('token');
    fetch(`/api/teacher/class/${cls.id}/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch class summary');
        return res.json();
      })
      .then(data => {
        setClassSummary(data);
        setClassSummaryLoading(false);
      })
      .catch(err => {
        setClassSummaryError('Could not load class summary.');
        setClassSummaryLoading(false);
      });
  };

  // const handleEditClass = (cls) => {
  //   alert(`Edit functionality coming soon for ${cls.name}`);
  // };

  const handleArchiveClass = (cls) => {
    if (window.confirm(`Are you sure you want to archive ${cls.name}?`)) {
      setClasses(classes.filter(c => c.id !== cls.id));
    }
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.grade || !addForm.subject || !addForm.students) {
      setAddError('Please fill in all fields.');
      return;
    }
    if (isNaN(Number(addForm.students)) || Number(addForm.students) < 1) {
      setAddError('Number of students must be a positive number.');
      return;
    }
    setClasses([
      ...classes,
      {
        id: Date.now(),
        name: addForm.name,
        grade: addForm.grade,
        subject: addForm.subject,
        students: Number(addForm.students),
      },
    ]);
    setAddForm({ name: '', grade: '', subject: '', students: '' });
    setAddError('');
    setShowAddClassModal(false);
  };

  // Fetch classes from backend on mount
  useEffect(() => {
    setClassesLoading(true);
    setClassesError(null);
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/teacher/classes', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch classes');
        const data = await res.json();
        setClasses(data);
        setClassesLoading(false);
      } catch (err) {
        setClassesError(err.message);
        setClassesLoading(false);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') return;
    setWeeklyLoading(true);
    setWeeklyError(null);
    const token = localStorage.getItem('token');
    fetch('/api/teacher/weekly-activity', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch weekly activity');
        return res.json();
      })
      .then(data => {
        setWeeklyData(Array.isArray(data.week) ? data.week : [0,0,0,0,0,0,0]);
        setWeeklyLoading(false);
      })
      .catch(err => {
        setWeeklyError('Could not load weekly activity.');
        setWeeklyData([60, 80, 70, 90, 100, 87, 95]); // fallback to mock
        setWeeklyLoading(false);
      });
    // Fetch Upcoming Assignments
    setAssignmentsLoading(true);
    setAssignmentsError(null);
    fetch('/api/teacher/upcoming-assignments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch assignments');
        return res.json();
      })
      .then(data => {
        setAssignments(Array.isArray(data) ? data : []);
        setAssignmentsLoading(false);
      })
      .catch(err => {
        setAssignmentsError('Could not load assignments.');
        setAssignments([
          { id: 1, title: 'Math Quiz 2', dueDate: 'Tomorrow', className: 'Primary 5 - Math', subject: 'Math', grade: 'Primary 5' },
          { id: 2, title: 'Reading Comprehension', dueDate: 'Friday', className: 'Primary 6 - English', subject: 'English', grade: 'Primary 6' },
        ]);
        setAssignmentsLoading(false);
      });
    // Fetch Recent Activity
    setActivityLoading(true);
    setActivityError(null);
    fetch('/api/teacher/recent-activity', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch activity');
        return res.json();
      })
      .then(data => {
        setActivity(Array.isArray(data) ? data : []);
        setActivityLoading(false);
      })
      .catch(err => {
        setActivityError('Could not load recent activity.');
        setActivity([
          { id: 1, type: 'achievement', text: 'Amina completed 5 lessons in Math', icon: 'trophy', timestamp: '2024-07-21T10:00:00Z' },
          { id: 2, type: 'submission', text: 'Samuel submitted Science Homework', icon: 'tasks', timestamp: '2024-07-21T09:30:00Z' },
          { id: 3, type: 'attendance', text: 'Fatima reached a 7-day streak', icon: 'user-check', timestamp: '2024-07-20T16:00:00Z' },
        ]);
        setActivityLoading(false);
      });
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'students') return;
    setStudentsLoading(true);
    setStudentsError(null);
    const token = localStorage.getItem('token');
    fetch('/api/teacher/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch students');
        return res.json();
      })
      .then(data => {
        setStudents(Array.isArray(data) ? data : []);
        setStudentsLoading(false);
      })
      .catch(err => {
        setStudentsError('Could not load students.');
        setStudents([]);
        setStudentsLoading(false);
      });
  }, [activeTab]);

  const fallbackSuggestions = [
    { id: 1, text: '3 students need help in Math', action: () => alert('Show students needing help in Math') },
    { id: 2, text: 'Try a new reading challenge', action: () => alert('Show reading challenge') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      {/* Minimal Tab Navigation */}
      <nav style={{
        display: 'flex',
        gap: 2,
        background: 'none',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 2.5rem',
        marginBottom: 24,
        boxShadow: 'none',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              fontWeight: 600,
              fontSize: 15,
              color: activeTab === tab.key ? '#2bb6bb' : '#444',
              borderBottom: activeTab === tab.key ? '2px solid #2bb6bb' : '2px solid transparent',
              padding: '0.7rem 1.1rem 0.5rem 1.1rem',
              cursor: 'pointer',
              transition: 'color 0.18s, border-bottom 0.18s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              outline: 'none',
              boxShadow: 'none',
              borderRadius: 0,
              marginBottom: -1,
            }}
          >
            <span style={{ fontSize: 17 }}>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </nav>
      {/* Main Content Area */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2.5rem 1.5rem 2.5rem', background: '#f7f6f2', borderRadius: 18, minHeight: 500 }}>
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 26, color: '#2d3a2e', marginBottom: 18 }}>Welcome, {mockTeacher.name}!</h2>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
              {/* Active Classes */}
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem 2rem', minWidth: 260, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#2bb6bb', marginBottom: 8 }}>Active Classes</div>
                {classesLoading ? (
                  <div style={{ color: '#888', padding: '1rem 0' }}>Loading classes...</div>
                ) : classesError ? (
                  <div style={{ color: 'red', padding: '1rem 0' }}>{classesError}</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {classes.map(cls => (
                      <li key={cls.id} style={{ marginBottom: 6 }}>
                        <button type="button" style={{ background: 'none', border: 'none', color: '#c2185b', fontWeight: 600, textDecoration: 'none', fontSize: 16, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', padding: 0 }} onClick={() => handleViewClass(cls)}>
                          {cls.name} <FaChevronRight style={{ fontSize: 13 }} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Weekly Activity (Bar Graph) */}
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem 2rem', minWidth: 260, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#2bb6bb', marginBottom: 8 }}>Weekly Activity</div>
                {weeklyLoading ? (
                  <div style={{ color: '#888', padding: '1rem 0' }}>Loading weekly activity...</div>
                ) : weeklyError ? (
                  <div style={{ color: 'red', padding: '1rem 0' }}>{weeklyError}</div>
                ) : (
                  <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 6, marginTop: 12 }}>
                    {weeklyData.map((val, i) => (
                      <div key={i} style={{ width: 18, height: val * 0.6, background: '#2bb6bb', borderRadius: 6, transition: 'height 0.2s' }} title={`Day ${i + 1}: ${val}`}></div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>Lessons completed/logins per day</div>
              </div>
              {/* AI Suggestions */}
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem 2rem', minWidth: 260, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#2bb6bb', marginBottom: 8 }}>AI Suggestions</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {fallbackSuggestions.map(s => (
                    <li key={s.id} style={{ marginBottom: 8 }}>
                      <button onClick={s.action} style={{ background: 'none', border: 'none', color: '#c2185b', fontWeight: 600, fontSize: 15, cursor: 'pointer', textAlign: 'left', padding: 0 }}>{s.text}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Row 2: Upcoming Assignments & Recent Activity */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {/* Upcoming Assignments */}
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem 2rem', minWidth: 320, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#2bb6bb', marginBottom: 8 }}>Upcoming Assignments</div>
                {assignmentsLoading ? (
                  <div style={{ color: '#888', padding: '1rem 0' }}>Loading assignments...</div>
                ) : assignmentsError ? (
                  <div style={{ color: 'red', padding: '1rem 0' }}>{assignmentsError}</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {assignments.map(a => (
                      <li key={a.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FaTasks color="#2bb6bb" />
                        <span style={{ fontWeight: 600 }}>{a.title}</span>
                        <span style={{ color: '#888', fontSize: 14 }}>({a.className})</span>
                        <span style={{ color: '#ff9800', fontWeight: 600, marginLeft: 'auto', fontSize: 14 }}>{a.dueDate}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Recent Activity Feed */}
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem 2rem', minWidth: 320, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#2bb6bb', marginBottom: 8 }}>Recent Activity</div>
                {activityLoading ? (
                  <div style={{ color: '#888', padding: '1rem 0' }}>Loading activity...</div>
                ) : activityError ? (
                  <div style={{ color: 'red', padding: '1rem 0' }}>{activityError}</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {activity.map(a => (
                      <li key={a.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                        {a.icon === 'trophy' && <FaTrophy color="#ff9800" />} 
                        {a.icon === 'tasks' && <FaTasks color="#2bb6bb" />} 
                        {a.icon === 'user-check' && <FaUserCheck color="#c2185b" />} 
                        <span style={{ fontWeight: 600 }}>{a.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 800, fontSize: 24, color: '#2d3a2e' }}>My Classes</h2>
              <button onClick={() => setShowAddClassModal(true)} style={{ background: '#2bb6bb', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaPlus /> Add Class
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {classes.map(cls => (
                <div key={cls.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #eee', padding: '1.5rem 2rem', minWidth: 260, flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#2bb6bb' }}>{cls.name}</div>
                  <div style={{ color: '#888', fontSize: 15 }}>{cls.grade} &bull; {cls.subject}</div>
                  <div style={{ color: '#c2185b', fontWeight: 600, fontSize: 15 }}>Students: {cls.students}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button onClick={() => handleViewClass(cls)} style={{ background: '#e0f7fa', color: '#2bb6bb', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><FaEye /> View</button>
                    <button onClick={() => handleArchiveClass(cls)} style={{ background: '#fff9ec', color: '#c2185b', border: 'none', borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><FaArchive /> Archive</button>
                  </div>
                </div>
              ))}
            </div>
            {/* Add Class Modal */}
            {showAddClassModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #eee', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 480, position: 'relative' }}>
                  <button onClick={() => setShowAddClassModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#2bb6bb', cursor: 'pointer' }}>×</button>
                  <h3 style={{ fontWeight: 800, fontSize: 22, color: '#2d3a2e', marginBottom: 12 }}>Add New Class</h3>
                  <form onSubmit={handleAddClass}>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontWeight: 600, color: '#2bb6bb', display: 'block', marginBottom: 4 }}>Class Name</label>
                      <input type="text" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontWeight: 600, color: '#2bb6bb', display: 'block', marginBottom: 4 }}>Grade</label>
                      <input type="text" value={addForm.grade} onChange={e => setAddForm(f => ({ ...f, grade: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontWeight: 600, color: '#2bb6bb', display: 'block', marginBottom: 4 }}>Subject</label>
                      <input type="text" value={addForm.subject} onChange={e => setAddForm(f => ({ ...f, subject: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 600, color: '#2bb6bb', display: 'block', marginBottom: 4 }}>Number of Students</label>
                      <input type="number" min="1" value={addForm.students} onChange={e => setAddForm(f => ({ ...f, students: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
                    </div>
                    {addError && <div style={{ color: '#c2185b', marginBottom: 10 }}>{addError}</div>}
                    <button type="submit" style={{ background: '#2bb6bb', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem', cursor: 'pointer', width: '100%' }}>Add Class</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Students Tab */}
        {activeTab === 'students' && (
          <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 0 2rem 0' }}>
            <h2 style={{ fontWeight: 800, fontSize: 24, color: '#2d3a2e', marginBottom: 24 }}>Student Roster</h2>
            {studentsLoading ? (
              <div style={{ color: '#888', padding: '1rem 0' }}>Loading students...</div>
            ) : studentsError ? (
              <div style={{ color: 'red', padding: '1rem 0' }}>{studentsError}</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: 'none' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e0e0', color: '#888', fontWeight: 700 }}>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Progress</th>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Attendance</th>
                    <th style={{ textAlign: 'left', padding: '8px 0' }}>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '8px 0', fontWeight: 600 }}>{s.name}</td>
                      <td style={{ padding: '8px 0' }}>
                        <div style={{ background: '#e0f7fa', borderRadius: 6, width: 100, height: 10, overflow: 'hidden', display: 'inline-block', marginRight: 8 }}>
                          <div style={{ width: `${s.progress}%`, height: 10, background: '#2bb6bb' }}></div>
                        </div>
                        <span>{s.progress}%</span>
                      </td>
                      <td style={{ padding: '8px 0' }}>{s.attendance}%</td>
                      <td style={{ padding: '8px 0' }}>{s.lastActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 0 2rem 0' }}>
            <h2 style={{ fontWeight: 800, fontSize: 24, color: '#2d3a2e', marginBottom: 24 }}>Teaching Resources</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {mockResources.map(resource => (
                <li key={resource.id} style={{ borderBottom: '1px solid #e0e0e0', padding: '1.2rem 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#2bb6bb' }}>{resource.title}</div>
                  <div style={{ color: '#444', fontSize: 15 }}>{resource.description}</div>
                  <div>
                    <button style={{ background: '#2bb6bb', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', cursor: 'pointer', marginTop: 6 }}>Read</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Assistant Tab */}
        {activeTab === 'assistant' && (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: 26, color: '#2d3a2e', marginBottom: 18 }}>AI Assistant Tools</h2>
            {/* Horizontal sub-tab bar */}
            <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1.5px solid #e0e0e0' }}>
              {aiTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAiTab(tab.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 16,
                    color: aiTab === tab.key ? '#2bb6bb' : '#444',
                    borderBottom: aiTab === tab.key ? '3px solid #2bb6bb' : '3px solid transparent',
                    padding: '0.7rem 1.3rem 0.5rem 1.3rem',
                    cursor: 'pointer',
                    transition: 'color 0.18s, border-bottom 0.18s',
                    outline: 'none',
                    borderRadius: 0,
                    marginBottom: -2,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tool cards grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 24,
              marginTop: 8,
            }}>
              {aiTools[aiTab].map(tool => (
                <div key={tool} style={{
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px #eee',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  minHeight: 120,
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#2d3a2e',
                  letterSpacing: 0.2,
                }}>
                  {tool}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      {showClassSummaryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #eee', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 700, width: '90vw', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowClassSummaryModal(false)} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 22, color: '#2bb6bb', cursor: 'pointer' }}>×</button>
            <h3 style={{ fontWeight: 800, fontSize: 22, color: '#2d3a2e', marginBottom: 12 }}>Class Summary</h3>
            {classSummaryLoading ? (
              <div style={{ color: '#888', padding: '1rem 0' }}>Loading class summary...</div>
            ) : classSummaryError ? (
              <div style={{ color: 'red', padding: '1rem 0' }}>{classSummaryError}</div>
            ) : classSummary ? (
              <>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 18 }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 16 }}>Students</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{classSummary.studentsCount}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 16 }}>Avg Progress</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{classSummary.avgProgress}%</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 16 }}>Avg Attendance</div>
                    <div style={{ fontSize: 22, fontWeight: 800 }}>{classSummary.avgAttendance}%</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 16 }}>Top Performer</div>
                    {classSummary.topPerformer ? (
                      <div style={{ fontSize: 18, fontWeight: 700 }}>{classSummary.topPerformer.name} <span style={{ color: '#888', fontWeight: 500, fontSize: 15 }}>({classSummary.topPerformer.progress}% / {classSummary.topPerformer.attendance}%)</span></div>
                    ) : <div style={{ color: '#888' }}>-</div>}
                  </div>
                </div>
                {/* Progress Over Time */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 16, marginBottom: 6 }}>Progress Over Time</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 60 }}>
                    {classSummary.progressOverTime.map((val, i) => (
                      <div key={i} style={{ width: 28, height: val * 0.6, background: '#2bb6bb', borderRadius: 6, transition: 'height 0.2s', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} title={`Week ${i + 1}: ${val}%`}>
                        <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, marginBottom: 2 }}>{val}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Weeks 1-6</div>
                </div>
                {/* Attendance Breakdown */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 16, marginBottom: 6 }}>Attendance</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ fontWeight: 600, color: '#388e3c' }}>Present: {classSummary.attendanceBreakdown.present}%</div>
                    <div style={{ fontWeight: 600, color: '#c2185b' }}>Absent: {classSummary.attendanceBreakdown.absent}%</div>
                  </div>
                </div>
                {/* Students Needing Attention */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, color: '#c2185b', fontSize: 16, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><FaExclamationTriangle color="#c2185b" /> Students Needing Attention</div>
                  {classSummary.studentsNeedingAttention.length === 0 ? (
                    <div style={{ color: '#888', fontSize: 15 }}>None 🎉</div>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {classSummary.studentsNeedingAttention.map(s => (
                        <li key={s.id} style={{ marginBottom: 4, fontSize: 15 }}>
                          {s.name} <span style={{ color: '#888' }}>(Progress: {s.progress}%, Attendance: {s.attendance}%)</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Student Roster */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 16, marginBottom: 6 }}>Student Roster</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, background: 'none' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e0e0e0', color: '#888', fontWeight: 700 }}>
                        <th style={{ textAlign: 'left', padding: '8px 0' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '8px 0' }}>Progress</th>
                        <th style={{ textAlign: 'left', padding: '8px 0' }}>Attendance</th>
                        <th style={{ textAlign: 'left', padding: '8px 0' }}>Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classSummary.studentRoster.map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '8px 0', fontWeight: 600 }}>{s.name}</td>
                          <td style={{ padding: '8px 0' }}>
                            <div style={{ background: '#e0f7fa', borderRadius: 6, width: 100, height: 10, overflow: 'hidden', display: 'inline-block', marginRight: 8 }}>
                              <div style={{ width: `${s.progress}%`, height: 10, background: '#2bb6bb' }}></div>
                            </div>
                            <span>{s.progress}%</span>
                          </td>
                          <td style={{ padding: '8px 0' }}>{s.attendance}%</td>
                          <td style={{ padding: '8px 0' }}>{s.lastActivity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
} 