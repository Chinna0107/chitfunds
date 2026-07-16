import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ScrollAnimationWrapper from '../components/ScrollAnimationWrapper';
import { 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  X, 
  DollarSign, 
  CreditCard 
} from 'lucide-react';

const MyActiveChits = () => {
  const { user, token, API_URL } = useAuth();
  const [chits, setChits] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChitId, setExpandedChitId] = useState(null);
  
  // Payment Modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [modalChit, setModalChit] = useState(null);
  const [modalMonth, setModalMonth] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofFileName, setProofFileName] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch chits
      const chitsRes = await fetch(`${API_URL}/chits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const chitsData = await chitsRes.json();
      
      // Fetch user payments
      const paymentsRes = await fetch(`${API_URL}/payments/my-payments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const paymentsData = await paymentsRes.json();

      if (chitsData.success && paymentsData.success) {
        // Filter chits where this user is an APPROVED member
        const approvedChits = chitsData.data.filter((chit) => 
          chit.members.some((m) => m.user.id === user.id && m.status === 'approved')
        );
        setChits(approvedChits);
        setPayments(paymentsData.data);
      }
    } catch (error) {
      console.error('Error fetching user active chits data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, API_URL]);

  const toggleExpandChit = (id) => {
    setExpandedChitId(expandedChitId === id ? null : id);
  };

  const openPaymentModal = (chit, month) => {
    setModalChit(chit);
    setModalMonth(month);
    setTransactionId('');
    setProofFile(null);
    setProofFileName('');
    setSubmitError('');
    setShowPayModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSubmitError('Please select an image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setProofFile(file);
      setProofFileName(file.name);
      setSubmitError('');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId || !proofFile) {
      setSubmitError('Please fill in transaction ID and upload a receipt image.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('chitId', modalChit.id);
      formData.append('monthNumber', modalMonth);
      formData.append('amount', modalChit.monthlyContribution);
      formData.append('transactionId', transactionId);
      formData.append('proof', proofFile);

      const response = await fetch(`${API_URL}/payments/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setShowPayModal(false);
        // Refresh data
        await fetchData();
      } else {
        setSubmitError(data.message || 'Payment submission failed.');
      }
    } catch (error) {
      console.error('Error submitting payment proof:', error);
      setSubmitError('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPaymentForMonth = (chitId, monthNumber) => {
    return payments.find((p) => p.chitId === chitId && p.monthNumber === monthNumber);
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your active chits...</div>;
  }

  return (
    <div style={{ padding: '1rem', width: '100%' }}>
      <ScrollAnimationWrapper>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            My Active <span style={{ color: 'var(--accent-yellow-dark)' }}>Chits</span>
          </h1>
          <p style={{ color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
            Track your payment schedule, check dues, and submit monthly installment receipts.
          </p>
        </div>
      </ScrollAnimationWrapper>

      {chits.length === 0 ? (
        <div className="card-premium" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <Briefcase size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--color-secondary)' }} />
          <h3 style={{ fontWeight: 700 }}>No Joined Schemes</h3>
          <p style={{ color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
            You haven't been approved in any chit schemes yet. Join schemes in the Browse section.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {chits.map((chit) => {
            const isExpanded = expandedChitId === chit.id;
            
            return (
              <ScrollAnimationWrapper key={chit.id}>
                <div className="glass-panel card-premium" style={{ border: '1px solid rgba(255, 255, 255, 0.6)' }}>
                  {/* Header Row */}
                  <div 
                    onClick={() => toggleExpandChit(chit.id)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{chit.name}</h3>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--color-secondary)' }}>
                        <span>Pool: <strong>₹{chit.chitValue.toLocaleString()}</strong></span>
                        <span>EMI: <strong>₹{chit.monthlyContribution.toLocaleString()}</strong></span>
                        <span>Duration: <strong>{chit.durationMonths} months</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {chit.status === 'active' ? (
                        <span className="badge badge-active">Active (Month {chit.currentMonth}/{chit.durationMonths})</span>
                      ) : chit.status === 'completed' ? (
                        <span className="badge badge-approved">Completed</span>
                      ) : (
                        <span className="badge badge-pending">Enrolled (Upcoming)</span>
                      )}
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Expanded Installments List */}
                  {isExpanded && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                      <h4 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Installment Schedule</h4>
                      
                      {chit.status === 'upcoming' ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--color-secondary)' }}>
                          This chit fund has not started yet. Once the required limit ({chit.totalMembers} members) is approved by the admin, the payment cycles will open.
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                          {Array.from({ length: chit.durationMonths }, (_, i) => i + 1).map((monthNum) => {
                            const chitStartDate = new Date(chit.startDate || chit.createdAt);
                            const dueDate = new Date(chitStartDate);
                            dueDate.setMonth(dueDate.getMonth() + monthNum - 1);
                            dueDate.setDate(5); // Default due date is 5th of the month
                            const formattedDueDate = dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                            const payment = getPaymentForMonth(chit.id, monthNum);
                            const isCurrent = chit.currentMonth === monthNum && chit.status === 'active';
                            
                            let statusText = 'Unpaid';
                            let statusClass = 'badge-pending';
                            let canPay = chit.status === 'active' && monthNum <= chit.currentMonth;

                            if (payment) {
                              if (payment.status === 'approved') {
                                statusText = 'Paid';
                                statusClass = 'badge-approved';
                                canPay = false;
                              } else if (payment.status === 'pending') {
                                statusText = 'Verifying';
                                statusClass = 'badge-pending';
                                canPay = false;
                              } else if (payment.status === 'rejected') {
                                statusText = 'Rejected';
                                statusClass = 'badge-rejected';
                                canPay = true; // Can resubmit
                              }
                            }

                            return (
                              <div 
                                key={monthNum} 
                                style={{ 
                                  padding: '1.25rem', 
                                  border: isCurrent ? '1px solid var(--accent-yellow-dark)' : '1px solid var(--border-subtle)', 
                                  borderRadius: 'var(--radius-md)',
                                  background: isCurrent ? 'var(--accent-yellow-light)' : '#ffffff',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  gap: '1rem',
                                  boxShadow: isCurrent ? 'var(--shadow-md)' : 'none'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 700 }}>Month {monthNum}</span>
                                  <span className={`badge ${statusClass}`} style={{ fontSize: '0.75rem' }}>
                                    {statusText} {isCurrent && '(Current)'}
                                  </span>
                                </div>

                                <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>
                                  <p>Due Amount: <strong>₹{chit.monthlyContribution.toLocaleString()}</strong></p>
                                  <p style={{ marginTop: '0.15rem' }}>Due Date: <strong style={{ color: payment?.status === 'approved' ? 'inherit' : '#dc2626' }}>{formattedDueDate}</strong></p>
                                  {payment && (
                                    <>
                                      <p style={{ marginTop: '0.25rem' }}>Tx ID: <code style={{ fontSize: '0.8rem', background: 'var(--bg-main)', padding: '2px 4px', borderRadius: '4px' }}>{payment.transactionId}</code></p>
                                      {payment.remarks && <p style={{ color: 'var(--color-danger)', marginTop: '0.25rem' }}>Reason: {payment.remarks}</p>}
                                    </>
                                  )}
                                </div>

                                {canPay && (
                                  <button
                                    onClick={() => openPaymentModal(chit, monthNum)}
                                    className="btn-primary"
                                    style={{
                                      width: '100%',
                                      padding: '0.5rem',
                                      fontSize: '0.85rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    <Upload size={14} />
                                    <span>{payment?.status === 'rejected' ? 'Resubmit Proof' : 'Pay Contribution'}</span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollAnimationWrapper>
            );
          })}
        </div>
      )}

      {/* Payment Submit Modal */}
      {showPayModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '1rem'
        }}>
          <div className="glass-panel card-premium" style={{ width: '100%', maxWidth: '480px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setShowPayModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--color-secondary)' }}
            >
              <X size={22} />
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={22} color="var(--accent-yellow-dark)" />
              <span>Submit Payment Proof</span>
            </h3>
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Chit: <strong>{modalChit?.name}</strong> | Installment: <strong>Month {modalMonth}</strong>
            </p>

            {submitError && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                color: '#b91c1c',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit}>
              <div style={{
                backgroundColor: 'var(--accent-yellow-light)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--accent-yellow)',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}>Amount Due</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>₹{modalChit?.monthlyContribution.toLocaleString()}</span>
              </div>

              <div className="input-group">
                <label htmlFor="txnId">Transaction ID / Reference Number</label>
                <input
                  id="txnId"
                  type="text"
                  required
                  placeholder="Enter UPI/Bank transaction reference"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label>Upload Receipt Image</label>
                <label className="input-field" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  borderStyle: 'dashed',
                  cursor: 'pointer',
                  textAlign: 'center',
                  height: '110px'
                }}>
                  <Upload size={22} color="var(--color-secondary)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>
                    {proofFileName ? proofFileName : 'Click to upload screenshot'}
                  </span>
                  <input 
                    type="file" 
                    required 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}
              >
                {submitting ? 'Submitting Details...' : 'Submit Receipt Proof'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyActiveChits;
