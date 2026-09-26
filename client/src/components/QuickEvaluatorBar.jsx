import React, { useState } from 'react';
import { Zap, ChevronUp, ChevronDown, Check, Globe, Users, Video, Mail, PlayCircle, Sparkles } from 'lucide-react';

export default function QuickEvaluatorBar({ 
  onSelectPreset,
  setActiveTab,
  onEnterClassroom
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 90,
      fontFamily: 'var(--font-body)'
    }}>
      {/* Collapsed Pill Button */}
      {!isOpen ? (
        <button
          id="btn-open-evaluator-dock"
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)',
            color: 'white',
            border: '1.5px solid #818cf8',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.5)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            animation: 'pulseGlow 2.5s infinite'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Sparkles size={16} color="#fbbf24" />
          <span>⚡ Evaluator Quick Presets</span>
          <ChevronUp size={16} />
        </button>
      ) : (
        /* Expanded Floating Card */
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1.5px solid #c7d2fe',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
          padding: '16px 18px',
          width: '320px',
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
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ChevronDown size={18} />
            </button>
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
