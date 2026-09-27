import React from 'react';
import { Calendar, Users, Video, PlayCircle, Mail, RotateCcw, Sparkles, Compass, BarChart3, UserCheck, Shield } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onResetData, 
  onOpenDstInspector,
  userRole,
  onSwitchRole
}) {
  const isParent = userRole === 'parent';

  return (
    <header className="header-nav" id="main-navigation-header">
      <div className="header-inner">
        {/* Brand Identity: Codeyoung / Kodaverse */}
        <div 
          className="brand-block" 
          onClick={() => setActiveTab('booking')} 
          id="brand-home-btn" 
          style={{ cursor: 'pointer', flexShrink: 0 }}
        >
          <div className="brand-logo-badge" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)' }}>
            CY
          </div>
          <div>
            <div className="brand-text-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Codeyoung</span>
              <span style={{ fontSize: '11px', verticalAlign: 'super', color: '#6366f1', fontWeight: 800 }}>™</span>
              <span style={{ background: '#eef2ff', color: '#4338ca', fontSize: '9.5px', fontWeight: 800, padding: '1px 6px', borderRadius: '10px', border: '1px solid #c7d2fe' }}>
                1:1 TRIAL
              </span>
            </div>
            <div className="brand-text-subtitle">1:1 Coding & STEM Mentorship Platform</div>
          </div>
        </div>

        {/* Navigation Tabs (Smooth horizontal touch scrolling on mobile) */}
        <nav className="nav-tabs" aria-label="Portal Navigation" id="portal-nav-bar">
          <button
            id="nav-tab-booking"
            className={`nav-tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            <Calendar size={14} />
            <span>Book Trial</span>
          </button>

          <button
            id="nav-tab-mentors"
            className={`nav-tab-btn ${activeTab === 'mentors' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentors')}
          >
            <Users size={14} />
            <span>Mentor Schedules</span>
          </button>

          <button
            id="nav-tab-simulation"
            className={`nav-tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            <PlayCircle size={14} />
            <span>Capacity Test</span>
            <span style={{ fontSize: '9px', background: '#e0e7ff', color: '#4338ca', padding: '1px 4px', borderRadius: '4px', fontWeight: 800 }}>
              20 Max
            </span>
          </button>

          <button
            id="nav-tab-classroom"
            className={`nav-tab-btn ${activeTab === 'classroom' ? 'active' : ''}`}
            onClick={() => setActiveTab('classroom')}
          >
            <Video size={14} />
            <span>Live Classroom</span>
          </button>

          <button
            id="nav-tab-emails"
            className={`nav-tab-btn ${activeTab === 'emails' ? 'active' : ''}`}
            onClick={() => setActiveTab('emails')}
          >
            <Mail size={14} />
            <span>Comms Hub</span>
          </button>

          <button
            id="nav-tab-analytics"
            className={`nav-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={14} />
            <span>Analytics & DST</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Role Toggle Pill (Standard User Friendly) */}
          <button
            id="btn-role-switcher"
            className="btn-secondary"
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px', 
              fontWeight: 700,
              background: isParent ? '#eff6ff' : '#faf5ff',
              borderColor: isParent ? '#bfdbfe' : '#e9d5ff',
              color: isParent ? '#1d4ed8' : '#7e22ce'
            }}
            onClick={() => onSwitchRole(isParent ? 'mentor' : 'parent')}
            title="Switch between Parent and Mentor perspective"
          >
            <UserCheck size={13} />
            <span>{isParent ? 'Parent View' : 'Mentor View'}</span>
          </button>

          {/* Quick DST Tool */}
          <button
            id="btn-nav-dst-inspector"
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11.5px', background: '#f8fafc' }}
            onClick={onOpenDstInspector}
            title="Inspect IANA Daylight Saving Time (DST) Transitions"
          >
            <Compass size={13} color="#4f46e5" />
            <span className="hide-on-mobile">DST Info</span>
          </button>

          {/* Quick Reset Baseline */}
          <button
            id="btn-quick-reset"
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11.5px' }}
            onClick={onResetData}
            title="Reset system test data back to initial seed state"
          >
            <RotateCcw size={13} />
            <span className="hide-on-mobile">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
