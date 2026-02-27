import React from 'react';
import LendingRateChart from '../components/LendingRateChart';
import SemiLogChart from '../components/SemiLogChart.jsx';
import SwaggerUIComponent from '../components/SwaggerUI';

export default function useMDXComponents(components) {
  return {
    LendingRateChart: LendingRateChart,
    SemiLogChart: SemiLogChart,
    SwaggerUI: SwaggerUIComponent,
    ...components,
  };
} 