import React from 'react';
import clsx from 'clsx';
import styles from './ButtonIcon.module.css';

export default function ButtonIcon({ src, alt, className, rounded = true }) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        styles.buttonIcon,
        { [styles.isRounded]: rounded },
        className
      )}
    />
  );
}