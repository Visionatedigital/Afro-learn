import React, { useEffect, useState } from 'react';
import { FaChalkboardTeacher, FaUserPlus, FaIdBadge, FaInfoCircle } from 'react-icons/fa';
import JoinClassModal from './JoinClass';
import TopBar from '../components/layout/TopBar';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?name=Teacher&background=eee&color=888&size=128';

function TeacherApprovalPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/class-requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch requests');
        setRequests(await res.json());
      } catch (err) {
        setError('Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [actionMsg]);

  const handleApprove = async (enrollmentId) => {
    setActionMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/class-requests/${enrollmentId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to approve');
      setActionMsg('Approved!');
    } catch (err) {
      setActionMsg('Failed to approve');
    }
  };
  const handleReject = async (enrollmentId) => {
    setActionMsg(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/class-requests/${enrollmentId}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to reject');
      setActionMsg('Rejected!');
    } catch (err) {
      setActionMsg('Failed to reject');
    }
  };

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (requests.length === 0) return <div style={{ color: '#888', margin: '1rem 0' }}>No pending class requests.</div>;

  return (
    <div style={{ background: '#fff9ec', borderRadius: 16, padding: '1.2rem', marginBottom: 28, boxShadow: '0 2px 8px #ffe082' }}>
      <div style={{ fontWeight: 700, fontSize: 18, color: '#2d3a2e', marginBottom: 10 }}>Pending Class Requests</div>
      {requests.map(req => (
        <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, background: '#fff', borderRadius: 10, padding: '0.7rem 1rem', boxShadow: '0 1px 4px #eee' }}>
          <img src={req.user.picture || FALLBACK_AVATAR} alt={req.user.name} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #ffe082', background: '#f7f6f2' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{req.user.name}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{req.user.email}</div>
            <div style={{ fontSize: 13, color: '#888' }}>Class: {req.class.name}</div>
          </div>
          <button onClick={() => handleApprove(req.id)} style={{ background: '#a5d8a5', color: '#2d3a2e', border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Approve</button>
          <button onClick={() => handleReject(req.id)} style={{ background: '#e57373', color: '#fff', border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Reject</button>
        </div>
      ))}
      {actionMsg && <div style={{ color: '#888', marginTop: 8 }}>{actionMsg}</div>}
    </div>
  );
}

export default function TeachersMentors() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [className, setClassName] = useState('');
  const [showTooltip, setShowTooltip] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinClassError, setJoinClassError] = useState(null);
  const [addTeacherError, setAddTeacherError] = useState(null);
  const [addTeacherSuccess, setAddTeacherSuccess] = useState(null);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.id ? `AFRO${user.id.toString().padStart(6, '0')}` : 'N/A';

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        // Get accepted teachers
        const res = await fetch('/api/my-teachers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch teachers');
        setTeachers(await res.json());
        // Get pending enrollments for this student
        const pendingRes = await fetch('/api/my-pending-teachers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (pendingRes.ok) setPendingTeachers(await pendingRes.json());
      } catch (err) {
        setError('Failed to load teachers');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Join class handler
  const handleJoinClass = async (classCode) => {
    setJoinClassError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/join-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ classCode })
      });
      if (!res.ok) {
        const err = await res.json();
        setJoinClassError(err.error || 'Failed to join class');
        return false;
      }
      setShowJoinModal(false);
      // Refetch teachers
      setTimeout(() => window.location.reload(), 500);
      return true;
    } catch (err) {
      setJoinClassError('Failed to join class');
      return false;
    }
  };

  // Add teacher handler
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setAddTeacherError(null);
    setAddTeacherSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/add-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ teacherEmail, className })
      });
      if (!res.ok) {
        const err = await res.json();
        setAddTeacherError(err.error || 'Failed to add teacher');
        return;
      }
      setAddTeacherSuccess('Teacher request sent! Pending approval.');
      setTeacherEmail('');
      setClassName('');
      // Refetch teachers
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      setAddTeacherError('Failed to add teacher');
    }
  };

  const isTeacher = user && user.role === 'teacher';
  return (
    <div className="teachers-mentors-page-main" style={{ maxWidth: 600, margin: '0 auto', padding: '0.2rem 1rem 2rem 1rem', fontFamily: 'Lexend, Noto Sans, Arial, sans-serif' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      {isTeacher && <TeacherApprovalPanel />}
      <JoinClassModal open={showJoinModal} onClose={() => setShowJoinModal(false)} onJoin={handleJoinClass} error={joinClassError} />
      {/* Student ID */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, background: '#fff9ec', borderRadius: 16, padding: '1rem 1.2rem', boxShadow: '0 1px 4px #ffe082' }}>
        <FaIdBadge style={{ color: '#ff9800', fontSize: 28 }} />
        <span style={{ fontWeight: 700, fontSize: 18, color: '#2d3a2e' }}>Student ID:</span>
        <span style={{ fontWeight: 600, fontSize: 18, color: '#00796b', letterSpacing: 1 }}>{studentId}</span>
        <span style={{ marginLeft: 'auto', cursor: 'pointer' }}
          onMouseEnter={() => setShowTooltip('studentId')}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <FaInfoCircle style={{ color: '#888', fontSize: 18 }} />
          {showTooltip === 'studentId' && (
            <span style={{ position: 'absolute', background: '#222', color: '#fff', padding: '0.5rem 1rem', borderRadius: 8, fontSize: 14, left: 0, top: 40, zIndex: 10 }}>Share this ID with your teacher to join their class!</span>
          )}
        </span>
      </div>

      {/* Teachers/Mentors List */}
      <div style={{ background: '#f7f6f2', borderRadius: 16, padding: '1.2rem', marginBottom: 28, boxShadow: '0 2px 8px #eee' }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#2d3a2e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <FaChalkboardTeacher style={{ color: '#2bb6bb', fontSize: 22 }} />
          My Teachers & Mentors
        </div>
        {loading ? (
          <div>Loading teachers...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : teachers.length === 0 && pendingTeachers.length === 0 ? (
          <div style={{ color: '#888', fontSize: 16 }}>You have no teachers or mentors yet. Add one below!</div>
        ) : (
          <>
            {teachers.length > 0 && (
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 12 }}>
                {teachers.map(t => (
                  <div key={t.id} style={{ background: '#fff', borderRadius: 12, padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px #eee', minWidth: 180 }}>
                    <img src={t.picture || FALLBACK_AVATAR} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #2bb6bb', background: '#f7f6f2' }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16, color: '#2d3a2e' }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>{t.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {pendingTeachers.length > 0 && (
              <div style={{ color: '#888', fontSize: 15, marginBottom: 8 }}>
                <b>Pending approval:</b>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 6 }}>
                  {pendingTeachers.map(t => (
                    <div key={t.id} style={{ background: '#fffbe6', borderRadius: 12, padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px #ffe082', minWidth: 180 }}>
                      <img src={t.picture || FALLBACK_AVATAR} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #ffe082', background: '#f7f6f2' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16, color: '#2d3a2e' }}>{t.name}</div>
                        <div style={{ fontSize: 13, color: '#888' }}>{t.email}</div>
                      </div>
                      <span style={{ color: '#ff9800', fontWeight: 600, marginLeft: 8 }}>Pending</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Join a Class Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <button
          onClick={() => setShowJoinModal(true)}
          style={{
            background: '#2bb6bb', // solid playful teal
            color: '#fff',
            fontWeight: 700,
            fontSize: 22,
            border: 'none',
            borderRadius: 18,
            padding: '1rem 2.5rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #eee',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            transition: 'background 0.18s',
          }}
        >
          <FaUserPlus style={{ fontSize: 28 }} /> Join a Class
        </button>
      </div>

      {/* Add a Teacher */}
      <div style={{ background: '#fce4ec', borderRadius: 16, padding: '1.2rem', marginBottom: 24, boxShadow: '0 2px 8px #f8bbd0' }}>
        <div style={{ fontWeight: 700, fontSize: 18, color: '#c2185b', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaChalkboardTeacher style={{ color: '#c2185b', fontSize: 20 }} />
          Add a Teacher
        </div>
        <form style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} onSubmit={handleAddTeacher}>
          <input
            type="email"
            value={teacherEmail}
            onChange={e => setTeacherEmail(e.target.value)}
            placeholder="Teacher's email (yourteacher@example.com)"
            style={{ flex: 1, minWidth: 0, fontSize: 18, borderRadius: 12, border: '2px solid #c2185b', padding: '0.7rem 1rem', outline: 'none', background: '#fff', color: '#2d3a2e', marginBottom: 8 }}
            required
            onFocus={() => setShowTooltip('teacherEmail')}
            onBlur={() => setShowTooltip(null)}
          />
          <input
            type="text"
            value={className}
            onChange={e => setClassName(e.target.value)}
            placeholder="Class name (e.g. Math 101)"
            style={{ flex: 1, minWidth: 0, fontSize: 18, borderRadius: 12, border: '2px solid #c2185b', padding: '0.7rem 1rem', outline: 'none', background: '#fff', color: '#2d3a2e', marginBottom: 8 }}
            required
          />
          <button type="submit" style={{ background: '#c2185b', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 12, padding: '0.7rem 2rem', cursor: 'pointer', marginBottom: 8 }}>Add</button>
        </form>
        {addTeacherError && <div style={{ color: 'red', marginTop: 6 }}>{addTeacherError}</div>}
        {addTeacherSuccess && <div style={{ color: 'green', marginTop: 6 }}>{addTeacherSuccess}</div>}
      </div>
    </div>
  );
} 