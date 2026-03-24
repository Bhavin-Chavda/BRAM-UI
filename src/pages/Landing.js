import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="page-content">
      <section className="landing-hero">

        <h1>
          Investigate<br />
          Gambling Sites<br />
          <span className="accent">With Precision.</span>
        </h1>

        <p>
          BRAM is a specialized investigative system for detecting, crawling, and
          reporting on online gambling platforms. Submit a merchant URL and let
          the system do the forensic heavy lifting.
        </p>

        <div className="landing-cta">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/investigate')}
          >
            ▶ &nbsp;Start Investigation
          </button>
          <button
            className="btn btn-outline btn-lg"
            onClick={() => navigate('/reports')}
          >
            View Reports
          </button>
        </div>
      </section>
    </div>
  );
}
