import React, { useState } from 'react';
import { Zap, ChevronUp, ChevronDown, Check, Globe, Users, Video, Mail, PlayCircle, Sparkles, BarChart3, CreditCard } from 'lucide-react';

export default function QuickEvaluatorBar({ 
  onSelectPreset,
  setActiveTab,
  onEnterClassroom,
  onOpenStripeCheckout,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = controlledSetIsOpen || setInternalIsOpen;

  const [dockPosition, setDockPosition] = useState('bottom-right'); // default safely in corner
  const [isMinimized, setIsMinimized] = useState(true); // minimized by default so it never blocks form fields!

  const cyclePosition = (e) => {
    e.stopPropagation();
    if (dockPosition === 'bottom-right') setDockPosition('bottom-left');
    else if (dockPosition === 'bottom-left') setDockPosition('bottom-center');
    else setDockPosition('bottom-right');
  };

  const getContainerStyle = () => {
    const base = {
      position: 'fixed',
      bottom: '16px',
      zIndex: 90,
      fontFamily: 'var(--font-body)',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    };

    if (dockPosition === 'bottom-center') {
      return { ...base, left: '50%', transform: 'translateX(-50%)', right: 'auto' };
    }
    if (dockPosition === 'bottom-left') {
      return { ...base, left: '20px', right: 'auto', transform: 'none' };
    }
    return { ...base, right: '20px', left: 'auto', transform: 'none' };
  };

  return (
    <div style={getContainerStyle()} id="quick-evaluator-dock-container">
      {/* Minimized Tiny Floating Trigger in corner (never covers center inputs) */}
      {isMinimized && !isOpen ? (
        <button
          id="btn-unminimize-evaluator-dock"
          onClick={() => { setIsMinimized(false); setIsOpen(true); }}
          title="Open Evaluator Presets & QA Shortcuts"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)',
            color: 'white',
            border: '1.5px solid #818cf8',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Sparkles size={13} color="#fbbf24" />
          <span>⚡ Presets Dock</span>
        </button>
      ) : !isOpen ? (
        /* Collapsed Pill Button */
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(30, 27, 75, 0.95)', padding: '3px 4px', borderRadius: 'var(--radius-pill)', boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)', border: '1.5px solid #818cf8', backdropFilter: 'blur(8px)' }}>
          <button
            id="btn-open-evaluator-dock"
            onClick={() => setIsOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={15} color="#fbbf24" />
            <span>⚡ Evaluator Quick Presets</span>
            <ChevronUp size={15} />
          </button>

          {/* Position cycle shortcut */}
          <button
            onClick={cyclePosition}
            title={`Dock Position: ${dockPosition} (Click to move)`}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              color: '#c7d2fe',
              padding: '4px 8px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            {dockPosition === 'bottom-center' ? '⇄ Center' : (dockPosition === 'bottom-left' ? '⇄ Left' : '⇄ Right')}
          </button>

          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize dock to avoid obscuring page content"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              padding: '4px 6px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      ) : (
        /* Expanded Floating Card */
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1.5px solid #c7d2fe',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
          padding: '16px 18px',
          width: '330px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
              <Zap size={15} color="#4f46e5" />
              <span>Evaluator Demo Shortcuts</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={cyclePosition}
                title="Change dock position (Left / Center / Right)"
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '10.5px', padding: '2px 6px', color: '#475569', cursor: 'pointer', fontWeight: 700 }}
              >
                {dockPosition === 'bottom-center' ? 'Center' : (dockPosition === 'bottom-left' ? 'Left' : 'Right')}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Collapse dock"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: '#64748b' }}>
            1-click test workflows designed for Talentise Global & Codeyoung assessors:
          </div>

          {/* Quick Actions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', background: '#f8fafc' }}
              onClick={() => {
                onSelectPreset({
                  childName: 'Sophia',
                  childAge: '8',
                  subject: 'Scratch',
                  timezone: 'America/New_York'
                });
                setActiveTab('booking');
                setIsOpen(false);
              }}
            >
              <span>🇺🇸</span>
              <span style={{ fontWeight: 700 }}>US Parent (Sophia, 8, Scratch)</span>
            </button>

            <button
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', background: '#f8fafc' }}
              onClick={() => {
                onSelectPreset({
                  childName: 'Oliver',
                  childAge: '13',
                  subject: 'Python',
                  timezone: 'Europe/London'
                });
                setActiveTab('booking');
                setIsOpen(false);
              }}
            >
              <span>🇬🇧</span>
              <span style={{ fontWeight: 700 }}>UK Parent (Oliver, 13, Python)</span>
            </button>

            <button
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', background: '#eef2ff', borderColor: '#c7d2fe', color: 'var(--primary)' }}
              onClick={() => {
                setActiveTab('simulation');
                setIsOpen(false);
              }}
            >
              <PlayCircle size={14} />
              <span style={{ fontWeight: 700 }}>20-Parent Capacity Stress Test</span>
            </button>

            <button
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', background: '#f8fafc' }}
              onClick={() => {
                setActiveTab('mentors');
                setIsOpen(false);
              }}
            >
              <Users size={14} />
              <span>Inspect 10 Mentor Quotas</span>
            </button>

            <button
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', background: '#f8fafc' }}
              onClick={() => {
                setActiveTab('emails');
                setIsOpen(false);
              }}
            >
              <Mail size={14} />
              <span>WhatsApp & Email Dispatch Logs</span>
            </button>

            <button
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', background: '#ecfdf5', borderColor: '#a7f3d0', color: '#047857' }}
              onClick={() => {
                setActiveTab('analytics');
                setIsOpen(false);
              }}
            >
              <BarChart3 size={14} />
              <span style={{ fontWeight: 700 }}>PostHog & Sentry Telemetry</span>
            </button>

            <button
              className="btn-secondary"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px', background: '#f5f3ff', borderColor: '#ddd6fe', color: '#6d28d9' }}
              onClick={() => {
                onOpenStripeCheckout();
                setIsOpen(false);
              }}
            >
              <CreditCard size={14} />
              <span style={{ fontWeight: 700 }}>Stripe Course Checkout</span>
            </button>

            <button
              className="btn-primary"
              style={{ justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
              onClick={() => {
                onEnterClassroom('KV-TR-EVAL-DEMO');
                setIsOpen(false);
              }}
            >
              <Video size={14} />
              <span>Direct Live Classroom + Certificate</span>
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4); }
          50% { box-shadow: 0 10px 30px 2px rgba(124, 58, 237, 0.6); }
        }
      `}</style>
    </div>
  );
}
