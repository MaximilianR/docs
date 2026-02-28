import React, { useState } from 'react';
import styles from './Dropdown.module.css';

export default function Dropdown({ title, children }) {
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
        <span className={styles.label}>{title}</span>
        <span className={open ? `${styles.chevron} ${styles.chevronOpen}` : styles.chevron}>▼</span>
      </button>
      <div className={open ? `${styles.content} ${styles.contentOpen}` : styles.content}>
        {children}
      </div>
    </div>
  );
}
