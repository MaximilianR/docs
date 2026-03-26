---
title: Integrating LLAMMA
sidebar_label: LLAMMA
---

# Integrating LLAMMA

LLAMMA (Lending Liquidating AMM Algorithm) is Curve's band-based AMM used in **crvUSD** and **Curve Lending (Llamalend)** markets. Each lending market deploys its own LLAMMA AMM containing the collateral and borrowed asset. Unlike the other Curve AMMs which are general-purpose DEX pools, LLAMMA serves a dual role: it manages loan collateral liquidation and simultaneously provides tradeable liquidity that aggregators can route through.

Key properties:

- **2 coins** per AMM — always `coins[0]` = borrowed asset, `coins[1]` = collateral asset
- **Band-based liquidity** — similar to Uniswap V3 ticks, liquidity is distributed across discrete price bands
- **Not user-depositable** — liquidity comes from borrowers' collateral, not from LPs choosing to provide liquidity
- **The AMM is identical** across crvUSD and Curve Lending — same bytecode, same interface
- **No `exchange_received`** — uses standard `exchange()` with approval

:::info
LLAMMA AMMs are deployed per-market via two factories:
- **[crvUSD ControllerFactory](https://etherscan.io/address/0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC)** — for crvUSD borrowing markets (9 markets on mainnet)
- **[OneWayLendingFactory](https://etherscan.io/address/0xeA6876DDE9e3467564acBeE1Ed5bac88783205E0)** — for Curve Lending markets (46 markets on mainnet)

Both use the same AMM implementation — the interface is identical regardless of which factory deployed the market.
:::


---


## Market Discovery

### Via the crvUSD ControllerFactory

```solidity
// Number of crvUSD markets
factory.n_collaterals() → uint256

// Get AMM address by index
factory.amms(i: uint256) → address

// Get AMM for a specific collateral token
factory.get_amm(collateral: address, i: uint256) → address

// Get controller for a specific collateral token
factory.get_controller(collateral: address, i: uint256) → address

// Collateral token addresses
factory.collaterals(i: uint256) → address
```


### Via the OneWayLendingFactory (Curve Lending)

```solidity
// Number of lending markets
factory.market_count() → uint256

// Get AMM address by index
factory.amms(i: uint256) → address

// Get controller by index
factory.controllers(i: uint256) → address

// Get token addresses for a market
factory.borrowed_tokens(i: uint256) → address
factory.collateral_tokens(i: uint256) → address
factory.coins(vault_id: uint256) → address[2]
```


### Via the MetaRegistry

The [MetaRegistry](./meta-registry.md) also indexes LLAMMA pools. You can discover them alongside regular DEX pools:

```solidity
metaRegistry.find_pool_for_coins(_from: address, _to: address, i: uint256) → address
```


---


## Quoting Swap Amounts

```solidity
// How much of coin `j` will I get for `in_amount` of coin `i`?
amm.get_dy(i: uint256, j: uint256, in_amount: uint256) → uint256

// How much of coin `i` do I need to send to get `out_amount` of coin `j`?
amm.get_dx(i: uint256, j: uint256, out_amount: uint256) → uint256

// Get both input spent and output received for a given input
amm.get_dxdy(i: uint256, j: uint256, in_amount: uint256) → (uint256, uint256)

// Get both input needed and output received for a desired output
amm.get_dydx(i: uint256, j: uint256, out_amount: uint256) → (uint256, uint256)
```

The `get_dxdy` and `get_dydx` functions are useful for integrators because LLAMMA's band-based design means the actual input consumed may differ slightly from the requested amount — these functions return both values.

:::warning[Coin Indices]
- `coins[0]` = borrowed asset (e.g., crvUSD)
- `coins[1]` = collateral asset (e.g., WETH, wstETH, WBTC)

Indices use `uint256`.
:::


---


## Executing Swaps

### `exchange` — Standard Swap

Requires the caller to have approved the AMM to spend the input token.

```solidity
amm.exchange(
    i: uint256,         // index of input coin (0 or 1)
    j: uint256,         // index of output coin (0 or 1)
    in_amount: uint256,  // amount of input coin to swap
    min_amount: uint256, // minimum output (slippage protection)
    _for: address       // recipient of output (defaults to msg.sender)
) → uint256[2]          // [input_amount_spent, output_amount_received]
```

Note the return type: `uint256[2]` — returns **both** the actual input consumed and the output received. This differs from the other Curve AMMs which return only the output amount.


### `exchange_dy` — Swap by Output Amount

Specify the desired output amount instead of the input amount:

```solidity
amm.exchange_dy(
    i: uint256,         // index of input coin (0 or 1)
    j: uint256,         // index of output coin (0 or 1)
    out_amount: uint256, // desired amount of output coin
    max_amount: uint256, // maximum input willing to spend (slippage protection)
    _for: address       // recipient of output (defaults to msg.sender)
) → uint256[2]          // [input_amount_spent, output_amount_received]
```

This is useful for aggregators that need to deliver an exact output amount.


---


## Fees

LLAMMA uses a **dynamic fee** that increases when the current price deviates from the oracle price. This incentivizes arbitrage to align the AMM price with the external market.

```solidity
// Current dynamic fee (1e18 precision, NOT 1e10 like DEX pools)
amm.dynamic_fee() → uint256

// Base fee parameter (1e18 precision)
amm.fee() → uint256

// Admin fee (fraction of fee going to admin, 1e18 precision)
amm.admin_fee() → uint256
```

:::warning[Fee Precision]
LLAMMA fees use **`1e18` precision**, unlike the DEX AMMs (Stableswap, Twocrypto, Tricrypto) which use `1e10`. A fee value of `6000000000000000` (6e15) means 0.6%.
:::


---


## Bands & Prices

LLAMMA's liquidity is organized into discrete price **bands** (similar to Uniswap V3 ticks). Each band covers a price range, and liquidity flows between bands as the price moves.

```solidity
// Current active band (where the price currently sits)
amm.active_band() → int256

// Active band accounting for empty bands that can be skipped
amm.active_band_with_skip() → int256

// Band boundaries
amm.min_band() → int256
amm.max_band() → int256

// Liquidity in a specific band
amm.bands_x(n: int256) → uint256    // borrowed asset (coins[0]) in band n
amm.bands_y(n: int256) → uint256    // collateral asset (coins[1]) in band n

// Check if bands can be skipped (empty bands with no liquidity)
amm.can_skip_bands(n_end: int256) → bool
```


### Band Prices

Each band has upper and lower price boundaries. There are two price systems — **current prices** (based on AMM state) and **oracle prices** (based on the external oracle):

```solidity
// Current price at the upper edge of band n
amm.p_current_up(n: int256) → uint256

// Current price at the lower edge of band n
amm.p_current_down(n: int256) → uint256

// Oracle-derived price at band boundaries
amm.p_oracle_up(n: int256) → uint256
amm.p_oracle_down(n: int256) → uint256
```


### Price Functions

```solidity
// External oracle price (from the market's price oracle contract)
amm.price_oracle() → uint256    // 1e18 precision

// Current AMM spot price
amm.get_p() → uint256

// Base price (initial price at deployment, adjusted by rate)
amm.get_base_price() → uint256

// Rate multiplier (accounts for accumulated interest)
amm.get_rate_mul() → uint256

// How much to trade to move the price to a target
amm.get_amount_for_price(p: uint256) → (uint256, bool)
//   Returns: (amount, pump) — amount to trade, and direction
//   pump=true means buying coins[1] (pushing price up)
```


---


## Understanding LLAMMA Liquidity

Unlike DEX pools where anyone can add/remove liquidity, LLAMMA liquidity comes exclusively from **borrowers' collateral**. When a user borrows against collateral:

1. Their collateral is deposited across a range of bands (4–50 bands, chosen at loan creation)
2. As the collateral price drops into a band's range, the AMM gradually converts collateral → borrowed asset (soft-liquidation)
3. If price recovers, the AMM converts back (de-liquidation)

For integrators, this means:
- **Liquidity availability depends on active loans** — bands may be empty if no borrowers have collateral in that price range
- **Liquidity is one-sided per band** — a fully soft-liquidated band contains only borrowed asset; an untouched band contains only collateral
- **The active band** is where trading actually happens — bands above are collateral-only, bands below are borrowed-asset-only

```solidity
// Check user position in the AMM
amm.read_user_tick_numbers(user: address) → int256[2]  // [upper_band, lower_band]
amm.get_sum_xy(user: address) → uint256[2]             // [total_x, total_y]
amm.get_xy(user: address) → uint256[][2]               // per-band breakdown
amm.has_liquidity(user: address) → bool
```


---


## Contract Addresses (Ethereum Mainnet)

| Contract | Address |
|---|---|
| **crvUSD ControllerFactory** | [`0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC`](https://etherscan.io/address/0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC) |
| **OneWayLendingFactory** | [`0xeA6876DDE9e3467564acBeE1Ed5bac88783205E0`](https://etherscan.io/address/0xeA6876DDE9e3467564acBeE1Ed5bac88783205E0) |
| **AMM Implementation (crvUSD)** | [`0x2B7e624bdb839975d56D8428d9f6A4cf1160D3e9`](https://etherscan.io/address/0x2B7e624bdb839975d56D8428d9f6A4cf1160D3e9) |
| **AMM Implementation (Lending)** | [`0x0ec8e0c868541df59ceD49B39CC930C3a8DbD93a`](https://etherscan.io/address/0x0ec8e0c868541df59ceD49B39CC930C3a8DbD93a) |

:::tip
The two AMM implementations are **identical bytecode** — they were simply deployed separately by each factory. The interface is the same regardless of which factory created the market.
:::

:::tip
Both factories are deployed across many chains. Use the [AddressProvider](./address-provider.md) or check [Deployment Addresses](../deployments.md) for addresses on other networks.
:::
