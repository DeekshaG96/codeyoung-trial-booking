import { 
  askKodaAI, 
  explainCodeClient, 
  debugCodeClient, 
  queryKnowledgeCore 
} from './kodaAiEngine';

const API_BASE = '/api';

export const api = {
  // Available slots for a date & parent timezone
  async getAvailableSlots(timezone, date, subject = '') {
    const params = new URLSearchParams({ timezone, date });
    if (subject && subject !== 'All') params.append('subject', subject);
    
    const res = await fetch(`${API_BASE}/available-slots?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch available slots');
    return res.json();
  },

  // Supported timezones with DST meta
  async getTimezones() {
    const res = await fetch(`${API_BASE}/timezones`);
    if (!res.ok) throw new Error('Failed to fetch timezones');
    return res.json();
  },

  // Timezone DST information for specific date
  async getTimezoneInfo(timezone, date) {
    const params = new URLSearchParams({ timezone, date });
    const res = await fetch(`${API_BASE}/timezone-info?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch timezone info');
    return res.json();
  },

  // Book a trial class
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  // All bookings list
  async getBookings() {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  // Specific booking details
  async getBooking(id) {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) throw new Error('Failed to fetch booking');
    return res.json();
  },

  // Join waitlist
  async joinWaitlist(waitlistData) {
    const res = await fetch(`${API_BASE}/bookings/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(waitlistData)
    });
    return res.json();
  },

  // 10 Mentors with quota utilization stats
  async getMentors(date = '') {
    const url = date ? `${API_BASE}/mentors?date=${date}` : `${API_BASE}/mentors`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch mentors');
    return res.json();
  },

  // Specific mentor schedule
  async getMentorSchedule(mentorId, date = '', viewTimezone = 'Asia/Kolkata') {
    const params = new URLSearchParams({ viewTimezone });
    if (date) params.append('date', date);
    const res = await fetch(`${API_BASE}/mentors/${mentorId}/schedule?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch mentor schedule');
    return res.json();
  },

  // Run 20 parents simulation
  async runSimulation(targetDate = '') {
    const res = await fetch(`${API_BASE}/simulate/20-parents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetDate })
    });
    return res.json();
  },

  // Reset database to seed
  async resetData() {
    const res = await fetch(`${API_BASE}/reset-data`, { method: 'POST' });
    return res.json();
  },

  // Email notifications log
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  // PostHog & Sentry Telemetry Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Auth: Login
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }
    return res.json();
  },

  // Auth: Register
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }
    return res.json();
  },

  // Auth: Available demo users
  async getAuthUsers() {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch demo users');
    return res.json();
  },

  // Code Runner
  async runCode(code, language = 'python') {
    try {
      const res = await fetch(`${API_BASE}/code/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback to client runner
    }
    return null;
  },

  // AI Mentor Chat (resilient across server, Gemini, and knowledge core)
  async askAI(message, code = '', language = 'python', studentName = 'Young Innovator') {
    try {
      const res = await fetch(`${API_BASE}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, code, language, studentName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Server not reachable (e.g. static hosting on Firebase)
    }

    // Direct client AI mentor
    return await askKodaAI(message, code, language, studentName);
  },

  // AI Code Explanation
  async explainCode(code, language = 'python') {
    try {
      const res = await fetch(`${API_BASE}/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return explainCodeClient(code, language);
  },

  // AI Debugger
  async debugCode(code, language = 'python') {
    try {
      const res = await fetch(`${API_BASE}/ai/debug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    return debugCodeClient(code, language);
  },

  // AI Coding Challenge Generator
  async getChallenge(code = '', language = 'python') {
    try {
      const res = await fetch(`${API_BASE}/ai/challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const challenges = [
      {
        title: 'Alien Shield Energy Recharger',
        difficulty: 'Easy',
        badge: 'Level 1 Explorer',
        description: 'Add a function called recharge_shield() that restores +30 energy points and prints the new status.',
        starterCode: `\ndef recharge_shield():\n    global energy\n    energy += 30\n    print(f"🛡️ Shield fully powered! Current Energy: {energy}")\n\nrecharge_shield()`,
        reward: '50 XP & Space Cadet Badge'
      },
      {
        title: 'Asteroid Collision Event',
        difficulty: 'Medium',
        badge: 'Level 2 Pilot',
        description: 'Create an asteroid encounter where your ship takes 20 damage, but if your level is greater than 2, you dodge it!',
        starterCode: `\ndef dodge_asteroid():\n    global energy, level\n    if level >= 2:\n        print("🎯 Nimble pilot! You dodged the asteroid smoothly!")\n    else:\n        energy -= 20\n        print(f"💥 Asteroid collision! Energy down to {energy}")\n\ndodge_asteroid()`,
        reward: '100 XP & Ace Navigator Badge'
      },
      {
        title: 'Interstellar Warp Drive Loop',
        difficulty: 'Fun',
        badge: 'Level 3 Commander',
        description: 'Use a for-loop to jump through 3 different galaxy sectors, increasing your explorer score on each jump!',
        starterCode: `\nsectors = ["Nebula Orion", "Andromeda Core", "Cygnus Gateway"]\nfor sector in sectors:\n    print(f"🌌 Warp drive engaged! Arrived at: {sector}!")\nprint("✨ Galaxy exploration mission accomplished!")`,
        reward: '150 XP & Galaxy Master Certificate'
      }
    ];
    return { success: true, challenge: challenges[Math.floor(Math.random() * challenges.length)] };
  }
};
