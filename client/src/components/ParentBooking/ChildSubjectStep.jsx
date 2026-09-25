import React from 'react';
import { Code, Terminal, Globe, Cpu, Gamepad2, Calculator, Check, ArrowRight } from 'lucide-react';

const SUBJECT_OPTIONS = [
  {
    id: 'Scratch',
    title: 'Scratch & Creative Coding',
    ages: 'Ages 5 - 10',
    icon: <Code size={26} color="#4f46e5" />,
    bg: '#eef2ff',
    desc: 'Block-based programming, interactive animations, storytelling & foundational computational logic.'
  },
  {
    id: 'Python',
    title: 'Python & AI for Kids',
    ages: 'Ages 10 - 17',
    icon: <Terminal size={26} color="#059669" />,
    bg: '#ecfdf5',
    desc: 'Real text-based Python syntax, loops, data structures, and hands-on mini AI applications.'
  },
  {
    id: 'Web Development',
    title: 'Full-Stack Web & App Dev',
    ages: 'Ages 11 - 17',
    icon: <Globe size={26} color="#2563eb" />,
    bg: '#eff6ff',
    desc: 'Build live websites and browser apps using HTML5, modern CSS3, and dynamic JavaScript.'
  },
  {
    id: 'Robotics',
    title: 'Robotics & Micro:bit',
    ages: 'Ages 8 - 15',
    icon: <Cpu size={26} color="#d97706" />,
    bg: '#fffbeb',
    desc: 'Hardware programming with micro:bit & Arduino virtual simulators, smart sensors, and IoT logic.'
  },
  {
    id: 'Roblox Studio',
    title: 'Game Design & 3D Worlds',
    ages: 'Ages 9 - 16',
    icon: <Gamepad2 size={26} color="#7c3aed" />,
    bg: '#f5f3ff',
    desc: 'Create playable 3D games in Roblox Studio using Lua scripting and game physics mechanics.'
  },
  {
    id: 'Math Olympiad',
    title: 'Math Olympiad & Logic',
    ages: 'Ages 6 - 16',
    icon: <Calculator size={26} color="#dc2626" />,
    bg: '#fef2f2',
    desc: 'Mental math mastery, logical deduction, patterns, and competitive Olympiad problem solving.'
  }
];

export default function ChildSubjectStep({ formData, updateFormData, onNext }) {
  const isFormValid = formData.childName.trim() && formData.childAge && formData.subject;

  return (
    <div id="step-child-subject-container">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
          Step 1: Tell us about your young learner 🚀
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
          We customize every 1:1 trial session to your child's age, curiosity, and existing coding exposure.
        </p>
      </div>

      {/* Child Information Inputs */}
      <div className="form-grid" style={{ marginBottom: '32px' }}>
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
            onChange={(e) => updateFormData({ childAge: e.target.value })}
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

      {/* Subject Cards Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label className="form-label" style={{ fontSize: '15px' }}>
          Select Subject of Interest *
        </label>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Choose a discipline. Our matching engine pairs your child with a mentor specializing in this topic.
        </p>

        <div className="subject-grid">
          {SUBJECT_OPTIONS.map((sub) => {
            const isSelected = formData.subject === sub.id;
            return (
              <div
                key={sub.id}
                id={`subject-card-${sub.id.toLowerCase().replace(/\s+/g, '-')}`}
                className={`subject-card ${isSelected ? 'selected' : ''}`}
                onClick={() => updateFormData({ subject: sub.id })}
              >
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

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
        <button
          id="btn-proceed-to-slots"
          className="btn-primary"
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
