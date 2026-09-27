import { DateTime } from 'luxon';
import { SEED_MENTORS } from './mentorsData.js';

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.mentors = JSON.parse(JSON.stringify(SEED_MENTORS));
    this.bookings = [];
    this.waitlist = [];
    this.notificationLog = [];

    // Pre-seed a few sample bookings for realistic initial demonstration
    this.seedInitialBookings();
  }

  seedInitialBookings() {
    const todayIST = DateTime.now().setZone('Asia/Kolkata');
    const todayStr = todayIST.toFormat('yyyy-MM-dd');

    // Create 1 initial trial booking for Mentor 1 and 1 for Mentor 2 on today's schedule
    const slot1Start = todayIST.set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toUTC();
    const slot1End = slot1Start.plus({ minutes: 60 });

    const slot2Start = todayIST.set({ hour: 17, minute: 0, second: 0, millisecond: 0 }).toUTC();
    const slot2End = slot2Start.plus({ minutes: 60 });

    const parentTz1 = 'America/New_York';
    const parentTz2 = 'Europe/London';

    this.bookings.push({
      id: 'CY-TR-849201',
      parentName: 'Sarah Jenkins',
      parentEmail: 'sarah.j@example.com',
      parentPhone: '+1 (555) 234-8901',
      parentTimezone: parentTz1,
      childName: 'Leo Jenkins',
      childAge: 9,
      childGrade: 'Grade 4',
      subject: 'Scratch',
      startUtc: slot1Start.toISO(),
      endUtc: slot1End.toISO(),
      parentLocalTime: slot1Start.setZone(parentTz1).toFormat("EEEE, MMM dd, yyyy 'at' hh:mm a ZZZZ"),
      mentorId: 'mentor-2',
      mentorName: 'Priya Nair',
      mentorTimezone: 'Asia/Kolkata',
      mentorLocalTime: slot1Start.setZone('Asia/Kolkata').toFormat("EEEE, MMM dd, yyyy 'at' hh:mm a ZZZZ"),
      mentorIstDate: todayStr,
      meetingLink: 'https://meet.codeyoung.com/demo/CY-TR-849201',
      status: 'CONFIRMED',
      createdAt: DateTime.now().toUTC().toISO()
    });

    this.bookings.push({
      id: 'CY-TR-918234',
      parentName: 'Oliver Smith',
      parentEmail: 'oliver.s@example.co.uk',
      parentPhone: '+44 20 7946 0192',
      parentTimezone: parentTz2,
      childName: 'Emma Smith',
      childAge: 12,
      childGrade: 'Grade 7',
      subject: 'Python',
      startUtc: slot2Start.toISO(),
      endUtc: slot2End.toISO(),
      parentLocalTime: slot2Start.setZone(parentTz2).toFormat("EEEE, MMM dd, yyyy 'at' hh:mm a ZZZZ"),
      mentorId: 'mentor-1',
      mentorName: 'Aarav Sharma',
      mentorTimezone: 'Asia/Kolkata',
      mentorLocalTime: slot2Start.setZone('Asia/Kolkata').toFormat("EEEE, MMM dd, yyyy 'at' hh:mm a ZZZZ"),
      mentorIstDate: todayStr,
      meetingLink: 'https://meet.codeyoung.com/demo/CY-TR-918234',
      status: 'CONFIRMED',
      createdAt: DateTime.now().toUTC().toISO()
    });
  }

  getMentors() {
    return this.mentors;
  }

  getMentorById(id) {
    return this.mentors.find(m => m.id === id) || null;
  }

  getBookings() {
    return this.bookings;
  }

  getBookingById(id) {
    return this.bookings.find(b => b.id === id) || null;
  }

  /**
   * Retrieves bookings for a mentor on a specific operational shift date in IST.
   * If a session is between 00:00 and 07:00 IST, it counts toward the previous evening's shift.
   * Crucial for verifying the <= 2 demo classes per day limit across midnight boundaries!
   */
  getMentorBookingsOnShiftDate(mentorId, shiftDateStr) {
    return this.bookings.filter(b => {
      if (b.mentorId !== mentorId || b.status !== 'CONFIRMED') return false;
      const bIstDt = DateTime.fromISO(b.startUtc, { zone: 'utc' }).setZone('Asia/Kolkata');
      const bShiftDate = (bIstDt.hour < 7) 
        ? bIstDt.minus({ days: 1 }).toFormat('yyyy-MM-dd')
        : bIstDt.toFormat('yyyy-MM-dd');
      return bShiftDate === shiftDateStr;
    });
  }

  getMentorBookingsOnIstDate(mentorId, istDateStr) {
    return this.getMentorBookingsOnShiftDate(mentorId, istDateStr);
  }

  /**
   * Checks if mentor has an overlapping booking during the requested [startUtc, endUtc] window.
   */
  hasConflict(mentorId, startUtc, endUtc) {
    const reqStart = DateTime.fromISO(startUtc, { zone: 'utc' }).toMillis();
    const reqEnd = DateTime.fromISO(endUtc, { zone: 'utc' }).toMillis();

    return this.bookings.some(b => {
      if (b.mentorId !== mentorId || b.status !== 'CONFIRMED') return false;
      const bStart = DateTime.fromISO(b.startUtc, { zone: 'utc' }).toMillis();
      const bEnd = DateTime.fromISO(b.endUtc, { zone: 'utc' }).toMillis();

      // Check if intervals overlap: max(start1, start2) < min(end1, end2)
      return Math.max(reqStart, bStart) < Math.min(reqEnd, bEnd);
    });
  }

  addBooking(booking) {
    this.bookings.push(booking);
    return booking;
  }

  addWaitlist(entry) {
    this.waitlist.push(entry);
    return entry;
  }

  getWaitlist() {
    return this.waitlist;
  }

  logNotification(notification) {
    this.notificationLog.unshift(notification);
    if (this.notificationLog.length > 50) {
      this.notificationLog.pop();
    }
  }

  getNotificationLog() {
    return this.notificationLog;
  }

  getNotifications() {
    return this.notificationLog;
  }
}

export const store = new DataStore();
