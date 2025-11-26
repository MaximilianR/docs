import React from 'react';
import FeedbackButton from '@site/src/components/FeedbackButton';
import DevelopmentBanner from '@site/src/components/DevelopmentBanner';

export default function Root({ children }) {
  return <>
    <DevelopmentBanner />
    {children}
    <FeedbackButton />
  </>;
}
