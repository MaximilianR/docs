---
id: pool-parameters
title: Pool Parameters
sidebar_label: Pool Parameters
---

## Setting Parameters at Deployment

Pool parameters are set at the time of pool deployment, and most parameters can be changed by the DAO later through governance votes. This flexibility allows for parameter optimization as market conditions evolve and new data becomes available.

When deploying pools via the Curve UI, recommended parameters are automatically suggested based on the algorithm type and tokens used.

## Monitoring Parameters

Monitoring parameters is crucial for optimal pool performance. Depending on factors like market conditions, asset liquidity, trading volume, parameters can be optimized to help LPs earn more fees and provide better exchange rates for traders. Regular parameter adjustments ensure pools remain competitive and efficient.

:::info
**Struggling with parameters?** Don't worry, you're not alone! Jump into our <a href="https://t.me/curvefi" target="_blank" rel="noopener noreferrer">Telegram</a> and let the Curve wizards work their magic. From A to γ, we've got your back! 🧙‍♂️
:::

## Stableswap Parameters

| Name | Variable Name | Description |
| :--: | :-----------: | ----------- |
| Amplification coefficient | `A` | Controls liquidity concentration around the 1:1 price. Higher values reduce slippage near the peg, lower values spread liquidity more evenly. |
| Regular fee | `fee` | Trading fee charged on swaps |
| Off-peg fee multiplier | `offpeg_fee_multiplier` | Multiplier applied to fees when pool is imbalanced. The greater the imbalance, the higher the multiplier. More here: [Dynamic Fees](https://docs.curve.finance/stableswap-exchange/stableswap-ng/pools/overview/#dynamic-fees) |
| EMA time | `ma_exp_time` | Time constant for exponential moving average price oracle |

## Cryptoswap Parameters

CryptoSwap extends StableSwap by keeping **A** and adding parameters that adapt the curve and the fees to volatile assets.

| Name | Variable Name | Role |
|------|:------:|-------------------|
| Amplification coefficient | `A` | Same meaning as in StableSwap but now works together with γ to set the width of the "flat" region |
| Curve-width modifier | `γ` (gamma) | Controls how quickly the invariant transitions from flat to constant-product as balances diverge; smaller γ makes transition steeper |
| EMA half-life | `ma_time` | Time constant (in seconds) of the exponential moving average that tracks the market price |
| Allowed extra profit | `allowed_extra_profit` | Minimum theoretical arbitrage gain (in bp) before the contract updates its internal price scale, preventing micro-adjustments |
| Adjustment step | `adjustment_step` | Caps how much the price scale may move in a single block |
| Mid fee | `fee_mid` | Swap fee when the pool is perfectly balanced |
| Out fee | `out_fee` | Maximum fee charged at total imbalance |
| Fee gamma | `fee_gamma` | Governs how quickly the fee rises between `fee_mid` and `out_fee` as the pool leaves equilibrium |

## FXSwap Parameters

FXSwap parameters inherit the same ones as the Cryptoswap parameters above. Additionally, there are some governable parameters for the refuel (donation) mechanism:

| Name | Variable Name | Role |
|------|:------:|-------------------|
| Donation Duration | `donation_duration` | Time required for donations to fully unlock (default: 7 days) |
| Protection Period | `donation_protection_period` | Maximum duration donation protection can be extended (default: 10 minutes) |
| Protection LP Threshold | `donation_protection_lp_threshold` | LP addition threshold that triggers protection extension (default: 20%) |
| Maximum Donation Share Ratio | `donation_shares_max_ratio` | Cap on donation shares as percentage of total supply (default: 10%) |