import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const API_BASE = 'http://localhost:8000';

function FieldGroup({ label, required, hint, error, children }) {
  return (
    <div className="field-group">
      <label className="field-label">
        {label}
        {required && <span className="required-dot" title="Required" />}
      </label>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && (
        <span className="field-error">
          <span>⚠</span> {error}
        </span>
      )}
    </div>
  );
}

function FlagItem({ label, badge, checked, onChange }) {
  return (
    <label className={`flag-item ${checked ? 'checked' : ''}`}>
      <div className="flag-checkbox">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <div className="flag-checkbox-box">
          <span className="flag-checkbox-checkmark">✓</span>
        </div>
      </div>
      <span className="flag-label">{label}</span>
      <span className="flag-badge">{badge}</span>
    </label>
  );
}

export default function InvestigationForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flags, setFlags] = useState({
    ALLOW_SIGN_IN: false,
    ALLOW_TEST_PAYMENT: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      MERCHANT_URI: '',
      MAX_CRAWLING: '',
      PAGE_LIMIT: '',
      DEPTH_FROM_BASE_URL: '',
      RETRY_COUNTS: '',
      ALERT_ON_SUSPICIOUS_LINKS: false,
      MAX_WAIT_TIME: '',
      CONCURRENT_WORKERS: '',
      SCAN_TIMEOUT_SECONDS: '',
    },
  });

  const toggleFlag = (key) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const payload = {
      url: data.MERCHANT_URI.trim(),
      max_pages: parseInt(data.PAGE_LIMIT, 10),
      max_depth: parseInt(data.DEPTH_FROM_BASE_URL, 10),
      max_screenshots_per_page: 20,
    };

    try {
      console.log('Submitting crawl request with payload:', payload);
      
      const response = await fetch(`${API_BASE}/crawl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('✓ Success: Crawl request submitted successfully', {
          status: response.status,
          url: payload.url,
          maxPages: payload.max_pages,
          maxDepth: payload.max_depth,
        });
        addToast('success', 'Request Submitted', 'Your request submitted we will analyze the URL and generate report');
        reset();
        setFlags({ ALLOW_SIGN_IN: false, ALLOW_TEST_PAYMENT: false });
        setTimeout(() => navigate('/reports'), 1500);
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('✗ Error: Crawl request failed', {
          status: response.status,
          statusText: response.statusText,
          errorData: errData,
          url: payload.url,
        });
        addToast('error', 'Submission Failed', errData.message || `HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('✗ Network Error: Could not reach crawl service', {
        error: err.message,
        errorType: err.name,
        url: payload.url,
      });
      addToast('error', 'Network Error', err.message || 'Could not reach the crawl service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Configure Investigation</h1>
        <p>
          Submit a merchant URL with crawl parameters to initiate a deep
          investigative scan of the target gambling platform.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Target Configuration ── */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <span className="icon">🎯</span>
            Target Configuration
          </div>

          <div className="form-grid full" style={{ marginBottom: '1.25rem' }}>
            <FieldGroup
              label="Merchant URI"
              required
              hint="Full URL including protocol (e.g., https://example-casino.com)"
              error={errors.MERCHANT_URI?.message}
            >
              <input
                className={`field-input ${errors.MERCHANT_URI ? 'error' : ''}`}
                placeholder="https://target-merchant.com"
                {...register('MERCHANT_URI', {
                  required: 'Merchant URI is required',
                  pattern: {
                    value: /^https?:\/\/.+/i,
                    message: 'Must be a valid URL starting with http:// or https://',
                  },
                })}
              />
            </FieldGroup>
          </div>

          <div className="form-grid three">
            <FieldGroup
              label="Page Limit"
              required
              hint="Max pages to crawl"
              error={errors.PAGE_LIMIT?.message}
            >
              <input
                type="number"
                className={`field-input ${errors.PAGE_LIMIT ? 'error' : ''}`}
                placeholder="100"
                min="1"
                max="10000"
                {...register('PAGE_LIMIT', {
                  required: 'Page limit is required',
                  min: { value: 1, message: 'Must be at least 1' },
                  max: { value: 10000, message: 'Max 10,000 pages' },
                  validate: v => Number.isInteger(Number(v)) || 'Must be a whole number',
                })}
              />
            </FieldGroup>

            <FieldGroup
              label="Depth From Base URL"
              required
              hint="Link traversal depth"
              error={errors.DEPTH_FROM_BASE_URL?.message}
            >
              <input
                type="number"
                className={`field-input ${errors.DEPTH_FROM_BASE_URL ? 'error' : ''}`}
                placeholder="3"
                min="1"
                max="20"
                {...register('DEPTH_FROM_BASE_URL', {
                  required: 'Depth is required',
                  min: { value: 1, message: 'Must be at least 1' },
                  max: { value: 20, message: 'Max depth is 20' },
                  validate: v => Number.isInteger(Number(v)) || 'Must be a whole number',
                })}
              />
            </FieldGroup>

            <FieldGroup
              label="Retry Counts"
              required
              hint="Retries on failed requests"
              error={errors.RETRY_COUNTS?.message}
            >
              <input
                type="number"
                className={`field-input ${errors.RETRY_COUNTS ? 'error' : ''}`}
                placeholder="3"
                min="0"
                max="10"
                {...register('RETRY_COUNTS', {
                  required: 'Retry count is required',
                  min: { value: 0, message: 'Cannot be negative' },
                  max: { value: 10, message: 'Max 10 retries' },
                  validate: v => Number.isInteger(Number(v)) || 'Must be a whole number',
                })}
              />
            </FieldGroup>
          </div>
        </div>

        {/* ── Advanced Parameters ── */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <span className="icon">⚙</span>
            Advanced Parameters
          </div>

          <div className="form-grid">
            <FieldGroup
              label="Max Crawling"
              hint="Optional — total crawl request cap"
              error={errors.MAX_CRAWLING?.message}
            >
              <input
                type="number"
                className={`field-input ${errors.MAX_CRAWLING ? 'error' : ''}`}
                placeholder="500 (optional)"
                min="1"
                {...register('MAX_CRAWLING', {
                  min: { value: 1, message: 'Must be at least 1' },
                  validate: v => !v || Number.isInteger(Number(v)) || 'Must be a whole number',
                })}
              />
            </FieldGroup>

            <FieldGroup
              label="Max Wait Time (ms)"
              hint="Timeout per request in milliseconds"
              error={errors.MAX_WAIT_TIME?.message}
            >
              <input
                type="number"
                className={`field-input ${errors.MAX_WAIT_TIME ? 'error' : ''}`}
                placeholder="5000 (optional)"
                min="500"
                max="60000"
                {...register('MAX_WAIT_TIME', {
                  min: { value: 500, message: 'Min 500ms' },
                  max: { value: 60000, message: 'Max 60,000ms (60s)' },
                  validate: v => !v || Number.isInteger(Number(v)) || 'Must be a whole number',
                })}
              />
            </FieldGroup>

            <FieldGroup
              label="Concurrent Workers"
              hint="Parallel crawl threads"
              error={errors.CONCURRENT_WORKERS?.message}
            >
              <input
                type="number"
                className={`field-input ${errors.CONCURRENT_WORKERS ? 'error' : ''}`}
                placeholder="4 (optional)"
                min="1"
                max="32"
                {...register('CONCURRENT_WORKERS', {
                  min: { value: 1, message: 'At least 1 worker' },
                  max: { value: 32, message: 'Max 32 workers' },
                  validate: v => !v || Number.isInteger(Number(v)) || 'Must be a whole number',
                })}
              />
            </FieldGroup>

            <FieldGroup
              label="Scan Timeout (seconds)"
              hint="Total scan session timeout"
              error={errors.SCAN_TIMEOUT_SECONDS?.message}
            >
              <input
                type="number"
                className={`field-input ${errors.SCAN_TIMEOUT_SECONDS ? 'error' : ''}`}
                placeholder="300 (optional)"
                min="30"
                max="3600"
                {...register('SCAN_TIMEOUT_SECONDS', {
                  min: { value: 30, message: 'Min 30 seconds' },
                  max: { value: 3600, message: 'Max 3600 seconds (1hr)' },
                  validate: v => !v || Number.isInteger(Number(v)) || 'Must be a whole number',
                })}
              />
            </FieldGroup>
          </div>
        </div>

        {/* ── Behavior Flags ── */}
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="card-title">
            <span className="icon">⚑</span>
            Behavior Flags
          </div>

          <div className="flags-grid">
            <FlagItem
              label="ALLOW_SIGN_IN"
              badge="auth"
              checked={flags.ALLOW_SIGN_IN}
              onChange={() => toggleFlag('ALLOW_SIGN_IN')}
            />
            <FlagItem
              label="ALLOW_TEST_PAYMENT"
              badge="payment"
              checked={flags.ALLOW_TEST_PAYMENT}
              onChange={() => toggleFlag('ALLOW_TEST_PAYMENT')}
            />
          </div>

          <div className="section-divider">
            <div className="section-divider-line" />
            <span className="section-divider-label">Alert Settings</span>
            <div className="section-divider-line" />
          </div>

          <div className="form-grid">
            <FieldGroup
              label="Alert on Suspicious Links"
              hint="Trigger alert when potentially unsafe links are found"
            >
              <select
                className="field-input"
                {...register('ALERT_ON_SUSPICIOUS_LINKS')}
              >
                <option value="false">Disabled</option>
                <option value="true">Enabled</option>
              </select>
            </FieldGroup>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="form-actions">
          <span className="submit-status">
            {isSubmitting ? '⟳  Dispatching investigation to BRAM backend…' : ''}
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              reset();
              setFlags({ ALLOW_SIGN_IN: false, ALLOW_TEST_PAYMENT: false });
            }}
            disabled={isSubmitting}
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" />
                Submitting…
              </>
            ) : (
              <>▶ &nbsp;Analyze &amp; Store</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
