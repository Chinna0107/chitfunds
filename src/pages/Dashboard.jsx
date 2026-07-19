import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ScrollAnimationWrapper from '../components/ScrollAnimationWrapper';
import { 
  Users, 
  Briefcase, 
  IndianRupee, 
  Clock, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  CheckCircle,
  HelpCircle,
  Calendar,
  AlertCircle,
  Check,
  ChevronRight,
  ListFilter,
  Bell,
  Gavel,
  Star
} from 'lucide-react';

// Megaphone SVG for Announcements
const MegaphoneIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-10deg)' }}>
    <path d="M42 22H18c-3.3 0-6 2.7-6 6v4c0 3.3 2.7 6 6 6h24l8 6v-28l-8 6z" fill="#ca8a04" />
    <path d="M12 28h-4c-2.2 0-4 1.8-4 4s1.8 4 4 4h4v-8z" fill="#b45309" />
    <path d="M30 38v10c0 2.2-1.8 4-4 4h-4c-1.1 0-2-.9-2-2v-12h10z" fill="#4b5563" />
    <path d="M46 16c2 1.5 3 3.5 3 6s-1 4.5-3 6" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
    <path d="M51 11c3.5 3 5 7 5 11s-1.5 8-5 11" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
    <circle cx="24" cy="30" r="3" fill="#fff" />
  </svg>
);

const Dashboard = () => {
  const { user, token, API_URL } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userChits, setUserChits] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        if (user.role === 'superadmin' || user.role === 'employee') {
          const response = await fetch(`${API_URL}/admin/dashboard-stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success) {
            setStats(data.data);
          }
        } else {
          // Fetch user's joined chits
          const chitsResponse = await fetch(`${API_URL}/chits`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const chitsData = await chitsResponse.json();
          
          // Fetch user's payments
          const paymentsResponse = await fetch(`${API_URL}/payments/my-payments`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const paymentsData = await paymentsResponse.json();

          if (chitsData.success && paymentsData.success) {
            const joined = chitsData.data.filter((chit) => 
              chit.members.some((m) => m.user.id === user.id)
            );
            setUserChits(joined);
            setPayments(paymentsData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token, API_URL]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getUpcomingAuctionDate = () => {
    const today = new Date();
    // Auction typically on 25th of current month
    const auction = new Date(today.getFullYear(), today.getMonth(), 25);
    if (today.getDate() > 25) {
      auction.setMonth(auction.getMonth() + 1);
    }
    return auction.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-primary-green)' }}>Loading dashboard data...</div>;
  }

  // ================= ADMIN / STAFF VIEW =================
  if (user.role === 'superadmin' || user.role === 'employee') {
    const isSuperAdmin = user.role === 'superadmin';
    const greeting = user.name ? user.name : (isSuperAdmin ? 'Admin' : 'Staff');

    return (
      <div style={{ padding: '1rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Greeting */}
        <ScrollAnimationWrapper>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 className="dashboard-greeting">
              Hello, {greeting} 👋
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '0.25rem' }}>
              {isSuperAdmin ? 'Here\'s your platform overview and action center.' : 'Here\'s your chit management overview.'}
            </p>
          </div>
        </ScrollAnimationWrapper>

        {/* Stats Summary Card Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fff', padding: '1rem 0.25rem', marginBottom: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(30, 107, 62, 0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #f3f4f6', padding: '0 0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#16a34a' }}>
              <Users size={20} />
            </div>
            <span className="stat-label">Members</span>
            <span className="stat-value" style={{ color: '#16a34a' }}>{stats?.totalUsers || 0}</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #f3f4f6', padding: '0 0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#f59e0b' }}>
              <Clock size={20} />
            </div>
            <span className="stat-label">Pending Users</span>
            <span className="stat-value" style={{ color: stats?.pendingApprovals > 0 ? '#f59e0b' : '#374151' }}>{stats?.pendingApprovals || 0}</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #f3f4f6', padding: '0 0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#22c55e' }}>
              <Briefcase size={20} />
            </div>
            <span className="stat-label">Active Chits</span>
            <span className="stat-value" style={{ color: '#374151' }}>{stats?.activeChits || 0}</span>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '0 0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#10b981' }}>
              <IndianRupee size={20} />
            </div>
            <span className="stat-label">Collected</span>
            <span className="stat-value" style={{ color: '#374151', fontSize: '1rem' }}>₹{((stats?.totalRevenue || 0) / 1000).toFixed(0)}K</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="dashboard-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '1.5rem' }}>

          {/* Left: Action Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Pending Payments — highlighted card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 60%, #22c55e 100%)', padding: '1.1rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileCheck size={18} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Payment Verifications</h3>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Review submitted receipts</span>
                    </div>
                  </div>
                  {(stats?.pendingPaymentsCount || 0) > 0 && (
                    <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '1rem', whiteSpace: 'nowrap' }}>
                      {stats?.pendingPaymentsCount} Pending
                    </span>
                  )}
                </div>
              </div>
              <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
                  Verify user transaction receipts to confirm monthly installments.
                </p>
                <Link to="/admin/payments" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '0.78rem', padding: '0.45rem 0.85rem', borderRadius: '0.75rem', textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #bbf7d0', marginLeft: '1rem', flexShrink: 0 }}>
                  <span>Review</span><ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Chit Management */}
            <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)', padding: '1.1rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={18} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Chit Pool Management</h3>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>{stats?.totalChits || 0} total · {stats?.activeChits || 0} active</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
                  Create new chit groups, manage enrollments, and configure settings.
                </p>
                <Link to="/admin/chits" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.78rem', padding: '0.45rem 0.85rem', borderRadius: '0.75rem', textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #bfdbfe', marginLeft: '1rem', flexShrink: 0 }}>
                  <span>Manage</span><ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Chit Approvals */}
            <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 60%, #a78bfa 100%)', padding: '1.1rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={18} color="#fff" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: 0 }}>Chit Enrollments</h3>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>Approve member join requests</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
                  Review and approve pending member enrollment requests for chit pools.
                </p>
                <Link to="/admin/chit-approvals" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#f5f3ff', color: '#7c3aed', fontWeight: 700, fontSize: '0.78rem', padding: '0.45rem 0.85rem', borderRadius: '0.75rem', textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #ddd6fe', marginLeft: '1rem', flexShrink: 0 }}>
                  <span>Review</span><ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Superadmin-only cards */}
            {isSuperAdmin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* User Approvals */}
                <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={15} color="#fff" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', margin: 0 }}>User Approvals</h4>
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.75)' }}>{stats?.pendingApprovals || 0} pending</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem 1rem' }}>
                    <Link to="/admin/users" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ea580c', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none' }}>
                      <span>Review KYC</span><ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Employee Management */}
                <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                  <div style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TrendingUp size={15} color="#fff" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', margin: 0 }}>Staff Team</h4>
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.75)' }}>Manage employees</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem 1rem' }}>
                    <Link to="/admin/employees" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0f766e', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none' }}>
                      <span>Manage Staff</span><ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right: Quick Stats + Recent Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Platform Health */}
            <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1f2937', margin: '0 0 1rem 0' }}>Platform Health</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { label: 'Total Chits', value: stats?.totalChits || 0, color: '#16a34a', pct: Math.min(((stats?.totalChits || 0) / 20) * 100, 100) },
                  { label: 'Active Chits', value: stats?.activeChits || 0, color: '#2563eb', pct: stats?.totalChits ? Math.round(((stats?.activeChits || 0) / stats.totalChits) * 100) : 0 },
                  { label: 'Pending Payments', value: stats?.pendingPaymentsCount || 0, color: '#f59e0b', pct: Math.min(((stats?.pendingPaymentsCount || 0) / 10) * 100, 100) },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color }}>{item.value}</span>
                    </div>
                    <div style={{ height: '5px', backgroundColor: '#f3f4f6', borderRadius: '1rem', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.pct}%`, backgroundColor: item.color, borderRadius: '1rem', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1f2937', margin: '0 0 1rem 0' }}>Quick Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'System Records', sub: 'View all chit ledgers', path: '/admin/records', color: '#16a34a', bg: '#f0fdf4' },
                  { label: 'Verify Payments', sub: `${stats?.pendingPaymentsCount || 0} awaiting`, path: '/admin/payments', color: '#2563eb', bg: '#eff6ff' },
                  { label: 'Manage Chits', sub: 'Create & configure', path: '/admin/chits', color: '#7c3aed', bg: '#f5f3ff' },
                ].map((item, idx) => (
                  <Link key={idx} to={item.path} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem', borderRadius: '0.75rem',
                    backgroundColor: item.bg, textDecoration: 'none',
                    border: `1px solid ${item.color}20`
                  }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1f2937', display: 'block' }}>{item.label}</span>
                      <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{item.sub}</span>
                    </div>
                    <ChevronRight size={15} color={item.color} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Revenue Summary */}
            <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1f2937', margin: '0 0 0.75rem 0' }}>Revenue Summary</h4>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>₹{((stats?.totalRevenue || 0) / 1000).toFixed(1)}K</span>
                <span style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.2rem' }}>total collected</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#f3f4f6', borderRadius: '1rem', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ height: '100%', width: `${Math.min(((stats?.totalRevenue || 0) / 500000) * 100, 100)}%`, background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: '1rem' }} />
              </div>
              <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>across {stats?.totalChits || 0} chit pools</span>
            </div>

          </div>
        </div>

        <style>{`
          .dashboard-greeting {
            font-size: 2rem;
            font-weight: 800;
            color: var(--color-primary-green);
            line-height: 1.2;
          }
          .stat-label {
            font-size: 0.65rem;
            color: #6b7280;
            font-weight: 500;
            display: block;
            margin-bottom: 0.3rem;
            white-space: nowrap;
          }
          .stat-value {
            font-size: 1.25rem;
            font-weight: 700;
            display: block;
          }
          @media (max-width: 768px) {
            .dashboard-greeting { font-size: 1.5rem; }
            .dashboard-grid-layout {
              grid-template-columns: 1fr !important;
              gap: 1.25rem !important;
            }
            .stat-label { font-size: 0.58rem; }
            .stat-value { font-size: 1.05rem; }
          }
        `}</style>
      </div>
    );
  }

  // ================= USER MEMBER VIEW =================
  const approvedChits = userChits.filter(c => 
    c.members.some(m => m.user.id === user.id && m.status === 'approved')
  );
  
  const pendingJoinCount = userChits.filter(c => 
    c.members.some(m => m.user.id === user.id && m.status === 'pending')
  ).length;

  const activeChits = approvedChits.filter(c => c.status === 'active');
  const completedCount = approvedChits.filter(c => c.status === 'completed').length;
  
  // Primary Active Chit for detailed display (like Ramesh's dashboard in the screenshot)
  const primaryChit = activeChits[0] || approvedChits[0] || null;

  // Let's compute payment statistics for the primary chit
  let chitIdText = 'CHIT1001';
  let monthlyEmi = 0;
  let dueAmount = 0;
  let paidAmount = 0;
  let remainingAmount = 0;
  let remainingMonths = 0;
  let currentMonthProgressText = '0 / 0';
  let paymentStatus = 'Unpaid'; // Unpaid, Verifying, Paid
  let paymentStatusClass = 'badge-pending';
  let startDateText = 'Not Started';
  let endDateText = 'Not Started';

  if (primaryChit) {
    chitIdText = `CHIT${primaryChit.id.slice(-4).toUpperCase()}`;
    monthlyEmi = primaryChit.monthlyContribution;
    
    // Filter payments for this chit
    const chitPayments = payments.filter(p => p.chitId === primaryChit.id);
    const approvedPayments = chitPayments.filter(p => p.status === 'approved');
    
    paidAmount = approvedPayments.length * primaryChit.monthlyContribution;
    remainingAmount = (primaryChit.durationMonths - approvedPayments.length) * primaryChit.monthlyContribution;
    remainingMonths = primaryChit.durationMonths - approvedPayments.length;
    currentMonthProgressText = `${primaryChit.currentMonth} / ${primaryChit.durationMonths}`;
    
    // Check payment status for the current month
    const currentMonthPayment = chitPayments.find(p => p.monthNumber === primaryChit.currentMonth);
    if (currentMonthPayment) {
      if (currentMonthPayment.status === 'approved') {
        paymentStatus = 'Paid';
        paymentStatusClass = 'badge-approved';
        dueAmount = 0;
      } else if (currentMonthPayment.status === 'pending') {
        paymentStatus = 'Verifying';
        paymentStatusClass = 'badge-pending';
        dueAmount = 0;
      } else {
        paymentStatus = 'Rejected';
        paymentStatusClass = 'badge-rejected';
        dueAmount = primaryChit.monthlyContribution;
      }
    } else {
      paymentStatus = 'Unpaid';
      paymentStatusClass = 'badge-rejected'; // Show red badge for unpaid dues
      dueAmount = primaryChit.monthlyContribution;
    }

    startDateText = formatDate(primaryChit.startDate || primaryChit.createdAt);
    if (primaryChit.endDate) {
      endDateText = formatDate(primaryChit.endDate);
    } else {
      // Calculate end date based on start date + duration
      const start = new Date(primaryChit.startDate || primaryChit.createdAt);
      start.setMonth(start.getMonth() + primaryChit.durationMonths);
      endDateText = start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }

  // Filter other chits (excluding the primary one)
  const otherChits = approvedChits.filter(c => c.id !== primaryChit?.id);

  return (
    <div style={{ padding: '1rem', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Hello Section */}
      <ScrollAnimationWrapper>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="dashboard-greeting">
            Hello, {user.name} 👋
          </h1>
          <p style={{ color: 'var(--color-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Welcome back to your dashboard
          </p>
        </div>
      </ScrollAnimationWrapper>

      {/* Stats Summary Card Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#fff', padding: '1rem 0.25rem', marginBottom: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(30, 107, 62, 0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #f3f4f6', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#22c55e' }}>
            <Briefcase size={20} />
          </div>
          <span className="stat-label">Active Chits</span>
          <span className="stat-value" style={{ color: '#16a34a' }}>{activeChits.length}</span>
        </div>

        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #f3f4f6', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#16a34a' }}>
            <CheckCircle size={20} />
          </div>
          <span className="stat-label">Completed Chits</span>
          <span className="stat-value" style={{ color: '#374151' }}>{completedCount}</span>
        </div>

        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #f3f4f6', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#f59e0b' }}>
            <Clock size={20} />
          </div>
          <span className="stat-label">Pending Approval</span>
          <span className="stat-value" style={{ color: '#f59e0b' }}>{pendingJoinCount}</span>
        </div>

        <div style={{ flex: 1, textAlign: 'center', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem', color: '#10b981' }}>
            <Users size={20} />
          </div>
          <span className="stat-label">Total Enrolled</span>
          <span className="stat-value" style={{ color: '#374151' }}>{approvedChits.length + pendingJoinCount}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Side: Chit Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {primaryChit ? (
            <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              
              {/* Chit Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: '#16a34a', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(22, 163, 74, 0.3)', flexShrink: 0
                  }}>
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', lineHeight: 1.2, margin: 0 }}>{primaryChit.name}</h3>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>ID: {chitIdText}</span>
                      <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '1rem', fontWeight: 600 }}>Active</span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block', marginBottom: '0.15rem' }}>Monthly EMI</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#16a34a' }}>₹ {monthlyEmi.toLocaleString()}</span>
                </div>
              </div>

              {/* Due / Paid / Remaining */}
              <div className="chit-amounts-grid">
                <div className="chit-amount-col" style={{ borderRight: '1px solid #f3f4f6' }}>
                  <span className="amount-label">Due Amount</span>
                  <p className="amount-value" style={{ color: '#ef4444' }}>₹ {dueAmount.toLocaleString()}</p>
                </div>
                <div className="chit-amount-col" style={{ borderRight: '1px solid #f3f4f6' }}>
                  <span className="amount-label">Paid Amount</span>
                  <p className="amount-value" style={{ color: '#16a34a' }}>₹ {paidAmount.toLocaleString()}</p>
                </div>
                <div className="chit-amount-col">
                  <span className="amount-label">Remaining Amount</span>
                  <p className="amount-value" style={{ color: '#f59e0b' }}>₹ {remainingAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Months Row */}
              <div className="chit-months-grid">
                <div className="chit-month-col" style={{ borderRight: '1px solid #f3f4f6' }}>
                  <span className="month-label">Remaining Months</span>
                  <strong className="month-value">{remainingMonths}</strong>
                </div>
                <div className="chit-month-col" style={{ borderRight: '1px solid #f3f4f6' }}>
                  <span className="month-label">Current Month</span>
                  <strong className="month-value">{currentMonthProgressText}</strong>
                </div>
                <div className="chit-month-col">
                  <span className="month-label">Next Due Date</span>
                  <strong className="month-value" style={{ fontSize: '0.85rem' }}>5th of Month</strong>
                </div>
              </div>

              {/* Detail Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#4b5563' }}>
                    <Calendar size={16} color="#22c55e" />
                    <span>Chit Start Date</span>
                  </div>
                  <strong style={{ color: '#111827', fontWeight: 600, fontSize: '0.82rem' }}>{startDateText}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#4b5563' }}>
                    <Calendar size={16} color="#22c55e" />
                    <span>Chit End Date</span>
                  </div>
                  <strong style={{ color: '#111827', fontWeight: 600, fontSize: '0.82rem' }}>{endDateText}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#4b5563' }}>
                    <Gavel size={16} color="#22c55e" />
                    <span>Auction Status</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#6b7280', textAlign: 'right' }}>Next on {getUpcomingAuctionDate()}</span>
                    <span style={{ backgroundColor: '#fffbeb', color: '#d97706', fontSize: '0.65rem', padding: '0.15rem 0.5rem', border: '1px solid #fde68a', borderRadius: '1rem', whiteSpace: 'nowrap' }}>Upcoming</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#4b5563' }}>
                    <CheckCircle size={16} color="#22c55e" />
                    <span>Payment Status</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.75rem', borderRadius: '1rem', border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4', color: '#16a34a', fontWeight: 600 }}>{paymentStatus}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#4b5563' }}>
                    <ListFilter size={16} color="#22c55e" />
                    <span>Installment History</span>
                  </div>
                  <Link to="/my-chits" style={{ color: '#9ca3af', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                    <span>View Details</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => navigate('/my-chits')}
                style={{
                  width: '100%', height: '44px', borderRadius: '1.5rem',
                  backgroundColor: '#fff', border: '1.5px solid #22c55e',
                  color: '#16a34a', fontWeight: 600, fontSize: '0.88rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                View Chit Details
              </button>
            </div>
          ) : (
            <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px dashed #cbe2d6', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <Briefcase size={44} color="#9ca3af" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#374151' }}>No Active Chits</h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0.5rem 0 1.5rem 0' }}>
                You are not enrolled in any active chit schemes yet.
              </p>
              <button onClick={() => navigate('/chits')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '1.5rem' }}>
                <span>Browse Available Schemes</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Other Active Chits */}
          {otherChits.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Other Active Chits</h4>
                <Link to="/my-chits" style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
              </div>
              {otherChits.map((chit, idx) => (
                <div
                  onClick={() => navigate('/my-chits')}
                  key={chit.id}
                  className="other-chit-item"
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.85rem 1rem', backgroundColor: '#fff',
                    border: '1px solid #f3f4f6', borderRadius: '1rem',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      backgroundColor: idx % 2 === 0 ? '#fef9c3' : '#dcfce7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {idx % 2 === 0 ? <Star size={18} color="#eab308" fill="#eab308" /> : <Briefcase size={18} color="#22c55e" />}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1f2937', display: 'block' }}>{chit.name}</span>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>ID: CHIT{chit.id.slice(-4).toUpperCase()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: '#6b7280', display: 'block' }}>Monthly EMI</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1f2937' }}>₹ {chit.monthlyContribution.toLocaleString()}</span>
                    </div>
                    <ChevronRight size={16} color="#9ca3af" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Side: Notifications & Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Notifications */}
          <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Notifications</h4>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, cursor: 'pointer' }}>View All</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {primaryChit && paymentStatus !== 'Paid' && (
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444', marginTop: '5px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>
                      Your EMI of <strong>₹{monthlyEmi.toLocaleString()}</strong> is due on 5th of this month.
                    </p>
                    <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>2m ago</span>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b', marginTop: '5px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>
                    Auction scheduled on <strong>25th of this month</strong>.
                  </p>
                  <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>1h ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', marginTop: '5px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>
                    KYC verification is complete.
                  </p>
                  <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>1d ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Announcements</h4>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, cursor: 'pointer' }}>View All</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600, lineHeight: 1.4, marginBottom: '0.2rem', margin: 0 }}>
                  New chit scheme "Happy Savings" launched!
                </p>
                <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>3d ago</span>
              </div>
              <MegaphoneIcon />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .dashboard-greeting {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-primary-green);
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.68rem;
          color: #6b7280;
          font-weight: 500;
          display: block;
          margin-bottom: 0.35rem;
          white-space: nowrap;
        }
        .stat-value {
          font-size: 1.3rem;
          font-weight: 700;
          display: block;
        }
        .chit-amounts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
          margin-bottom: 0;
          text-align: center;
        }
        .chit-amount-col {
          padding: 0 0.25rem 1rem 0.25rem;
        }
        .amount-label {
          font-size: 0.68rem;
          color: #6b7280;
          font-weight: 500;
          display: block;
        }
        .amount-value {
          font-size: 1rem;
          font-weight: 700;
          margin-top: 0.2rem;
        }
        .chit-months-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          padding: 1rem 0;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
          margin-bottom: 1rem;
          text-align: center;
        }
        .chit-month-col {
          padding: 0 0.25rem;
        }
        .month-label {
          font-size: 0.68rem;
          color: #6b7280;
          display: block;
          margin-bottom: 0.2rem;
        }
        .month-value {
          font-size: 1rem;
          color: #374151;
          font-weight: 700;
        }
        .other-chit-item:hover {
          background-color: #f0fdf4 !important;
          border-color: #bbf7d0 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.08) !important;
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .dashboard-greeting {
            font-size: 1.5rem;
          }
          .dashboard-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .stat-label {
            font-size: 0.6rem;
          }
          .stat-value {
            font-size: 1.1rem;
          }
          .amount-label {
            font-size: 0.62rem;
          }
          .amount-value {
            font-size: 0.9rem;
          }
          .month-label {
            font-size: 0.62rem;
          }
          .month-value {
            font-size: 0.9rem;
          }
        }
        @media (max-width: 380px) {
          .chit-amounts-grid, .chit-months-grid {
            gap: 0;
          }
          .amount-value {
            font-size: 0.82rem;
          }
          .month-value {
            font-size: 0.82rem;
          }
          .stat-value {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
