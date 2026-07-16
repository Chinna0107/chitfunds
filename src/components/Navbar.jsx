import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Coins, LogOut, User as UserIcon, HelpCircle, PhoneCall } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
      backgroundColor: 'rgba(251, 252, 250, 0.85)',
      borderBottom: '1px solid rgba(30, 107, 62, 0.08)'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'white',
            border: '2.5px solid #1e6b3e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 2px 6px rgba(30, 107, 62, 0.15)'
          }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e6b3e', fontFamily: 'Outfit, sans-serif', transform: 'translateY(-1px)' }}>S</span>
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
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e6b3e', letterSpacing: '0.03em' }}>SANTHOSH</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#4b5563', letterSpacing: '0.15em' }}>— CHIT BOOK —</span>
          </div>
        </div>
      </Link>

      {/* Desktop Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="nav-links-desktop">
        <Link to="/" style={{ fontWeight: 500, transition: 'var(--transition-fast)' }} className="nav-hover">Home</Link>
        <Link to="/about" style={{ fontWeight: 500, transition: 'var(--transition-fast)' }} className="nav-hover">About Us</Link>
        <Link to="/contact" style={{ fontWeight: 500, transition: 'var(--transition-fast)' }} className="nav-hover">Contact</Link>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: 'var(--color-primary-green)' }}>
              <UserIcon size={18} />
              <span>{user.name}</span>
            </Link>
            {user.role === 'superadmin' && (
              <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>SUPERADMIN</span>
            )}
            <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Register</Link>
          </div>
        )}
      </div>

      {/* Hamburger Menu Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ display: 'none', color: 'var(--color-primary)' }} 
        className="hamburger-btn"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="glass-panel mobile-nav" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Home</span>
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)} style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} />
            <span>About Us</span>
          </Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PhoneCall size={18} />
            <span>Contact</span>
          </Link>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <UserIcon size={18} />
                <span>My Profile ({user.name})</span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem', width: 'fit-content' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary" style={{ textAlign: 'center' }}>Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary" style={{ textAlign: 'center' }}>Register</Link>
            </div>
          )}
        </div>
      )}

      {/* Inline styles for responsive menu */}
      <style>{`
        .nav-hover:hover {
          color: var(--color-primary-green);
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
          .hamburger-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
