/**
 * Seed data for Codeyoung's 10 dedicated trial class mentors based in India (IST - UTC+05:30).
 * Each mentor is capped at AT MOST 2 demo classes per day as per business rule.
 */
export const SEED_MENTORS = [
  {
    id: 'mentor-1',
    name: 'Aarav Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    title: 'Lead Python & AI Educator',
    bio: 'Ex-Robotics Engineer with 5+ years instructing 600+ young innovators in Python and Generative AI.',
    specialties: ['Python', 'AI for Kids', 'Machine Learning', 'Data Science'],
    shiftName: 'UK & EMEA Shift',
    rating: 4.95,
    totalReviews: 240,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '13:00', // 1:00 PM IST
      end: '22:00'   // 10:00 PM IST
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-2',
    name: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    title: 'Senior Scratch & Creative Coding Coach',
    bio: 'Specialist in playful block-based programming, game mechanics, and computational thinking for ages 5-10.',
    specialties: ['Scratch', 'Block Coding', 'Game Development', 'Creative Computing'],
    shiftName: 'UK & EMEA Shift',
    rating: 4.98,
    totalReviews: 310,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '13:00',
      end: '22:00'
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-3',
    name: 'Rohan Mukherjee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    title: 'Full-Stack Web & App Development Mentor',
    bio: 'Empowers teens to build live web apps using HTML/CSS, JavaScript, and React with interactive projects.',
    specialties: ['Web Development', 'JavaScript', 'HTML/CSS', 'App Development'],
    shiftName: 'UK & US Morning Shift',
    rating: 4.92,
    totalReviews: 185,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '14:00',
      end: '23:00'
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-4',
    name: 'Ananya Rao',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    title: 'Math Olympiad & Computational Logic Lead',
    bio: 'Passionate about demystifying advanced mathematical logic, patterns, and competitive problem-solving for kids.',
    specialties: ['Math Olympiad', 'Mental Math', 'Vedic Math', 'Algorithms'],
    shiftName: 'UK & US Morning Shift',
    rating: 4.96,
    totalReviews: 290,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '14:00',
      end: '23:00'
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-5',
    name: 'Vikramaditya Iyer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    title: 'Robotics & Microcontroller Specialist',
    bio: 'Hardware tinkerer teaching Arduino, micro:bit, and interactive circuit programming for future engineers.',
    specialties: ['Robotics', 'Micro:bit', 'Arduino', 'IoT for Kids'],
    shiftName: 'US Prime Evening Shift',
    rating: 4.89,
    totalReviews: 160,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '18:00', // 6:00 PM IST
      end: '03:00'   // 3:00 AM IST (US afternoon/evening)
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-6',
    name: 'Neha Gupta',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    title: 'Early Childhood STEM Coach',
    bio: 'Expert in fostering early curiosity, storytelling through code, and building spatial reasoning for young learners.',
    specialties: ['Scratch', 'Early STEM', 'ScratchJr', 'Logic Games'],
    shiftName: 'US Prime Evening Shift',
    rating: 4.97,
    totalReviews: 340,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '18:00',
      end: '03:00'
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-7',
    name: 'Siddharth Verma',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    title: 'Game Design & 3D Virtual Worlds',
    bio: 'Roblox Studio and Unity 2D coach helping kids turn their gaming passion into real 3D game development skills.',
    specialties: ['Roblox Studio', 'Lua Scripting', 'Game Design', 'Python'],
    shiftName: 'US Prime Evening Shift',
    rating: 4.91,
    totalReviews: 215,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '18:00',
      end: '03:00'
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-8',
    name: 'Kavya Patel',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171dd825a07?auto=format&fit=crop&w=250&q=80',
    title: 'Senior Python & Web Specialist',
    bio: 'Double degree in CS & Education. Guides kids through real-world projects from zero to functional web apps.',
    specialties: ['Python', 'Web Development', 'JavaScript', 'Scratch'],
    shiftName: 'US Prime Evening Shift',
    rating: 4.94,
    totalReviews: 280,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '18:00',
      end: '03:00'
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-9',
    name: 'Aditya Kulkarni',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
    title: 'Data Science & Algorithm Coach',
    bio: 'Loves teaching data visualizations, algorithmic thinking, and competitive coding fundamentals to middle-schoolers.',
    specialties: ['Data Science', 'Python', 'Algorithms', 'Math Olympiad'],
    shiftName: 'US West Coast & Late Night Shift',
    rating: 4.93,
    totalReviews: 195,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '21:00', // 9:00 PM IST
      end: '06:00'   // 6:00 AM IST (US evening/Pacific)
    },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-10',
    name: 'Tanvi Joshi',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=250&q=80',
    title: 'Creative Coding & Animation Mentor',
    bio: 'Combines digital art, generative canvas animations, and interactive sound synthesis with programming logic.',
    specialties: ['Scratch', 'Creative Computing', 'Animation', 'HTML/CSS'],
    shiftName: 'US West Coast & Late Night Shift',
    rating: 4.96,
    totalReviews: 260,
    timezone: 'Asia/Kolkata',
    workingHours: {
      start: '21:00',
      end: '06:00'
    },
    maxDemosPerDay: 2
  }
];
