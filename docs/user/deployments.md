---
id: deployments
title: Contract Deployments
sidebar_label: Contract Deployments
hide_table_of_contents: true
sidebar_position: 8
---

import DeploymentFilter from '@site/src/components/DeploymentFilter';

This page provides a searchable directory of all Curve contract deployments across all supported chains. Use the filters below to find specific contract addresses by chain, category, or search term.


- Use quotes for exact matches: `"vecrv"` will only return results containing exactly that term
- Use field-specific search: `in:category "vecrv"`, `in:chain ethereum`, `in:name math`, `in:address 0x...`, or `in:path amm.stableswap`
- Combine multiple search terms: `ethereum "stableswap" math` or `in:category tokens in:chain ethereum`

:::info
This filter uses a raw JSON file to cover all contracts across all chains. While this is the best approach to provide comprehensive coverage, some contracts may be outdated or incorrect. You can find the raw JSON file [here](/deployments.json).
:::

<DeploymentFilter />
