---
id: using-on-l2s
title: Using Curve on L2s
sidebar_label: DEX & Llamalend
---

Using Curve products on L1s and L2s works exactly the same way as on Ethereum. However, some products might not be supported on every chain (such as Llamalend). To see which products are supported on each chain, see [Supported Chains & Features](supported-chains.md). All these products can be used by simply switching to the desired chain in the top right of the UI.

Curve offers these two main products:

## DEX (Decentralized Exchange)

The Curve DEX is available on many chains, with more becoming available all the time. Providing liquidity to pools and creating new pools works the same way across all chains. Both [**Stableswap**](/protocol/pool/overview#stableswap-pool) and [**Cryptoswap**](/protocol/pool/overview#cryptoswap) pools are available on all chains where Curve has been deployed.

**Fee Distribution**: Fees from swaps on all chains are split 50/50 between LPs and the Curve DAO. These fees are automatically bridged back to Ethereum for distribution.

**CRV Rewards**: CRV inflation rewards are available on L2s and alt-L1s, but they are delayed by one week. When users vote to send CRV rewards to a pool on an L2 or alt-L1, the rewards must first accrue on Ethereum in a [Root Gauge](/developer/gauges/xchain-gauges/root-gauge) for one week, before being bridged to the [Child Gauge](/developer/gauges/xchain-gauges/child-gauge) and distributed over the following week.

### Curve-Core

[Curve-Core](https://github.com/curvefi/curve-core) is a trustless solution for chain operators to deploy a minimal Curve DEX instance to new chains. This tool enables faster deployment with reduced overhead by providing:

- **Trustless Pool Creation through Factories** - including Stableswap and Cryptoswap pools
- **Swap Router** - so users don't have to manually select pools to swap through
- **Reward Contracts** - so any reward token can be easily streamed to LPs
- **Governance Contracts** - ensuring cross-chain operations like parameter updates remain fully under DAO control

## Llamalend

Llamalend is currently available on five chains: **Ethereum**, **Arbitrum**, **Fraxtal**, **Sonic**, and **Optimism**.

**CRV Rewards**: CRV inflation rewards are available on L2s and alt-L1s, but they are delayed by one week. When users vote to send CRV rewards to a Llamalend market on an L2 or alt-L1, the rewards must first accrue on Ethereum in a [Root Gauge](/developer/gauges/xchain-gauges/root-gauge) for one week, before being bridged to the [Child Gauge](/developer/gauges/xchain-gauges/child-gauge) and distributed over the following week.
