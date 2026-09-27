import React, { useState } from 'react';
import { User, Check, ChevronDown, Shield, Users, Sparkles } from 'lucide-react';

export default function ClerkRoleSwitcher({ currentRole, onSwitchRole }) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'parent',
      name: 'Sarah Jenkins',
      title: 'Parent (US Eastern • New York)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      badge: 'Parent Portal'
    },
    {
      id: 'mentor',
      name: 'Aarav Sharma',
      title: 'Lead Mentor (India • Asia/Kolkata)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      badge: 'Mentor Portal (IST)'
    }
  ];

  const active = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <div style={{ position: 'relative' }}>
      {/* Clerk Profile Chip */}
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
      >
        <img
          src={active.avatar}
          alt={active.name}
          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {active.name}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {active.badge}
          </div>
        </div>
        <ChevronDown size={14} color="#64748b" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '42px',
          right: 0,
          background: 'white',
          borderRadius: '14px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.15)',
          padding: '12px',
          width: '260px',
          zIndex: 100
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
            Clerk Auth • Switch User Role
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {roles.map(r => {
              const isSelected = r.id === currentRole;
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    onSwitchRole(r.id);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? '#eef2ff' : 'transparent',
                    border: isSelected ? '1px solid #c7d2fe' : '1px solid transparent'
                  }}
                >
                  <img
                    src={r.avatar}
                    alt={r.name}
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                      {r.title}
                    </div>
                  </div>
                  {isSelected && <Check size={14} color="var(--primary)" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
