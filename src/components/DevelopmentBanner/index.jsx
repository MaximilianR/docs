import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import favicon from '@site/static/img/favicon.png';

export default function DevelopmentBanner() {
  // Popup starts visible on every initial page load
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Prevent closing by clicking outside - user must click the button
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      // Optionally allow closing by clicking backdrop
      // handleDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <img src={favicon} alt="Site logo" className={styles.icon} />
          <h3 className={styles.title}>Huhh. You found our secret documentation!</h3>
        </div>
        <div className={styles.content}>
          <p className={styles.message}>
            Just kidding — it's not really secret, just unfinished. This site is still under development, so please take everything with a grain of salt and verify it yourself.
          </p>
        </div>
        <div className={styles.footer}>
          <button 
            className={styles.closeButton}
            onClick={handleDismiss}
            aria-label="Dismiss popup"
          >
            Let Me In!
          </button>
        </div>
      </div>
    </div>
  );
}

