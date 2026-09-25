import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export default function WaitlistModal({ isOpen, onClose, defaultData }) {
  const [parentName, setParentName] = useState(defaultData.parentName || '');
  const [parentEmail, setParentEmail] = useState(defaultData.parentEmail || '');
  const [parentPhone, setParentPhone] = useState(defaultData.parentPhone || '');
  const [preferredDate, setPreferredDate] = useState(defaultData.date || '');
  const [preferredTimeNotes, setPreferredTimeNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.joinWaitlist({
        parentName,
        parentEmail,
        parentPhone,
        parentTimezone: defaultData.timezone,
        childName: defaultData.childName || 'Student',
        childAge: defaultData.childAge || 10,
        subject: defaultData.subject || 'Coding',
        preferredDate,
        preferredTimeNotes
      });
      setIsSuccess(true);
    } catch (err) {
      alert('Unable to submit waitlist request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" id="waitlist-modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Join Priority Waitlist</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                You're on the Priority Waitlist! 🎯
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                Our academic coordination team will review mentor availability in your timezone (<strong>{defaultData.timezone}</strong>) and reach out to <strong>{parentEmail}</strong> within 12 hours with customized slot options.
              </p>
              <button className="btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
                When all 10 mentors hit their daily 2-demo limit, we open priority callback requests for parents in US/UK timezones.
              </p>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Parent Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Parent Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Preferred Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Ideal Time Window (in {defaultData.timezone})</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Weekday evenings after 5:30 PM EDT"
                  value={preferredTimeNotes}
                  onChange={(e) => setPreferredTimeNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Join Priority Queue'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
