---
id: understanding-stableswap
title: Understanding Stableswap
sidebar_label: Understanding Stableswap
---

import ThemedImage from '@theme/ThemedImage'

## Historical Background

Curve’s Stableswap algorithm was invented by Michael Egorov, the founder of Curve, back in November 2019.

It was first introduced in a paper titled [“Stableswap: Efficient Mechanism for Stablecoin Liquidity”](../../../static/pdf/whitepapers/whitepaper_stableswap.pdf), which proposed a new type of automated market maker (AMM) optimized for trading assets that are meant to stay at roughly the same price — like stablecoins or tokenized versions of the same asset (e.g., USDC/USDT or wrappers like wBTC/cbBTC).

Unlike Uniswap’s constant product formula (x·y = k), Egorov’s Stableswap **combined features of both constant sum and constant product curves**, allowing **low-slippage trades near the peg while still maintaining deep liquidity and arbitrage incentives when prices drift apart**.

:::info
In October 2023, the initial Stableswap implementation was reworked and improved with a few crucial additions pushing the efficiency of Stableswap further. More: [Evolution Stableswap-NG](#evolution-stableswap-ng)
:::

## How it Works

Stableswap was designed for pools of similarly priced assets, like stablecoins with the same denomination (e.g USD), to concentrate liquidity around their pegged price. E.g. in the case of USDC/USDT at 1. Unlike concentrated liquidity AMMs (CLAMMs) where liquidity providers must actively set price ranges, **Stableswap's liquidity concentration is fully passive** — users simply deposit tokens and the protocol automatically concentrates liquidity around the peg through a **single continuous bonding curve**. No range management or active position adjustments are required.

<figure>
  <ThemedImage
    sources={{
      light: require('@site/static/img/protocol/amm/stableswap-swap.png').default,
      dark: require('@site/static/img/protocol/amm/stableswap-swap.png').default,
    }}
    style={{ 
      width: "1000px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

Stableswap pools are designed to function effectively even when heavily imbalanced. Depending on the **Amplification Coefficient** (`A`), pools can maintain close to 1:1 pricing even when significantly imbalanced. If the imbalance becomes large enough to cause a price deviation from the 1:1 peg, it creates an arbitrage opportunity. This incentivizes traders to rebalance the pool, with each swap generating fees for liquidity providers (LPs).

While the blocks offer a helpful visual, Stableswap's liquidity is more accurately represented by a bonding curve:

<figure>
  <ThemedImage
    sources={{
      light: require('@site/static/img/protocol/amm/stableswap-liquidity-curve.png').default,
      dark: require('@site/static/img/protocol/amm/stableswap-liquidity-curve.png').default,
    }}
    style={{ 
      width: "1000px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

## Amplification Coefficient

The shape of this liquidity bonding curve and how imbalanced a pool can become before price deviates from 1:1 is controlled by a parameter called `A`, the **Amplification Coefficient**:

<figure>
  <ThemedImage
    sources={{
      light: require('@site/static/img/protocol/amm/stableswap-a.png').default,
      dark: require('@site/static/img/protocol/amm/stableswap-a.png').default,
    }}
    style={{ 
      width: "500px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

- A **higher `A`** (e.g., 1,000–20,000) concentrates liquidity more tightly around the peg. This provides deeper liquidity for swaps and allows pools to become very imbalanced before the price deviates significantly from 1:1. The trade-off is that if an asset moves far from the peg, liquidity and pricing can drop off sharply.

- A **lower `A`** (e.g., 50–200) distributes liquidity more evenly. The price will deviate more gradually from the peg as the pool becomes imbalanced, avoiding sharp jumps.

## Evolution: Stableswap-NG

Stableswap-NG, a reworked implementation of the initial Stableswap, was deployed in the end of October 2023. This new implementation allowed for the inclusion of up to eight tokens in the AMM. It also extended support to a variety of token types, including **rate-oraclized tokens** like wstETH, **ERC-4626** like sDAI, and **rebasing tokens** like stETH.

Additionally, the new implementation got rid of the usage of raw ETH which caused quite some exploits in other protocols in the past and enforced the usage of wETH. The decision was rooted in ensuring higher security standards and avoiding footguns.

New implementation also included built-in, resilient, **exponential-moving average (EMA) oracles** and **dynamic fees** based on the token balances in the pool.

## Mathematical Foundation

Stableswap's bonding curve is a sophisticated **combination of a linear invariant and a constant product invariant**. Understanding these building blocks helps explain how Stableswap achieves low slippage for similarly-priced assets.

A linear invariant is described as $x + y = C$, where $x$ and $y$ are pooled tokens and $C$ is the invariant constant. This formula is known as the **constant sum formula** and produces a linear straight line when graphed. The key property is that **the price remains constant regardless of pool balances**, resulting in zero slippage. However, this also means pools can be completely drained of one asset.

The Uniswap AMM uses a constant product invariant: $x \cdot y = k$, where $x$ and $y$ are pooled tokens and $k$ is the invariant constant. This formula ensures there is always liquidity available, but the price changes with each trade, resulting in slippage that increases as the pool becomes more imbalanced.

Stableswap combines both invariants to get the benefits of low slippage near the peg while maintaining liquidity protection. The initial combination is:

$$(x + y) + (x \cdot y) = D + \left(\frac{D}{n}\right)^n$$

where $D$ is the total value of tokens in the pool and $n$ is the number of tokens (typically 2 for a two-token pool).

<figure>
  <ThemedImage
    sources={{
      light: require('@site/static/img/protocol/amm/invariants.png').default,
      dark: require('@site/static/img/protocol/amm/invariants.png').default,
    }}
    style={{ 
      width: "400px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

However, this basic combination doesn't provide enough amplification. To make the curve more effective, the sum invariant needs to be multiplied by an amplification factor $\chi$:

$$\chi(x + y) + (x \cdot y) = \chi D + \left(\frac{D}{n}\right)^n$$

The multiplier $\chi$ amplifies the low-slippage portion of the equation, making the bonding curve more linear when pools are balanced.

The amplification factor $\chi$ is not constant but dynamically adjusts based on the pool's balance:

$$\chi = \frac{A \cdot x \cdot y}{\left(D/n\right)^n}$$

where $A$ is the fixed **amplification coefficient** parameter. When pools are **balanced** (e.g., $x = 50$, $y = 50$), $\chi = A$, maximizing the linear behavior. When pools are **unbalanced**, $\chi$ decreases, causing the curve to behave more like the constant product formula. As pools become more unbalanced, $\chi \rightarrow 0$, and the curve approaches $x \cdot y = k$.

Substituting the dynamic $\chi$ into the combined invariant and simplifying, we arrive at the final Stableswap equation:

$$\boxed{An^n\sum x_i + D = ADn^n + \frac{D^{n+1}}{n^n \prod x_i}}$$

For a two-token pool ($n=2$), this becomes:

$$4A(x + y) + D = 4AD + \frac{D^3}{4xy}$$

This equation ensures **low slippage** when pools are balanced (high $\chi$), **liquidity protection** when pools are imbalanced (low $\chi$, approaching constant product), and a **smooth transition** between these two behaviors based on the pool's balance. The amplification coefficient $A$ is a protocol parameter that controls how tightly liquidity is concentrated around the peg. Higher values of $A$ create a flatter curve (more linear) when balanced, while lower values create a more gradual transition to the constant product curve.
