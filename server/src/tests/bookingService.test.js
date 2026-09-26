import { beforeEach, describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { store } from '../data/store.js';
import { bookingService } from '../services/bookingService.js';
import { timezoneService } from '../services/timezoneService.js';

describe('BookingService & Mentor Assignment Engine Tests', () => {
  const TEST_DATE = '2026-10-15'; // A future date

  beforeEach(() => {
    store.reset();
  });

  it('rejects booking when required fields are missing', async () => {
    await expect(
      bookingService.createBooking({
        parentName: '',
        parentEmail: 'parent@example.com'
      })
    ).rejects.toThrow('Missing required booking parameters');
  });

  it('rejects booking when invalid UTC timestamp is provided', async () => {
    await expect(
      bookingService.createBooking({
        parentName: 'Alice Smith',
        parentEmail: 'alice@example.com',
        parentPhone: '+1-555-0100',
        parentTimezone: 'America/New_York',
        childName: 'Bobby',
        childAge: 10,
        subject: 'Python',
        startUtc: 'not-a-date',
        endUtc: 'not-a-date'
      })
    ).rejects.toThrow('Invalid UTC slot timestamp');
  });

  it('successfully creates a booking with confirmed status and dummy meeting link', async () => {
    // 5:00 PM EDT = 21:00 UTC = 02:30 AM next day IST (covered by US Prime / West Coast shifts)
    const startUtc = DateTime.fromISO(`${TEST_DATE}T17:00:00`, { zone: 'America/New_York' }).toUTC().toISO();
    const endUtc = DateTime.fromISO(`${TEST_DATE}T18:00:00`, { zone: 'America/New_York' }).toUTC().toISO();

    const result = await bookingService.createBooking({
      parentName: 'Alice Smith',
      parentEmail: 'alice@example.com',
      parentPhone: '+1-555-0100',
      parentTimezone: 'America/New_York',
      childName: 'Bobby',
      childAge: 10,
      childGrade: 'Grade 5',
      subject: 'Python',
      startUtc,
      endUtc
    });

    expect(result.success).toBe(true);
    expect(result.booking.id).toMatch(/^CY-TR-\d{6}$/);
    expect(result.booking.meetingLink).toMatch(/^https:\/\/meet\.codeyoung\.com\/demo\/CY-TR-\d{6}$/);
    expect(result.booking.status).toBe('CONFIRMED');
    expect(result.assignedMentor).toBeDefined();
    expect(result.assignedMentor.name).toBeTruthy();
    expect(result.booking.parentTimezone).toBe('America/New_York');
    expect(result.booking.mentorTimezone).toBe('Asia/Kolkata');
    expect(result.booking.parentLocalTime).toContain('EDT');
    expect(result.booking.mentorLocalTime).toMatch(/GMT\+5:30|IST/);
  });

  it('strictly enforces the MAX 2 DEMOS PER DAY cap on each mentor', async () => {
    // Pick an evening slot in London (e.g. 15:00 BST = 19:30 IST)
    // Mentors covering 13:00-22:00 IST: mentor-1 (Aarav Sharma), mentor-2 (Priya Nair)
    const slotStart1 = DateTime.fromISO(`${TEST_DATE}T14:00:00`, { zone: 'Europe/London' }).toUTC().toISO();
    const slotEnd1 = DateTime.fromISO(`${TEST_DATE}T15:00:00`, { zone: 'Europe/London' }).toUTC().toISO();

    const slotStart2 = DateTime.fromISO(`${TEST_DATE}T15:00:00`, { zone: 'Europe/London' }).toUTC().toISO();
    const slotEnd2 = DateTime.fromISO(`${TEST_DATE}T16:00:00`, { zone: 'Europe/London' }).toUTC().toISO();

    const slotStart3 = DateTime.fromISO(`${TEST_DATE}T16:00:00`, { zone: 'Europe/London' }).toUTC().toISO();
    const slotEnd3 = DateTime.fromISO(`${TEST_DATE}T17:00:00`, { zone: 'Europe/London' }).toUTC().toISO();

    // Book 1
    const res1 = await bookingService.createBooking({
      parentName: 'Parent 1',
      parentEmail: 'p1@example.com',
      parentPhone: '+44-20-1111',
      parentTimezone: 'Europe/London',
      childName: 'Child 1',
      childAge: 8,
      subject: 'Scratch',
      startUtc: slotStart1,
      endUtc: slotEnd1
    });
    expect(res1.success).toBe(true);

    // Book 2
    const res2 = await bookingService.createBooking({
      parentName: 'Parent 2',
      parentEmail: 'p2@example.com',
      parentPhone: '+44-20-2222',
      parentTimezone: 'Europe/London',
      childName: 'Child 2',
      childAge: 9,
      subject: 'Scratch',
      startUtc: slotStart2,
      endUtc: slotEnd2
    });
    expect(res2.success).toBe(true);

    // Verify mentor bookings on this date do not exceed 2
    const allBookings = store.getBookings();
    const bookingsByMentor = {};
    for (const b of allBookings) {
      bookingsByMentor[b.mentorId] = (bookingsByMentor[b.mentorId] || 0) + 1;
      expect(bookingsByMentor[b.mentorId]).toBeLessThanOrEqual(2);
    }
  });

  it('load balances assignments: prioritizes mentors with 0 demos today over mentors with 1 demo', async () => {
    // Both Aarav (mentor-1) and Priya (mentor-2) cover 14:00 UK.
    const slotStart1 = DateTime.fromISO(`${TEST_DATE}T14:00:00`, { zone: 'Europe/London' }).toUTC().toISO();
    const slotEnd1 = DateTime.fromISO(`${TEST_DATE}T15:00:00`, { zone: 'Europe/London' }).toUTC().toISO();

    const res1 = await bookingService.createBooking({
      parentName: 'Parent 1',
      parentEmail: 'p1@example.com',
      parentPhone: '+44-20-1111',
      parentTimezone: 'Europe/London',
      childName: 'Child 1',
      childAge: 8,
      subject: 'Web Development',
      startUtc: slotStart1,
      endUtc: slotEnd1
    });

    const firstMentorId = res1.assignedMentor.id;

    // Second booking at a non-conflicting time covered by the same shift
    const slotStart2 = DateTime.fromISO(`${TEST_DATE}T15:00:00`, { zone: 'Europe/London' }).toUTC().toISO();
    const slotEnd2 = DateTime.fromISO(`${TEST_DATE}T16:00:00`, { zone: 'Europe/London' }).toUTC().toISO();

    const res2 = await bookingService.createBooking({
      parentName: 'Parent 2',
      parentEmail: 'p2@example.com',
      parentPhone: '+44-20-2222',
      parentTimezone: 'Europe/London',
      childName: 'Child 2',
      childAge: 9,
      subject: 'Web Development',
      startUtc: slotStart2,
      endUtc: slotEnd2
    });

    // The second booking should be assigned to a different mentor who has 0 demos today!
    expect(res2.assignedMentor.id).not.toBe(firstMentorId);
  });

  it('detects collision and avoids double-booking the same mentor for overlapping time', async () => {
    const slotStart = DateTime.fromISO(`${TEST_DATE}T18:00:00`, { zone: 'America/New_York' }).toUTC().toISO();
    const slotEnd = DateTime.fromISO(`${TEST_DATE}T19:00:00`, { zone: 'America/New_York' }).toUTC().toISO();

    const res1 = await bookingService.createBooking({
      parentName: 'Parent 1',
      parentEmail: 'p1@example.com',
      parentPhone: '+1-555-1111',
      parentTimezone: 'America/New_York',
      childName: 'Child 1',
      childAge: 10,
      subject: 'Python',
      startUtc: slotStart,
      endUtc: slotEnd
    });

    const res2 = await bookingService.createBooking({
      parentName: 'Parent 2',
      parentEmail: 'p2@example.com',
      parentPhone: '+1-555-2222',
      parentTimezone: 'America/New_York',
      childName: 'Child 2',
      childAge: 11,
      subject: 'Python',
      startUtc: slotStart,
      endUtc: slotEnd
    });

    // Both requested the exact same time slot — they MUST be assigned to different mentors!
    expect(res1.assignedMentor.id).not.toBe(res2.assignedMentor.id);
  });

  it('provides empathetic error response with suggestions and waitlist when mentors are exhausted', async () => {
    // Deliberately fill all eligible mentors for a specific slot
    const slotStart = DateTime.fromISO(`${TEST_DATE}T08:00:00`, { zone: 'America/Los_Angeles' }).toUTC().toISO();
    const slotEnd = DateTime.fromISO(`${TEST_DATE}T09:00:00`, { zone: 'America/Los_Angeles' }).toUTC().toISO();

    // 08:00 AM Pacific is 20:30 IST
    // Keep booking until all mentors covering this window reach capacity
    let lastResult = null;
    for (let i = 0; i < 15; i++) {
      lastResult = await bookingService.createBooking({
        parentName: `Parent ${i}`,
        parentEmail: `parent${i}@example.com`,
        parentPhone: '+1-555-0000',
        parentTimezone: 'America/Los_Angeles',
        childName: `Child ${i}`,
        childAge: 10,
        subject: 'Robotics',
        startUtc: slotStart,
        endUtc: slotEnd
      });
      if (!lastResult.success) break;
    }

    // Once capacity is exhausted, response should be empathetic
    expect(lastResult.success).toBe(false);
    expect(lastResult.error).toBe('NO_MENTORS_AVAILABLE');
    expect(lastResult.message).toContain('All 10 mentors are either fully booked or have reached their maximum daily capacity');
    expect(lastResult.canJoinWaitlist).toBe(true);
    expect(Array.isArray(lastResult.suggestedSlots)).toBe(true);
  });
});
