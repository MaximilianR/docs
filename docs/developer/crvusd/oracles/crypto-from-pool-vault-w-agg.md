# CryptoFromPoolVaultWAgg

This oracle contract derives the price of **ERC-4626 vault token collateral** by reading a price oracle from a Curve liquidity pool and applying the vault's redemption rate (`convertToAssets`). It then multiplies by the [aggregated crvUSD price](./price-aggregator.md) to produce a USD-denominated oracle price, making it suitable for **crvUSD mint markets**.

:::vyper[`CryptoFromPoolVaultWAgg.vy`]

The source code for the `CryptoFromPoolVaultWAgg.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-stablecoin/blob/master/curve_stablecoin/price_oracles/CryptoFromPoolVaultWAgg.vy). The contract is written in [Vyper](https://vyperlang.org/) version `0.3.10`.

Each crvUSD market using this oracle has its own deployment. The oracle address can be fetched by calling `price_oracle_contract` on the market's Controller.

<ContractABI>

```json
[{"stateMutability":"view","type":"function","name":"price","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"price_w","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"POOL","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"BORROWED_IX","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"COLLATERAL_IX","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"N_COINS","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"NO_ARGUMENT","inputs":[],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"VAULT","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"AGG","inputs":[],"outputs":[{"name":"","type":"address"}]}]
```

</ContractABI>

:::

:::warning[Oracle Suitability]

`CryptoFromPoolVaultWAgg.vy` is **only suitable for vaults which cannot be affected by [donation attacks](https://mixbytes.io/blog/overview-of-the-inflation-attack)** (e.g., sFRAX). Vaults vulnerable to donation attacks should use a different oracle type.

:::

:::danger[Oracle Immutability]

The oracle contract is **fully immutable**. Once deployed, it cannot change any parameters, stop price updates, or alter the pool used to calculate prices. All relevant data is passed into the `__init__` function during deployment.

<Dropdown title="`__init__`">

```vyper
@external
def __init__(
        pool: Pool,
        N: uint256,
        borrowed_ix: uint256,
        collateral_ix: uint256,
        vault: Vault,
        agg: StableAggregator
    ):
    assert borrowed_ix != collateral_ix
    assert borrowed_ix < N
    assert collateral_ix < N
    POOL = pool
    N_COINS = N
    BORROWED_IX = borrowed_ix
    COLLATERAL_IX = collateral_ix
    VAULT = vault
    AGG = agg

    no_argument: bool = False
    if N == 2:
        success: bool = False
        res: Bytes[32] = empty(Bytes[32])
        success, res = raw_call(
            pool.address,
            _abi_encode(empty(uint256), method_id=method_id("price_oracle(uint256)")),
            max_outsize=32, is_static_call=True, revert_on_failure=False)
        if not success:
            no_argument = True
    NO_ARGUMENT = no_argument
```

</Dropdown>

:::

:::tip[Lending Variant]

A base variant without the aggregated crvUSD price ([`CryptoFromPoolVault.vy`](https://github.com/curvefi/curve-stablecoin/blob/master/curve_stablecoin/price_oracles/CryptoFromPoolVault.vy)) is also available. Both variants are documented together on the [lending oracle page](../../lending/contracts/crypto-from-pool-vault.md), which includes additional detail on rate limiting and side-by-side code comparisons.

:::

---

## How the Price is Calculated

The oracle computes the collateral price in three steps:

1. **Pool price oracle** — reads the internal price oracle from the Curve pool, extracting the relative price between the collateral and borrowed assets
2. **Vault redemption** — multiplies by `VAULT.convertToAssets(10**18)` to convert from vault shares to underlying
3. **USD normalization** — multiplies by the aggregated crvUSD/USD price from `AGG`

$$\text{price} = \frac{p_{\text{collateral}}}{p_{\text{borrowed}}} \times \frac{\text{convertToAssets}(10^{18})}{10^{18}} \times \frac{\text{AGG.price}()}{10^{18}}$$

The internal `_raw_price()` function handles steps 1-2, while `price()` and `price_w()` apply step 3.

```vyper
@internal
@view
def _raw_price() -> uint256:
    p_borrowed: uint256 = 10**18
    p_collateral: uint256 = 10**18

    if NO_ARGUMENT:
        p: uint256 = POOL.price_oracle()
        if COLLATERAL_IX > 0:
            p_collateral = p
        else:
            p_borrowed = p

    else:
        if BORROWED_IX > 0:
            p_borrowed = POOL.price_oracle(BORROWED_IX - 1)
        if COLLATERAL_IX > 0:
            p_collateral = POOL.price_oracle(COLLATERAL_IX - 1)

    return p_collateral * VAULT.convertToAssets(10**18) / p_borrowed
```

---

## Price Functions

### `price`

::::description[`CryptoFromPoolVaultWAgg.price() -> uint256: view`]

Returns the current USD price of the collateral token. Reads the pool's price oracle, applies the vault redemption rate, and multiplies by the aggregated crvUSD price.

Returns: collateral price in USD (`uint256`).

<SourceCode>

```vyper
@external
@view
def price() -> uint256:
    return self._raw_price() * AGG.price() / 10**18

@internal
@view
def _raw_price() -> uint256:
    p_borrowed: uint256 = 10**18
    p_collateral: uint256 = 10**18

    if NO_ARGUMENT:
        p: uint256 = POOL.price_oracle()
        if COLLATERAL_IX > 0:
            p_collateral = p
        else:
            p_borrowed = p

    else:
        if BORROWED_IX > 0:
            p_borrowed = POOL.price_oracle(BORROWED_IX - 1)
        if COLLATERAL_IX > 0:
            p_collateral = POOL.price_oracle(COLLATERAL_IX - 1)

    return p_collateral * VAULT.convertToAssets(10**18) / p_borrowed
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.price()
1020187011799809503
```

</Example>

::::

### `price_w`

::::description[`CryptoFromPoolVaultWAgg.price_w() -> uint256`]

Write version of `price()`. Calls `AGG.price_w()` instead of `AGG.price()`, which updates the aggregator's internal state (EMA of crvUSD prices). This function is called by the AMM during regular operations to keep the aggregator up to date.

Returns: collateral price in USD (`uint256`).

<SourceCode>

```vyper
@external
def price_w() -> uint256:
    return self._raw_price() * AGG.price_w() / 10**18

@internal
@view
def _raw_price() -> uint256:
    p_borrowed: uint256 = 10**18
    p_collateral: uint256 = 10**18

    if NO_ARGUMENT:
        p: uint256 = POOL.price_oracle()
        if COLLATERAL_IX > 0:
            p_collateral = p
        else:
            p_borrowed = p

    else:
        if BORROWED_IX > 0:
            p_borrowed = POOL.price_oracle(BORROWED_IX - 1)
        if COLLATERAL_IX > 0:
            p_collateral = POOL.price_oracle(COLLATERAL_IX - 1)

    return p_collateral * VAULT.convertToAssets(10**18) / p_borrowed
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.price_w()
1020187011799809503
```

</Example>

::::

---

## Contract Info Methods

### `POOL`

::::description[`CryptoFromPoolVaultWAgg.POOL() -> address: view`]

Getter for the Curve pool used as the price source.

Returns: pool address (`address`).

<SourceCode>

```vyper
POOL: public(immutable(Pool))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.POOL()
'0x...'
```

</Example>

::::

### `BORROWED_IX`

::::description[`CryptoFromPoolVaultWAgg.BORROWED_IX() -> uint256: view`]

Getter for the index of the borrowed asset in the pool.

Returns: coin index (`uint256`).

<SourceCode>

```vyper
BORROWED_IX: public(immutable(uint256))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.BORROWED_IX()
0
```

</Example>

::::

### `COLLATERAL_IX`

::::description[`CryptoFromPoolVaultWAgg.COLLATERAL_IX() -> uint256: view`]

Getter for the index of the collateral asset in the pool.

Returns: coin index (`uint256`).

<SourceCode>

```vyper
COLLATERAL_IX: public(immutable(uint256))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.COLLATERAL_IX()
1
```

</Example>

::::

### `N_COINS`

::::description[`CryptoFromPoolVaultWAgg.N_COINS() -> uint256: view`]

Getter for the number of coins in the pool.

Returns: number of coins (`uint256`).

<SourceCode>

```vyper
N_COINS: public(immutable(uint256))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.N_COINS()
2
```

</Example>

::::

### `NO_ARGUMENT`

::::description[`CryptoFromPoolVaultWAgg.NO_ARGUMENT() -> bool: view`]

Getter that indicates whether the pool's `price_oracle()` function is called without arguments (true for 2-coin pools where the no-argument variant is available) or with a coin index argument.

Returns: true if no argument needed (`bool`).

<SourceCode>

```vyper
NO_ARGUMENT: public(immutable(bool))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.NO_ARGUMENT()
False
```

</Example>

::::

### `VAULT`

::::description[`CryptoFromPoolVaultWAgg.VAULT() -> address: view`]

Getter for the ERC-4626 vault contract whose redemption rate is applied to the price.

Returns: vault address (`address`).

<SourceCode>

```vyper
VAULT: public(immutable(Vault))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.VAULT()
'0x...'
```

</Example>

::::

### `AGG`

::::description[`CryptoFromPoolVaultWAgg.AGG() -> address: view`]

Getter for the crvUSD price aggregator contract ([`PriceAggregator`](./price-aggregator.md)).

Returns: aggregator address (`address`).

<SourceCode>

```vyper
AGG: public(immutable(StableAggregator))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolVaultWAgg.AGG()
'0x...'
```

</Example>

::::
