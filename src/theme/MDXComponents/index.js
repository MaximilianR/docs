import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import LendingRateChart from '../../components/LendingRateChart';
import SemiLogChart from '../../components/SemiLogChart';
import SwaggerUIComponent from '../../components/SwaggerUI';
import ContractInfo from '../../components/ContractInfo';
import SourceCode from '../../components/SourceCode';
import Example from '../../components/Example';

export default {
  ...MDXComponents,
  LendingRateChart,
  SemiLogChart,
  SwaggerUI: SwaggerUIComponent,
  ContractInfo,
  SourceCode,
  Example,
};
