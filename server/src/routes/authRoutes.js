import express from 'express';

const router = express.Router();

// In-memory user store initialized with realistic demo accounts
export const USERS = [
  {
    id: 'usr-parent-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'parent',
    timezone: 'America/New_York',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    title: 'Parent (US Eastern • New York)',
    phone: '+1 (555) 234-8901',
    childName: 'Leo Jenkins',
    childAge: 9,
    grade: 'Grade 4',
    badge: 'Parent Portal'
  },
  {
    id: 'usr-mentor-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@codeyoung.com',
    role: 'mentor',
    timezone: 'Asia/Kolkata',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    title: 'Lead Mentor (India • Asia/Kolkata)',
    specialties: ['Python', 'Scratch', 'AI & Game Logic'],
    rating: 4.95,
    badge: 'Mentor Portal (IST)'
  },
  {
    id: 'usr-student-1',
    name: 'Young Innovator',
    email: 'innovator@codeyoung.com',
    role: 'student',
    timezone: 'America/New_York',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    title: 'Student Innovator (Grade 4)',
    badge: 'Student Portal',
    points: 350,
    level: 2
  },
  {
    id: 'usr-mentor-2',
    name: 'Priya Nair',
    email: 'priya.nair@codeyoung.com',
    role: 'mentor',
    timezone: 'Asia/Kolkata',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    title: 'Senior STEM Educator (IST)',
    specialties: ['Web Development', 'Scratch', 'Python'],
    rating: 4.92,
    badge: 'Mentor Portal (IST)'
  }
];

let dynamicUsers = [...USERS];

/**
 * GET /api/auth/users
 * Returns available demo user accounts for 1-click quick switching
 */
router.get('/auth/users', (req, res) => {
  res.json({
    success: true,
    users: dynamicUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      title: u.title,
      avatar: u.avatar,
      badge: u.badge,
      timezone: u.timezone
    }))
  });
});

/**
 * POST /api/auth/login
 * Handles email/password sign-in or quick role selection
 */
router.post('/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email && !role) {
    return res.status(400).json({ success: false, message: 'Email or demo role is required.' });
  }

  // Find user by email (case-insensitive) or by role
  let user = null;
  if (email) {
    user = dynamicUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  } else if (role) {
    user = dynamicUsers.find(u => u.role === role);
  }

  if (!user) {
    // If logging in with a new email address, auto-register as parent or chosen role
    const newId = `usr-${Date.now()}`;
    const nameFromEmail = email ? email.split('@')[0].replace(/[._]/g, ' ') : 'Guest User';
    const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    
    user = {
      id: newId,
      name: capitalizedName,
      email: email || `user-${Date.now()}@example.com`,
      role: role || 'parent',
      timezone: 'America/New_York',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(capitalizedName)}`,
      title: `${role === 'mentor' ? 'Certified Mentor' : role === 'student' ? 'Student Explorer' : 'Parent'}`,
      badge: `${role === 'mentor' ? 'Mentor' : role === 'student' ? 'Student' : 'Parent'} Portal`,
      createdAt: new Date().toISOString()
    };
    dynamicUsers.push(user);
  }

  const token = `token_${user.id}_${Date.now()}`;

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user
  });
});

/**
 * POST /api/auth/register
 * Handles sign up for new parents, mentors, or students
 */
router.post('/auth/register', (req, res) => {
  const { name, email, password, role = 'parent', timezone = 'America/New_York', childName, childAge } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required.' });
  }

  const existing = dynamicUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email,
    role,
    timezone,
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    title: role === 'mentor' ? 'Educator (Codeyoung)' : role === 'student' ? 'Student Explorer' : `Parent of ${childName || 'Student'}`,
    badge: `${role === 'mentor' ? 'Mentor' : role === 'student' ? 'Student' : 'Parent'} Portal`,
    childName: childName || undefined,
    childAge: childAge || undefined,
    createdAt: new Date().toISOString()
  };

  dynamicUsers.push(newUser);
  const token = `token_${newUser.id}_${Date.now()}`;

  res.status(201).json({
    success: true,
    message: `Account created successfully! Welcome to Codeyoung, ${name}!`,
    token,
    user: newUser
  });
});

/**
 * POST /api/auth/logout
 */
router.post('/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Signed out successfully.' });
});

export default router;
