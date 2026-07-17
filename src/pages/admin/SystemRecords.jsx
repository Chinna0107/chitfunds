import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ScrollAnimationWrapper from '../../components/ScrollAnimationWrapper';
import { 
  Users, 
  Briefcase, 
  Search, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CreditCard,
  Calendar,
  CheckCircle,
  Hourglass,
  AlertCircle
} from 'lucide-react';

const SystemRecords = () => {
  const { token, API_URL } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'chits'
  
  // Data State
  const [usersRecords, setUsersRecords] = useState([]);
  const [chitsRecords, setChitsRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Search Filters
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded Accordion State
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [expandedChitId, setExpandedChitId] = useState(null);

  // Lightbox Preview State
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Upload Modal State
  const [uploadModal, setUploadModal] = useState({ isOpen: false, chitId: null, userId: null, amount: null, monthNumber: null });
  const [uploadData, setUploadData] = useState({ file: null, text: '' });
  const [uploadLoading, setUploadLoading] = useState(false);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 800;
          let { width, height } = img;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(blob => {
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.file) return alert('Please select an image file');
    setUploadLoading(true);

    try {
      const compressedFile = await compressImage(uploadData.file);

      const formData = new FormData();
      formData.append('userId', uploadModal.userId);
      formData.append('amount', uploadModal.amount);
      formData.append('monthNumber', uploadModal.monthNumber);
      if (uploadData.text) formData.append('transactionId', uploadData.text);
      formData.append('proof', compressedFile);

      const response = await fetch(`${API_URL}/admin/chits/${uploadModal.chitId}/mark-paid`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Payment marked with proof successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        setUploadModal({ isOpen: false, chitId: null, userId: null, amount: null, monthNumber: null });
        setUploadData({ file: null, text: '' });
        fetchRecords(false);
      } else {
        alert(data.message || 'Failed to mark payment');
      }
    } catch (error) {
      console.error('Error marking with proof:', error);
      alert('Connection error');
    } finally {
      setUploadLoading(false);
    }
  };

  const fetchRecords = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // Fetch users database with history
      const usersRes = await fetch(`${API_URL}/admin/users-records`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersRes.json();

      // Fetch chits database with history
      const chitsRes = await fetch(`${API_URL}/admin/chits-records`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const chitsData = await chitsRes.json();

      if (usersData.success && chitsData.success) {
        setUsersRecords(usersData.data);
        setChitsRecords(chitsData.data);
      }
    } catch (error) {
      console.error('Error fetching records database:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [token, API_URL]);

  const handleUserToggle = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  const handleChitToggle = (id) => {
    setExpandedChitId(expandedChitId === id ? null : id);
  };

  const handleMarkAsPaid = async (chitId, userId, amount, monthNumber) => {
    try {
      const response = await fetch(`${API_URL}/admin/chits/${chitId}/mark-paid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, amount, monthNumber })
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Payment marked successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchRecords(false); // Silent refresh in background to avoid loading spinner
      } else {
        setSuccessMessage(data.message || 'Failed to mark payment');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
      setSuccessMessage('Connection error while marking payment');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const getFullImgUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${path}`;
  };

  // Filters
  const filteredUsers = usersRecords.filter(record => 
    record.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.user.phone.includes(searchQuery)
  );

  const filteredChits = chitsRecords.filter(record => 
    record.chit.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading system logs database...</div>;
  }

  return (
    <div style={{ padding: '1rem', width: '100%' }}>
      <ScrollAnimationWrapper>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            System <span style={{ color: 'var(--accent-yellow-dark)' }}>Ledger Records</span>
          </h1>
          <p style={{ color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
            Comprehensive records repository to track verified members, active savings chits, and cash collections logs.
          </p>
        </div>
      </ScrollAnimationWrapper>

      {/* Tabs Selector & Search */}
      <ScrollAnimationWrapper>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Tabs */}
          <div className="glass-panel" style={{ display: 'flex', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                backgroundColor: activeTab === 'users' ? 'var(--accent-yellow)' : 'transparent',
                color: 'var(--color-primary)',
                transition: 'var(--transition-fast)'
              }}
            >
              <Users size={18} />
              <span>Users Database</span>
            </button>
            <button
              onClick={() => { setActiveTab('chits'); setSearchQuery(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                backgroundColor: activeTab === 'chits' ? 'var(--accent-yellow)' : 'transparent',
                color: 'var(--color-primary)',
                transition: 'var(--transition-fast)'
              }}
            >
              <Briefcase size={18} />
              <span>Chit Pools</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-secondary)'
            }} />
            <input
              type="text"
              placeholder={activeTab === 'users' ? 'Search users by name, email...' : 'Search chits by name...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>
      </ScrollAnimationWrapper>

      {successMessage && (
        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: '#e8f5e9', border: '1px solid var(--color-success)', color: '#166534', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
          {successMessage}
        </div>
      )}

      {/* Main content lists */}
      {activeTab === 'users' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredUsers.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--color-secondary)' }}>No user records match your search filter.</p>
            </div>
          ) : (
            filteredUsers.map((record) => {
              const isExpanded = expandedUserId === record.user.id;
              
              return (
                <ScrollAnimationWrapper key={record.user.id}>
                  <div className="glass-panel card-premium" style={{ border: '1px solid rgba(255, 255, 255, 0.6)' }}>
                    {/* Header Row */}
                    <div 
                      onClick={() => handleUserToggle(record.user.id)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{record.user.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>
                          Email: {record.user.email} | Phone: {record.user.phone}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>
                          Joined Chits: {record.chits.length}
                        </span>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                          {/* Profile & KYC Images */}
                          <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <FileText size={16} />
                              <span>Documents Preview</span>
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>Aadhar Card</p>
                                <div 
                                  onClick={() => setLightboxUrl(getFullImgUrl(record.user.aadharImgUrl))}
                                  style={{
                                    height: '80px',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    background: `url(${getFullImgUrl(record.user.aadharImgUrl)}) center/cover no-repeat`,
                                    cursor: 'zoom-in'
                                  }}
                                />
                              </div>
                              <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>PAN Card</p>
                                <div 
                                  onClick={() => setLightboxUrl(getFullImgUrl(record.user.panImgUrl))}
                                  style={{
                                    height: '80px',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-md)',
                                    background: `url(${getFullImgUrl(record.user.panImgUrl)}) center/cover no-repeat`,
                                    cursor: 'zoom-in'
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Joined Chits summary */}
                          <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Briefcase size={16} />
                              <span>Enrolled Chits</span>
                            </h4>
                            {record.chits.length === 0 ? (
                              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>Not joined in any chits.</p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {record.chits.map(chit => (
                                  <div key={chit.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                                    <span style={{ fontWeight: 600 }}>{chit.name}</span>
                                    <span style={{ color: 'var(--color-secondary)' }}>EMI: ₹{chit.monthlyContribution.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Payments history ledger */}
                        <div>
                          <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CreditCard size={16} />
                            <span>Installments Ledger</span>
                          </h4>
                          {record.payments.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>No payments logged.</p>
                          ) : (
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--color-secondary)' }}>
                                    <th style={{ padding: '0.5rem' }}>Chit</th>
                                    <th style={{ padding: '0.5rem' }}>Month</th>
                                    <th style={{ padding: '0.5rem' }}>Amount</th>
                                    <th style={{ padding: '0.5rem' }}>Transaction ID</th>
                                    <th style={{ padding: '0.5rem' }}>Receipt</th>
                                    <th style={{ padding: '0.5rem' }}>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {record.payments.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>{p.chit?.name || 'Deleted Chit'}</td>
                                      <td style={{ padding: '0.5rem' }}>Month {p.monthNumber}</td>
                                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>₹{p.amount.toLocaleString()}</td>
                                      <td style={{ padding: '0.5rem' }}><code>{p.transactionId}</code></td>
                                      <td style={{ padding: '0.5rem' }}>
                                        <button 
                                          onClick={() => setLightboxUrl(getFullImgUrl(p.proofImgUrl))}
                                          className="btn-secondary" 
                                          style={{ padding: '2px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}
                                        >
                                          <Eye size={10} />
                                          <span>View</span>
                                        </button>
                                      </td>
                                      <td style={{ padding: '0.5rem' }}>
                                        <span className={`badge ${p.status === 'approved' ? 'badge-approved' : p.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
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
                      </div>
                    )}
                  </div>
                </ScrollAnimationWrapper>
              );
            })
          )}
        </div>
      ) : (
        /* Chits Database tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredChits.length === 0 ? (
            <div className="card-premium" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--color-secondary)' }}>No chit records match your search filter.</p>
            </div>
          ) : (
            filteredChits.map((record) => {
              const isExpanded = expandedChitId === record.chit.id;
              const approvedCount = record.chit.members.filter(m => m.status === 'approved').length;
              
              return (
                <ScrollAnimationWrapper key={record.chit.id}>
                  <div className="glass-panel card-premium" style={{ border: '1px solid rgba(255, 255, 255, 0.6)' }}>
                    {/* Header Row */}
                    <div 
                      onClick={() => handleChitToggle(record.chit.id)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{record.chit.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>
                          Pool Pool: ₹{record.chit.chitValue.toLocaleString()} | EMI: ₹{record.chit.monthlyContribution.toLocaleString()} | Duration: {record.chit.durationMonths} Months
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {record.chit.status === 'active' ? (
                          <span className="badge badge-active">Active (Month {record.chit.currentMonth}/{record.chit.durationMonths})</span>
                        ) : record.chit.status === 'completed' ? (
                          <span className="badge badge-approved">Completed</span>
                        ) : (
                          <span className="badge badge-pending">Upcoming ({approvedCount}/{record.chit.totalMembers} Enrolled)</span>
                        )}
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                          {/* Core specifications */}
                          <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Calendar size={16} />
                              <span>Pool Specifications</span>
                            </h4>
                            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <p>Chit Status: <strong style={{ textTransform: 'capitalize' }}>{record.chit.status}</strong></p>
                              {record.chit.startDate && <p>Start Date: <strong>{new Date(record.chit.startDate).toLocaleDateString()}</strong></p>}
                              {record.chit.endDate && <p>End Date: <strong>{new Date(record.chit.endDate).toLocaleDateString()}</strong></p>}
                              <p>Configured Members Required: <strong>{record.chit.totalMembers}</strong></p>
                              <p>Approved Enrolments Count: <strong>{approvedCount}</strong></p>
                            </div>
                          </div>

                          {/* Member List */}
                          <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Users size={16} />
                              <span>Approved Enrolled Members ({approvedCount})</span>
                            </h4>
                            {approvedCount === 0 ? (
                              <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>No approved members yet.</p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                {record.chit.members.filter(m => m.status === 'approved').map(member => (
                                  <div key={member.user?.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                                    <span style={{ fontWeight: 600 }}>{member.user?.name || 'Deleted Account'}</span>
                                    <span style={{ color: 'var(--color-secondary)' }}>{member.user?.phone}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {record.chit.status === 'active' && (
                          <div style={{ gridColumn: '1 / -1', marginBottom: '1.5rem' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle size={16} />
                              <span>Month {record.chit.currentMonth} Payment Status</span>
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                              {record.chit.members.filter(m => m.status === 'approved').map(member => {
                                const hasPaidCurrentMonth = record.payments.some(p => 
                                  p.userId === member.userId && 
                                  p.monthNumber === record.chit.currentMonth && 
                                  p.status === 'approved'
                                );
                                return (
                                  <div key={member.user?.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                                    <div>
                                      <span style={{ fontWeight: 600, display: 'block' }}>{member.user?.name}</span>
                                      <span style={{ color: 'var(--color-secondary)', fontSize: '0.75rem' }}>{member.user?.phone}</span>
                                    </div>
                                    {hasPaidCurrentMonth ? (
                                      <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>Paid</span>
                                    ) : (
                                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                        <button
                                          onClick={() => handleMarkAsPaid(record.chit.id, member.userId, record.chit.monthlyContribution, record.chit.currentMonth)}
                                          className="btn-primary"
                                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', borderRadius: 'var(--radius-sm)' }}
                                        >
                                          Mark as Paid
                                        </button>
                                        <button
                                          onClick={() => setUploadModal({
                                            isOpen: true,
                                            chitId: record.chit.id,
                                            userId: member.userId,
                                            amount: record.chit.monthlyContribution,
                                            monthNumber: record.chit.currentMonth
                                          })}
                                          className="btn-secondary"
                                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-primary)' }}
                                        >
                                          Upload Proof
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Payment log database for this chit */}
                        <div>
                          <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CreditCard size={16} />
                            <span>Chit Contributions Ledger</span>
                          </h4>
                          {record.payments.length === 0 ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>No contributions verified for this chit pool.</p>
                          ) : (
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--color-secondary)' }}>
                                    <th style={{ padding: '0.5rem' }}>Member Name</th>
                                    <th style={{ padding: '0.5rem' }}>Month</th>
                                    <th style={{ padding: '0.5rem' }}>Amount</th>
                                    <th style={{ padding: '0.5rem' }}>Transaction ID</th>
                                    <th style={{ padding: '0.5rem' }}>Receipt Photo</th>
                                    <th style={{ padding: '0.5rem' }}>Verification</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {record.payments.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>{p.user?.name || 'Deleted Account'}</td>
                                      <td style={{ padding: '0.5rem' }}>Month {p.monthNumber}</td>
                                      <td style={{ padding: '0.5rem', fontWeight: 600 }}>₹{p.amount.toLocaleString()}</td>
                                      <td style={{ padding: '0.5rem' }}><code>{p.transactionId}</code></td>
                                      <td style={{ padding: '0.5rem' }}>
                                        <button 
                                          onClick={() => setLightboxUrl(getFullImgUrl(p.proofImgUrl))}
                                          className="btn-secondary" 
                                          style={{ padding: '2px 6px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}
                                        >
                                          <Eye size={10} />
                                          <span>View</span>
                                        </button>
                                      </td>
                                      <td style={{ padding: '0.5rem' }}>
                                        <span className={`badge ${p.status === 'approved' ? 'badge-approved' : p.status === 'pending' ? 'badge-pending' : 'badge-rejected'}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
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
                      </div>
                    )}
                  </div>
                </ScrollAnimationWrapper>
              );
            })
          )}
        </div>
      )}

      {/* Image Preview Lightbox */}
      {lightboxUrl && (
        <div 
          onClick={() => setLightboxUrl(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
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
            alt="Ledger Document Preview" 
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)' }}
          />
        </div>
      )}

      {/* Upload Proof Modal */}
      {uploadModal.isOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card-premium" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Upload Proof & Mark Paid</h3>
            <form onSubmit={handleUploadSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Transaction ID / Notes</label>
                <input
                  type="text"
                  placeholder="Enter notes or Txn ID"
                  className="input-field"
                  value={uploadData.text}
                  onChange={e => setUploadData({ ...uploadData, text: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Payment Proof Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setUploadData({ ...uploadData, file: e.target.files[0] })}
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setUploadModal({ isOpen: false, chitId: null, userId: null, amount: null, monthNumber: null }); setUploadData({ file: null, text: '' }); }}
                  className="btn-secondary"
                  disabled={uploadLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={uploadLoading || !uploadData.file}>
                  {uploadLoading ? 'Uploading...' : 'Submit & Mark Paid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemRecords;
