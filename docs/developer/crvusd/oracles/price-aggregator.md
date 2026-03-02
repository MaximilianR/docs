# PriceAggregator


The `AggregateStablePrice.vy` contract is designed to **get an aggregated price of crvUSD based on multiple stableswap pools weighted by their TVL**.

:::vyper[`AggregateStablePrice.vy`]

There are three iterations of the `AggregateStablePrice` contract. Source code for the contracts can be found on [GitHub](https://github.com/curvefi/curve-stablecoin/tree/master/contracts/price_oracles). The contract is written in [Vyper](https://vyperlang.org/) version `0.3.7`.

- :logos-ethereum: Ethereum: [`0x18672b1b0c623a30089A280Ed9256379fb0E4E62`](https://etherscan.io/address/0x18672b1b0c623a30089A280Ed9256379fb0E4E62)
- :logos-arbitrum: Arbitrum: [`0x44a4FdFb626Ce98e36396d491833606309520330`](https://arbiscan.io/address/0x44a4FdFb626Ce98e36396d491833606309520330)

<ContractABI>

```json
[
  {
    "name": "AddPricePair",
    "inputs": [
      {
        "name": "n",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "pool",
        "type": "address",
        "indexed": false
      },
      {
        "name": "is_inverse",
        "type": "bool",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "RemovePricePair",
    "inputs": [
      {
        "name": "n",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "MovePricePair",
    "inputs": [
      {
        "name": "n_from",
        "type": "uint256",
        "indexed": false
      },
      {
        "name": "n_to",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "name": "SetAdmin",
    "inputs": [
      {
        "name": "admin",
        "type": "address",
        "indexed": false
      }
    ],
    "anonymous": false,
    "type": "event"
  },
  {
    "stateMutability": "nonpayable",
    "type": "constructor",
    "inputs": [
      {
        "name": "stablecoin",
        "type": "address"
      },
      {
        "name": "sigma",
        "type": "uint256"
      },
      {
        "name": "admin",
        "type": "address"
      }
    ],
    "outputs": []
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "set_admin",
    "inputs": [
      {
        "name": "_admin",
        "type": "address"
      }
    ],
    "outputs": []
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "sigma",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ]
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "stablecoin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ]
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "add_price_pair",
    "inputs": [
      {
        "name": "_pool",
        "type": "address"
      }
    ],
    "outputs": []
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "remove_price_pair",
    "inputs": [
      {
        "name": "n",
        "type": "uint256"
      }
    ],
    "outputs": []
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "ema_tvl",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ]
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "price",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ]
  },
  {
    "stateMutability": "nonpayable",
    "type": "function",
    "name": "price_w",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ]
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "price_pairs",
    "inputs": [
      {
        "name": "arg0",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {
            "name": "pool",
            "type": "address"
          },
          {
            "name": "is_inverse",
            "type": "bool"
          }
        ]
      }
    ]
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "last_timestamp",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ]
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "last_tvl",
    "inputs": [
      {
        "name": "arg0",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ]
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "TVL_MA_TIME",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ]
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "last_price",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ]
  },
  {
    "stateMutability": "view",
    "type": "function",
    "name": "admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ]
  }
]
```

</ContractABI>

:::

This aggregated price of crvUSD is used in multiple different components in the system such as in [monetary policy contracts](../monetary-policy/monetary-policy.md), [PegKeepers](../pegkeepers/overview.md) or [oracles for lending markets](../../lending/contracts/oracle-overview.md).


---


## Calculations

The `AggregateStablePrice` contract calculates the **weighted average price of crvUSD across multiple liquidity pools**, considering only those pools with sufficient liquidity (`MIN_LIQUIDITY = 100,000 * 10**18`). The calculation is based on the **exponential moving average (EMA) of the Total-Value-Locked (TVL)** for each pool, determining the liquidity considered in the price aggregation.


## EMA TVL Calculation

The price calculation starts with determining the EMA of the TVL from different Curve Stableswap liquidity pools using the `_ema_tvl` function. This internal function computes the EMA TVLs based on the formula below, which adjusts for the time since the last update to smooth out short-term volatility in the TVL data, providing a more stable and representative average value over the specified time window (`TVL_MA_TIME = 50000`):

$$\alpha =
    \begin{cases}
    1 & \text{if last\_timestamp} = \text{current\_timestamp}, \\
    e^{-\frac{(\text{current\_timestamp} - \text{last\_timestamp}) \cdot 10^{18}}{\text{TVL\_MA\_TIME}}} & \text{otherwise}.
    \end{cases}
$$

$$\text{ema\_tvl}_{i} = \frac{\text{new\_tvl}_i \cdot (10^{18} - \alpha) + \text{tvl}_i \cdot \alpha}{10^{18}}$$

*The code snippet provided illustrates the implementation of the above formula in the contract.*

<Dropdown title="Source code for `_ema_tvl`">


```vyper
TVL_MA_TIME: public(constant(uint256)) = 50000  # s

@internal
@view
def _ema_tvl() -> DynArray[uint256, MAX_PAIRS]:
    tvls: DynArray[uint256, MAX_PAIRS] = []
    last_timestamp: uint256 = self.last_timestamp
    alpha: uint256 = 10**18
    if last_timestamp < block.timestamp:
        alpha = self.exp(- convert((block.timestamp - last_timestamp) * 10**18 / TVL_MA_TIME, int256))
    n_price_pairs: uint256 = self.n_price_pairs

    for i in range(MAX_PAIRS):
        if i == n_price_pairs:
            break
        tvl: uint256 = self.last_tvl[i]
        if alpha != 10**18:
            # alpha = 1.0 when dt = 0
            # alpha = 0.0 when dt = inf
            new_tvl: uint256 = self.price_pairs[i].pool.totalSupply()  # We don't do virtual price here to save on gas
            tvl = (new_tvl * (10**18 - alpha) + tvl * alpha) / 10**18
        tvls.append(tvl)

    return tvls
```


</Dropdown>

## Aggregated crvUSD Price Calculation

The `_price` function then uses these EMA TVLs to calculate the aggregated price of `crvUSD` by considering the liquidity of each pool. The function adjusts the price from the pool's `price_oracle` based on the coin index of `crvUSD` in the liquidity pool.

<Dropdown title="Source code for `_price`">


```vyper
@internal
@view
def _price(tvls: DynArray[uint256, MAX_PAIRS]) -> uint256:
    n: uint256 = self.n_price_pairs
    prices: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    D: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    Dsum: uint256 = 0
    DPsum: uint256 = 0
    for i in range(MAX_PAIRS):
        if i == n:
            break
        price_pair: PricePair = self.price_pairs[i]
        pool_supply: uint256 = tvls[i]
        if pool_supply >= MIN_LIQUIDITY:
            p: uint256 = price_pair.pool.price_oracle()
            if price_pair.is_inverse:
                p = 10**36 / p
            prices[i] = p
            D[i] = pool_supply
            Dsum += pool_supply
            DPsum += pool_supply * p
    if Dsum == 0:
        return 10**18  # Placeholder for no active pools
    p_avg: uint256 = DPsum / Dsum
    e: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    e_min: uint256 = max_value(uint256)
    for i in range(MAX_PAIRS):
        if i == n:
            break
        p: uint256 = prices[i]
        e[i] = (max(p, p_avg) - min(p, p_avg))**2 / (SIGMA**2 / 10**18)
        e_min = min(e[i], e_min)
    wp_sum: uint256 = 0
    w_sum: uint256 = 0
    for i in range(MAX_PAIRS):
        if i == n:
            break
        w: uint256 = D[i] * self.exp(-convert(e[i] - e_min, int256)) / 10**18
        w_sum += w
        wp_sum += w * prices[i]
    return wp_sum / w_sum
```


</Dropdown>

*In the calculation process, the contract iterates over all price pairs to perform the following steps:*

- Storing the price of `crvUSD` in a `prices[i]` array for each pool with enough liquidity.
- Storing each pool's TVL in `D[i]`, adding this TVL to `Dsum`, and summing up the product of the `crvUSD` price and pool supply in `DPsum`.

*Finally, the contract calculates an average price:*

$$\text{average price} = \frac{\text{DPsum}}{\text{Dsum}}$$

*Next, a variance measure `e` is computed for each pool's price relative to the average, adjusting by `SIGMA` to normalize:*

$$\text{e}_i = \frac{(\max(p, p_{\text{avg}}) - \min(p, p_{\text{avg}}))^2}{\frac{\text{SIGMA}^2}{10^{18}}}$$

$$\text{e}_{\min} = \min(\text{e}_i, \text{max\_value(uint256)})$$

Applying an exponential decay based on these variance measures to weigh each pool's contribution to the final average price, reducing the influence of prices far from the minimum variance. 

$$w = \frac{\text{D}_i \cdot e^{-(\text{e}_i - e_{\min})}}{10^{18}}$$

Next, sum up all `w` to store it in `w_sum` and calculate the product of `w * prices[i]`, which is stored in `wp_sum`.

*Finally, the weighted average price of `crvUSD` is calculated:*

$$\text{final price} = \frac{\text{wp_sum}}{\text{w_sum}}$$


---


## Price and TVL Methods

### `price`
::::description[`PriceAggregator3.price() -> uint256: view`]


Getter for the aggregated price of crvUSD based on the prices of crvUSD within different `price_pairs`.

Returns: aggregated crvUSD price (`uint256`).

<SourceCode>



```vyper
MAX_PAIRS: constant(uint256) = 20
MIN_LIQUIDITY: constant(uint256) = 100_000 * 10**18  # Only take into account pools with enough liquidity

STABLECOIN: immutable(address)
SIGMA: immutable(uint256)
price_pairs: public(PricePair[MAX_PAIRS])
n_price_pairs: uint256

last_timestamp: public(uint256)
last_tvl: public(uint256[MAX_PAIRS])
TVL_MA_TIME: public(constant(uint256)) = 50000  # s
last_price: public(uint256)

@external
@view
def price() -> uint256:
    return self._price(self._ema_tvl())

@internal
@view
def _price(tvls: DynArray[uint256, MAX_PAIRS]) -> uint256:
    n: uint256 = self.n_price_pairs
    prices: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    D: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    Dsum: uint256 = 0
    DPsum: uint256 = 0
    for i in range(MAX_PAIRS):
        if i == n:
            break
        price_pair: PricePair = self.price_pairs[i]
        pool_supply: uint256 = tvls[i]
        if pool_supply >= MIN_LIQUIDITY:
            p: uint256 = price_pair.pool.price_oracle()
            if price_pair.is_inverse:
                p = 10**36 / p
            prices[i] = p
            D[i] = pool_supply
            Dsum += pool_supply
            DPsum += pool_supply * p
    if Dsum == 0:
        return 10**18  # Placeholder for no active pools
    p_avg: uint256 = DPsum / Dsum
    e: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    e_min: uint256 = max_value(uint256)
    for i in range(MAX_PAIRS):
        if i == n:
            break
        p: uint256 = prices[i]
        e[i] = (max(p, p_avg) - min(p, p_avg))**2 / (SIGMA**2 / 10**18)
        e_min = min(e[i], e_min)
    wp_sum: uint256 = 0
    w_sum: uint256 = 0
    for i in range(MAX_PAIRS):
        if i == n:
            break
        w: uint256 = D[i] * self.exp(-convert(e[i] - e_min, int256)) / 10**18
        w_sum += w
        wp_sum += w * prices[i]
    return wp_sum / w_sum

@internal
@view
def _ema_tvl() -> DynArray[uint256, MAX_PAIRS]:
    tvls: DynArray[uint256, MAX_PAIRS] = []
    last_timestamp: uint256 = self.last_timestamp
    alpha: uint256 = 10**18
    if last_timestamp < block.timestamp:
        alpha = self.exp(- convert((block.timestamp - last_timestamp) * 10**18 / TVL_MA_TIME, int256))
    n_price_pairs: uint256 = self.n_price_pairs

    for i in range(MAX_PAIRS):
        if i == n_price_pairs:
            break
        tvl: uint256 = self.last_tvl[i]
        if alpha != 10**18:
            # alpha = 1.0 when dt = 0
            # alpha = 0.0 when dt = inf
            new_tvl: uint256 = self.price_pairs[i].pool.totalSupply()  # We don't do virtual price here to save on gas
            tvl = (new_tvl * (10**18 - alpha) + tvl * alpha) / 10**18
        tvls.append(tvl)

    return tvls
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function price() view returns (uint256)"]}
  method="price"
  contractName="PriceAggregator3"
/>

</Example>


::::

### `price_w`
::::description[`PriceAggregator3.price_w() -> uint256`]


Function to calculate the aggregated price of crvUSD based on the prices of crvUSD within different `price_pairs`. This function writes the price on the blockchain and additionally updates `last_timestamp`, `last_tvl` and `last_price`.

Returns: aggregated crvUSD price (`uint256`).

<SourceCode>



```vyper
MAX_PAIRS: constant(uint256) = 20
MIN_LIQUIDITY: constant(uint256) = 100_000 * 10**18  # Only take into account pools with enough liquidity

STABLECOIN: immutable(address)
SIGMA: immutable(uint256)
price_pairs: public(PricePair[MAX_PAIRS])
n_price_pairs: uint256

last_timestamp: public(uint256)
last_tvl: public(uint256[MAX_PAIRS])
TVL_MA_TIME: public(constant(uint256)) = 50000  # s
last_price: public(uint256)

@external
def price_w() -> uint256:
    if self.last_timestamp == block.timestamp:
        return self.last_price
    else:
        ema_tvl: DynArray[uint256, MAX_PAIRS] = self._ema_tvl()
        self.last_timestamp = block.timestamp
        for i in range(MAX_PAIRS):
            if i == len(ema_tvl):
                break
            self.last_tvl[i] = ema_tvl[i]
        p: uint256 = self._price(ema_tvl)
        self.last_price = p
        return p

@internal
@view
def _price(tvls: DynArray[uint256, MAX_PAIRS]) -> uint256:
    n: uint256 = self.n_price_pairs
    prices: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    D: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    Dsum: uint256 = 0
    DPsum: uint256 = 0
    for i in range(MAX_PAIRS):
        if i == n:
            break
        price_pair: PricePair = self.price_pairs[i]
        pool_supply: uint256 = tvls[i]
        if pool_supply >= MIN_LIQUIDITY:
            p: uint256 = price_pair.pool.price_oracle()
            if price_pair.is_inverse:
                p = 10**36 / p
            prices[i] = p
            D[i] = pool_supply
            Dsum += pool_supply
            DPsum += pool_supply * p
    if Dsum == 0:
        return 10**18  # Placeholder for no active pools
    p_avg: uint256 = DPsum / Dsum
    e: uint256[MAX_PAIRS] = empty(uint256[MAX_PAIRS])
    e_min: uint256 = max_value(uint256)
    for i in range(MAX_PAIRS):
        if i == n:
            break
        p: uint256 = prices[i]
        e[i] = (max(p, p_avg) - min(p, p_avg))**2 / (SIGMA**2 / 10**18)
        e_min = min(e[i], e_min)
    wp_sum: uint256 = 0
    w_sum: uint256 = 0
    for i in range(MAX_PAIRS):
        if i == n:
            break
        w: uint256 = D[i] * self.exp(-convert(e[i] - e_min, int256)) / 10**18
        w_sum += w
        wp_sum += w * prices[i]
    return wp_sum / w_sum

@internal
@view
def _ema_tvl() -> DynArray[uint256, MAX_PAIRS]:
    tvls: DynArray[uint256, MAX_PAIRS] = []
    last_timestamp: uint256 = self.last_timestamp
    alpha: uint256 = 10**18
    if last_timestamp < block.timestamp:
        alpha = self.exp(- convert((block.timestamp - last_timestamp) * 10**18 / TVL_MA_TIME, int256))
    n_price_pairs: uint256 = self.n_price_pairs

    for i in range(MAX_PAIRS):
        if i == n_price_pairs:
            break
        tvl: uint256 = self.last_tvl[i]
        if alpha != 10**18:
            # alpha = 1.0 when dt = 0
            # alpha = 0.0 when dt = inf
            new_tvl: uint256 = self.price_pairs[i].pool.totalSupply()  # We don't do virtual price here to save on gas
            tvl = (new_tvl * (10**18 - alpha) + tvl * alpha) / 10**18
        tvls.append(tvl)

    return tvls
```


</SourceCode>

<Example>


```shell
>>> PriceAggregator3.price_w()
996396341581883374
```


</Example>


::::

### `last_price`
::::description[`PriceAggregator3.last_price() -> uint256: view`]


Getter for the last aggregated price of crvUSD. This variable was set to $10^{18}$ (1.00) when initializing the contract and is updated to the current aggregated crvUSD price every time [`price_w`](#price_w) is called.

Returns: last aggregated price of crvUSD (`uint256`). 

<SourceCode>



```vyper
last_price: public(uint256)

@external
def __init__(stablecoin: address, sigma: uint256, admin: address):
    STABLECOIN = stablecoin
    SIGMA = sigma  # The change is so rare that we can change the whole thing altogether
    self.admin = admin
    self.last_price = 10**18
    self.last_timestamp = block.timestamp
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function last_price() view returns (uint256)"]}
  method="last_price"
  contractName="PriceAggregator3"
/>

</Example>


::::

### `last_timestamp`
::::description[`PriceAggregator3.last_timestamp() -> uint256: view`]


Getter for the last timestamp when the aggregated price of crvUSD was updated. This variable was populated with `block.timestamp` when initializing the contract and is updated to the current timestamp every time [`price_w`](#price_w) is called. When adding a new price pair, its value is set to the `totalSupply` of the pair.

Returns: timestamp of the last price write (`uint256`).

<SourceCode>



```vyper
last_timestamp: public(uint256)
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function last_timestamp() view returns (uint256)"]}
  method="last_timestamp"
  contractName="PriceAggregator3"
/>

</Example>


::::

### `ema_tvl`
::::description[`PriceAggregator3.ema_tvl() -> DynArray[uint256, MAX_PAIRS]: view`]


Getter for the exponential moving-average value of TVL across all `price_pairs`.

Returns: array of ema tvls (`DynArray[uint256, MAX_PAIRS]`).

<SourceCode>



```vyper
MAX_PAIRS: constant(uint256) = 20
MIN_LIQUIDITY: constant(uint256) = 100_000 * 10**18  # Only take into account pools with enough liquidity

price_pairs: public(PricePair[MAX_PAIRS])
n_price_pairs: uint256

last_timestamp: public(uint256)
last_tvl: public(uint256[MAX_PAIRS])
TVL_MA_TIME: public(constant(uint256)) = 50000  # s

@external
@view
def ema_tvl() -> DynArray[uint256, MAX_PAIRS]:
    return self._ema_tvl()

@internal
@view
def _ema_tvl() -> DynArray[uint256, MAX_PAIRS]:
    tvls: DynArray[uint256, MAX_PAIRS] = []
    last_timestamp: uint256 = self.last_timestamp
    alpha: uint256 = 10**18
    if last_timestamp < block.timestamp:
        alpha = self.exp(- convert((block.timestamp - last_timestamp) * 10**18 / TVL_MA_TIME, int256))
    n_price_pairs: uint256 = self.n_price_pairs

    for i in range(MAX_PAIRS):
        if i == n_price_pairs:
            break
        tvl: uint256 = self.last_tvl[i]
        if alpha != 10**18:
            # alpha = 1.0 when dt = 0
            # alpha = 0.0 when dt = inf
            new_tvl: uint256 = self.price_pairs[i].pool.totalSupply()  # We don't do virtual price here to save on gas
            tvl = (new_tvl * (10**18 - alpha) + tvl * alpha) / 10**18
        tvls.append(tvl)

    return tvls
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function ema_tvl() view returns (uint256[])"]}
  method="ema_tvl"
  contractName="PriceAggregator3"
/>

</Example>


::::

### `last_tvl`
::::description[`PriceAggregator3.last_tvl(arg0: uint256) -> uint256: view`]


Getter for the last ema tvl value of a `price_pair`. This variable is updated to the current ema tvl of the pool every time [`price_w`](#price_w) is called. When adding a new price pair, its value is set to the `totalSupply` of the pair.

Returns: last ema tvl (`uint256`).

| Input  | Type      | Description             |
| ------ | --------- | ----------------------- |
| `arg0` | `uint256` | Index of the price pair |

<SourceCode>



```vyper
last_tvl: public(uint256[MAX_PAIRS])
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function last_tvl(uint256) view returns (uint256)"]}
  method="last_tvl"
  args={["0"]}
  labels={["arg0"]}
  contractName="PriceAggregator3"
/>

</Example>


::::

### `TVL_MA_TIME`
::::description[`PriceAggregator3.TVL_MA_TIME() -> uint256: view`]


Getter for the time periodicity used to calculate the exponential moving-average of TVL.

Returns: ema periodicity (`uint256`).

<SourceCode>



```vyper
TVL_MA_TIME: public(constant(uint256)) = 50000  # s
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function TVL_MA_TIME() view returns (uint256)"]}
  method="TVL_MA_TIME"
  contractName="PriceAggregator3"
/>

</Example>


::::

---


## Contract Info Methods

### `sigma`
::::description[`PriceAggregator3.sigma() -> uint256: view`]


Getter for the sigma value. SIGMA is a predefined constant that influences the adjustment of price deviations, affecting how variations in individual stablecoin prices contribute to the overall average stablecoin price. The value of `sigma` was set to `1000000000000000` when initializing the contract and the variable is immutable, meaning it can not be adjusted.

Returns: sigma value (`uint256`).

<SourceCode>


```vyper
SIGMA: immutable(uint256)

@external
@view
def sigma() -> uint256:
    return SIGMA

@external
def __init__(stablecoin: address, sigma: uint256, admin: address):
    STABLECOIN = stablecoin
    SIGMA = sigma  # The change is so rare that we can change the whole thing altogether
    self.admin = admin
    self.last_price = 10**18
    self.last_timestamp = block.timestamp
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function sigma() view returns (uint256)"]}
  method="sigma"
  contractName="PriceAggregator3"
/>

</Example>


::::

### `stablecoin`
::::description[`PriceAggregator3.stablecoin() -> address: view`]


Getter for the crvUSD contract address.

Returns: crvUSD contract (`address`).

<SourceCode>


```vyper
STABLECOIN: immutable(address)

@external
@view
def stablecoin() -> address:
    return STABLECOIN

@external
def __init__(stablecoin: address, sigma: uint256, admin: address):
    STABLECOIN = stablecoin
    SIGMA = sigma  # The change is so rare that we can change the whole thing altogether
    self.admin = admin
    self.last_price = 10**18
    self.last_timestamp = block.timestamp
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function stablecoin() view returns (address)"]}
  method="stablecoin"
  contractName="PriceAggregator3"
/>

</Example>


::::

---


## Price Pairs

All liquidity pools used to calculate the aggregated price are stored in `price_pairs`. New price pairs can be added or removed by the DAO using `add_price_pair` and `remove_price_pair`.

### `price_pairs`
::::description[`PriceAggregator3.price_pairs(arg0: uint256) -> PricePair: view`]


Getter for the price pairs added to the `PriceAggregator` contract. New pairs can be added using the [`add_price_pair`](#add_price_pair) function.

Returns: `PricePair` struct consisting of the pool (`address`) and if it is inverse (`bool`).

| Input  | Type      | Description             |
| ------ | --------- | ----------------------- |
| `arg0` | `uint256` | Index of the price pair |

<SourceCode>


```vyper
struct PricePair:
    pool: Stableswap
    is_inverse: bool

price_pairs: public(PricePair[MAX_PAIRS])
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function price_pairs(uint256) view returns (tuple(address,bool))"]}
  method="price_pairs"
  args={["0"]}
  labels={["arg0"]}
  contractName="PriceAggregator3"
/>

</Example>


::::

### `add_price_pair`
::::description[`PriceAggregator3.add_price_pair(_pool: Stableswap)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract. The `admin` is the Curve DAO (via the CurveOwnershipAgent).

:::

Function to add a new price pair to the `PriceAggregator`.

| Input   | Type         | Description               |
| ------- | ------------ | ------------------------- |
| `_pool` | `Stableswap` | Pool to add as price pair |

Emits: `AddPricePair` event.

<SourceCode>


```vyper
event AddPricePair:
    n: uint256
    pool: Stableswap
    is_inverse: bool

price_pairs: public(PricePair[MAX_PAIRS])
n_price_pairs: uint256

@external
def add_price_pair(_pool: Stableswap):
    assert msg.sender == self.admin
    price_pair: PricePair = empty(PricePair)
    price_pair.pool = _pool
    coins: address[2] = [_pool.coins(0), _pool.coins(1)]
    if coins[0] == STABLECOIN:
        price_pair.is_inverse = True
    else:
        assert coins[1] == STABLECOIN
    n: uint256 = self.n_price_pairs
    self.price_pairs[n] = price_pair  # Should revert if too many pairs
    self.last_tvl[n] = _pool.totalSupply()
    self.n_price_pairs = n + 1
    log AddPricePair(n, _pool, price_pair.is_inverse)
```


</SourceCode>

<Example>


```shell
>>> PriceAggregator3.add_price_pair("0xpool_address")
```


</Example>


::::

### `remove_price_pair`
::::description[`PriceAggregator3.remove_price_pair(n: uint256)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract. The `admin` is the Curve DAO (via the CurveOwnershipAgent).

:::

Function to remove the price pair at index `n` from the `PriceAggregator`.

| Input | Type      | Description                       |
| ----- | --------- | --------------------------------- |
| `n`   | `uint256` | Index of the price pair to remove |

Emits: `RemovePricePair` event and conditionally `MovePricePair` event.[^1]

[^1]: `MovePricePair` event is emitted when the removed price pair is not the last one which was added. In this case, price pairs need to be adjusted accordingly.

<SourceCode>


```vyper
event RemovePricePair:
    n: uint256

event MovePricePair:
    n_from: uint256
    n_to: uint256

price_pairs: public(PricePair[MAX_PAIRS])
n_price_pairs: uint256

@external
def remove_price_pair(n: uint256):
    assert msg.sender == self.admin
    n_max: uint256 = self.n_price_pairs - 1
    assert n <= n_max

    if n < n_max:
        self.price_pairs[n] = self.price_pairs[n_max]
        log MovePricePair(n_max, n)
    self.n_price_pairs = n_max
    log RemovePricePair(n)
```


</SourceCode>

<Example>


```shell
>>> PriceAggregator3.remove_price_pair(0)
```


</Example>


::::

---


## Contract Ownership

The contract follows the classical two-step ownership model used in various other Curve contracts:

### `admin`
::::description[`PriceAggregator3.admin() -> address: view`]


Getter for the current admin of the contract.

Returns: current admin (`address`).

<SourceCode>


```vyper
admin: public(address)

@external
def __init__(stablecoin: address, sigma: uint256, admin: address):
    STABLECOIN = stablecoin
    SIGMA = sigma  # The change is so rare that we can change the whole thing altogether
    self.admin = admin
    self.last_price = 10**18
    self.last_timestamp = block.timestamp
```


</SourceCode>

<Example>

<ContractCall
  address="0x18672b1b0c623a30089A280Ed9256379fb0E4E62"
  abi={["function admin() view returns (address)"]}
  method="admin"
  contractName="PriceAggregator3"
/>

</Example>


::::

### `set_admin`
::::description[`PriceAggregator3.set_admin(_admin: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract. The `admin` is the Curve DAO (via the CurveOwnershipAgent).

:::

Function to set a new address as the `admin` of the contract.

| Input    | Type      | Description                     |
| -------- | --------- | ------------------------------- |
| `_admin` | `address` | New address to set the admin to |

Emits: `SetAdmin` event.

<SourceCode>


```vyper
event SetAdmin:
    admin: address

admin: public(address)

@external
def set_admin(_admin: address):
    # We are not doing commit / apply because the owner will be a voting DAO anyway
    # which has vote delays
    assert msg.sender == self.admin
    self.admin = _admin
    log SetAdmin(_admin)
```


</SourceCode>

<Example>


```shell
>>> PriceAggregator3.set_admin("0xnew_admin_address")
```


</Example>


::::
