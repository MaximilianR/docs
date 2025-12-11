import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import favicon from '@site/static/img/favicon.png';

export default function DevelopmentBanner() {
  // Disabled for now
  return null;
  
  // Popup starts visible on every initial page load (only on client)
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only run on client side
    setIsMounted(true);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    if (isVisible) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isVisible, isMounted]);

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

  // Don't render until mounted on client to avoid hydration issues
  if (!isMounted || !isVisible) {
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

