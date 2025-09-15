import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function AuditCard({ 
  auditor, 
  date, 
  reportUrl, 
  logo,
  info
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [logoPath, setLogoPath] = useState(`/img/auditors/${logo}`); // Set an initial default path

  useEffect(() => {
    // This function will only run in the browser
    const checkThemeAndSetLogo = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const isDark = theme === 'dark';

      let newPath;
      if (logo === 'mixbytes_light.svg') {
        newPath = isDark ? '/img/auditors/mixbytes_dark.svg' : '/img/auditors/mixbytes_light.svg';
      } else if (logo === 'statemind_light.svg') {
        newPath = isDark ? '/img/auditors/statemind_dark.svg' : '/img/auditors/statemind_light.svg';
      } else if (logo === 'tob_light.svg') {
        newPath = isDark ? '/img/auditors/tob_dark.svg' : '/img/auditors/tob_light.svg';
      } else {
        newPath = `/img/auditors/${logo}`;
      }
      setLogoPath(newPath);
    };

    checkThemeAndSetLogo(); // Run once on mount

    // Listen for theme changes
    const observer = new MutationObserver(checkThemeAndSetLogo);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    return () => observer.disconnect();
  }, [logo]); // Re-run if the logo prop changes

  // Tooltip logic can stay separate
  const [tooltipTimeout, setTooltipTimeout] = useState(null);
  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  return (
    <div className="audit-card">
      {info && (
        <div 
          className="audit-card-info-icon" 
          onMouseEnter={() => {
            if (tooltipTimeout) clearTimeout(tooltipTimeout);
            setShowTooltip(true);
          }}
          onMouseLeave={() => {
            const timeout = setTimeout(() => setShowTooltip(false), 100);
            setTooltipTimeout(timeout);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="8" r="1" fill="currentColor"/>
          </svg>
          {showTooltip && (
            <div className="audit-card-tooltip">
              {info}
            </div>
          )}
        </div>
      )}
      <div className="audit-card-header">
        <div className="audit-card-logo">
          {logo && (
            <img 
              src={logoPath} // Use the state variable here
              alt={auditor} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          )}
          <div className="audit-card-logo-fallback" style={{ display: logo ? 'none' : 'block' }}>
            {auditor.charAt(0)}
          </div>
        </div>
        <div className="audit-card-title">
          {auditor}
        </div>
      </div>
      <div className="audit-card-content">
        <div className="audit-card-date">
          <strong>Date:</strong> {date}
        </div>
        <a href={reportUrl} className="audit-card-link" target="_blank" rel="noopener noreferrer">
          View Full Report →
        </a>
      </div>
    </div>
  );
}