import React from 'react';
import { Code, Terminal, Globe, Cpu, Gamepad2, Calculator, Check, ArrowRight, AlertTriangle } from 'lucide-react';

const SUBJECT_OPTIONS = [
  {
    id: 'Scratch',
    title: 'Scratch & Creative Coding',
    ages: 'Ages 5 - 10',
    minAge: 5,
    maxAge: 10,
    icon: <Code size={26} color="#4f46e5" />,
    bg: '#eef2ff',
    desc: 'Block-based programming, interactive animations, storytelling & foundational computational logic.',
    projectTeaser: '🚀 Space Alien Maze: An interactive game with obstacle collision, scoring & sound effects',
    skills: ['Computational Logic', 'Event Driven Loops', 'Creative Problem Solving']
  },
  {
    id: 'Python',
    title: 'Python & AI for Kids',
    ages: 'Ages 10 - 17',
    minAge: 10,
    maxAge: 17,
    icon: <Terminal size={26} color="#059669" />,
    bg: '#ecfdf5',
    desc: 'Real text-based Python syntax, loops, data structures, and hands-on mini AI applications.',
    projectTeaser: '🤖 AI Secret Codebreaker & Smart Chatbot: Built using Python conditionals & string operations',
    skills: ['Real Python 3 Syntax', 'Data Structures', 'Algorithmic Thinking']
  },
  {
    id: 'Web Development',
    title: 'Full-Stack Web & App Dev',
    ages: 'Ages 11 - 17',
    minAge: 11,
    maxAge: 17,
    icon: <Globe size={26} color="#2563eb" />,
    bg: '#eff6ff',
    desc: 'Build live websites and browser apps using HTML5, modern CSS3, and dynamic JavaScript.',
    projectTeaser: '🌐 Interactive Cyber Portfolio: A modern personal web app with neon button animations',
    skills: ['HTML5 Semantic Structure', 'CSS3 Flex/Grid', 'Interactive JavaScript']
  },
  {
    id: 'Robotics',
    title: 'Robotics & Micro:bit',
    ages: 'Ages 8 - 15',
    minAge: 8,
    maxAge: 15,
    icon: <Cpu size={26} color="#d97706" />,
    bg: '#fffbeb',
    desc: 'Hardware programming with micro:bit & Arduino virtual simulators, smart sensors, and IoT logic.',
    projectTeaser: '🚨 Virtual Intruder Alarm: Smart sensor logic simulator with audio and LED alert beacons',
    skills: ['Virtual Circuitry', 'Sensor Telemetry', 'Embedded Logic']
  },
  {
    id: 'Roblox Studio',
    title: 'Game Design & 3D Worlds',
    ages: 'Ages 9 - 16',
    minAge: 9,
    maxAge: 16,
    icon: <Gamepad2 size={26} color="#7c3aed" />,
    bg: '#f5f3ff',
    desc: 'Create playable 3D games in Roblox Studio using Lua scripting and game physics mechanics.',
    projectTeaser: '🎮 3D Obby Challenge: Custom obstacle parkour with lava jumps, velocity physics & checkpoints',
    skills: ['3D Spatial Reasoning', 'Lua Game Scripts', 'Game Physics Mechanics']
  },
  {
    id: 'Math Olympiad',
    title: 'Math Olympiad & Logic',
    ages: 'Ages 6 - 16',
    minAge: 6,
    maxAge: 16,
    icon: <Calculator size={26} color="#dc2626" />,
    bg: '#fef2f2',
    desc: 'Mental math mastery, logical deduction, patterns, and competitive Olympiad problem solving.',
    projectTeaser: '🧩 Cryptarithm & Magic Matrix: Decode encrypted equations using mathematical pattern deduction',
    skills: ['Olympiad Problem Solving', 'Pattern Deduction', 'Mental Speed Math']
  }
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: '🐣 Complete Beginner', desc: 'No prior coding exposure' },
  { id: 'intermediate', label: '🚀 Curious Explorer', desc: 'Used Scratch or school apps' },
  { id: 'advanced', label: '⚡ Junior Builder', desc: 'Knows basic text code syntax' }
];

export default function ChildSubjectStep({ formData, updateFormData, onNext }) {
  const currentAge = formData.childAge ? parseInt(formData.childAge, 10) : null;

  // Normalize subject lookup so any title/alias maps cleanly to SUBJECT_OPTIONS
  const normalizeSubjectId = (subj) => {
    if (!subj) return 'Scratch';
    const match = SUBJECT_OPTIONS.find(s => 
      s.id.toLowerCase() === subj.toLowerCase() ||
      s.title.toLowerCase() === subj.toLowerCase() ||
      s.id.toLowerCase().includes(subj.toLowerCase()) ||
      subj.toLowerCase().includes(s.id.toLowerCase())
    );
    return match ? match.id : 'Scratch';
  };

  const activeSubjectId = normalizeSubjectId(formData.subject);
  const selectedSubjectObj = SUBJECT_OPTIONS.find(s => s.id === activeSubjectId) || SUBJECT_OPTIONS[0];

  // Age validation
  const isCurrentSubjectOutOfRange = currentAge 
    ? (currentAge < selectedSubjectObj.minAge || currentAge > selectedSubjectObj.maxAge) 
    : false;

  const recommendedSubjectForAge = currentAge 
    ? (SUBJECT_OPTIONS.find(s => currentAge >= s.minAge && currentAge <= s.maxAge) || SUBJECT_OPTIONS[0]) 
    : null;

  const isFormValid = Boolean(formData.childName?.trim() && formData.childAge && activeSubjectId);

  // Dynamic age change with smart auto-switch for out-of-range subjects
  const handleAgeChange = (newAgeStr) => {
    const newAge = newAgeStr ? parseInt(newAgeStr, 10) : null;
    let nextSubject = activeSubjectId;

    if (newAge) {
      const curSub = SUBJECT_OPTIONS.find(s => s.id === activeSubjectId);
      if (curSub && (newAge < curSub.minAge || newAge > curSub.maxAge)) {
        const bestFit = SUBJECT_OPTIONS.find(s => newAge >= s.minAge && newAge <= s.maxAge);
        if (bestFit) {
          nextSubject = bestFit.id;
        }
      }
    }

    updateFormData({ childAge: newAgeStr, subject: nextSubject });
  };

  return (
    <div id="step-child-subject-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
          Step 1: Tell us about your young learner 🚀
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
          We customize every 1:1 trial session to your child's age, curiosity, and existing coding exposure.
        </p>
      </div>

      {/* Child Information Inputs */}
      <div className="form-grid" style={{ marginBottom: '24px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="input-child-name">Child's First Name *</label>
          <input
            id="input-child-name"
            type="text"
            className="form-input"
            placeholder="e.g. Leo, Sophia, Aarush"
            value={formData.childName}
            onChange={(e) => updateFormData({ childName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-child-age">Child's Age *</label>
          <select
            id="input-child-age"
            className="form-input select-input"
            value={formData.childAge}
            onChange={(e) => handleAgeChange(e.target.value)}
            required
          >
            <option value="">Select Age</option>
            {Array.from({ length: 13 }, (_, i) => i + 5).map((age) => (
              <option key={age} value={age}>
                {age} years old
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-child-grade">Grade / Year (Optional)</label>
          <input
            id="input-child-grade"
            type="text"
            className="form-input"
            placeholder="e.g. Grade 4, Year 6"
            value={formData.childGrade}
            onChange={(e) => updateFormData({ childGrade: e.target.value })}
          />
        </div>
      </div>

      {/* Coding Experience Level Selector */}
      <div style={{ marginBottom: '24px' }}>
        <label className="form-label" style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
          Prior Coding Experience (Helps mentor calibrate pacing)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {EXPERIENCE_LEVELS.map(exp => {
            const isSelected = (formData.experienceLevel || 'beginner') === exp.id;
            return (
              <div
                key={exp.id}
                onClick={() => updateFormData({ experienceLevel: exp.id })}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border-subtle)',
                  background: isSelected ? '#eef2ff' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {exp.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {exp.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Out of Range Pedagogical Warning Banner */}
      {isCurrentSubjectOutOfRange && recommendedSubjectForAge && (
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 4px rgba(245, 158, 11, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={22} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#92400e' }}>
                Age Advisory for {formData.childName || 'Your Child'} ({currentAge} years old)
              </div>
              <div style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>
                <strong>{selectedSubjectObj.title}</strong> is designed for {selectedSubjectObj.ages}. For age {currentAge}, we recommend <strong>{recommendedSubjectForAge.title}</strong> (⭐ Best for Age {currentAge}) for optimal learning outcomes.
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            style={{
              background: 'white',
              borderColor: '#f59e0b',
              color: '#b45309',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 800,
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
            onClick={() => updateFormData({ subject: recommendedSubjectForAge.id })}
          >
            ⚡ Switch to {recommendedSubjectForAge.id} ({recommendedSubjectForAge.ages})
          </button>
        </div>
      )}

      {/* Subject Cards Selection */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label className="form-label" style={{ fontSize: '15px', margin: 0 }}>
            Select Subject of Interest *
          </label>
          {currentAge && (
            <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
              Showing personalized fits for age {currentAge}
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Choose a discipline. Our matching engine pairs your child with a mentor specializing in this topic.
        </p>

        <div className="subject-grid">
          {SUBJECT_OPTIONS.map((sub) => {
            const isSelected = activeSubjectId === sub.id;
            const isAgeRecommended = currentAge && currentAge >= sub.minAge && currentAge <= sub.maxAge;
            const isOutOfRange = currentAge && (currentAge < sub.minAge || currentAge > sub.maxAge);

            return (
              <div
                key={sub.id}
                id={`subject-card-${sub.id.toLowerCase().replace(/\s+/g, '-')}`}
                className={`subject-card ${isSelected ? 'selected' : ''}`}
                onClick={() => updateFormData({ subject: sub.id })}
                style={{ position: 'relative' }}
              >
                {isAgeRecommended && (
                  <div style={{
                    position: 'absolute',
                    top: '-9px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                  }}>
                    ⭐ Best for Age {currentAge}
                  </div>
                )}

                {isOutOfRange && isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '-9px',
                    right: '12px',
                    background: '#dc2626',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)'
                  }}>
                    ⚠️ {sub.ages} (Child is {currentAge})
                  </div>
                )}

                <div>
                  <div className="subject-icon-box" style={{ background: sub.bg }}>
                    {sub.icon}
                  </div>
                  <div className="subject-title">{sub.title}</div>
                  <span className="subject-age-badge">{sub.ages}</span>
                  <p className="subject-desc">{sub.desc}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {isSelected ? 'Selected' : 'Click to select'}
                  </span>
                  {isSelected && (
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <Check size={14} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Project Teaser for Selected Subject */}
      {selectedSubjectObj && (
        <div id="project-teaser-card" style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
          border: '1.5px solid #a7f3d0',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 800, color: '#065f46' }}>
            <span>🎯 What {formData.childName || 'Your Child'} Will Build in this 45-Minute Trial ({selectedSubjectObj.title}):</span>
          </div>
          <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#047857' }}>
            {selectedSubjectObj.projectTeaser}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
            {selectedSubjectObj.skills.map((skill, idx) => (
              <span key={idx} style={{
                background: 'white',
                border: '1px solid #6ee7b7',
                color: '#065f46',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)'
              }}>
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trust Badges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        padding: '14px',
        background: '#f8fafc',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        marginBottom: '28px'
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🌟</span> <strong>100% 1:1 Focus</strong> (Never group calls)
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🛡️</span> <strong>Senior Mentors</strong> (Capped at 2 demos/day)
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>💻</span> <strong>Live Working Code</strong> (Built in browser)
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button
          id="btn-proceed-to-slots"
          className="btn-primary"
          style={{ width: '100%', maxWidth: '260px' }}
          disabled={!isFormValid}
          onClick={onNext}
        >
          <span>Choose Date & Time Slot</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
