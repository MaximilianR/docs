import React from 'react';
import WhitepaperCard from './WhitepaperCard';
import { ALL_WHITEPAPERS } from '@site/src/data/whitepapers';

export default function WhitepaperCardGrid() {
  if (ALL_WHITEPAPERS.length === 0) {
    return <p>No whitepapers found.</p>;
  }

  return (
    <div className="audit-cards-grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(2, 1fr)', 
      gap: '1.5rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {ALL_WHITEPAPERS.map((whitepaper, index) => (
        <WhitepaperCard
          key={whitepaper.id || index}
          title={whitepaper.title}
          description={whitepaper.description}
          date={whitepaper.date}
          pdfUrl={whitepaper.pdfUrl}
          info={whitepaper.info}
        />
      ))}
    </div>
  );
}
