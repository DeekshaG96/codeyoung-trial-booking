import React, { useState, useEffect } from 'react';
import MentorCard from './MentorCard';
import MentorScheduleModal from './MentorScheduleModal';
import { api } from '../../services/api';
import { Users, Calendar, Filter, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function MentorOverview({ onEnterClassroom }) {
  const [mentors, setMentors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('ALL');
  const [activeMentorSchedule, setActiveMentorSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMentorsData = () => {
    setIsLoading(true);
    api.getMentors(selectedDate)
      .then(res => {
        if (res.success) setMentors(res.data);
      })
      .catch(err => console.error('Failed to load mentors:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchMentorsData();
  }, [selectedDate]);

  // Metrics
  const totalDemosBooked = mentors.reduce((acc, m) => acc + (m.demosBookedToday || 0), 0);
  const maxSystemCapacity = mentors.length * 2; // 10 * 2 = 20 demos/day!
  const fullyBookedCount = mentors.filter(m => m.isCapacityReached).length;
  const availableMentorsCount = mentors.filter(m => !m.isCapacityReached).length;

  const filteredMentors = mentors.filter(m => {
    if (filter === 'AVAILABLE') return !m.isCapacityReached;
    if (filter === 'FULL') return m.isCapacityReached;
    return true;
  });

  return (
    <div id="mentor-dashboard-container">
      {/* Top Banner & Date Picker */}
      <div style={{ background: 'white', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px 28px', marginBottom: '24px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={24} color="var(--primary)" />
              <span>Mentor Operations & Schedule Center</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
              Real-time monitoring across all 10 mentors in India (IST). Enforcing strictly at most 2 demo classes per day.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)' }}>
              <Calendar size={16} color="var(--primary)" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
              />
            </div>

            <button
              className="btn-secondary"
              style={{ padding: '8px 12px' }}
              onClick={fetchMentorsData}
              title="Refresh schedules"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Global Capacity Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Platform Capacity</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {totalDemosBooked} / {maxSystemCapacity} Demos
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              10 mentors × 2 demos/day limit
            </span>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #10b981' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mentors with Availability</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              {availableMentorsCount} of 10
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Ready to take trial classes
            </span>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #ef4444' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Cap Reached (2/2)</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#ef4444', marginTop: '2px' }}>
              {fullyBookedCount} Mentors
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Strictly capped from new sessions
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button
            className={`btn-secondary ${filter === 'ALL' ? 'active' : ''}`}
            style={{ padding: '6px 14px', fontSize: '12.5px', background: filter === 'ALL' ? '#eef2ff' : 'white', borderColor: filter === 'ALL' ? 'var(--primary)' : 'var(--border-subtle)', color: filter === 'ALL' ? 'var(--primary)' : 'var(--text-secondary)' }}
            onClick={() => setFilter('ALL')}
          >
            All Mentors ({mentors.length})
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12.5px', background: filter === 'AVAILABLE' ? '#ecfdf5' : 'white', borderColor: filter === 'AVAILABLE' ? '#10b981' : 'var(--border-subtle)', color: filter === 'AVAILABLE' ? '#047857' : 'var(--text-secondary)' }}
            onClick={() => setFilter('AVAILABLE')}
          >
            Available ({availableMentorsCount})
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12.5px', background: filter === 'FULL' ? '#fef2f2' : 'white', borderColor: filter === 'FULL' ? '#ef4444' : 'var(--border-subtle)', color: filter === 'FULL' ? '#b91c1c' : 'var(--text-secondary)' }}
            onClick={() => setFilter('FULL')}
          >
            Cap Reached ({fullyBookedCount})
          </button>
        </div>
      </div>

      {/* Mentors Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'var(--text-muted)' }}>Loading mentor schedules...</p>
        </div>
      ) : (
        <div className="mentor-grid">
          {filteredMentors.map(mentor => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onOpenSchedule={(m) => setActiveMentorSchedule(m)}
            />
          ))}
        </div>
      )}

      {/* Schedule Inspection Modal */}
      {activeMentorSchedule && (
        <MentorScheduleModal
          mentor={activeMentorSchedule}
          date={selectedDate}
          onClose={() => setActiveMentorSchedule(null)}
          onEnterClassroom={onEnterClassroom}
        />
      )}
    </div>
  );
}
