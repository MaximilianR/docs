import React from 'react';
import GuideCard from './GuideCard';
import { ALL_GUIDES } from '@site/src/data/guides';

export default function GuideCardGrid({ guideKeys }) {
  if (!guideKeys || guideKeys.length === 0) {
    return null;
  }

  return (
    <div className="guide-cards-grid">
      {guideKeys.map((key) => {
        const guide = ALL_GUIDES[key];
        if (!guide) {
          console.warn(`Guide with key "${key}" not found.`);
          return null;
        }
        
        return (
          <GuideCard
            key={key}
            title={guide.title}
            description={guide.description}
            image={guide.image}
            link={guide.link}
          />
        );
      })}
    </div>
  );
}