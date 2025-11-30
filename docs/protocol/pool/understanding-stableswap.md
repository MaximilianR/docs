---
title: Understanding Stableswap
sidebar_label: Understanding Stableswap
---

import ThemedImage from '@theme/ThemedImage'
import ThemedVideo from '@site/src/components/ThemedVideo';
import StableswapAmplificationChart from '@site/src/components/Charts/StableswapAmplification';
import StableswapDynamicFeeChart from '@site/src/components/Charts/StableswapDynamicFee';

## Historical Background

Curve’s Stableswap algorithm was invented by Michael Egorov, the founder of Curve, in November 2019.

It was introduced in the paper [“Stableswap: Efficient Mechanism for Stablecoin Liquidity”](../../../static/pdf/whitepapers/whitepaper_stableswap.pdf), which proposed a new type of Automated Market Maker (AMM) optimized for trading assets pegged to the same value — such as stablecoins (e.g., USDC/USDT) or tokenized versions of the same asset (e.g., wBTC/cbBTC).

The algorithm **combines features of both constant sum (fixed swap price) and constant product (`x*y=k`) curves**, allowing for **low-slippage trades near the peg while maintaining deep liquidity and arbitrage incentives when prices drift**.

:::info
In October 2023, the initial Stableswap implementation was reworked into **Stableswap-NG**, introducing crucial features to further enhance efficiency. More: [Evolution Stableswap-NG](#evolution-stableswap-ng)
:::

## How it Works

Stableswap was designed for pools of similarly priced assets, such as stablecoins of the same denomination (e.g., USD), to concentrate liquidity around their pegged price (e.g., USDC/USDT at 1.0). Unlike concentrated liquidity AMMs (CLAMMs) where liquidity providers must actively set price ranges, **Stableswap's liquidity concentration is fully passive** — users simply deposit tokens, and the protocol automatically concentrates liquidity around the peg through a **single continuous bonding curve**. No range management or active position adjustments are required.

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

Stableswap pools function effectively even when heavily imbalanced. Depending on the **Amplification Coefficient** (`A`), pools can maintain close to 1:1 pricing even under significant imbalance. If the imbalance causes a price deviation from the peg, it creates an arbitrage opportunity. This incentivizes traders to rebalance the pool, with each swap generating fees for liquidity providers (LPs).

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

## Supported Asset Types

Stableswap pools support up to 8 assets in a single pool. These can be a range of different types:

- **Standard**: Normal stable assets. For a USD pool, this includes tokens like crvUSD or USDC. For a BTC pool, this includes WBTC, tBTC, or cbBTC.
- **Rebasing**: Assets where yield is distributed by automatically increasing the token balance in the user's wallet (e.g., stETH).
- **Oracle**: Assets whose underlying value increases relative to the peg, utilizing an external oracle to track the exchange rate. This is used for yield-bearing assets that are not ERC-4626 vaults (e.g., wstETH).
- **ERC-4626**: Also known as **Tokenized Vaults**. These tokens increase in value over time and utilize the standard `convertToAssets` function to track value. They function similarly to Oracle assets but require no configuration due to their standardized structure.

Curve allows these different asset types to be integrated into a single pool seamlessly. For example, a valid pool could contain:

- WETH (Standard)
- stETH (Rebasing)
- wstETH (Oracle)
- sfrxETH (ERC-4626 vault)

This configuration creates a highly efficient Stableswap pool. The integration process is streamlined and can be performed directly via the official Curve UI.

---

## Parameters

### Amplification Coefficient

The shape of this liquidity bonding curve and the degree to which a pool can become imbalanced before the price significantly deviates from 1:1 is controlled by the **Amplification Coefficient** (`A`).

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

For a high-level understanding of `A`:

- **High `A` values** (e.g., 500–10,000) concentrate liquidity tightly around the peg. This provides deeper liquidity for swaps and allows pools to become very imbalanced before the price deviates significantly. The trade-off is that if an asset moves far from the peg, liquidity and pricing drop off sharply.
- **Lower `A` values** (e.g., 10–100) distribute liquidity more evenly. The price deviates more gradually from the peg as the pool becomes imbalanced, avoiding sharp cliffs.

By definition, the `A` parameter is a multiplier; it amplifies liquidity around the fair price (usually 1:1) compared to the [constant product formula (`x*y=k`)](https://www.reddit.com/r/ethereum/comments/55m04x/lets_run_onchain_decentralized_exchanges_the_way/). 

We can observe this behavior in a theoretical pool containing **crvUSD** (pegged at exactly $1.00) and **newUSD**, where the price of newUSD fluctuates based on the ratio of assets in the pool:

<StableswapAmplificationChart />

### Offpeg Fee Multiplier & Dynamic Fees

The **Offpeg Fee Multiplier increases the pool swapping fee if the pool becomes imbalanced** (e.g., 90% newUSD and 10% crvUSD). The concept is straightforward:

- When pools become imbalanced, liquidity is in high demand, and LPs should be rewarded for remaining in the pool.
- Swaps that increase the imbalance should incur a higher fee than swaps that rebalance the pool.

The Offpeg Fee Multiplier represents the maximum factor by which the base fee can be multiplied. The **dynamic fee is calculated based on the average balance of the pool before and after the swap**; consequently, it is cheaper to perform a swap that balances the pool compared to one that increases imbalance.

The chart below demonstrates how this mechanism functions. Note that base fees and offpeg multipliers are fully customizable; the examples below illustrate a range of potential configurations:

<StableswapDynamicFeeChart />

---

## Vault Assets & Assets with Oracles

These asset types are to allow the assets with underlying accruing interest to be added and work natively in a Stableswap pool.  The vault or oracle let's the pool know the true value of the underlying asset against other assets in the pool, so as it accrues interest, the pool stays balanced around the true value price of each asset.

Tho achieve this, the Stablswap pool needs to shift it's center of liquidity (balanced price) over time as the oracle or vault asset accrues interest.  Let's have a look at how Stableswap deals with this in practice.  Here is the live [crvUSD/sUSDe pool](https://www.curve.finance/dex/ethereum/pools/factory-stable-ng-169/deposit) over the past year, note how as the fundamental value of sUSDe increases, Stableswap changes the center of liquidity to this new price:

<figure>
  <ThemedVideo
    alt="crvUSD-sUSDe Pool"
    sources={{
      light: require('@site/static/img/protocol/amm/stableswap-changing-center.mp4').default,
      dark: require('@site/static/img/protocol/amm/stableswap-changing-center.mp4').default,
    }}
    style={{ maxWidth: '960px', width: '100%', display: 'block', margin: '0 auto' }}
  />
</figure>

### Oracle Specification

While ERC-4626 vaults configure their oracles automatically, the **Oracle** asset type requires manual setup. This allows any token to be used, provided an accompanying oracle can be specified that reports the asset's value relative to the pool's base unit (must be 18 decimals).

For example, in a WETH/wstETH pool, the oracle reads the `stEthPerToken()` function. This tells the pool that 1 wstETH is currently worth ~1.12 ETH, ensuring the pool balances liquidity around 1.12 rather than 1.0.

**Configuration Example (wstETH):**

- **Token**: [0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0](https://etherscan.io/token/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0) - wstETH token contract
- **Oracle**: [0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0](https://etherscan.io/token/0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0) - also wstETH token contract because the oracle is in the same contract (internal)
- **Function**: stEthPerToken() - This function shows the value of 1 wstETH as stETH

**Notable Scenarios:**

- **ERC-4626 + Oracle:** If pairing an ERC-4626 vault (e.g., sfrxETH) with an Oracle asset (e.g., wstETH), the Oracle asset must normalize its price to the underlying base unit (1 ETH) to match the vault's behavior.
- **Oracle + Oracle:** If pairing two Oracle assets (e.g., rETH and wstETH), it is best practice to normalize both to the underlying base unit (e.g., 1 ETH, 1 USD, etc), though direct conversion oracles are possible.

### Oracle Limitations

Since Stableswap is highly efficient around a single price and can be guided by an external oracle, many developers have considered using this design to price volatile asset pairs (e.g., Forex pools like EUR/USD).

While some protocols have attempted this, and it can be successful (e.g., [Spectra](https://www.spectra.finance/)), there are important considerations detailed below. We recommend investigating [Cryptoswap](understanding-cryptoswap.md) and [FXSwap](understanding-fxswap.md) pools, as they were created to directly address these use cases.

#### **Every oracle update changes pool balance**

Every time the oracle pushes a new price, the center of liquidity changes, creating imbalances in the pool, these imbalances mean assets get sold at discounts, causing losses for LPs. For volatile assets, these frequent changes can accumulate into significant losses for LPs. For LPs to be profitable, you need either:

1. Very low volatility assets (yield-bearing assets), e.g., scrvUSD, sUSDS, wstETH.
2. Extra incentives to offset any LP losses. If considering this route, please look into [FXSwap](understanding-fxswap.md).

#### **Oracle Dependency**

This design requires a high-quality oracle. A malfunctioning, manipulated, or delayed oracle could report an incorrect price, leading to substantial losses for LPs.

---

## Evolution: Stableswap-NG

**Stableswap-NG** ("Next Generation") is the updated implementation of the Stableswap algorithm, deployed in late October 2023. This version introduces several architectural improvements while maintaining the core invariant logic.

**Key Improvements:**

* **Expanded Pool Capacity:** Pools can now support up to **8 tokens** (previously limited to 4 in many factory implementations).
* **New Asset Types:** Native support was added for **ERC-4626** vaults (e.g., sDAI) and **Oracle-based** tokens (e.g., wstETH), simplifying the integration of yield-bearing assets.
* **WETH Enforcement:** The protocol removed support for raw ETH to eliminate specific read-only reentrancy vectors. All ETH pools now strictly utilize **WETH** to ensure maximum security.
* **Dynamic Fees:** The implementation includes the **Offpeg Fee Multiplier** logic natively, allowing fees to scale based on pool imbalance.
* **EMA Oracles:** Pools now include built-in, manipulation-resistant Exponential Moving Average (EMA) oracles, allowing other protocols to safely query the pool's price.

---

## Mathematical Foundation

Stableswap's bonding curve is a sophisticated **combination of a linear invariant and a constant product invariant**. Understanding these building blocks helps explain how Stableswap achieves low slippage for similarly-priced assets.

A linear invariant is described as $x + y = C$, where $x$ and $y$ are pooled tokens and $C$ is the invariant constant. This formula is known as the **constant sum formula** and produces a linear straight line when graphed. The key property is that **the price remains constant regardless of pool balances**, resulting in zero slippage. However, this also means pools can be completely drained of one asset.

The Uniswap AMM uses a constant product invariant: $x \cdot y = k$, where $x$ and $y$ are pooled tokens and $k$ is the invariant constant. This formula ensures there is always liquidity available, but the price changes with each trade, resulting in slippage that increases as the pool becomes more imbalanced.

Stableswap combines both invariants to get the benefits of low slippage near the peg while maintaining liquidity protection. The initial combination is:

$$
(x + y) + (x \cdot y) = D + \left(\frac{D}{n}\right)^n
$$

where $D$ is the total value of tokens in the pool and $n$ is the number of tokens (typically 2 for a two-token pool).


However, this basic combination doesn't provide enough amplification. To make the curve more effective, the sum invariant needs to be multiplied by an amplification factor $\chi$:

$$
\chi(x + y) + (x \cdot y) = \chi D + \left(\frac{D}{n}\right)^n
$$

The multiplier $\chi$ amplifies the low-slippage portion of the equation, making the bonding curve more linear when pools are balanced.

The amplification factor $\chi$ is not constant but dynamically adjusts based on the pool's balance:

$$
\chi = \frac{A \cdot x \cdot y}{\left(D/n\right)^n}
$$

where $A$ is the fixed **amplification coefficient** parameter. When pools are **balanced** (e.g., $x = 50$, $y = 50$), $\chi = A$, maximizing the linear behavior. When pools are **unbalanced**, $\chi$ decreases, causing the curve to behave more like the constant product formula. As pools become more unbalanced, $\chi \rightarrow 0$, and the curve approaches $x \cdot y = k$.

Substituting the dynamic $\chi$ into the combined invariant and simplifying, we arrive at the final Stableswap equation:

$$
\boxed{An^n\sum x_i + D = ADn^n + \frac{D^{n+1}}{n^n \prod x_i}}
$$

For a two-token pool ($n=2$), this becomes:

$$
4A(x + y) + D = 4AD + \frac{D^3}{4xy}
$$

This equation ensures **low slippage** when pools are balanced (high $\chi$), **liquidity protection** when pools are imbalanced (low $\chi$, approaching constant product), and a **smooth transition** between these two behaviors based on the pool's balance. The amplification coefficient $A$ is a protocol parameter that controls how tightly liquidity is concentrated around the peg. Higher values of $A$ create a flatter curve (more linear) when balanced, while lower values create a more gradual transition to the constant product curve.


## Mathematical Foundation

Stableswap's bonding curve is a sophisticated **combination of a linear invariant and a constant product invariant**. Understanding these building blocks explains how Stableswap achieves low slippage for similarly-priced assets.

**1. The Constant Sum Invariant (Zero Slippage)**
The constant sum invariant is described as $x + y = C$.
This produces a straight line when graphed. The price is constant regardless of the balances, offering **zero slippage**. However, this model is unsafe because the pool can easily be drained of one asset if the market price changes even slightly.

**2. The Constant Product Invariant (Infinite Liquidity)**
The constant product invariant (used by Uniswap V2) is described as $x \cdot y = k$.
This produces a convex curve. It ensures liquidity is always available (the pool cannot be drained), but **slippage increases significantly** as the pool becomes imbalanced.

**3. The Stableswap Invariant**
Stableswap combines these two concepts. It acts like a Constant Sum curve when the pool is balanced (providing low slippage) and shifts toward a Constant Product curve if the pool becomes imbalanced (protecting liquidity).

The initial combination of these invariants is:

$$
(x + y) + (x \cdot y) = D + \left(\frac{D}{n}\right)^n
$$

Where:
* $D$: Total amount of coins when they have an equal price.
* $n$: Number of coins in the pool.

To control the "flatness" of the curve, we introduce the **Amplification Coefficient** ($A$). This parameter acts as a multiplier ($\chi$) on the Constant Sum portion of the equation:

$$
\chi(x + y) + (x \cdot y) = \chi D + \left(\frac{D}{n}\right)^n
$$

The multiplier $\chi$ is dynamic. It is defined as $\chi = \frac{A \cdot x \cdot y}{(D/n)^n}$.
* When the pool is **balanced**, $\chi$ is high, pushing the curve toward the linear Constant Sum model.
* When the pool is **imbalanced**, $\chi$ approaches 0, reducing the equation to the Constant Product model.

Substituting $\chi$ into the invariant yields the final **Stableswap Invariant**:

$$
\boxed{An^n\sum x_i + D = ADn^n + \frac{D^{n+1}}{n^n \prod x_i}}
$$

For a standard two-token pool ($n=2$), this simplifies to:

$$
4A(x + y) + D = 4AD + \frac{D^3}{4xy}
$$

A visualization of Curve's Stableswap vs. constant sum and constant product can be seen below:

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
