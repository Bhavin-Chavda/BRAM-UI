import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

// Mock reports data - simulating API response
const MOCK_REPORTS = [
  {
    id: '1',
    url: 'https://github.com',
    merchant_uri: 'https://github.com',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    pdfPath: 'github_com.pdf',
  },
  {
    id: '2',
    url: 'https://indi-1xbet.com/en',
    merchant_uri: 'https://indi-1xbet.com/en',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    pdfPath: 'indi_1xbet_com.pdf',
  },
];

function StatusBadge({ status }) {
  const map = {
    IN_PROGRESS: { label: 'In Progress', cls: 'in-progress' },
    COMPLETED:   { label: 'Completed',   cls: 'completed'   },
    FAILED:      { label: 'Failed',      cls: 'failed'      },
    PENDING:     { label: 'Pending',     cls: 'pending'     },
  };
  const s = map[status] || { label: status, cls: 'pending' };

  return (
    <span className={`status-badge ${s.cls}`}>
      <span className="pulse" />
      {s.label}
    </span>
  );
}

function ReportItem({ report, index, onToast }) {
  const formattedDate = report.created_at
    ? new Date(report.created_at).toLocaleString()
    : report.timestamp
    ? new Date(report.timestamp).toLocaleString()
    : '—';

  const pdfFilename = report.pdfPath;
  const reportUrl = report.merchant_uri || report.url || report.MERCHANT_URI || 'Unknown URL';

  const handleOpenPdf = async () => {
    if (!pdfFilename) return;

    try {
      console.log('Loading PDF from static folder:', pdfFilename);
      const pdfPath = `/static/${pdfFilename}`;
      
      const response = await fetch(pdfPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load PDF: HTTP ${response.status}`);
      }

      const blob = await response.blob();
      console.log('PDF loaded successfully, size:', blob.size, 'bytes');
      
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Error loading PDF:', err);
      if (onToast) {
        onToast('error', 'PDF Load Failed', err.message);
      }
    }
  };

  return (
    <div className="report-item">
      <div className="report-item-header">
        <span className="report-item-index mono">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="report-item-url">
          {reportUrl}
        </span>
        <div className="report-item-meta">
          <span className="report-item-date">{formattedDate}</span>
          <StatusBadge status={report.status} />
        </div>
      </div>

      <div className="report-item-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          {report.status === 'COMPLETED' && pdfFilename ? (
            <>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                📄 Report Ready
              </span>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleOpenPdf}
                style={{ marginLeft: 'auto' }}
              >
                ↗ Review Report
              </button>
            </>
          ) : report.status === 'FAILED' && report.error ? (
            <div style={{
              fontSize: '0.78rem',
              color: 'var(--red)',
              marginLeft: 'auto',
            }}>
              {report.error}
            </div>
          ) : (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ⟳ Processing...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Reports() {
  const { addToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchReports = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      // Using mock data from static files instead of API
      console.log('Loading mock reports data');
      setReports(MOCK_REPORTS);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
      if (!silent) addToast('error', 'Failed to Load Reports', err.message);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchReports();

    // Auto-refresh every 15 seconds for live updates
    const interval = setInterval(() => fetchReports(true), 15000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  const filtered = reports.filter(r => {
    const url = (r.merchant_uri || r.url || r.MERCHANT_URI || '').toLowerCase();
    const matchSearch = !search || url.includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL: reports.length,
    IN_PROGRESS: reports.filter(r => r.status === 'IN_PROGRESS').length,
    COMPLETED:   reports.filter(r => r.status === 'COMPLETED').length,
    FAILED:      reports.filter(r => r.status === 'FAILED').length,
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Reports</h1>
        <p>
          View all submitted investigations. Completed reports include embedded
          PDF output and download options.
        </p>
      </div>

      <div className="reports-toolbar">
        <div className="search-input-wrap">
          <span className="search-input-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Filter by URL…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['ALL', 'IN_PROGRESS', 'COMPLETED', 'FAILED'].map(status => (
            <button
              key={status}
              className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterStatus(status)}
            >
              {status.replace('_', ' ')}
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                opacity: 0.7,
                marginLeft: '4px',
              }}>
                ({counts[status] ?? 0})
              </span>
            </button>
          ))}
        </div>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => fetchReports()}
          title="Refresh reports"
        >
          {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : '↻'}
          &nbsp;Refresh
        </button>
      </div>

      {lastRefresh && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
        }}>
          Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 15s
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <span className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        </div>
      )}

      {error && !loading && (
        <div className="card" style={{ borderColor: 'var(--border-accent)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--red)',
          }}>
            <span>⚠</span>
            <span>Could not fetch reports: {error}</span>
            <button className="btn btn-sm btn-outline" onClick={() => fetchReports()} style={{ marginLeft: 'auto' }}>
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No reports found</h3>
            <p>
              {search || filterStatus !== 'ALL'
                ? 'Try adjusting your search or filter.'
                : 'Submit your first investigation to get started.'}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="report-list">
          {filtered.map((report, i) => (
            <ReportItem
              key={report.id || report._id || i}
              report={report}
              index={i}
              onToast={addToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
