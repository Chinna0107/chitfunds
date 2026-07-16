import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ScrollAnimationWrapper from '../../components/ScrollAnimationWrapper';
import { 
  Plus, 
  List, 
  Users, 
  IndianRupee, 
  Calendar, 
  FileText, 
  Check, 
  X, 
  User, 
  ChevronRight,
  Gavel,
  ChevronDown,
  ChevronUp,
  Info,
  Star,
  ArrowLeft
} from 'lucide-react';

const FormationIllustration = () => (
  <svg viewBox="0 0 500 240" width="100%" height="100%" style={{ maxHeight: '160px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clipboard Illustration */}
    <rect x="200" y="20" width="100" height="150" rx="10" fill="#ffffff" stroke="#cbe2d6" strokeWidth="3" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.05))" />
    <rect x="230" y="10" width="40" height="20" rx="4" fill="#a16207" />
    {/* Checklist lines */}
    <rect x="220" y="60" width="60" height="8" rx="4" fill="#1e6b3e" opacity="0.15" />
    <rect x="220" y="90" width="60" height="8" rx="4" fill="#1e6b3e" opacity="0.15" />
    <rect x="220" y="120" width="60" height="8" rx="4" fill="#1e6b3e" opacity="0.15" />
    {/* Green ticks */}
    <path d="M210 64l4 4 8-8" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M210 94l4 4 8-8" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M210 124l4 4 8-8" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" />

    {/* Guy on Left */}
    <g transform="translate(100, 30)">
      <rect x="20" y="60" width="22" height="60" rx="8" fill="#2e7d32" />
      <circle cx="31" cy="45" r="10" fill="#ffcc80" />
      <path d="M25 40c2-3 8-2 10 1s-1 8-5 8-5-7-5-9z" fill="#374151" />
      <rect x="15" y="70" width="10" height="20" rx="3" fill="#ffcc80" />
    </g>

    {/* Girl on Right */}
    <g transform="translate(320, 30)">
      <rect x="20" y="60" width="22" height="60" rx="8" fill="#facc15" />
      <circle cx="31" cy="45" r="10" fill="#ffcc80" />
      <path d="M25 40c2-3 8-2 10 1s-1 8-5 8-5-7-5-9z" fill="#374151" />
      <rect x="37" y="70" width="10" height="20" rx="3" fill="#ffcc80" />
    </g>

    {/* Plant Elements */}
    <path d="M50 170c0-30 20-30 20-30s0 30-20 30zm30 0c0-20 15-20 15-20s0 20-15 20z" fill="#1e6b3e" opacity="0.2" />
    <path d="M430 170c0-30 20-30 20-30s0 30-20 30zm-30 0c0-20 15-20 15-20s0 20-15 20z" fill="#1e6b3e" opacity="0.2" />
  </svg>
);

const ChitManager = () => {
  const { token, API_URL } = useAuth();
  const [chits, setChits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChitId, setExpandedChitId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [totalMembers, setTotalMembers] = useState('20');
  const [chitValue, setChitValue] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('10000');
  const [durationMonths, setDurationMonths] = useState('20');
  const [auctionType, setAuctionType] = useState('Open Auction');
  const [terms, setTerms] = useState('');
  
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const fetchChits = async () => {
    try {
      const response = await fetch(`${API_URL}/chits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setChits(data.data);
      }
    } catch (error) {
      console.error('Error fetching chits for admin:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChits();
  }, [token, API_URL]);

  // Derived Preview calculations matching screenshot preview section
  const previewMembersCountText = `${totalMembers || 0}/${totalMembers || 0}`;
  const previewMonthlyAmount = Number(monthlyContribution) || 0;
  const previewDurationText = `${durationMonths || 0} Months`;
  const computedTotalValue = (Number(monthlyContribution) || 0) * (Number(durationMonths) || 0);

  const handleCreateChit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    const calculatedChitValue = computedTotalValue;

    try {
      const response = await fetch(`${API_URL}/chits`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          totalMembers: Number(totalMembers),
          chitValue: calculatedChitValue,
          monthlyContribution: Number(monthlyContribution),
          durationMonths: Number(durationMonths),
          termsAndConditions: terms || `Auction Type: ${auctionType}`
        })
      });

      const data = await response.json();
      if (data.success) {
        setFormSuccess('Chit group created successfully!');
        setName('');
        setTotalMembers('20');
        setMonthlyContribution('10000');
        setDurationMonths('20');
        setTerms('');
        setShowForm(false);
        await fetchChits();
      } else {
        setFormError(data.message || 'Failed to create chit group.');
      }
    } catch (error) {
      console.error('Error creating chit:', error);
      setFormError('Server error creating chit.');
    } finally {
      setFormLoading(false);
    }
  };



  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', fontWeight: 600, color: 'var(--color-primary-green)' }}>Loading Chit schemes management...</div>;
  }

  return (
    <div style={{ padding: '1rem', width: '100%', display: 'grid', gridTemplateColumns: '1.25fr 1.75fr', gap: '2rem' }} className="admin-chit-grid">
      
      {/* Create Chit Section (Chit Formation view matching screenshots) */}
      <ScrollAnimationWrapper>
        <div className="glass-panel card-premium" style={{ backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.08)', padding: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
            <button type="button" style={{ color: 'var(--color-primary-green)' }}>
              <ArrowLeft size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-green)' }}>
              Chit Formation
            </h2>
          </div>

          {!showForm ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <Check size={32} color="#166534" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#166534', marginBottom: '0.5rem' }}>Chit Created!</h3>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', marginBottom: '2rem' }}>
                The chit group has been successfully added. It is now visible in the list and waiting for members to join.
              </p>
              <button 
                onClick={() => { setShowForm(true); setFormSuccess(''); }} 
                className="btn-primary" 
                style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}
              >
                Create Another Chit
              </button>
            </div>
          ) : (
            <>
              {/* Hero Illustration block */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #f0fdf4 0%, #e2efe8 100%)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <FormationIllustration />
            <h4 style={{ fontWeight: 800, color: '#166534', fontSize: '0.95rem', marginTop: '0.5rem' }}>Create New Chit</h4>
            <p style={{ fontSize: '0.75rem', color: '#4b5563' }}>Build your chit group and start saving together.</p>
          </div>

          {formSuccess && (
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: '#e8f5e9', border: '1px solid var(--color-success)', color: '#166534', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {formSuccess}
            </div>
          )}

          {formError && (
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--color-danger)', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateChit}>
            {/* Input 1: Chit Name */}
            <div className="input-group">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Chit Name</span>
              <div style={{ position: 'relative' }}>
                <Users size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="chitName"
                  type="text"
                  required
                  placeholder="Enter chit name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Input 2: Number of Members */}
            <div className="input-group">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Number of Members</span>
              <div style={{ position: 'relative' }}>
                <Users size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <select
                  value={totalMembers}
                  onChange={(e) => {
                    setTotalMembers(e.target.value);
                    setDurationMonths(e.target.value); // Sync default duration
                  }}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem', appearance: 'none' }}
                >
                  <option value="10">10 Members</option>
                  <option value="20">20 Members</option>
                  <option value="30">30 Members</option>
                  <option value="40">40 Members</option>
                  <option value="50">50 Members</option>
                </select>
                <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              </div>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'block', marginTop: '0.25rem', paddingLeft: '0.5rem' }}>
                Default is 20 members (Configurable)
              </span>
            </div>

            {/* Input 3: Monthly Value */}
            <div className="input-group">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Chit Value (Per Month)</span>
              <div style={{ position: 'relative' }}>
                <IndianRupee size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  id="monthlyContribution"
                  type="number"
                  required
                  placeholder="e.g. 10000"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Input 4: Chit Duration */}
            <div className="input-group">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Chit Duration (Months)</span>
              <div style={{ position: 'relative' }}>
                <Calendar size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem', appearance: 'none' }}
                >
                  <option value="10">10 Months</option>
                  <option value="20">20 Months</option>
                  <option value="30">30 Months</option>
                  <option value="40">40 Months</option>
                  <option value="50">50 Months</option>
                </select>
                <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Input 5: Auction Type */}
            <div className="input-group">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Auction Type</span>
              <div style={{ position: 'relative' }}>
                <Gavel size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <select
                  value={auctionType}
                  onChange={(e) => setAuctionType(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem', appearance: 'none' }}
                >
                  <option value="Open Auction">Open Auction</option>
                  <option value="Written Bid">Written Bid</option>
                </select>
                <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Input 6: Admin */}
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '0.35rem' }}>Chit Admin</span>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  type="text"
                  disabled
                  value="You"
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', height: '44px', fontSize: '0.9rem', backgroundColor: '#f9fafb', color: '#166534', fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Alert: How it works */}
            <div style={{
              backgroundColor: '#f0fdf4',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(22, 101, 52, 0.08)',
              fontSize: '0.8rem',
              color: '#166534',
              marginBottom: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              lineHeight: 1.4
            }}>
              <span style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Info size={14} />
                <span>How it works?</span>
              </span>
              <span>• Chit will start only after all required members join.</span>
              <span>• You will be notified once the chit is ready to start.</span>
            </div>

            {/* Chit Preview Panel */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary-green)', display: 'block', marginBottom: '0.75rem' }}>Chit Preview</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: '#e8f5e9', color: '#166534' }}>
                    <Users size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'block' }}>Members</span>
                    <strong style={{ fontSize: '0.85rem' }}>{previewMembersCountText}</strong>
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: '#e8f5e9', color: '#166534' }}>
                    <IndianRupee size={14} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'block' }}>Monthly Amount</span>
                    <strong style={{ fontSize: '0.85rem' }}>₹{previewMonthlyAmount.toLocaleString()}</strong>
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: '#e8f5e9', color: '#166534' }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'block' }}>Duration</span>
                    <strong style={{ fontSize: '0.85rem' }}>{previewDurationText}</strong>
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: '#fefbeb', color: '#ca8a04' }}>
                    <Star size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#9ca3af', display: 'block' }}>Total Collection</span>
                    <strong style={{ fontSize: '0.85rem', color: '#ca8a04' }}>₹{computedTotalValue.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Alert note */}
              <div style={{
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: '#ca8a04',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#fefbeb',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)'
              }}>
                <Star size={14} />
                <span>Chit will start automatically when {totalMembers} members join.</span>
              </div>
            </div>

            {/* Create Chit Button */}
            <button
              type="submit"
              disabled={formLoading}
              className="btn-primary"
              style={{
                width: '100%',
                height: '46px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(30, 107, 62, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {formLoading ? 'Creating Chit...' : 'Create Chit'}
            </button>
          </form>
          </>)}
        </div>
      </ScrollAnimationWrapper>

      {/* Chit Schemes List (Manage section) */}
      <ScrollAnimationWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <List size={22} color="var(--color-primary-green)" />
              <span>Active Chit Groups</span>
            </h2>
            <a href="/admin/chit-approvals" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', textDecoration: 'none' }}>
              Manage Approvals &rarr;
            </a>
          </div>

          {chits.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff' }}>
              <p style={{ color: 'var(--color-secondary)' }}>No chit groups created yet. Launch one using the form.</p>
            </div>
          ) : (
            chits.map((chit) => {
              const approvedCount = chit.members.filter((m) => m.status === 'approved').length;

              return (
                <div key={chit.id} className="glass-panel card-premium" style={{ backgroundColor: '#fff', border: '1px solid rgba(30, 107, 62, 0.06)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary-green)' }}>{chit.name}</h4>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
                        Value: <strong>₹{chit.chitValue.toLocaleString()}</strong> | Members: <strong>{approvedCount >= chit.totalMembers ? 'Filled' : `${approvedCount}/${chit.totalMembers}`}</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {chit.status === 'active' ? (
                        <span className="badge badge-active" style={{ backgroundColor: '#e8f5e9', color: '#166534' }}>Active (Month {chit.currentMonth}/{chit.durationMonths})</span>
                      ) : chit.status === 'completed' ? (
                        <span className="badge badge-approved" style={{ backgroundColor: '#e8f5e9', color: '#166534' }}>Completed</span>
                      ) : (
                        <span className="badge badge-pending" style={{ backgroundColor: '#fef3c7', color: '#ca8a04' }}>Upcoming</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollAnimationWrapper>

      <style>{`
        @media (max-width: 900px) {
          .admin-chit-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChitManager;
