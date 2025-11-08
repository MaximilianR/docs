import React from 'react';
import BadgeGrid from './BadgeGrid';
import { ALL_GUIDES } from '@site/src/data/guides';

export default function GuideCardGrid({ guideKeys }) {
  if (!guideKeys || guideKeys.length === 0) {
    return null;
  }

  // Transform guideKeys into BadgeGrid card format
  const cards = guideKeys
    .map((key) => {
      const guide = ALL_GUIDES[key];
      if (!guide) {
        console.warn(`Guide with key "${key}" not found.`);
        return null;
      }
      
      return {
        title: guide.title,
        description: guide.description,
        href: guide.link,
        // Note: guide.image is typically empty, so we're not using it
        // If you want to add logos later, you can add a logo field to guides.js
      };
    })
    .filter(Boolean); // Remove null entries

  return <BadgeGrid cards={cards} />;
}