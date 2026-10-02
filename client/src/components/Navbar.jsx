import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Users, Video, PlayCircle, Mail, RotateCcw, Sparkles, Compass, BarChart3, UserCheck, LogIn, LogOut, ChevronDown, HardDrive } from 'lucide-react';
import { useAuth } from '../services/authContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onResetData, 
  onOpenDstInspector,
  userRole,
  onSwitchRole
}) {
  const { user, openAuthModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const isParent = userRole === 'parent';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          <button
            id="nav-tab-storage"
            className={`nav-tab-btn ${activeTab === 'storage' ? 'active' : ''}`}
            onClick={() => setActiveTab('storage')}
          >
            <HardDrive size={14} />
            <span>Cloud Drive</span>
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, position: 'relative' }}>
          {/* Sign In / User Account Action */}
          {!user ? (
            <button
              id="btn-nav-signin"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)'
              }}
              onClick={() => openAuthModal('signin')}
              title="Sign in with Email or Demo Account"
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
          ) : (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                id="btn-nav-user-profile"
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
                onClick={() => setIsUserMenuOpen(prev => !prev)}
                title={`Signed in as ${user.name} (${user.role})`}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#4f46e5', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hide-on-mobile">
                  {user.name}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', background: user.role === 'mentor' ? '#f3e8ff' : '#dbeafe', color: user.role === 'mentor' ? '#7e22ce' : '#1d4ed8', textTransform: 'uppercase' }}>
                  {user.role}
                </span>
                <ChevronDown size={12} color="#64748b" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    width: '230px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0f172a' }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal('signin');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      fontSize: '12px',
                      color: '#334155',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogIn size={13} color="#4f46e5" />
                    <span>Switch Account / Sign In</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      fontSize: '12px',
                      color: '#dc2626',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={13} color="#dc2626" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

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
