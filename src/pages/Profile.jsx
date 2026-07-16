import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ScrollAnimationWrapper from '../components/ScrollAnimationWrapper';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  FileText, 
  CheckCircle,
  Briefcase,
  CreditCard,
  Eye,
  Calendar,
  Hourglass,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user, token, API_URL } = useAuth();
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'history'
  
  // History State
  const [chits, setChits] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  useEffect(() => {
    if (!user || user.role === 'superadmin') return;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const chitsRes = await fetch(`${API_URL}/chits`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const chitsData = await chitsRes.json();
        
        const paymentsRes = await fetch(`${API_URL}/payments/my-payments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const paymentsData = await paymentsRes.json();
        
        if (chitsData.success && paymentsData.success) {
          // Filter chits where this user is an approved member
          const joined = chitsData.data.filter((chit) => 
            chit.members.some((m) => m.user.id === user.id && m.status === 'approved')
          );
          setChits(joined);
          setPayments(paymentsData.data);
        }
      } catch (error) {
        console.error('Error fetching profile ledger details:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [token, user, API_URL]);

  if (!user) return null;

  const getFullImgUrl = (path) => {
    if (!path) return 'https://res.cloudinary.com/demo/image/upload/v12345/mock-placeholder.png';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${path}`;
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <ScrollAnimationWrapper>
        <div className="glass-panel card-premium" style={{ padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          
          {/* User Profile Header banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-yellow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--accent-yellow-dark)',
              filter: 'drop-shadow(0 2px 4px rgba(250, 204, 21, 0.2))'
            }}>
              <User size={36} color="var(--color-primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span className="badge badge-approved" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle size={12} />
                  <span>Approved Member</span>
                </span>
                <span className="badge" style={{ backgroundColor: 'var(--border-subtle)', color: 'var(--color-primary)' }}>
                  {user.role === 'superadmin' ? 'Superadmin' : 'User'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation tabs inside profile for standard users */}
          {user.role !== 'superadmin' && (
            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
              <button 
                onClick={() => setActiveTab('details')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderBottom: activeTab === 'details' ? '3px solid var(--accent-yellow-dark)' : '3px solid transparent',
                  fontWeight: activeTab === 'details' ? 700 : 500,
                  color: activeTab === 'details' ? 'var(--color-primary)' : 'var(--color-secondary)',
                  transition: 'var(--transition-fast)'
                }}
              >
                Personal Info
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderBottom: activeTab === 'history' ? '3px solid var(--accent-yellow-dark)' : '3px solid transparent',
                  fontWeight: activeTab === 'history' ? 700 : 500,
                  color: activeTab === 'history' ? 'var(--color-primary)' : 'var(--color-secondary)',
                  transition: 'var(--transition-fast)'
                }}
              >
                Savings Ledger & History
              </button>
            </div>
          )}

          {/* Tab 1: Personal Info details (or displayed always for admin) */}
          {(activeTab === 'details' || user.role === 'superadmin') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {/* Account Details */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={18} color="var(--accent-yellow-dark)" />
                  <span>Account Information</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Mail size={18} color="var(--color-secondary)" />
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>Email Address</p>
                      <p style={{ fontWeight: 500 }}>{user.email}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Phone size={18} color="var(--color-secondary)" />
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>Phone Number</p>
                      <p style={{ fontWeight: 500 }}>{user.phone}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <Shield size={18} color="var(--color-secondary)" />
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>User Role</p>
                      <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Proofs */}
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="var(--accent-yellow-dark)" />
                  <span>Uploaded Documents</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {user.aadharImgUrl && (
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Aadhar Card Proof</p>
                      <div 
                        onClick={() => setLightboxUrl(getFullImgUrl(user.aadharImgUrl))}
                        className="input-field" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                      >
                        <FileText size={16} />
                        <span style={{ fontSize: '0.85rem', textDecoration: 'underline', color: 'var(--color-primary)' }}>View Aadhar Image</span>
                      </div>
                    </div>
                  )}

                  {user.panImgUrl && (
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>PAN Card Proof</p>
                      <div 
                        onClick={() => setLightboxUrl(getFullImgUrl(user.panImgUrl))}
                        className="input-field" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}
                      >
                        <FileText size={16} />
                        <span style={{ fontSize: '0.85rem', textDecoration: 'underline', color: 'var(--color-primary)' }}>View PAN Image</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Savings Ledger & History (only for users) */}
          {user.role !== 'superadmin' && activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading savings log...</div>
              ) : (
                <>
                  {/* Active Joined Chits List */}
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Briefcase size={18} color="var(--accent-yellow-dark)" />
                      <span>My Savings Pools ({chits.length})</span>
                    </h3>
                    
                    {chits.length === 0 ? (
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>You have not joined any active chit groups yet.</p>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {chits.map(chit => (
                          <div key={chit.id} style={{ padding: '1rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: '#fff' }}>
                            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{chit.name}</p>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-secondary)' }}>
                              <p>Pool Value: <strong>₹{chit.chitValue.toLocaleString()}</strong></p>
                              <p>Monthly payment: <strong>₹{chit.monthlyContribution.toLocaleString()}</strong></p>
                              <p>Chit Status: <strong style={{ textTransform: 'capitalize' }}>{chit.status}</strong></p>
                              {chit.startDate && <p>Start Date: <strong>{new Date(chit.startDate).toLocaleDateString()}</strong></p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contributions History ledger table */}
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CreditCard size={18} color="var(--accent-yellow-dark)" />
                      <span>Cash Installments Record ({payments.length})</span>
                    </h3>

                    {payments.length === 0 ? (
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>No payment records found.</p>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--color-secondary)' }}>
                              <th style={{ padding: '0.75rem 0.5rem' }}>Chit Pool</th>
                              <th style={{ padding: '0.75rem 0.5rem' }}>Installment</th>
                              <th style={{ padding: '0.75rem 0.5rem' }}>Amount</th>
                              <th style={{ padding: '0.75rem 0.5rem' }}>Transaction ID</th>
                              <th style={{ padding: '0.75rem 0.5rem' }}>Receipt Image</th>
                              <th style={{ padding: '0.75rem 0.5rem' }}>Verification</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((p) => (
                              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{p.chit?.name || 'Deleted Scheme'}</td>
                                <td style={{ padding: '0.75rem 0.5rem' }}>Month {p.monthNumber}</td>
                                <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>₹{p.amount.toLocaleString()}</td>
                                <td style={{ padding: '0.75rem 0.5rem' }}><code>{p.transactionId}</code></td>
                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                  <button 
                                    onClick={() => setLightboxUrl(getFullImgUrl(p.proofImgUrl))}
                                    className="btn-secondary" 
                                    style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}
                                  >
                                    <Eye size={12} />
                                    <span>View Receipt</span>
                                  </button>
                                </td>
                                <td style={{ padding: '0.75rem 0.5rem' }}>
                                  <span className={`badge ${p.status === 'approved' ? 'badge-approved' : p.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`} style={{ fontSize: '0.7rem' }}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </ScrollAnimationWrapper>

      {/* Fullscreen Lightbox Zoom modal */}
      {lightboxUrl && (
        <div 
          onClick={() => setLightboxUrl(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '1rem',
            cursor: 'zoom-out'
          }}
        >
          <img 
            src={lightboxUrl} 
            alt="Ledger Proof Preview" 
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
