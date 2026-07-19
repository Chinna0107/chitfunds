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
  CreditCard,
  Edit3
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
    // Pre-fill transaction ID if user is editing an existing submission (edit_requested or pending+remark)
    const existingPayment = payments.find(p => p.chitId === chit.id && p.monthNumber === month);
    const isEditMode =
      existingPayment?.status === 'edit_requested' ||
      (existingPayment?.status === 'pending' && existingPayment?.remarks && existingPayment.remarks.trim() !== '');
    setTransactionId(isEditMode ? (existingPayment.transactionId || '') : '');
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
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#16a34a', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading your chits...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <ScrollAnimationWrapper>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1f2937', lineHeight: 1.2 }}>
            My Active <span style={{ color: '#16a34a' }}>Chits</span>
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.3rem', fontSize: '0.85rem' }}>
            Track your payment schedule, check dues, and submit monthly installment receipts.
          </p>
        </div>
      </ScrollAnimationWrapper>

      {chits.length === 0 ? (
        <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px dashed #d1fae5', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Briefcase size={28} color="#22c55e" />
          </div>
          <h3 style={{ fontWeight: 700, color: '#374151', fontSize: '1.1rem' }}>No Joined Schemes</h3>
          <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.85rem', maxWidth: '260px', margin: '0.5rem auto 0 auto', lineHeight: 1.5 }}>
            You haven't been approved in any chit schemes yet. Join schemes in the Browse section.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {chits.map((chit) => {
            const isExpanded = expandedChitId === chit.id;
            
            return (
              <ScrollAnimationWrapper key={chit.id}>
                <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                  
                  {/* Green Top Bar */}
                  <div style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)', padding: '1.25rem 1.25rem 0 1.25rem', position: 'relative', overflow: 'hidden' }}>
                    
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', right: '60px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

                    {/* Name + Status row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Briefcase size={20} color="#fff" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{chit.name}</h3>
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, letterSpacing: '0.03em' }}>
                            ID: CHIT{chit.id.slice(-4).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        {chit.status === 'active' ? (
                          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.68rem', padding: '0.25rem 0.65rem', borderRadius: '1rem', fontWeight: 700, whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
                            Active (Month {chit.currentMonth}/{chit.durationMonths})
                          </span>
                        ) : chit.status === 'completed' ? (
                          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.68rem', padding: '0.25rem 0.65rem', borderRadius: '1rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)' }}>✓ Completed</span>
                        ) : (
                          <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.68rem', padding: '0.25rem 0.65rem', borderRadius: '1rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.3)' }}>⏳ Upcoming</span>
                        )}
                      </div>
                    </div>

                    {/* Stats strip — always 4 cols side by side using flex */}
                    <div style={{ 
                      display: 'flex', flexDirection: 'row', flexWrap: 'nowrap',
                      backgroundColor: 'rgba(0,0,0,0.15)',
                      borderRadius: '0.75rem 0.75rem 0 0',
                      marginTop: '1rem',
                      overflow: 'hidden'
                    }}>
                      {[
                        { label: 'POOL', value: `₹${(chit.chitValue / 1000).toFixed(0)}K` },
                        { label: 'EMI', value: `₹${(chit.monthlyContribution / 1000).toFixed(0)}K` },
                        { label: 'DURATION', value: `${chit.durationMonths}M` },
                        { label: 'MANAGER', value: chit.creator ? chit.creator.name.split(' ')[0] : 'Admin' },
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          width: '25%', flexShrink: 0, flexGrow: 0,
                          padding: '0.7rem 0.2rem',
                          textAlign: 'center',
                          borderLeft: idx > 0 ? '1px solid rgba(255,255,255,0.15)' : 'none'
                        }}>
                          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '0.2rem', fontWeight: 700, letterSpacing: '0.06em' }}>{item.label}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 0.15rem' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                  </div>


                  {/* Body: Toggle Button */}
                  <div
                    onClick={() => toggleExpandChit(chit.id)}
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      padding: '0.85rem 1.25rem', cursor: 'pointer', 
                      backgroundColor: '#fff', userSelect: 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DollarSign size={13} color="#16a34a" />
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1f2937' }}>Installment Schedule</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>{isExpanded ? 'Hide' : 'View'}</span>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isExpanded ? <ChevronUp size={13} color="#16a34a" /> : <ChevronDown size={13} color="#16a34a" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Installments */}
                  {isExpanded && (
                    <div style={{ padding: '1rem 1.25rem 1.25rem', borderTop: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
                      {chit.status === 'upcoming' ? (
                        <div style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px dashed #d1fae5', fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6 }}>
                          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                          <strong style={{ color: '#374151', display: 'block', marginBottom: '0.3rem' }}>Not Started Yet</strong>
                          This chit fund begins once {chit.totalMembers} members are approved by the admin.
                        </div>
                      ) : (() => {
                        const totalPaid = Array.from({ length: chit.durationMonths }, (_, i) => i + 1)
                          .filter(m => payments.find(p => p.chitId === chit.id && p.monthNumber === m && p.status === 'approved'))
                          .length;
                        const progressPct = Math.round((totalPaid / chit.durationMonths) * 100);
                        return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {/* Progress Bar */}
                          <div style={{ backgroundColor: '#fff', borderRadius: '0.85rem', padding: '0.85rem 1rem', border: '1px solid #f3f4f6', marginBottom: '0.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#374151' }}>Payment Progress</span>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16a34a' }}>{totalPaid}/{chit.durationMonths} Paid</span>
                            </div>
                            <div style={{ height: '7px', backgroundColor: '#f3f4f6', borderRadius: '1rem', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #16a34a, #22c55e)', borderRadius: '1rem', transition: 'width 0.5s ease' }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                              <span style={{ fontSize: '0.62rem', color: '#9ca3af' }}>0%</span>
                              <span style={{ fontSize: '0.62rem', color: '#9ca3af' }}>{progressPct}% complete</span>
                              <span style={{ fontSize: '0.62rem', color: '#9ca3af' }}>100%</span>
                            </div>
                          </div>
                          {Array.from({ length: chit.durationMonths }, (_, i) => i + 1).map((monthNum) => {
                            const chitStartDate = new Date(chit.startDate || chit.createdAt);
                            const dueDate = new Date(chitStartDate);
                            dueDate.setMonth(dueDate.getMonth() + monthNum - 1);
                            dueDate.setDate(5);
                            const formattedDueDate = dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                            const payment = getPaymentForMonth(chit.id, monthNum);
                            const isCurrent = chit.currentMonth === monthNum && chit.status === 'active';
                            
                            let statusText = 'Unpaid';
                            let statusBg = '#fef9c3';
                            let statusColor = '#92400e';
                            let canPay = chit.status === 'active' && monthNum <= chit.currentMonth;

                            if (payment) {
                              if (payment.status === 'approved') {
                                statusText = 'Paid'; statusBg = '#dcfce7'; statusColor = '#166534'; canPay = false;
                              } else if (payment.status === 'pending' && payment.remarks && payment.remarks.trim() !== '') {
                                statusText = 'Edit Required'; statusBg = '#fef3c7'; statusColor = '#92400e'; canPay = true;
                              } else if (payment.status === 'pending') {
                                statusText = 'Verifying'; statusBg = '#dbeafe'; statusColor = '#1e40af'; canPay = false;
                              } else if (payment.status === 'rejected') {
                                statusText = 'Rejected'; statusBg = '#fee2e2'; statusColor = '#991b1b'; canPay = true;
                              } else if (payment.status === 'edit_requested') {
                                statusText = 'Edit Required'; statusBg = '#fef3c7'; statusColor = '#92400e'; canPay = true;
                              }
                            }

                            return (
                              <div
                                key={monthNum}
                                style={{
                                  borderRadius: '0.9rem',
                                  border: isCurrent ? '1.5px solid #22c55e' : '1px solid #e5e7eb',
                                  backgroundColor: isCurrent ? '#f0fdf4' : '#fff',
                                  overflow: 'hidden',
                                  boxShadow: isCurrent ? '0 4px 16px rgba(34,197,94,0.12)' : '0 1px 4px rgba(0,0,0,0.04)'
                                }}
                              >
                                {/* Left accent + header row */}
                                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                  {/* Colored left bar */}
                                  <div style={{
                                    width: '4px', flexShrink: 0,
                                    backgroundColor: payment?.status === 'approved' ? '#22c55e'
                                      : payment?.status === 'pending' && !payment?.remarks ? '#3b82f6'
                                      : payment?.status === 'rejected' || payment?.status === 'edit_requested' || (payment?.status === 'pending' && payment?.remarks) ? '#f59e0b'
                                      : isCurrent ? '#16a34a' : '#e5e7eb'
                                  }} />

                                  <div style={{ flex: 1, padding: '0.7rem 0.85rem' }}>
                                    {/* Top row: Month + Status badge */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1f2937' }}>Month {monthNum}</span>
                                        {isCurrent && <span style={{ fontSize: '0.58rem', backgroundColor: '#16a34a', color: '#fff', padding: '0.1rem 0.45rem', borderRadius: '1rem', fontWeight: 700, letterSpacing: '0.02em' }}>CURRENT</span>}
                                      </div>
                                      <span style={{ fontSize: '0.68rem', fontWeight: 700, backgroundColor: statusBg, color: statusColor, padding: '0.18rem 0.55rem', borderRadius: '1rem', border: `1px solid ${statusColor}22` }}>
                                        {statusText}
                                      </span>
                                    </div>

                                    {/* Info row: Due Amount | Due Date | Tx ID */}
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                      <div>
                                        <span style={{ fontSize: '0.6rem', color: '#9ca3af', display: 'block', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Due</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: payment?.status === 'approved' ? '#16a34a' : '#ef4444' }}>₹{chit.monthlyContribution.toLocaleString()}</span>
                                      </div>
                                      <div>
                                        <span style={{ fontSize: '0.6rem', color: '#9ca3af', display: 'block', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>{formattedDueDate}</span>
                                      </div>
                                      {payment?.transactionId && (
                                        <div>
                                          <span style={{ fontSize: '0.6rem', color: '#9ca3af', display: 'block', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ref</span>
                                          <code style={{ fontSize: '0.7rem', backgroundColor: '#f3f4f6', padding: '0.1rem 0.35rem', borderRadius: '4px', color: '#374151', fontWeight: 600 }}>{payment.transactionId}</code>
                                        </div>
                                      )}
                                    </div>

                                    {/* Admin Remark */}
                                    {payment?.remarks && (payment.status === 'edit_requested' || (payment.status === 'pending' && payment.remarks.trim() !== '')) && (
                                      <div style={{ marginTop: '0.6rem', padding: '0.45rem 0.65rem', borderRadius: '0.5rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.72rem', lineHeight: 1.5 }}>
                                        ⚠ <strong>Admin Note:</strong> {payment.remarks}
                                      </div>
                                    )}
                                    {payment?.remarks && payment.status === 'rejected' && (
                                      <div style={{ marginTop: '0.6rem', padding: '0.45rem 0.65rem', borderRadius: '0.5rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.72rem', lineHeight: 1.5 }}>
                                        ✕ <strong>Reason:</strong> {payment.remarks}
                                      </div>
                                    )}

                                    {/* Pay Button */}
                                    {canPay && (
                                      <button
                                        onClick={() => openPaymentModal(chit, monthNum)}
                                        style={{
                                          marginTop: '0.65rem',
                                          width: '100%', padding: '0.55rem 0', borderRadius: '0.65rem',
                                          border: 'none', fontWeight: 700, fontSize: '0.8rem',
                                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                          background: (payment?.status === 'edit_requested' || (payment?.status === 'pending' && payment?.remarks))
                                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                            : 'linear-gradient(135deg, #16a34a, #22c55e)',
                                          color: '#fff',
                                          boxShadow: (payment?.status === 'edit_requested' || (payment?.status === 'pending' && payment?.remarks))
                                            ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                                            : '0 4px 12px rgba(22, 163, 74, 0.25)',
                                          letterSpacing: '0.01em'
                                        }}
                                      >
                                        {(payment?.status === 'edit_requested' || (payment?.status === 'pending' && payment?.remarks)) ? (
                                          <><Edit3 size={13} /><span>Edit & Resubmit</span></>
                                        ) : payment?.status === 'rejected' ? (
                                          <><Upload size={13} /><span>Resubmit Proof</span></>
                                        ) : (
                                          <><Upload size={13} /><span>Pay Contribution</span></>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );

                          })}
                        </div>
                        );
                      })()}
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
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 110, padding: '0'
        }}>
          <div style={{ width: '100%', maxWidth: '540px', backgroundColor: '#fff', borderRadius: '1.5rem 1.5rem 0 0', padding: '1.5rem', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            {/* Drag Handle */}
            <div style={{ width: '40px', height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', margin: '0 auto 1.25rem auto' }} />

            <button
              onClick={() => setShowPayModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} color="#374151" />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
                  {payments.find(p => p.chitId === modalChit?.id && p.monthNumber === modalMonth)?.status === 'edit_requested'
                    ? 'Edit & Resubmit Payment'
                    : 'Submit Payment Proof'}
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#6b7280', margin: 0 }}>
                  {modalChit?.name} · Month {modalMonth}
                </p>
              </div>
            </div>

            {submitError && (
              <div style={{ padding: '0.6rem 0.85rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem', color: '#991b1b', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <AlertCircle size={14} />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} style={{ marginTop: '1.25rem' }}>
              {/* Amount Due Banner */}
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.85rem', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 500 }}>Amount Due</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a' }}>₹{modalChit?.monthlyContribution.toLocaleString()}</span>
              </div>

              {/* Transaction ID */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Transaction ID / Reference Number</label>
                <input
                  id="txnId"
                  type="text"
                  required
                  placeholder="Enter UPI/Bank transaction reference"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e5e7eb', borderRadius: '0.75rem', fontSize: '0.85rem', color: '#1f2937', outline: 'none', backgroundColor: '#fafafa', boxSizing: 'border-box' }}
                />
              </div>

              {/* Upload */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Upload Receipt Image</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '1.25rem', border: '1.5px dashed #d1d5db', borderRadius: '0.85rem',
                  cursor: 'pointer', textAlign: 'center', backgroundColor: '#fafafa',
                  ...(proofFileName ? { borderColor: '#22c55e', backgroundColor: '#f0fdf4' } : {})
                }}>
                  <Upload size={20} color={proofFileName ? '#16a34a' : '#9ca3af'} />
                  <span style={{ fontSize: '0.78rem', color: proofFileName ? '#16a34a' : '#9ca3af', fontWeight: proofFileName ? 600 : 400 }}>
                    {proofFileName || 'Click to upload screenshot'}
                  </span>
                  <input type="file" required accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%', padding: '0.85rem', borderRadius: '0.85rem',
                  background: submitting ? '#d1d5db' : 'linear-gradient(135deg, #16a34a, #22c55e)',
                  border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                  cursor: submitting ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Receipt Proof'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MyActiveChits;
