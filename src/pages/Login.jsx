import React, { useState, useEffect } from 'react';
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
  X,
  Check,
  Download
} from 'lucide-react';
import logoImg from '../assets/logo.jpeg';
import heroImg from '../assets/hero-illustration.png';
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

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null);
    }
  };

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
        flex: 1.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem 4rem',
        background: '#ffffff',
        borderRight: '1px solid rgba(30, 107, 62, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }} className="login-hero-section">
        
        {/* Header Logo & Bell */}
        <div className="animate-fade-in-up delay-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4rem', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={logoImg} alt="Logo" className="animate-glow" style={{ width: '75px', height: '75px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 15px rgba(30, 107, 62, 0.1)', border: '4px solid white' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#166534', letterSpacing: '0.02em' }}>SKS</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ height: '2px', width: '20px', backgroundColor: '#166534' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.15em' }}>CHIT BOOK</span>
                <div style={{ height: '2px', width: '20px', backgroundColor: '#166534' }} />
              </div>
            </div>
          </div>
          
          <div style={{ position: 'relative', width: '44px', height: '44px', borderRadius: '50%', border: '2.5px solid #166534', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <div className="animate-pulse" style={{ position: 'absolute', top: '-1px', right: '1px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#166534', border: '2.5px solid #fefce8' }} />
          </div>
        </div>

        {/* Content & Image Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, position: 'relative', zIndex: 10, gap: '2rem' }}>
          
          {/* Text Content */}
          <div style={{ flex: 1, maxWidth: '400px', zIndex: 10 }}>
            <h1 className="animate-fade-in-up delay-200" style={{ fontSize: '3rem', fontWeight: 800, color: '#166534', lineHeight: 1.15, marginBottom: '1.25rem', textShadow: '0 2px 10px rgba(22, 101, 52, 0.05)' }}>
              Secure Chit <br /> Management
            </h1>
            <p className="animate-fade-in-up delay-300" style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '300px', fontWeight: 500 }}>
              Simple. Secure. Transparent. <br /> Manage your chit funds <br /> with confidence.
            </p>

            <div className="animate-fade-in-up delay-400" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              backgroundColor: '#dcfce7',
              border: '1px solid rgba(22, 101, 52, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              color: '#166534',
              fontWeight: 700,
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(22, 101, 52, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Check size={12} strokeWidth={3.5} />
              </div>
              <span>Trusted by 1000+ Users</span>
            </div>
            
            <div className="animate-fade-in-up delay-500" style={{ marginTop: '1.5rem' }}>
              <button
                onClick={handleInstallClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#166534',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22, 101, 52, 0.2)',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Download size={18} />
                Download App
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div style={{ flex: 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 0, pointerEvents: 'none' }}>
            <img src={heroImg} alt="Hero Illustration" className="animate-fade-in-up delay-500 animate-float" style={{ width: '100%', maxWidth: '500px', height: 'auto', objectFit: 'contain' }} />
          </div>
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
        {/* Mobile Header Hero (Visible only on mobile) */}
        <div className="mobile-login-logo" style={{ display: 'none', flexDirection: 'column', width: '100%', padding: '0.5rem', marginBottom: '1.5rem', overflow: 'hidden', position: 'relative' }}>
          
          {/* Header Logo & Bell */}
          <div className="animate-fade-in-up delay-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src={logoImg} alt="Logo" className="animate-glow" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', letterSpacing: '0.02em' }}>SKS</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ height: '1.5px', width: '15px', backgroundColor: '#166534' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.1em' }}>CHIT BOOK</span>
                  <div style={{ height: '1.5px', width: '15px', backgroundColor: '#166534' }} />
                </div>
              </div>
            </div>
            
            <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #166534', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <div style={{ position: 'absolute', top: '-1px', right: '-1px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#166534', border: '1.5px solid #fbfcf9' }} />
            </div>
          </div>

          {/* Content & Image Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', minHeight: '180px' }}>
            
            {/* Text Content (Left) */}
            <div style={{ flex: '1 1 55%', zIndex: 10 }}>
              <h1 className="animate-fade-in-up delay-200" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', lineHeight: 1.15, marginBottom: '0.75rem' }}>
                Secure Chit <br /> Management
              </h1>
              <p className="animate-fade-in-up delay-300" style={{ color: '#4b5563', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '1rem', maxWidth: '180px', fontWeight: 500 }}>
                Simple. Secure. Transparent. Manage your chit funds with confidence.
              </p>

              <div className="animate-fade-in-up delay-400" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#dcfce7',
                padding: '0.4rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                color: '#166534',
                fontWeight: 700,
                fontSize: '0.7rem',
                boxShadow: '0 2px 8px rgba(22, 101, 52, 0.1)',
                marginBottom: '1rem'
              }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Check size={10} strokeWidth={3} />
                </div>
                <span>Trusted by 1000+</span>
              </div>
              
              <div className="animate-fade-in-up delay-400" style={{ marginBottom: '1rem' }}>
                <button
                  onClick={handleInstallClick}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#166534',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(22, 101, 52, 0.2)'
                  }}
                >
                  <Download size={14} />
                  Download App
                </button>
              </div>
            </div>

            {/* Hero Image (Right) */}
            <div style={{ flex: '1 1 45%', display: 'flex', justifyContent: 'flex-end', position: 'absolute', right: '-5%', top: '0', bottom: '0', alignItems: 'center', zIndex: 0, pointerEvents: 'none' }}>
              <img src={heroImg} alt="Hero Illustration" className="animate-fade-in-up delay-500 animate-float" style={{ width: '130%', maxWidth: '200px', height: 'auto', objectFit: 'contain', mixBlendMode: 'darken' }} />
            </div>
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

          {/* Login Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => { setLoginMode('password'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: loginMode === 'password' ? '#166534' : '#6b7280',
                borderBottom: loginMode === 'password' ? '2px solid #166534' : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('otp'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: loginMode === 'otp' ? '#166534' : '#6b7280',
                borderBottom: loginMode === 'otp' ? '2px solid #166534' : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              OTP Login
            </button>
          </div>

          {/* Form Area */}
          {loginMode === 'password' && (
            <>
              <form onSubmit={handleSubmit}>
                <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="email-password" type="email" required placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '0.95rem' }} />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                    <input id="password" type={showPassword ? 'text' : 'password'} required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" style={{ paddingLeft: '2.75rem', paddingRight: '3rem', height: '48px', fontSize: '0.95rem' }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', padding: '0.5rem' }}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                  <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>Forgot Password?</Link>
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', fontSize: '1rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(30, 107, 62, 0.2)' }}>
                  <span>{loading ? 'Logging in...' : 'Login securely'}</span>
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
                  <span>{loading ? 'Sending...' : 'Login with Email + OTP'}</span>
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
            </>
          )}

          {loginMode === 'otp' && otpStep === 2 && (
            <>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem', textAlign: 'center' }}>
                Please enter the 6-digit code sent to <br /><strong>{otpSentTo}</strong>
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
