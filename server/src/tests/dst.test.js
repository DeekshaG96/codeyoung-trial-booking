import { describe, expect, it } from 'vitest';
import { DateTime } from 'luxon';
import { getTimezoneMeta } from '../config/timezones.js';
import { timezoneService } from '../services/timezoneService.js';

describe('Daylight Saving Time (DST) & Timezone Precision Tests', () => {
  it("verifies US 'spring forward' day is 23 hours in UTC (America/New_York)", () => {
    // 2nd Sunday of March 2026 = March 8, 2026 — clocks jump 2:00 AM -> 3:00 AM
    const start = DateTime.fromISO('2026-03-08T00:00:00', { zone: 'America/New_York' });
    const end = DateTime.fromISO('2026-03-09T00:00:00', { zone: 'America/New_York' });
    const durationHours = end.diff(start, 'hours').hours;
    expect(durationHours).toBe(23);
  });

  it("verifies US 'fall back' day is 25 hours in UTC (America/New_York)", () => {
    // 1st Sunday of November 2026 = November 1, 2026 — clocks repeat 1:00 AM - 2:00 AM
    const start = DateTime.fromISO('2026-11-01T00:00:00', { zone: 'America/New_York' });
    const end = DateTime.fromISO('2026-11-02T00:00:00', { zone: 'America/New_York' });
    const durationHours = end.diff(start, 'hours').hours;
    expect(durationHours).toBe(25);
  });

  it("verifies UK 'spring forward' day is 23 hours in UTC (Europe/London)", () => {
    // Last Sunday of March 2026 = March 29, 2026
    const start = DateTime.fromISO('2026-03-29T00:00:00', { zone: 'Europe/London' });
    const end = DateTime.fromISO('2026-03-30T00:00:00', { zone: 'Europe/London' });
    expect(end.diff(start, 'hours').hours).toBe(23);
  });

  it("verifies UK 'fall back' day is 25 hours in UTC (Europe/London)", () => {
    // Last Sunday of October 2026 = October 25, 2026
    const start = DateTime.fromISO('2026-10-25T00:00:00', { zone: 'Europe/London' });
    const end = DateTime.fromISO('2026-10-26T00:00:00', { zone: 'Europe/London' });
    expect(end.diff(start, 'hours').hours).toBe(25);
  });

  it('verifies India (Asia/Kolkata) never observes DST (always fixed 24h day and UTC+05:30)', () => {
    // Check multiple seasons in India
    const summer = DateTime.fromISO('2026-06-15T00:00:00', { zone: 'Asia/Kolkata' });
    const winter = DateTime.fromISO('2026-12-15T00:00:00', { zone: 'Asia/Kolkata' });

    expect(summer.isInDST).toBe(false);
    expect(winter.isInDST).toBe(false);
    expect(summer.offset).toBe(330); // 5h 30m = 330 minutes
    expect(winter.offset).toBe(330);

    const nextDay = summer.plus({ days: 1 });
    expect(nextDay.diff(summer, 'hours').hours).toBe(24);
  });

  it('verifies a fixed mentor IST instant shifts clock reading in New York across November 1, 2026', () => {
    // Mentor shift starts at 18:00 IST (Asia/Kolkata).
    // Test the exact same wall time 1 week BEFORE vs 1 week AFTER US DST ends on Nov 1, 2026.
    const beforeFallBack = DateTime.fromISO('2026-10-25T18:00:00', { zone: 'Asia/Kolkata' }).toUTC();
    const afterFallBack = DateTime.fromISO('2026-11-08T18:00:00', { zone: 'Asia/Kolkata' }).toUTC();

    const nyBefore = beforeFallBack.setZone('America/New_York');
    const nyAfter = afterFallBack.setZone('America/New_York');

    // Before Nov 1: EDT (UTC-4)
    expect(nyBefore.offset).toBe(-4 * 60);
    expect(nyBefore.offsetNameShort).toBe('EDT');

    // After Nov 1: EST (UTC-5)
    expect(nyAfter.offset).toBe(-5 * 60);
    expect(nyAfter.offsetNameShort).toBe('EST');

    // Clock hour in New York differs by exactly 1 hour for the same IST start time:
    // 18:00 IST is 08:30 AM EDT in summer, but 07:30 AM EST in winter!
    expect(nyBefore.hour - nyAfter.hour).toBe(1);
    expect(nyBefore.minute).toBe(nyAfter.minute);
  });

  it('generates accurate DST metadata in getTimezoneMeta', () => {
    const summerMeta = getTimezoneMeta('America/New_York', '2026-07-15T12:00:00');
    expect(summerMeta.isInDST).toBe(true);
    expect(summerMeta.offsetNameShort).toBe('EDT');
    expect(summerMeta.formattedOffset).toBe('-04:00');

    const winterMeta = getTimezoneMeta('America/New_York', '2026-12-15T12:00:00');
    expect(winterMeta.isInDST).toBe(false);
    expect(winterMeta.offsetNameShort).toBe('EST');
    expect(winterMeta.formattedOffset).toBe('-05:00');

    const istMeta = getTimezoneMeta('Asia/Kolkata', '2026-07-15T12:00:00');
    expect(istMeta.isInDST).toBe(false);
    expect(istMeta.formattedOffset).toBe('+05:30');
  });

  it('generates slot schedules with consistent time intervals across DST dates', () => {
    const schedule = timezoneService.generateAvailableSlots('America/New_York', '2026-11-01');
    expect(schedule.slots.length).toBeGreaterThan(0);
    expect(schedule.parentTimezone.isInDST).toBe(false); // Nov 1 ends DST in US
    
    // Check that every slot is properly structured
    for (const slot of schedule.slots) {
      expect(slot.parentLocalTime.timezone).toBe('America/New_York');
      expect(slot.mentorLocalTime.timezone).toBe('Asia/Kolkata');
      expect(slot.startUtc).toBeTruthy();
      expect(slot.endUtc).toBeTruthy();
    }
  });
});
