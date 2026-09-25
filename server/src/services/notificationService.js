import { DateTime } from 'luxon';
import { store } from '../data/store.js';

class NotificationService {
  /**
   * Simulates dispatching email communications to both parent and mentor
   * with proper localized timezone information and meeting join links.
   */
  dispatchBookingNotifications(booking, mentor) {
    const parentEmail = {
      id: `email-parent-${booking.id}`,
      recipientType: 'PARENT',
      recipientEmail: booking.parentEmail,
      recipientName: booking.parentName,
      subject: `Confirmed: Codeyoung 1:1 Trial Class for ${booking.childName} with ${mentor.name}!`,
      sentAt: DateTime.now().toUTC().toISO(),
      meetingLink: booking.meetingLink,
      timezone: booking.parentTimezone,
      localDateTime: booking.parentLocalTime,
      htmlBody: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #4f46e5;">Your Codeyoung Trial Class is Confirmed! 🚀</h2>
          <p>Hi <strong>${booking.parentName}</strong>,</p>
          <p>Thank you for booking a trial class with Codeyoung! We have matched <strong>${booking.childName}</strong> (Age ${booking.childAge}) with our experienced STEM mentor, <strong>${mentor.name}</strong>.</p>
          
          <div style="background: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 4px 0;"><strong>📚 Subject:</strong> ${booking.subject}</p>
            <p style="margin: 4px 0;"><strong>⏰ Your Local Time:</strong> ${booking.parentLocalTime}</p>
            <p style="margin: 4px 0;"><strong>🌍 Timezone:</strong> ${booking.parentTimezone}</p>
            <p style="margin: 4px 0;"><strong>👨‍🏫 Mentor:</strong> ${mentor.name} (${mentor.title})</p>
            <p style="margin: 4px 0;"><strong>🔗 Live Class Link:</strong> <a href="${booking.meetingLink}" style="color: #4f46e5; font-weight: bold;">${booking.meetingLink}</a></p>
          </div>

          <p><strong>Class Preparation Tips:</strong></p>
          <ul>
            <li>Please use a laptop or desktop computer with Google Chrome.</li>
            <li>Ensure webcam and microphone permissions are enabled.</li>
            <li>Join the class 5 minutes early to test audio & video.</li>
          </ul>

          <p>Looking forward to inspiring ${booking.childName}'s coding journey!</p>
          <p>Warm regards,<br/><strong>The Codeyoung Team</strong></p>
        </div>
      `
    };

    const istBookedCount = store.getMentorBookingsOnIstDate(mentor.id, booking.mentorIstDate).length;

    const mentorEmail = {
      id: `email-mentor-${booking.id}`,
      recipientType: 'MENTOR',
      recipientEmail: `${mentor.name.toLowerCase().replace(/\s+/g, '.')}@codeyoung.com`,
      recipientName: mentor.name,
      subject: `New Demo Assigned: ${booking.childName} (${booking.subject}) - ${booking.mentorLocalTime}`,
      sentAt: DateTime.now().toUTC().toISO(),
      meetingLink: booking.meetingLink,
      timezone: 'Asia/Kolkata',
      localDateTime: booking.mentorLocalTime,
      htmlBody: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #059669;">New Trial Class Session Assigned 📋</h2>
          <p>Hi <strong>${mentor.name}</strong>,</p>
          <p>A new 1:1 demo session has been booked and assigned to your schedule.</p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 4px 0;"><strong>👶 Student:</strong> ${booking.childName} (Age ${booking.childAge}, ${booking.childGrade})</p>
            <p style="margin: 4px 0;"><strong>📚 Subject:</strong> ${booking.subject}</p>
            <p style="margin: 4px 0;"><strong>⏰ Your IST Schedule:</strong> ${booking.mentorLocalTime}</p>
            <p style="margin: 4px 0;"><strong>🌍 Student's Local Time:</strong> ${booking.parentLocalTime} (${booking.parentTimezone})</p>
            <p style="margin: 4px 0;"><strong>📊 Daily Cap Status:</strong> Demo ${istBookedCount} of 2 for ${booking.mentorIstDate}</p>
            <p style="margin: 4px 0;"><strong>🔗 Classroom Link:</strong> <a href="${booking.meetingLink}" style="color: #059669; font-weight: bold;">${booking.meetingLink}</a></p>
          </div>

          <p>Please review the curriculum module for ${booking.subject} and be ready 5 minutes ahead of the session.</p>
          <p>Best,<br/><strong>Codeyoung Mentorship Operations</strong></p>
        </div>
      `
    };

    store.logNotification(parentEmail);
    store.logNotification(mentorEmail);

    return { parentEmail, mentorEmail };
  }
}

export const notificationService = new NotificationService();
