// src/components/GuideCardGrid.js

import React from 'react';
import GuideCard from './GuideCard'; // Your existing GuideCard component
import { ALL_GUIDES } from '@site/src/data/guides'; // Import the central data

// This component takes an array of guide keys (e.g., ['lockingCRV', 'claimingRevenue'])
// and renders them in a grid.
export default function GuideCardGrid({ guideKeys }) {
  if (!guideKeys || guideKeys.length === 0) {
    return null; // Don't render anything if no keys are provided
  }

  return (
    // Use the class you created for spacing between rows
    <div className="row guide-card-row">
      {guideKeys.map((key) => {
        const guide = ALL_GUIDES[key];
        if (!guide) {
          console.warn(`Guide with key "${key}" not found.`);
          return null;
        }
        return (
          // Assuming a 2-column layout. You can change col--6 to col--4 for 3 columns etc.
          <div className="col col--6" key={key}>
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