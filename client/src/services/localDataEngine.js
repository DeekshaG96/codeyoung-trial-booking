import { DateTime } from 'luxon';

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
    workingHours: { start: '13:00', end: '22:00' },
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
    workingHours: { start: '13:00', end: '22:00' },
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
    workingHours: { start: '14:00', end: '23:00' },
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
    workingHours: { start: '14:00', end: '23:00' },
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
    workingHours: { start: '18:00', end: '03:00' },
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
    workingHours: { start: '18:00', end: '03:00' },
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
    workingHours: { start: '18:00', end: '03:00' },
    maxDemosPerDay: 2
  },
  {
    id: 'mentor-8',
    name: 'Kavya Patel',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=250&q=80',
    title: 'Senior Python & Web Specialist',
    bio: 'Double degree in CS & Education. Guides kids through real-world projects from zero to functional web apps.',
    specialties: ['Python', 'Web Development', 'JavaScript', 'Scratch'],
    shiftName: 'US Prime Evening Shift',
    rating: 4.94,
    totalReviews: 280,
    timezone: 'Asia/Kolkata',
    workingHours: { start: '18:00', end: '03:00' },
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
    workingHours: { start: '21:00', end: '06:00' },
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
    workingHours: { start: '21:00', end: '06:00' },
    maxDemosPerDay: 2
  }
];

export const SUPPORTED_TIMEZONES = [
  { id: 'America/New_York', label: 'US Eastern Time (ET)', city: 'New York', region: 'US' },
  { id: 'America/Chicago', label: 'US Central Time (CT)', city: 'Chicago', region: 'US' },
  { id: 'America/Denver', label: 'US Mountain Time (MT)', city: 'Denver', region: 'US' },
  { id: 'America/Los_Angeles', label: 'US Pacific Time (PT)', city: 'Los Angeles / SF', region: 'US' },
  { id: 'Europe/London', label: 'UK Time (GMT / BST)', city: 'London', region: 'UK' },
  { id: 'Asia/Kolkata', label: 'India Standard Time (IST)', city: 'Bangalore / New Delhi', region: 'IN' }
];

const STORAGE_KEYS = {
  BOOKINGS: 'kodaverse_local_bookings_v2',
  NOTIFICATIONS: 'kodaverse_local_notifications_v2',
  WAITLIST: 'kodaverse_local_waitlist_v2'
};

function getStored(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getLocalOperationalShiftDate(isoString) {
  const dt = DateTime.fromISO(isoString, { zone: 'Asia/Kolkata' });
  if (!dt.isValid) return isoString.split('T')[0];
  if (dt.hour >= 0 && dt.hour < 7) {
    return dt.minus({ days: 1 }).toFormat('yyyy-MM-dd');
  }
  return dt.toFormat('yyyy-MM-dd');
}

export function getLocalMentors(date = '') {
  const targetDate = date || DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd');
  const bookings = getStored(STORAGE_KEYS.BOOKINGS, []);

  return SEED_MENTORS.map(mentor => {
    const mentorBookings = bookings.filter(b => {
      if (b.mentorId !== mentor.id || b.status === 'CANCELLED') return false;
      const bookingShift = getLocalOperationalShiftDate(b.slotStartIso || b.slotStartUtc);
      return bookingShift === targetDate;
    });

    const bookedCount = mentorBookings.length;
    return {
      ...mentor,
      demosBookedToday: bookedCount,
      remainingDailyDemos: Math.max(0, 2 - bookedCount),
      isCapacityReached: bookedCount >= 2,
      todayBookings: mentorBookings
    };
  });
}

export function getLocalAvailableSlots(timezone = 'America/New_York', date = '', subject = '') {
  const parentTz = timezone || 'America/New_York';
  const targetDate = date || DateTime.now().setZone(parentTz).plus({ days: 1 }).toFormat('yyyy-MM-dd');
  const mentors = getLocalMentors(targetDate);

  const testHours = [9, 10, 11, 14, 15, 16, 17, 18, 19, 20];
  const slots = [];

  testHours.forEach((hour, idx) => {
    const parentDt = DateTime.fromObject(
      {
        year: parseInt(targetDate.split('-')[0]),
        month: parseInt(targetDate.split('-')[1]),
        day: parseInt(targetDate.split('-')[2]),
        hour,
        minute: 0
      },
      { zone: parentTz }
    );

    if (!parentDt.isValid) return;

    const istDt = parentDt.setZone('Asia/Kolkata');
    const eligibleMentor = mentors.find(m => {
      if (m.isCapacityReached) return false;
      if (subject && subject !== 'All' && !m.specialties.some(s => s.toLowerCase().includes(subject.toLowerCase()))) {
        return false;
      }
      return true;
    }) || mentors.find(m => !m.isCapacityReached);

    if (eligibleMentor) {
      slots.push({
        id: `slot-${targetDate}-${hour}`,
        slotStartUtc: parentDt.toUTC().toISO(),
        slotEndUtc: parentDt.plus({ minutes: 45 }).toUTC().toISO(),
        displayTimeParent: parentDt.toFormat('hh:mm a'),
        displayDateParent: parentDt.toFormat('ccc, LLL dd'),
        displayTimeMentor: istDt.toFormat('hh:mm a'),
        displayDateMentor: istDt.toFormat('ccc, LLL dd'),
        mentorId: eligibleMentor.id,
        mentorName: eligibleMentor.name,
        mentorTitle: eligibleMentor.title,
        mentorAvatar: eligibleMentor.avatar,
        mentorShift: eligibleMentor.shiftName,
        available: true,
        subject: subject && subject !== 'All' ? subject : eligibleMentor.specialties[0]
      });
    }
  });

  return {
    success: true,
    data: {
      queryDate: targetDate,
      queryTimezone: parentTz,
      isDstActive: DateTime.now().setZone(parentTz).isInDST,
      totalSlotsAvailable: slots.length,
      slots
    }
  };
}

export function createLocalBooking(bookingData) {
  const bookings = getStored(STORAGE_KEYS.BOOKINGS, []);
  const mentors = getLocalMentors();
  const mentor = mentors.find(m => m.id === bookingData.mentorId) || mentors[0];

  const shiftDate = getLocalOperationalShiftDate(bookingData.slotStartUtc || new Date().toISOString());
  const existingForMentor = bookings.filter(b => b.mentorId === mentor.id && getLocalOperationalShiftDate(b.slotStartUtc) === shiftDate);

  if (existingForMentor.length >= 2) {
    return {
      success: false,
      error: 'MENTOR_CAPACITY_EXCEEDED',
      message: `${mentor.name} has already reached their maximum daily capacity of 2 demo sessions. Please select an alternative slot.`
    };
  }

  const newBooking = {
    id: `KV-BK-${Date.now().toString(36).toUpperCase()}`,
    ...bookingData,
    mentorId: mentor.id,
    mentorName: mentor.name,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    liveClassUrl: `/classroom?booking=KV-BK-${Date.now().toString(36).toUpperCase()}`
  };

  bookings.push(newBooking);
  setStored(STORAGE_KEYS.BOOKINGS, bookings);

  // Add notification
  const notifications = getStored(STORAGE_KEYS.NOTIFICATIONS, []);
  notifications.unshift({
    id: `notif-${Date.now()}`,
    bookingId: newBooking.id,
    type: 'PARENT_CONFIRMATION',
    recipientEmail: newBooking.parentEmail || 'parent@example.com',
    subject: `Confirmed: 1:1 Live Coding Trial Class for ${newBooking.studentName || 'Student'}`,
    timestamp: new Date().toISOString(),
    content: `Your Codeyoung trial class has been scheduled with ${mentor.name}.`
  });
  setStored(STORAGE_KEYS.NOTIFICATIONS, notifications);

  return {
    success: true,
    data: newBooking
  };
}

export function runLocalSimulation(targetDate = '') {
  const simDate = targetDate || DateTime.now().setZone('Asia/Kolkata').plus({ days: 1 }).toFormat('yyyy-MM-dd');
  const simulatedParents = [
    { name: 'Sarah Jenkins (US EDT)', tz: 'America/New_York', sub: 'Python', hour: 10 },
    { name: 'David Miller (US CDT)', tz: 'America/Chicago', sub: 'Scratch', hour: 11 },
    { name: 'Emma Wilson (UK BST)', tz: 'Europe/London', sub: 'Web Development', hour: 14 },
    { name: 'Michael Chang (US PDT)', tz: 'America/Los_Angeles', sub: 'AI for Kids', hour: 16 },
    { name: 'Sophia Rossi (UK BST)', tz: 'Europe/London', sub: 'Scratch', hour: 15 },
    { name: 'James Anderson (US EDT)', tz: 'America/New_York', sub: 'Python', hour: 17 },
    { name: 'Olivia Taylor (US CDT)', tz: 'America/Chicago', sub: 'Math Olympiad', hour: 18 },
    { name: 'Daniel Martinez (US MDT)', tz: 'America/Denver', sub: 'Robotics', hour: 15 },
    { name: 'Emily Brown (US PDT)', tz: 'America/Los_Angeles', sub: 'Game Design', hour: 17 },
    { name: 'Lucas Garcia (US EDT)', tz: 'America/New_York', sub: 'Python', hour: 18 },
    { name: 'Ava Patel (US CDT)', tz: 'America/Chicago', sub: 'Scratch', hour: 16 },
    { name: 'Alexander White (UK BST)', tz: 'Europe/London', sub: 'Web Development', hour: 16 },
    { name: 'Mia Thomas (US PDT)', tz: 'America/Los_Angeles', sub: 'AI for Kids', hour: 18 },
    { name: 'Ethan Jackson (US EDT)', tz: 'America/New_York', sub: 'Robotics', hour: 19 },
    { name: 'Isabella Harris (US MDT)', tz: 'America/Denver', sub: 'Math Olympiad', hour: 17 },
    { name: 'Benjamin Martin (US CDT)', tz: 'America/Chicago', sub: 'Python', hour: 19 },
    { name: 'Charlotte Clark (UK BST)', tz: 'Europe/London', sub: 'Scratch', hour: 17 },
    { name: 'William Lewis (US PDT)', tz: 'America/Los_Angeles', sub: 'Game Design', hour: 19 },
    { name: 'Amelia Robinson (US EDT)', tz: 'America/New_York', sub: 'Python', hour: 20 },
    { name: 'Henry Walker (US CDT)', tz: 'America/Chicago', sub: 'Scratch', hour: 20 },
    { name: 'Parent #21 - Quota Overflow Attempt', tz: 'America/New_York', sub: 'Python', hour: 21 }
  ];

  const mentorUsage = {};
  SEED_MENTORS.forEach(m => { mentorUsage[m.id] = { ...m, bookedCount: 0 }; });

  const log = [];
  let successful = 0;
  let rejected = 0;

  simulatedParents.forEach((p, index) => {
    // Find eligible mentor with < 2 demos
    const mentor = SEED_MENTORS.find(m => mentorUsage[m.id].bookedCount < 2);

    if (mentor && successful < 20) {
      mentorUsage[mentor.id].bookedCount += 1;
      successful += 1;
      log.push({
        attemptIndex: index + 1,
        parentName: p.name,
        timezone: p.tz,
        status: 'SUCCESS',
        allocatedMentor: mentor.name,
        mentorShift: mentor.shiftName,
        mentorQuotaAfter: `${mentorUsage[mentor.id].bookedCount}/2 demos`,
        reason: 'Successfully matched within daily quota.'
      });
    } else {
      rejected += 1;
      log.push({
        attemptIndex: index + 1,
        parentName: p.name,
        timezone: p.tz,
        status: 'REJECTED_CAPACITY_FULL',
        allocatedMentor: 'None (System Capacity Capped)',
        mentorShift: 'All 10 Mentors At Maximum 2/2 Demos',
        mentorQuotaAfter: '20/20 Daily Platform Max',
        reason: 'Platform reached maximum 20 demos/day limit (10 mentors × 2 demos/day). Empathetic recommendation: Off-peak alternative slot or Priority Waitlist.'
      });
    }
  });

  const mentorSummary = Object.values(mentorUsage).map(m => ({
    mentorId: m.id,
    mentorName: m.name,
    shift: m.shiftName,
    demosBookedToday: m.bookedCount,
    maxDailyDemos: 2,
    status: m.bookedCount === 2 ? 'AT_MAX_CAPACITY' : 'AVAILABLE'
  }));

  // Save to stored state
  const simBookings = log.filter(l => l.status === 'SUCCESS').map((l, i) => ({
    id: `KV-SIM-${i + 1}`,
    studentName: `${l.parentName.split(' ')[0]}'s Child`,
    parentName: l.parentName,
    parentEmail: `parent${i + 1}@example.com`,
    mentorId: SEED_MENTORS[Math.floor(i / 2)].id,
    mentorName: l.allocatedMentor,
    slotStartUtc: DateTime.fromISO(simDate, { zone: 'Asia/Kolkata' }).plus({ hours: 14 + (i % 8) }).toUTC().toISO(),
    status: 'CONFIRMED'
  }));
  setStored(STORAGE_KEYS.BOOKINGS, simBookings);

  return {
    success: true,
    report: {
      simulationDate: simDate,
      totalAttempted: simulatedParents.length,
      successfulBookings: successful,
      rejectedOrWaitlisted: rejected,
      systemCapacityDailyMax: 20,
      mentorUsageSummary: mentorSummary,
      log
    }
  };
}

export function resetLocalData() {
  setStored(STORAGE_KEYS.BOOKINGS, []);
  setStored(STORAGE_KEYS.NOTIFICATIONS, []);
  setStored(STORAGE_KEYS.WAITLIST, []);
  return { success: true, message: 'Local storage reset back to initial seed state.' };
}
