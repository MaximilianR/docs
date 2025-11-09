---
id: understanding-cryptoswap
title: Understanding Cryptoswap
sidebar_label: Understanding Cryptoswap
---

import ThemedImage from '@theme/ThemedImage'

## Historical Background

The CryptoSwap algorithm was also invented by Michael Egorov as an evolution of the original StableSwap model.

It was introduced in late 2021, alongside the launch of Curve’s “TriCrypto” pools (e.g., USDT–wBTC–ETH), which allowed swaps between uncorrelated assets — not just stablecoins.

CryptoSwap extended the StableSwap formula by introducing a dynamic amplification coefficient (A) that automatically adjusts based on market volatility. This made it possible to offer tight spreads and deep liquidity when prices are stable, but also greater resilience and arbitrage opportunities during large price moves.

The underlying math was formalized in the paper [“CryptoSwap: Constant Product and Constant Sum Market Maker with Dynamic Parameters”](../../../static/pdf/whitepapers/whitepaper_cryptoswap.pdf), published by Curve in 2021, and it marked Curve’s transition from being a purely stablecoin-focused AMM to a generalized DEX capable of efficiently trading volatile crypto pairs.


## How it Works

Cryptoswap is an automated market maker (AMM) pool developed by Curve for swapping between uncorrelated assets, such as `ETH` and `USDT`, where the exchange rate between these assets changes.

Cryptoswap pools build upon the core Stableswap algorithm, but with a key innovation: *where* liquidity is concentrated. Instead of targeting a fixed peg, Cryptoswap automatically concentrates and rebalances liquidity around the pool's **recent average price**.  This allows it to efficiently support **volatile asset pairs** (e.g., `crvUSD/ETH`) while making the entire process **fully passive for liquidity providers**.

## Parameters

This article from Nagaking goes into detail about each of Cryptoswap's parameters: [Deep Dive: Curve v2 Parameters](https://nagaking.substack.com/p/deep-dive-curve-v2-parameters).

The shape of the Liquidity Bonding Curve is governed by two parameters: `A` which is also present in Stableswap, as well as a new parameter called `gamma`:

- **`A`**: controls liquidity concentration in the center of the bonding curve
- **`gamma`**: controls whether liquidity drops off gradually or sharply away from the center of the bonding curve

Here is how they affect the curve in practice (note that orange curve are equal in both charts):

<figure>
  <ThemedImage
    alt="Michael Egorov invents Stableswap"
    sources={{
      light: require('@site/static/img/protocol/amm/a_and_gamma.png').default,
      dark: require('@site/static/img/protocol/amm/a_and_gamma.png').default,
    }}
    style={{ 
      width: "1000px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

As the image shows, a higher `A` means more liquidity is concentrated around the price at which it's balanced, called the `price_scale`.  Whereas a higher `gamma` means liquidity is spread wider.

## Rebalancing

Assets within Cryptoswap pools are volatile, so prices and exchange rates are constantly changing.  Cryptoswap's goal is to center most liquidity close to the current price, which allows more trading volume, and therefore more profit for LPs.  So, as prices move, the algorithm must re-center or "rebalance" its liquidity to follow it.  This process is handled carefully, because **rebalancing realizes impermanent loss**. To protect LPs, Cryptoswap only rebalances when two conditions are met:

1.  The internal price must move beyond a minimum threshold, known as the **adjustment step**.
2.  The cost of rebalancing must be less than 50% of the trading fees earned by LPs. **This core safeguard ensures that impermanent loss is only realized when it is sufficiently offset by trading profits**, helping to prevent the erosion of LP deposits from rebalancing fees over time.

!!! info "Internal EMA Price Oracle"
    For added safety, rebalances are triggered not by the last price of the pool, but by an **Exponential Moving Average** (EMA) of all recent prices. This internal price oracle helps prevent manipulation of rebalances.

    In the following examples, the EMA Price and current price are assumed to be the same. In reality, the EMA will lag the current price slightly.

Let's look at an example using a forex pool trading Euros (EUR) against US Dollars (USD):

<figure>
  <ThemedImage
    alt=""
    sources={{
      light: require('@site/static/img/protocol/amm/cryptoswap-rebalances.png').default,
      dark: require('@site/static/img/protocol/amm/cryptoswap-rebalances.png').default,
    }}
    style={{ 
      width: "1000px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

In this scenario, the pool performs a rebalance once the price hits the adjustment step, using up to 50% of its collected fees to cover the cost.  

## Why Does Rebalancing Cost?

Rebalancing costs because you are offering your assets to be swapped in return for trading fees.  As price increases, you are selling your assets.  When you rebalance, you are rebuying your assets, but at a higher price, causing a loss.  Let's look at a very simple example of a concentrated liquidity range AMM:

<figure>
  <ThemedImage
    alt=""
    sources={{
      light: require('@site/static/img/protocol/amm/rebalancing-loss.png').default,
      dark: require('@site/static/img/protocol/amm/rebalancing-loss.png').default,
    }}
    style={{ 
      width: "1000px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

This example highlights two important takeaways about rebalancing:

* If the user had not rebalanced, they would have kept their initial asset value.
* If the price continued to increase without a rebalance, the user's impermanent loss would have been larger, as they would need to buy back assets at an even higher price to re-enter the liquidity range.

!!! info "Cryptoswap Rebalancing"
    Rebalancing is necessary, but both frequent and infrequent rebalancing can lead to significant losses. 
    
    Cryptoswap automates this process to strike a balance, only rebalancing when two conditions are met:
    
    1. The price has changed more than the minimum amount
    2. The rebalance costs less than 50% of the profit earned from swaps  
  
    This ensures LPs remain profitable and minimizes rebalances, while maintaining high liquidity depth for swappers.

## Dynamic Fees

Cryptoswap and all new Stableswap pools feature **dynamic fees** that adjust to increase returns for LPs when their liquidity is in high demand.

For Cryptoswap pools, this works as follows:

<figure>
  <ThemedImage
    alt=""
    sources={{
      light: require('@site/static/img/protocol/amm/cryptoswap-dynamic-fees.png').default,
      dark: require('@site/static/img/protocol/amm/cryptoswap-dynamic-fees.png').default,
    }}
    style={{ 
      width: "1000px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

## Cryptoswap Benefits

**1. Passive LPing and Decentralization**

Cryptoswap was built on the original cypherpunk ethos of DeFi: that anyone should be able to provide liquidity easily, passively, and profitably. Compared to protocols that require LPs to become active managers, Cryptoswap's design allows for broader participation, increasing the resilience of the ecosystem.

**2. Automatic Impermanent Loss Management**

The algorithm is designed to protect LPs from rebalancing losses (as much as possible). By only rebalancing when the fees earned are **more than double the cost**, it ensures that the act of locking in impermanent loss is itself profitable. This prevents the pool from "chasing" the price at a loss to LPs.

**3. Capital Efficiency**

This efficiency stands in contrast to classic AMMs with the `x*y=k` invariant, which use the $x \cdot y = k$ formula. In those models, liquidity is spread thinly across all possible prices (from zero to infinity). By concentrating liquidity around the current market price, Cryptoswap offers significantly lower slippage for traders and generates more fees for LPs from the same amount of capital.

## Stale Pools - How Cryptoswap Pools Can Become Stuck

A Cryptoswap pool's main safety feature is its refusal to rebalance at a loss to LPs. However, this can sometimes cause a pool to become **stuck**, meaning it has a **stale liquidity concentration** because the last rebalance price (`price_scale`) is very different from the current price. This can trigger a negative feedback loop during periods of high volatility:

As the market price moves away from the pool's last rebalance price, the available liquidity for traders decreases. This leads to fewer swaps and, consequently, lower fee generation. Without enough profit from fees, the pool cannot afford to rebalance and follow the price, leaving its liquidity stranded.

<figure>
  <ThemedImage
    alt=""
    sources={{
      light: require('@site/static/img/protocol/amm/cryptoswap-stale-pools.png').default,
      dark: require('@site/static/img/protocol/amm/cryptoswap-stale-pools.png').default,
    }}
    style={{ 
      width: "1000px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>


## Monitoring Liquidity Balance within Pools

To see how balanced liquidity is within a pool, navigate to the pool's page, for example, the [EURe/USDC pool on Arbitrum](https://www.curve.finance/dex/arbitrum/pools/factory-twocrypto-89/deposit). At the bottom of the pool details, click the `Advanced` tab. You will then see the following details:

<figure>
  <ThemedImage
    alt=""
    sources={{
      light: require('@site/static/img/protocol/amm/price-scale.png').default,
      dark: require('@site/static/img/protocol/amm/price-scale.png').default,
    }}
    style={{ 
      width: "1000px",
      display: "block",
      margin: "0 auto"
    }}
  />
</figure>

In the image above, you can see two key parameters:

- **Price Scale**: This is the price at which liquidity was last rebalanced.
- **Price Oracle**: This is an Exponential Moving Average (EMA) of recent market prices. Rebalances are triggered by this price, not the current market price, which helps prevent manipulation of the rebalancing mechanism.

## How to Prevent Stale Liquidity within Pools

The best prevention for stale liquidity is **proper parameterization**.

Choosing a higher `gamma` and a lower `A` spreads liquidity across a wider price range. This makes a pool more resilient to volatility in two ways:

1.  It ensures the pool can continue to facilitate trades and earn fees even during large price swings.
2.  It makes the eventual rebalance cheaper because the liquidity is less concentrated.

For assistance with simulations to find reasonable parameters for your pool, refer to [Llamarisk](https://www.llamarisk.com/).

## Help! My Pool's Liquidity is Stale!

If your pool's liquidity becomes stale, you have three primary options:

1.  **Change Pool Parameters:** Through a DAO vote, parameters can be gradually changed (a process called "ramping"). Reducing `A` and adjusting `gamma` will spread out liquidity, adding depth at the current price. If parameterization was not the root cause, these parameters can be ramped back to their original values once the pool recovers.

2.  **Seed a New Pool:** This option is typically only viable for protocols that own most of the pool's liquidity (POL). It involves deploying a new pool with better parameters and "killing" the old gauge, if applicable.

3.  **Wash Trade the Pool:** This involves generating high trading volume (often via flash loans) to create enough fee profit for the pool to rebalance. This requires careful coding and simulation, and is performed at a loss with no guarantee of a lasting fix, as another market swing can immediately undo the rebalance. This strategy should only be considered as a last resort.

## Why Not Use Stableswap with an External Oracle?

Since Stableswap is highly efficient around a single price and can be guided by an external oracle, many developers have considered using this design to price volatile asset pairs against each other.

While some protocols have attempted this, and it can work (e.g., [Spectra](https://spectra.finance/)'s pools), there are a few important considerations:

* **Rebalancing Costs:** Every time the oracle pushes a new price, the pool is forced to rebalance. For volatile assets, these frequent rebalances can accumulate into significant losses for LPs. Profitability depends on trading fees being high enough, or LPs being subsidized in other ways, such as with token emissions. However, for low-volatility assets (even USD/EUR volatility is too high), this technique can work well.

* **Oracle Dependency:** This design requires a high-quality oracle. A malfunctioning, manipulated, or delayed oracle could report an incorrect price, leading to substantial losses for LPs.

In contrast, Cryptoswap's **profit-aware rebalancing mechanisms** are designed specifically to mitigate these risks for highly volatile asset pairs.
