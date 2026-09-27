import React, { useState } from 'react';
import ChildSubjectStep from './ChildSubjectStep';
import SlotPickerStep from './SlotPickerStep';
import ParentFormStep from './ParentFormStep';
import BookingSuccess from './BookingSuccess';
import WaitlistModal from './WaitlistModal';
import { api } from '../../services/api';
import { getBrowserTimezone } from '../../utils/timezones';
import { triggerCelebrationConfetti } from '../../utils/confetti';
import { useAuth } from '../../services/authContext';
import { Check, Calendar, User, Clock, AlertTriangle, LogIn } from 'lucide-react';

export default function BookingWizard({ onEnterClassroom, onOpenEmails, presetData }) {
  const { user, openAuthModal } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    childName: presetData?.childName || user?.childName || '',
    childAge: presetData?.childAge || user?.childAge || '9',
    childGrade: 'Grade 4',
    subject: presetData?.subject || 'Scratch',
    timezone: presetData?.timezone || user?.timezone || getBrowserTimezone(),
    date: '',
    selectedSlot: null,
    startUtc: '',
    endUtc: '',
    parentName: user?.role === 'parent' ? user.name : '',
    parentEmail: user?.role === 'parent' ? user.email : '',
    parentPhone: user?.phone || '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [suggestedAlternatives, setSuggestedAlternatives] = useState([]);

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleCompleteBooking = async () => {
    setIsSubmitting(true);
    setBookingError(null);
    setSuggestedAlternatives([]);

    try {
      const payload = {
        parentName: formData.parentName,
        parentEmail: formData.parentEmail,
        parentPhone: formData.parentPhone,
        parentTimezone: formData.timezone,
        childName: formData.childName,
        childAge: formData.childAge,
        childGrade: formData.childGrade,
        subject: formData.subject,
        startUtc: formData.startUtc,
        endUtc: formData.endUtc
      };

      const res = await api.createBooking(payload);

      if (res.success) {
        setBookingResult(res);
        setCurrentStep(4);
        triggerCelebrationConfetti();
      } else if (res.error === 'NO_MENTORS_AVAILABLE') {
        // Empathetic error state with alternatives
        setBookingError(res.message);
        if (res.suggestedSlots && res.suggestedSlots.length > 0) {
          setSuggestedAlternatives(res.suggestedSlots);
        }
      } else {
        setBookingError(res.message || 'Booking could not be finalized. Please select another slot.');
      }
    } catch (err) {
      setBookingError(err.message || 'Network error while assigning mentor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAlternativeSlot = (slot) => {
    updateFormData({
      selectedSlot: slot,
      startUtc: slot.startUtc,
      endUtc: slot.endUtc
    });
    setBookingError(null);
    setSuggestedAlternatives([]);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setBookingResult(null);
    setBookingError(null);
    setSuggestedAlternatives([]);
    setFormData({
      childName: '',
      childAge: '9',
      childGrade: 'Grade 4',
      subject: 'Scratch',
      timezone: getBrowserTimezone(),
      date: '',
      selectedSlot: null,
      startUtc: '',
      endUtc: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      notes: ''
    });
  };

  return (
    <div className="glass-card" id="booking-wizard-card">
      {/* Guest Sign-In Banner */}
      {!user && currentStep < 4 && (
        <div style={{
          background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
          border: '1px solid #c7d2fe',
          borderRadius: '12px',
          padding: '10px 16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ fontSize: '12.5px', color: '#3730a3', lineHeight: 1.4 }}>
            <span>👋 Have an account? <strong>Sign In</strong> to auto-fill your contact details and view previous trial bookings.</span>
          </div>
          <button
            id="btn-booking-signin"
            onClick={() => openAuthModal('signin')}
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '11.5px',
              borderRadius: 'var(--radius-pill)',
              background: '#4f46e5',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              flexShrink: 0
            }}
          >
            <LogIn size={12} />
            <span>Sign In</span>
          </button>
        </div>
      )}

      {/* Wizard Step Progression Header */}
      {currentStep < 4 && (
        <div className="wizard-header">
          <div className="wizard-steps">
            <div className={`step-indicator ${currentStep === 1 ? 'active' : (currentStep > 1 ? 'completed' : '')}`}>
              <div className="step-circle">
                {currentStep > 1 ? <Check size={16} /> : '1'}
              </div>
              <span>Student & Subject</span>
            </div>

            <div className="step-divider" />

            <div className={`step-indicator ${currentStep === 2 ? 'active' : (currentStep > 2 ? 'completed' : '')}`}>
              <div className="step-circle">
                {currentStep > 2 ? <Check size={16} /> : '2'}
              </div>
              <span>Date & Local Slot</span>
            </div>

            <div className="step-divider" />

            <div className={`step-indicator ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-circle">3</div>
              <span>Contact & Review</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <Clock size={15} color="var(--primary)" />
            <span>45-Min 1:1 Live Interactive Class</span>
          </div>
        </div>
      )}

      {/* Alternative Slots Suggestion Banner if No Mentors Available */}
      {suggestedAlternatives.length > 0 && (
        <div style={{ background: '#fffbeb', borderBottom: '1.5px solid #fef3c7', padding: '16px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 700, marginBottom: '6px' }}>
            <AlertTriangle size={18} />
            <span>Requested Slot Fully Booked! Here are the 3 nearest available slots:</span>
          </div>
          <p style={{ fontSize: '13px', color: '#92400e', marginBottom: '12px' }}>
            All mentors have hit their 2-demo daily cap for that time. Select one of these alternate slots to immediately secure your session:
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {suggestedAlternatives.map(slot => (
              <button
                key={slot.id}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '13px', borderColor: '#fde68a' }}
                onClick={() => handleSelectAlternativeSlot(slot)}
              >
                {slot.parentLocalTime.displayString} ({slot.availableMentorsCount} free)
              </button>
            ))}
            <button
              className="btn-outline-primary"
              style={{ padding: '8px 14px', fontSize: '13px' }}
              onClick={() => setIsWaitlistOpen(true)}
            >
              Join Priority Waitlist Instead
            </button>
          </div>
        </div>
      )}

      {/* Wizard Step Body */}
      <div className="wizard-body">
        {currentStep === 1 && (
          <ChildSubjectStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <SlotPickerStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            onOpenWaitlist={() => setIsWaitlistOpen(true)}
          />
        )}

        {currentStep === 3 && (
          <ParentFormStep
            formData={formData}
            updateFormData={updateFormData}
            onBack={() => setCurrentStep(2)}
            onCompleteBooking={handleCompleteBooking}
            isSubmitting={isSubmitting}
            bookingError={bookingError}
          />
        )}

        {currentStep === 4 && (
          <BookingSuccess
            bookingData={bookingResult?.booking}
            assignedMentor={bookingResult?.assignedMentor}
            onEnterClassroom={onEnterClassroom}
            onOpenEmails={onOpenEmails}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Priority Waitlist Modal */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        defaultData={formData}
      />
    </div>
  );
}
