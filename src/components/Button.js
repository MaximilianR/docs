import React from 'react';
import styles from './Button.module.css';

export default function ActionButton({ link, line1, line2, icon, iconAlt, centered = false }) {
  
  const buttonContent = (
    <a href={link} className={styles.button}>
      <span className={styles.firstLine}>{line1}</span>
      
      <span className={styles.secondLine}>
        <img
          src={icon}
          alt={iconAlt}
          className={styles.icon}
        />
        {line2}
      </span>
    </a>
  );

  if (centered) {
    return (
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        {buttonContent}
      </div>
    );
  }

  return buttonContent;
}