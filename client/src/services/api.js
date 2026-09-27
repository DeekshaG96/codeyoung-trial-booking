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
  }
};
