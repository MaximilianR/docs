---
title: Integrating Twocrypto-NG
sidebar_label: Twocrypto-NG
---

import ImplementationIndexer from '@site/src/components/ImplementationIndexer'

# Integrating Twocrypto-NG

Twocrypto-NG is Curve's AMM for trading **volatile and uncorrelated asset pairs** — e.g., ETH/USDC, TOKEN/ETH, or any two tokens that are not expected to maintain a fixed price ratio. It uses the **Cryptoswap invariant**, which automatically concentrates liquidity around the current market price and rebalances as prices move.

Key properties:

- **2 coins** per pool (always exactly 2)
- **Auto-rebalancing** — the pool's internal `price_scale` adjusts to track the market price, keeping liquidity concentrated without LP intervention
- **The pool contract is the LP token** — ERC-20 compliant, no separate LP token contract
- **Admin fees are hardcoded at 50%** of trading fees, claimed internally (no external claim function)

:::info
All Twocrypto-NG pools are deployed via the **[Factory](https://etherscan.io/address/0x98EE851a00abeE0d95D08cF4CA2BdCE32aeaAF7F)** (`0x98EE851a00abeE0d95D08cF4CA2BdCE32aeaAF7F`). The Factory uses blueprint patterns — pool contracts are deployed as minimal proxies of stored implementations.
:::


---


## Pool Discovery

### Via the Factory

The Factory maintains a registry of all deployed Twocrypto-NG pools.

```solidity
// Get total number of pools
factory.pool_count() → uint256

// Get pool address by index (returns from a dynamic array)
factory.pool_list(i: uint256) → address

// Find a pool for a specific token pair
// Use i=0 for first match, i=1 for second, etc.
factory.find_pool_for_coins(_from: address, _to: address, i: uint256) → address

// Get pool metadata
factory.get_coins(pool: address) → address[2]
factory.get_decimals(pool: address) → uint256[2]
factory.get_balances(pool: address) → uint256[2]
factory.get_gauge(pool: address) → address
factory.get_implementation(pool: address) → address
```

### Via the MetaRegistry

The [MetaRegistry](./meta-registry.md) aggregates pools across all Curve Factory types. If you want to find the best pool for a pair regardless of AMM type:

```solidity
metaRegistry.find_pool_for_coins(_from: address, _to: address, i: uint256) → address
```


---


## Quoting Swap Amounts

### On the Pool

```solidity
// How much of coin `j` will I get for `dx` of coin `i`?
pool.get_dy(i: uint256, j: uint256, dx: uint256) → uint256

// How much of coin `i` do I need to send to get `dy` of coin `j`?
pool.get_dx(i: uint256, j: uint256, dy: uint256) → uint256
```

:::warning[Coin Indices]
Twocrypto-NG uses **`uint256`** for coin indices (unlike Stableswap-NG which uses `int128`). Indices are `0` and `1`.
:::


### Via the Views Contract

The Views contract (`0x07CdEBF81977E111B08C126DEFA07818d0045b80`) provides the same quoting functions parameterized by pool address, plus fee calculation helpers:

```solidity
// Standard quotes
views.get_dy(i: uint256, j: uint256, dx: uint256, swap: address) → uint256
views.get_dx(i: uint256, j: uint256, dy: uint256, swap: address) → uint256

// LP token calculations
views.calc_token_amount(amounts: uint256[2], deposit: bool, swap: address) → uint256
views.calc_withdraw_one_coin(token_amount: uint256, i: uint256, swap: address) → uint256

// Fee calculations (returns fee amount separately)
views.calc_fee_get_dy(i: uint256, j: uint256, dx: uint256, swap: address) → uint256
views.calc_fee_withdraw_one_coin(token_amount: uint256, i: uint256, swap: address) → uint256
views.calc_fee_token_amount(amounts: uint256[2], deposit: bool, swap: address) → uint256
```

The Views contract address is stored in the Factory and can be queried via `factory.views_implementation()`.


---


## Executing Swaps

### `exchange` — Standard Swap

Requires the caller to have approved the pool to spend the input token.

```solidity
pool.exchange(
    i: uint256,         // index of input coin (0 or 1)
    j: uint256,         // index of output coin (0 or 1)
    dx: uint256,        // amount of input coin to swap
    min_dy: uint256,    // minimum output (slippage protection)
    receiver: address   // recipient of output (defaults to msg.sender)
) → uint256            // actual output amount
```


### `exchange_received` — Approval-Free Swap

Designed for **aggregators and smart contract integrators**. The caller sends tokens to the pool first, then calls `exchange_received()` — the pool detects the balance increase and executes the swap.

```solidity
pool.exchange_received(
    i: uint256,         // index of input coin (0 or 1)
    j: uint256,         // index of output coin (0 or 1)
    dx: uint256,        // expected amount of input coin (already sent)
    min_dy: uint256,    // minimum output (slippage protection)
    receiver: address   // recipient of output (defaults to msg.sender)
) → uint256            // actual output amount
```

**Flow:**
1. Transfer `dx` of `coins[i]` directly to the pool address
2. Call `exchange_received()`
3. Pool detects the balance increase, executes the swap, sends output to `receiver`

This saves one ERC-20 approval and is gas-efficient when chaining swaps across multiple protocols.

:::abstract[Article]
For a deeper dive into `exchange_received`, including efficiency benefits, security considerations, and practical integration examples, see: [How to Do Cheaper, Approval-Free Swaps](https://blog.curvemonitor.com/posts/exchange-received/).
:::


---


## Fees

Twocrypto-NG uses a **dynamic fee model** with two fee levels that blend based on how far the trade pushes the pool away from its internal price scale:

```solidity
// Current effective fee for the pool's state (1e10 precision)
pool.fee() → uint256

// The two fee bounds
pool.mid_fee() → uint256    // fee when trading near the internal price (lower)
pool.out_fee() → uint256    // fee when trading far from the internal price (higher)

// Fee blending parameter
pool.fee_gamma() → uint256

// Calculate fee for a given pool state
pool.fee_calc(xp: uint256[2]) → uint256
```

The fee precision is `1e10` — to get a percentage: `fee / 1e10 * 100`. For example, a `fee()` return value of `3000000` means 0.03% (3 bps).

The dynamic fee interpolates between `mid_fee` and `out_fee` based on how imbalanced the pool is relative to its price scale. Trades that push the pool further from equilibrium pay closer to `out_fee`; trades that bring it back pay closer to `mid_fee`.

Admin fees are **hardcoded at 50%** and are claimed internally — there is no external function to claim admin fees. Fees are collected when liquidity is removed single-sidedly via `remove_liquidity_one_coin()`.


---


## Price Scale & Rebalancing

Unlike Stableswap (which assumes assets trade near 1:1), Twocrypto-NG tracks the market price of `coins[1]` relative to `coins[0]` via an internal **price scale**:

```solidity
// Internal price scale — the price the pool concentrates liquidity around
pool.price_scale() → uint256    // 1e18 precision

// Last traded price
pool.last_prices() → uint256

// EMA price oracle (manipulation-resistant)
pool.price_oracle() → uint256

// Price of LP token in terms of coins[0]
pool.lp_price() → uint256
```

The pool continuously adjusts `price_scale` toward `price_oracle` based on profits. This rebalancing is controlled by:

```solidity
pool.adjustment_step() → uint256    // minimum price scale adjustment
pool.allowed_extra_profit() → uint256  // profit threshold before rebalancing
pool.ma_time() → uint256           // EMA oracle half-time (seconds)
```


---


## Oracles

Each Twocrypto-NG pool provides built-in **exponential moving average (EMA)** oracles. For a full technical deep-dive, see the [Twocrypto-NG Oracle documentation](../amm/twocrypto-ng/pools/oracles.md).

```solidity
// EMA price of coins[1] in terms of coins[0]
pool.price_oracle() → uint256    // 1e18 precision

// Last traded price (spot, from most recent swap)
pool.last_prices() → uint256

// LP token price in terms of coins[0]
// Formula: 2 × virtual_price × sqrt(price_oracle) / 1e18
pool.lp_price() → uint256
```

The EMA is calculated as: `EMA = last_spot × (1 - α) + prev_EMA × α`, where `α = e^(-Δt / ma_time)`. The smoothing window `ma_time` defaults to ~601 seconds. Spot prices are **capped at `2 × price_scale`** before entering the EMA to limit manipulation.

**Update behavior:**
- EMA values update **at most once per block**
- Triggered by swaps, `add_liquidity`, and `remove_liquidity_one_coin` — but **not** by balanced `remove_liquidity`
- The pool also maintains an **XCP oracle** (`xcp_oracle()`) representing estimated TVL, with a longer smoothing window (~62,324 seconds)

:::info
Unlike Stableswap-NG where `price_oracle(i)` takes an index parameter, Twocrypto-NG's `price_oracle()` takes **no arguments** — it always returns the price of `coins[1]` relative to `coins[0]` (since there are only 2 coins).
:::


---


## Pool Parameters

Cryptoswap pools have more parameters than Stableswap pools. Key ones for integrators:

```solidity
// Amplification and gamma — control curve shape
pool.A() → uint256          // amplification parameter
pool.gamma() → uint256      // controls the width of the concentrated liquidity region

// Virtual price (increases monotonically as fees accrue, useful for LP pricing)
pool.get_virtual_price() → uint256

// D invariant
pool.D() → uint256

// Token precisions (scaling factors for decimal normalization)
pool.precisions() → uint256[2]
```


---


## Useful Pool Getters

```solidity
// Token addresses
pool.coins(i: uint256) → address    // i = 0 or 1

// Pool balances (raw token amounts)
pool.balances(i: uint256) → uint256

// Total LP token supply
pool.totalSupply() → uint256

// Version
pool.version() → String    // "v2.1.0"
```


---


## Deployments & Pool Implementations

Twocrypto-NG is deployed across many chains. Select a chain below to view contract addresses and pool implementations.

All pools share the same interface. The Factory stores the current implementation blueprint at `pool_implementations(0)`. Pools are immutable once deployed — if the implementation is upgraded, only newly deployed pools use the new version.

:::info[Live Contract & Implementation Explorer]
This tool fetches contract addresses and pool implementations directly from the on-chain Factory contract. It queries `math_implementation()`, `views_implementation()`, and `gauge_implementation()` for infrastructure contracts, and scans `pool_implementations(idx)` for active pool blueprints. All calls are batched via [Multicall3](https://etherscan.io/address/0xcA11bde05977b3631167028862bE2a173976CA11) for efficiency. Results are cached in your browser — click **Refresh** to re-fetch. You can optionally provide a custom RPC URL if the default public endpoint is unreliable.

**Note:** Unlike Stableswap-NG, the Twocrypto-NG Factory does not expose a `get_implementation_address(pool)` getter — the implementation used by each individual pool cannot be queried on-chain. The tool can only show which implementations are currently set in the Factory, not which implementation a specific pool was deployed with.
:::

<ImplementationIndexer ammType="twocrypto-ng" />
