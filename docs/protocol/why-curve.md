---
id: why-curve
title: The Backbone of DeFi
sidebar_label: Why Curve
---

import GuideCardGrid from '@site/src/components/GuideCardGrid'
import ProtocolCardGrid from '@site/src/components/ProtocolCardGrid'
import ThemedImage from '@theme/ThemedImage'

Curve allows endless possibilities to be used or built on top of. Whether it is simply deploying a liquidity pool or lending market, or building an entirely new stack on top of Curve. Its incredible neutrality and permissionless nature do not discriminate or restrict against any market participants and welcome everyone to use, build and improve Curve.

<figure>
  <ThemedImage
    alt="Select Pool Type"
    sources={{
      light: require('@site/static/img/logos/ride-the-curve.png').default,
      dark: require('@site/static/img/logos/ride-the-curve.png').default,
    }}
    style={{ 
      width: "200px",
      display: "block",
      margin: "0 auto"
    }}
  />
  <figcaption></figcaption>
</figure>

Available across 25+ blockchains, Curve provides universal access to deep liquidity infrastructure.

## The Right Place for Onchain Liquidity

Curve is the **definitive platform** for building deep, sustainable onchain liquidity for your asset. Whether you're launching a new token, scaling an existing one, or creating innovative DeFi products, Curve provides the complete infrastructure you need:


<ProtocolCardGrid protocols={[
  {
    name: "Convex, Yearn & StakeDAO",
    logo: "ll_united.svg"
  },
  {
    name: "Lido",
    logo: "lido.svg"
  },
  {
    name: "Resupply",
    logo: "resupply.svg"
  },
  {
    name: "Frax",
    logo: "frax.png"
  },
  {
    name: "more",
    logo: "100+"
  }
]} />

---

## Three Core Pillars, One Unified Platform

Curve is built on three core pillars that work together seamlessly:

### Curve DEX
The core business with which Curve started off. Pioneered the exchange of stable-like assets with the stableswap algorithm created back in 2020, which to this day is the most efficient, battle-tested and reliable algorithm, despite other projects calling it a "soon to be obsolete" innovation. Later in 2021, algorithms for volatile pairs came along.

Why Curve over other protocols? Because Curve is your swiss army knife providing:

- **Passive Liquidity Provision** - no range-setting, rebalancing, or manual upkeep required; the LP's liquidity is always in range and used for trading, and therefore LPs always earn trading fees.
- **Specialized and suitable algorithms** for every asset type - not only from pegged stablecoins to volatile crypto pairs but also different token standards like ERC-20, ERC-4626, Rebasing and more. While other AMMs rob the LPs of the rebases, Curve gives them where they belong: the LPs.
- **Fully Permissionless** - deploy pools instantly without DAO approvals
- **Fully Onchain Built-in Oracles** - liquidity pools on Curve come with built-in EMA oracles; no need to pay extra for centralized, issue-prone oracles
- **Routing Integration from Day 1** - liquidity pools are automatically picked up by leading aggregators like 1inch, CowSwap, and Paraswap.

### Llamalend
A permissionless lending system built on crvUSD, enabling sophisticated borrowing and lending strategies:

- **Liquidation Protections** - a new and novel liquidation mechanism which gives users more time and flexibility to react when things go south
- **Isolated markets** - each lending market is isolated to keep risks as minimal as possible and allow for precise risk management
- **High LTV ratios** - some of the highest loan-to-value ratios in DeFi


### Gauges & Incentives
Curve's protocol mechanics makes it easy to bootstrap, maintain or build liquidity for on-chain assets. Curve's gauge system provides a flexible incentive mechanism that enables you to bootstrap and sustain liquidity for your asset:

- **CRV Emissions** - Direct a portion of Curve's weekly CRV inflation to your pool through gauge weight voting, attracting more liquidity providers
- **Permissionless Rewards** - Add your own token incentives instantly without governance approval to boost pool attractiveness
- **Vote Incentives** - Provide rewards to veCRV holders to vote for your gauge, creating sustainable voting power
- **Flexible Strategies** - Choose between temporary vote renting or permanent veCRV accumulation based on your needs
- **Custom Combinations** - Mix CRV emissions, custom rewards, and vote incentives to create your perfect liquidity bootstrapping strategy

---

## Getting Started

Ready to deploy a pool or lending market or proliferate your asset across DeFi? Here's how to get started:

<GuideCardGrid guideKeys={['LiquidityPools', 'LendingMarkets', 'GaugesAndIncentives']} />
