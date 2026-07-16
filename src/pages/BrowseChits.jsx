import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ScrollAnimationWrapper from '../components/ScrollAnimationWrapper';
import { Search, Info, HelpCircle, UserPlus, Check, Hourglass } from 'lucide-react';

const BrowseChits = () => {
  const { user, token, API_URL } = useAuth();
  const [chits, setChits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

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
      console.error('Error fetching chits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChits();
  }, [token, API_URL]);

  const handleJoinRequest = async (chitId) => {
    setMessage({ text: '', type: '' });
    setActionLoading(true);

    try {
      const response = await fetch(`${API_URL}/chits/${chitId}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ text: data.message, type: 'success' });
        // Refresh chit list
        await fetchChits();
      } else {
        setMessage({ text: data.message || 'Failed to submit request.', type: 'danger' });
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      setMessage({ text: 'Server error. Please try again.', type: 'danger' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading available chit schemes...</div>;
  }

  return (
    <div style={{ padding: '1rem', width: '100%' }}>
      <ScrollAnimationWrapper>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Browse <span style={{ color: 'var(--accent-yellow-dark)' }}>Chit Schemes</span>
          </h1>
          <p style={{ color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
            Find the perfect saving and borrowing plan that matches your monthly goals.
          </p>
        </div>
      </ScrollAnimationWrapper>

      {message.text && (
        <div style={{
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: `1px solid ${message.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
          color: message.type === 'success' ? '#065f46' : '#b91c1c'
        }}>
          {message.text}
        </div>
      )}

      {chits.length === 0 ? (
        <div className="card-premium" style={{ textAlign: 'center', padding: '3rem' }}>
          <HelpCircle size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--color-secondary)' }} />
          <h3 style={{ fontWeight: 700 }}>No Chit Schemes Available</h3>
          <p style={{ color: 'var(--color-secondary)', marginTop: '0.25rem' }}>The Superadmin has not created any chit groups yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {chits.map((chit) => {
            // Find current user's state in this chit
            const enrollment = chit.members.find(m => m.user.id === user.id);
            const approvedCount = chit.members.filter(m => m.status === 'approved').length;
            const isFull = approvedCount >= chit.totalMembers;

            return (
              <ScrollAnimationWrapper key={chit.id}>
                <div className="glass-panel card-premium" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  border: '1px solid rgba(255, 255, 255, 0.6)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{chit.name}</h3>
                      {chit.status === 'active' ? (
                        <span className="badge badge-active">Active</span>
                      ) : chit.status === 'completed' ? (
                        <span className="badge badge-approved">Completed</span>
                      ) : (
                        <span className="badge badge-pending">Enrolling</span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                      <div>
                        <p style={{ color: 'var(--color-secondary)' }}>Total Value</p>
                        <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>₹{chit.chitValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--color-secondary)' }}>Monthly contribution</p>
                        <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-yellow-dark)' }}>₹{chit.monthlyContribution.toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--color-secondary)' }}>Duration</p>
                        <p style={{ fontWeight: 600 }}>{chit.durationMonths} Months</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--color-secondary)' }}>Filled Members</p>
                        <p style={{ fontWeight: 600 }}>
                          {isFull ? <span style={{ color: 'var(--color-primary)' }}>Filled ({chit.totalMembers}/{chit.totalMembers})</span> : `${approvedCount} / ${chit.totalMembers}`}
                        </p>
                      </div>
                    </div>

                    {chit.termsAndConditions && (
                      <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          <Info size={12} />
                          <span>Terms</span>
                        </div>
                        <p style={{ color: 'var(--color-secondary)' }}>{chit.termsAndConditions}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    {enrollment ? (
                      enrollment.status === 'pending' ? (
                        <button disabled style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-warning)', fontWeight: 600 }}>
                          <Hourglass size={16} />
                          <span>Requested (Pending Approval)</span>
                        </button>
                      ) : enrollment.status === 'approved' ? (
                        <button disabled style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success)', fontWeight: 600 }}>
                          <Check size={16} />
                          <span>Enrolled Member</span>
                        </button>
                      ) : (
                        <button disabled style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger)', fontWeight: 600 }}>
                          <span>Enrollment Rejected</span>
                        </button>
                      )
                    ) : isFull ? (
                      <button disabled style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#e5e7eb', color: '#9ca3af', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                        <span>Scheme is Full</span>
                      </button>
                    ) : chit.status !== 'upcoming' ? (
                      <button disabled style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#e5e7eb', color: '#9ca3af', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                        <span>Scheme Started</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinRequest(chit.id)}
                        disabled={actionLoading}
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <UserPlus size={16} />
                        <span>Send Join Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </ScrollAnimationWrapper>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseChits;
