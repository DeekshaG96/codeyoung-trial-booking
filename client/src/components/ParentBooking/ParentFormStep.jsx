import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Clock, User, Mail, Phone, BookOpen, AlertCircle } from 'lucide-react';

export default function ParentFormStep({ 
  formData, 
  updateFormData, 
  onBack, 
  onCompleteBooking,
  isSubmitting,
  bookingError
}) {
  const isFormValid = formData.parentName.trim() && formData.parentEmail.trim() && formData.parentPhone.trim();

  return (
    <div id="step-parent-form-container">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px' }}>
          Step 3: Confirm contact & booking details 📋
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px' }}>
          We will email the live classroom link and calendar invitation to this address.
        </p>
      </div>

      {bookingError && (
        <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', color: '#991b1b', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <AlertCircle size={20} />
          <div>
            <div style={{ fontWeight: 700 }}>Booking Notice</div>
            <div style={{ fontSize: '13.5px' }}>{bookingError}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Left Col: Contact Form */}
        <div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="input-parent-name">Parent / Guardian Full Name *</label>
            <input
              id="input-parent-name"
              type="text"
              className="form-input"
              placeholder="e.g. Sarah Jenkins"
              value={formData.parentName}
              onChange={(e) => updateFormData({ parentName: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="input-parent-email">Parent Email Address *</label>
            <input
              id="input-parent-email"
              type="email"
              className="form-input"
              placeholder="e.g. sarah.jenkins@example.com"
              value={formData.parentEmail}
              onChange={(e) => updateFormData({ parentEmail: e.target.value })}
              required
            />
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Meeting link and confirmation details will be sent here.
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" htmlFor="input-parent-phone">Parent Phone Number *</label>
            <input
              id="input-parent-phone"
              type="tel"
              className="form-input"
              placeholder="e.g. +1 (555) 234-8901"
              value={formData.parentPhone}
              onChange={(e) => updateFormData({ parentPhone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="input-parent-notes">Special Goals / Prior Experience (Optional)</label>
            <textarea
              id="input-parent-notes"
              className="form-input"
              rows={3}
              placeholder="e.g. Leo loved playing Minecraft and wants to learn how to code his own games."
              value={formData.notes || ''}
              onChange={(e) => updateFormData({ notes: e.target.value })}
            />
          </div>
        </div>

        {/* Right Col: Summary Card */}
        <div>
          <div style={{ background: '#f8fafc', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--primary)" />
              <span>Trial Booking Summary</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Student</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formData.childName} (Age {formData.childAge}{formData.childGrade ? `, ${formData.childGrade}` : ''})
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Subject</span>
                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {formData.subject}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Your Local Time</span>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formData.date} • {formData.selectedSlot?.parentLocalTime?.displayString} ({formData.selectedSlot?.parentLocalTime?.offsetName})
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formData.timezone}
                </div>
              </div>

              <div style={{ background: '#e0e7ff', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '12.5px', color: '#3730a3' }}>
                <strong>🇮🇳 Mentor Equivalent:</strong> {formData.selectedSlot?.mentorLocalTime?.displayString} {formData.selectedSlot?.mentorLocalTime?.dayOffsetNote}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Fee</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>FREE</span>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>$50 Value</span>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Includes 45-minute live 1:1 personalized coaching, skill assessment report, and access to the interactive classroom sandbox.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
        <button id="btn-back-to-step2" className="btn-secondary" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          id="btn-confirm-booking"
          className="btn-primary"
          disabled={!isFormValid || isSubmitting}
          onClick={onCompleteBooking}
        >
          {isSubmitting ? (
            <span>Assigning Mentor...</span>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Confirm & Book Free Trial Class</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
