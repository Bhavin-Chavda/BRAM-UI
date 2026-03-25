import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import InvestigationForm from './pages/InvestigationForm';
import Reports from './pages/Reports';
import { ToastProvider } from './context/ToastContext';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <div className="navbar-logo-mastercard">
  <img
    src="https://stage.asset.connect.mastercard.com/website-assets/-/global-connect/mastercard/0.2.23/icons/logoVertical.svg"
    alt="Mastercard Logo"
    style={{ height: '50px', width: 'auto', marginTop: '10px', marginLeft: '-20px' }}
  />
</div>
        <div className="navbar-brand-text">
          <span className="navbar-title">
            BRAM
          </span>
          <span className="navbar-subtitle">
            Business Risk Assessment and Mitigation
          </span>
        </div>
      </div>

      <div className="navbar-nav">
        <button
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="dot" />
          Overview
        </button>
        <button
          className={`nav-link ${isActive('/investigate') ? 'active' : ''}`}
          onClick={() => navigate('/investigate')}
        >
          <span className="dot" />
          Investigate
        </button>
        <button
          className={`nav-link ${isActive('/reports') ? 'active' : ''}`}
          onClick={() => navigate('/reports')}
        >
          <span className="dot" />
          Reports
        </button>
      </div>
    </nav>
  );
}

function AppShell() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/investigate" element={<InvestigationForm />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </BrowserRouter>
  );
}
