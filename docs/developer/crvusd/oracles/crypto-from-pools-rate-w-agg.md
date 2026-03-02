# CryptoFromPoolsRateWAgg

This oracle contract **chains together price oracles from multiple Curve liquidity pools** and optionally applies `stored_rates` to account for tokens with rate oracles (e.g., interest-bearing tokens). It multiplies the result by the [aggregated crvUSD price](./price-aggregator.md) to produce a USD-denominated oracle price, making it suitable for **crvUSD mint markets**.

:::vyper[`CryptoFromPoolsRateWAgg.vy`]

The source code for the `CryptoFromPoolsRateWAgg.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-stablecoin/blob/master/curve_stablecoin/price_oracles/CryptoFromPoolsRateWAgg.vy). The contract is written in [Vyper](https://vyperlang.org/) version `0.3.10`.

Each crvUSD market using this oracle has its own deployment. The oracle address can be fetched by calling `price_oracle_contract` on the market's Controller.

<ContractABI>

```json
[{"stateMutability":"view","type":"function","name":"price","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"price_w","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"stored_rate","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"POOLS","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"POOL_COUNT","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"BORROWED_IX","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"COLLATERAL_IX","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"NO_ARGUMENT","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"USE_RATES","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"AGG","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"cached_rate","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"cached_timestamp","inputs":[],"outputs":[{"name":"","type":"uint256"}]}]
```

</ContractABI>

:::

:::danger[Oracle Immutability]

The oracle contract is **fully immutable**. Once deployed, it cannot change any parameters, stop price updates, or alter the pools used to calculate prices. All relevant data is passed into the `__init__` function during deployment.

<Dropdown title="`__init__`">

```vyper
@external
def __init__(
        pools: DynArray[Pool, MAX_POOLS],
        borrowed_ixs: DynArray[uint256, MAX_POOLS],
        collateral_ixs: DynArray[uint256, MAX_POOLS],
        agg: StableAggregator
    ):
    POOLS = pools
    pool_count: uint256 = 0
    no_arguments: DynArray[bool, MAX_POOLS] = empty(DynArray[bool, MAX_POOLS])
    use_rates: DynArray[bool, MAX_POOLS] = empty(DynArray[bool, MAX_POOLS])
    AGG = agg

    for i in range(MAX_POOLS):
        if i == len(pools):
            assert i != 0, "Wrong pool counts"
            pool_count = i
            break

        # Find N
        N: uint256 = 0
        for j in range(MAX_COINS + 1):
            success: bool = False
            res: Bytes[32] = empty(Bytes[32])
            success, res = raw_call(
                pools[i].address,
                _abi_encode(j, method_id=method_id("coins(uint256)")),
                max_outsize=32, is_static_call=True, revert_on_failure=False)
            if not success:
                assert j != 0, "No coins(0)"
                N = j
                break

        assert borrowed_ixs[i] != collateral_ixs[i]
        assert borrowed_ixs[i] < N
        assert collateral_ixs[i] < N

        # Init variables for raw call
        success: bool = False

        # Check and record if pool requires coin id in argument or no
        if N == 2:
            res: Bytes[32] = empty(Bytes[32])
            success, res = raw_call(
                pools[i].address,
                _abi_encode(empty(uint256), method_id=method_id("price_oracle(uint256)")),
                max_outsize=32, is_static_call=True, revert_on_failure=False)
            if not success:
                no_arguments.append(True)
            else:
                no_arguments.append(False)
        else:
            no_arguments.append(False)

        res: Bytes[1024] = empty(Bytes[1024])
        success, res = raw_call(pools[i].address, method_id("stored_rates()"), max_outsize=1024, is_static_call=True, revert_on_failure=False)
        stored_rates: DynArray[uint256, MAX_COINS] = empty(DynArray[uint256, MAX_COINS])
        if success and len(res) > 0:
            stored_rates = _abi_decode(res, DynArray[uint256, MAX_COINS])

        u: bool = False
        for r in stored_rates:
            if r != 10**18:
                u = True
        use_rates.append(u)

    NO_ARGUMENT = no_arguments
    BORROWED_IX = borrowed_ixs
    COLLATERAL_IX = collateral_ixs
    if pool_count == 0:
        pool_count = MAX_POOLS
    POOL_COUNT = pool_count
    USE_RATES = use_rates
```

</Dropdown>

:::

:::tip[Lending Variant]

A base variant without the aggregated crvUSD price ([`CryptoFromPoolsRate.vy`](https://github.com/curvefi/curve-stablecoin/blob/master/curve_stablecoin/price_oracles/CryptoFromPoolsRate.vy)) is also available. Both variants are documented together on the [lending oracle page](../../lending/contracts/crypto-from-pools-rate.md), which includes side-by-side code comparisons.

:::

---

## How the Price is Calculated

The oracle computes the collateral price by chaining price oracles across multiple pools:

1. **Unscaled price** — iterates through all configured pools, reading each pool's `price_oracle()` and computing `p_collateral / p_borrowed` for that pool, then multiplying all ratios together
2. **Rate adjustment** — if any pool uses `stored_rates` (for interest-bearing tokens), the ratio `rates[COLLATERAL_IX] / rates[BORROWED_IX]` is applied, subject to rate limiting
3. **USD normalization** — multiplies by the aggregated crvUSD/USD price from `AGG`

$$\text{price} = \frac{\text{unscaled\_price} \times \text{stored\_rate} \times \text{AGG.price}()}{10^{36}}$$

Where:

$$\text{unscaled\_price} = \prod_{i=0}^{N-1} \frac{p_{\text{collateral},i}}{p_{\text{borrowed},i}}$$

$$\text{stored\_rate} = \prod_{i \in \text{USE\_RATES}} \frac{\text{rates}_i[\text{COLLATERAL\_IX}_i]}{\text{rates}_i[\text{BORROWED\_IX}_i]}$$

---

## Price Functions

### `price`

::::description[`CryptoFromPoolsRateWAgg.price() -> uint256: view`]

Returns the current USD price of the collateral token. Chains price oracles across all configured pools, applies rate adjustments if applicable, and multiplies by the aggregated crvUSD price.

Returns: collateral price in USD (`uint256`).

<SourceCode>

```vyper
@external
@view
def price() -> uint256:
    return self._unscaled_price() * self._stored_rate()[0] / 10**18 * AGG.price() / 10**18

@internal
@view
def _unscaled_price() -> uint256:
    _price: uint256 = 10**18
    for i in range(MAX_POOLS):
        if i >= POOL_COUNT:
            break
        p_borrowed: uint256 = 10**18
        p_collateral: uint256 = 10**18

        if NO_ARGUMENT[i]:
            p: uint256 = POOLS[i].price_oracle()
            if COLLATERAL_IX[i] > 0:
                p_collateral = p
            else:
                p_borrowed = p

        else:
            if BORROWED_IX[i] > 0:
                p_borrowed = POOLS[i].price_oracle(unsafe_sub(BORROWED_IX[i], 1))
            if COLLATERAL_IX[i] > 0:
                p_collateral = POOLS[i].price_oracle(unsafe_sub(COLLATERAL_IX[i], 1))
        _price = _price * p_collateral / p_borrowed
    return _price

@internal
@view
def _stored_rate() -> (uint256, bool):
    use_rates: bool = False
    rate: uint256 = 0
    rate, use_rates = self._raw_stored_rate()
    if not use_rates:
        return rate, use_rates

    cached_rate: uint256 = self.cached_rate

    if cached_rate == 0 or cached_rate == rate:
        return rate, use_rates

    if rate > cached_rate:
        return min(rate, cached_rate * (10**18 + RATE_MAX_SPEED * (block.timestamp - self.cached_timestamp)) / 10**18), use_rates

    else:
        return max(rate, cached_rate * (10**18 - min(RATE_MAX_SPEED * (block.timestamp - self.cached_timestamp), 10**18)) / 10**18), use_rates
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.price()
67019544503887498803322
```

</Example>

::::

### `price_w`

::::description[`CryptoFromPoolsRateWAgg.price_w() -> uint256`]

Write version of `price()`. Calls `AGG.price_w()` and `_stored_rate_w()`, which update the aggregator's and rate cache's internal state respectively. This function is called by the AMM during regular operations.

Returns: collateral price in USD (`uint256`).

<SourceCode>

```vyper
@external
def price_w() -> uint256:
    return self._unscaled_price() * self._stored_rate_w() / 10**18 * AGG.price_w() / 10**18

@internal
def _stored_rate_w() -> uint256:
    rate: uint256 = 0
    use_rates: bool = False
    rate, use_rates = self._stored_rate()
    if use_rates:
        self.cached_rate = rate
        self.cached_timestamp = block.timestamp
    return rate
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.price_w()
67019544503887498803322
```

</Example>

::::

---

## Rates

The contract includes a **rate caching mechanism** to prevent rapid price manipulation through sudden rate changes. When pools use `stored_rates` (for interest-bearing tokens like crvUSD in certain pools), the oracle tracks the rate and limits how fast it can change.

The maximum rate of change is defined by `RATE_MAX_SPEED`:

```vyper
RATE_MAX_SPEED: constant(uint256) = 10**16 / 60  # Max speed of Rate change
```

This translates to a maximum of **1% per 60 seconds**. If the actual rate moves faster than this, the oracle clamps it to the maximum allowed change since the last cache update.

### `stored_rate`

::::description[`CryptoFromPoolsRateWAgg.stored_rate() -> uint256: view`]

Returns the current stored rate, subject to rate limiting. This is the product of `stored_rates[COLLATERAL_IX] / stored_rates[BORROWED_IX]` across all pools that use rates, clamped by `RATE_MAX_SPEED`.

Returns: rate-limited stored rate (`uint256`).

<SourceCode>

```vyper
@external
@view
def stored_rate() -> uint256:
    return self._stored_rate()[0]

@internal
@view
def _stored_rate() -> (uint256, bool):
    use_rates: bool = False
    rate: uint256 = 0
    rate, use_rates = self._raw_stored_rate()
    if not use_rates:
        return rate, use_rates

    cached_rate: uint256 = self.cached_rate

    if cached_rate == 0 or cached_rate == rate:
        return rate, use_rates

    if rate > cached_rate:
        return min(rate, cached_rate * (10**18 + RATE_MAX_SPEED * (block.timestamp - self.cached_timestamp)) / 10**18), use_rates

    else:
        return max(rate, cached_rate * (10**18 - min(RATE_MAX_SPEED * (block.timestamp - self.cached_timestamp), 10**18)) / 10**18), use_rates

@internal
@view
def _raw_stored_rate() -> (uint256, bool):
    rate: uint256 = 10**18
    use_rates: bool = False

    for i in range(MAX_POOLS):
        if i == POOL_COUNT:
            break
        if USE_RATES[i]:
            use_rates = True
            rates: DynArray[uint256, MAX_COINS] = POOLS[i].stored_rates()
            rate = rate * rates[COLLATERAL_IX[i]] / rates[BORROWED_IX[i]]

    return rate, use_rates
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.stored_rate()
1000000000000000000
```

</Example>

::::

### `cached_rate`

::::description[`CryptoFromPoolsRateWAgg.cached_rate() -> uint256: view`]

Getter for the last cached rate value, updated each time `price_w()` is called.

Returns: cached rate (`uint256`).

<SourceCode>

```vyper
cached_rate: public(uint256)
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.cached_rate()
1000000000000000000
```

</Example>

::::

### `cached_timestamp`

::::description[`CryptoFromPoolsRateWAgg.cached_timestamp() -> uint256: view`]

Getter for the timestamp when the rate was last cached (updated each time `price_w()` is called).

Returns: timestamp (`uint256`).

<SourceCode>

```vyper
cached_timestamp: public(uint256)
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.cached_timestamp()
1700000000
```

</Example>

::::

---

## Contract Info Methods

### `POOLS`

::::description[`CryptoFromPoolsRateWAgg.POOLS(arg0: uint256) -> address: view`]

Getter for the Curve pool at index `arg0` used as a price source.

| Input  | Type      | Description |
| ------ | --------- | ----------- |
| `arg0` | `uint256` | Pool index  |

Returns: pool address (`address`).

<SourceCode>

```vyper
POOLS: public(immutable(DynArray[Pool, MAX_POOLS]))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.POOLS(0)
'0x...'
```

</Example>

::::

### `POOL_COUNT`

::::description[`CryptoFromPoolsRateWAgg.POOL_COUNT() -> uint256: view`]

Getter for the total number of pools configured in this oracle.

Returns: number of pools (`uint256`).

<SourceCode>

```vyper
POOL_COUNT: public(immutable(uint256))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.POOL_COUNT()
2
```

</Example>

::::

### `BORROWED_IX`

::::description[`CryptoFromPoolsRateWAgg.BORROWED_IX(arg0: uint256) -> uint256: view`]

Getter for the index of the borrowed asset in the pool at index `arg0`.

| Input  | Type      | Description |
| ------ | --------- | ----------- |
| `arg0` | `uint256` | Pool index  |

Returns: coin index (`uint256`).

<SourceCode>

```vyper
BORROWED_IX: public(immutable(DynArray[uint256, MAX_POOLS]))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.BORROWED_IX(0)
0
```

</Example>

::::

### `COLLATERAL_IX`

::::description[`CryptoFromPoolsRateWAgg.COLLATERAL_IX(arg0: uint256) -> uint256: view`]

Getter for the index of the collateral asset in the pool at index `arg0`.

| Input  | Type      | Description |
| ------ | --------- | ----------- |
| `arg0` | `uint256` | Pool index  |

Returns: coin index (`uint256`).

<SourceCode>

```vyper
COLLATERAL_IX: public(immutable(DynArray[uint256, MAX_POOLS]))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.COLLATERAL_IX(0)
1
```

</Example>

::::

### `NO_ARGUMENT`

::::description[`CryptoFromPoolsRateWAgg.NO_ARGUMENT(arg0: uint256) -> bool: view`]

Getter that indicates whether the pool at index `arg0` uses a no-argument `price_oracle()` call (true for certain 2-coin pools) or requires a coin index argument.

| Input  | Type      | Description |
| ------ | --------- | ----------- |
| `arg0` | `uint256` | Pool index  |

Returns: true if no argument needed (`bool`).

<SourceCode>

```vyper
NO_ARGUMENT: public(immutable(DynArray[bool, MAX_POOLS]))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.NO_ARGUMENT(0)
false
```

</Example>

::::

### `USE_RATES`

::::description[`CryptoFromPoolsRateWAgg.USE_RATES(arg0: uint256) -> bool: view`]

Getter that indicates whether the pool at index `arg0` has non-trivial `stored_rates` that need to be applied to the price calculation.

| Input  | Type      | Description |
| ------ | --------- | ----------- |
| `arg0` | `uint256` | Pool index  |

Returns: true if the pool uses stored rates (`bool`).

<SourceCode>

```vyper
USE_RATES: public(immutable(DynArray[bool, MAX_POOLS]))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.USE_RATES(0)
true
```

</Example>

::::

### `AGG`

::::description[`CryptoFromPoolsRateWAgg.AGG() -> address: view`]

Getter for the crvUSD price aggregator contract ([`PriceAggregator`](./price-aggregator.md)).

Returns: aggregator address (`address`).

<SourceCode>

```vyper
AGG: public(immutable(StableAggregator))
```

</SourceCode>

<Example>

```shell
>>> CryptoFromPoolsRateWAgg.AGG()
'0x...'
```

</Example>

::::
