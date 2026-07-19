import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  PlusSquare, 
  CheckSquare, 
  Search, 
  Briefcase, 
  History, 
  User,
  FolderOpen
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const adminLinks = [
    { to: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { to: '/admin/users', label: 'User Approvals', icon: <UserCheck size={20} /> },
    { to: '/admin/employees', label: 'Employee Management', icon: <User size={20} /> },
    { to: '/admin/chits', label: 'Create Chits', icon: <PlusSquare size={20} /> },
    { to: '/admin/chit-approvals', label: 'Chit Approvals', icon: <Briefcase size={20} /> },
    { to: '/admin/payments', label: 'Verify Payments', icon: <CheckSquare size={20} /> },
    { to: '/admin/records', label: 'System Records', icon: <FolderOpen size={20} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  const staffLinks = [
    { to: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { to: '/admin/chits', label: 'Manage Chits', icon: <PlusSquare size={20} /> },
    { to: '/admin/chit-approvals', label: 'Chit Approvals', icon: <Briefcase size={20} /> },
    { to: '/admin/payments', label: 'Verify Payments', icon: <CheckSquare size={20} /> },
    { to: '/admin/records', label: 'System Records', icon: <FolderOpen size={20} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  const userLinks = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/chits', label: 'Browse Chits', icon: <Search size={20} /> },
    { to: '/my-chits', label: 'My Active Chits', icon: <Briefcase size={20} /> },
    { to: '/payments', label: 'Payment History', icon: <History size={20} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={20} /> },
  ];

  const links = user.role === 'superadmin' ? adminLinks : (user.role === 'employee' ? staffLinks : userLinks);
  let panelTitle = 'Member Panel';
  if (user.role === 'superadmin') panelTitle = 'Admin Portal';
  if (user.role === 'employee') panelTitle = 'Staff Portal';

  return (
    <aside className="glass-panel sidebar-container" style={{
      width: '260px',
      minHeight: 'calc(100vh - 90px)',
      padding: '2rem 1rem',
      borderRadius: 'var(--radius-lg)',
      margin: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.7)'
    }}>
      <div style={{ padding: '0 0.75rem 1.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Navigation</p>
        <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.25rem' }}>{panelTitle}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              color: 'var(--color-secondary)',
              transition: 'var(--transition-smooth)'
            }}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      <style>{`
        .sidebar-link:hover {
          background-color: var(--color-primary-green-light);
          color: var(--color-primary-green-dark);
          transform: translateX(4px);
        }
        .sidebar-link.active {
          background-color: var(--color-primary-green);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 4px 10px rgba(30, 107, 62, 0.2);
        }
        @media (max-width: 768px) {
          .sidebar-container {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
