import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Video, Globe, User, BookOpen, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function MentorScheduleModal({ mentor, date, onClose, onEnterClassroom }) {
  const [viewTimezone, setViewTimezone] = useState('Asia/Kolkata');
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mentor) return;
    setIsLoading(true);
    api.getMentorSchedule(mentor.id, date, viewTimezone)
      .then(res => {
        if (res.success) setScheduleData(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [mentor, date, viewTimezone]);

  if (!mentor) return null;

  return (
    <div className="modal-backdrop" id="mentor-schedule-modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={mentor.avatar}
              alt={mentor.name}
              style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {mentor.name}'s Schedule
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {mentor.title} • IST Shift: {mentor.workingHours.start} - {mentor.workingHours.end}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Controls: Timezone Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>View Schedule In:</span>
            </div>
            <select
              className="select-input"
              style={{ minWidth: 200, padding: '6px 12px', fontSize: '12.5px' }}
              value={viewTimezone}
              onChange={(e) => setViewTimezone(e.target.value)}
            >
              <option value="Asia/Kolkata">Mentor Local: Asia/Kolkata (IST)</option>
              <option value="America/New_York">US Eastern: America/New_York (EDT/EST)</option>
              <option value="America/Chicago">US Central: America/Chicago (CDT/CST)</option>
              <option value="America/Los_Angeles">US Pacific: America/Los_Angeles (PDT/PST)</option>
              <option value="Europe/London">UK Local: Europe/London (BST/GMT)</option>
            </select>
          </div>

          {/* Daily Quota Counter Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f1f5f9', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Assigned Trial Sessions on {date || 'Today'}:
            </span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: scheduleData?.capacityReached ? '#dc2626' : 'var(--primary)' }}>
              {scheduleData?.demosBooked || 0} of {mentor.maxDemosPerDay} Demo Classes (Cap: 2)
            </span>
          </div>

          {/* Sessions List */}
          {isLoading ? (
            <p style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>Loading schedule...</p>
          ) : scheduleData?.sessions?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fafafa', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1' }}>
              <Calendar size={36} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                No Trial Classes Booked For This Date
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                This mentor has {mentor.maxDemosPerDay} available demo slots for {date || 'today'}.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {scheduleData.sessions.map((sess, idx) => (
                <div
                  key={sess.id || idx}
                  style={{ background: 'white', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', background: '#eef2ff', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
                        Trial Demo Class #{idx + 1}
                      </span>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
                        {sess.childName} (Age {sess.childAge})
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Subject: <strong>{sess.subject}</strong>
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => onEnterClassroom(sess.id)}
                    >
                      <Video size={13} />
                      <span>Join Live Class</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '12.5px', background: '#f8fafc', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: '10px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Displayed Timezone ({viewTimezone}):</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{sess.displaySlotTime}</strong>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Parent Local Time:</span>
                      <span style={{ color: '#475569' }}>{sess.parentLocalTime}</span>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Parent Contact:</span>
                      <span style={{ color: '#475569' }}>{sess.parentName} ({sess.parentEmail})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
