import React, { useState, useEffect } from 'react';
import { UserPlus, RefreshCw, Search, UploadCloud } from 'lucide-react';
import { customerServiceApi } from '../api';
import CustomerUpload from './CustomerUpload';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerServiceApi.get('');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerServiceApi.delete(`/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer');
    }
  };

  const [processing, setProcessing] = useState(false);

  const handleKycStatusUpdate = async (id, status) => {
    setProcessing(true);
    try {
      // Switched to POST for better compatibility
      const response = await customerServiceApi.post(`/${id}/kyc?status=${status}`);
      // Update the selected customer locally so the modal displays the new status immediately
      setSelectedCustomer(response.data);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating KYC status:', error);
      alert('Failed to update KYC status: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="customer-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1>Customer Directory</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }} onClick={fetchCustomers}>
            <RefreshCw size={18} />
            Refresh
          </button>
          <button className="btn-primary" onClick={() => setIsUploadOpen(true)}>
            <UploadCloud size={18} />
            Import CSV
          </button>
          <button className="btn-primary">
            <UserPlus size={18} />
            Add Customer
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              className="input-field" 
              style={{ paddingLeft: '44px', marginBottom: 0 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact Information</th>
                <th>Created At</th>
                <th>KYC Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading records...</td></tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <tr key={customer.customerId}>
                    <td style={{ color: 'var(--text-secondary)' }}>#{customer.customerId}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{customer.name}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.9rem' }}>{customer.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{customer.phone}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {formatDate(customer.createdAt)}
                    </td>
                    <td>
                      <span className={`status-badge status-${customer.kycStatus?.toLowerCase() || 'pending'}`}>
                        {customer.kycStatus || 'PENDING'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          onClick={() => setSelectedCustomer(customer)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.customerId)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 500 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomerUpload 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onUploadSuccess={fetchCustomers}
      />

      {/* View Detail Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{ width: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2>Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <RefreshCw size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>NAME</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{selectedCustomer.name}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>EMAIL</label>
                <div>{selectedCustomer.email}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>PHONE</label>
                <div>{selectedCustomer.phone}</div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>KYC STATUS</label>
                <div style={{ marginTop: '4px' }}>
                  <span className={`status-badge status-${selectedCustomer.kycStatus?.toLowerCase() || 'pending'}`}>
                    {selectedCustomer.kycStatus || 'PENDING'}
                  </span>
                </div>
              </div>
              <div>
                <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>CREATED AT</label>
                <div>{formatDate(selectedCustomer.createdAt)}</div>
              </div>
            </div>

            {selectedCustomer.kycStatus !== 'VERIFIED' && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button 
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleKycStatusUpdate(selectedCustomer.customerId, 'VERIFIED')}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : (selectedCustomer.kycStatus === 'REJECTED' ? 'Re-Approve KYC' : 'Verify KYC')}
                </button>
                {selectedCustomer.kycStatus === 'PENDING' && (
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, justifyContent: 'center', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                    onClick={() => handleKycStatusUpdate(selectedCustomer.customerId, 'REJECTED')}
                    disabled={processing}
                  >
                    {processing ? '...' : 'Reject'}
                  </button>
                )}
              </div>
            )}
            
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: selectedCustomer.kycStatus === 'PENDING' ? '12px' : '32px', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }}
              onClick={() => setSelectedCustomer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
