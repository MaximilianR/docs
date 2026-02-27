import React, { useState } from 'react';
import styles from './Example.module.css';

export default function Example({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.toggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        type="button"
      >
        <span className={styles.icon}>▶</span>
        <span className={styles.label}>Example</span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>▼</span>
      </button>
      <div className={`${styles.content} ${open ? styles.contentOpen : ''}`}>
        {children}
      </div>
    </div>
  );
}
