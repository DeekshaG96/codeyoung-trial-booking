import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Video, Calendar, Copy, Check, ExternalLink, 
  Clock, MapPin, Mail, Sparkles, Star, UserCheck 
} from 'lucide-react';

export default function BookingSuccess({ 
  bookingData, 
  assignedMentor, 
  onEnterClassroom, 
  onOpenEmails,
  onReset 
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Trigger celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti effect triggered');
    }
  }, []);

  const handleCopyLink = () => {
    if (bookingData?.meetingLink) {
      navigator.clipboard.writeText(bookingData.meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadCalendar = () => {
    if (bookingData?.id) {
      window.location.href = `/api/bookings/${bookingData.id}/calendar.ics`;
    }
  };

  return (
    <div className="success-card" id="booking-success-view">
      {/* Icon Badge */}
      <div className="success-icon-badge">
        <CheckCircle2 size={44} />
      </div>

      <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
        Trial Class Confirmed! 🎉
      </h2>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px auto' }}>
        We have assigned a senior Codeyoung mentor for <strong>{bookingData?.childName}</strong>'s 1:1 session in <strong>{bookingData?.subject}</strong>.
      </p>

      {/* Booking Reference Pill */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 16px', borderRadius: 'var(--radius-pill)', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '28px' }}>
        <span>Booking Reference ID:</span>
        <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{bookingData?.id}</span>
      </div>

      {/* Dual Timezone Times Card */}
      <div style={{ maxWidth: '680px', margin: '0 auto 28px auto', background: '#ffffff', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', textAlign: 'left' }}>
        <div style={{ borderLeft: '4px solid var(--primary)', paddingLeft: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            🏠 Your Local Time ({bookingData?.parentTimezone})
          </span>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {bookingData?.parentLocalTime}
          </div>
        </div>

        <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            🇮🇳 Mentor Local Time (India - IST)
          </span>
          <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {bookingData?.mentorLocalTime}
          </div>
        </div>
      </div>

      {/* Matched Mentor Spotlight Card */}
      {assignedMentor && (
        <div style={{ maxWidth: '680px', margin: '0 auto 28px auto', background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)', border: '1.5px solid #c7d2fe', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'left', flexWrap: 'wrap' }}>
          <img
            src={assignedMentor.avatar}
            alt={assignedMentor.name}
            style={{ width: 68, height: 68, borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: 'var(--shadow-md)' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {assignedMentor.name}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#92400e', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                <Star size={12} fill="#d97706" color="#d97706" />
                {assignedMentor.rating} Rating
              </span>
            </div>
            <div style={{ fontSize: '13.5px', color: 'var(--primary)', fontWeight: 600, marginTop: '2px' }}>
              {assignedMentor.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Specialties: {assignedMentor.specialties?.slice(0, 3).join(', ')} • Capped at max 2 demos/day
            </div>
          </div>
          <div style={{ background: 'white', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid #e0e7ff', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Daily Cap</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>
              Demo {assignedMentor.demosBookedToday} of 2
            </div>
          </div>
        </div>
      )}

      {/* Meeting Link Box */}
      <div className="meeting-link-box" id="meeting-link-display">
        <div style={{ textAlign: 'left' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
            Live Classroom Dummy Meeting Link
          </span>
          <span className="meeting-url-text">{bookingData?.meetingLink}</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            id="btn-copy-meeting-link"
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '13px' }}
            onClick={handleCopyLink}
          >
            {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            id="btn-launch-demo-classroom"
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '13.5px' }}
            onClick={() => onEnterClassroom(bookingData?.id)}
          >
            <Video size={16} />
            <span>Enter Demo Classroom</span>
          </button>
        </div>
      </div>

      {/* Secondary Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
        <button
          id="btn-download-ics"
          className="btn-secondary"
          onClick={handleDownloadCalendar}
        >
          <Calendar size={16} />
          <span>Add to Calendar (.ics)</span>
        </button>

        <button
          id="btn-view-sent-emails"
          className="btn-secondary"
          onClick={onOpenEmails}
        >
          <Mail size={16} />
          <span>View Sent Email Notifications</span>
        </button>

        <button
          id="btn-book-another-session"
          className="btn-outline-primary"
          onClick={onReset}
        >
          <span>Book Another Session</span>
        </button>
      </div>
    </div>
  );
}
