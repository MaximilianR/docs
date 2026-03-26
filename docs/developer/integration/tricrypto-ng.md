---
title: Integrating Tricrypto-NG
sidebar_label: Tricrypto-NG
---

import ImplementationIndexer from '@site/src/components/ImplementationIndexer'

# Integrating Tricrypto-NG

Tricrypto-NG is Curve's AMM for trading **three volatile, uncorrelated assets** — the canonical example being ETH/BTC/USDT. Like Twocrypto-NG, it uses the **Cryptoswap invariant** with automatic liquidity concentration and rebalancing, but extended to three coins.

Key properties:

- **3 coins** per pool (always exactly 3)
- **Auto-rebalancing** — two internal `price_scale` values track coin prices relative to `coins[0]`
- **Native ETH support** — pools can wrap/unwrap WETH automatically via `use_eth` and `exchange_underlying`
- **The pool contract is the LP token** — ERC-20 compliant
- **No `exchange_received`** — uses `exchange_extended` with a callback pattern instead

:::info
All Tricrypto-NG pools are deployed via the **[Factory](https://etherscan.io/address/0x0c0e5f2fF0ff18a3be9b835635039256dC4B4963)** (`0x0c0e5f2fF0ff18a3be9b835635039256dC4B4963`). The Factory uses blueprint patterns — pool contracts are deployed as minimal proxies of stored implementations.
:::


---


## Pool Discovery

### Via the Factory

```solidity
// Get total number of pools
factory.pool_count() → uint256

// Get pool address by index
factory.pool_list(i: uint256) → address

// Find a pool for a specific token pair
factory.find_pool_for_coins(_from: address, _to: address, i: uint256) → address

// Get pool metadata
factory.get_coins(pool: address) → address[3]
factory.get_decimals(pool: address) → uint256[3]
factory.get_balances(pool: address) → uint256[3]
factory.get_coin_indices(pool: address, _from: address, _to: address) → (uint256, uint256)
factory.get_gauge(pool: address) → address
factory.get_market_counts(coin_a: address, coin_b: address) → uint256
```

### Via the MetaRegistry

The [MetaRegistry](./meta-registry.md) aggregates pools across all Curve Factory types:

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

Indices are `uint256` — values `0`, `1`, or `2`.


### Via the Views Contract

The Views contract (`0x064253915b8449fdEFac2c4A74aA9fdF56691a31`) provides pool-parameterized quotes and fee calculation helpers:

```solidity
// Standard quotes
views.get_dy(i: uint256, j: uint256, dx: uint256, swap: address) → uint256
views.get_dx(i: uint256, j: uint256, dy: uint256, swap: address) → uint256

// LP token calculations
views.calc_token_amount(amounts: uint256[3], deposit: bool, swap: address) → uint256
views.calc_withdraw_one_coin(token_amount: uint256, i: uint256, swap: address) → uint256

// Fee calculations (returns fee amount separately)
views.calc_fee_get_dy(i: uint256, j: uint256, dx: uint256, swap: address) → uint256
views.calc_fee_withdraw_one_coin(token_amount: uint256, i: uint256, swap: address) → uint256
views.calc_fee_token_amount(amounts: uint256[3], deposit: bool, swap: address) → uint256
```

The Views contract address is stored in the Factory and can be queried via `factory.views_implementation()`.


---


## Executing Swaps

### `exchange` — Standard Swap

Requires the caller to have approved the pool to spend the input token.

```solidity
pool.exchange(
    i: uint256,         // index of input coin (0, 1, or 2)
    j: uint256,         // index of output coin (0, 1, or 2)
    dx: uint256,        // amount of input coin to swap
    min_dy: uint256,    // minimum output (slippage protection)
    use_eth: bool,      // if true, wraps/unwraps native ETH (default: false)
    receiver: address   // recipient of output (defaults to msg.sender)
) → uint256            // actual output amount
```

The `use_eth` parameter controls native ETH handling:
- **`use_eth = false`** (default): swap operates on WETH like any other ERC-20
- **`use_eth = true`**: if sending ETH, pass it as `msg.value` instead of approving WETH; if receiving ETH, the pool unwraps WETH and sends native ETH to the receiver


### `exchange_underlying` — Native ETH Swap

A convenience function that always uses native ETH (equivalent to `exchange` with `use_eth = true`):

```solidity
pool.exchange_underlying(
    i: uint256,         // index of input coin
    j: uint256,         // index of output coin
    dx: uint256,        // amount of input coin
    min_dy: uint256,    // minimum output
    receiver: address   // recipient (defaults to msg.sender)
) → uint256            // actual output amount
```


### `exchange_extended` — Callback Swap

Designed for **aggregators and advanced integrators**. Supports a callback pattern where the pool calls back to the sender to request tokens:

```solidity
pool.exchange_extended(
    i: uint256,         // index of input coin
    j: uint256,         // index of output coin
    dx: uint256,        // amount of input coin
    min_dy: uint256,    // minimum output
    use_eth: bool,      // native ETH handling
    sender: address,    // address to pull tokens from
    receiver: address,  // recipient of output
    cb: bytes32         // callback identifier (0x00 = no callback)
) → uint256            // actual output amount
```

When `cb` is set to a non-zero value, the pool executes a callback to the `sender` address before pulling tokens, allowing the sender to source the input tokens just-in-time (e.g., from a flash loan or another pool).

:::warning[No `exchange_received`]
Unlike Stableswap-NG and Twocrypto-NG, Tricrypto-NG does **not** have `exchange_received()`. For approval-free swaps, use `exchange_extended` with the callback mechanism, or pre-approve the pool.
:::


---


## Fees

Tricrypto-NG uses the same **dynamic fee model** as Twocrypto-NG — two fee levels that blend based on pool imbalance:

```solidity
// Current effective fee (1e10 precision)
pool.fee() → uint256

// Fee bounds
pool.mid_fee() → uint256    // fee when trading near internal price (lower)
pool.out_fee() → uint256    // fee when trading far from internal price (higher)

// Fee blending parameter
pool.fee_gamma() → uint256

// Calculate fee for a given pool state
pool.fee_calc(xp: uint256[3]) → uint256
```

Fee precision is `1e10` — to get a percentage: `fee / 1e10 * 100`.

Unlike Twocrypto-NG where admin fees are claimed internally, Tricrypto-NG has an explicit admin fee claim function:

```solidity
pool.claim_admin_fees()  // callable by anyone
```


---


## Price Scale & Rebalancing

Tricrypto-NG tracks two price scales — one for each of `coins[1]` and `coins[2]` relative to `coins[0]`:

```solidity
// Internal price scale — prices the pool concentrates liquidity around
pool.price_scale(k: uint256) → uint256    // k=0: coins[1]/coins[0], k=1: coins[2]/coins[0]

// Last traded prices
pool.last_prices(k: uint256) → uint256

// EMA price oracle (manipulation-resistant)
pool.price_oracle(k: uint256) → uint256

// Price of LP token in terms of coins[0]
pool.lp_price() → uint256
```

The rebalancing parameters are the same as Twocrypto-NG:

```solidity
pool.adjustment_step() → uint256
pool.allowed_extra_profit() → uint256
pool.ma_time() → uint256
```


---


## Oracles

Each Tricrypto-NG pool provides built-in **exponential moving average (EMA)** oracles for two price pairs. For a full technical deep-dive, see the [Tricrypto-NG Oracle documentation](../amm/tricrypto-ng/pools/oracles.md).

```solidity
// EMA price of coins[k+1] in terms of coins[0]
pool.price_oracle(k: uint256) → uint256    // k=0 or k=1, 1e18 precision

// Last traded prices (spot)
pool.last_prices(k: uint256) → uint256

// LP token price in terms of coins[0]
// Formula: 3 × virtual_price × cbrt(price_oracle[0] × price_oracle[1]) / 1e24
pool.lp_price() → uint256
```

The EMA is calculated as: `EMA = last_spot × (1 - α) + prev_EMA × α`, where `α = e^(-Δt / ma_time)`. The smoothing window `ma_time` defaults to ~600 seconds. Spot prices are **capped at `2 × price_scale[k]`** per coin before entering the EMA.

**Update behavior:**
- Both price oracles share a **single timestamp** and update together, at most once per block
- Triggered by swaps, `add_liquidity`, and `remove_liquidity_one_coin` — but **not** by balanced `remove_liquidity`

:::info
Unlike Twocrypto-NG where `price_oracle()` takes no arguments, Tricrypto-NG's `price_oracle(k)` takes an index `k` because there are two independent price ratios to track (3 coins → 2 price pairs relative to `coins[0]`).
:::


---


## Useful Pool Getters

```solidity
// Token addresses (immutable)
pool.coins(i: uint256) → address    // i = 0, 1, or 2

// Pool balances (raw token amounts)
pool.balances(i: uint256) → uint256

// Token precisions (decimal normalization)
pool.precisions() → uint256[3]

// Amplification and gamma
pool.A() → uint256
pool.gamma() → uint256

// Virtual price (increases as fees accrue)
pool.get_virtual_price() → uint256

// D invariant
pool.D() → uint256

// Total LP supply
pool.totalSupply() → uint256

// Version
pool.version() → String    // "v2.0.0"
```


---


## Deployments & Pool Implementations

Tricrypto-NG is deployed across many chains. Select a chain below to view contract addresses and pool implementations.

All pools share the same interface. The Factory stores the current implementation blueprint at `pool_implementations(0)`. Pools are immutable once deployed — if the implementation is upgraded, only newly deployed pools use the new version.

:::info[Live Contract & Implementation Explorer]
This tool fetches contract addresses and pool implementations directly from the on-chain Factory contract. It queries `math_implementation()`, `views_implementation()`, and `gauge_implementation()` for infrastructure contracts, and scans `pool_implementations(idx)` for active pool blueprints. All calls are batched via [Multicall3](https://etherscan.io/address/0xcA11bde05977b3631167028862bE2a173976CA11) for efficiency. Results are cached in your browser — click **Refresh** to re-fetch. You can optionally provide a custom RPC URL if the default public endpoint is unreliable.

**Note:** Unlike Stableswap-NG, the Tricrypto-NG Factory does not expose a `get_implementation_address(pool)` getter — the implementation used by each individual pool cannot be queried on-chain. The tool can only show which implementations are currently set in the Factory, not which implementation a specific pool was deployed with.
:::

<ImplementationIndexer ammType="tricrypto-ng" />
