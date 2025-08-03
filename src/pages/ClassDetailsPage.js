import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const mockClasses = [
  { id: 1, name: 'Primary 5 - Math', grade: 'Primary 5', subject: 'Math', students: 28 },
  { id: 2, name: 'Primary 6 - English', grade: 'Primary 6', subject: 'English', students: 32 },
  { id: 3, name: 'Primary 7 - Science', grade: 'Primary 7', subject: 'Science', students: 25 },
];
const mockStudents = [
  { id: 1, name: 'Amina', progress: 85, attendance: 96, lastActivity: 'Today' },
  { id: 2, name: 'Samuel', progress: 52, attendance: 79, lastActivity: 'Yesterday' },
  { id: 3, name: 'Fatima', progress: 91, attendance: 99, lastActivity: 'Today' },
  { id: 4, name: 'Kwame', progress: 45, attendance: 70, lastActivity: '2 days ago' },
];
const progressOverTime = [
  { week: 'Week 1', progress: 60 },
  { week: 'Week 2', progress: 65 },
  { week: 'Week 3', progress: 70 },
  { week: 'Week 4', progress: 78 },
  { week: 'Week 5', progress: 80 },
  { week: 'Week 6', progress: 85 },
];
const attendancePie = [
  { name: 'Present', value: 88 },
  { name: 'Absent', value: 12 },
];
const pieColors = ['#2bb6bb', '#e0e0e0'];

export default function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const classId = Number(id);
  const initialClass = mockClasses.find(c => c.id === classId);
  const [cls, setCls] = useState(initialClass);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: cls?.name || '',
    grade: cls?.grade || '',
    subject: cls?.subject || '',
    students: cls?.students || '',
  });
  const [editError, setEditError] = useState('');
  if (!cls) return <div style={{ padding: 40 }}>Class not found.</div>;

  // Compute summary stats
  const totalStudents = mockStudents.length;
  const avgProgress = Math.round(mockStudents.reduce((sum, s) => sum + s.progress, 0) / totalStudents);
  const avgAttendance = Math.round(mockStudents.reduce((sum, s) => sum + s.attendance, 0) / totalStudents);
  const topPerformer = mockStudents.reduce((top, s) => (s.progress > top.progress ? s : top), mockStudents[0]);
  const studentsNeedingAttention = mockStudents.filter(s => s.progress < 60 || s.attendance < 80);

  return (
    <div style={{ maxWidth: 1100, margin: '2.5rem auto', background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #eee', padding: '2.5rem 2.5rem', minHeight: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
        <button onClick={() => navigate('/teacher-dashboard')} style={{ background: 'none', border: 'none', color: '#2bb6bb', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>&larr; Back</button>
        <button onClick={() => setShowEditModal(true)} style={{ background: '#2bb6bb', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '0.6rem 1.4rem', cursor: 'pointer' }}>Edit</button>
      </div>
      <h2 style={{ fontWeight: 900, fontSize: 32, color: '#2d3a2e', marginBottom: 4 }}>{cls.name}</h2>
      <div style={{ color: '#888', fontSize: 17, marginBottom: 4 }}>{cls.grade} &bull; {cls.subject}</div>
      <div style={{ color: '#c2185b', fontWeight: 700, fontSize: 18, marginBottom: 24 }}>Students: {cls.students}</div>
      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 18, minWidth: 120, textAlign: 'center' }}>Avg Progress<br />{avgProgress}%</div>
        <div style={{ fontWeight: 700, color: '#2bb6bb', fontSize: 18, minWidth: 120, textAlign: 'center' }}>Avg Attendance<br />{avgAttendance}%</div>
        <div style={{ fontWeight: 700, color: '#388e3c', fontSize: 18, minWidth: 120, textAlign: 'center' }}>Top Performer<br />{topPerformer.name}</div>
      </div>
      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 32 }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#2d3a2e', marginBottom: 10 }}>Progress Over Time</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={progressOverTime} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="week" fontSize={13} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} fontSize={13} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#2bb6bb" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: '#2d3a2e', marginBottom: 10 }}>Attendance</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={attendancePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={36} labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                {attendancePie.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Students Needing Attention */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#c2185b', marginBottom: 8 }}>Students Needing Attention</div>
        {studentsNeedingAttention.length === 0 ? (
          <div style={{ color: '#888', fontSize: 15 }}>All students are on track.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {studentsNeedingAttention.map(s => (
              <li key={s.id} style={{ fontSize: 16, color: '#c2185b', marginBottom: 4 }}>
                {s.name} (Progress: {s.progress}%, Attendance: {s.attendance}%)
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Student Table */}
      <div style={{ fontWeight: 700, fontSize: 18, color: '#2d3a2e', marginBottom: 8 }}>Student Roster</div>
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
          {mockStudents.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px 0', fontWeight: 600 }}>{s.name}</td>
              <td style={{ padding: '8px 0' }}>{s.progress}%</td>
              <td style={{ padding: '8px 0' }}>{s.attendance}%</td>
              <td style={{ padding: '8px 0' }}>{s.lastActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px #eee', padding: '2.5rem 2.5rem', minWidth: 340, maxWidth: 420, position: 'relative' }}>
            <button onClick={() => setShowEditModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#2bb6bb', cursor: 'pointer' }}>×</button>
            <h3 style={{ fontWeight: 800, fontSize: 22, color: '#2d3a2e', marginBottom: 18 }}>Edit Class</h3>
            <form onSubmit={e => {
              e.preventDefault();
              if (!editForm.name || !editForm.grade || !editForm.subject || !editForm.students) {
                setEditError('Please fill in all fields.');
                return;
              }
              if (isNaN(Number(editForm.students)) || Number(editForm.students) < 1) {
                setEditError('Number of students must be a positive number.');
                return;
              }
              setCls({ ...cls, ...editForm, students: Number(editForm.students) });
              setShowEditModal(false);
              setEditError('');
            }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: '#2bb6bb', display: 'block', marginBottom: 4 }}>Class Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: '#2bb6bb', display: 'block', marginBottom: 4 }}>Grade</label>
                <input type="text" value={editForm.grade} onChange={e => setEditForm(f => ({ ...f, grade: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, color: '#2bb6bb', display: 'block', marginBottom: 4 }}>Subject</label>
                <input type="text" value={editForm.subject} onChange={e => setEditForm(f => ({ ...f, subject: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600, color: '#2bb6bb', display: 'block', marginBottom: 4 }}>Number of Students</label>
                <input type="number" min="1" value={editForm.students} onChange={e => setEditForm(f => ({ ...f, students: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: 15 }} />
              </div>
              {editError && <div style={{ color: '#c2185b', marginBottom: 10 }}>{editError}</div>}
              <button type="submit" style={{ background: '#2bb6bb', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 10, padding: '0.7rem 1.5rem', cursor: 'pointer', width: '100%' }}>Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 