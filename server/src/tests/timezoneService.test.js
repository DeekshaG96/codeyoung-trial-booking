import { describe, expect, it } from 'vitest';
import { timezoneService } from '../services/timezoneService.js';
import { getTimezoneMeta, SUPPORTED_TIMEZONES } from '../config/timezones.js';

describe('TimezoneService & Calendar Generation Tests', () => {
  it('generates valid available slots with complete dual-timezone metadata', () => {
    const result = timezoneService.generateAvailableSlots('America/New_York', '2026-10-15');

    expect(result.date).toBe('2026-10-15');
    expect(result.parentTimezone.zoneId).toBe('America/New_York');
    expect(result.mentorTimezone.zoneId).toBe('Asia/Kolkata');
    expect(Array.isArray(result.slots)).toBe(true);
    expect(result.slots.length).toBeGreaterThan(0);

    const firstSlot = result.slots[0];
    expect(firstSlot.parentLocalTime).toBeDefined();
    expect(firstSlot.parentLocalTime.timezone).toBe('America/New_York');
    expect(firstSlot.mentorLocalTime).toBeDefined();
    expect(firstSlot.mentorLocalTime.timezone).toBe('Asia/Kolkata');
    expect(firstSlot.capacityStatus).toBeDefined();
  });

  it('throws an error when invalid date string format is provided', () => {
    expect(() => {
      timezoneService.generateAvailableSlots('America/New_York', 'invalid-date');
    }).toThrow('Invalid date format provided');
  });

  it('filters candidate mentors by subject specialty when specified', () => {
    const pythonSlots = timezoneService.generateAvailableSlots('America/New_York', '2026-10-15', 'Python');
    const roboticsSlots = timezoneService.generateAvailableSlots('America/New_York', '2026-10-15', 'Robotics');

    expect(pythonSlots.slots.length).toBeGreaterThan(0);
    expect(roboticsSlots.slots.length).toBeGreaterThan(0);
  });

  it('generates valid RFC 5545 compliant .ics iCalendar file content', () => {
    const icsContent = timezoneService.generateIcsCalendar({
      id: 'CY-TR-998877',
      childName: 'Emma',
      subject: 'Python',
      startUtc: '2026-10-15T19:00:00.000Z',
      endUtc: '2026-10-15T20:00:00.000Z',
      meetingLink: 'https://meet.codeyoung.com/demo/CY-TR-998877',
      parentName: 'Sarah Jenkins',
      mentorName: 'Aarav Sharma'
    });

    expect(icsContent).toContain('BEGIN:VCALENDAR');
    expect(icsContent).toContain('VERSION:2.0');
    expect(icsContent).toContain('BEGIN:VEVENT');
    expect(icsContent).toContain('UID:CY-TR-998877@codeyoung.com');
    expect(icsContent).toContain('SUMMARY:Codeyoung 1:1 Live Trial Class - Emma (Python)');
    expect(icsContent).toContain('URL:https://meet.codeyoung.com/demo/CY-TR-998877');
    expect(icsContent).toContain('LOCATION:Codeyoung Virtual Live Classroom');
    expect(icsContent).toContain('END:VEVENT');
    expect(icsContent).toContain('END:VCALENDAR');
  });

  it('resolves metadata for all supported international timezones', () => {
    for (const zone of SUPPORTED_TIMEZONES) {
      const meta = getTimezoneMeta(zone.id);
      expect(meta.zoneId).toBe(zone.id);
      expect(meta.formattedOffset).toMatch(/^[+-]\d{2}:\d{2}$/);
      expect(typeof meta.isInDST).toBe('boolean');
    }
  });
});
