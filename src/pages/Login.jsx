import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Smartphone, 
  Eye, 
  EyeOff, 
  UserPlus, 
  ArrowRight, 
  ShieldCheck, 
  LockKeyhole, 
  ChevronRight, 
  ShieldAlert,
  HelpCircle,
  X
} from 'lucide-react';

// Premium SVG Illustration matching the screenshot details
const ChitIllustration = () => (
  <svg viewBox="0 0 500 400" width="100%" height="100%" style={{ maxHeight: '320px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Building / Bank */}
    <path d="M220 180h160v100H220z" fill="#f0f7f4" />
    <path d="M210 180l80-50 80 50v10h-160v-10z" fill="#e2efe8" />
    <path d="M250 190h15v90h-15zm40 0h15v90h-15zm40 0h15v90h-15z" fill="#cbe2d6" />
    <circle cx="300" cy="155" r="10" fill="#1e6b3e" />
    <polygon points="300,148 295,157 305,157" fill="#facc15" />
    
    {/* Big Green Piggy Bank */}
    <circle cx="330" cy="270" r="50" fill="#2e7d32" opacity="0.15" />
    <path d="M370 260c0-25-20-45-45-45s-50 20-50 45c0 15 8 28 20 36l-5 19h15l5-15h20l5 15h15l-5-19c12-8 20-21 20-36z" fill="#66bb6a" />
    {/* Piggy nose & ears */}
    <rect x="365" y="250" width="15" height="20" rx="7" fill="#4caf50" />
    <path d="M280 220l-10-20 20 10-10 10z" fill="#4caf50" />
    {/* Piggy eye */}
    <circle cx="345" cy="245" r="4" fill="#1b5e20" />
    {/* Piggy coin slot */}
    <rect x="310" y="210" width="20" height="6" rx="3" fill="#388e3c" />

    {/* Coin stacks */}
    <g transform="translate(390, 260)">
      <rect x="0" y="30" width="40" height="12" rx="6" fill="#facc15" />
      <rect x="0" y="24" width="40" height="12" rx="6" fill="#ca8a04" />
      <rect x="0" y="18" width="40" height="12" rx="6" fill="#facc15" />
      <rect x="0" y="12" width="40" height="12" rx="6" fill="#eab308" />
      <rect x="0" y="6" width="40" height="12" rx="6" fill="#ca8a04" />
      <rect x="0" y="0" width="40" height="12" rx="6" fill="#facc15" />
    </g>
    
    {/* Man placing coin */}
    <g transform="translate(180, 160)">
      {/* Body */}
      <rect x="25" y="50" width="25" height="80" rx="10" fill="#2e7d32" />
      <rect x="20" y="120" width="10" height="40" fill="#1f2937" />
      <rect x="40" y="120" width="10" height="40" fill="#1f2937" />
      {/* Head */}
      <circle cx="37" cy="35" r="12" fill="#ffcc80" />
      <path d="M30 28c5-5 12-2 15 2s0 10-5 10-10-9-10-12z" fill="#374151" />
      {/* Arms & Coin */}
      <path d="M48 60l35 15-5 10-30-15z" fill="#ffcc80" />
      <path d="M25 60l-15 35 10 5 15-30z" fill="#2e7d32" />
      {/* Golden Rupee Coin */}
      <circle cx="90" cy="80" r="14" fill="#facc15" />
      <circle cx="90" cy="80" r="10" fill="#ca8a04" />
      <text x="86" y="85" fill="#fff" fontSize="14" fontWeight="bold">₹</text>
    </g>

    {/* Woman sitting on coins */}
    <g transform="translate(380, 200)">
      {/* Stack she is sitting on */}
      <rect x="-10" y="90" width="50" height="15" rx="7" fill="#ca8a04" />
      <rect x="-10" y="78" width="50" height="15" rx="7" fill="#facc15" />
      <rect x="-10" y="66" width="50" height="15" rx="7" fill="#ca8a04" />
      <rect x="-10" y="54" width="50" height="15" rx="7" fill="#facc15" />
      <rect x="-10" y="42" width="50" height="15" rx="7" fill="#eab308" />
      <rect x="-10" y="30" width="50" height="15" rx="7" fill="#ca8a04" />
      
      {/* Woman Body */}
      <path d="M10 20c0-10 15-10 15 0v35H10V20z" fill="#facc15" />
      <path d="M15 50l-15 30h15l10-30z" fill="#1f2937" />
      <circle cx="17" cy="8" r="10" fill="#ffcc80" />
      <path d="M10 2c3-4 12-2 14 3s-2 10-7 10-7-9-7-13z" fill="#374151" />
      {/* Arm holding laptop */}
      <path d="M12 25l-20 15 5 5 15-15z" fill="#ffcc80" />
      {/* Laptop */}
      <rect x="-22" y="35" width="22" height="15" rx="2" fill="#374151" />
      <rect x="-20" y="48" width="20" height="4" fill="#9ca3af" />
    </g>

    {/* Security Badges floating */}
    <g transform="translate(390, 80)">
      <circle cx="20" cy="20" r="20" fill="#fff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
      <path d="M14 18l4 4 8-8" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    <g transform="translate(130, 220)">
      <circle cx="20" cy="20" r="20" fill="#fff" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))" />
      <path d="M20 10l9 5v7c0 5-4 10-9 12-5-2-9-7-9-12v-7l9-5z" fill="#166534" opacity="0.2" />
      <path d="M20 12l7 4v6c0 4-3 8-7 10-4-2-7-6-7-10v-6l7-4z" fill="#166534" />
      <path d="M17 20l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

const Login = () => {
  const { login, requestOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [otpStep, setOtpStep] = useState(1); // 1 = enter email, 2 = enter otp
  const [otpVal, setOtpVal] = useState('');
  const [otpSentTo, setOtpSentTo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials or connection issue.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerOtpFlow = async () => {
    if (!email) {
      setError('Please enter your email to receive an OTP');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await requestOtp(email);
      setOtpSentTo(email);
      setOtpVal('');
      setOtpStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp(email, otpVal);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#fbfcf9',
    }} className="login-page-container">
      
      {/* Desktop Left Column - Hero Illustration Banner */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        background: 'linear-gradient(180deg, #f0fdf4 0%, #e2efe8 100%)',
        borderRight: '1px solid rgba(30, 107, 62, 0.08)'
      }} className="login-hero-section">
        {/* Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'white',
            border: '2.5px solid #1e6b3e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 2px 6px rgba(30, 107, 62, 0.15)'
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e6b3e', fontFamily: 'Outfit, sans-serif' }}>S</span>
            <div style={{
              position: 'absolute',
              bottom: '1px',
              right: '2px',
              width: '8px',
              height: '8px',
              background: '#ca8a04',
              borderRadius: '50% 0 50% 50%',
              transform: 'rotate(-45deg)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '1px',
              left: '2px',
              width: '8px',
              height: '8px',
              background: '#1e6b3e',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(45deg)'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e6b3e', letterSpacing: '0.03em' }}>SANTHOSH</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.15em' }}>— CHIT BOOK —</span>
          </div>
        </div>

        {/* Content Block */}
        <div style={{ margin: '3rem 0', maxWidth: '460px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#166534', lineHeight: 1.2, marginBottom: '1rem' }}>
            Secure Chit Management
          </h1>
          <p style={{ color: '#4b5563', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Simple. Secure. Transparent. Manage your chit funds with confidence.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fff',
            border: '1.5px solid #166534',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            color: '#166534',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <ShieldCheck size={18} />
            <span>Trusted by 1000+ Users</span>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <ChitIllustration />
          </div>
        </div>

        {/* Slider dots */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1e6b3e' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbe2d6' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#cbe2d6' }} />
        </div>
      </div>

      {/* Right Column - Login Box */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        overflowY: 'auto'
      }}>
        {/* Mobile Header Logo (Visible only on mobile) */}
        <div className="mobile-login-logo" style={{ display: 'none', marginBottom: '2rem', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'white',
            border: '2px solid #1e6b3e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e6b3e', transform: 'translateY(-1px)' }}>S</span>
            <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '6px', height: '6px', background: '#ca8a04', borderRadius: '50% 0 50% 50%', transform: 'rotate(-45deg)' }} />
            <div style={{ position: 'absolute', bottom: '1px', left: '1px', width: '6px', height: '6px', background: '#1e6b3e', borderRadius: '50% 50% 50% 0', transform: 'rotate(45deg)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e6b3e' }}>SANTHOSH</span>
            <span style={{ fontSize: '0.55rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.12em' }}>CHIT BOOK</span>
          </div>
        </div>

        {/* Outer Card wrapping the Form */}
        <div className="glass-panel card-premium" style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(30, 107, 62, 0.08)',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 30px rgba(30, 107, 62, 0.04)'
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#166534',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            Welcome Back
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '0.95rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Please enter your details to sign in
          </p>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              color: '#b91c1c',
              fontSize: '0.85rem'
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form Area */}
          {loginMode === 'password' && (
            <>
              <form onSubmit={handleSubmit}>
                <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="email" type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '0.95rem' }} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="password" type={showPassword ? 'text' : 'password'} required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem', height: '48px', fontSize: '0.95rem' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                  <Link to="/contact" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', fontSize: '1rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(30, 107, 62, 0.2)' }}>
                  <span>{loading ? 'Authenticating...' : 'Login'}</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={16} />
                  </div>
                </button>
              </form>

              <Link to="/register" className="btn-gold-outline" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-full)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={18} />
                  <span>Register New Account</span>
                </div>
                <ChevronRight size={16} />
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                <span style={{ padding: '0.25rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '50%', background: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => { setLoginMode('otp'); setOtpStep(1); setError(''); }} type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', backgroundColor: '#fafbfc', transition: 'all 0.2s ease', cursor: 'pointer' }} className="quick-otp-btn">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fefbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ca8a04' }}>
                      <Mail size={16} />
                    </div>
                    <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Login with</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Email + OTP</p>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#9ca3af" />
                </button>
              </div>
            </>
          )}

          {loginMode === 'otp' && otpStep === 1 && (
            <>
              <form onSubmit={(e) => { e.preventDefault(); handleTriggerOtpFlow(); }}>
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="email-otp" type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '0.95rem' }} />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', fontSize: '1rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(30, 107, 62, 0.2)' }}>
                  <span>{loading ? 'Sending...' : 'Send OTP'}</span>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={16} />
                  </div>
                </button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
                <span style={{ padding: '0.25rem 0.5rem', border: '1px solid #e5e7eb', borderRadius: '50%', background: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => { setLoginMode('password'); setError(''); }} type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', backgroundColor: '#fafbfc', transition: 'all 0.2s ease', cursor: 'pointer' }} className="quick-otp-btn">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                      <Lock size={16} />
                    </div>
                    <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Login with</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Password</p>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#9ca3af" />
                </button>
              </div>
            </>
          )}

          {loginMode === 'otp' && otpStep === 2 && (
            <>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem', textAlign: 'center' }}>
                Please enter the 6-digit code sent to <br/><strong>{otpSentTo}</strong>
              </p>
              <form onSubmit={handleOtpVerify}>
                <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="Enter 6-digit OTP"
                    value={otpVal}
                    onChange={(e) => setOtpVal(e.target.value)}
                    className="input-field"
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em', height: '52px' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#ca8a04', display: 'block', marginTop: '0.5rem', textAlign: 'center', fontWeight: 600 }}>
                    Check your email inbox for the code
                  </span>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', fontSize: '1rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(30, 107, 62, 0.2)' }}>
                  {loading ? 'Verifying...' : 'Verify & Log In'}
                </button>
              </form>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button onClick={() => setOtpStep(1)} type="button" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Change Email Address
                </button>
              </div>
            </>
          )}

          {/* Secure Assurances */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginTop: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#f0fdf4',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(22, 101, 52, 0.08)'
            }}>
              <ShieldCheck size={20} color="#166534" style={{ flexShrink: 0 }} />
              <div style={{ lineHeight: 1.1 }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534' }}>Secure Auth</p>
                <p style={{ fontSize: '0.55rem', color: '#6b7280' }}>Safe connection</p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#f0fdf4',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(22, 101, 52, 0.08)'
            }}>
              <LockKeyhole size={20} color="#166534" style={{ flexShrink: 0 }} />
              <div style={{ lineHeight: 1.1 }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534' }}>Protected</p>
                <p style={{ fontSize: '0.55rem', color: '#6b7280' }}>Session encryption</p>
              </div>
            </div>
          </div>

          {/* Legal Footer */}
          <p style={{
            fontSize: '0.7rem',
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: '2rem',
            lineHeight: 1.4
          }}>
            By continuing, you agree to our{' '}
            <span style={{ color: '#166534', fontWeight: 600 }}>Terms & Conditions</span> and{' '}
            <span style={{ color: '#166534', fontWeight: 600 }}>Privacy Policy</span>
          </p>
        </div>
      </div>



      {/* Styled JSX for Responsiveness */}
      <style>{`
        .quick-otp-btn:hover {
          background-color: #f3f4f6 !important;
          border-color: #d1d5db !important;
        }
        @media (max-width: 768px) {
          .login-page-container {
            flex-direction: column !important;
          }
          .login-hero-section {
            display: none !important; /* Hide hero on mobile just like clean native login screen */
          }
          .mobile-login-logo {
            display: flex !important;
          }
          .glass-panel.card-premium {
            padding: 1.75rem !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
