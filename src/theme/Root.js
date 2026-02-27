import React from 'react';
import FeedbackButton from '@site/src/components/FeedbackButton';

export default function Root({ children }) {
  return <>
    {children}
    <FeedbackButton />
  </>;
}
