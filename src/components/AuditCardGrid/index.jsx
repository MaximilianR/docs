import React from 'react';
import AuditCard from '../AuditCard';
import { ALL_AUDITS } from '@site/src/data/audits';
import styles from '../AuditCard/styles.module.css';

export default function AuditCardGrid({ category }) {
  if (!category) {
    console.warn("AuditCardGrid requires a 'category' prop.");
    return null;
  }

  // Filter audits by category
  const audits = ALL_AUDITS.filter(audit => audit.category === category);

  if (audits.length === 0) {
    return <p>No audits found for this category.</p>;
  }

  return (
    <div className={styles.auditCardsGrid}>
      {audits.map((audit, index) => (
        <AuditCard
          key={audit.id || index}
          auditor={audit.auditor}
          date={audit.date}
          reportUrl={audit.reportUrl}
          logo={audit.logo}
          info={audit.info}
        />
      ))}
    </div>
  );
}
