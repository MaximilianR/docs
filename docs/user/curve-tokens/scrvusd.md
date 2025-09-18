---
title: scrvUSD
sidebar_label: scrvUSD
hide_title: true
---

import InlinePill from '@site/src/components/InlinePill';
import ScrvusdSupply from '@site/src/components/LiveComponents/ScrvusdSupply';
import GuideCardGrid from '@site/src/components/GuideCardGrid';

import ScrvusdLogo from '@site/static/img/logos/scrvUSD_s.png';

# <img src={ScrvusdLogo} className="heading-inline-logo" alt="scrvUSD" /> The scrvUSD Token 

scrvUSD is short for savings-crvUSD, and it functions like a bank savings account for crvUSD.  It is similar to other staked versions of USD stablecoins like sDOLA, sUSDS, sUSDe, etc.  Users can stake their crvUSD to receive scrvUSD, or swap for it directly.  Yield accrues automatically to scrvUSD holders, increasing the value of their tokens over time.

The yield comes from receiving a share of the crvUSD borrowing revenue.  The underlying crvUSD is not deployed to external pools or lending markets. It remains safely within the vault, minimizing risk.

## Quick Links

See the link below for more information about scrvUSD and how the vault works.

<GuideCardGrid guideKeys={['scrvusd']} />

## Current scrvUSD Stats

The following table pulls current data from <InlinePill icon="/img/logos/ethereum.png" label="Ethereum" />

<ScrvusdSupply />