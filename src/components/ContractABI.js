import React, { useState } from 'react';
import styles from './ContractABI.module.css';

export default function ContractABI({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        type="button"
      >
        <span className={styles.icon}>{'{ }'}</span>
        <span className={styles.label}>Contract ABI</span>
        <span className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}>▼</span>
      </button>
      <div className={open ? `${styles.content} ${styles.contentOpen}` : styles.content}>
        {children}
      </div>
    </div>
  );
}
