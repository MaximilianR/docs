---
title: Curve Pool Factory
---

import GuideCardGrid from '@site/src/components/GuideCardGrid';

# Curve Pool Factory

Curve offers a **permissionless** system for deploying liquidity pools — no DAO vote, no approval process, and no technical barrier beyond the gas cost to deploy. A full-featured interface is available in the Curve app, so you can launch a custom pool without writing any code.

To get started quickly, follow one of the deployment guides:

<GuideCardGrid guideKeys={['lockingCrv', 'claimingCrvRewards']} />

- [Guide — Deploy a Stableswap Pool](guides/deploy-stableswap.md)
- [Guide — Deploy a Cryptoswap Pool](guides/deploy-cryptoswap.md)

Factories make launching pools on Curve fast, flexible, and accessible to any project—whether you're a stablecoin issuer, LST protocol, synthetic-asset platform, or any other DeFi team looking to bootstrap deep, reliable liquidity.

## What Is a Pool Factory?

A **Pool Factory** is a smart contract that deploys new pools. Each factory contains the logic and configuration for a specific pool type. The two algorithms currently supported are:

- **Stableswap** — for pegged or correlated assets (e.g., USDC/USDT, stETH/ETH)  
- **Cryptoswap** — for more volatile or uncorrelated assets (e.g., ETH/USDC)

Once a factory is deployed, anyone can create a new pool of that type—either through the Curve UI or directly on-chain.

Pools deployed via a factory appear automatically on the Curve frontend after a short propagation period and are picked up by aggregators such as 1inch and CowSwap. You don’t need to chase integrations.

## Choosing the Right Pool Type

Curve supports multiple pool designs to fit different kinds of assets. Selecting the correct type is essential to ensure low slippage, efficient trading, and capital-efficient liquidity.

- Choose a **Stableswap pool** when your assets are expected to stay close in price—e.g., stablecoins (USDC/USDT), LSTs (wstETH/stETH), or yield-bearing stable assets like sDAI.  
- Choose a **Cryptoswap pool** when your assets are more volatile or uncorrelated—e.g., ETH/USDC or BTC/USDC. Cryptoswap pools use dynamic pricing that handles larger price swings while still retaining Curve’s efficiency advantages.

Not sure which to use? Reach out in the official Curve channels.

## Base Pools and Metapools

Stableswap pools on Curve support a powerful structure of **base pools** and **metapools**.

- A **base pool** is a regular Curve pool that the DAO has approved for use in metapools.  
- A **metapool** pairs a new token against an existing base pool rather than against a single token.

For example, the USDC/USDT pool might begin as a normal Stableswap pool. If the DAO designates it as a base pool, it can then be reused in other pools. A protocol such as MIM can create a metapool that pairs MIM against the base pool, resulting in a MIM–USDC/USDT market.

This approach gives new tokens a major advantage: they can **tap into the deep, established liquidity of the base pool** instead of needing to attract all liquidity themselves. The result is better pricing, faster adoption, and more efficient routing from day one.
