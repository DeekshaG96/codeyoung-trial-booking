import { DateTime } from 'luxon';
import { store } from '../data/store.js';
import { MENTOR_DEFAULT_TIMEZONE } from '../config/timezones.js';

class MentorService {
  /**
   * Retrieves all 10 mentors enriched with daily capacity stats for a given IST date.
   */
  getMentorsWithDailyStats(queryDateStr = null) {
    const targetIstDate = queryDateStr || DateTime.now().setZone(MENTOR_DEFAULT_TIMEZONE).toFormat('yyyy-MM-dd');
    const mentors = store.getMentors();

    return mentors.map(mentor => {
      const bookedOnDate = store.getMentorBookingsOnIstDate(mentor.id, targetIstDate);
      const bookedCount = bookedOnDate.length;
      const remainingQuota = Math.max(0, mentor.maxDemosPerDay - bookedCount);
      const isCapacityReached = bookedCount >= mentor.maxDemosPerDay;

      let statusBadge = 'Available';
      if (isCapacityReached) {
        statusBadge = 'Fully Booked (2/2 Demos)';
      } else if (bookedCount === 1) {
        statusBadge = '1 Demo Assigned (1 Remaining)';
      }

      return {
        ...mentor,
        targetIstDate,
        demosBookedToday: bookedCount,
        maxDemosPerDay: mentor.maxDemosPerDay,
        remainingQuota,
        isCapacityReached,
        statusBadge,
        todayBookings: bookedOnDate.map(b => ({
          bookingId: b.id,
          childName: b.childName,
          childAge: b.childAge,
          subject: b.subject,
          parentName: b.parentName,
          parentEmail: b.parentEmail,
          parentTimezone: b.parentTimezone,
          startUtc: b.startUtc,
          endUtc: b.endUtc,
          mentorLocalTime: b.mentorLocalTime,
          parentLocalTime: b.parentLocalTime,
          meetingLink: b.meetingLink
        }))
      };
    });
  }

  /**
   * Detailed schedule for a specific mentor across dates.
   */
  getMentorSchedule(mentorId, queryDateStr = null, viewTimezone = MENTOR_DEFAULT_TIMEZONE) {
    const mentor = store.getMentorById(mentorId);
    if (!mentor) {
      throw new Error(`Mentor not found with ID: ${mentorId}`);
    }

    const targetIstDate = queryDateStr || DateTime.now().setZone(MENTOR_DEFAULT_TIMEZONE).toFormat('yyyy-MM-dd');
    const bookedOnDate = store.getMentorBookingsOnIstDate(mentor.id, targetIstDate);

    // Format bookings in the requested view timezone
    const formattedSessions = bookedOnDate.map(b => {
      const startDt = DateTime.fromISO(b.startUtc, { zone: 'utc' }).setZone(viewTimezone);
      const endDt = DateTime.fromISO(b.endUtc, { zone: 'utc' }).setZone(viewTimezone);

      return {
        ...b,
        viewTimezone,
        displaySlotTime: `${startDt.toFormat('hh:mm a')} - ${endDt.toFormat('hh:mm a')} (${startDt.offsetNameShort})`,
        displayDate: startDt.toFormat('EEEE, MMMM dd, yyyy')
      };
    });

    return {
      mentor: {
        id: mentor.id,
        name: mentor.name,
        title: mentor.title,
        avatar: mentor.avatar,
        timezone: mentor.timezone,
        workingHours: mentor.workingHours,
        maxDemosPerDay: mentor.maxDemosPerDay
      },
      queryDate: targetIstDate,
      viewTimezone,
      demosBooked: bookedOnDate.length,
      maxDemosPerDay: mentor.maxDemosPerDay,
      capacityReached: bookedOnDate.length >= mentor.maxDemosPerDay,
      sessions: formattedSessions
    };
  }
}

export const mentorService = new MentorService();
