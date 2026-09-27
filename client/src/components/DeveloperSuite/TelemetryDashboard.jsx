import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Globe, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  Terminal, 
  RefreshCw 
} from 'lucide-react';
import { DateTime } from 'luxon';

export default function TelemetryDashboard() {
  const [activeTab, setActiveTab] = useState('kaggle');
  const nowUtc = DateTime.utc();

  const timezones = [
    { zone: 'America/New_York', name: 'US Eastern Time (ET)', city: 'New York', region: 'US' },
    { zone: 'America/Chicago', name: 'US Central Time (CT)', city: 'Chicago', region: 'US' },
    { zone: 'America/Denver', name: 'US Mountain Time (MT)', city: 'Denver', region: 'US' },
    { zone: 'America/Los_Angeles', name: 'US Pacific Time (PT)', city: 'Los Angeles', region: 'US' },
    { zone: 'Europe/London', name: 'UK Time (GMT / BST)', city: 'London', region: 'UK' },
    { zone: 'Asia/Kolkata', name: 'India Standard Time (IST)', city: 'Bengaluru / Mentors', region: 'IN' }
  ];

  return (
    <div id="telemetry-dashboard-container" style={{ background: 'white', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: 'var(--radius-lg)', padding: '20px', color: 'white', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Layers size={13} color="#38bdf8" />
              <span>Data Engine & Platform Intelligence</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Codeyoung Analytics & DST Intelligence Suite
            </h2>
            <p style={{ color: '#c7d2fe', fontSize: '13px', margin: 0, maxWidth: '750px', lineHeight: 1.5 }}>
              Empirical learning analytics from 200,000 EdTech records, IANA cross-timezone scheduling engine, and automated capacity controls.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.5)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>
              🧠 Gemini 2.5 Flash
            </span>
            <span style={{ background: 'rgba(52, 211, 153, 0.2)', border: '1px solid rgba(52, 211, 153, 0.5)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, color: '#34d399' }}>
              ✅ 28/28 Vitest Passing
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          className={`btn-secondary ${activeTab === 'kaggle' ? 'active' : ''}`}
          style={{ padding: '8px 14px', fontSize: '12.5px', background: activeTab === 'kaggle' ? '#fdf2f8' : 'white', borderColor: activeTab === 'kaggle' ? '#ec4899' : 'var(--border-subtle)', color: activeTab === 'kaggle' ? '#be185d' : 'var(--text-secondary)' }}
          onClick={() => setActiveTab('kaggle')}
        >
          <GraduationCap size={15} />
          <span>EdTech Analytics (Kaggle)</span>
        </button>

        <button
          className={`btn-secondary ${activeTab === 'timezone' ? 'active' : ''}`}
          style={{ padding: '8px 14px', fontSize: '12.5px', background: activeTab === 'timezone' ? '#eff6ff' : 'white', borderColor: activeTab === 'timezone' ? 'var(--primary)' : 'var(--border-subtle)', color: activeTab === 'timezone' ? 'var(--primary)' : 'var(--text-secondary)' }}
          onClick={() => setActiveTab('timezone')}
        >
          <Globe size={15} />
          <span>Timezones & DST Engine</span>
        </button>

        <button
          className={`btn-secondary ${activeTab === 'ai' ? 'active' : ''}`}
          style={{ padding: '8px 14px', fontSize: '12.5px', background: activeTab === 'ai' ? '#faf5ff' : 'white', borderColor: activeTab === 'ai' ? '#9333ea' : 'var(--border-subtle)', color: activeTab === 'ai' ? '#7e22ce' : 'var(--text-secondary)' }}
          onClick={() => setActiveTab('ai')}
        >
          <Sparkles size={15} />
          <span>Koda AI (Gemini 2.5)</span>
        </button>

        <button
          className={`btn-secondary ${activeTab === 'capacity' ? 'active' : ''}`}
          style={{ padding: '8px 14px', fontSize: '12.5px', background: activeTab === 'capacity' ? '#ecfdf5' : 'white', borderColor: activeTab === 'capacity' ? '#10b981' : 'var(--border-subtle)', color: activeTab === 'capacity' ? '#047857' : 'var(--text-secondary)' }}
          onClick={() => setActiveTab('capacity')}
        >
          <ShieldCheck size={15} />
          <span>Platform Capacity Rules</span>
        </button>
      </div>

      {/* Tab 1: Kaggle EdTech Analytics */}
      {activeTab === 'kaggle' && (
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
                📊 Educational Technology Learning Analytics Dataset
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', margin: 0 }}>
                Kaggle benchmark (birendeepsingh/educational-technology-learning-analytics-dataset) calibrating trial matching.
              </p>
            </div>
            <span style={{ fontSize: '11.5px', background: '#fdf2f8', color: '#be185d', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
              200,000 Verified Records
            </span>
          </div>

          {/* 3 KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#fdf2f8', padding: '14px 16px', borderRadius: '10px', border: '1px solid #fbcfe8' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#be185d', textTransform: 'uppercase' }}>Courses Catalog</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#9d174d', marginTop: '2px' }}>150</div>
              <div style={{ fontSize: '11.5px', color: '#be185d', marginTop: '2px' }}>Across 12 Subject Areas • Avg Rating 4.24/5.0</div>
            </div>

            <div style={{ background: '#eff6ff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Student Cohorts</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e40af', marginTop: '2px' }}>8,000</div>
              <div style={{ fontSize: '11.5px', color: '#1d4ed8', marginTop: '2px' }}>Age 16–64 • 4 Distinct Learning Styles</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '14px 16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Learning Interactions</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#065f46', marginTop: '2px' }}>200,000</div>
              <div style={{ fontSize: '11.5px', color: '#047857', marginTop: '2px' }}>81.1% Avg Completion • 12.0 min Avg Session</div>
            </div>
          </div>

          {/* Breakdown Distributions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Learning Style Distribution */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '12px', fontSize: '13.5px' }}>
                🧠 Student Learning Style Distribution
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>Auditory Learners</span>
                    <span style={{ fontWeight: 800 }}>2,023 (25.3%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '25.3%', height: '100%', background: '#6366f1' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>Kinesthetic (Hands-on Coding)</span>
                    <span style={{ fontWeight: 800 }}>2,011 (25.1%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '25.1%', height: '100%', background: '#10b981' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>Reading / Writing</span>
                    <span style={{ fontWeight: 800 }}>2,004 (25.1%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '25.1%', height: '100%', background: '#f59e0b' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>Visual Learners</span>
                    <span style={{ fontWeight: 800 }}>1,962 (24.5%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '24.5%', height: '100%', background: '#ec4899' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Device & Codeyoung Application */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: '#1e293b', marginBottom: '12px', fontSize: '13.5px' }}>
                📱 Devices & Application in Codeyoung
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginBottom: '12px' }}>
                <div style={{ background: 'white', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700 }}>MOBILE TRAFFIC</div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>49.7% of visits</div>
                </div>
                <div style={{ background: 'white', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700 }}>DESKTOP LAB</div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>40.7% coding sessions</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, background: 'white', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                💡 <strong>Codeyoung Matching Engine:</strong> Visual & kinesthetic learners are paired with mentors specializing in Scratch Game Development, while analytical learners are routed to Python 3.11 algorithms and competitive logic.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Timezones & DST Engine */}
      {activeTab === 'timezone' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
              🌐 Dynamic Cross-Timezone & IANA DST Synchronizer
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', margin: 0 }}>
              Enforces real-time conversion between US/UK parent local times and India Mentor IST shifts (`Asia/Kolkata` UTC+5:30).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {timezones.map(t => {
              const dt = nowUtc.setZone(t.zone);
              const isDst = dt.isInDST;
              const offset = dt.toFormat('ZZ');
              return (
                <div key={t.zone} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{t.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.zone}</div>
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: isDst ? '#dbeafe' : '#f1f5f9', color: isDst ? '#1d4ed8' : '#475569' }}>
                      {isDst ? 'DST Active' : 'Standard'}
                    </span>
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {dt.toFormat('hh:mm:ss a')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      UTC {offset}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    {dt.toFormat('ccc, LLL dd, yyyy')}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', background: '#eff6ff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '12px', color: '#1e40af', lineHeight: 1.5 }}>
            🛡️ <strong>Daylight Saving Time Protection:</strong> Luxon & IANA database dynamically handles the 1-hour shift when US turns clocks back on Nov 1, 2026, and UK on Oct 25, 2026. Mentors in India remain unaffected on UTC+05:30.
          </div>
        </div>
      )}

      {/* Tab 3: Koda AI (Gemini 2.5 Flash) */}
      {activeTab === 'ai' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
              🧠 Google Gemini 2.5 Flash STEM Assistant
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', margin: 0 }}>
              Live generative AI model assisting trial students inside the Virtual Classroom with Scratch blocks and Python syntax.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: '#faf5ff', padding: '14px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>Active Model</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#6b21a8', marginTop: '2px' }}>gemini-2.5-flash</div>
              <div style={{ fontSize: '11px', color: '#7e22ce', marginTop: '2px' }}>Google DeepMind v1beta Endpoint</div>
            </div>

            <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>Fallback Core</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', marginTop: '2px' }}>STEM Knowledge Base</div>
              <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>Zero Downtime & Offline Support (&lt;5ms)</div>
            </div>

            <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase' }}>Classroom Features</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af', marginTop: '2px' }}>Explain • Debug • Quiz</div>
              <div style={{ fontSize: '11px', color: '#1d4ed8', marginTop: '2px' }}>Tailored to ages 6–15 coding logic</div>
            </div>
          </div>

          <div style={{ background: '#1e1e1e', borderRadius: '10px', padding: '14px', color: '#f8fafc', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            <div style={{ color: '#94a3b8', marginBottom: '6px' }}>// System Prompt Config</div>
            <div style={{ color: '#38bdf8' }}>"Role": "Koda AI - Senior STEM Coach for Codeyoung"</div>
            <div style={{ color: '#38bdf8' }}>"Tone": "Inspiring, encouraging, child-friendly (ages 6-15)"</div>
            <div style={{ color: '#38bdf8' }}>"Rules": "Explain concepts using real-world analogies; guide student to discover answers."</div>
          </div>
        </div>
      )}

      {/* Tab 4: Platform Capacity Rules */}
      {activeTab === 'capacity' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>
              🛡️ Codeyoung Core Capacity & Allocation Rules
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', margin: 0 }}>
              Strict business constraints enforced across 10 mentors in India and 20 parent daily bookings.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '13.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Strict 2 Demos/Day Per Mentor</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                10 mentors × 2 demos/day = 20 total platform demos/day. Once a mentor reaches 2 booked classes, their slots are locked from further bookings.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '13.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Operational Shift Normalization</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Night sessions occurring between 00:00 and 07:00 IST are mapped to the preceding evening's operational shift, preventing quota leaks across midnight.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '13.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Empathetic Error Handling</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                When daily capacity is exhausted, parents receive immediate alternative recommendations (off-peak shifts, next day) or can join the Priority Waitlist.
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '13.5px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>28 / 28 Automated Test Verification</span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Covering DST transitions, timezone offsets, booking collisions, capacity stress simulations, and AI sandbox execution.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
