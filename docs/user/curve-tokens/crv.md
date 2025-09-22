---
title: CRV
sidebar_label: CRV
hide_title: true
---

import GuideCardGrid from '@site/src/components/GuideCardGrid';
import CrvSupply from '@site/src/components/LiveComponents/CrvSupply';
import InlinePill from '@site/src/components/InlinePill';
import CrvAllocationChart from '@site/src/components/Charts/CrvAllocation';
import CrvInflationCumulative from '@site/src/components/Charts/CrvInflationCumulative';
import CrvLogo from '@site/static/img/logos/CRV_s.png';

# <img src={CrvLogo} className="heading-inline-logo" alt="CRV" /> The CRV Token

CRV is the native token of the Curve ecosystem. It was launched in August 2020 on Ethereum and has a fixed maximum supply of approximately 3.03 billion tokens. CRV is mainly used for:

- Rewarding users who provide liquidity in Curve pools and Llamalend markets
- Participating in Curve governance, earning a share of Curve's revenue, and boosting LP rewards by locking CRV into vote-escrowed CRV (veCRV).  See [veCRV page for more info](../vecrv/what-is-vecrv.md)

New CRV is constantly slowly created and distributed to Liquidity Providers (LPs). The issuance rate decreases over time, reducing by 16% each August (see [table](#current-crv-stats) below for this year's exact date). A portion of the initial supply (1.3B) was distributed with vesting schedules that have now finished as of August 2024.  The majority of the other 1.7B CRV is emitted to liquidity providers gradually over the next approx. 200 years.


## Guides

See the guides below for how to lock your CRV for veCRV, and how to claim your earned CRV rewards from providing liquidity to a pool or Llamalend market.

<GuideCardGrid guideKeys={['lockingCrv', 'claimingCrvRewards']} />

## Current CRV Stats

The following table pulls current data from <InlinePill icon="/img/logos/ethereum.png" label="Ethereum" />

<CrvSupply />

## Tokenomics

The chart below illustrates the initial distribution of the CRV token at launch.

<CrvAllocationChart style={{ marginBottom: '10px' }} />

The Community allocation represents a dedicated supply that is emitted over time as rewards for liquidity providers. Allocations for the Core Team, Investors, and Employees have all fully unlocked.

## Emission Schedule

The chart below shows the cumulative release of CRV tokens over time, including vesting schedules for different allocation categories.

<CrvInflationCumulative />

:::info
The chart shows the cumulative release of CRV tokens over time. Community emissions decrease by 16% each August, while all vesting schedules have completed as of August 2024. The majority of remaining CRV will be emitted to liquidity providers over the next ~200 years.
:::

## FAQ

### What is veCRV?

veCRV stands for vote-escrowed CRV (locked CRV).  You obtain veCRV by "locking" your CRV tokens for a specified period, ranging from 1 week to 4 years.  The longer you lock your CRV, the more veCRV you receive proportionally.  See the [veCRV page](vecrv) for the benefits of locking CRV for veCRV, and how locking works.

### How is CRV Distributed?

Each week veCRV holders vote for which pools and lending markets they want the weekly minted CRV to flow to, and the CRV is split based on how many votes each pool/lending market receives.  This is called [Gauge voting](../dao/voting-gauges.md), see the page for more information.

### Are there any upcoming team, investor, or insider unlocks?

No, all unlocks have already occurred.  The final unlock (team vesting) finished in August, 2024.  All unreleased CRV tokens will be rewarded to LPs over the next ~200 years.