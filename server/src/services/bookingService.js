import { DateTime } from 'luxon';
import { store } from '../data/store.js';
import { MENTOR_DEFAULT_TIMEZONE } from '../config/timezones.js';
import { timezoneService, isTimeWithinShift, getOperationalShiftDate } from './timezoneService.js';
import { notificationService } from './notificationService.js';

class BookingService {
  /**
   * Core mentor matching & assignment engine.
   * Enforces:
   * 1. Mentor working hours in IST.
   * 2. Collision avoidance (no concurrent sessions for a mentor).
   * 3. HARD LIMIT: At most 2 demo classes per mentor per day (calculated on mentor's operational shift date).
   * 4. Smart load balancing: prioritizes least-loaded mentors.
   */
  async createBooking({
    parentName,
    parentEmail,
    parentPhone = '',
    parentTimezone,
    childName,
    childAge,
    childGrade = '',
    subject,
    startUtc,
    endUtc
  }) {
    // 1. Validate mandatory fields
    if (!parentName || !parentEmail || !childName || !childAge || !subject || !parentTimezone || !startUtc || !endUtc) {
      throw new Error('Missing required booking parameters. Please provide parent, child, subject, and slot details.');
    }

    const startDtUtc = DateTime.fromISO(startUtc, { zone: 'utc' });
    const endDtUtc = DateTime.fromISO(endUtc, { zone: 'utc' });

    if (!startDtUtc.isValid || !endDtUtc.isValid) {
      throw new Error('Invalid UTC slot timestamp provided.');
    }

    // Convert slot to Mentor's IST timezone and operational shift date
    const mentorStart = startDtUtc.setZone(MENTOR_DEFAULT_TIMEZONE);
    const mentorEnd = endDtUtc.setZone(MENTOR_DEFAULT_TIMEZONE);
    const mentorIstDate = getOperationalShiftDate(mentorStart);

    // 2. Query all 10 mentors and evaluate eligibility
    const mentors = store.getMentors();

    const eligibleMentors = mentors.filter(mentor => {
      // Check shift hours in IST (including overnight shifts)
      if (!isTimeWithinShift(mentorStart, mentorEnd, mentor.workingHours.start, mentor.workingHours.end)) {
        return false;
      }

      // Check collision
      if (store.hasConflict(mentor.id, startUtc, endUtc)) {
        return false;
      }

      // Check STRICT 2-demo daily cap
      const bookedToday = store.getMentorBookingsOnIstDate(mentor.id, mentorIstDate);
      if (bookedToday.length >= mentor.maxDemosPerDay) {
        return false;
      }

      return true;
    });

    // 3. Handle Edge Case: No mentors available
    if (eligibleMentors.length === 0) {
      // Find nearest alternate slots on the same date or adjacent day
      const parentDateStr = startDtUtc.setZone(parentTimezone).toFormat('yyyy-MM-dd');
      let suggestedSlots = [];
      try {
        const slotResults = timezoneService.generateAvailableSlots(parentTimezone, parentDateStr, subject);
        suggestedSlots = slotResults.slots.filter(s => s.isAvailable).slice(0, 3);

        // If today has no slots, try tomorrow
        if (suggestedSlots.length === 0) {
          const nextDayStr = startDtUtc.setZone(parentTimezone).plus({ days: 1 }).toFormat('yyyy-MM-dd');
          const nextDayResults = timezoneService.generateAvailableSlots(parentTimezone, nextDayStr, subject);
          suggestedSlots = nextDayResults.slots.filter(s => s.isAvailable).slice(0, 3);
        }
      } catch (err) {
        console.error('Error computing suggested slots:', err);
      }

      return {
        success: false,
        error: 'NO_MENTORS_AVAILABLE',
        message: 'All 10 mentors are either fully booked or have reached their maximum daily capacity of 2 demo classes for this time window.',
        requestedTime: {
          parentLocalTime: startDtUtc.setZone(parentTimezone).toFormat("hh:mm a ZZZZ"),
          mentorLocalTime: mentorStart.toFormat("hh:mm a ZZZZ (yyyy-MM-dd)")
        },
        suggestedSlots,
        canJoinWaitlist: true
      };
    }

    // 4. Smart Matching & Load Balancing:
    // Sort candidate mentors:
    // Criterion A: Mentors with 0 demos booked today get priority over mentors with 1 demo booked
    // Criterion B: Mentors with exact subject specialty match
    // Criterion C: Higher user rating
    eligibleMentors.sort((a, b) => {
      const aDemos = store.getMentorBookingsOnIstDate(a.id, mentorIstDate).length;
      const bDemos = store.getMentorBookingsOnIstDate(b.id, mentorIstDate).length;

      if (aDemos !== bDemos) {
        return aDemos - bDemos; // Least loaded first (0 demos booked first)
      }

      const aHasSubject = a.specialties.includes(subject) ? 1 : 0;
      const bHasSubject = b.specialties.includes(subject) ? 1 : 0;
      if (aHasSubject !== bHasSubject) {
        return bHasSubject - aHasSubject;
      }

      return b.rating - a.rating;
    });

    const assignedMentor = eligibleMentors[0];

    // 5. Generate unique booking and dummy meeting link
    const bookingId = `CY-TR-${Math.floor(100000 + Math.random() * 900000)}`;
    const meetingLink = `https://meet.codeyoung.com/demo/${bookingId}`;

    const parentStartDt = startDtUtc.setZone(parentTimezone);
    const parentLocalTime = parentStartDt.toFormat("EEEE, MMMM dd, yyyy 'at' hh:mm a ZZZZ");
    const mentorLocalTime = mentorStart.toFormat("EEEE, MMMM dd, yyyy 'at' hh:mm a ZZZZ");

    const newBooking = {
      id: bookingId,
      parentName,
      parentEmail,
      parentPhone,
      parentTimezone,
      childName,
      childAge: Number(childAge),
      childGrade,
      subject,
      startUtc,
      endUtc,
      parentLocalTime,
      mentorId: assignedMentor.id,
      mentorName: assignedMentor.name,
      mentorTitle: assignedMentor.title,
      mentorAvatar: assignedMentor.avatar,
      mentorTimezone: MENTOR_DEFAULT_TIMEZONE,
      mentorLocalTime,
      mentorIstDate,
      meetingLink,
      status: 'CONFIRMED',
      createdAt: DateTime.now().toUTC().toISO()
    };

    // 6. Save in store
    store.addBooking(newBooking);

    // 7. Dispatch simulated email notifications
    const emails = notificationService.dispatchBookingNotifications(newBooking, assignedMentor);

    // 8. Generate downloadable .ics calendar invite
    const icsContent = timezoneService.generateIcsCalendar({
      id: bookingId,
      childName,
      subject,
      startUtc,
      endUtc,
      meetingLink,
      parentName,
      mentorName: assignedMentor.name
    });

    return {
      success: true,
      booking: newBooking,
      assignedMentor: {
        id: assignedMentor.id,
        name: assignedMentor.name,
        title: assignedMentor.title,
        avatar: assignedMentor.avatar,
        specialties: assignedMentor.specialties,
        rating: assignedMentor.rating,
        demosBookedToday: store.getMentorBookingsOnIstDate(assignedMentor.id, mentorIstDate).length,
        maxDemosPerDay: assignedMentor.maxDemosPerDay
      },
      emailsSent: emails,
      icsCalendar: icsContent
    };
  }

  /**
   * Adds parent to waitlist if no slots fit their schedule.
   */
  joinWaitlist({ parentName, parentEmail, parentPhone, parentTimezone, childName, childAge, subject, preferredDate, preferredTimeNotes }) {
    const entry = {
      id: `WL-${Date.now()}`,
      parentName,
      parentEmail,
      parentPhone,
      parentTimezone,
      childName,
      childAge,
      subject,
      preferredDate,
      preferredTimeNotes,
      status: 'PENDING_SLOT',
      createdAt: DateTime.now().toUTC().toISO()
    };

    store.addWaitlist(entry);
    return {
      success: true,
      waitlistEntry: entry,
      message: 'You have been placed on Codeyoung’s Priority Waitlist! Our academic coordinator will contact you shortly with custom slot options.'
    };
  }
}

export const bookingService = new BookingService();
