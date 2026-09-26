import React from 'react';
import { Calendar, Users, Video, PlayCircle, Mail, RotateCcw, Sparkles, Compass, Zap } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onResetData, 
  onOpenDstInspector
}) {
  return (
    <header className="header-nav" id="main-navigation-header">
      <div className="header-inner">
        {/* Brand Identity: Kodaverse */}
        <div className="brand-block" onClick={() => setActiveTab('booking')} id="brand-home-btn" style={{ cursor: 'pointer' }}>
          <div className="brand-logo-badge" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' }}>
            KV
          </div>
          <div>
            <div className="brand-text-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Kodaverse</span>
              <span style={{ fontSize: '11px', verticalAlign: 'super', color: '#6366f1', fontWeight: 800 }}>™</span>
              <span style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)', color: '#4338ca', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                PRO
              </span>
            </div>
            <div className="brand-text-subtitle">The Global 1:1 Coding & STEM Mentorship Platform</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs" aria-label="Portal Navigation" id="portal-nav-bar">
          <button
            id="nav-tab-booking"
            className={`nav-tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            <Calendar size={16} />
            <span>Book Trial Session</span>
          </button>

          <button
            id="nav-tab-mentors"
            className={`nav-tab-btn ${activeTab === 'mentors' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentors')}
          >
            <Users size={16} />
            <span>Mentor Schedules</span>
          </button>

          <button
            id="nav-tab-simulation"
            className={`nav-tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            <PlayCircle size={16} />
            <span>20-Parent Test</span>
          </button>

          <button
            id="nav-tab-classroom"
            className={`nav-tab-btn ${activeTab === 'classroom' ? 'active' : ''}`}
            onClick={() => setActiveTab('classroom')}
          >
            <Video size={16} />
            <span>Live Classroom</span>
          </button>

          <button
            id="nav-tab-emails"
            className={`nav-tab-btn ${activeTab === 'emails' ? 'active' : ''}`}
            onClick={() => setActiveTab('emails')}
          >
            <Mail size={16} />
            <span>Communications Hub</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            id="btn-nav-dst-inspector"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', background: '#f8fafc' }}
            onClick={onOpenDstInspector}
            title="Inspect IANA Daylight Saving Time (DST) Transitions"
          >
            <Compass size={14} color="#4f46e5" />
            <span>DST Engine</span>
          </button>

          <button
            id="btn-quick-reset"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={onResetData}
            title="Reset system test data back to initial state"
          >
            <RotateCcw size={14} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </header>
  );
}
