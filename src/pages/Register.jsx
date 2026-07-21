import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Upload,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  LockKeyhole,
  Check,
  Download
} from 'lucide-react';
import logoImg from '../assets/logo.jpeg';
import heroImg from '../assets/hero-illustration.png';
const RegisterIllustration = () => (
  <svg viewBox="0 0 500 400" width="100%" height="100%" style={{ maxHeight: '320px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Financial Growth Illustration */}
    <rect x="50" y="320" width="400" height="8" rx="4" fill="#1e6b3e" opacity="0.2" />

    {/* Growth Bar Charts */}
    <rect x="90" y="240" width="30" height="80" rx="6" fill="#1e6b3e" opacity="0.3" />
    <rect x="150" y="190" width="30" height="130" rx="6" fill="#1e6b3e" opacity="0.5" />
    <rect x="210" y="140" width="30" height="180" rx="6" fill="#1e6b3e" opacity="0.7" />
    <rect x="270" y="80" width="30" height="240" rx="6" fill="#1e6b3e" />

    {/* Floating Coin Stacks next to bars */}
    <g transform="translate(330, 160)">
      <rect x="0" y="130" width="36" height="10" rx="5" fill="#facc15" />
      <rect x="0" y="122" width="36" height="10" rx="5" fill="#ca8a04" />
      <rect x="0" y="114" width="36" height="10" rx="5" fill="#facc15" />
      <rect x="0" y="106" width="36" height="10" rx="5" fill="#eab308" />
    </g>

    <g transform="translate(380, 100)">
      <rect x="0" y="190" width="36" height="10" rx="5" fill="#facc15" />
      <rect x="0" y="182" width="36" height="10" rx="5" fill="#ca8a04" />
      <rect x="0" y="174" width="36" height="10" rx="5" fill="#facc15" />
      <rect x="0" y="166" width="36" height="10" rx="5" fill="#eab308" />
      <rect x="0" y="158" width="36" height="10" rx="5" fill="#ca8a04" />
      <rect x="0" y="150" width="36" height="10" rx="5" fill="#facc15" />
    </g>

    {/* Upward Gold Arrow Trend */}
    <path d="M70 290l80-50 60-50 60 40 80-110" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
    <polygon points="410,120 400,105 415,100" fill="#facc15" />

    {/* Users floating checking document */}
    <g transform="translate(100, 60)">
      <rect x="0" y="0" width="130" height="70" rx="8" fill="#ffffff" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.06))" />
      <circle cx="25" cy="35" r="14" fill="#e8f5e9" />
      <path d="M20 39c0-3 2.5-5 5-5s5 2 5 5" stroke="#1e6b3e" strokeWidth="2" />
      <circle cx="25" cy="31" r="4" fill="#1e6b3e" />
      <rect x="48" y="24" width="60" height="8" rx="4" fill="#e5e7eb" />
      <rect x="48" y="38" width="40" height="8" rx="4" fill="#a16207" opacity="0.3" />
    </g>

    {/* Floating document shield check */}
    <g transform="translate(240, 210)">
      <rect x="0" y="0" width="90" height="60" rx="8" fill="#ffffff" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.06))" />
      <path d="M20 18h50M20 30h40M20 42h30" stroke="#cbe2d6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="68" cy="40" r="12" fill="#166534" />
      <path d="M64 40l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

const Register = () => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Files
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);

  // Files previews names
  const [aadharName, setAadharName] = useState('');
  const [panName, setPanName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload only image files (jpg, jpeg, png, webp)');
      return;
    }

    if (fileType === 'aadhar') {
      setAadharFile(file);
      setAadharName(file.name);
    } else if (fileType === 'pan') {
      setPanFile(file);
      setPanName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!aadharFile || !panFile) {
      setError('Please upload images for both Aadhar card and PAN card proofs.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('aadhar', aadharFile);
      formData.append('pan', panFile);

      await register(formData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1.5rem', backgroundColor: '#fbfcf9' }}>
        <div className="glass-panel card-premium" style={{
          width: '100%',
          maxWidth: '480px',
          padding: '3rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(30, 107, 62, 0.08)',
          boxShadow: '0 10px 30px rgba(30, 107, 62, 0.04)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#e8f5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <CheckCircle size={48} color="#166534" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#166534', marginBottom: '1rem' }}>Registration Submitted!</h2>
          <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Thank you for registering. Your details and document proofs (Aadhar & PAN) have been sent to the Superadmin for verification.
          </p>
          <div style={{
            backgroundColor: '#fefbeb',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px dashed #ca8a04',
            marginBottom: '2.25rem',
            fontSize: '0.85rem',
            color: '#713f12',
            textAlign: 'left',
            lineHeight: 1.4
          }}>
            <strong>Note:</strong> You will be allowed to log in only after the Superadmin verifies and approves your registration profile.
          </div>
          <Link to="/login" className="btn-primary" style={{
            display: 'flex',
            width: '100%',
            height: '48px',
            borderRadius: 'var(--radius-full)',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(30, 107, 62, 0.2)'
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#fbfcf9',
    }} className="register-page-container">

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
      }} className="register-hero-section">
        
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
              Start Saving <br /> Together
            </h1>
            <p className="animate-fade-in-up delay-300" style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '300px', fontWeight: 500 }}>
              Submit your documents securely. Watch your wealth grow.
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
              <span>100% Encrypted & Safe</span>
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

      {/* Right Column - Register Box */}
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
                Start Saving <br /> Together
              </h1>
              <p className="animate-fade-in-up delay-300" style={{ color: '#4b5563', fontSize: '0.8rem', lineHeight: 1.4, marginBottom: '1rem', maxWidth: '180px', fontWeight: 500 }}>
                Submit your documents securely. Watch your wealth grow.
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
                <span>100% Secure</span>
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
          maxWidth: '480px',
          padding: '2.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(30, 107, 62, 0.08)',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 30px rgba(30, 107, 62, 0.04)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534', marginBottom: '0.25rem' }}>Create Account</h2>
            <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
              Submit your KYC details to register.
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              color: '#b91c1c',
              fontSize: '0.85rem'
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div className="input-group">
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div className="input-group">
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="Choose Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Document Upload Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>Aadhar Card Proof</span>
                <label className="input-field" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.75rem',
                  border: aadharFile ? '1.5px solid #166534' : '1.5px dashed #d1d5db',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: aadharFile ? '#f0fdf4' : '#fafbfc',
                  cursor: 'pointer',
                  textAlign: 'center',
                  height: '92px',
                  transition: 'all 0.2s ease'
                }}>
                  {aadharFile ? (
                    <div style={{ color: '#166534', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      <Check size={20} style={{ strokeWidth: 3 }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {aadharName}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload size={18} color="#6b7280" />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500 }}>Upload Aadhar</span>
                    </>
                  )}
                  <input type="file" required accept="image/*" onChange={(e) => handleFileChange(e, 'aadhar')} style={{ display: 'none' }} />
                </label>
              </div>

              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', marginBottom: '0.375rem' }}>PAN Card Proof</span>
                <label className="input-field" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  padding: '0.75rem',
                  border: panFile ? '1.5px solid #166534' : '1.5px dashed #d1d5db',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: panFile ? '#f0fdf4' : '#fafbfc',
                  cursor: 'pointer',
                  textAlign: 'center',
                  height: '92px',
                  transition: 'all 0.2s ease'
                }}>
                  {panFile ? (
                    <div style={{ color: '#166534', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                      <Check size={20} style={{ strokeWidth: 3 }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {panName}
                      </span>
                    </div>
                  ) : (
                    <>
                      <Upload size={18} color="#6b7280" />
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', fontWeight: 500 }}>Upload PAN</span>
                    </>
                  )}
                  <input type="file" required accept="image/*" onChange={(e) => handleFileChange(e, 'pan')} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(30, 107, 62, 0.2)'
              }}
            >
              <span>{loading ? 'Submitting Registration...' : 'Register'}</span>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowRight size={14} />
              </div>
            </button>
          </form>

          {/* Login redirection */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#166534', fontWeight: 700, textDecoration: 'none' }}>
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Styled JSX for Responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .register-page-container {
            flex-direction: column !important;
          }
          .register-hero-section {
            display: none !important;
          }
          .mobile-login-logo {
            display: flex !important;
          }
          .glass-panel.card-premium {
            padding: 1.5rem !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
