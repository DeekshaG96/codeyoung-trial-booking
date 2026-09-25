import { DateTime } from 'luxon';
import { getTimezoneMeta, MENTOR_DEFAULT_TIMEZONE } from '../config/timezones.js';
import { store } from '../data/store.js';

/**
 * Calculates the operational shift date for a mentor.
 * If a session occurs between 00:00 and 07:00 AM IST, it belongs to the previous evening's
 * night shift (e.g. Saturday 18:00 - Sunday 03:00 belongs to the Saturday shift).
 * This prevents a mentor from taking 2 demos before midnight and 2 demos after midnight in one shift!
 */
export function getOperationalShiftDate(dtInIST) {
  if (dtInIST.hour < 7) {
    return dtInIST.minus({ days: 1 }).toFormat('yyyy-MM-dd');
  }
  return dtInIST.toFormat('yyyy-MM-dd');
}

/**
 * Determines whether a time slot in IST falls within a mentor's shift (including overnight shifts).
 */
export function isTimeWithinShift(startDt, endDt, shiftStartStr, shiftEndStr) {
  const [sH, sM] = shiftStartStr.split(':').map(Number);
  const [eH, eM] = shiftEndStr.split(':').map(Number);
  
  const startMin = startDt.hour * 60 + startDt.minute;
  const endMin = (endDt.hour === 0 && endDt.minute === 0) ? 24 * 60 : endDt.hour * 60 + endDt.minute;
  const shiftStartMin = sH * 60 + sM;
  const shiftEndMin = eH * 60 + eM;

  if (shiftStartMin <= shiftEndMin) {
    return startMin >= shiftStartMin && endMin <= shiftEndMin;
  } else {
    // Overnight shift, e.g. 18:00 (1080 min) to 03:00 (180 min next morning)
    const startValid = startMin >= shiftStartMin || startMin < shiftEndMin;
    const endValid = endMin <= shiftEndMin || endMin >= shiftStartMin;
    return startValid && endValid;
  }
}

/**
 * Service handling all timezone transformations, slot generation,
 * Daylight Saving Time (DST) detection, and iCalendar formatting.
 */
class TimezoneService {
  /**
   * Generates prospective 60-minute trial class slots for a given parent timezone and date.
   * Cross-references against all 10 mentors' working hours (IST), existing bookings,
   * and the strict 2-demo daily limit.
   */
  generateAvailableSlots(parentTz, dateStr, subject = null) {
    const parentMeta = getTimezoneMeta(parentTz, `${dateStr}T12:00:00`);
    const mentors = store.getMentors();

    // Standard booking hours comfortable for parents: 08:00 to 21:00 local time
    const startHour = 8;
    const endHour = 21;
    const slotDurationMinutes = 60;

    const slots = [];

    // Parse the parent's requested date
    const baseDate = DateTime.fromISO(dateStr, { zone: parentTz });
    if (!baseDate.isValid) {
      throw new Error(`Invalid date format provided: ${dateStr}. Expected YYYY-MM-DD.`);
    }

    const nowUtc = DateTime.now().toUTC();

    for (let hour = startHour; hour <= endHour; hour++) {
      const parentStart = baseDate.set({ hour, minute: 0, second: 0, millisecond: 0 });
      const parentEnd = parentStart.plus({ minutes: slotDurationMinutes });

      const startUtc = parentStart.toUTC();
      const endUtc = parentEnd.toUTC();

      // Skip past slots if booking for today
      if (startUtc < nowUtc) {
        continue;
      }

      // Convert slot to Mentor's timezone (Asia/Kolkata)
      const mentorStart = startUtc.setZone(MENTOR_DEFAULT_TIMEZONE);
      const mentorEnd = endUtc.setZone(MENTOR_DEFAULT_TIMEZONE);
      const mentorIstDate = getOperationalShiftDate(mentorStart);
      const rawIstDate = mentorStart.toFormat('yyyy-MM-dd');

      // Check whether mentor date differs from parent date (calendar day shift)
      const parentDateStr = parentStart.toFormat('yyyy-MM-dd');
      const isDayShift = rawIstDate !== parentDateStr;

      // Evaluate mentor availability for this slot
      const candidateMentors = mentors.filter(mentor => {
        // Filter by subject if requested and specified
        if (subject && mentor.specialties && !mentor.specialties.includes(subject)) {
          const hasMatchingSpecialty = mentor.specialties.some(s => 
            s.toLowerCase().includes(subject.toLowerCase()) || subject.toLowerCase().includes(s.toLowerCase())
          );
          if (!hasMatchingSpecialty && subject !== 'All') {
            return false;
          }
        }

        // 1. Check Mentor Working Hours in IST (handles overnight shifts)
        if (!isTimeWithinShift(mentorStart, mentorEnd, mentor.workingHours.start, mentor.workingHours.end)) {
          return false;
        }

        // 2. Check collision with existing bookings
        if (store.hasConflict(mentor.id, startUtc.toISO(), endUtc.toISO())) {
          return false;
        }

        // 3. Check HARD RULE: Mentor has at most 2 demo classes on this IST date
        const bookedOnIstDate = store.getMentorBookingsOnIstDate(mentor.id, mentorIstDate);
        if (bookedOnIstDate.length >= mentor.maxDemosPerDay) {
          return false;
        }

        return true;
      });

      const isAvailable = candidateMentors.length > 0;

      slots.push({
        id: `slot-${parentStart.toFormat('yyyyMMdd-HHmm')}`,
        startUtc: startUtc.toISO(),
        endUtc: endUtc.toISO(),
        parentLocalTime: {
          formattedTime: parentStart.toFormat('hh:mm a'),
          formattedEndTime: parentEnd.toFormat('hh:mm a'),
          displayString: `${parentStart.toFormat('hh:mm a')} - ${parentEnd.toFormat('hh:mm a')}`,
          timezone: parentTz,
          offsetName: parentStart.offsetNameShort,
          isInDST: parentStart.isInDST,
          utcOffset: parentStart.toFormat('ZZ')
        },
        mentorLocalTime: {
          formattedTime: mentorStart.toFormat('hh:mm a'),
          formattedEndTime: mentorEnd.toFormat('hh:mm a'),
          displayString: `${mentorStart.toFormat('hh:mm a')} - ${mentorEnd.toFormat('hh:mm a')} IST`,
          timezone: MENTOR_DEFAULT_TIMEZONE,
          istDate: mentorIstDate,
          isNextDay: isDayShift,
          dayOffsetNote: isDayShift ? '(Next Day in India)' : '(Same Day in India)'
        },
        availableMentorsCount: candidateMentors.length,
        candidateMentorIds: candidateMentors.map(m => m.id),
        isAvailable,
        capacityStatus: isAvailable 
          ? (candidateMentors.length <= 2 ? 'LIMITED_AVAILABILITY' : 'AVAILABLE')
          : 'FULLY_BOOKED'
      });
    }

    return {
      date: dateStr,
      parentTimezone: parentMeta,
      mentorTimezone: getTimezoneMeta(MENTOR_DEFAULT_TIMEZONE, `${dateStr}T12:00:00`),
      totalSlots: slots.length,
      availableSlotsCount: slots.filter(s => s.isAvailable).length,
      slots
    };
  }

  /**
   * Generates downloadable .ics calendar invite content
   */
  generateIcsCalendar({ id, childName, subject, startUtc, endUtc, meetingLink, parentName, mentorName }) {
    const dtStart = DateTime.fromISO(startUtc, { zone: 'utc' }).toFormat("yyyyMMdd'T'HHmmss'Z'");
    const dtEnd = DateTime.fromISO(endUtc, { zone: 'utc' }).toFormat("yyyyMMdd'T'HHmmss'Z'");
    const dtStamp = DateTime.now().toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Codeyoung//Trial Class Appointment Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${id}@codeyoung.com`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:Codeyoung 1:1 Live Trial Class - ${childName} (${subject})`,
      `DESCRIPTION:Your 1:1 interactive trial class with mentor ${mentorName}. Join live classroom at ${meetingLink}`,
      `URL:${meetingLink}`,
      'LOCATION:Codeyoung Virtual Live Classroom',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }
}

export const timezoneService = new TimezoneService();
