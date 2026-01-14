---
id: overview
title: Overview
sidebar_label: Overview
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';

A **D**ecentralized **Ex**change (DEX) is a trading platform that operates without a central company or authority, instead it runs on smart contracts with clear rules and behaviour. Unlike traditional exchanges like Coinbase or the New York Stock Exchange, a DEX allows users to trade digital assets on a blockchain like Ethereum.

This approach gives you complete control over your money. Here’s what that means for you:

  * **You're in Control:** You are always in control of your assets. Even when you buy or sell them, your assets are never held by Curve, which protects you from issues like exchange hacks or companies halting trading. This is known as being **non-custodial**.
  * **Automated and Transparent:** Trades on Curve are handled by **smart contracts**. These are programs that run on the blockchain and automatically execute trades according to their code. Every action is public and verifiable on the blockchain, ensuring a transparent and secure process.

<GuideCardGrid guideKeys={['howToSwap', 'howToDexDeposit']} />

## How Do Swaps Work? Liquidity Pools

To allow anyone to trade instantly, 24/7, Curve uses Pools, sometimes called Liquidity Pools. Instead of matching individual buyers and sellers (orderbook), users trade against a large pool of assets. All the pools available are shown on the [Pools page](https://www.curve.finance/dex/ethereum/pools/) for each network.

Each pool contains two or more tokens. When you want to swap one token for another, you add your token to the pool and take out the token you want. This system means there's always liquidity ready for your trade, so you don't have to wait for a buyer or seller to appear.  In the example below Alice swaps 1 ETH for 0.99 stETH through the stETH/ETH pool.

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="An example of a user swapping ETH for stETH through a liquidity pool."
    sources={{
      light: '/img/user/dex/dex-swap-light.svg',
      dark: '/img/user/dex/dex-swap-dark.svg',
    }}
    style={{
      maxWidth: '600px',
      width: '100%',
      height: 'auto',
      border: '1px solid var(--Layer-2-Outline)',
    }}
  />
  <figcaption>*Note: that in real pools Alice would get much more than 0.99 stETH, probably closer to 0.9999 stETH.* </figcaption>
</figure>


## Who Provides the Assets? Liquidity Providers (LPs)

The assets in these pools are supplied by other users, called **Liquidity Providers** (or LPs). Anyone can become an LP by depositing their assets into a pool.  When there's more assets in a pool, traders get better prices.

In return for providing liquidity, LPs earn fees from every swap that happens in their pool, and many pools also offer CRV or other token rewards. This incentivizes users to fill the pools with assets, which in turn provides a better trading experience for everyone.

## Types of Pools - Stableswap and Cryptoswap Pools

Curve uses two different kinds of pools, each designed for specific combination of assets:

  * **Stableswap Pools:** For assets that should trade at a similar price (e.g., USDC and USDT, or stETH and ETH).
  * **Cryptoswap Pools:** For assets whose prices move independently of each other (e.g., ETH and WBTC, or ETH and USDT).

To learn more about how they work, see the [Stableswap vs. Cryptoswap page](./stableswap-vs-cryptoswap.md)


## Basepools and Metapools

Within Curve's Stableswap pools, there are also pool designs which are known as Basepools and Metapools:

- **Basepools**: These are foundational pools of liquidity on Curve.  When you deposit to pool you get back an LP token representing your share of assets in that pool.  For certain pools, think [3pool](https://www.curve.finance/dex/ethereum/pools/3pool/deposit/) (DAI/USDC/USDT) and [Curve.fi Strategic USD Reserves](https://curve.finance/dex/ethereum/pools/factory-stable-ng-355/deposit/?ref=news.curve.finance) (USDT/USDC) these LP tokens are approved to be used as an asset in other pools.  Any Stableswap pool can be approved to be a Basepool, with a successful DAO vote.
- **Metapools**: Metapools contain a Basepool LP token as one of their assets, as well as one or more different assets which aren't in the Basepool.

See the image below for a visual representation of the [Curve.fi Strategic USD Reserves Basepool](https://curve.finance/dex/ethereum/pools/factory-stable-ng-355/deposit/?ref=news.curve.finance) and the [DOLA Strategic Reserves Metapool](https://curve.finance/dex/ethereum/pools/factory-stable-ng-396/deposit/?ref=news.curve.finance):

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Basepools and Metapools"
    sources={{
      light: '/img/user/dex/dex-basepools-light.svg',
      dark: '/img/user/dex/dex-basepools-dark.svg',
    }}
    style={{
      maxWidth: '600px',
      width: '100%',
      height: 'auto',
      border: '1px solid var(--Layer-2-Outline)',
    }}
  />
  <figcaption></figcaption>
</figure>

## Pool Fees

Each **Stableswap** pool has its own set fee, with most ranging from **0.005% to 0.02%**. However, some pools, such as the Strategic Reserve pools, have a much lower fee of around **0.001%**. Most current and all new pools now feature **dynamic fees**. This mechanism automatically increases the fee when a swap would make an imbalanced pool even more so, thereby increasing liquidity providers' (LPs) profits during market volatility.

**Cryptoswap** pools have a broader fee range, typically higher than Stableswap pools, to account for impermanent loss and rebalancing costs. Fees can be as low as **0.05%** and go up to around **0.4%**.  Cryptoswap pools also feature dynamic fees, which automatically increases the fee when swaps make the imbalances worse.  
