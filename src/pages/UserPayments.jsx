import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ScrollAnimationWrapper from '../components/ScrollAnimationWrapper';
import { CreditCard, CheckCircle, Hourglass, AlertCircle, FileSpreadsheet } from 'lucide-react';

const UserPayments = () => {
  const { token, API_URL } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${API_URL}/payments/my-payments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setPayments(data.data);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token, API_URL]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payment history...</div>;
  }

  const getFullImgUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    return `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${path}`;
  };

  return (
    <div style={{ padding: '1rem', width: '100%' }}>
      <ScrollAnimationWrapper>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
            Payment <span style={{ color: 'var(--accent-yellow-dark)' }}>History</span>
          </h1>
          <p style={{ color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
            A ledger of all monthly installments submitted by you on Chit Fund.
          </p>
        </div>
      </ScrollAnimationWrapper>

      {payments.length === 0 ? (
        <div className="card-premium" style={{ textAlign: 'center', padding: '3rem' }}>
          <CreditCard size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--color-secondary)' }} />
          <h3 style={{ fontWeight: 700 }}>No Payments Logged</h3>
          <p style={{ color: 'var(--color-secondary)', marginTop: '0.25rem' }}>You have not submitted any monthly payment proofs yet.</p>
        </div>
      ) : (
        <ScrollAnimationWrapper>
          <div className="glass-panel card-premium" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
                  <th style={{ padding: '1rem', fontWeight: 700 }}>Chit Name</th>
                  <th style={{ padding: '1rem', fontWeight: 700 }}>Month</th>
                  <th style={{ padding: '1rem', fontWeight: 700 }}>Amount</th>
                  <th style={{ padding: '1rem', fontWeight: 700 }}>Transaction ID</th>
                  <th style={{ padding: '1rem', fontWeight: 700 }}>Receipt Link</th>
                  <th style={{ padding: '1rem', fontWeight: 700 }}>Submitted On</th>
                  <th style={{ padding: '1rem', fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'var(--transition-fast)' }} className="table-row-hover">
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{payment.chit?.name || 'Deleted Chit'}</td>
                    <td style={{ padding: '1rem' }}>Month {payment.monthNumber}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>₹{payment.amount.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <code style={{ background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>{payment.transactionId}</code>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <a href={getFullImgUrl(payment.proofImgUrl)} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-info)', textDecoration: 'underline', fontSize: '0.85rem' }}>
                        View Receipt
                      </a>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--color-secondary)' }}>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {payment.status === 'approved' ? (
                        <span className="badge badge-approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle size={12} />
                          <span>Approved</span>
                        </span>
                      ) : payment.status === 'pending' ? (
                        <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Hourglass size={12} />
                          <span>Verifying</span>
                        </span>
                      ) : (
                        <span className="badge badge-rejected" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <AlertCircle size={12} />
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollAnimationWrapper>
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default UserPayments;
