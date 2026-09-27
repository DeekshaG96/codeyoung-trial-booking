import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { 
  X, Lock, Mail, User, Shield, Check, Eye, EyeOff, 
  Sparkles, ArrowRight, UserCheck, GraduationCap, Users, LogIn
} from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    setAuthModalTab, 
    login, 
    loginWithGoogle,
    register, 
    demoAccounts, 
    switchUser,
    user: currentUser
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('parent');

  // Sign up fields
  const [name, setName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(9);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'
  );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login({ email, password, role: selectedRole });
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        role: selectedRole,
        timezone,
        childName: selectedRole === 'parent' ? childName : undefined,
        childAge: selectedRole === 'parent' ? Number(childAge) : undefined
      });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (demo) => {
    switchUser(demo);
    closeAuthModal();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Header with gradient badge */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
          padding: '24px 28px',
          color: 'white',
          position: 'relative'
        }}>
          <button
            onClick={closeAuthModal}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.3)', border: '1px solid rgba(165, 180, 252, 0.4)', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, marginBottom: '10px' }}>
            <Sparkles size={12} color="#38bdf8" />
            <span>Kodaverse™ Secure Single Sign-On</span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            {authModalTab === 'signin' && 'Welcome Back to Codeyoung'}
            {authModalTab === 'signup' && 'Create Your Student & Parent Account'}
            {authModalTab === 'demo' && 'Instant 1-Click Demo Profiles'}
          </h2>
          <p style={{ fontSize: '12.5px', color: '#cbd5e1', margin: 0 }}>
            {authModalTab === 'signin' && 'Sign in to access your live trial classroom, booking dashboard & certificates.'}
            {authModalTab === 'signup' && 'Join thousands of young innovators learning to code 1:1 worldwide.'}
            {authModalTab === 'demo' && 'Switch between Parent, Mentor, and Student personas with 1 click.'}
          </p>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '4px',
            borderRadius: '12px',
            marginTop: '16px'
          }}>
            <button
              onClick={() => { setAuthModalTab('signin'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                background: authModalTab === 'signin' ? '#4f46e5' : 'transparent',
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => { setAuthModalTab('signup'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                background: authModalTab === 'signup' ? '#4f46e5' : 'transparent',
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <UserCheck size={13} />
              <span>Register</span>
            </button>

            <button
              onClick={() => { setAuthModalTab('demo'); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '8px',
                border: 'none',
                background: authModalTab === 'demo' ? '#f59e0b' : 'transparent',
                color: 'white',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={13} />
              <span>Quick Demo</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', maxHeight: '70vh', overflowY: 'auto' }}>
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#b91c1c',
              fontSize: '12.5px',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {errorMsg}
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {authModalTab === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Role Selection Tabs */}
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Signing in as:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'parent', label: '👨‍👩‍👦 Parent' },
                    { id: 'mentor', label: '👨‍🏫 Mentor' },
                    { id: 'student', label: '🎓 Student' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: selectedRole === r.id ? '2px solid #4f46e5' : '1.5px solid #e2e8f0',
                        background: selectedRole === r.id ? '#eef2ff' : '#f8fafc',
                        color: selectedRole === r.id ? '#4338ca' : '#475569',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah.jenkins@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 38px 10px 38px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
                <ArrowRight size={16} />
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>OR SIGN IN WITH FIREBASE</span>
                <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              </div>

              {/* Google Sign-in */}
              <button
                type="button"
                onClick={async () => {
                  setErrorMsg('');
                  setLoading(true);
                  try {
                    await loginWithGoogle();
                  } catch (e) {
                    setErrorMsg(e.message || 'Google Sign-In failed.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#1e293b',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalTab('signup')}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 700, cursor: 'pointer' }}
                >
                  Register now (Free)
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {authModalTab === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Account Type */}
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
                  I am registering as:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'parent', label: '👨‍👩‍👦 Parent' },
                    { id: 'student', label: '🎓 Student' },
                    { id: 'mentor', label: '👨‍🏫 Mentor' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: selectedRole === r.id ? '2px solid #4f46e5' : '1.5px solid #e2e8f0',
                        background: selectedRole === r.id ? '#eef2ff' : '#f8fafc',
                        color: selectedRole === r.id ? '#4338ca' : '#475569',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              {/* Child Details if Parent */}
              {selectedRole === 'parent' && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Child Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leo"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Child Age
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={18}
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginTop: '8px'
                }}
              >
                {loading ? 'Creating Account...' : 'Complete Free Registration'}
              </button>
            </form>
          )}

          {/* TAB 3: 1-CLICK DEMO PROFILES */}
          {authModalTab === 'demo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                Select a pre-configured profile to test with:
              </div>

              {demoAccounts.map(account => {
                const isActive = currentUser?.id === account.id;
                return (
                  <div
                    key={account.id}
                    onClick={() => handleSelectDemo(account)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: isActive ? '2px solid #4f46e5' : '1.5px solid #e2e8f0',
                      background: isActive ? '#f5f3ff' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img
                      src={account.avatar}
                      alt={account.name}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{account.name}</strong>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: account.role === 'mentor' ? '#e0e7ff' : account.role === 'student' ? '#dcfce7' : '#fef3c7',
                          color: account.role === 'mentor' ? '#4338ca' : account.role === 'student' ? '#15803d' : '#b45309'
                        }}>
                          {account.role.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {account.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {account.email}
                      </div>
                    </div>
                    {isActive ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#4f46e5', fontWeight: 700 }}>
                        <Check size={16} /> Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        style={{
                          background: '#4f46e5',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Switch
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
