import React, { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';

// Mock user data
const allUsers = [
  {
    id: 1,
    name: 'Amina Njoroge',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=amina',
    xp: 1200,
    badges: ['🥇', '📚'],
  },
  {
    id: 2,
    name: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=john',
    xp: 1500,
    badges: ['🥈', '🔥'],
  },
  {
    id: 3,
    name: 'Lila Kim',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=lila',
    xp: 900,
    badges: ['🥉', '⭐'],
  },
  {
    id: 4,
    name: 'Samuel Okoro',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=samuel',
    xp: 1100,
    badges: ['🏅', '🔥'],
  },
  {
    id: 5,
    name: 'Fatima Bello',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=fatima',
    xp: 1300,
    badges: ['🏅', '📚'],
  },
  {
    id: 6,
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=you',
    xp: 1400,
    badges: ['🥇', '🔥'],
    isCurrentUser: true,
  },
];

// Mock encouragement messages (kid-safe)
const encouragementMessages = [
  "Great job on your quiz! 🎉",
  "You're making amazing progress! ⭐",
  "Keep up the excellent work! 💪",
  "You're helping everyone learn! 🌟",
  "Fantastic effort today! 🏆",
  "You're a great study buddy! 🤝",
  "Your hard work is inspiring! ✨",
  "You're getting better every day! 📈",
  "Way to go, superstar! 🌟",
  "You're crushing it! 🔥"
];

// Mock group achievements
const groupAchievements = [
  {
    id: 1,
    name: "Team Player",
    description: "Helped 5 group members with their studies",
    icon: "🤝",
    earned: true,
    date: "2024-01-15"
  },
  {
    id: 2,
    name: "Study Buddy",
    description: "Completed 10 study sessions together",
    icon: "📚",
    earned: true,
    date: "2024-01-20"
  },
  {
    id: 3,
    name: "Encourager",
    description: "Sent 20 encouragements to group members",
    icon: "💚",
    earned: true,
    date: "2024-01-25"
  },
  {
    id: 4,
    name: "Math Masters",
    description: "Group completed all algebra lessons",
    icon: "🧮",
    earned: false,
    progress: 75
  },
  {
    id: 5,
    name: "Perfect Attendance",
    description: "All members active for 30 days",
    icon: "📅",
    earned: false,
    progress: 60
  }
];

// Mock study sessions
const studySessions = [
  {
    id: 1,
    date: "2024-01-28",
    duration: "45 minutes",
    topic: "Algebra Basics",
    participants: [1, 2, 6],
    xpGained: 150
  },
  {
    id: 2,
    date: "2024-01-26",
    duration: "30 minutes",
    topic: "Geometry Shapes",
    participants: [1, 6],
    xpGained: 100
  },
  {
    id: 3,
    date: "2024-01-24",
    duration: "60 minutes",
    topic: "Math Quiz Prep",
    participants: [1, 2, 6],
    xpGained: 200
  }
];

// Remove/comment out mockEncouragements
// const mockEncouragements = [
//   {
//     id: 1,
//     from: 1, // Amina
//     to: 6, // You
//     message: "Great job on your quiz! 🎉",
//     timestamp: "2 hours ago"
//   },
//   {
//     id: 2,
//     from: 6, // You
//     to: 2, // John
//     message: "You're making amazing progress! ⭐",
//     timestamp: "1 day ago"
//   },
//   {
//     id: 3,
//     from: 2, // John
//     to: 1, // Amina
//     message: "Keep up the excellent work! 💪",
//     timestamp: "2 days ago"
//   }
// ];

// Fallback avatar URL
const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?name=User&background=eee&color=888&size=128';

function CombinedFriends() {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [accepting, setAccepting] = useState(false);

  function getToken() {
    return localStorage.getItem('token');
  }
  // getUser not used in this component; removed to satisfy lint

  // Fetch friends and pending requests
  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        // Get accepted friends
        const res = await fetch('/api/friends', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setFriends(data);
        // Get pending requests (where current user is recipient)
        const pendingRes = await fetch('/api/friends/pending', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const pendingData = await pendingRes.json();
        setPendingRequests(pendingData);
      } catch (err) {
        setError('Failed to load friends');
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  // Search for users to add as friends
  useEffect(() => {
    if (!search) {
      setSuggestedUsers([]);
      return;
    }
    const fetchUsers = async () => {
      try {
        const token = getToken();
        const res = await fetch(`/api/users?search=${encodeURIComponent(search)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSuggestedUsers(data);
      } catch (err) {
        setSuggestedUsers([]);
      }
    };
    fetchUsers();
  }, [search]);

  // Send friend request
  const handleAddFriend = async (userId) => {
    setRequesting(true);
    try {
      const token = getToken();
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ friendId: userId })
      });
      if (res.status === 409) {
        const err = await res.json();
        alert(err.error || 'Friend request already sent or you are already friends.');
        return;
      }
      if (!res.ok) throw new Error('Failed to send friend request');
      setSearch('');
      setSuggestedUsers([]);
      // Optionally refetch pending requests
    } catch (err) {
      alert('Failed to send friend request');
    } finally {
      setRequesting(false);
    }
  };

  // Accept friend request
  const handleAcceptRequest = async (friendshipId) => {
    setAccepting(true);
    try {
      const token = getToken();
      const res = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ friendshipId })
      });
      if (!res.ok) throw new Error('Failed to accept friend request');
      // Optionally refetch friends and pending requests
    } catch (err) {
      alert('Failed to accept friend request');
    } finally {
      setAccepting(false);
    }
  };

  // Remove friend
  const handleRemoveFriend = async (friendshipId) => {
    if (!window.confirm('Remove this friend?')) return;
    try {
      const token = getToken();
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to remove friend');
      // Optionally refetch friends
    } catch (err) {
      alert('Failed to remove friend');
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Friends</h2>
      {loading ? (
        <div>Loading friends...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          {/* Friends List */}
          {friends.length === 0 ? (
            <div style={{ color: '#888', marginBottom: 18 }}>You haven’t added any friends yet!</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 18 }}>
              {friends.map(user => (
                <div key={user.id} style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 2px 8px #eee', padding: '1rem 1.2rem', minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <img src={user.picture || FALLBACK_AVATAR} alt={user.name} style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid #ff9800', marginBottom: 8 }} />
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#2d3a2e', marginBottom: 2 }}>{user.name}</div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{user.email}</div>
                  <button onClick={() => handleRemoveFriend(user.friendshipId)} style={{ background: '#ffe082', color: '#ff9800', border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 4 }}>Remove</button>
                </div>
              ))}
            </div>
          )}
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <>
              <div style={{ fontWeight: 600, color: '#888', margin: '18px 0 10px 0', fontSize: 15 }}>Pending Friend Requests</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginBottom: 18 }}>
                {pendingRequests.map(req => (
                  <div key={req.friendshipId} style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 2px 8px #eee', padding: '1rem 1.2rem', minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    <img src={req.picture || FALLBACK_AVATAR} alt={req.name} style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid #eee', marginBottom: 8 }} />
                    <div style={{ fontWeight: 600, fontSize: 16, color: '#2d3a2e', marginBottom: 2 }}>{req.name}</div>
                    <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{req.email}</div>
                    <button onClick={() => handleAcceptRequest(req.friendshipId)} disabled={accepting} style={{ background: '#a5d8a5', color: '#2d3a2e', border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 600, fontSize: 14, cursor: accepting ? 'not-allowed' : 'pointer', opacity: accepting ? 0.7 : 1, marginTop: 4 }}>Accept</button>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* Divider */}
          <div style={{ fontWeight: 600, color: '#888', margin: '18px 0 10px 0', fontSize: 15 }}>Add New Friends</div>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search for friends..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 240, padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #eee', marginBottom: 16, fontSize: 15 }}
          />
          {/* Suggested Users */}
          {search && suggestedUsers.length === 0 ? (
            <div style={{ color: '#888' }}>No users found.</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
              {suggestedUsers.map(user => (
                <div key={user.id} style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 2px 8px #eee', padding: '1rem 1.2rem', minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <img src={user.picture || FALLBACK_AVATAR} alt={user.name} style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid #eee', marginBottom: 8 }} />
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#2d3a2e', marginBottom: 2 }}>{user.name}</div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{user.email}</div>
                  <button onClick={() => handleAddFriend(user.id)} style={{ background: '#a5d8a5', color: '#2d3a2e', border: 'none', borderRadius: 8, padding: '0.3rem 1rem', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 4 }} disabled={requesting}>Add Friend</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function GroupDashboard({ group, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEncouragement, setSelectedEncouragement] = useState('');
  const [showEncouragementModal, setShowEncouragementModal] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const [encouragements, setEncouragements] = useState([]);
  const [, setEncouragementError] = useState(null);

  // Helper to get JWT token from localStorage
  function getToken() {
    return localStorage.getItem('token');
  }
  // Helper to get current user info
  function getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Determine if current user is a member (by avatar match for now)
  const userAvatar = getUser().picture;
  const isMember = Array.isArray(group.memberAvatars) && userAvatar && group.memberAvatars.includes(userAvatar);
  // Determine if current user is the owner using backend-provided role
  const isOwner = group.currentUserRole === 'owner';

  // Only show join button if not a member and not the owner
  const showJoinButton = !isMember && !isOwner;

  const handleJoinGroup = async () => {
    setJoining(true);
    setJoinError(null);
    try {
      const token = getToken();
      const res = await fetch(`/api/community/groups/${group.id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to join group');
      }
      onClose(); // Close modal after joining
    } catch (err) {
      setJoinError(err.message);
    } finally {
      setJoining(false);
    }
  };

  const handleInvite = async () => {
    setInviting(true);
    setInviteError(null);
    setInviteSuccess(null);
    try {
      const token = getToken();
      const res = await fetch(`/api/community/groups/${group.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to invite user');
      }
      setInviteSuccess('User invited successfully!');
      setInviteEmail('');
    } catch (err) {
      setInviteError(err.message);
    } finally {
      setInviting(false);
    }
  };

  // Fetch encouragements for this group
  useEffect(() => {
    const fetchEnc = async () => {
      try {
        const token = getToken();
        const res = await fetch(`/api/community/encouragements?groupId=${group.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setEncouragements(await res.json());
        } else {
          setEncouragementError('Failed to load encouragements');
        }
      } catch (err) {
        setEncouragementError('Failed to load encouragements');
      }
    };
    fetchEnc();
  }, [group.id]);

  // Defensive: Only filter if group.members is an array
  const groupMembers = Array.isArray(group.members)
    ? allUsers.filter(u => group.members.includes(u.id))
    : [];
  // removed unused currentUser

  const handleSendEncouragement = async (toUserId) => {
    if (selectedEncouragement) {
      try {
        const token = getToken();
        const res = await fetch('/api/community/encouragements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            groupId: group.id,
            recipientId: toUserId,
            message: selectedEncouragement,
          }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to send encouragement');
        }
        // Refresh encouragements list
        const updated = await fetch(`/api/community/encouragements?groupId=${group.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updated.ok) setEncouragements(await updated.json());
        setShowEncouragementModal(false);
        setSelectedEncouragement('');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Use real encouragements for stats
  const getEncouragementStats = () => {
    const stats = {};
    groupMembers.forEach(member => {
      const received = encouragements.filter(e => e.recipientId === member.id).length;
      const sent = encouragements.filter(e => e.senderId === member.id).length;
      stats[member.id] = { received, sent };
    });
    return stats;
  };

  const encouragementStats = getEncouragementStats();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '2rem',
        maxWidth: 900,
        width: '95%',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#2d3a2e' }}>
              {group.name}
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: 14 }}>
              {group.category} • {group.memberCount} members
            </p>
            {showJoinButton && (
              <button
                onClick={handleJoinGroup}
                disabled={joining}
                style={{
                  marginTop: 10,
                  background: '#a5d8a5',
                  color: '#2d3a2e',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.5rem 1.2rem',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: joining ? 'not-allowed' : 'pointer',
                  opacity: joining ? 0.7 : 1,
                }}
              >
                {joining ? 'Joining...' : 'Join Group'}
              </button>
            )}
            {joinError && <div style={{ color: 'red', fontSize: 14, marginTop: 6 }}>{joinError}</div>}
            {/* Invite by Email UI (owner only) */}
            {isOwner && (
              <div style={{ marginTop: 18, background: '#f8f9fa', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #eee', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>Invite by Email</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="Enter email..."
                    style={{ flex: 1, padding: '0.5rem 0.7rem', borderRadius: 6, border: '1px solid #ccc', fontSize: 14, minWidth: 0 }}
                    disabled={inviting}
                  />
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail || inviting}
                    style={{
                      background: '#a5d8a5',
                      color: '#2d3a2e',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0.5rem 1.1rem',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: inviting ? 'not-allowed' : 'pointer',
                      opacity: inviting ? 0.7 : 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {inviting ? 'Inviting...' : 'Invite'}
                  </button>
                </div>
                {(inviteError || inviteSuccess) && (
                  <div style={{ fontSize: 13, marginTop: 2, color: inviteError ? 'red' : 'green' }}>
                    {inviteError || inviteSuccess}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#888',
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['overview', 'encouragements', 'achievements', 'progress'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#ffe082' : '#f7f6f2',
                color: activeTab === tab ? '#ff9800' : '#2d3a2e',
                border: 'none',
                borderRadius: 8,
                padding: '0.5rem 1rem',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
            {/* Group Info */}
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: '#2d3a2e', marginBottom: 2 }}>{group.name}</div>
              <div style={{ fontSize: 15, color: '#444', marginBottom: 4, maxWidth: 320, whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {group.description || <span style={{ color: '#bbb' }}>No description</span>}
              </div>
              {/* Owner */}
              {Array.isArray(group.members) && group.members.length > 0 && (
                (() => {
                  const owner = group.members.find(m => m.role === 'owner');
                  return owner ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#666' }}>
                      <span role="img" aria-label="owner">👤</span>
                      <img src={owner.picture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=amina'} alt={owner.name} style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid #fff', background: '#eee' }} />
                      <span style={{ fontWeight: 500 }}>{owner.name}</span>
                    </div>
                  ) : null;
                })()
              )}
              {/* Member Count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#666' }}>
                <span role="img" aria-label="members">👥</span>
                <span>{group.memberCount} member{group.memberCount === 1 ? '' : 's'}</span>
              </div>
              {/* Created Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#666' }}>
                <span role="img" aria-label="created">🗓️</span>
                <span>Created: {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {/* Members List (right column) */}
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 12 }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Members</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Array.isArray(group.members) && group.members.length > 0 ? (
                  group.members.map(member => (
                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={member.picture || 'https://api.dicebear.com/7.x/adventurer/svg?seed=amina'}
                        alt={member.name}
                        style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #fff', background: '#eee' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 15 }}>{member.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{member.email}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#888', fontSize: 14 }}>No members yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'encouragements' && (
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr' }}>
            {/* Send Encouragement */}
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 12 }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Send Encouragement</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Choose a message:</label>
                <select
                  value={selectedEncouragement}
                  onChange={(e) => setSelectedEncouragement(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 14,
                  }}
                >
                  <option value="">Select an encouragement...</option>
                  {encouragementMessages.map((msg, idx) => (
                    <option key={idx} value={msg}>{msg}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Send to:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {groupMembers.filter(m => !m.isCurrentUser).map(member => (
                    <button
                      key={member.id}
                      onClick={() => {
                        setSelectedEncouragement(encouragementMessages[0]);
                        setShowEncouragementModal(true);
                      }}
                      disabled={!selectedEncouragement}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '0.8rem',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        background: selectedEncouragement ? '#e8f5e8' : '#f5f5f5',
                        color: selectedEncouragement ? '#2d3a2e' : '#888',
                        cursor: selectedEncouragement ? 'pointer' : 'not-allowed',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        style={{ width: 32, height: 32, borderRadius: '50%' }}
                      />
                      <span style={{ fontWeight: 500 }}>{member.name}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 12 }}>
                        💚 {encouragementStats[member.id]?.received || 0} received
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Encouragement Feed */}
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 12 }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Recent Encouragements</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {encouragements.map(encouragement => {
                  const fromUser = allUsers.find(u => u.id === encouragement.senderId);
                  const toUser = allUsers.find(u => u.id === encouragement.recipientId);
                  return (
                    <div key={encouragement.id} style={{ 
                      background: '#fff', 
                      padding: '1rem', 
                      borderRadius: 8,
                      border: '1px solid #eee'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <img
                          src={fromUser.avatar}
                          alt={fromUser.name}
                          style={{ width: 24, height: 24, borderRadius: '50%' }}
                        />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{fromUser.name}</span>
                        <span style={{ color: '#888', fontSize: 12 }}>→</span>
                        <img
                          src={toUser.avatar}
                          alt={toUser.name}
                          style={{ width: 24, height: 24, borderRadius: '50%' }}
                        />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{toUser.name}</span>
                      </div>
                      <div style={{ fontSize: 16, marginBottom: 4 }}>{encouragement.message}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{encouragement.timestamp}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 12 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Group Achievements</h3>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
              {groupAchievements.map(achievement => (
                <div key={achievement.id} style={{
                  background: achievement.earned ? '#e8f5e8' : '#fff',
                  padding: '1rem',
                  borderRadius: 8,
                  border: achievement.earned ? '2px solid #4caf50' : '1px solid #ddd',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{achievement.icon}</div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{achievement.name}</div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                    {achievement.description}
                  </div>
                  {achievement.earned ? (
                    <div style={{ fontSize: 11, color: '#4caf50', fontWeight: 600 }}>
                      ✓ Earned {achievement.date}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: '#888' }}>
                      {achievement.progress}% complete
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: 12 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>Study Sessions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {studySessions.map(session => (
                <div key={session.id} style={{
                  background: '#fff',
                  padding: '1rem',
                  borderRadius: 8,
                  border: '1px solid #eee',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>{session.topic}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{session.date}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 14, color: '#666' }}>
                      {session.duration} • {session.participants.length} participants
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#4caf50' }}>
                      +{session.xpGained} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement Modal */}
        {showEncouragementModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: '2rem',
              maxWidth: 400,
              width: '90%',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💚</div>
              <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>
                Send Encouragement
              </h3>
              <p style={{ margin: '0 0 24px 0', color: '#666' }}>
                Are you sure you want to send this encouragement?
              </p>
              <div style={{ 
                background: '#e8f5e8', 
                padding: '1rem', 
                borderRadius: 8, 
                marginBottom: 24,
                fontSize: 16,
                fontWeight: 500
              }}>
                {selectedEncouragement}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowEncouragementModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    background: '#fff',
                    color: '#666',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendEncouragement(1)} // Send to first friend
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: 8,
                    border: 'none',
                    background: '#a5d8a5',
                    color: '#2d3a2e',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Groups({ onGroupSelect }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Mathematics',
    maxMembers: 10,
    isPrivate: false,
    selectedFriends: []
  });

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  function getToken() {
    return localStorage.getItem('token');
  }
  function getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  const fetchGroups = () => {
    const token = getToken();
    const user = getUser();
    if (!token || !user || !user.id) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('/api/community/groups', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch groups');
        return res.json();
      })
      .then(data => {
        setGroups(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (token && user && user.id) {
      fetchGroups();
    } else {
      setGroups([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Debug print: log groups and current user
    const user = getUser();
    console.log('[DEBUG] Groups from backend:', groups);
    console.log('[DEBUG] Current user:', user);
  }, [groups]);

  // const categories = [
  //   'Mathematics', 'Science', 'History', 'Language Arts', 
  //   'Geography', 'Computer Science', 'Art & Music', 'Physical Education'
  // ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateGroup = async () => {
    setCreating(true);
    setCreateError(null);
    try {
      const token = getToken();
      const res = await fetch('/api/community/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          // category: formData.category, // Uncomment if backend supports
          // maxMembers: formData.maxMembers, // Uncomment if backend supports
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create group');
      }
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'Mathematics',
        maxMembers: 10,
        isPrivate: false,
        selectedFriends: []
      });
      fetchGroups();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // const toggleFriendSelection = (friendId) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     selectedFriends: prev.selectedFriends.includes(friendId)
  //       ? prev.selectedFriends.filter(id => id !== friendId)
  //       : [...prev.selectedFriends, friendId]
  //   }));
  // };

  // Get current user's friends for invitation
  // const currentUserFriends = allUsers.filter(u => 
  //   [1, 2].includes(u.id) && !u.isCurrentUser
  // );

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading groups...</div>;
  }
  if (error) {
    return <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Study Groups</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            background: '#a5d8a5',
            color: '#2d3a2e',
            border: 'none',
            borderRadius: 8,
            padding: '0.6rem 1.2rem',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>+</span>
          Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem',
          color: '#888',
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(8px)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.28)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No Groups Yet</div>
          <div style={{ fontSize: 14 }}>Create your first study group to learn together!</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {groups.map(group => (
            <div
              key={group.id}
              style={{
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.28)',
                boxShadow: '0 2px 8px #eee',
                padding: '1.5rem',
                position: 'relative',
              }}
            >
              {/* Group Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2d3a2e', margin: 0 }}>
                      {group.name}
                    </h3>
                  </div>
                  <div style={{ fontSize: 14, color: '#2d3a2e', lineHeight: 1.4 }}>
                    {group.description}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                Members: {group.memberCount ?? 0}
                {Array.isArray(group.memberAvatars) && group.memberAvatars.length > 0 && (
                  <span style={{ marginLeft: 8, display: 'inline-flex', gap: 2 }}>
                    {group.memberAvatars.slice(0, 5).map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        alt="Member avatar"
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '2px solid #fff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          marginLeft: idx === 0 ? 0 : -8,
                          background: '#eee',
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                Created: {new Date(group.createdAt).toLocaleDateString()}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => onGroupSelect(group)}
                  style={{
                    background: '#f0f0f0',
                    color: '#2d3a2e',
                    border: 'none',
                    borderRadius: 6,
                    padding: '0.4rem 0.8rem',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', minWidth: 340, maxWidth: 400, width: '100%', boxShadow: '0 2px 16px #eee', position: 'relative' }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2d3a2e', marginBottom: 18 }}>Create Group</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2d3a2e' }}>
                  Group Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter group name..."
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#2d3a2e' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="What will this group study together?"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    fontSize: 14,
                    resize: 'vertical',
                  }}
                />
              </div>
              {/* Add more fields as needed */}
              {createError && <div style={{ color: 'red', fontSize: 14 }}>{createError}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: 8,
                    border: '1px solid #ddd',
                    background: '#fff',
                    color: '#666',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!formData.name.trim() || creating}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    borderRadius: 8,
                    border: 'none',
                    background: formData.name.trim() ? '#a5d8a5' : '#ccc',
                    color: formData.name.trim() ? '#2d3a2e' : '#888',
                    fontWeight: 600,
                    cursor: formData.name.trim() ? 'pointer' : 'not-allowed',
                    opacity: creating ? 0.7 : 1,
                  }}
                >
                  {creating ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/leaderboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch leaderboard');
        setUsers(await res.json());
      } catch (err) {
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  function getLeaderboardScore(user) {
    return (user.xp * 0.5) + ((user.skillsMastered || 0) * 10) + ((user.streak || 0) * 5) + ((user.quizzesPassed || 0) * 8);
  }

  const rankedUsers = users
    .map(u => ({ ...u, leaderboardScore: getLeaderboardScore(u) }))
    .sort((a, b) => b.leaderboardScore - a.leaderboardScore);

  return (
    <div className="afl-leaderboard-container" style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Leaderboard</h2>
      <div style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
        <span style={{ fontWeight: 500 }}>Leaderboard Score</span> = XP × 0.5 + Skills × 10 + Streak × 5 + Quizzes × 8
      </div>
      {loading ? (
        <div>Loading leaderboard...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <div className="afl-leaderboard-list" style={{ maxWidth: 700, margin: '0 auto', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.28)', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)', padding: '1.5rem 1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rankedUsers.map((user, idx) => {
              let medal = null;
              if (idx === 0) medal = '🥇';
              else if (idx === 1) medal = '🥈';
              else if (idx === 2) medal = '🥉';
              return (
                <div
                  key={user.id}
                  className="afl-leaderboard-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: false,
                    borderRadius: 10,
                    padding: '0.7rem 0.5rem',
                    border: '1px solid #eee',
                    fontWeight: 500,
                    color: '#2d3a2e',
                    position: 'relative',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{medal || idx + 1}</span>
                  <img src={user.picture || FALLBACK_AVATAR} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #eee', background: '#fff', minWidth: 32 }} />
                  <span style={{ flex: 1, fontSize: 15 }}>{user.name}</span>
                  <span style={{ fontSize: 15, minWidth: 48, textAlign: 'right' }}>{Math.round(user.leaderboardScore)}</span>
                  <div className="afl-leaderboard-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minWidth: 0, fontSize: 13, color: '#888', justifyContent: 'flex-end', flex: 1 }}>
                    <span style={{ minWidth: 60, textAlign: 'right' }}>XP: {user.xp}</span>
                    <span style={{ minWidth: 48, textAlign: 'right' }}>Skills: {user.skillsMastered || 0}</span>
                    <span style={{ minWidth: 48, textAlign: 'right' }}>Streak: {user.streak || 0}</span>
                    <span style={{ minWidth: 60, textAlign: 'right' }}>Quizzes: {user.quizzesPassed || 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Community() {
  const [tab, setTab] = useState('leaderboard');
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  return (
    <div className="community-page-main" style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1rem' }}>
      <TopBar />
      <div className="afl-topbar-spacer" />
      <div style={{ display: 'flex', gap: 18, marginBottom: 24 }}>
        <button
          onClick={() => setTab('leaderboard')}
          style={{
            background: tab === 'leaderboard' ? '#ffe082' : '#f7f6f2',
            color: tab === 'leaderboard' ? '#ff9800' : '#2d3a2e',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.5rem',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: tab === 'leaderboard' ? '0 1px 4px #ffe082' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setTab('friends')}
          style={{
            background: tab === 'friends' ? '#ffe082' : '#f7f6f2',
            color: tab === 'friends' ? '#ff9800' : '#2d3a2e',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.5rem',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: tab === 'friends' ? '0 1px 4px #ffe082' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Friends
        </button>
        <button
          onClick={() => setTab('groups')}
          style={{
            background: tab === 'groups' ? '#ffe082' : '#f7f6f2',
            color: tab === 'groups' ? '#ff9800' : '#2d3a2e',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.5rem',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: tab === 'groups' ? '0 1px 4px #ffe082' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Groups
        </button>
      </div>
      {tab === 'leaderboard' ? <Leaderboard /> : tab === 'friends' ? <CombinedFriends /> : <Groups onGroupSelect={setSelectedGroup} />}
      {selectedGroup && <GroupDashboard group={selectedGroup} onClose={() => setSelectedGroup(null)} />}
    </div>
  );
} 