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
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="50" r="28" fill="#d13438" opacity="0.9" />
            <circle cx="65" cy="50" r="28" fill="#f7630c" />
          </svg>
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
