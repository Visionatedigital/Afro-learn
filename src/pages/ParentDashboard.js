import React, { useState } from 'react';
import { FaUserCircle, FaChevronDown, FaMedal, FaPlus, FaBookOpen, FaCog, FaBell, FaUserEdit, FaTrash } from 'react-icons/fa';

const parentName = 'Mrs. Okafor';
const mockChildren = [
  { id: 1, name: 'Amina Okafor', class: 'Primary 5', timeSpent: '1h 20m', currentSubject: 'Math', badges: ['Math Star', 'Attendance Pro'] },
  { id: 2, name: 'Samuel Okafor', class: 'Primary 3', timeSpent: '45m', currentSubject: 'English', badges: ['Reading Champ'] },
];
const mockAssignments = [
  { id: 1, child: 'Amina Okafor', title: 'Math Homework 2', status: 'Completed' },
  { id: 2, child: 'Amina Okafor', title: 'English Reading', status: 'In progress' },
  { id: 3, child: 'Samuel Okafor', title: 'Science Quiz', status: 'Not started' },
];
const mockInvites = [
  { id: 1, name: 'Fatima Okafor', status: 'Pending', email: 'fatima@email.com' },
];

const tabs = [
  { key: 'activity', label: 'Activity', icon: <FaBookOpen /> },
  { key: 'assignments', label: 'Assignments', icon: <FaMedal /> },
  { key: 'settings', label: 'Settings', icon: <FaCog /> },
];

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('activity');
  const [showDropdown, setShowDropdown] = useState(false);
  const [children, setChildren] = useState(mockChildren);
  const [showAddModal, setShowAddModal] = useState(false);
  const [invites, setInvites] = useState(mockInvites);
  const [addForm, setAddForm] = useState({ name: '', class: '', email: '' });
  const [addError, setAddError] = useState('');

  const handleAddChild = (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.class || !addForm.email) {
      setAddError('Please fill in all fields, including email.');
      return;
    }
    setInvites([
      ...invites,
      { id: Date.now(), name: addForm.name, status: 'Pending', email: addForm.email },
    ]);
    setAddForm({ name: '', class: '', email: '' });
    setAddError('');
    setShowAddModal(false);
  };
  const handleRemoveChild = (id) => {
    setChildren(children.filter(c => c.id !== id));
  };
  return (
    <div style={{ minHeight: '100vh', background: '#f9f6f2', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2.5rem', background: 'none', borderBottom: '1.5px solid #e0e0e0' }}>
        {/* Tabs */}
        <nav style={{ display: 'flex', gap: 32 }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: 17, color: activeTab === tab.key ? '#c97a2b' : '#a67c52', borderBottom: activeTab === tab.key ? '2.5px solid #c97a2b' : '2.5px solid transparent', padding: '0.5rem 0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 0, transition: 'color 0.18s, border-bottom 0.18s' }}>{tab.icon} {tab.label}</button>
          ))}
        </nav>
        {/* Parent Dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowDropdown(d => !d)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 16, color: '#2b3a4b', cursor: 'pointer' }}>
            <FaUserCircle style={{ fontSize: 28, color: '#c97a2b' }} /> {parentName} <FaChevronDown style={{ fontSize: 16 }} />
          </button>
          {showDropdown && (
            <div style={{ position: 'absolute', right: 0, top: 38, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, minWidth: 160, zIndex: 10 }}>
              <button style={{ width: '100%', background: 'none', border: 'none', padding: '0.8rem 1.2rem', fontWeight: 600, color: '#2b3a4b', textAlign: 'left', cursor: 'pointer' }}>Profile</button>
              <button style={{ width: '100%', background: 'none', border: 'none', padding: '0.8rem 1.2rem', fontWeight: 600, color: '#c2185b', textAlign: 'left', cursor: 'pointer' }}>Logout</button>
            </div>
          )}
        </div>
      </header>
      {/* Main Body */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 2.5rem 2rem 2.5rem' }}>
        <div style={{ fontWeight: 800, fontSize: 22, color: '#2b3a4b', marginBottom: 24 }}>Welcome, {parentName}</div>
        {/* Tabs Content */}
        {activeTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {children.map(child => (
              <div key={child.id} style={{ borderBottom: '1px solid #e0e0e0', padding: '1.2rem 0', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#2b3a4b' }}>{child.name}</div>
                  <button onClick={() => handleRemoveChild(child.id)} style={{ background: 'none', border: 'none', color: '#c2185b', fontWeight: 600, fontSize: 15, cursor: 'pointer', marginLeft: 4 }}>Remove</button>
                </div>
                <div style={{ color: '#a67c52', fontSize: 15 }}>{child.class}</div>
                <div style={{ color: '#c97a2b', fontWeight: 600, fontSize: 15 }}>Time spent today: {child.timeSpent}</div>
                <div style={{ color: '#2bb6bb', fontWeight: 600, fontSize: 15 }}>Current subject: {child.currentSubject}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  {child.badges.map((badge, i) => (
                    <span key={i} style={{ background: '#f9e6c7', color: '#c97a2b', borderRadius: 8, padding: '0.2rem 0.7rem', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}><FaMedal style={{ color: '#c97a2b', fontSize: 15 }} /> {badge}</span>
                  ))}
                </div>
              </div>
            ))}
            {/* Add a child row */}
            <div style={{ borderBottom: '1px solid #e0e0e0', padding: '1.2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <button onClick={() => setShowAddModal(true)} style={{ background: 'none', border: 'none', color: '#c97a2b', fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><FaPlus style={{ fontSize: 22 }} /> Add a child</button>
              <div style={{ color: '#a67c52', fontSize: 15 }}>Invite or create a new child account</div>
            </div>
            {/* Add Child Modal */}
            {showAddModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #eee', padding: '2.5rem 2.5rem', minWidth: 320, maxWidth: 400, position: 'relative' }}>
                  <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#c97a2b', cursor: 'pointer' }}>×</button>
                  <h3 style={{ fontWeight: 800, fontSize: 20, color: '#2b3a4b', marginBottom: 18 }}>Add a Child</h3>
                  <form onSubmit={handleAddChild}>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontWeight: 600, color: '#c97a2b', display: 'block', marginBottom: 4 }}>Child Name</label>
                      <input type="text" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ fontWeight: 600, color: '#c97a2b', display: 'block', marginBottom: 4 }}>Class</label>
                      <input type="text" value={addForm.class} onChange={e => setAddForm(f => ({ ...f, class: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                      <label style={{ fontWeight: 600, color: '#c97a2b', display: 'block', marginBottom: 4 }}>Email</label>
                      <input type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} required />
                    </div>
                    {addError && <div style={{ color: '#c2185b', marginBottom: 10 }}>{addError}</div>}
                    <button type="submit" style={{ background: '#c97a2b', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem', cursor: 'pointer', width: '100%' }}>Add Child</button>
                  </form>
                </div>
              </div>
            )}
            {/* Pending Invitations */}
            {invites.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontWeight: 600, color: '#a67c52', marginBottom: 6 }}>Pending Invitations</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {invites.map(invite => (
                    <li key={invite.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, color: '#2b3a4b' }}>{invite.name}</span>
                      <span style={{ color: '#888', fontSize: 15 }}>{invite.email}</span>
                      <span style={{ color: '#ff9800', fontWeight: 600, fontSize: 15 }}>{invite.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {activeTab === 'assignments' && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#2b3a4b', marginBottom: 18 }}>Assignments by Child</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: 'none' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e0e0e0', color: '#a67c52', fontWeight: 700 }}>
                  <th style={{ textAlign: 'left', padding: '8px 0' }}>Child</th>
                  <th style={{ textAlign: 'left', padding: '8px 0' }}>Assignment</th>
                  <th style={{ textAlign: 'left', padding: '8px 0' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '8px 0' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockAssignments.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>{a.child}</td>
                    <td style={{ padding: '8px 0' }}>{a.title}</td>
                    <td style={{ padding: '8px 0' }}>{a.status}</td>
                    <td style={{ padding: '8px 0' }}>
                      {a.status !== 'Completed' ? <button style={{ background: '#2bb6bb', color: '#fff', fontWeight: 600, fontSize: 15, border: 'none', borderRadius: 8, padding: '0.4rem 1rem', cursor: 'pointer' }}>Upload/Review</button> : <span style={{ color: '#388e3c', fontWeight: 700 }}>Reviewed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'settings' && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#2b3a4b', marginBottom: 18 }}>Account Settings</div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, color: '#a67c52', marginBottom: 6 }}>Linked Children</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {mockChildren.map(child => (
                  <li key={child.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#2b3a4b' }}>{child.name}</span>
                    <button style={{ background: 'none', border: 'none', color: '#2bb6bb', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><FaUserEdit /> Edit</button>
                    <button style={{ background: 'none', border: 'none', color: '#c2185b', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><FaTrash /> Remove</button>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, color: '#a67c52', marginBottom: 6 }}>Pending Invitations</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {mockInvites.map(invite => (
                  <li key={invite.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#2b3a4b' }}>{invite.name}</span>
                    <span style={{ color: '#ff9800', fontWeight: 600, fontSize: 15 }}>{invite.status}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 600, color: '#a67c52', marginBottom: 6 }}>Notifications</div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#2b3a4b' }}><FaBell /> <input type="checkbox" style={{ accentColor: '#c97a2b' }} defaultChecked /> Assignment updates</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#2b3a4b' }}><FaBell /> <input type="checkbox" style={{ accentColor: '#c97a2b' }} /> New resources</label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 