import React from 'react';
import LendingRateChart from '../components/LendingRateChart';

export default function useMDXComponents(components) {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({children}) => <h1 style={{fontSize: '2rem'}}>{children}</h1>,
    LendingRateChart: LendingRateChart,
    ...components,
  };
} 