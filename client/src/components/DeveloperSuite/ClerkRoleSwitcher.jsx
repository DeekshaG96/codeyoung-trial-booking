import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { 
  User, Check, ChevronDown, Shield, Users, Sparkles, 
  LogIn, LogOut, UserPlus, GraduationCap, Settings
} from 'lucide-react';

export default function ClerkRoleSwitcher({ currentRole, onSwitchRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout, openAuthModal, demoAccounts, switchUser } = useAuth();

  const handleSelectRole = (demo) => {
    switchUser(demo);
    if (onSwitchRole) onSwitchRole(demo.role);
    setIsOpen(false);
  };

  const handleOpenAuth = (tab) => {
    setIsOpen(false);
    openAuthModal(tab);
  };

  const handleSignOut = () => {
    setIsOpen(false);
    logout();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          id="btn-nav-sign-in"
          onClick={() => openAuthModal('signin')}
          className="btn-primary"
          style={{
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: 'var(--radius-pill)',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.35)',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <LogIn size={13} />
          <span>Sign In</span>
        </button>

        <button
          id="btn-nav-register"
          onClick={() => openAuthModal('signup')}
          className="btn-secondary"
          style={{
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: 'var(--radius-pill)',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#334155',
            cursor: 'pointer'
          }}
        >
          <span>Register</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
      {/* Profile Chip Button */}
      <button
        id="btn-clerk-user-profile"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px 12px 4px 4px',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)'
        }}
        title="Account & Role Switcher"
      >
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
          alt={user.name}
          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {user.name}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {user.badge || `${user.role?.toUpperCase()} Portal`}
          </div>
        </div>
        <ChevronDown size={14} color="#64748b" />
      </button>

      {/* Quick Sign In button even when a demo user is active */}
      <button
        id="btn-nav-sign-in-alt"
        onClick={() => openAuthModal('signin')}
        style={{
          padding: '6px 10px',
          fontSize: '11px',
          fontWeight: 700,
          borderRadius: 'var(--radius-pill)',
          background: '#f8fafc',
          border: '1.5px solid #cbd5e1',
          color: '#475569',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
        title="Sign in with your own account"
      >
        <LogIn size={12} color="#6366f1" />
        <span>Sign In</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '44px',
          right: 0,
          background: 'white',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.15)',
          padding: '14px',
          width: '290px',
          zIndex: 100
        }}>
          {/* Active Profile Info Header */}
          <div style={{ paddingBottom: '10px', borderBottom: '1px solid #f1f5f9', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #818cf8' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {user.email}
                </div>
              </div>
            </div>
            <div style={{ marginTop: '6px', display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: user.role === 'mentor' ? '#e0e7ff' : user.role === 'student' ? '#dcfce7' : '#fef3c7', color: user.role === 'mentor' ? '#4338ca' : user.role === 'student' ? '#15803d' : '#b45309' }}>
              Active: {user.role?.toUpperCase()} MODE ({user.timezone || 'Auto'})
            </div>
          </div>

          {/* Quick Demo Switcher Section */}
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
            Quick Persona Switch
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {demoAccounts.map(account => {
              const isSelected = account.id === user.id;
              return (
                <div
                  key={account.id}
                  onClick={() => handleSelectRole(account)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? '#eef2ff' : 'transparent',
                    border: isSelected ? '1px solid #c7d2fe' : '1px solid transparent',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <img
                    src={account.avatar}
                    alt={account.name}
                    style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {account.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {account.badge}
                    </div>
                  </div>
                  {isSelected && <Check size={14} color="#4f46e5" />}
                </div>
              );
            })}
          </div>

          {/* Action Links */}
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => handleOpenAuth('signin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '6px 8px',
                background: 'none',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11.5px',
                color: '#475569',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <UserPlus size={13} color="#4f46e5" />
              <span>Switch / Add Account</span>
            </button>

            <button
              onClick={handleSignOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '6px 8px',
                background: 'none',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11.5px',
                color: '#ef4444',
                cursor: 'pointer',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={13} color="#ef4444" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
