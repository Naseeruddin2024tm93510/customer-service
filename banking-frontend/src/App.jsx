import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Activity, Bell } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CustomerList from './components/CustomerList';

function Navigation() {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <div className="logo">
        <Activity size={32} color="var(--accent-primary)" />
        Banking OS
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/customers" className={`nav-link ${location.pathname === '/customers' ? 'active' : ''}`}>
          <Users size={20} />
          Customers
        </Link>
        {/* Placeholders for future microservices */}
        <div className="nav-link" style={{opacity: 0.5, cursor: 'not-allowed'}}>
          <CreditCard size={20} />
          Accounts
        </div>
        <div className="nav-link" style={{opacity: 0.5, cursor: 'not-allowed'}}>
          <Activity size={20} />
          Transactions
        </div>
        <div className="nav-link" style={{opacity: 0.5, cursor: 'not-allowed'}}>
          <Bell size={20} />
          Notifications
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
