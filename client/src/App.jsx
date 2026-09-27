import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BookingWizard from './components/ParentBooking/BookingWizard';
import MentorOverview from './components/MentorDashboard/MentorOverview';
import SimulationRunner from './components/MentorDashboard/SimulationRunner';
import VirtualClassroom from './components/VirtualClassroom/VirtualClassroom';
import EmailModal from './components/EmailSimulator/EmailModal';
import DstInspectorModal from './components/DstInspectorModal';
import QuickEvaluatorBar from './components/QuickEvaluatorBar';
import TelemetryDashboard from './components/DeveloperSuite/TelemetryDashboard';
import StripeCheckoutModal from './components/DeveloperSuite/StripeCheckoutModal';
import AuthModal from './components/Auth/AuthModal';
import { useAuth } from './services/authContext';
import { api } from './services/api';
import { Sparkles, Calendar, Clock, Globe, Shield, Award, CheckCircle, ShieldCheck } from 'lucide-react';

export default function App() {
  const { user, userRole, switchRole, authToast } = useAuth();
  const [activeTab, setActiveTab] = useState('booking');
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [resetToast, setResetToast] = useState(null);
  const [isDstInspectorOpen, setIsDstInspectorOpen] = useState(false);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [evaluatorPreset, setEvaluatorPreset] = useState(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const handleResetData = async () => {
    try {
      await api.resetData();
      setResetToast('System baseline data reset successfully.');
      setTimeout(() => setResetToast(null), 3500);
    } catch (err) {
      alert('Reset failed: ' + err.message);
    }
  };

  const handleEnterClassroom = (bookingId = 'KV-TR-LIVE-DEMO') => {
    setActiveBookingId(bookingId);
    setActiveTab('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (preset) => {
    setEvaluatorPreset(preset);
    setActiveTab('booking');
  };

  const handleSwitchRole = (role) => {
    switchRole(role);
    if (role === 'mentor') {
      setActiveTab('mentors');
    } else {
      setActiveTab('booking');
    }
  };

  const currentToast = authToast || resetToast;

  return (
    <div className="app-container" id="kodaverse-app-root">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        onOpenDstInspector={() => setIsDstInspectorOpen(true)}
        userRole={userRole}
        onSwitchRole={handleSwitchRole}
        onOpenPresets={() => setIsPresetsOpen(prev => !prev)}
      />

      {/* Global Reset / Auth Toast */}
      {currentToast && (
        <div style={{ background: '#059669', color: 'white', padding: '10px 24px', textAlign: 'center', fontSize: '13.5px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          <span>{currentToast}</span>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal />

      {/* Hero Banner (Shown on booking portal) */}
      {activeTab === 'booking' && (
        <section className="hero-banner" id="hero-banner-section" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}>
          <div className="hero-content">
            <div className="hero-text-col">
              <div className="hero-badge-pill" style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(165, 180, 252, 0.3)' }}>
                <Sparkles size={14} color="#38bdf8" />
                <span>Kodaverse™ • The Global 1:1 Coding & STEM Mentorship Platform</span>
              </div>
              <h1 className="hero-title" style={{ letterSpacing: '-0.03em' }}>
                Where Young Minds Launch Their Journey Into Tomorrow's Technology
              </h1>
              <p className="hero-subtitle">
                Join Kodaverse for an exclusive 1:1 live trial session. Pick your local time anywhere in the US, UK, or globally — our intelligent scheduling engine pairs your child with a certified STEM mentor in real time with 100% Daylight Saving synchronization.
              </p>
            </div>

            <div className="hero-stats-box" style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div className="hero-stat-item">
                <div className="hero-stat-val">10</div>
                <div className="hero-stat-label">Senior Mentors</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
              <div className="hero-stat-item">
                <div className="hero-stat-val">2 Max</div>
                <div className="hero-stat-label">Demos/Day Quota</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }} />
              <div className="hero-stat-item">
                <div className="hero-stat-val">100%</div>
                <div className="hero-stat-label">IANA DST Precision</div>
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
            onOpenStripeCheckout={() => setIsStripeOpen(true)}
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
            onOpenStripeCheckout={() => setIsStripeOpen(true)}
          />
        )}

        {activeTab === 'emails' && (
          <EmailModal
            onEnterClassroom={handleEnterClassroom}
          />
        )}

        {activeTab === 'analytics' && (
          <TelemetryDashboard
            onOpenStripeCheckout={() => setIsStripeOpen(true)}
          />
        )}
      </main>

      {/* Quick Evaluator Dock */}
      <QuickEvaluatorBar
        isOpen={isPresetsOpen}
        setIsOpen={setIsPresetsOpen}
        onSelectPreset={handleSelectPreset}
        setActiveTab={setActiveTab}
        onEnterClassroom={handleEnterClassroom}
        onOpenStripeCheckout={() => setIsStripeOpen(true)}
      />

      {/* DST Inspector Modal */}
      {isDstInspectorOpen && (
        <DstInspectorModal
          onClose={() => setIsDstInspectorOpen(false)}
        />
      )}

      {/* Stripe Checkout Modal */}
      {isStripeOpen && (
        <StripeCheckoutModal
          onClose={() => setIsStripeOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>Kodaverse™ | The Global 1:1 Coding & STEM Mentorship Platform</strong>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
              Full-Stack Architecture: React 19 • Node.js • Firebase Auth & Hosting • Gemini AI • Data Connect • Stripe • PostHog • Sentry
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '12.5px' }}>
            <div>Engineered by <strong>Deeksha G</strong> (SIT Mangaluru)</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
              Talentise Global × Codeyoung Engineering Submission
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
