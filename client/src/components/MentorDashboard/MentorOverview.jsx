import React, { useState, useEffect } from 'react';
import MentorCard from './MentorCard';
import MentorScheduleModal from './MentorScheduleModal';
import { api } from '../../services/api';
import { Users, Calendar, Filter, Sparkles, AlertCircle, RefreshCw, Zap, Clock } from 'lucide-react';

export default function MentorOverview({ onEnterClassroom }) {
  const [mentors, setMentors] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [activeMentorSchedule, setActiveMentorSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

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
  const capacityPercent = Math.min(100, Math.round((totalDemosBooked / maxSystemCapacity) * 100));
  const fullyBookedCount = mentors.filter(m => m.isCapacityReached).length;
  const availableMentorsCount = mentors.filter(m => !m.isCapacityReached).length;

  const handleQuickSimulation = async () => {
    setSimulating(true);
    setSimResult(null);
    try {
      const res = await api.runSimulation(selectedDate, 20);
      if (res.success) {
        setSimResult(res.data);
        fetchMentorsData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const filteredMentors = mentors.filter(m => {
    if (filter === 'AVAILABLE' && m.isCapacityReached) return false;
    if (filter === 'FULL' && !m.isCapacityReached) return false;
    if (shiftFilter !== 'ALL' && m.shiftName !== shiftFilter) return false;
    return true;
  });

  const formattedIndianDate = (() => {
    if (!selectedDate) return '';
    const parts = selectedDate.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d} / ${m} / ${y}`;
    }
    return selectedDate;
  })();

  return (
    <div id="mentor-dashboard-container" style={{ paddingBottom: '40px' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div 
              id="ist-date-picker-badge"
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                background: '#f8fafc', 
                padding: '7px 14px', 
                borderRadius: 'var(--radius-md)', 
                border: '1.5px solid var(--border-subtle)',
                position: 'relative',
                cursor: 'pointer'
              }}
              title="Click to select date (Standard Indian Format: DD / MM / YYYY)"
            >
              <Calendar size={16} color="var(--primary)" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '13.5px', fontFamily: 'var(--font-mono)' }}>
                  {formattedIndianDate}
                </span>
                <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px', border: '1px solid #c7d2fe' }}>
                  IST (DD / MM / YYYY)
                </span>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  opacity: 0, 
                  cursor: 'pointer' 
                }}
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

            <button
              id="btn-quick-day-simulation"
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '13px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
              onClick={handleQuickSimulation}
              disabled={simulating}
            >
              <Zap size={15} />
              <span>{simulating ? 'Simulating 20 Demos...' : 'Auto-Fill Day (20 Demos)'}</span>
            </button>
          </div>
        </div>

        {/* Global Capacity Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary)' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Daily Platform Capacity</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
              {totalDemosBooked} / {maxSystemCapacity} Demos ({capacityPercent}%)
            </div>
            {/* Visual Capacity Fill Bar */}
            <div style={{ height: '6px', width: '100%', background: '#e2e8f0', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${capacityPercent}%`,
                background: capacityPercent >= 100 ? '#ef4444' : capacityPercent > 60 ? '#f59e0b' : '#10b981',
                transition: 'width 0.4s ease'
              }} />
            </div>
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

        {/* Quick Simulation Banner Alert */}
        {simResult && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              🎉 Simulation Complete: Dispatched 20 parent bookings across 4 shifts. <strong>{simResult.totalAccepted} booked</strong>, <strong>{simResult.totalRejected} rejected</strong> (20-demo capacity verified).
            </span>
            <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setSimResult(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Controls Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
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

          {/* Shift Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} color="var(--text-muted)" />
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="select-input"
              style={{ fontSize: '12.5px', padding: '6px 12px', borderRadius: 'var(--radius-md)', background: '#f8fafc' }}
            >
              <option value="ALL">All Operational Shifts (24/7 Global)</option>
              <option value="UK & EMEA Shift">UK & EMEA Shift (1:00 PM - 10:00 PM IST)</option>
              <option value="UK & US Morning Shift">UK & US Morning Shift (2:00 PM - 11:00 PM IST)</option>
              <option value="US Prime Evening Shift">US Prime Evening Shift (6:00 PM - 3:00 AM IST)</option>
              <option value="US West Coast & Late Night Shift">US West Coast & Late Night (9:00 PM - 6:00 AM IST)</option>
            </select>
          </div>
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
