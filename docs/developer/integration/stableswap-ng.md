---
title: Integrating Stableswap-NG
sidebar_label: Stableswap-NG
---

import ImplementationIndexer from '@site/src/components/ImplementationIndexer'

# Integrating Stableswap-NG

Stableswap-NG is Curve's AMM for trading **pegged and correlated assets** — stablecoins (USDC/USDT), liquid staking tokens (wstETH/ETH), yield-bearing tokens (sDAI), and other assets expected to trade near a fixed ratio. Pools support 2–8 coins.

There are two pool types:

- **Plain pools** — all coins are top-level ERC-20 tokens (e.g., USDC/USDT/DAI)
- **Metapools** — one coin paired against an existing Curve base pool's LP token (e.g., newStable/3CRV), enabling swaps with all underlying base pool tokens

Both share the same swap interface. Metapools add `exchange_underlying()` for direct swaps into base pool tokens.

:::info
All Stableswap-NG pools are deployed via the **[Factory](https://etherscan.io/address/0x6A8cbed756804B16E05E741eDaBd5cB544AE21bf)** (`0x6A8cbed756804B16E05E741eDaBd5cB544AE21bf`). The Factory uses blueprint patterns — pool contracts are deployed as minimal proxies of stored implementations.
:::


---


## Pool Discovery

### Via the Factory

The Factory maintains a registry of all deployed Stableswap-NG pools.

```solidity
// Get total number of pools
factory.pool_count() → uint256

// Get pool address by index
factory.pool_list(i: uint256) → address

// Find a pool for a specific token pair
// Use i=0 for first match, i=1 for second, etc.
factory.find_pool_for_coins(_from: address, _to: address, i: uint256) → address

// Get pool metadata
factory.get_coins(pool: address) → address[]
factory.get_n_coins(pool: address) → uint256
factory.get_balances(pool: address) → uint256[]
factory.get_decimals(pool: address) → uint256[]
factory.is_meta(pool: address) → bool
factory.get_pool_asset_types(pool: address) → uint8[]
factory.get_implementation_address(pool: address) → address
```

### Via the MetaRegistry

The [MetaRegistry](./meta-registry.md) aggregates pools across all Curve Factory types (Stableswap-NG, Twocrypto-NG, Tricrypto-NG, and legacy). If you want to find the best pool for a pair regardless of AMM type, use the MetaRegistry:

```solidity
metaRegistry.find_pool_for_coins(_from: address, _to: address, i: uint256) → address
```

---


## Quoting Swap Amounts

### On the Pool

Every pool exposes quote functions directly:

```solidity
// How much `j` will I get for `dx` of `i`?
pool.get_dy(i: int128, j: int128, dx: uint256) → uint256

// How much `i` do I need to get `dy` of `j`?
pool.get_dx(i: int128, j: int128, dy: uint256) → uint256
```

For **metapools**, you can also quote swaps through to the underlying base pool tokens:

```solidity
pool.get_dy_underlying(i: int128, j: int128, dx: uint256) → uint256
pool.get_dx_underlying(i: int128, j: int128, dy: uint256) → uint256
```

:::warning[Coin Indices]
Stableswap-NG uses **`int128`** for coin indices in swap and quote functions (not `uint256`). This is a legacy convention. Indices start at `0`.

For metapools, `coins(0)` is the metapool's own coin, and `coins(1)` is the base pool LP token. When using `exchange_underlying()`, the indices span all underlying tokens: index `0` is the metapool coin, and indices `1..N` map to the base pool's coins.
:::


### Via the Views Contract

The Views contract (`0xFF53042865dF617de4bB871bD0988E7B93439cCF`) provides the same quoting functions but parameterized by pool address. This is useful for off-chain integrations where you want a single contract to query any pool:

```solidity
views.get_dy(i: int128, j: int128, dx: uint256, pool: address) → uint256
views.get_dx(i: int128, j: int128, dy: uint256, pool: address) → uint256
views.get_dy_underlying(i: int128, j: int128, dx: uint256, pool: address) → uint256
views.get_dx_underlying(i: int128, j: int128, dy: uint256, pool: address) → uint256
views.dynamic_fee(i: int128, j: int128, pool: address) → uint256
views.calc_token_amount(amounts: uint256[], is_deposit: bool, pool: address) → uint256
views.calc_withdraw_one_coin(burn_amount: uint256, i: int128, pool: address) → uint256
```

The Views contract address is stored in the Factory and can be queried via `factory.views_implementation()`.


---


## Executing Swaps

### `exchange` — Standard Swap

The primary swap function. Requires the caller to have approved the pool to spend the input token.

```solidity
pool.exchange(
    i: int128,          // index of input coin
    j: int128,          // index of output coin
    _dx: uint256,       // amount of input coin to swap
    _min_dy: uint256,   // minimum output (slippage protection)
    _receiver: address  // recipient of output (defaults to msg.sender)
) → uint256            // actual output amount
```

**Flow:**
1. Caller approves pool for `_dx` of `coins(i)`
2. Call `exchange()`
3. Pool transfers `_dx` from caller, sends output to `_receiver`


### `exchange_received` — Approval-Free Swap

Designed for **aggregators and smart contract integrators**. Instead of the pool pulling tokens via `transferFrom`, the caller sends tokens to the pool first, and the pool calculates the swap based on its balance change.

```solidity
pool.exchange_received(
    i: int128,          // index of input coin
    j: int128,          // index of output coin
    _dx: uint256,       // expected amount of input coin (already sent)
    _min_dy: uint256,   // minimum output (slippage protection)
    _receiver: address  // recipient of output (defaults to msg.sender)
) → uint256            // actual output amount
```

**Flow:**
1. Transfer `_dx` of `coins(i)` directly to the pool address
2. Call `exchange_received()`
3. Pool detects the balance increase, executes the swap, sends output to `_receiver`

This saves one ERC-20 approval and is gas-efficient when chaining swaps across multiple protocols (e.g., Uniswap → Curve in a single aggregator route).

:::warning
`exchange_received` does **not** work with rebasing tokens that have fee-on-transfer, as the actual amount received by the pool may differ from `_dx`. The pool checks `balanceOf(self) - stored_balance >= _dx` — if the received amount is less due to a transfer fee, the call reverts.
:::

:::abstract[Article]
For a deeper dive into `exchange_received`, including efficiency benefits, security considerations, and practical integration examples, see: [How to Do Cheaper, Approval-Free Swaps](https://blog.curvemonitor.com/posts/exchange-received/).
:::


### `exchange_underlying` — Metapool Underlying Swap

Only available on **metapools**. Swaps directly between the metapool coin and any coin in the underlying base pool, without the caller needing to interact with the base pool separately.

```solidity
pool.exchange_underlying(
    i: int128,          // index of input coin (0 = meta coin, 1..N = base pool coins)
    j: int128,          // index of output coin
    _dx: uint256,       // amount of input coin
    _min_dy: uint256,   // minimum output
    _receiver: address  // recipient (defaults to msg.sender)
) → uint256            // actual output amount
```


---


## Fees

Stableswap-NG uses **dynamic fees** that increase when the pool is imbalanced (off-peg). This incentivizes arbitrage to restore the peg.

```solidity
// Base fee (in 1e10 precision, e.g., 4000000 = 0.04% = 4bps)
pool.fee() → uint256

// Off-peg fee multiplier
pool.offpeg_fee_multiplier() → uint256

// Actual fee for a specific swap pair (accounts for current pool state)
pool.dynamic_fee(i: int128, j: int128) → uint256
```

The dynamic fee formula scales between the base `fee` (when balanced) up to `fee * offpeg_fee_multiplier / 1e10` (when heavily imbalanced). The fee precision is `1e10`, so to get the fee as a percentage: `fee / 1e10 * 100`.

Admin fees are hardcoded at **50%** of trading fees — these go to the protocol (Curve DAO / fee receiver). The remaining 50% accrues to LPs via the pool's virtual price.


---


## Token Handling & Asset Types

Stableswap-NG supports four asset types. This matters for integrators because it affects how token balances and rates are calculated internally:

| Asset Type | ID | Description | Rate Source | Examples |
|---|---|---|---|---|
| **Standard** | `0` | Regular ERC-20 | `1e18` (no rate adjustment) | USDC, USDT, DAI |
| **Oracle** | `1` | Token with an exchange rate oracle | External oracle contract | wstETH, cbETH, rETH |
| **Rebasing** | `2` | Token whose balance changes automatically | `balanceOf()` tracked directly | stETH |
| **ERC4626** | `3` | Tokenized vault with `convertToAssets` | `convertToAssets(1e(decimals))` | sDAI |

Query a pool's asset types:
```solidity
factory.get_pool_asset_types(pool: address) → uint8[]
```

Query the internal rates used for balancing:
```solidity
pool.stored_rates() → uint256[]
```

For **oracle-type tokens** (type `1`), the rate is fetched from an external oracle contract using a method ID specified at pool deployment. This rate is used to normalize token values so the invariant can treat them as equivalent.


---


## Oracles

Each Stableswap-NG pool provides built-in **exponential moving average (EMA)** oracles. For a full technical deep-dive, see the [Stableswap-NG Oracle documentation](../amm/stableswap-ng/pools/oracles.md).

```solidity
// EMA price oracle for coin i relative to coin 0
pool.price_oracle(i: uint256) → uint256    // 1e18 precision

// Last raw price (spot price from most recent trade)
pool.last_price(i: uint256) → uint256

// Current spot price (calculated from current balances)
pool.get_p(i: uint256) → uint256

// EMA of the D invariant (useful for LP token pricing)
pool.D_oracle() → uint256
```

The EMA is calculated as: `EMA = last_spot × (1 - α) + prev_EMA × α`, where `α = e^(-Δt / ma_exp_time)`. The smoothing window `ma_exp_time` is set at pool deployment (default ~866 seconds for prices). A separate `D_ma_time` (default ~62,324 seconds) controls the D oracle.

**Update behavior:**
- EMA values update **at most once per block** — multiple swaps in the same block only update the spot price, not the EMA
- Spot prices (`last_price`) are **capped at `2 × 1e18`** before entering the EMA to limit manipulation impact
- `price_oracle()` and `D_oracle()` are triggered by swaps, `add_liquidity`, `remove_liquidity_one_coin`, and `remove_liquidity_imbalance` — but **not** by balanced `remove_liquidity` (which doesn't change prices, though D oracle is still updated)

:::info
The index `i` for oracle functions uses `uint256` (not `int128`), and represents the coin index relative to `coins(0)`. For a 2-coin pool, `price_oracle(0)` gives the price of `coins(1)` in terms of `coins(0)`.
:::


---


## Useful Pool Getters

```solidity
// Token addresses
pool.coins(i: uint256) → address

// Pool balances
pool.balances(i: uint256) → uint256
pool.get_balances() → uint256[]

// Amplification parameter (controls concentration around peg)
pool.A() → uint256

// Virtual price of LP token (increases monotonically as fees accrue)
pool.get_virtual_price() → uint256

// Total LP token supply (pool itself is the LP token, ERC-20 compliant)
pool.totalSupply() → uint256

// Internal rates (for asset type normalization)
pool.stored_rates() → uint256[]
```


---


## Deployments & Pool Implementations

Stableswap-NG is deployed across many chains. Select a chain below to view contract addresses and pool implementations.

Implementations have been upgraded over time, but **pools are immutable once deployed** — a pool keeps the implementation it was deployed with forever. The Factory's `set_pool_implementations()` only affects newly deployed pools. All implementations share the same ABI interface, so integrators can use a single interface regardless of which implementation a pool uses.

The Factory stores separate implementations for plain pools and metapools (`pool_implementations(idx)` and `metapool_implementations(idx)`). Use `factory.is_meta(pool)` to determine the pool type.

:::info[Live Contract & Implementation Explorer]
This tool fetches contract addresses and pool implementations directly from the on-chain Factory contract. It queries `math_implementation()`, `views_implementation()`, and `gauge_implementation()` for infrastructure contracts, then scans all deployed pools via `pool_list()` and `get_implementation_address()` to discover which implementation each pool uses. All calls are batched via [Multicall3](https://etherscan.io/address/0xcA11bde05977b3631167028862bE2a173976CA11) for efficiency. Results are cached in your browser — click **Refresh** to fetch newly deployed pools. You can optionally provide a custom RPC URL if the default public endpoint is unreliable.
:::

<ImplementationIndexer ammType="stableswap-ng" />
