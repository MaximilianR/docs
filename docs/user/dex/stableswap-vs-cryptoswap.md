---
id: stableswap-vs-cryptoswap
title: Stableswap and Cryptoswap Pools
sidebar_label: Stableswap vs Cryptoswap
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';


Curve utilizes two specialized algorithms for its liquidity pools: **Stableswap** and **Cryptoswap**. Each is engineered to provide the best possible trading experience and returns for different types of crypto assets.

Here’s a quick comparison:

| Feature | Stableswap Pools | Cryptoswap Pools |
| :--- | :--- | :--- |
| **Asset Type** | Pegged-value assets (e.g., USDC/USDT, stETH/ETH), or stable assets with underlying yield (e.g., scrvUSD/USDT). | Volatile, uncorrelated assets (e.g., ETH/WBTC`, `WBTC/crvUSD). |
| **Number of Assets** | At least 2, with maximum of 8 | 2 or 3 |
| **Primary Goal** | Ultra-low slippage for assets that trade near a fixed ratio (usually 1:1). | Efficiently trade volatile assets while protecting LPs and maintaining pool balance. |
| **Mechanism** | Concentrates liquidity around a fixed peg (e.g., 1:1). The pool can become unbalanced (e.g., 90% USDC, 10% USDT) and still function efficiently, relying on arbitrage to restore balance. | Balances and concentrates liquidity around current price, with equal value in each asset.  If prices change, it automatically rebalances liquidity if LP have generated enough to stay profitable. |
| **LP Strategy** | **Fully Passive.** LPs provide liquidity across the entire price range. This "set and forget" model contrasts with AMMs that require active management of liquidity positions. | **Fully Passive.** The algorithm automatically manages liquidity concentration and rebalancing, using accrued trading fees to cover the costs. |


## Stableswap Pools

The Stableswap algorithm is Curve's original innovation and the foundation of the protocol. It's designed to facilitate swaps between assets that are pegged to the same value, like two different stablecoins or a liquid staking derivative and its underlying asset.

The primary advantage is **incredibly deep liquidity** around the peg. This means traders can execute massive swaps with minimal price impact (slippage). For instance, in a healthy $20M USDC/USDT pool, a $1M swap would likely incur less than 0.01% slippage (receive $999.9k after swapping), making it one of the most capital-efficient platforms for stable assets.

A key feature of Stableswap pools is that they are **fully passive**. Unlike most other AMMs where LPs must actively manage their price ranges, Curve LPs can simply deposit their assets and earn fees without further intervention. The pool provides liquidity across all possible prices, though it's most concentrated at the peg.

### Types of Assets in Stableswap Pools

Stableswap pools can handle a few different types of assets:

* **Pegged Assets**: Tokens that should trade at a 1:1 ratio, such as crvUSD/USDT or stETH/ETH.
* **Yield-Bearing Assets**: Assets that gradually appreciate against a base asset due to underlying yield, like sUSDe/USDT. The Stableswap math handles this slow-changing ratio gracefully.
* **Constant Ratio Assets**: A less common but powerful use case. For example, two tokenized gold assets for different weights, kgGOLD and ozGOLD, where 1 kgGOLD is always worth about 35 times more than 1 ozGOLD (1 kilogram (kg) = 35 ounces (oz)).

It's important to note that Stableswap pools are designed for these specific types of assets. Trying to use them for things they weren't designed for, like a forex pair (USDC and EURC), is a bad idea and can cause LPs to lose a lot of money. Cryptoswap was created to solve this very problem.

**Important Note:** Stableswap pools assume the peg is stable. If an asset permanently depegs or is exploited, LPs can incur significant losses as they will be left holding the devalued asset.

### How Providing Liquidity Works

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Being an LP in a Stableswap pool"
    sources={{
      light: require('@site/static/img/user/dex/dex-stableswap-depositing-withdrawing-light.png').default,
      dark: require('@site/static/img/user/dex/dex-stableswap-depositing-withdrawing-dark.png').default,
    }}
    style={{
      maxWidth: '800px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

### How does Stableswap Work?

The magic of Stableswap is its liquidity concentration. Let's visualize a crvUSD/USDC pool where each block represents \$1M of liquidity:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Swapping in a Stableswap pool"
    sources={{
      light: require('@site/static/img/user/dex/stableswap-swap-light.png').default,
      dark: require('@site/static/img/user/dex/stableswap-swap-dark.png').default,
    }}
    style={{
      maxWidth: '1400px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

In this example most of the pool's liquidity (e.g., \$40M out of \$80M total) is concentrated in a very tight range around the \$1.00 price.

1.  A user wants to swap \$20M USDC for crvUSD.
2.  The swap executes with extremely low slippage, and the user receives back about 19.98M crvUSD
3.  The pool collects trading fees on the swap. With a 0.01% fee, the total fee is 20,000,000 * 0.0001 = 2,000 crvUSD. This is typically split 50/50 between LPs and the Curve DAO.
4.  The pool is now imbalanced. This creates an **arbitrage opportunity**: traders are now incentivized to swap crvUSD back into the pool to get USDC at a slight discount, which naturally pushes the pool back toward a 50/50 balance.

---

## Cryptoswap Pools

Cryptoswap pools are Curve's solution for trading any pair of assets with **volatile or uncorrelated prices**. This includes everything from blue-chips like ETH/WBTC to forex pairs like EURC/USDC or a project's native token against ETH.

Unlike Stableswap, the Cryptoswap algorithm does not assume a fixed peg. Instead, its goal is to keep the **value of each asset in the pool balanced** (e.g., 50% ETH and 50% USDT by value). It achieves this through a novel internal oracle and an automated rebalancing mechanism.

Like their Stableswap counterparts, Cryptoswap pools are **fully passive and full-range**, making them simple and accessible for all LPs.

### How Providing Liquidity Works

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Being an LP in a Cryptoswap pool"
    sources={{
      light: require('@site/static/img/user/dex/dex-cryptoswap-depositing-withdrawing-light.png').default,
      dark: require('@site/static/img/user/dex/dex-cryptoswap-depositing-withdrawing-dark.png').default,
    }}
    style={{
      maxWidth: '800px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

### How Cryptoswap Works: Concentrating and Rebalancing

At its core, a Cryptoswap pool functions like a Stableswap pool concentrated around the last rebalance price. As traders swap back and forth, the pool earns fees.

However, when the market price of the assets drifts significantly, the pool must move its liquidity concentration to match the new price. This is called **rebalancing**. To ensure this process is always profitable for LPs, it only happens if two conditions are met:

1.  **Minimum Step**: The price must move more than a set minimum amount (e.g., 0.5%). This prevents constant, unnecessary rebalancing in a choppy market. It is set by the `adjustment_step` parameter.
2.  **Profitability Check**: The pool must have accrued enough trading fees to ensure the recent profits from swaps are more than double the cost of rebalancing.  This guarantees that rebalancing doesn't cause a net loss for LPs.

Let's look at a simple USD/EUR forex pool example:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Cryptoswap Rebalances"
    sources={{
      light: require('@site/static/img/user/dex/cryptoswap-rebalances-light.png').default,
      dark: require('@site/static/img/user/dex/cryptoswap-rebalances-dark.png').default,
    }}
    style={{
      maxWidth: '1200px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>