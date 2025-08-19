const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const multer = require('multer');
const fs = require('fs');

// Set up multer storage for avatars
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../avatars');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user?.id || 'guest'}-${Date.now()}${ext}`);
  }
});
const uploadAvatar = multer({ storage: avatarStorage });

const app = express();
const PORT = process.env.REACT_APP_API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/avatars', express.static(require('path').join(__dirname, '../../avatars')));

// AI routes
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// Video routes
const videoRoutes = require('./routes/videoRoutes');
app.use('/api/video', videoRoutes);

// JWT auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, role, country, grade, birthMonth, birthYear, picture, googleId } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
      email,
        password: hashed,
      name,
        role: role || 'learner',
      country,
      grade,
      birthMonth,
      birthYear,
        picture,
        googleId
      }
    });
    console.log(`[User Created] id=${user.id} email=${user.email} name=${user.name} role=${user.role}`);
    res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// Get current user endpoint
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, name: true, role: true, country: true, grade: true, birthMonth: true, birthYear: true, picture: true, googleId: true, createdAt: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

// --- Update user profile ---
app.patch('/api/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, picture } = req.body;
    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (picture) data.picture = picture;
    if (Object.keys(data).length === 0) return res.status(400).json({ error: 'No fields to update' });
    const updated = await prisma.user.update({ where: { id: userId }, data });
    res.json({ success: true, user: { id: updated.id, name: updated.name, email: updated.email, picture: updated.picture } });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

// --- Change password ---
app.post('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password required' });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) return res.status(400).json({ error: 'No password set for this account' });
    const valid = await require('bcryptjs').compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });
    const hashed = await require('bcryptjs').hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password', details: err.message });
  }
});

// Google authentication endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { user: googleUser } = req.body;
    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ error: 'Invalid Google user data' });
    }
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
        email: googleUser.email,
        name: `${googleUser.firstName} ${googleUser.lastName}`,
          role: 'learner',
        picture: googleUser.picture,
          googleId: googleUser.sub,
        }
      });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      message: 'Google authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        country: user.country,
        grade: user.grade,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- Learning Flow Endpoints ---
// Get all subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects', details: err.message });
  }
});

// Get all grades
app.get('/api/grades', async (req, res) => {
  try {
    const grades = await prisma.grade.findMany({ orderBy: { name: 'asc' } });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grades', details: err.message });
  }
});

// Get units for a subject and grade
app.get('/api/units', async (req, res) => {
  const { subjectId, gradeId } = req.query;
  if (!subjectId || !gradeId) {
    return res.status(400).json({ error: 'subjectId and gradeId are required' });
  }
  try {
    const units = await prisma.unit.findMany({
      where: { subjectId: Number(subjectId), gradeId: Number(gradeId) },
      orderBy: { name: 'asc' },
    });
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch units', details: err.message });
  }
});

// Get lessons for a unit
app.get('/api/lessons', async (req, res) => {
  const { unitId } = req.query;
  if (!unitId) {
    return res.status(400).json({ error: 'unitId is required' });
  }
  try {
    const lessons = await prisma.lesson.findMany({
      where: { unitId: Number(unitId) },
      orderBy: { name: 'asc' },
    });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lessons', details: err.message });
  }
});

// Get lesson details
app.get('/api/lesson/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await prisma.lesson.findUnique({ where: { id: Number(id) } });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lesson', details: err.message });
  }
});

// Get unit by ID
app.get('/api/unit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await prisma.unit.findUnique({ where: { id: Number(id) } });
    if (!unit) return res.status(404).json({ error: 'Unit not found' });
    res.json(unit);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unit', details: err.message });
  }
});

// --- Progress Endpoint ---
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    // Get all progress records for the user
    const progresses = await prisma.progress.findMany({
      where: { userId: req.user.id },
      include: {
        subject: true,
        units: {
          include: {
            unit: true,
            videos: { include: { lesson: true } },
            quizzes: true,
            practices: true,
          },
        },
      },
    });

    // Map to frontend structure
    const subjects = progresses.map(progress => ({
      key: progress.subject.name.toLowerCase().replace(/\s/g, ''),
      label: progress.subject.name,
      icon: progress.subject.icon || 'FaBook',
      level: progress.level,
      skillsMastered: progress.skillsMastered,
      totalSkills: progress.totalSkills,
      percent: progress.percent,
      units: progress.units.map((pu, idx) => ({
        title: pu.unit.name,
        videos: pu.videos.map(v => ({
          title: v.lesson.name,
          completed: v.completed,
        })),
        quizzes: pu.quizzes.map(q => ({
          // Add quiz fields as needed
        })),
        practices: pu.practices.map(p => ({
          // Add practice fields as needed
        })),
      })),
    }));

    res.json({ subjects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress', details: err.message });
  }
});

// --- Community: List all groups ---
app.get('/api/community/groups', authenticateToken, async (req, res) => {
  try {
    console.log('[DEBUG] req.user:', req.user);
    if (!req.user || !req.user.id) {
      console.log('[DEBUG] No user in request, returning empty array');
      return res.json([]);
    }
    const userId = req.user.id;
    // Only return groups where the user is a member (including owner)
    const memberships = await prisma.communityMembership.findMany({
      where: { userId },
      select: { groupId: true }
    });
    const groupIds = memberships.map(m => m.groupId);
    console.log(`[CommunityGroups] userId=${userId} memberships=${JSON.stringify(groupIds)}`);
    if (groupIds.length === 0) return res.json([]);
    const groups = await prisma.communityGroup.findMany({
      where: { id: { in: groupIds } },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: { select: { members: true } },
        members: {
          select: {
            user: { select: { id: true, name: true, email: true, picture: true } },
            role: true,
            userId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`[CommunityGroups] userId=${userId} returning groups=${JSON.stringify(groups.map(g => g.id))}`);
    // Map to include memberCount, memberAvatars, members, and currentUserRole at top level
    const groupsWithCount = groups.map(g => {
      const members = g.members.map(m => ({
        id: m.user.id,
        name: m.user.name,
        email: m.user.email,
        picture: m.user.picture,
        role: m.role,
      })).filter(Boolean);
      const memberAvatars = g.members.slice(0, 5).map(m => m.user?.picture).filter(Boolean);
      let currentUserRole = null;
      if (userId) {
        const membership = g.members.find(m => m.userId === userId);
        if (membership) currentUserRole = membership.role;
      }
      return {
        ...g,
        memberCount: g._count.members,
        memberAvatars,
        members,
        currentUserRole,
        _count: undefined,
      };
    });
    res.json(groupsWithCount);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch community groups', details: err.message });
  }
});

// --- Community: Create a new group ---
app.post('/api/community/groups', authenticateToken, async (req, res) => {
  try {
    const { name, description, category, maxMembers } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }
    const group = await prisma.communityGroup.create({
      data: {
        name,
        description,
        // Optionally store category and maxMembers if your schema supports it
      },
    });
    // Add creator as owner
    await prisma.communityMembership.create({
      data: {
        userId: req.user.id,
        groupId: group.id,
        role: 'owner',
      },
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group', details: err.message });
  }
});

// --- Community: Join a group ---
app.post('/api/community/groups/:id/join', authenticateToken, async (req, res) => {
  try {
    const groupId = Number(req.params.id);
    if (!groupId) return res.status(400).json({ error: 'Invalid group ID' });
    // Check if already a member
    const existing = await prisma.communityMembership.findUnique({
      where: { userId_groupId: { userId: req.user.id, groupId } },
    });
    if (existing) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }
    await prisma.communityMembership.create({
      data: {
        userId: req.user.id,
        groupId,
        role: 'member',
      },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join group', details: err.message });
  }
});

// --- Community: Invite a user to a group ---
app.post('/api/community/groups/:id/invite', authenticateToken, async (req, res) => {
  try {
    const groupId = Number(req.params.id);
    const { email, userId } = req.body;
    if (!groupId || (!email && !userId)) {
      return res.status(400).json({ error: 'Group ID and email or userId required' });
    }
    // Check if inviter is the owner
    const inviterMembership = await prisma.communityMembership.findUnique({
      where: { userId_groupId: { userId: req.user.id, groupId } },
    });
    if (!inviterMembership || inviterMembership.role !== 'owner') {
      return res.status(403).json({ error: 'Only the group owner can invite others' });
    }
    // Find user to invite
    let invitee;
    if (userId) {
      invitee = await prisma.user.findUnique({ where: { id: userId } });
    } else if (email) {
      invitee = await prisma.user.findUnique({ where: { email } });
    }
    if (!invitee) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check if already a member
    const existing = await prisma.communityMembership.findUnique({
      where: { userId_groupId: { userId: invitee.id, groupId } },
    });
    if (existing) {
      return res.status(400).json({ error: 'User is already a member of this group' });
    }
    await prisma.communityMembership.create({
      data: {
        userId: invitee.id,
        groupId,
        role: 'member',
      },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to invite user', details: err.message });
  }
});

// --- Community: List encouragements ---
app.get('/api/community/encouragements', authenticateToken, async (req, res) => {
  try {
    const { groupId, recipientId, senderId } = req.query;
    const where = {};
    if (groupId) where.groupId = Number(groupId);
    if (recipientId) where.recipientId = Number(recipientId);
    if (senderId) where.senderId = Number(senderId);
    const encouragements = await prisma.communityEncouragement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, email: true, picture: true } },
        recipient: { select: { id: true, name: true, email: true, picture: true } },
        group: { select: { id: true, name: true } },
      },
    });
    res.json(encouragements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch encouragements', details: err.message });
  }
});

// --- Community: Create encouragement ---
app.post('/api/community/encouragements', authenticateToken, async (req, res) => {
  try {
    const { groupId, recipientId, message, type } = req.body;
    if (!groupId || !recipientId || !message) {
      return res.status(400).json({ error: 'groupId, recipientId, and message are required' });
    }
    const encouragement = await prisma.communityEncouragement.create({
      data: {
        groupId: Number(groupId),
        senderId: req.user.id,
        recipientId: Number(recipientId),
        message,
        type: type || 'general',
      },
      include: {
        sender: { select: { id: true, name: true, email: true, picture: true } },
        recipient: { select: { id: true, name: true, email: true, picture: true } },
        group: { select: { id: true, name: true } },
      },
    });
    res.status(201).json(encouragement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create encouragement', details: err.message });
  }
});

// --- Community: Get single encouragement ---
app.get('/api/community/encouragements/:id', authenticateToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid encouragement ID' });
    const encouragement = await prisma.communityEncouragement.findUnique({
      where: { id },
      include: {
        sender: { select: { id: true, name: true, email: true, picture: true } },
        recipient: { select: { id: true, name: true, email: true, picture: true } },
        group: { select: { id: true, name: true } },
      },
    });
    if (!encouragement) return res.status(404).json({ error: 'Encouragement not found' });
    res.json(encouragement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch encouragement', details: err.message });
  }
});

// --- Friends: List all accepted friends ---
app.get('/api/friends', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all accepted friendships where user is either sender or recipient
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId, status: 'accepted' },
          { friendId: userId, status: 'accepted' }
        ]
      },
      include: {
        user: { select: { id: true, name: true, email: true, picture: true } },
        friend: { select: { id: true, name: true, email: true, picture: true } }
      }
    });
    // Map to the actual friend (not self)
    const friends = friendships.map(f => {
      if (f.userId === userId) {
        return { ...f.friend, friendshipId: f.id, status: f.status };
      } else {
        return { ...f.user, friendshipId: f.id, status: f.status };
      }
    });
    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch friends', details: err.message });
  }
});

// --- Friends: Send a friend request ---
app.post('/api/friends/request', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    if (!friendId || friendId === userId) {
      return res.status(400).json({ error: 'Invalid friendId' });
    }
    // Check if already friends or pending
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId }
        ]
      }
    });
    if (existing) {
      return res.status(409).json({ error: 'Friend request already exists or you are already friends' });
    }
    const request = await prisma.friendship.create({
      data: {
        userId,
        friendId,
        status: 'pending'
      }
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send friend request', details: err.message });
  }
});

// --- Friends: Accept a friend request ---
app.post('/api/friends/accept', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendshipId } = req.body;
    const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } });
    if (!friendship || friendship.friendId !== userId || friendship.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid or unauthorized friend request' });
    }
    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'accepted' }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept friend request', details: err.message });
  }
});

// --- Friends: Remove a friend ---
app.delete('/api/friends/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const friendshipId = Number(req.params.id);
    const friendship = await prisma.friendship.findUnique({ where: { id: friendshipId } });
    if (!friendship || (friendship.userId !== userId && friendship.friendId !== userId)) {
      return res.status(403).json({ error: 'Not authorized to remove this friendship' });
    }
    await prisma.friendship.delete({ where: { id: friendshipId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove friend', details: err.message });
  }
});

// --- Friends: List all pending friend requests (where current user is recipient) ---
app.get('/api/friends/pending', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await prisma.friendship.findMany({
      where: { friendId: userId, status: 'pending' },
      include: {
        user: { select: { id: true, name: true, email: true, picture: true } }
      }
    });
    // Map to user info and friendshipId
    const pending = requests.map(r => ({
      ...r.user,
      friendshipId: r.id
    }));
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending requests', details: err.message });
  }
});

// --- Users: List users, optionally filtered by search query ---
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;
    const where = {
      id: { not: userId }
    };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, email: true, picture: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// --- Leaderboard: List users with leaderboard stats ---
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        progress: {
          select: {
            skillsMastered: true,
            totalSkills: true,
            percent: true,
            units: {
              select: {
                quizzes: {
                  select: { passed: true }
                }
              }
            }
          }
        }
      }
    });
    // Compute leaderboard stats
    const leaderboard = users.map(u => {
      // XP: sum of percent for all progress (or use another metric)
      const xp = u.progress.reduce((sum, p) => sum + (p.percent || 0), 0);
      // Skills mastered: sum
      const skillsMastered = u.progress.reduce((sum, p) => sum + (p.skillsMastered || 0), 0);
      // Quizzes passed: count of passed quizzes
      let quizzesPassed = 0;
      u.progress.forEach(p => {
        p.units.forEach(unit => {
          unit.quizzes.forEach(q => { if (q.passed) quizzesPassed++; });
        });
      });
      // Streak: dummy value for now (could be calculated from activity)
      const streak = 0;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        picture: u.picture,
        xp,
        skillsMastered,
        streak,
        quizzesPassed
      };
    });
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: err.message });
  }
});

// --- XP Calculation Helper ---
async function calculateUserXP(userId) {
  // XP values (customize as needed)
  const XP_LESSON = 10;
  const XP_UNIT_COMPLETE = 50;
  const XP_QUIZ_ATTEMPT = 5;
  const XP_QUIZ_PASS = 20;
  const XP_QUIZ_PERFECT = 10;
  const XP_PRACTICE = 10;
  const XP_STREAK_DAY = 2;
  const XP_STREAK_BONUS = 10;
  const XP_BADGE = 20;
  const XP_LIVE_CLASS = 10;

  // Fetch user progress
  const progresses = await prisma.progress.findMany({
    where: { userId },
    include: {
      units: {
        include: {
          videos: true,
          quizzes: true,
          practices: true,
        },
      },
    },
  });

  // Lessons completed
  let lessonsCompleted = 0;
  let unitsCompleted = 0;
  let quizAttempts = 0;
  let quizzesPassed = 0;
  let quizzesPerfect = 0;
  let practicesCompleted = 0;

  progresses.forEach(progress => {
    progress.units.forEach(unit => {
      // Lessons (videos)
      lessonsCompleted += unit.videos.filter(v => v.completed).length;
      // Practices
      practicesCompleted += unit.practices.filter(p => p.completed).length;
      // Quizzes
      unit.quizzes.forEach(q => {
        quizAttempts++;
        if (q.passed) quizzesPassed++;
        // You can add a 'score' field to check for perfect
        if (q.passed && q.score === q.total) quizzesPerfect++;
      });
      // Units completed (all lessons/quizzes/practices done)
      if (
        unit.videos.every(v => v.completed) &&
        unit.quizzes.every(q => q.passed) &&
        unit.practices.every(p => p.completed)
      ) {
        unitsCompleted++;
      }
    });
  });

  // Streaks, badges, live classes: placeholder logic
  const streakDays = 0; // TODO: Calculate from login/activity logs
  const streakBonuses = 0; // TODO: Calculate from streaks
  const badges = 0; // TODO: Count earned badges
  const liveClasses = 0; // TODO: Count attended classes

  // Calculate total XP
  const totalXP =
    (lessonsCompleted * XP_LESSON) +
    (unitsCompleted * XP_UNIT_COMPLETE) +
    (quizAttempts * XP_QUIZ_ATTEMPT) +
    (quizzesPassed * XP_QUIZ_PASS) +
    (quizzesPerfect * XP_QUIZ_PERFECT) +
    (practicesCompleted * XP_PRACTICE) +
    (streakDays * XP_STREAK_DAY) +
    (streakBonuses * XP_STREAK_BONUS) +
    (badges * XP_BADGE) +
    (liveClasses * XP_LIVE_CLASS);

  return {
    totalXP,
    lessonsCompleted,
    unitsCompleted,
    quizAttempts,
    quizzesPassed,
    quizzesPerfect,
    practicesCompleted,
    streakDays,
    streakBonuses,
    badges,
    liveClasses
  };
}

// --- XP API Demo ---
app.get('/api/xp/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ error: 'Invalid userId' });
    const xpStats = await calculateUserXP(userId);
    res.json(xpStats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate XP', details: err.message });
  }
});

// --- Upload avatar endpoint ---
app.post('/api/upload-avatar', authenticateToken, uploadAvatar.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  // For demo: serve from /avatars/ (in production, use S3/Cloudinary)
  const url = `/avatars/${req.file.filename}`;
  res.json({ url });
});

// --- Teachers & Mentors: List all teachers for the current student ---
app.get('/api/my-teachers', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all classes the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        class: {
          include: {
            teacher: { select: { id: true, name: true, email: true, picture: true } }
          }
        }
      }
    });
    // Extract unique teachers
    const teachers = [];
    const seen = new Set();
    enrollments.forEach(e => {
      const t = e.class.teacher;
      if (t && !seen.has(t.id)) {
        teachers.push(t);
        seen.add(t.id);
      }
    });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teachers', details: err.message });
  }
});

// --- Teachers: List all classes taught by the current teacher ---
app.get('/api/teacher/classes', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes = await prisma.class.findMany({
      where: { teacherId },
      select: {
        id: true,
        name: true,
        subject: true,
        grade: true,
        createdAt: true
      }
    });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes', details: err.message });
  }
});

// --- Join a class by class code (or name for demo) ---
app.post('/api/join-class', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { classCode } = req.body;
    if (!classCode) return res.status(400).json({ error: 'Class code required' });
    // For demo, classCode is class name
    const classObj = await prisma.class.findFirst({ where: { name: classCode } });
    if (!classObj) return res.status(404).json({ error: 'Class not found' });
    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({ where: { userId_classId: { userId, classId: classObj.id } } });
    if (existing) return res.status(409).json({ error: 'Already enrolled in this class' });
    await prisma.enrollment.create({ data: { userId, classId: classObj.id, status: 'pending' } });
    res.json({ success: true, pending: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join class', details: err.message });
  }
});

// --- Add a teacher by email (creates a class if needed, enrolls student) ---
app.post('/api/add-teacher', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { teacherEmail, className } = req.body;
    if (!teacherEmail || !className) return res.status(400).json({ error: 'Teacher email and class name required' });
    // Find teacher
    const teacher = await prisma.user.findUnique({ where: { email: teacherEmail } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    // Find or create class
    let classObj = await prisma.class.findFirst({ where: { name: className, teacherId: teacher.id } });
    if (!classObj) {
      classObj = await prisma.class.create({ data: { name: className, teacherId: teacher.id, subject: 'General', grade: 'N/A' } });
    }
    // Enroll student as pending
    const existing = await prisma.enrollment.findUnique({ where: { userId_classId: { userId, classId: classObj.id } } });
    if (!existing) {
      await prisma.enrollment.create({ data: { userId, classId: classObj.id, status: 'pending' } });
    }
    res.json({ success: true, pending: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add teacher', details: err.message });
  }
});

// --- Teachers: View pending enrollment requests for their classes ---
app.get('/api/class-requests', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    // Find classes taught by this teacher
    const classes = await prisma.class.findMany({ where: { teacherId } });
    const classIds = classes.map(c => c.id);
    // Find pending enrollments
    const requests = await prisma.enrollment.findMany({
      where: { classId: { in: classIds }, status: 'pending' },
      include: {
        user: { select: { id: true, name: true, email: true, picture: true } },
        class: { select: { id: true, name: true } }
      }
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch class requests', details: err.message });
  }
});

// --- Teachers: Approve or reject enrollment requests ---
app.post('/api/class-requests/:enrollmentId/approve', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const enrollmentId = Number(req.params.enrollmentId);
    // Find the enrollment and class
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { class: true }
    });
    if (!enrollment || enrollment.class.teacherId !== teacherId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await prisma.enrollment.update({ where: { id: enrollmentId }, data: { status: 'accepted' } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve request', details: err.message });
  }
});

app.post('/api/class-requests/:enrollmentId/reject', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const enrollmentId = Number(req.params.enrollmentId);
    // Find the enrollment and class
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: { class: true }
    });
    if (!enrollment || enrollment.class.teacherId !== teacherId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await prisma.enrollment.delete({ where: { id: enrollmentId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject request', details: err.message });
  }
});

// --- Notifications: Create a notification ---
app.post('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { userId, type, message, link } = req.body;
    if (!userId || !type || !message) return res.status(400).json({ error: 'userId, type, and message required' });
    const notification = await prisma.notification.create({
      data: { userId, type, message, link }
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification', details: err.message });
  }
});

// --- Notifications: List notifications for current user ---
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
  }
});

// --- Notifications: Mark as read ---
app.post('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) return res.status(404).json({ error: 'Not found' });
    await prisma.notification.update({ where: { id }, data: { read: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read', details: err.message });
  }
});

// --- Notifications: Mark as unread ---
app.post('/api/notifications/:id/unread', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) return res.status(404).json({ error: 'Not found' });
    await prisma.notification.update({ where: { id }, data: { read: false } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as unread', details: err.message });
  }
});

// --- Search Courses/Units/Lessons Endpoint ---
app.get('/api/search/courses', async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Query required (min 2 chars)' });
  }
  try {
    // Search Subjects
    const subjects = await prisma.subject.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: { id: true, name: true, icon: true, createdAt: true },
      take: 10,
    });
    // Search Units
    const units = await prisma.unit.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      select: { id: true, name: true, subjectId: true, gradeId: true, createdAt: true },
      take: 10,
    });
    // Search Lessons
    const lessons = await prisma.lesson.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, unitId: true, createdAt: true, content: true },
      take: 10,
    });
    // Format results
    const results = [
      ...subjects.map(s => ({ type: 'subject', id: s.id, name: s.name, snippet: '', createdAt: s.createdAt })),
      ...units.map(u => ({ type: 'unit', id: u.id, name: u.name, subjectId: u.subjectId, gradeId: u.gradeId, snippet: '', createdAt: u.createdAt })),
      ...lessons.map(l => ({ type: 'lesson', id: l.id, name: l.name, unitId: l.unitId, snippet: l.content ? l.content.slice(0, 100) : '', createdAt: l.createdAt })),
    ];
    // Sort by createdAt desc, then name
    results.sort((a, b) => b.createdAt - a.createdAt || a.name.localeCompare(b.name));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search courses', details: err.message });
  }
});

// --- Teachers: Weekly Activity (lessons completed per day for current week) ---
app.get('/api/teacher/weekly-activity', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    // Get all class IDs taught by this teacher
    const classes = await prisma.class.findMany({ where: { teacherId }, select: { id: true } });
    const classIds = classes.map(c => c.id);
    if (classIds.length === 0) return res.json({ week: [0,0,0,0,0,0,0] });
    // Get all enrollments for these classes
    const enrollments = await prisma.enrollment.findMany({ where: { classId: { in: classIds } }, select: { userId: true } });
    const studentIds = enrollments.map(e => e.userId);
    if (studentIds.length === 0) return res.json({ week: [0,0,0,0,0,0,0] });
    // Get all ProgressVideo completions for these students in the last 7 days
    const startOfWeek = new Date();
    startOfWeek.setHours(0,0,0,0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Next Sunday
    const completions = await prisma.progressVideo.findMany({
      where: {
        completed: true,
        completedAt: { gte: startOfWeek, lt: endOfWeek },
        progressUnit: {
          progress: { userId: { in: studentIds } }
        }
      },
      select: { completedAt: true }
    });
    // Count completions per day (Sun-Sat)
    const week = [0,0,0,0,0,0,0];
    completions.forEach(c => {
      const d = new Date(c.completedAt);
      const day = d.getDay();
      week[day]++;
    });
    res.json({ week });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weekly activity', details: err.message });
  }
});

// --- Teachers: Upcoming Assignments (real DB) ---
app.get('/api/teacher/upcoming-assignments', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classes = await prisma.class.findMany({ where: { teacherId }, select: { id: true, name: true, subject: true, grade: true } });
    const classIds = classes.map(c => c.id);
    if (classIds.length === 0) return res.json([]);
    const assignments = await prisma.assignment.findMany({
      where: { classId: { in: classIds }, dueDate: { gte: new Date() } },
      orderBy: { dueDate: 'asc' },
      include: { class: true }
    });
    const result = assignments.map(a => ({
      id: a.id,
      title: a.title,
      dueDate: a.dueDate,
      className: a.class.name,
      subject: a.class.subject,
      grade: a.class.grade
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch upcoming assignments', details: err.message });
  }
});

// --- Teachers: Recent Activity (real DB) ---
app.get('/api/teacher/recent-activity', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    // Get all class IDs taught by this teacher
    const classes = await prisma.class.findMany({ where: { teacherId }, select: { id: true } });
    const classIds = classes.map(c => c.id);
    if (classIds.length === 0) return res.json([]);
    // Get all student IDs enrolled in these classes
    const enrollments = await prisma.enrollment.findMany({ where: { classId: { in: classIds } }, select: { userId: true } });
    const studentIds = enrollments.map(e => e.userId);
    if (studentIds.length === 0) return res.json([]);
    // Get recent activities for these students in these classes
    const activities = await prisma.activity.findMany({
      where: {
        userId: { in: studentIds },
        classId: { in: classIds },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const result = activities.map(a => ({
      id: a.id,
      type: a.type,
      text: a.text,
      icon: a.icon,
      timestamp: a.createdAt,
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent activity', details: err.message });
  }
});

// --- Teachers: Class Summary (real data) ---
app.get('/api/teacher/class/:id/summary', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const classId = Number(req.params.id);
    // Check teacher owns this class
    const cls = await prisma.class.findUnique({ where: { id: classId }, include: { subject: true } });
    if (!cls || cls.teacherId !== teacherId) return res.status(403).json({ error: 'Not authorized' });
    // Get all students enrolled
    const enrollments = await prisma.enrollment.findMany({ where: { classId }, select: { userId: true } });
    const studentIds = enrollments.map(e => e.userId);
    if (studentIds.length === 0) {
      return res.json({
        studentsCount: 0,
        avgProgress: 0,
        avgAttendance: 0,
        topPerformer: null,
        progressOverTime: [0,0,0,0,0,0],
        attendanceBreakdown: { present: 0, absent: 0 },
        studentsNeedingAttention: [],
        studentRoster: []
      });
    }
    // Get subjectId for this class
    const subjectName = cls.subject;
    const subject = await prisma.subject.findFirst({ where: { name: subjectName } });
    // Get all Progress records for these students for this subject
    const progresses = await prisma.progress.findMany({
      where: {
        userId: { in: studentIds },
        subjectId: subject ? subject.id : undefined,
      },
      select: { userId: true, percent: true }
    });
    // Get all Attendance records for these students for this class
    const attendances = await prisma.attendance.findMany({
      where: {
        userId: { in: studentIds },
        classId,
      },
      orderBy: { date: 'asc' },
    });
    // Get all Activity records for these students for this class
    const activities = await prisma.activity.findMany({
      where: {
        userId: { in: studentIds },
        classId,
      },
      orderBy: { createdAt: 'desc' },
    });
    // Build student roster
    const studentRoster = await Promise.all(studentIds.map(async (id) => {
      const user = await prisma.user.findUnique({ where: { id } });
      // Progress
      const progressRec = progresses.find(p => p.userId === id);
      const progress = progressRec ? progressRec.percent : 0;
      // Attendance
      const studentAttendances = attendances.filter(a => a.userId === id);
      const totalDays = studentAttendances.length;
      const presentDays = studentAttendances.filter(a => a.present).length;
      const attendance = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      // Last Activity
      let lastAttendance = studentAttendances.length > 0 ? studentAttendances[studentAttendances.length - 1].date : null;
      let lastActivity = activities.find(a => a.userId === id);
      let lastActivityDate = lastActivity ? lastActivity.createdAt : null;
      let last = '-';
      if (lastAttendance && lastActivityDate) {
        last = lastAttendance > lastActivityDate ? lastAttendance : lastActivityDate;
      } else if (lastAttendance) {
        last = lastAttendance;
      } else if (lastActivityDate) {
        last = lastActivityDate;
      }
      // Format last activity as relative string
      let lastActivityStr = '-';
      if (last && last instanceof Date) {
        const now = new Date();
        const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        if (diff === 0) lastActivityStr = 'Today';
        else if (diff === 1) lastActivityStr = 'Yesterday';
        else lastActivityStr = `${diff} days ago`;
      }
      return {
        id: user.id,
        name: user.name,
        progress,
        attendance,
        lastActivity: lastActivityStr
      };
    }));
    const studentsCount = studentRoster.length;
    const avgProgress = studentsCount > 0 ? Math.round(studentRoster.reduce((sum, s) => sum + s.progress, 0) / studentsCount) : 0;
    const avgAttendance = studentsCount > 0 ? Math.round(studentRoster.reduce((sum, s) => sum + s.attendance, 0) / studentsCount) : 0;
    const topPerformer = studentsCount > 0 ? studentRoster.reduce((top, s) => (s.progress > top.progress ? s : top), studentRoster[0]) : null;
    // Progress over 6 weeks (real: use attendance/progress by week, fallback to 0)
    // For now, mock as 6 most recent progress values
    const progressOverTime = progresses.slice(0, 6).map(p => p.percent);
    while (progressOverTime.length < 6) progressOverTime.push(0);
    // Attendance breakdown
    const totalAttendance = studentRoster.reduce((sum, s) => sum + s.attendance, 0);
    const present = studentsCount > 0 ? Math.round(totalAttendance / studentsCount) : 0;
    const absent = 100 - present;
    // Students needing attention
    const studentsNeedingAttention = studentRoster.filter(s => s.progress < 60 || s.attendance < 80);
    res.json({
      studentsCount,
      avgProgress,
      avgAttendance,
      topPerformer,
      progressOverTime,
      attendanceBreakdown: { present, absent },
      studentsNeedingAttention,
      studentRoster
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch class summary', details: err.message });
  }
});

// --- Teachers: All Students Roster ---
app.get('/api/teacher/students', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    // Get all classes taught by this teacher
    const classes = await prisma.class.findMany({ where: { teacherId }, select: { id: true, subject: true } });
    const classIds = classes.map(c => c.id);
    if (classIds.length === 0) return res.json([]);
    // Get all enrollments for these classes
    const enrollments = await prisma.enrollment.findMany({ where: { classId: { in: classIds } }, select: { userId: true, classId: true } });
    const studentIds = [...new Set(enrollments.map(e => e.userId))];
    if (studentIds.length === 0) return res.json([]);
    // Get all Progress records for these students for the subjects of these classes
    const subjectNames = [...new Set(classes.map(c => c.subject))];
    const subjects = await prisma.subject.findMany({ where: { name: { in: subjectNames } } });
    const subjectIds = subjects.map(s => s.id);
    const progresses = await prisma.progress.findMany({
      where: {
        userId: { in: studentIds },
        subjectId: { in: subjectIds },
      },
      select: { userId: true, percent: true }
    });
    // Get all Attendance records for these students for these classes
    const attendances = await prisma.attendance.findMany({
      where: {
        userId: { in: studentIds },
        classId: { in: classIds },
      },
      orderBy: { date: 'asc' },
    });
    // Get all Activity records for these students for these classes
    const activities = await prisma.activity.findMany({
      where: {
        userId: { in: studentIds },
        classId: { in: classIds },
      },
      orderBy: { createdAt: 'desc' },
    });
    // Build student roster
    const studentRoster = await Promise.all(studentIds.map(async (id) => {
      const user = await prisma.user.findUnique({ where: { id } });
      // Progress: average across all subjects in teacher's classes
      const studentProgresses = progresses.filter(p => p.userId === id);
      const progress = studentProgresses.length > 0 ? Math.round(studentProgresses.reduce((sum, p) => sum + p.percent, 0) / studentProgresses.length) : 0;
      // Attendance: average across all classes
      const studentAttendances = attendances.filter(a => a.userId === id);
      const totalDays = studentAttendances.length;
      const presentDays = studentAttendances.filter(a => a.present).length;
      const attendance = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      // Last Activity
      let lastAttendance = studentAttendances.length > 0 ? studentAttendances[studentAttendances.length - 1].date : null;
      let lastActivity = activities.find(a => a.userId === id);
      let lastActivityDate = lastActivity ? lastActivity.createdAt : null;
      let last = '-';
      if (lastAttendance && lastActivityDate) {
        last = lastAttendance > lastActivityDate ? lastAttendance : lastActivityDate;
      } else if (lastAttendance) {
        last = lastAttendance;
      } else if (lastActivityDate) {
        last = lastActivityDate;
      }
      // Format last activity as relative string
      let lastActivityStr = '-';
      if (last && last instanceof Date) {
        const now = new Date();
        const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        if (diff === 0) lastActivityStr = 'Today';
        else if (diff === 1) lastActivityStr = 'Yesterday';
        else lastActivityStr = `${diff} days ago`;
      }
      return {
        id: user.id,
        name: user.name,
        progress,
        attendance,
        lastActivity: lastActivityStr
      };
    }));
    res.json(studentRoster);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students roster', details: err.message });
  }
});

// AI Lesson Plan Generation endpoint
app.post('/api/ai/generate-lesson-plan', authenticateToken, async (req, res) => {
  try {
    console.log('=== DEMO LESSON PLAN REQUEST ===');
    console.log('Request body:', req.body);
    
    const { topic, learningStyle, classSize, timeAvailable, difficulty, culturalContext, includeActivities, includeAssessment } = req.body;
    
    console.log('Extracted parameters:', {
      topic,
      learningStyle,
      classSize,
      timeAvailable,
      difficulty,
      culturalContext,
      includeActivities,
      includeAssessment
    });

    // Validate required fields
    if (!topic) {
      console.log('Error: Topic is required');
      return res.status(400).json({ 
        success: false, 
        error: 'Topic is required' 
      });
    }

    console.log('Using demo mode for lesson plan generation...');
    
    // Generate demo lesson plan
    const demoLessonPlan = generateDemoLessonPlan(topic, learningStyle, classSize, timeAvailable, difficulty, culturalContext);
    
    console.log('Demo lesson plan generated successfully:', demoLessonPlan.title);
    
    return res.json({
      success: true,
      lessonPlan: demoLessonPlan,
      message: 'Demo lesson plan generated successfully',
      demo: true
    });

  } catch (error) {
    console.error('=== ERROR IN DEMO LESSON PLAN ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate lesson plan',
      details: error.message 
    });
  }
});

// Demo lesson plan generator
function generateDemoLessonPlan(topic, learningStyle, classSize, timeAvailable, difficulty, culturalContext) {
  const subjects = {
    'math': 'Mathematics',
    'science': 'Science', 
    'english': 'English Language',
    'history': 'Social Studies',
    'art': 'Creative Arts',
    'music': 'Music',
    'pe': 'Physical Education'
  };
  
  const subject = subjects[topic.toLowerCase()] || 'General Studies';
  const grade = difficulty === 'easy' ? 'Primary 3-4' : difficulty === 'medium' ? 'Primary 5-6' : 'Primary 6';
  
  const activities = [
    {
      id: 1,
      name: 'Introduction and Hook',
      duration: '10 minutes',
      description: `Engage students with an interactive ${topic} demonstration using real-world examples.`,
      type: 'whole-class'
    },
    {
      id: 2,
      name: 'Concept Exploration',
      duration: '15 minutes', 
      description: `Use visual aids and hands-on activities to explore ${topic} concepts.`,
      type: 'whole-class'
    },
    {
      id: 3,
      name: 'Group Practice',
      duration: '15 minutes',
      description: `Students work in small groups to practice ${topic} skills and solve problems together.`,
      type: 'group'
    },
    {
      id: 4,
      name: 'Individual Assessment',
      duration: '10 minutes',
      description: `Quick individual check to assess understanding of ${topic} concepts.`,
      type: 'individual'
    }
  ];
  
  return {
    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} - Interactive Learning Experience`,
    subject: subject,
    grade: grade,
    duration: `${timeAvailable} minutes`,
    objectives: [
      { id: 1, text: `Understand basic ${topic} concepts and principles`, completed: false },
      { id: 2, text: `Apply ${topic} knowledge in practical scenarios`, completed: false },
      { id: 3, text: `Demonstrate mastery through interactive activities`, completed: false },
      { id: 4, text: `Collaborate effectively in group learning activities`, completed: false }
    ],
    materials: [
      { id: 1, name: 'Whiteboard and markers', quantity: '1 set', notes: 'For visual demonstrations' },
      { id: 2, name: 'Student worksheets', quantity: classSize, notes: 'Individual practice materials' },
      { id: 3, name: 'Interactive digital tools', quantity: '1', notes: 'For engaging demonstrations' },
      { id: 4, name: 'Group activity materials', quantity: '5 sets', notes: 'For collaborative learning' }
    ],
    activities: activities,
    assessment: `Formative assessment through observation, group work participation, and individual practice. Summative assessment through a short quiz at the end covering ${topic} concepts.`,
    notes: `This lesson is designed for ${classSize} students with a ${learningStyle} learning approach. The difficulty level is ${difficulty} and includes ${culturalContext ? 'cultural context from ' + culturalContext : 'general examples'}. The lesson promotes active learning and student engagement.`
  };
}

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AfroLearn API Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Network accessible at http://0.0.0.0:${PORT}/api`);
  console.log(`📱 Mobile devices can connect using your computer's IP address`);
});

module.exports = app;
 
 
 