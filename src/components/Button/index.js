import React from 'react';
import styles from './styles.module.css';

export default function ActionButton({ link, line1, line2Content }) {

  const buttonContent = (
    <a href={link} className={styles.button} target="_blank">
      <span className={styles.firstLine}>{line1}</span>
      <span className={styles.secondLine}>{line2Content}</span>
    </a>
  );
  return buttonContent;
}
