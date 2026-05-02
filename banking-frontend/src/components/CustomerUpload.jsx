import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import { customerServiceApi } from '../api';

const CustomerUpload = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await customerServiceApi.post('/upload', formData);
      setSuccess(true);
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
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
      <div className="glass-panel" style={{ width: '500px', position: 'relative' }}>
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '24px' }}>Import Customer Dataset</h2>

        {!success ? (
          <>
            <div 
              className="file-upload-zone"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input 
                id="fileInput"
                type="file" 
                accept=".csv" 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
              <Upload size={48} color="var(--accent-primary)" style={{ marginBottom: '16px' }} />
              {file ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <FileText size={20} />
                  <span>{file.name}</span>
                </div>
              ) : (
                <>
                  <p style={{ fontWeight: 500, marginBottom: '8px' }}>Click to select CSV file</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Dataset format: bank_customers.csv</p>
                </>
              )}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? 'Processing...' : 'Start Import'}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CheckCircle2 size={64} color="var(--success)" style={{ marginBottom: '16px' }} />
            <h3>Import Successful!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Customer records have been synchronized.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerUpload;
