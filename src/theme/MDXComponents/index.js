import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import LendingRateChart from '../../components/LendingRateChart';
import SemiLogChart from '../../components/SemiLogChart';
import SwaggerUIComponent from '../../components/SwaggerUI';
import SourceCode from '../../components/SourceCode';
import Example from '../../components/Example';

export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  LendingRateChart,
  SemiLogChart,
  SwaggerUI: SwaggerUIComponent,
  SourceCode,
  Example,
};
