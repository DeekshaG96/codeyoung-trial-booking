import React, { useState, useEffect } from 'react';
import { 
  Video, Mic, MicOff, VideoOff, Play, Send, CheckCircle2, 
  Terminal, Sparkles, MessageSquare, PhoneOff, Share2, Layers, Award,
  Printer, X, Star, ShieldCheck, Download
} from 'lucide-react';
import { api } from '../../services/api';

export default function VirtualClassroom({ bookingId, onBackToBooking }) {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState('python');
  const [showCertificate, setShowCertificate] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([
    'Initializing Codeyoung Cloud Sandbox...',
    'Python 3.11 Runtime Ready 🚀',
    'Interactive 1:1 Workspace Connected.'
  ]);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Mentor Aarav', time: '10:01 AM', text: "Welcome to Codeyoung! Today we're going to build your very first interactive game!" },
    { sender: 'Student', time: '10:02 AM', text: "Awesome! I'm ready!" },
    { sender: 'Mentor Aarav', time: '10:03 AM', text: "Let's run the code and see the spaceship blast off!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [code, setCode] = useState(`# Codeyoung 1:1 Live Trial Class Project
# Building a Space Adventure Quest!

player_name = "Young Innovator"
energy = 100
level = 1

print(f"🚀 Welcome to Space Academy, {player_name}!")

def explore_alien_planet():
    global energy, level
    print("🛸 Scanning strange planet surface...")
    energy -= 15
    level += 1
    print(f"✨ Level Up! Current Level: {level} | Energy: {energy}")

# Click 'Run Code' to execute live!
explore_alien_planet()
`);

  const handleRunCode = () => {
    setConsoleOutput(prev => [
      ...prev,
      `>>> Running project at ${new Date().toLocaleTimeString()}...`,
      '🚀 Welcome to Space Academy, Young Innovator!',
      '🛸 Scanning strange planet surface...',
      '✨ Level Up! Current Level: 2 | Energy: 85',
      '🎉 Code execution completed with 0 errors!'
    ]);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'You', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: chatInput }
    ]);
    setChatInput('');
  };

  return (
    <div className="classroom-container" id="virtual-live-classroom">
      {/* Classroom Top Bar */}
      <div className="classroom-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', display: 'inline-block' }} />
            <span>LIVE TRIAL SESSION</span>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
              Codeyoung 1:1 Live Classroom
            </h3>
            <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              Session Ref: <strong style={{ color: '#818cf8' }}>{bookingId || 'CY-TR-LIVE-DEMO'}</strong>
            </span>
          </div>
        </div>

        {/* Center Timer */}
        <div style={{ background: '#0f172a', padding: '6px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>
          <span>Session Timer:</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{formatTimer(secondsRemaining)}</span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            id="btn-open-certificate"
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', padding: '6px 14px', fontSize: '12.5px', border: 'none' }}
            onClick={() => setShowCertificate(true)}
          >
            <Award size={15} />
            <span>Trial Certificate</span>
          </button>

          <button
            className="btn-secondary"
            style={{ background: '#334155', color: 'white', borderColor: '#475569', padding: '6px 12px', fontSize: '12px' }}
            onClick={onBackToBooking}
          >
            Leave Classroom
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="classroom-main">
        {/* Left Column: Video Feeds */}
        <div style={{ background: '#1e293b', borderRight: '1px solid #334155', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Mentor Video Tile */}
          <div className="video-tile" style={{ height: '210px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', color: '#38bdf8', fontWeight: 700 }}>
                👨‍🏫 Mentor Feed (India)
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} title="Microphone Active" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                alt="Mentor"
                style={{ width: 68, height: 68, borderRadius: '50%', border: '3px solid #6366f1', margin: '0 auto 8px auto', objectFit: 'cover' }}
              />
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Aarav Sharma</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Lead Coding Educator • IST</div>
            </div>

            <div style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center' }}>
              1:1 Active Encrypted Connection
            </div>
          </div>

          {/* Student Video Tile */}
          <div className="video-tile" style={{ height: '210px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', color: '#a78bfa', fontWeight: 700 }}>
                👶 Student Feed (US/UK)
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 8px auto', color: 'white' }}>
                🚀
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>Young Innovator</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Trial Participant</div>
            </div>

            <div style={{ fontSize: '10.5px', color: '#64748b', textAlign: 'center' }}>
              Screen Shared: Live Sandbox
            </div>
          </div>

          {/* Video / Audio Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 'auto' }}>
            <button
              className="btn-secondary"
              style={{ padding: '8px', borderRadius: '50%', background: micOn ? '#334155' : '#ef4444', color: 'white', borderColor: '#475569' }}
              onClick={() => setMicOn(!micOn)}
              title={micOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micOn ? <Mic size={16} /> : <MicOff size={16} />}
            </button>

            <button
              className="btn-secondary"
              style={{ padding: '8px', borderRadius: '50%', background: videoOn ? '#334155' : '#ef4444', color: 'white', borderColor: '#475569' }}
              onClick={() => setVideoOn(!videoOn)}
              title={videoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
            </button>
          </div>
        </div>

        {/* Center Column: Live Code Sandbox */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#1e1e1e', overflow: 'hidden' }}>
          {/* Editor Tabs & Run Button */}
          <div style={{ background: '#2d3748', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #4a5568' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{ background: activeTab === 'python' ? '#1e1e1e' : 'transparent', color: activeTab === 'python' ? '#68d391' : '#a0aec0', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setActiveTab('python')}
              >
                <Terminal size={14} />
                <span>main.py</span>
              </button>
              <button
                style={{ background: activeTab === 'scratch' ? '#1e1e1e' : 'transparent', color: activeTab === 'scratch' ? '#f6ad55' : '#a0aec0', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setActiveTab('scratch')}
              >
                <Layers size={14} />
                <span>Visual Blocks (Scratch)</span>
              </button>
            </div>

            <button
              id="btn-run-code"
              className="btn-primary"
              style={{ padding: '6px 16px', fontSize: '13px', background: '#22c55e' }}
              onClick={handleRunCode}
            >
              <Play size={14} fill="white" />
              <span>Run Code</span>
            </button>
          </div>

          {/* Code Textarea / Blocks */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {activeTab === 'python' ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{ flex: 1, background: '#1e1e1e', color: '#e2e8f0', border: 'none', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '13.5px', resize: 'none', outline: 'none', lineHeight: 1.6 }}
                spellCheck="false"
              />
            ) : (
              <div style={{ flex: 1, background: '#2d3748', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#4c51bf', color: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, width: 'fit-content' }}>
                  when 🟢 clicked
                </div>
                <div style={{ background: '#2b6cb0', color: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, width: 'fit-content', marginLeft: '16px' }}>
                  repeat (10) times
                </div>
                <div style={{ background: '#319795', color: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, width: 'fit-content', marginLeft: '32px' }}>
                  move (15) steps & play sound 'laser_blast'
                </div>
                <div style={{ background: '#805ad5', color: 'white', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, width: 'fit-content', marginLeft: '32px' }}>
                  say "I learned coding with Codeyoung!" for 2 seconds
                </div>
              </div>
            )}

            {/* Console Output Bar */}
            <div style={{ height: '140px', background: '#111827', borderTop: '1px solid #374151', padding: '10px 16px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#a7f3d0' }}>
              <div style={{ color: '#9ca3af', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase' }}>Terminal Output:</div>
              {consoleOutput.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chat & Learning Checklist */}
        <div style={{ background: '#1e293b', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          {/* Milestone Checklist */}
          <div style={{ padding: '14px', borderBottom: '1px solid #334155' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Trial Milestone Checklist
            </span>
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e' }}>
                <CheckCircle2 size={13} />
                <span>Icebreaker & Child Curiosity</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e' }}>
                <CheckCircle2 size={13} />
                <span>Computational Thinking Puzzle</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e' }}>
                <CheckCircle2 size={13} />
                <span>Hands-on Project Building</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid #fbbf24', display: 'inline-block' }} />
                <span>Parent Curriculum Roadmap</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ background: msg.sender === 'You' ? '#312e81' : '#334155', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontSize: '10.5px', color: '#94a3b8' }}>
                  <strong>{msg.sender}</strong>
                  <span>{msg.time}</span>
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Chat Input Box */}
          <form onSubmit={handleSendChat} style={{ padding: '10px 14px', background: '#0f172a', borderTop: '1px solid #334155', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Type message to mentor..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{ flex: 1, background: '#1e293b', border: '1px solid #475569', borderRadius: '4px', padding: '6px 10px', color: 'white', fontSize: '12px', outline: 'none' }}
            />
            <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer' }}>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '650px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            {/* Certificate Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              padding: '24px 28px',
              color: 'white',
              textAlign: 'center',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowCertificate(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                <Award size={16} color="#fbbf24" />
                <span>CODEYOUNG × TALENTISE GLOBAL</span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0', letterSpacing: '0.02em', color: '#fbbf24' }}>
                Certificate of Achievement
              </h2>
              <p style={{ fontSize: '13px', color: '#c7d2fe', margin: 0 }}>
                1:1 Live Coding Trial Class • Official Verification
              </p>
            </div>

            {/* Certificate Body */}
            <div style={{ padding: '32px 36px', textAlign: 'center', background: '#fafaf9' }}>
              <p style={{ fontSize: '13px', color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, margin: '0 0 8px 0' }}>
                This is proudly presented to
              </p>

              <div style={{ fontSize: '28px', fontWeight: 800, color: '#1c1917', fontFamily: 'Georgia, serif', borderBottom: '2px dashed #d6d3d1', display: 'inline-block', paddingBottom: '6px', minWidth: '280px', margin: '0 auto 16px auto' }}>
                Young Innovator
              </div>

              <p style={{ fontSize: '14px', color: '#44403c', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px auto' }}>
                For outstanding curiosity, computational logic, and successfully building their first interactive computer program in the <strong>Codeyoung 1:1 Live Trial Class</strong>.
              </p>

              {/* Signatures & Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e7e5e4' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#4f46e5' }}>
                    {bookingId || 'CY-TR-LIVE-DEMO'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#a8a29e', marginTop: '2px' }}>Verification ID</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto', color: 'white', boxShadow: '0 4px 6px -1px rgba(217, 119, 6, 0.3)' }}>
                    <ShieldCheck size={28} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>Verified STEM</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#1c1917' }}>
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '11px', color: '#a8a29e', marginTop: '2px' }}>Date Issued</div>
                </div>
              </div>
            </div>

            {/* Certificate Footer Actions */}
            <div style={{ background: '#f5f5f4', padding: '16px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#78716c' }}>
                Accredited by STEM.org & Talentise Global
              </span>
              <button
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '13px' }}
                onClick={() => window.print()}
              >
                <Printer size={15} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
