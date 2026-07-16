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
  Bell
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
        if (user.role === 'superadmin') {
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

  // ================= ADMIN VIEW =================
  if (user.role === 'superadmin') {
    return (
      <div style={{ padding: '1rem', width: '100%' }}>
        <ScrollAnimationWrapper>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
              Welcome back, <span style={{ color: 'var(--accent-yellow-dark)' }}>Admin</span>
            </h1>
            <p style={{ color: 'var(--color-secondary)', fontSize: '1rem' }}>
              Here is your overview of Chit Fund platform activities.
            </p>
          </div>
        </ScrollAnimationWrapper>

        {/* Stats Grid */}
        <div className="stats-grid-layout" style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <ScrollAnimationWrapper>
            <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)' }}>
              <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: 'var(--radius-md)' }}>
                <Users size={28} color="#166534" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Active Members</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalUsers || 0}</h3>
              </div>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper>
            <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)' }}>
              <div style={{ padding: '0.75rem', background: '#fefbeb', borderRadius: 'var(--radius-md)' }}>
                <Clock size={28} color="#ca8a04" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Users</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: stats?.pendingApprovals > 0 ? 'var(--color-warning)' : 'inherit' }}>
                  {stats?.pendingApprovals || 0}
                </h3>
              </div>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper>
            <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)' }}>
              <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: 'var(--radius-md)' }}>
                <Briefcase size={28} color="#166534" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Active Chits</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.activeChits || 0} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-secondary)' }}>/ {stats?.totalChits || 0} total</span></h3>
              </div>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper>
            <div className="card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)' }}>
              <div style={{ padding: '0.75rem', background: '#fefbeb', borderRadius: 'var(--radius-md)' }}>
                <IndianRupee size={28} color="#ca8a04" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Collected</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{(stats?.totalRevenue || 0).toLocaleString()}</h3>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>

        {/* Action center */}
        <ScrollAnimationWrapper>
          <div className="glass-panel card-premium" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-green)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={22} color="var(--color-primary-green)" />
              <span>Admin Action Items</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              <div className="card-premium" style={{ border: '1px solid var(--border-subtle)', background: '#fafbfc' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>User Registration Approvals</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '1.25rem' }}>
                  Verify submitted Aadhar and PAN photos to activate new user accounts.
                </p>
                <Link to="/admin/users" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  <span>Review {stats?.pendingApprovals || 0} Requests</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="card-premium" style={{ border: '1px solid var(--border-subtle)', background: '#fafbfc' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Payment Receipt Verifications</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '1.25rem' }}>
                  Verify user transaction receipts to record monthly installments.
                </p>
                <Link to="/admin/payments" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  <span>Review {stats?.pendingPaymentsCount || 0} Payments</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="card-premium" style={{ border: '1px solid var(--border-subtle)', background: '#fafbfc' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Chit Pool Creator</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginBottom: '1.25rem' }}>
                  Set up new chit groups, edit rules, and configure launch properties.
                </p>
                <Link to="/admin/chits" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  <span>Manage Groups</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
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
    <div style={{ padding: '1rem', width: '100%' }}>
      
      {/* Hello Ramesh Section */}
      <ScrollAnimationWrapper>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
            Hello, {user.name} 👋
          </h1>
          <p style={{ color: 'var(--color-secondary)', fontSize: '1rem', marginTop: '0.25rem' }}>
            Welcome back to your dashboard
          </p>
        </div>
      </ScrollAnimationWrapper>

      {/* Stats Summary Card Row (Ramesh style) */}
      <div className="stats-grid-layout" style={{ display: 'grid', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>Active Chits</span>
            <div style={{ padding: '0.4rem', background: '#e8f5e9', borderRadius: '50%', color: '#166534' }}>
              <Briefcase size={18} />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534' }}>{activeChits.length}</span>
        </div>

        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>Completed Chits</span>
            <div style={{ padding: '0.4rem', background: '#e8f5e9', borderRadius: '50%', color: '#166534' }}>
              <Check size={18} />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534' }}>{completedCount}</span>
        </div>

        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>Pending Approval</span>
            <div style={{ padding: '0.4rem', background: '#fefbeb', borderRadius: '50%', color: '#ca8a04' }}>
              <Clock size={18} />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ca8a04' }}>{pendingJoinCount}</span>
        </div>

        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', padding: '1.25rem', backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>Total Enrolled</span>
            <div style={{ padding: '0.4rem', background: '#e8f5e9', borderRadius: '50%', color: '#166534' }}>
              <Users size={18} />
            </div>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#166534' }}>{approvedChits.length + pendingJoinCount}</span>
        </div>
      </div>

      {/* Main Grid: Columns for Laptop, stacked on Mobile */}
      <div className="dashboard-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '2rem' }}>
        
        {/* Left Side: Chit details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {primaryChit ? (
            <div className="card-premium" style={{ backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)', padding: '2rem' }}>
              {/* Header Title of Active Chit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-green-light)',
                    color: 'var(--color-primary-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-green)', lineHeight: 1.2 }}>{primaryChit.name}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.15rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {chitIdText}</span>
                      <span className="badge badge-active" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', backgroundColor: '#e8f5e9', color: '#166534' }}>Active</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Monthly EMI</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>₹{monthlyEmi.toLocaleString()}</span>
                </div>
              </div>

              {/* Grid: Due / Paid / Remaining Amounts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '1rem',
                padding: '1.25rem',
                backgroundColor: '#fafbfc',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Due Amount</span>
                  <p style={{ fontSize: '1.15rem', fontWeight: 800, color: dueAmount > 0 ? '#dc2626' : '#166534', marginTop: '0.25rem' }}>
                    ₹{dueAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Paid Amount</span>
                  <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#166534', marginTop: '0.25rem' }}>
                    ₹{paidAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>Remaining Amount</span>
                  <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#d97706', marginTop: '0.25rem' }}>
                    ₹{remainingAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress/Remaining Months */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.25fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#6b7280', display: 'block' }}>Remaining Months</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>{remainingMonths}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block' }}>Current Month</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>{currentMonthProgressText}</strong>
                </div>
                <div>
                  <span style={{ color: '#6b7280', display: 'block' }}>Next Due Date</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>5th of Current Month</strong>
                </div>
              </div>

              {/* Table List of Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' }}>
                    <Calendar size={16} />
                    <span>Chit Start Date</span>
                  </div>
                  <strong style={{ color: '#111827' }}>{startDateText}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563' }}>
                    <Calendar size={16} />
                    <span>Chit End Date</span>
                  </div>
                  <strong style={{ color: '#111827' }}>{endDateText}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Auction Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Next Auction: {getUpcomingAuctionDate()}</span>
                    <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#ca8a04', fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>Upcoming</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Payment Status</span>
                  <span className={`badge ${paymentStatusClass}`} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>{paymentStatus}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f3f4f6', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <span style={{ color: '#4b5563', fontWeight: 600 }}>Installment History</span>
                  <Link to="/my-chits" style={{ color: 'var(--color-primary-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.15rem', textDecoration: 'none' }}>
                    <span>View Details</span>
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>

              {/* View Chit Details Button */}
              <button
                onClick={() => navigate('/my-chits')}
                className="btn-secondary"
                style={{
                  width: '100%',
                  height: '46px',
                  borderRadius: 'var(--radius-full)',
                  borderColor: 'var(--color-primary-green)',
                  color: 'var(--color-primary-green)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>View Chit Details</span>
              </button>
            </div>
          ) : (
            <div className="card-premium" style={{ backgroundColor: '#fff', border: '1px dashed #cbe2d6', padding: '3.5rem', textAlign: 'center' }}>
              <Briefcase size={48} color="var(--color-secondary)" style={{ margin: '0 auto 1.25rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>No Active Chits</h3>
              <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 1.75rem 0', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>
                You are not currently enrolled as an approved member in any active chit schemes.
              </p>
              <button onClick={() => navigate('/chits')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 'var(--radius-full)' }}>
                <span>Browse Available Schemes</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Other Active Chits Section */}
          {otherChits.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>Other Active Chits</h4>
                <Link to="/my-chits" style={{ fontSize: '0.8rem', color: 'var(--color-primary-green)', fontWeight: 700, textDecoration: 'none' }}>View All</Link>
              </div>

              {otherChits.map(chit => (
                <div
                  onClick={() => navigate('/my-chits')}
                  key={chit.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    backgroundColor: '#fff',
                    border: '1px solid rgba(30, 107, 62, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  className="other-chit-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#e8f5e9',
                      color: '#166534',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>{chit.name}</span>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block', marginTop: '0.1rem' }}>
                        ID: CHIT{chit.id.slice(-4).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: '#6b7280', display: 'block' }}>Monthly EMI</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-green)' }}>₹{chit.monthlyContribution.toLocaleString()}</span>
                    </div>
                    <ChevronRight size={18} color="#9ca3af" />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Side: Notifications & Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Notifications Card */}
          <div className="card-premium" style={{ backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} />
                <span>Notifications</span>
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 700, cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {primaryChit && paymentStatus !== 'Paid' ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626', marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.3 }}>
                      Your EMI of <strong>₹{monthlyEmi.toLocaleString()}</strong> is due on the 5th of this month.
                    </p>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>2m ago</span>
                  </div>
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ca8a04', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.3 }}>
                    Auction is scheduled on <strong>25th of this month</strong>. Register your bid options online.
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>1h ago</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#166534', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.3 }}>
                    Superadmin verified your Aadhar & PAN registration profile details. KYC is complete.
                  </p>
                  <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>1d ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements Card */}
          <div className="card-premium" style={{ backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ListFilter size={18} />
                <span>Announcements</span>
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 700, cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <MegaphoneIcon />
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginTop: '0.5rem' }}>
                New Chit Schemes Launched!
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', maxWidth: '180px', lineHeight: 1.3 }}>
                "Happy Savings Chit" starting from ₹5,000 monthly.
              </p>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>3d ago</span>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .stats-grid-layout {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .other-chit-item:hover {
          background-color: var(--color-primary-green-light) !important;
          border-color: var(--color-primary-green) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .dashboard-grid-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .stats-grid-layout {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
          .stats-grid-layout .card-premium {
            padding: 1rem !important;
          }
          .stats-grid-layout span[style*="1.75rem"], .stats-grid-layout h3 {
            font-size: 1.35rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
