import React from 'react';
import styles from './DocCard.module.css';

export function DocCardGrid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}

export default function DocCard({ title, icon, link, linkText, children }) {
  const iconSrc = icon
    ? icon.startsWith('/') || icon.startsWith('http')
      ? icon
      : `/img/logos/${icon}.svg`
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {iconSrc && (
          <img
            src={iconSrc}
            alt=""
            className={styles.icon}
          />
        )}
        <code className={styles.title}>{title}</code>
      </div>
      <hr className={styles.divider} />
      <div className={styles.body}>{children}</div>
      {link && (
        <a href={link} className={styles.link}>
          &rarr; {linkText || 'Read more'}
        </a>
      )}
    </div>
  );
}
