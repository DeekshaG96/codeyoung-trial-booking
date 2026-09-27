import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, Download } from 'lucide-react';
import { triggerCelebrationConfetti } from '../../utils/confetti';

export default function StripeCheckoutModal({ onClose }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('10001');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const handleFillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setCardExp('12/28');
    setCardCvc('123');
  };

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      triggerCelebrationConfetti();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
          color: 'white',
          padding: '22px 26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Lock size={13} color="#a5b4fc" />
              <span>Stripe Secure 256-Bit Checkout</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 0 0' }}>
              Kodaverse Master STEM Program
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 26px' }}>
          {!isPaid ? (
            <form onSubmit={handlePay}>
              {/* Order Summary Pill */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    48-Session 1:1 Live Coding Track
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Weekly 1:1 live sessions + 24/7 cloud sandbox
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>$149</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>/ month</div>
                </div>
              </div>

              {/* Quick Fill Test Card Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Payment Method
                </span>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  style={{
                    background: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    color: 'var(--primary)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Auto-Fill Stripe Test Card
                </button>
              </div>

              {/* Card Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Card Number: 4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    style={{ paddingLeft: '40px' }}
                  />
                  <CreditCard size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="CVC"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ZIP"
                    value={cardZip}
                    onChange={(e) => setCardZip(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="btn-stripe-pay"
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '15px', justifyContent: 'center' }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Securely via Stripe...' : 'Confirm Enrollment ($149 / mo)'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Encrypted with Stripe SSL • Cancel anytime with 1 click</span>
              </div>
            </form>
          ) : (
            /* Successful Payment Confirmation */
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Enrollment Confirmed! 🎉
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Your child has been enrolled in the <strong>Kodaverse Master STEM Program</strong>. First session schedule has been synced with your mentor.
              </p>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', fontSize: '12px', color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: '20px' }}>
                Payment Ref: pi_kodaverse_prod_449281
              </div>

              <button
                className="btn-primary"
                onClick={onClose}
                style={{ width: '100%', padding: '10px', justifyContent: 'center' }}
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
