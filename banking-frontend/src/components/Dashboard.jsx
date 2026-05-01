import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Clock, Check, X, ArrowRight } from 'lucide-react';
import { customerServiceApi } from '../api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0
  });
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customerServiceApi.get('');
      const data = response.data;
      setStats({
        total: data.length,
        verified: data.filter(c => c.kycStatus === 'VERIFIED').length,
        pending: data.filter(c => c.kycStatus === 'PENDING').length
      });
      setPendingCustomers(data.filter(c => c.kycStatus === 'PENDING' || c.kycStatus === 'REJECTED').slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [processingId, setProcessingId] = useState(null);

  const handleVerify = async (id) => {
    setProcessingId(id);
    try {
      // Switched to POST for better compatibility
      await customerServiceApi.post(`/${id}/kyc?status=VERIFIED`);
      // Update local state immediately for instant feedback
      fetchData();
    } catch (error) {
      console.error('KYC verification failed:', error);
      alert('Verification failed. Check console for details.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="dashboard-view">
      <h1 style={{ marginBottom: '32px' }}>Banking Overview</h1>
      
      <div className="grid-cards">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Total Customers</h3>
            <Users size={24} color="var(--accent-primary)" />
          </div>
          <div className="value">{stats.total}</div>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Verified KYC</h3>
            <ShieldCheck size={24} color="var(--success)" />
          </div>
          <div className="value">{stats.verified}</div>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>Pending Reviews</h3>
            <Clock size={24} color="var(--warning)" />
          </div>
          <div className="value">{stats.pending}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Pending KYC Actions</h2>
            <Link to="/customers" style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table style={{ border: 'none' }}>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingCustomers.length > 0 ? (
                  pendingCustomers.map(customer => (
                    <tr key={customer.customerId}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{customer.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{customer.email}</div>
                      </td>
                      <td>
                        <span className={`status-badge status-${customer.kycStatus?.toLowerCase()}`} style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                          {customer.kycStatus}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleVerify(customer.customerId)}
                          disabled={processingId === customer.customerId}
                          style={{ 
                            background: processingId === customer.customerId ? 'var(--text-secondary)' : 'var(--success)', 
                            border: 'none', 
                            color: 'white', 
                            padding: '6px 12px', 
                            borderRadius: '6px',
                            cursor: processingId === customer.customerId ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem'
                          }}
                        >
                          <Check size={14} /> {processingId === customer.customerId ? '...' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      No pending KYC requests.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel">
          <h2 style={{ marginBottom: '24px' }}>System Health</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }}></div>
                Customer Service
              </div>
              <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                Account Service
              </div>
              <span style={{ fontSize: '0.9rem' }}>Offline</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                Transaction Service
              </div>
              <span style={{ fontSize: '0.9rem' }}>Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
