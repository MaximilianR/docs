import React, { useState, useEffect } from 'react';

export default function AuditCard({ 
  auditor, 
  date, 
  reportUrl, 
  logo,
  info
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Check initial theme
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      const htmlClass = document.documentElement.className;
      const bodyClass = document.body.className;
      
      // Multiple ways to detect dark mode
      const isDark = theme === 'dark' || 
                    htmlClass.includes('dark') || 
                    bodyClass.includes('dark') ||
                    document.documentElement.classList.contains('dark');
      
      console.log('Theme check:', { theme, htmlClass, bodyClass, isDark });
      setIsDarkMode(isDark);
    };

    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      observer.disconnect();
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  // Get the appropriate logo based on theme
  const getLogoPath = () => {
    if (!logo) return null;
    
    // Debug logging
    console.log('AuditCard Debug:', { logo, isDarkMode });
    
    // For MixBytes, use theme-specific logos
    if (logo === 'mixbytes_light.svg') {
      const path = isDarkMode ? '/img/auditors/mixbytes_dark.svg' : '/img/auditors/mixbytes_light.svg';
      console.log('MixBytes logo path:', path);
      return path;
    }
    
    // For StateMind, use theme-specific logos
    if (logo === 'statemind_light.svg') {
      const path = isDarkMode ? '/img/auditors/statemind_dark.svg' : '/img/auditors/statemind_light.svg';
      console.log('StateMind logo path:', path);
      return path;
    }
    
    // For TrailOfBits, use theme-specific logos
    if (logo === 'tob_light.svg') {
      const path = isDarkMode ? '/img/auditors/tob_dark.svg' : '/img/auditors/tob_light.svg';
      console.log('TrailOfBits logo path:', path);
      return path;
    }
    
    // For other logos, use the same file for both themes
    return `/img/auditors/${logo}`;
  };

  return (
    <div className="audit-card">
      {info && (
        <div 
          className="audit-card-info-icon" 
          onMouseEnter={() => {
            if (tooltipTimeout) {
              clearTimeout(tooltipTimeout);
            }
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
          {logo ? (
            <img 
              src={getLogoPath()} 
              alt={auditor} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
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
