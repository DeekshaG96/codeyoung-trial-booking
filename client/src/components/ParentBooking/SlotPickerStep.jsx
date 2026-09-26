import React, { useState, useEffect } from 'react';
import { 
  Globe, Sun, Moon, Clock, Calendar as CalendarIcon, 
  ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Compass
} from 'lucide-react';
import { api } from '../../services/api';
import { getNextDays } from '../../utils/timezones';

export default function SlotPickerStep({ 
  formData, 
  updateFormData, 
  onNext, 
  onBack,
  onOpenWaitlist
}) {
  const [supportedTimezones, setSupportedTimezones] = useState([]);
  const [selectedDate, setSelectedDate] = useState(formData.date || '');
  const [slotData, setSlotData] = useState(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [periodFilter, setPeriodFilter] = useState('ALL');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate next 10 days
  const availableDays = getNextDays(10, formData.timezone);

  useEffect(() => {
    // If no date selected, default to tomorrow
    if (!selectedDate && availableDays.length > 1) {
      const defaultDate = availableDays[1].dateStr;
      setSelectedDate(defaultDate);
      updateFormData({ date: defaultDate });
    } else if (!selectedDate && availableDays.length > 0) {
      setSelectedDate(availableDays[0].dateStr);
      updateFormData({ date: availableDays[0].dateStr });
    }
  }, []);

  // Fetch supported timezones
  useEffect(() => {
    api.getTimezones()
      .then(res => {
        if (res.success) setSupportedTimezones(res.data);
      })
      .catch(err => console.error('Failed to load timezones:', err));
  }, []);

  // Fetch slots whenever timezone or selectedDate changes
  useEffect(() => {
    if (!selectedDate || !formData.timezone) return;

    setIsLoadingSlots(true);
    setFetchError(null);

    api.getAvailableSlots(formData.timezone, selectedDate, formData.subject)
      .then(res => {
        if (res.success) {
          setSlotData(res.data);
        } else {
          setFetchError(res.error || 'Failed to load slots');
        }
      })
      .catch(err => {
        setFetchError('Unable to connect to slot scheduling engine.');
      })
      .finally(() => {
        setIsLoadingSlots(false);
      });
  }, [formData.timezone, selectedDate, formData.subject]);

  const handleSelectSlot = (slot) => {
    if (!slot.isAvailable) return;
    updateFormData({
      selectedSlot: slot,
      startUtc: slot.startUtc,
      endUtc: slot.endUtc,
      date: selectedDate
    });
  };

  // Group slots by period
  const morningSlots = slotData?.slots?.filter(s => {
    const hour = parseInt(s.parentLocalTime.formattedTime.split(':')[0], 10);
    const isPm = s.parentLocalTime.formattedTime.includes('PM');
    return !isPm && hour >= 8 && hour < 12;
  }) || [];

  const afternoonSlots = slotData?.slots?.filter(s => {
    const hour = parseInt(s.parentLocalTime.formattedTime.split(':')[0], 10);
    const isPm = s.parentLocalTime.formattedTime.includes('PM');
    return (isPm && (hour === 12 || hour < 5)) || (!isPm && hour === 12);
  }) || [];

  const eveningSlots = slotData?.slots?.filter(s => {
    const hour = parseInt(s.parentLocalTime.formattedTime.split(':')[0], 10);
    const isPm = s.parentLocalTime.formattedTime.includes('PM');
    return isPm && hour >= 5 && hour <= 9;
  }) || [];

  const parentTzMeta = slotData?.parentTimezone;

  // Format live clocks
  const formatLiveTime = (tzId) => {
    try {
      return currentTime.toLocaleTimeString('en-US', {
        timeZone: tzId,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return currentTime.toLocaleTimeString();
    }
  };

  return (
    <div id="step-slot-picker-container">
      {/* Title */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
          Step 2: Choose your trial class time slot ⏰
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
          Times are shown in your local time zone and dynamically synchronized with our mentors in India.
        </p>
      </div>

      {/* Timezone Selector & DST Notice Bar */}
      <div className="timezone-strip" id="timezone-bar">
        <div className="timezone-info-group">
          <Globe size={22} color="var(--primary)" />
          <div>
            <label htmlFor="select-timezone" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block' }}>
              Your Time Zone (Auto-Detected)
            </label>
            <div className="timezone-select-wrapper" style={{ marginTop: '4px' }}>
              <select
                id="select-timezone"
                className="select-input"
                value={formData.timezone}
                onChange={(e) => updateFormData({ timezone: e.target.value, selectedSlot: null })}
              >
                {supportedTimezones.map(tz => (
                  <option key={tz.id} value={tz.id}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic DST Indicator Pill */}
        {parentTzMeta && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            <div className={`dst-pill ${parentTzMeta.isInDST ? 'active' : 'standard'}`} id="dst-indicator-pill">
              {parentTzMeta.isInDST ? <Sun size={15} color="#d97706" /> : <Clock size={15} color="#0284c7" />}
              <span>
                {parentTzMeta.isInDST 
                  ? `DST Active: ${parentTzMeta.offsetNameShort} (${parentTzMeta.formattedOffset})` 
                  : `Standard Time: ${parentTzMeta.offsetNameShort} (${parentTzMeta.formattedOffset})`}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Mentor Zone: Asia/Kolkata (IST +05:30) • No DST
            </span>
          </div>
        )}
      </div>

      {/* Live Dual-Timezone Synchronizer Strip */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 20px',
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Your Live Clock ({parentTzMeta?.offsetNameShort || 'Local'})
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              {formatLiveTime(formData.timezone)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <Compass size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Mentor Live Clock (IST - Bangalore)
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)' }}>
              {formatLiveTime('Asia/Kolkata')}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', background: '#f8fafc', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
          <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} /> Luxon Timezone Precision
          </div>
          Slot boundaries are computed in UTC and converted dynamically to your exact location with active DST compensation.
        </div>
      </div>

      {/* Date Chips Carousel */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Select Preferred Date
          </span>
          <span style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 }}>
            {slotData ? `${slotData.availableSlotsCount} slots available on this date` : 'Checking slots...'}
          </span>
        </div>

        <div className="date-chips-container" id="date-carousel">
          {availableDays.map(day => {
            const isSelected = selectedDate === day.dateStr;
            return (
              <div
                key={day.dateStr}
                id={`date-chip-${day.dateStr}`}
                className={`date-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedDate(day.dateStr);
                  updateFormData({ date: day.dateStr, selectedSlot: null });
                }}
              >
                <span className="date-chip-day">{day.dayName}</span>
                <span className="date-chip-num">{day.dayNumber}</span>
                <span className="date-chip-month">{day.monthName}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Period Filter Tabs (Morning / Afternoon / Evening) */}
      {slotData && slotData.availableSlotsCount > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              background: periodFilter === 'ALL' ? '#eef2ff' : 'white',
              borderColor: periodFilter === 'ALL' ? 'var(--primary)' : 'var(--border-subtle)',
              color: periodFilter === 'ALL' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700
            }}
            onClick={() => setPeriodFilter('ALL')}
          >
            All Slots ({slotData?.slots?.length || 0})
          </button>
          <button
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              background: periodFilter === 'MORNING' ? '#fffbeb' : 'white',
              borderColor: periodFilter === 'MORNING' ? '#f59e0b' : 'var(--border-subtle)',
              color: periodFilter === 'MORNING' ? '#b45309' : 'var(--text-secondary)',
              fontWeight: 700
            }}
            onClick={() => setPeriodFilter('MORNING')}
          >
            🌅 Morning ({morningSlots.length})
          </button>
          <button
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              background: periodFilter === 'AFTERNOON' ? '#fff7ed' : 'white',
              borderColor: periodFilter === 'AFTERNOON' ? '#ea580c' : 'var(--border-subtle)',
              color: periodFilter === 'AFTERNOON' ? '#c2410c' : 'var(--text-secondary)',
              fontWeight: 700
            }}
            onClick={() => setPeriodFilter('AFTERNOON')}
          >
            ☀️ Afternoon ({afternoonSlots.length})
          </button>
          <button
            className="btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              background: periodFilter === 'EVENING' ? '#f5f3ff' : 'white',
              borderColor: periodFilter === 'EVENING' ? '#8b5cf6' : 'var(--border-subtle)',
              color: periodFilter === 'EVENING' ? '#6d28d9' : 'var(--text-secondary)',
              fontWeight: 700
            }}
            onClick={() => setPeriodFilter('EVENING')}
          >
            🌙 Evening ({eveningSlots.length})
          </button>
        </div>
      )}

      {/* Slots Section */}
      {isLoadingSlots ? (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <div style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid #e0e7ff', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Calculating mentor schedules and daylight savings offsets...
          </p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : fetchError ? (
        <div style={{ padding: '24px', background: '#fef2f2', borderRadius: 'var(--radius-lg)', color: '#991b1b', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <AlertCircle size={24} />
          <div>
            <div style={{ fontWeight: 700 }}>Unable to load slots</div>
            <div style={{ fontSize: '13px' }}>{fetchError}</div>
          </div>
        </div>
      ) : slotData?.availableSlotsCount === 0 ? (
        /* Empty / Fully Booked State */
        <div style={{ background: '#fef2f2', border: '1.5px dashed #fca5a5', borderRadius: 'var(--radius-lg)', padding: '32px 24px', textAlign: 'center', margin: '20px 0' }} id="no-mentors-empty-state">
          <ShieldAlert size={48} color="#dc2626" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
            All 10 Mentors are Fully Booked for {selectedDate}
          </h3>
          <p style={{ fontSize: '14px', color: '#7f1d1d', maxWidth: '540px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            To guarantee high-quality 1:1 attention, each Codeyoung mentor takes at most <strong>2 trial classes per day</strong>. All mentor trial quotas for this date have been reached.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              id="btn-try-next-day"
              className="btn-primary"
              onClick={() => {
                if (availableDays.length > 2) {
                  const nextDay = availableDays[2].dateStr;
                  setSelectedDate(nextDay);
                  updateFormData({ date: nextDay, selectedSlot: null });
                }
              }}
            >
              Check Tomorrow's Slots
            </button>
            <button
              id="btn-open-waitlist"
              className="btn-secondary"
              onClick={onOpenWaitlist}
            >
              Join Priority Waitlist
            </button>
          </div>
        </div>
      ) : (
        /* Render Slots Grid filtered by period */
        <div>
          {/* Morning Slots */}
          {(periodFilter === 'ALL' || periodFilter === 'MORNING') && morningSlots.length > 0 && (
            <div className="slots-group">
              <div className="slots-group-header">
                <Sun size={18} color="#f59e0b" />
                <span>Morning Sessions (8:00 AM - 12:00 PM)</span>
              </div>
              <div className="slots-grid">
                {morningSlots.map(slot => renderSlotCard(slot, formData, handleSelectSlot))}
              </div>
            </div>
          )}

          {/* Afternoon Slots */}
          {(periodFilter === 'ALL' || periodFilter === 'AFTERNOON') && afternoonSlots.length > 0 && (
            <div className="slots-group">
              <div className="slots-group-header">
                <Sun size={18} color="#ea580c" />
                <span>Afternoon Sessions (12:00 PM - 5:00 PM)</span>
              </div>
              <div className="slots-grid">
                {afternoonSlots.map(slot => renderSlotCard(slot, formData, handleSelectSlot))}
              </div>
            </div>
          )}

          {/* Evening Slots */}
          {(periodFilter === 'ALL' || periodFilter === 'EVENING') && eveningSlots.length > 0 && (
            <div className="slots-group">
              <div className="slots-group-header">
                <Moon size={18} color="#6366f1" />
                <span>Evening Sessions (5:00 PM - 9:00 PM)</span>
              </div>
              <div className="slots-grid">
                {eveningSlots.map(slot => renderSlotCard(slot, formData, handleSelectSlot))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
        <button id="btn-back-to-step1" className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          id="btn-proceed-to-parent-details"
          className="btn-primary"
          disabled={!formData.selectedSlot}
          onClick={onNext}
        >
          <span>Continue with Selected Slot</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function renderSlotCard(slot, formData, handleSelectSlot) {
  const isSelected = formData.selectedSlot?.id === slot.id;
  const isAvailable = slot.isAvailable;

  return (
    <div
      key={slot.id}
      id={`slot-card-${slot.id}`}
      className={`slot-card ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
      onClick={() => isAvailable && handleSelectSlot(slot)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="slot-parent-time">
          {slot.parentLocalTime.displayString}
        </div>
        {isSelected && <CheckCircle2 size={18} color="var(--primary)" />}
      </div>

      {/* Mentor Time synchronization label */}
      <div className="slot-mentor-time">
        <Clock size={12} />
        <span>
          Mentor: {slot.mentorLocalTime.formattedTime} IST {slot.mentorLocalTime.dayOffsetNote}
        </span>
      </div>

      {/* Capacity status pill */}
      <div>
        {isAvailable ? (
          <span className={`slot-availability-tag ${slot.availableMentorsCount <= 2 ? 'limited' : 'available'}`}>
            {slot.availableMentorsCount <= 2 
              ? `🔥 Only ${slot.availableMentorsCount} mentor${slot.availableMentorsCount > 1 ? 's' : ''} left` 
              : `✓ Available (${slot.availableMentorsCount} mentors free)`}
          </span>
        ) : (
          <span className="slot-availability-tag full">
            ✕ Fully Booked
          </span>
        )}
      </div>
    </div>
  );
}
