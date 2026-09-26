import React, { useState } from 'react';
import { X, Compass, Sun, Moon, Clock, CheckCircle2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { DateTime } from 'luxon';

const PRESET_DATES = [
  {
    label: 'US Spring-Forward (23h Day)',
    date: '2026-03-08',
    tz: 'America/New_York',
    note: 'Clocks skip 02:00 -> 03:00 (EST to EDT). Total UTC duration = 23 hours.'
  },
  {
    label: 'UK Spring-Forward (23h Day)',
    date: '2026-03-29',
    tz: 'Europe/London',
    note: 'Clocks skip 01:00 -> 02:00 (GMT to BST). Total UTC duration = 23 hours.'
  },
  {
    label: 'UK Fall-Back (25h Day)',
    date: '2026-10-25',
    tz: 'Europe/London',
    note: 'Clocks repeat 01:00 -> 02:00 (BST to GMT). Total UTC duration = 25 hours.'
  },
  {
    label: 'US Fall-Back (25h Day)',
    date: '2026-11-01',
    tz: 'America/New_York',
    note: 'Clocks repeat 01:00 -> 02:00 (EDT to EST). Total UTC duration = 25 hours.'
  },
  {
    label: 'India Standard Time (Fixed UTC+5:30)',
    date: '2026-06-15',
    tz: 'Asia/Kolkata',
    note: 'India does not observe DST. Always exactly 24 hours/day with zero shift.'
  }
];

export default function DstInspectorModal({ onClose, onSelectPreset }) {
  const [selectedTz, setSelectedTz] = useState('America/New_York');
  const [testDate, setTestDate] = useState('2026-03-08');
  const [testTime, setTestTime] = useState('14:00');

  // Compute Luxon local and IST
  const dtLocal = DateTime.fromISO(`${testDate}T${testTime}:00`, { zone: selectedTz });
  const dtUtc = dtLocal.toUTC();
  const dtIst = dtLocal.setZone('Asia/Kolkata');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '760px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          padding: '22px 28px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, marginBottom: '6px' }}>
              <Compass size={14} color="#818cf8" />
              <span>IANA TIMEZONE & DST ARCHITECTURE</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              Codeyoung Orbit™ Dynamic DST Synchronization Engine
            </h2>
            <p style={{ fontSize: '12.5px', color: '#c7d2fe', marginTop: '4px' }}>
              Mathematical proof of zero slot drift during US Energy Policy Act & UK Summer Time clock shifts.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px' }}>
          {/* Preset Critical Transition Dates */}
          <div style={{ marginBottom: '22px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎯 Verified Transition Day Presets:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {PRESET_DATES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedTz(preset.tz);
                    setTestDate(preset.date);
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #e2e8f0',
                    background: testDate === preset.date && selectedTz === preset.tz ? '#eef2ff' : '#f8fafc',
                    borderColor: testDate === preset.date && selectedTz === preset.tz ? 'var(--primary)' : '#e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {preset.label}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {preset.date} • {preset.tz.split('/')[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live Calculation Sandbox */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '14px',
            padding: '18px 20px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
              🧪 Live Interactive Offset Calculator:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Timezone</label>
                <select
                  value={selectedTz}
                  onChange={(e) => setSelectedTz(e.target.value)}
                  className="select-input"
                  style={{ width: '100%', marginTop: '4px', fontSize: '12px', padding: '6px 10px' }}
                >
                  <option value="America/New_York">US Eastern (America/New_York)</option>
                  <option value="America/Chicago">US Central (America/Chicago)</option>
                  <option value="America/Denver">US Mountain (America/Denver)</option>
                  <option value="America/Los_Angeles">US Pacific (America/Los_Angeles)</option>
                  <option value="Europe/London">UK (Europe/London)</option>
                  <option value="Asia/Kolkata">India (Asia/Kolkata)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Target Date</label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', marginTop: '4px', fontSize: '12px', padding: '6px 10px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Local Time</label>
                <input
                  type="time"
                  value={testTime}
                  onChange={(e) => setTestTime(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', marginTop: '4px', fontSize: '12px', padding: '6px 10px' }}
                />
              </div>
            </div>

            {/* Realtime Output Triad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ background: 'white', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #4f46e5' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>PARENT LOCAL TIME</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {dtLocal.toFormat('hh:mm a')} ({dtLocal.offsetNameShort})
                </div>
                <div style={{ fontSize: '11px', color: dtLocal.isInDST ? '#d97706' : '#0284c7', fontWeight: 700, marginTop: '2px' }}>
                  {dtLocal.isInDST ? '☀️ DST Active (UTC' + dtLocal.toFormat('ZZ') + ')' : '❄️ Standard Time (UTC' + dtLocal.toFormat('ZZ') + ')'}
                </div>
              </div>

              <div style={{ background: 'white', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>MENTOR TIME (INDIA IST)</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                  {dtIst.toFormat('hh:mm a')} IST
                </div>
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                  Fixed UTC+05:30 (Never DST)
                </div>
              </div>

              <div style={{ background: 'white', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #8b5cf6' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>CANONICAL UTC TIMESTAMP</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#6d28d9', fontFamily: 'var(--font-mono)', marginTop: '4px', wordBreak: 'break-all' }}>
                  {dtUtc.toISO()}
                </div>
                <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '2px' }}>
                  Source of truth across database
                </div>
              </div>
            </div>
          </div>

          {/* Core Architectural Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>No Hardcoded Math:</strong> Uses compiled IANA database rules rather than static ±X hours.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>Midnight Shift Normalization:</strong> 00:00–07:00 IST grouped to evening shift date to protect 2-demo limit.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>RFC 5545 Calendar Feeds:</strong> Produces `.ics` files with UTC start/end to automatically alert phone calendars.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 28px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '8px 20px', fontSize: '13px' }}>
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
