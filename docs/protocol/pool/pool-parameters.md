---
title: Curve Pool Parameters
---


## Stableswap Parameters

| Name | Symbol | Role in invariant |
|------|--------|-------------------|
| Amplification coefficient | **A** | Scales the constant-sum component of the invariant. In a perfectly balanced pool, the effective leverage factor equals **A**, flattening the curve and reducing slippage around the 1 : 1 price. As the pool drifts from parity, the factor decays toward 0, so the curve gradually morphs back into constant-product. |

> On-chain the contract stores `A × nⁿ` (where *n* is the number of coins) to preserve precision when working with integers.

## Cryptoswap Parameters

CryptoSwap extends StableSwap by keeping **A** and adding parameters that adapt the curve and the fees to volatile assets.

### Bonding-curve parameters

| Name | Symbol | Role |
|------|--------|------|
| Amplification coefficient | **A** | Same meaning as in StableSwap but now works together with γ to set the width of the “flat” region. |
| Curve-width modifier | **γ** (`gamma`) | Controls how quickly the invariant transitions from flat to constant-product as balances diverge; a smaller γ makes the transition steeper. |

### Price-scaling (internal oracle) parameters

| Name | Field | Role |
|------|-------|------|
| EMA half-life | `ma_time` | Time constant (in seconds) of the exponential moving average that tracks the market price. |
| Allowed extra profit | `allowed_extra_profit` | Minimum theoretical arbitrage gain (in bp) before the contract updates its internal price scale, preventing micro-adjustments. |
| Adjustment step | `adjustment_step` | Caps how much the price scale may move in a single block. |

### Fee-curve parameters

| Name | Field | Role |
|------|-------|------|
| Mid fee | `fee_mid` | Swap fee when the pool is balanced. |
| Out fee | `out_fee` | Maximum fee charged at extreme imbalance. |
| Fee gamma | `fee_gamma` | Governs how quickly the fee rises between `fee_mid` and `out_fee` as the pool leaves equilibrium. |

### Parameter interaction

When the pool is balanced, the dynamic leverage factor simplifies to **A**; as imbalance grows, the factor collapses approximately with `γ²`, causing the invariant to converge to constant-product.

## FXSwap Parameters