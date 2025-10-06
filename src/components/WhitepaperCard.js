import React, { useState, useEffect } from 'react';
import styles from './AuditCard.module.css';

export default function WhitepaperCard({ 
  title, 
  description,
  date, 
  pdfUrl, 
  info
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState(null);

  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  return (
    <div className={styles.auditCard}>
      {info && (
        <div 
          className={styles.auditCardInfoIcon}
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
            <div className={styles.auditCardTooltip}>
              {info}
            </div>
          )}
        </div>
      )}
      <div className={styles.auditCardHeader} style={{ display: 'block' }}>
        <div className={styles.auditCardLogo} style={{ display: 'none' }}>
          <div className={styles.auditCardLogoFallback} style={{ display: 'none' }}>
          </div>
        </div>
        <div className={styles.auditCardTitle} style={{ marginLeft: '0', marginTop: '0' }}>
          {title}
        </div>
      </div>
      <div className={styles.auditCardContent}>
        <div className={styles.auditCardDate}>
          <strong>Published:</strong> {date}
        </div>
        <a href={pdfUrl} className={styles.auditCardLink} target="_blank" rel="noopener noreferrer">
          View Whitepaper →
        </a>
      </div>
    </div>
  );
}
