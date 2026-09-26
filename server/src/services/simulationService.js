import { DateTime } from 'luxon';
import { store } from '../data/store.js';
import { bookingService } from './bookingService.js';
import { timezoneService } from './timezoneService.js';

class SimulationService {
  /**
   * Simulates ~20 parents booking trial classes on a specific date.
   * Demonstrates the capacity limit: 10 mentors * 2 demos = 20 total demos max!
   */
  async run20ParentsSimulation(targetDateStr = null) {
    const mentors = store.getMentors();
    const todayIST = DateTime.now().setZone('Asia/Kolkata');
    const simulationDate = targetDateStr || todayIST.plus({ days: 1 }).toFormat('yyyy-MM-dd');

    const sampleParents = [
      // Shift 1: UK & EMEA (Mentors 1 & 2: 13:00 - 22:00 IST) -> 4 demos max
      { name: 'Claire White', email: 'cwhite@example.co.uk', tz: 'Europe/London', child: 'Oliver', age: 9, subject: 'Math Olympiad', hour: 10 },
      { name: 'George Harris', email: 'gharris@example.co.uk', tz: 'Europe/London', child: 'Ava', age: 13, subject: 'AI for Kids', hour: 11 },
      { name: 'Sophie Clark', email: 'sclark@example.co.uk', tz: 'Europe/London', child: 'Jack', age: 11, subject: 'Python', hour: 12 },
      { name: 'Chloe Scott', email: 'cscott@example.co.uk', tz: 'Europe/London', child: 'Alexander', age: 14, subject: 'Web Development', hour: 13 },

      // Shift 2: UK & US Morning (Mentors 3 & 4: 14:00 - 23:00 IST) -> 4 demos max
      { name: 'Olivia Young', email: 'oyoung@example.co.uk', tz: 'Europe/London', child: 'Benjamin', age: 13, subject: 'Python', hour: 14 },
      { name: 'Harry Potter', email: 'hpotter@example.co.uk', tz: 'Europe/London', child: 'James', age: 10, subject: 'Scratch', hour: 15 },
      { name: 'Michael Brown', email: 'mbrown@example.com', tz: 'America/New_York', child: 'Lucas', age: 8, subject: 'Scratch', hour: 9 },
      { name: 'Jessica Taylor', email: 'jtaylor@example.com', tz: 'America/New_York', child: 'Sophia', age: 11, subject: 'Python', hour: 10 },

      // Shift 3: US Prime Evening (Mentors 5, 6, 7, 8: 18:00 - 03:00 IST) -> 8 demos max
      { name: 'David Wilson', email: 'dwilson@example.com', tz: 'America/New_York', child: 'Ethan', age: 9, subject: 'Scratch', hour: 11 },
      { name: 'Emily Davis', email: 'edavis@example.com', tz: 'America/New_York', child: 'Chloe', age: 14, subject: 'Web Development', hour: 12 },
      { name: 'Daniel Lewis', email: 'dlewis@example.com', tz: 'America/New_York', child: 'Harper', age: 8, subject: 'Scratch', hour: 13 },
      { name: 'Megan Robinson', email: 'mrobinson@example.com', tz: 'America/New_York', child: 'Mason', age: 15, subject: 'Web Development', hour: 14 },
      { name: 'Matthew Walker', email: 'mwalker@example.com', tz: 'America/Chicago', child: 'Ella', age: 10, subject: 'Math Olympiad', hour: 11 },
      { name: 'James Martinez', email: 'jmartinez@example.com', tz: 'America/Chicago', child: 'Liam', age: 7, subject: 'Scratch', hour: 12 },
      { name: 'Grace King', email: 'gking@example.com', tz: 'America/Chicago', child: 'Henry', age: 8, subject: 'Scratch', hour: 13 },
      { name: 'Hannah Hall', email: 'hhall@example.com', tz: 'America/Denver', child: 'Jackson', age: 12, subject: 'Robotics', hour: 12 },

      // Shift 4: US West Coast & Late Night (Mentors 9 & 10: 21:00 - 06:00 IST) -> 4 demos max
      { name: 'Amanda Anderson', email: 'aanderson@example.com', tz: 'America/Los_Angeles', child: 'Mia', age: 12, subject: 'Python', hour: 11 },
      { name: 'Robert Thomas', email: 'rthomas@example.com', tz: 'America/Los_Angeles', child: 'Noah', age: 10, subject: 'Robotics', hour: 12 },
      { name: 'Andrew Allen', email: 'aallen@example.com', tz: 'America/Los_Angeles', child: 'Aria', age: 9, subject: 'Scratch', hour: 13 },
      { name: 'Nathan Wright', email: 'nwright@example.com', tz: 'Europe/London', child: 'Zoe', age: 11, subject: 'Python', hour: 16 },

      // 21st parent to test cap overflow and rejection handling
      { name: 'Victoria Adams', email: 'vadams@example.com', tz: 'America/New_York', child: 'Daniel', age: 10, subject: 'Python', hour: 16 }
    ];

    const results = [];
    let successfulCount = 0;
    let rejectedCount = 0;

    for (const p of sampleParents) {
      const parentStart = DateTime.fromISO(simulationDate, { zone: p.tz })
        .set({ hour: p.hour, minute: 0, second: 0, millisecond: 0 });
      const parentEnd = parentStart.plus({ minutes: 60 });

      const bookingOutcome = await bookingService.createBooking({
        parentName: p.name,
        parentEmail: p.email,
        parentPhone: '+1-555-0199',
        parentTimezone: p.tz,
        childName: p.child,
        childAge: p.age,
        childGrade: `Grade ${p.age - 5}`,
        subject: p.subject,
        startUtc: parentStart.toUTC().toISO(),
        endUtc: parentEnd.toUTC().toISO()
      });

      if (bookingOutcome.success) {
        successfulCount++;
        results.push({
          parentName: p.name,
          childName: p.child,
          subject: p.subject,
          status: 'SUCCESS',
          assignedMentor: bookingOutcome.assignedMentor.name,
          bookingId: bookingOutcome.booking.id,
          parentLocalTime: bookingOutcome.booking.parentLocalTime,
          mentorLocalTime: bookingOutcome.booking.mentorLocalTime
        });
      } else {
        rejectedCount++;
        results.push({
          parentName: p.name,
          childName: p.child,
          subject: p.subject,
          status: 'REJECTED_CAP_REACHED',
          reason: bookingOutcome.message,
          suggestedSlotsCount: bookingOutcome.suggestedSlots ? bookingOutcome.suggestedSlots.length : 0
        });
      }
    }

    // Tally mentor distribution
    const mentorUsage = mentors.map(m => {
      const bookings = store.getMentorBookingsOnIstDate(m.id, simulationDate);
      return {
        mentorId: m.id,
        name: m.name,
        demosBooked: bookings.length,
        maxDemos: m.maxDemosPerDay,
        capReached: bookings.length >= m.maxDemosPerDay
      };
    });

    return {
      simulationDate,
      totalAttempted: sampleParents.length,
      successfulBookings: successfulCount,
      rejectedOrWaitlisted: rejectedCount,
      systemCapacityDailyMax: 20, // 10 mentors * 2 demos
      mentorUsageSummary: mentorUsage,
      log: results
    };
  }
}

export const simulationService = new SimulationService();
