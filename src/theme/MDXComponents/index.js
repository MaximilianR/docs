import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import LendingRateChart from '../../components/LendingRateChart';
import SemiLogChart from '../../components/SemiLogChart';
import SwaggerUIComponent from '../../components/SwaggerUI';

export default {
  ...MDXComponents,
  LendingRateChart,
  SemiLogChart,
  SwaggerUI: SwaggerUIComponent,
};
