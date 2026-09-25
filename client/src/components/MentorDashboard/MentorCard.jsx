import React from 'react';
import { Star, Clock, Calendar, CheckCircle2, AlertCircle, Video } from 'lucide-react';

export default function MentorCard({ mentor, onOpenSchedule }) {
  const isCapReached = mentor.isCapacityReached;
  const bookedCount = mentor.demosBookedToday;
  const maxDemos = mentor.maxDemosPerDay;

  return (
    <div className="mentor-card" id={`mentor-card-${mentor.id}`}>
      <div>
        {/* Mentor Top Info */}
        <div className="mentor-header">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="mentor-avatar"
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {mentor.name}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '11.5px', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '1px 6px', borderRadius: 'var(--radius-pill)' }}>
                <Star size={11} fill="#d97706" color="#d97706" />
                {mentor.rating}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
              {mentor.title}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Shift: {mentor.shiftName || 'India Standard Shift'} ({mentor.workingHours.start} - {mentor.workingHours.end} IST)
            </div>
          </div>
        </div>

        {/* Daily Quota Utilization Bar (Max 2 Demos) */}
        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 700 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Daily Trial Capacity (Cap: 2)</span>
            <span style={{ color: isCapReached ? '#dc2626' : (bookedCount === 1 ? '#d97706' : '#16a34a') }}>
              {bookedCount} / {maxDemos} Demos Booked
            </span>
          </div>

          <div className="quota-progress-bar">
            <div
              className={`quota-progress-fill ${bookedCount === 0 ? 'empty' : (bookedCount === 1 ? 'half' : 'full')}`}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>{isCapReached ? '🔒 Daily Quota Reached' : `✓ ${maxDemos - bookedCount} slot available`}</span>
            <span>{mentor.timezone}</span>
          </div>
        </div>

        {/* Specialties Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {mentor.specialties.map(spec => (
            <span
              key={spec}
              style={{ fontSize: '11px', fontWeight: 600, background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Today's Booked Students */}
        {mentor.todayBookings && mentor.todayBookings.length > 0 && (
          <div style={{ fontSize: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '10px 12px', marginBottom: '14px' }}>
            <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: '4px' }}>
              Assigned Trial Sessions Today ({mentor.todayBookings.length}):
            </div>
            {mentor.todayBookings.map(b => (
              <div key={b.bookingId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0', fontSize: '11.5px', color: '#1e3a8a' }}>
                <span>• <strong>{b.childName}</strong> ({b.subject})</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{b.mentorLocalTime.split('at')[1] || b.mentorLocalTime}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        id={`btn-view-schedule-${mentor.id}`}
        className="btn-secondary"
        style={{ width: '100%', padding: '8px', fontSize: '13px' }}
        onClick={() => onOpenSchedule(mentor)}
      >
        <Calendar size={14} />
        <span>View Full Schedule & Sessions</span>
      </button>
    </div>
  );
}
