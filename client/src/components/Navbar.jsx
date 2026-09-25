import React from 'react';
import { Calendar, Users, Video, PlayCircle, Mail, RotateCcw, Sparkles } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onResetData, onOpenClassroomDirect }) {
  return (
    <header className="header-nav" id="main-navigation-header">
      <div className="header-inner">
        {/* Brand Identity */}
        <div className="brand-block" onClick={() => setActiveTab('booking')} id="brand-home-btn">
          <div className="brand-logo-badge">CY</div>
          <div>
            <div className="brand-text-title">
              Codeyoung <Sparkles size={16} color="#f59e0b" />
            </div>
            <div className="brand-text-subtitle">1:1 Live Coding Trial Platform</div>
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
            <span>Book Trial Class</span>
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
            <span>Email Logs</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
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
