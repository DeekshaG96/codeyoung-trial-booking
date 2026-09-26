import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BookingWizard from './components/ParentBooking/BookingWizard';
import MentorOverview from './components/MentorDashboard/MentorOverview';
import SimulationRunner from './components/MentorDashboard/SimulationRunner';
import VirtualClassroom from './components/VirtualClassroom/VirtualClassroom';
import EmailModal from './components/EmailSimulator/EmailModal';
import DstInspectorModal from './components/DstInspectorModal';
import QuickEvaluatorBar from './components/QuickEvaluatorBar';
import { api } from './services/api';
import { Sparkles, Calendar, Clock, Globe, Shield, Award, CheckCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('booking');
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [resetToast, setResetToast] = useState(null);
  const [isDstInspectorOpen, setIsDstInspectorOpen] = useState(false);
  const [evaluatorPreset, setEvaluatorPreset] = useState(null);

  const handleResetData = async () => {
    try {
      await api.resetData();
      setResetToast('System data reset to initial baseline state successfully.');
      setTimeout(() => setResetToast(null), 3500);
    } catch (err) {
      alert('Reset failed: ' + err.message);
    }
  };

  const handleEnterClassroom = (bookingId = 'CY-TR-LIVE-DEMO') => {
    setActiveBookingId(bookingId);
    setActiveTab('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (preset) => {
    setEvaluatorPreset(preset);
    setActiveTab('booking');
  };

  return (
    <div className="app-container" id="codeyoung-app-root">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        onOpenDstInspector={() => setIsDstInspectorOpen(true)}
      />

      {/* Global Reset Toast */}
      {resetToast && (
        <div style={{ background: '#059669', color: 'white', padding: '10px 24px', textAlign: 'center', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          <span>{resetToast}</span>
        </div>
      )}

      {/* Hero Banner (Shown on booking portal) */}
      {activeTab === 'booking' && (
        <section className="hero-banner" id="hero-banner-section">
          <div className="hero-content">
            <div className="hero-text-col">
              <div className="hero-badge-pill">
                <Sparkles size={14} color="#fbbf24" />
                <span>Codeyoung Orbit™ • Global 1:1 Live Coding Trial Platform</span>
              </div>
              <h1 className="hero-title">
                Inspire Your Child's Tech Future with 1:1 Live Coding Coaching
              </h1>
              <p className="hero-subtitle">
                Experience Codeyoung's award-winning curriculum. Pick a convenient time in your local time zone — our matching engine automatically pairs your child with a certified STEM mentor in India with zero timezone friction.
              </p>
            </div>

            <div className="hero-stats-box">
              <div className="hero-stat-item">
                <div className="hero-stat-val">10</div>
                <div className="hero-stat-label">Dedicated Mentors</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
              <div className="hero-stat-item">
                <div className="hero-stat-val">2 Max</div>
                <div className="hero-stat-label">Demos/Day Cap</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
              <div className="hero-stat-item">
                <div className="hero-stat-val">100%</div>
                <div className="hero-stat-label">IANA DST Synced</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="main-wrapper" style={{ marginTop: activeTab === 'booking' ? '-24px' : '32px' }}>
        {activeTab === 'booking' && (
          <BookingWizard
            key={evaluatorPreset ? JSON.stringify(evaluatorPreset) : 'default'}
            presetData={evaluatorPreset}
            onEnterClassroom={handleEnterClassroom}
            onOpenEmails={() => setActiveTab('emails')}
          />
        )}

        {activeTab === 'mentors' && (
          <MentorOverview
            onEnterClassroom={handleEnterClassroom}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationRunner
            onSimulationComplete={() => {}}
          />
        )}

        {activeTab === 'classroom' && (
          <VirtualClassroom
            bookingId={activeBookingId}
            onBackToBooking={() => setActiveTab('booking')}
          />
        )}

        {activeTab === 'emails' && (
          <EmailModal
            onEnterClassroom={handleEnterClassroom}
          />
        )}
      </main>

      {/* Quick Evaluator Dock */}
      <QuickEvaluatorBar
        onSelectPreset={handleSelectPreset}
        setActiveTab={setActiveTab}
        onEnterClassroom={handleEnterClassroom}
      />

      {/* DST Inspector Modal */}
      {isDstInspectorOpen && (
        <DstInspectorModal
          onClose={() => setIsDstInspectorOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>Codeyoung Orbit™ | 1:1 Live Coding Appointment Booking Platform</strong>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
              Full-Stack Engineering Task • Talentise Global Campus Recruitment
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '12.5px' }}>
            <div>Engineered by <strong>Deeksha G</strong> (SIT Mangaluru)</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
              React 19 • Node.js • Luxon IANA Timezones • Strict 2-Demo Limit Engine
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
