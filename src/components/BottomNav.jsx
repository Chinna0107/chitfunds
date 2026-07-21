import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  UserCheck, 
  CheckSquare, 
  ClipboardList, 
  Plus, 
  Briefcase,
  CreditCard, 
  User,
  FolderOpen,
  Lock
} from 'lucide-react';

const BottomNav = () => {
  const { user } = useAuth();

  if (!user) return null;

  const adminLinks = [
    { to: '/', label: 'Home', icon: <Home size={22} /> },
    { to: '/admin/users', label: 'Users', icon: <UserCheck size={22} /> },
    { to: '/admin/chits', label: 'Create Chit', icon: <Plus size={24} color="#fff" />, isSpecial: true },
    { to: '/admin/chit-approvals', label: 'Approvals', icon: <Briefcase size={22} /> },
    { to: '/admin/payments', label: 'Verify', icon: <CheckSquare size={22} /> },
    { to: '/admin/frozen-months', label: 'Taken', icon: <Lock size={22} /> },
    { to: '/admin/records', label: 'Records', icon: <FolderOpen size={22} /> },
  ];

  const staffLinks = [
    { to: '/', label: 'Home', icon: <Home size={22} /> },
    { to: '/admin/chits', label: 'Manage Chits', icon: <Plus size={24} color="#fff" />, isSpecial: true },
    { to: '/admin/chit-approvals', label: 'Approvals', icon: <Briefcase size={22} /> },
    { to: '/admin/payments', label: 'Verify', icon: <CheckSquare size={22} /> },
    { to: '/admin/frozen-months', label: 'Taken', icon: <Lock size={22} /> },
    { to: '/admin/records', label: 'Records', icon: <FolderOpen size={22} /> },
  ];

  const userLinks = [
    { to: '/', label: 'Home', icon: <Home size={22} /> },
    { to: '/my-chits', label: 'My Chits', icon: <ClipboardList size={22} /> },
    { to: '/chits', label: 'Quick Join', icon: <Plus size={24} color="#fff" />, isSpecial: true },
    { to: '/payments', label: 'Payments', icon: <CreditCard size={22} /> },
    { to: '/profile', label: 'Profile', icon: <User size={22} /> },
  ];

  const links = user.role === 'superadmin' ? adminLinks : (user.role === 'employee' ? staffLinks : userLinks);

  return (
    <nav className="glass-panel bottom-nav-container" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '65px',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      padding: '0 0.25rem',
      borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      borderTop: '1.5px solid rgba(30, 107, 62, 0.08)'
    }}>
      {links.map((link) => {
        if (link.isSpecial) {
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `bottom-nav-link special-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-secondary)',
                fontSize: '0.65rem',
                fontWeight: 600,
                flex: 1,
                height: '100%',
                textDecoration: 'none',
                position: 'relative'
              }}
            >
              <div className="special-icon-wrapper" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-green)',
                boxShadow: '0 4px 10px rgba(30, 107, 62, 0.35)',
                transform: 'translateY(-12px)',
                transition: 'transform 0.2s ease, background-color 0.2s ease',
                zIndex: 10
              }}>
                {link.icon}
              </div>
              <span style={{ position: 'absolute', bottom: '6px' }}>{link.label}</span>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              color: 'var(--color-secondary)',
              fontSize: '0.65rem',
              fontWeight: 500,
              flex: 1,
              height: '100%',
              transition: 'var(--transition-fast)',
              textDecoration: 'none'
            }}
          >
            <div className="nav-icon-wrapper" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '28px',
              borderRadius: 'var(--radius-full)',
              transition: 'var(--transition-fast)'
            }}>
              {link.icon}
            </div>
            <span>{link.label}</span>
          </NavLink>
        );
      })}

      <style>{`
        .bottom-nav-link.active {
          color: var(--color-primary-green) !important;
          font-weight: 700 !important;
        }
        .bottom-nav-link.active .nav-icon-wrapper {
          color: var(--color-primary-green);
        }
        .bottom-nav-link.special-link.active .special-icon-wrapper {
          background-color: var(--color-primary-green-dark) !important;
          transform: translateY(-12px) scale(1.05);
          box-shadow: 0 6px 14px rgba(30, 107, 62, 0.45);
        }
        .bottom-nav-link.special-link:hover .special-icon-wrapper {
          transform: translateY(-14px) scale(1.05);
        }
        @media (min-width: 769px) {
          .bottom-nav-container {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default BottomNav;
