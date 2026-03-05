import React from 'react';
import WhitepaperCard from '../WhitepaperCard';
import { ALL_WHITEPAPERS } from '@site/src/data/whitepapers';
import styles from '../WhitepaperCard/styles.module.css';

export default function WhitepaperCardGrid() {
  if (ALL_WHITEPAPERS.length === 0) {
    return <p>No whitepapers found.</p>;
  }

  return (
    <div className={styles.grid}>
      {ALL_WHITEPAPERS.map((whitepaper, index) => (
        <WhitepaperCard
          key={whitepaper.id || index}
          title={whitepaper.title}
          date={whitepaper.date}
          pdfUrl={whitepaper.pdfUrl}
          info={whitepaper.info}
        />
      ))}
    </div>
  );
}
