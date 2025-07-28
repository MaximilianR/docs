import React from 'react';
import GuideCard from './GuideCard';
import { ALL_GUIDES } from '@site/src/data/guides';
import clsx from 'clsx'; // Import the clsx utility

export default function GuideCardGrid({ guideKeys }) {
  if (!guideKeys || guideKeys.length === 0) {
    return null;
  }

  const totalGuides = guideKeys.length;
  // Check if the total number of guides is odd
  const isOddCount = totalGuides % 2 !== 0;

  return (
    <div className="row">
      {guideKeys.map((key, index) => {
        const guide = ALL_GUIDES[key];
        if (!guide) {
          console.warn(`Guide with key "${key}" not found.`);
          return null;
        }

        // Center the guide if the total count is odd AND it's the last item
        const shouldCenter = isOddCount && (index === totalGuides - 1);

        const colClassName = clsx('col col--6', {
          'col--offset-3': shouldCenter,
        });
        
        return (
          <div className={colClassName} key={key} style={{ marginBottom: '1rem' }}>
            <GuideCard
              title={guide.title}
              description={guide.description}
              image={guide.image}
              link={guide.link}
            />
          </div>
        );
      })}
    </div>
  );
}