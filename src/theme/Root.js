import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import FeedbackButton from '@site/src/components/FeedbackButton';

// Pages where the feedback button should be hidden
const HIDE_FEEDBACK_PATHS = ['/fee-architecture'];

export default function Root({ children }) {
  return <>
    {children}
    <BrowserOnly>
      {() => HIDE_FEEDBACK_PATHS.some(p => window.location.pathname.startsWith(p)) ? null : <FeedbackButton />}
    </BrowserOnly>
  </>;
}
