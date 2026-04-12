# Stableswap-NG Factory: Overview


The `CurveStableswapFactoryNG.vy` allows the permissionless deployment of up to eight-coin plain- and metapools, as well as gauges. **Liquidity pool and LP token share the same contract.**For more details, see here: [Stableswap-NG Documentation](../../stableswap-ng/overview.md). 


:::github[GitHub]

The source code of the `CurveStableSwapFactoryNG.vy` can be found on [GitHub ](https://github.com/curvefi/stableswap-ng/blob/main/contracts/main/CurveStableSwapFactoryNG.vy).  
A list of all deployments can be found [here](../../../deployments.md).


:::

---


## Asset Types

Stableswap-NG pools supports various tokens with different [asset types](../../stableswap-ng/overview.md#supported-assets). New asset types can be added by the `admin` of the contract via the `add_asset_type` method.
For a list of all supported assets, please see [below](#assets-types).


### `asset_types`
::::description[`CurveStableswapFactoryNG.asset_types(arg0: uint8) -> String[20]`]


Getter for name of the different asset types.

| Input   | Type     | Description                     |
| ------- | -------- | ------------------------------- |
| `arg0`  | `uint8`  | Index value of the asset type   |

Returns: asset type (`String[20]`)

<SourceCode>
```vyper
asset_types: public(HashMap[uint8, String[20]])
```
</SourceCode>

<Example>


```shell
>>> CurveStableswapFactoryNG.asset_types(0)
'Standard'

>>> CurveStableswapFactoryNG.asset_types(1)
'Oracle'
```


</Example>


::::

### `add_asset_type`
::::description[`CurveStableSwapFactoryNG.add_asset_type(_id: uint8, _name: String[10])`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to add a new asset type.

| Input   | Type         | Description              |
| ------- | ------------ | ------------------------ |
| `_id`   | `uint8`      | Asset type ID            |
| `_name` | `String[10]` | Name of the new asset type |

<SourceCode>
```vyper
asset_types: public(HashMap[uint8, String[20]])

@external
def add_asset_type(_id: uint8, _name: String[10]):
    """
    @notice Admin only method that adds a new asset type.
    @param _id asset type id.
    @param _name Name of the asset type.
    """
    assert msg.sender == self.admin  # dev: admin only
    self.asset_types[_id] = _name
```
</SourceCode>


::::

---


## Base Pools

Stableswap pools also allow the deployment of metapools (an asset paired against a base pool). When deploying a new Factory, the existing base pools must be manually added to the contract for them to be used for metapools.

*Limitations when adding new base pools:*

- Rebasing tokens are not allowed in a base pool.
- Can not add a base pool that contains native tokens (e.g., ETH).
- As much as possible: Use standard `ERC20` tokens.


### `add_base_pool`
::::description[`CurveStableSwapFactoryNG.add_base_pool(_base_pool: address, _base_lp_token: address, _asset_types: DynArray[uint8, MAX_COINS], _n_coins: uint256):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to add a new base pool.

| Input            | Type                         | Description                      |
| ---------------- | ---------------------------- | -------------------------------- |
| `_base_pool`     | `address`                    | Pool address to add as a base pool |
| `_base_lp_token` | `address`                    | LP token address of the pool     |
| `_asset_types`   | `DynArray[uint8, MAX_COINS]` | Array of asset types of the pool |
| `_n_coins`       | `uint256`                    | Number of coins in the base pool |

Emits: `BasePoolAdded`


<SourceCode>
```vyper
event BasePoolAdded:
    base_pool: address

@external
def add_base_pool(
    _base_pool: address,
    _base_lp_token: address,
    _asset_types: DynArray[uint8, MAX_COINS],
    _n_coins: uint256,
):
    """
    @notice Add a base pool to the registry, which may be used in factory metapools
    @dev 1. Only callable by admin
        1. Rebasing tokens are not allowed in the base pool.
        2. Do not add base pool which contains native tokens (e.g. ETH).
        3. As much as possible: use standard ERC20 tokens.
        Should you choose to deviate from these recommendations, audits are advised.
    @param _base_pool Pool address to add
    @param _asset_types Asset type for pool, as an integer
    """
    assert msg.sender == self.admin  # dev: admin-only function
    assert 2 not in _asset_types  # dev: rebasing tokens cannot be in base pool
    assert len(self.base_pool_data[_base_pool].coins) == 0  # dev: pool exists
    assert _n_coins < MAX_COINS  # dev: base pool can only have (MAX_COINS - 1) coins.

    # add pool to pool_list
    length: uint256 = self.base_pool_count
    self.base_pool_list[length] = _base_pool
    self.base_pool_count = length + 1
    self.base_pool_data[_base_pool].lp_token = _base_lp_token
    self.base_pool_data[_base_pool].n_coins = _n_coins
    self.base_pool_data[_base_pool].asset_types = _asset_types

    decimals: uint256 = 0
    coins: DynArray[address, MAX_COINS] = empty(DynArray[address, MAX_COINS])
    coin: address = empty(address)
    for i in range(MAX_COINS):
        if i == _n_coins:
            break
        coin = CurvePool(_base_pool).coins(i)
        assert coin != 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE  # dev: native token is not supported
        self.base_pool_data[_base_pool].coins.append(coin)
        self.base_pool_assets[coin] = True
        decimals += (ERC20(coin).decimals() << i*8)
    self.base_pool_data[_base_pool].decimals = decimals

    log BasePoolAdded(_base_pool)
```
</SourceCode>


::::

### `base_pool_list`
::::description[`CurveStableSwapFactoryNG.base_pool_list(arg0: uint256) -> address: view`]

Getter for the base pool at index `arg0`.

| Input            | Type                         | Description                      |
| ---------------- | ---------------------------- | -------------------------------- |
| `arg0`           | `uint256`                    | Index of the base pool           |

<SourceCode>
```vyper
base_pool_list: public(address[4294967296])   # list of base pools
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.base_pool_list(0)
'0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'
```


</Example>


::::

---


## Implementations

The Stableswap-NG Factory makes use of **blueprint contracts**to deploy its contracts from the implementations.

:::warning

**Implementation contracts are upgradable.**They can either be replaced, or additional implementation contracts can be added. Therefore, please always make sure to check the most recent ones.


:::

*It utilizes five different implementations:*

- **`pool_implementations`**, containing multiple blueprint contracts that are used to deploy plain pools.
- **`metapool_implementations`**, containing multiple blueprint contracts that are used to deploy metapools.
- **`math_implementation`**, containing math functions used in the AMM.
- **`gauge_implementation`**, containing a blueprint contract that is used when deploying gauges for pools.[^1]
- **`views_implementation`**, containing a view methods contract relevant for integrators and users looking to interact with the AMMs.

[^1]: The `gauge_implementation` is only relevant on Ethereum mainnet. Liquidity gauges on sidechains need to be deployed through the `RootChainGaugeFactory`.

*More on the [**Math Implementation**](../../stableswap-ng/utility-contracts/math.md) and [**Views Implementation**](../../stableswap-ng/utility-contracts/views.md).* 


## Query Implementations

### `pool_implementations`
::::description[`CurveStableSwapFactoryNG.pool_implementations(arg0: uint256) -> address: view`]


Getter for the pool implementations. There might be multiple pool implementations base on various circumstances.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `uint256` | index value of the implementation |

Returns: implementation (`address`).

<SourceCode>
```vyper
# index -> implementation address
pool_implementations: public(HashMap[uint256, address])
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.pool_implementation(0)
'0x3E3B5F27bbf5CC967E074b70E9f4046e31663181'
```


</Example>


::::

### `metapool_implementations`
::::description[`CurveStableSwapFactoryNG.metapool_implementations(arg0: uint256) -> address: view`]


Getter for the pool implementations at index `arg0`. This variable can hold multiple implementations which may be tailored for specific setups.

| Input  | Type      | Description                      |
| ------ | --------- | -------------------------------- |
| `arg0` | `uint256` | Index of the pool implementation |

Returns: pool implementation (`address`).

<SourceCode>
```vyper
# index -> implementation address
metapool_implementations: public(HashMap[uint256, address])
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.metapool_implementation(0)
'0x19bd1AB34d6ABB584b9C1D5519093bfAA7f6c7d2'
```


</Example>


::::

### `math_implementations`
::::description[`CurveStableSwapFactoryNG.math_implementations() -> address: view`]


Getter for the math implementation.

Returns: math implementation (`address`).

<SourceCode>
```vyper
# index -> implementation address
math_implementation: public(address)
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.math_implementation()
'0x20D1c021525C85D9617Ccc64D8f547d5f730118A'
```


</Example>


::::

### `gauge_implementations`
::::description[`CurveStableSwapFactoryNG.gauge_implementations() -> address: view`]


Getter for the gauge implementation.

Returns: gauge implementation (`address`).

<SourceCode>
```vyper
# index -> implementation address
gauge_implementation: public(address)
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.gauge_implementation()
'0xF5617D4f7514bE35fce829a1C19AE7f6c9106979'
```


</Example>


::::

### `views_implementation`
::::description[`CurveStableSwapFactoryNG.views_implementations() -> address: view`]


Getter for the views implementation.

Returns: views implementation (`address`).

<SourceCode>
```vyper
# index -> implementation address
views_implementation: public(address)
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.views_implementation()
'0x87DD13Dd25a1DBde0E1EdcF5B8Fa6cfff7eABCaD' 
```


</Example>


::::

## Setting New Implementations

New implementation can be by the `admin` of the contract using the following functions:


### `set_pool_implementations`
::::description[`CurveStableSwapFactoryNG.set_pool_implementations(_implementation_index: uint256, _implementation: address,):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set/add a new pool implementation. Existing implementations can be overritten or additionly implementations at another (not set index) can be added.[^2]

[^2]: This only works for `pool_implementations` and `metapool_implementations`. For other the implementations, only a single contract can be set.

| Input                   | Type      | Description                     |
| ----------------------- | --------- | ------------------------------- |
| `_implementation_index` | `uint256` | Index value at which the new implementation is set   |
| `_implementation`       | `address` | Implementation contract address          |

<SourceCode>
```vyper
# index -> implementation address
pool_implementations: public(HashMap[uint256, address])

@external
def set_pool_implementations(
    _implementation_index: uint256,
    _implementation: address,
):
    """
    @notice Set implementation contracts for pools
    @dev Only callable by admin
    @param _implementation_index Implementation index where implementation is stored
    @param _implementation Implementation address to use when deploying plain pools
    """
    assert msg.sender == self.admin  # dev: admin-only function
    self.pool_implementations[_implementation_index] = _implementation
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.set_pool_implementations('todo')
```


</Example>


::::

### `set_metapool_implementations`
::::description[`CurveStableSwapFactoryNG.set_pool_implementations(_implementation_index: uint256, _implementation: address,):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set/add a new metapool implementation. Existing implementations can be overritten or additionly implementations at another (not set index) can be added.[^3]

[^3]: This only works for `pool_implementations` and `metapool_implementations`. For other the implementations, only a single contract can be set.

| Input                   | Type      | Description                     |
| ----------------------- | --------- | ------------------------------- |
| `_implementation_index` | `uint256` | Index value at which the new implementation is set   |
| `_implementation`       | `address` | Implementation contract address          |

<SourceCode>
```vyper
# index -> implementation address
pool_implementations: public(HashMap[uint256, address])
metapool_implementations: public(HashMap[uint256, address])
math_implementation: public(address)
gauge_implementation: public(address)
views_implementation: public(address)

@external
def set_metapool_implementations(
    _implementation_index: uint256,
    _implementation: address,
):
    """
    @notice Set implementation contracts for metapools
    @dev Only callable by admin
    @param _implementation_index Implementation index where implementation is stored
    @param _implementation Implementation address to use when deploying meta pools
    """
    assert msg.sender == self.admin  # dev: admin-only function
    self.metapool_implementations[_implementation_index] = _implementation
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.set_metapool_implementations('todo')
```


</Example>


::::

### `set_math_implementation`
::::description[`CurveStableSwapFactoryNG.set_math_implementation(_math_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new math implementation. There can only be one math implementation.

| Input                  | Type      | Description                              |
| ---------------------- | --------- | ---------------------------------------- | 
| `_math_implementation` | `address` | New math implementation contract address |

<SourceCode>
```vyper
# index -> implementation address
pool_implementations: public(HashMap[uint256, address])
metapool_implementations: public(HashMap[uint256, address])
math_implementation: public(address)
gauge_implementation: public(address)
views_implementation: public(address)

@external
def set_math_implementation(_math_implementation: address):
    """
    @notice Set implementation contracts for StableSwap Math
    @dev Only callable by admin
    @param _math_implementation Address of the math implementation contract
    """
    assert msg.sender == self.admin  # dev: admin-only function
    self.math_implementation = _math_implementation
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.set_math_implementations('todo')
```


</Example>


::::

### `set_gauge_implementations`
::::description[`CurveStableSwapFactoryNG.set_gauge_implementation(_gauge_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract. There can only be one gauge implementation.


:::

Function to set a new gauge implementation.

| Input                   | Type      | Description                               |
| ----------------------- | --------- | ----------------------------------------- | 
| `_gauge_implementation` | `address` | New gauge implementation contract address |

<SourceCode>
```vyper
# index -> implementation address
pool_implementations: public(HashMap[uint256, address])
metapool_implementations: public(HashMap[uint256, address])
math_implementation: public(address)
gauge_implementation: public(address)
views_implementation: public(address)

@external
def set_gauge_implementation(_gauge_implementation: address):
    """
    @notice Set implementation contracts for liquidity gauge
    @dev Only callable by admin
    @param _gauge_implementation Address of the gauge blueprint implementation contract
    """
    assert msg.sender == self.admin  # dev: admin-only function
    self.gauge_implementation = _gauge_implementation
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.set_gauge_implementations('todo')
```


</Example>


::::

### `set_views_implementation`
::::description[`CurveStableSwapFactoryNG.set_views_implementation(_views_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract. There can only be one views implementation.


:::

Function to set a new views implementation.

| Input                   | Type      | Description                               |
| ----------------------- | --------- | ----------------------------------------- | 
| `_views_implementation` | `address` | New views implementation contract address |

<SourceCode>
```vyper
# index -> implementation address
pool_implementations: public(HashMap[uint256, address])
metapool_implementations: public(HashMap[uint256, address])
math_implementation: public(address)
gauge_implementation: public(address)
views_implementation: public(address)

@external
def set_views_implementation(_views_implementation: address):
    """
    @notice Set implementation contracts for Views methods
    @dev Only callable by admin
    @param _views_implementation Implementation address of views contract
    """
    assert msg.sender == self.admin  # dev: admin-only function
    self.views_implementation = _views_implementation
```
</SourceCode>

<Example>


```shell
>>> CurveStableSwapFactoryNG.set_views_implementations('todo')
```


</Example>


::::

---


## Deployer API

### Name and Symbol

The input values of `_name` or `_symbol` are obviously non-trivial for the performance of the pool. These parameters should visualize, what kind of tokens are included in the pool.

```shell
_name = "rETH/wETH Pool"
_symbol = "rETH/wETH"
```

---

### Coins`_coins` includes all tokens included in the pool as a `DynArray`.

```shell
_coins = ["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0xae78736Cd615f374D3085123A210448E74Fc6393"]
```

---

### A, Fee, Off-Peg Fee Multiplier, and MA-Exp-Time

- `_A` represents the amplification coefficient of the pool, signifying its density.
- `_fee` is referred to as the "base fee."
- The `offpeg_fee_multiplier` parameter enables the system to dynamically adjust fees according to the pool's state.
- `ma_exp_time` denotes the time window for the moving average oracle.


*Recommended Parameters*:

| Parameter              | Fiat-Redeemable Stablecoin | Crypto-Collateralized Stablecoin |
| :--------------------- | :------------------------: | :------------------------------: |
| `A`                    |                        200 |                              100 |
| `fee`                  |                      0.04% |                            0.04% |
| `offpeg_fee_multiplier`|                          2 |                                2 |
| `ma_exp_time`          |                        866 |                              866 |


```shell
_A = 200
_fee = 4000000                                          # 0.0001 or 0.01%
_offpeg_fee_multiplier = 20000000000                    # 5 or 500%
_ma_exp_time = 866                                      # ~600 seconds
```

:::note[Parameter Precision]

The precision of `_fee` and `_offpeg_fee_multiplier` is 1e10.
The time window of the moving average exponential oracle is calculated using `time_in_seconds / ln(2)`.


:::

---

### Implemention ID

Pools are **created from implementation contracts**(blueprints). These contracts are added to the Factory and must be choosen when deploying a pool.

:::warning

The Factory can have **multiple plain- and meta-pool implementations**. If there are multiple implementations for a plain or meta-pool, it's important to understand the differences and determine which one is suitable.
Additionally, implementation contracts are **upgradable**. They can either be replaced or have additional implementation contracts set. Please always make sure to check the most recent ones.

To query the factory-specific implementations:

```shell
>>> Factory.pool_implementation(0)
'0xDCc91f930b42619377C200BA05b7513f2958b202'

>>> Factory.metapool_implementation(0)
'0xede71F77d7c900dCA5892720E76316C6E575F0F7'
```


:::

---

### Assets Types

Stableswap-NG infrastructure supports pools with the following asset types:

| Asset Type  | Description            |
| :---------: | ---------------------- |
| `0`         | **Standard ERC-20**token with no additional features |
| `1`         | **Oracle**- token with rate oracle (e.g. wstETH) |
| `2`         | **Rebasing**- token with rebase (e.g. stETH) |
| `3`         | **ERC4626**- token with *`convertToAssets`* method (e.g. sDAI) |

*Consequently, supported tokens include:*

- ERC-20 support for return `True/revert`, `True/False` or `None`
- ERC-20 tokens can have *arbitrary decimals (≤18)*
- ERC-20 tokens that *rebase* (either positive or fee on transfer)
- ERC-20 tokens that have a *rate oracle* (e.g. wstETH, cbETH) Oracle precision must be $10^{18}$
- ERC-4626 tokens with *arbitrary percision* (≤18) of Vault token and underlying asset

:::warning

- **`ERC20:`**Users are advised to do careful due-diligence on ERC20 tokens that they interact with, as this contract **cannot differentiate between harmless and malicious**ERC20 tokens.
- **`Oracle:`**When using tokens with oracles, its important to know that they **may be controlled externally by an EOA**.
- **`Rebasing:`**Users and Integrators are advised to understand how the AMM contract works with rebasing balances.
- **`ERC4626:`**Some ERC4626 implementations **may be susceptible to Donation/Inflation attacks**. Users are advised to proceed with caution.


:::

Choosing asset types can sometimes be quite tricky. Asset types should be seen more as information for the AMM on **how to treat the assets under the hood**.

:::example

Let's consider the example of [rmETH/mETH](https://etherscan.io/address/0xdd4316c777a2295d899ba7ad92e0efa699865f43).
- [mETH](https://etherscan.io/address/0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa) is a token with a rate oracle (the underlying asset is ETH). The rate can be fetched by reading the `mETHToETH` method within the [staking contract](https://etherscan.io/address/0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f).
- rmETH is a rebasing token.

Because the deployer wants rmETH and mETH to trade as close to 1:1 as possible, they need to treat mETH like a regular ERC-20 token (asset type 0), instead of a rate oraclized token (asset type 1).


```shell
_asset_types = [0, 2]   # coin(0) = asset type 0; coin(1) = asset type 2
```


:::

---

### Method IDs and Rate Oracles

`method_ids` and `_oracles` are required for rate oracles to function. ERC-4626 does not need either of these. The sole requirement for those is to have a `convertToAssets` method.


:::info

When deploying pools that include coins not requiring a rate oracle, **`b""`**or **`0x00000000`**should be included in the `_methods_id` array and the **`ZERO_ADDRESS`**should be used in the `_oracles` array as placeholders for each coin.


:::

- `_method_ids` is the first four bytes of the Keccak-256 hash of the function signatures of the oracle addresses that give rate oracles.

    As an example, lets look  at the [rETH](https://etherscan.io/token/0xae78736cd615f374d3085123a210448e74fc6393) token. The relevant function which returns the rate is `getExchangeRate`, the according first four bytes of the Keccak-256 hash of the functions signature is therefore `0xe6aa216c`. When calculating, its always important to include `"()"`, as they will change the bytes.

    ```shell
    getExchangeRate      ->  "0xb2fc0e3e"           # wrong
    getExchangeRate()    ->  "0xe6aa216c"           # correct
    ```

    [Method ID Calculator](https://piyolab.github.io/playground/ethereum/getEncodedFunctionSignature/)

- `_oracles` is simply the contract address which provides the rate oracle function.


The input values are `DynArrays` with the length of tokens in the pool. Therefore, a rETH/wETH pool would have the following input values:

```shell
_method_id = [b"", "0xe6aa216c"]
_oracles = ["0x0000000000000000000000000000000000000000", "0xae78736cd615f374d3085123a210448e74fc6393"]
```

#### Examples

| Pool | Asset Types | Method ID's | Rate Oracle |
| :---: | :--------: | :---------: | :---------: |
| [mkUSD/USDC](https://etherscan.io/tx/0xf980b4a4194694913af231de69ab4593f5e0fcdc) | `[0, 0]` | `['0x00000000', '0x00000000']` | `['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000']` |
| [FRAX/sDAI](https://etherscan.io/tx/0xce6431d21e3fb1036ce9973a3312368ed96f5ce7) | `[0, 3]` | `['0x00000000', '0x00000000']` | `['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000']` |
| [wETH/rETH](https://etherscan.io/tx/0x9efe1a1cbd6ca51ee8319afc4573d253c3b732af) | `[0 , 1]` | `['0x00000000', '0xe6aa216c']` | `['0x0000000000000000000000000000000000000000', '0xae78736Cd615f374D3085123A210448E74Fc6393']` |
| [rmETH/mETH](https://etherscan.io/address/0xdd4316c777a2295d899ba7ad92e0efa699865f43) | `[2 , 0]` | `['0x00000000', '0x00000000']` | `['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000']` |


---


## Deploying Plain- and Metapools

### `deploy_plain_pool`

*Parameter limitations when deploying a plain pool:*

- Minimum of 2 and maximum of 8 coins.
- All coin arrays should be the same length.
- `_fee` ≤ 100000000 (1%).
- `_offpeg_fee_multiplier` * `_fee` ≤ `MAX_FEE` * `FEE_DENOMINATOR`.
- Maximum of 18 decimals for a coin.
- No duplicate coins.
- Valid implementation index.

::::description[`Factory.deploy_plain_pool(_name: String[32], _symbol: String[10], _coins: DynArray[address, MAX_COINS], _A: uint256, _fee: uint256, _offpeg_fee_multiplier: uint256, _ma_exp_time: uint256, _implementation_idx: uint256, _asset_types: DynArray[uint8, MAX_COINS], _method_ids: DynArray[bytes4, MAX_COINS], _oracles: DynArray[address, MAX_COINS], ) -> address:`]


Function to deploy a stableswap-ng plain pool. The pool is created from a blueprint contract.

| Input                | Type                         | Description |
| -------------------- | ---------------------------- | ----------- |
| `_name`              | `String[32]`                 | Name of the new plain pool |
| `_symbol`            | `String[10]`                 | Symbol for the new pool's LP token; this value will be concatenated with the factory symbol |
| `_coins`             | `DynArray[address, MAX_COINS]` | Array of addresses of the coins being used in the pool |
| `_A`                 | `uint256`                    | Amplification coefficient |
| `_fee`               | `uint256`                    | Trade fee, given as an integer with `1e10` precision |
| `_offpeg_fee_multiplier` | `uint256`               | Off-peg fee multiplier |
| `_ma_exp_time`       | `uint256`                    | MA time; set as time_in_seconds / ln(2) |
| `_implementation_idx` | `uint256`                  | Index of the implementation to use |
| `_asset_types`       | `DynArray[uint8, MAX_COINS]` | Asset type of the pool as an integer; more [here](../../stableswap-ng/overview.md#supported-assets) |
| `_method_ids`        | `DynArray[bytes4, MAX_COINS]` | Array of first four bytes of the Keccak-256 hash of the function signatures of the oracle addresses that give rate oracles |
| `_oracles`           | `DynArray[address, MAX_COINS]` | Array of rate oracle addresses |

Returns: Deployed pool (`address`).

Emits: `PlainPoolDeployed`

:::info[Implementation ID]

There might be multiple pool implementations. To query all available ones, see [above](#query-implementations). As of the current date (31.10.2023), there is only one pool implementation available. Since the `_implementation_idx` starts at 0, users need to input "0" when deploying a pool.


:::

<SourceCode>
```vyper
event PlainPoolDeployed:
    coins: DynArray[address, MAX_COINS]
    A: uint256
    fee: uint256
    deployer: address

MAX_COINS: constant(uint256) = 8

MAX_FEE: constant(uint256) = 5 * 10 **9
FEE_DENOMINATOR: constant(uint256) = 10 **10

@external
def deploy_plain_pool(
    _name: String[32],
    _symbol: String[10],
    _coins: DynArray[address, MAX_COINS],
    _A: uint256,
    _fee: uint256,
    _offpeg_fee_multiplier: uint256,
    _ma_exp_time: uint256,
    _implementation_idx: uint256,
    _asset_types: DynArray[uint8, MAX_COINS],
    _method_ids: DynArray[bytes4, MAX_COINS],
    _oracles: DynArray[address, MAX_COINS],
) -> address:
    """
    @notice Deploy a new plain pool
    @param _name Name of the new plain pool
    @param _symbol Symbol for the new plain pool - will be
                concatenated with factory symbol
    @param _coins List of addresses of the coins being used in the pool.
    @param _A Amplification co-efficient - a lower value here means
            less tolerance for imbalance within the pool's assets.
            Suggested values include:
            * Uncollateralized algorithmic stablecoins: 5-10
            * Non-redeemable, collateralized assets: 100
            * Redeemable assets: 200-400
    @param _fee Trade fee, given as an integer with 1e10 precision. The
                maximum is 1% (100000000). 50% of the fee is distributed to veCRV holders.
    @param _ma_exp_time Averaging window of oracle. Set as time_in_seconds / ln(2)
                        Example: for 10 minute EMA, _ma_exp_time is 600 / ln(2) ~= 866
    @param _implementation_idx Index of the implementation to use
    @param _asset_types Asset types for pool, as an integer
    @param _method_ids Array of first four bytes of the Keccak-256 hash of the function signatures
                    of the oracle addresses that gives rate oracles.
                    Calculated as: keccak(text=event_signature.replace(" ", ""))[:4]
    @param _oracles Array of rate oracle addresses.
    @return Address of the deployed pool
    """
    assert len(_coins) >= 2  # dev: pool needs to have at least two coins!
    assert len(_coins) == len(_method_ids)  # dev: All coin arrays should be same length
    assert len(_coins) ==  len(_oracles)  # dev: All coin arrays should be same length
    assert len(_coins) ==  len(_asset_types)  # dev: All coin arrays should be same length
    assert _fee <= 100000000, "Invalid fee"
    assert _offpeg_fee_multiplier * _fee <= MAX_FEE * FEE_DENOMINATOR

    n_coins: uint256 = len(_coins)
    _rate_multipliers: DynArray[uint256, MAX_COINS] = empty(DynArray[uint256, MAX_COINS])
    decimals: DynArray[uint256, MAX_COINS] = empty(DynArray[uint256, MAX_COINS])

    for i in range(MAX_COINS):
        if i == n_coins:
            break

        coin: address = _coins[i]

        decimals.append(ERC20(coin).decimals())
        assert decimals[i] < 19, "Max 18 decimals for coins"

        _rate_multipliers.append(10 **(36 - decimals[i]))

        for j in range(i, i + MAX_COINS):
            if (j + 1) == n_coins:
                break
            assert coin != _coins[j+1], "Duplicate coins"

    implementation: address = self.pool_implementations[_implementation_idx]
    assert implementation != empty(address), "Invalid implementation index"

    pool: address = create_from_blueprint(
        implementation,
        _name,                                          # _name: String[32]
        _symbol,                                        # _symbol: String[10]
        _A,                                             # _A: uint256
        _fee,                                           # _fee: uint256
        _offpeg_fee_multiplier,                         # _offpeg_fee_multiplier: uint256
        _ma_exp_time,                                   # _ma_exp_time: uint256
        _coins,                                         # _coins: DynArray[address, MAX_COINS]
        _rate_multipliers,                              # _rate_multipliers: DynArray[uint256, MAX_COINS]
        _asset_types,                                   # _asset_types: DynArray[uint8, MAX_COINS]
        _method_ids,                                    # _method_ids: DynArray[bytes4, MAX_COINS]
        _oracles,                                       # _oracles: DynArray[address, MAX_COINS]
        code_offset=3
    )

    length: uint256 = self.pool_count
    self.pool_list[length] = pool
    self.pool_count = length + 1
    self.pool_data[pool].decimals = decimals
    self.pool_data[pool].n_coins = n_coins
    self.pool_data[pool].base_pool = empty(address)
    self.pool_data[pool].implementation = implementation
    self.pool_data[pool].asset_types = _asset_types

    for i in range(MAX_COINS):
        if i == n_coins:
            break

        coin: address = _coins[i]
        self.pool_data[pool].coins.append(coin)

        for j in range(i, i + MAX_COINS):
            if (j + 1) == n_coins:
                break
            swappable_coin: address = _coins[j + 1]
            key: uint256 = (convert(coin, uint256) ^ convert(swappable_coin, uint256))
            length = self.market_counts[key]
            self.markets[key][length] = pool
            self.market_counts[key] = length + 1

    log PlainPoolDeployed(_coins, _A, _fee, msg.sender)
    return pool
```
</SourceCode>

<Example>


```shell
>>> Factory.deploy_plain_pool(
    "crvusd/USDT",  # _name
    "crvusd-usdt",  # _symbol
    [ # coins:
        "0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E", # crvusd
        "0xdAC17F958D2ee523a2206206994597C13D831ec7" # usdt
    ],
    1500 # _A
    1000000, # _fee
    20000000000, # _offpeg_fee_multiplier
    865, # _ma_exp_time
    0, # _implementation_idx
    [0, 0], # _asset_types
    [b"", b""], # _method_ids
    ["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000"] # _oracles
)

'returns address of the deployed plain pool'
```


</Example>


::::

### `deploy_metapool`

*Parameter limitations when deploying a meta pool:*

- Cannot pair against a token that is included in the base pool.
- `_fee` ≤ 100000000 (1%).
- `_offpeg_fee_multiplier` * `_fee` ≤ `MAX_FEE` * `FEE_DENOMINATOR`.
- Valid implementation index.
- Maximum of 18 decimals for a coin.

::::description[`Factory.deploy_metapool(_base_pool: address, _name: String[32], _symbol: String[10], _coin: address, _A: uint256, _fee: uint256, _offpeg_fee_multiplier: uint256, _ma_exp_time: uint256, _implementation_idx: uint256, _asset_type: uint8, _method_id: bytes4, _oracle: address) -> address:`]


Function to deploy a stableswap-ng metapool.

| Input                | Type          | Description |
| -------------------- | ------------- | ----------- |
| `_base_pool`         | `address`     | Address of the base pool to pair the token with |
| `_name`              | `String[32]`  | Name of the new metapool |
| `_symbol`            | `String[10]`  | Symbol for the new metapool's LP token - will be concatenated with the base pool symbol |
| `_coin`              | `address`     | Address of the coin being used in the metapool |
| `_A`                 | `uint256`     | Amplification coefficient |
| `_fee`               | `uint256`     | Trade fee, given as an integer with `1e10` precision |
| `_offpeg_fee_multiplier` | `uint256` | Off-peg multiplier |
| `_ma_exp_time`       | `uint256`     | MA time; set as time_in_seconds / ln(2) |
| `_implementation_idx` | `uint256`    | Index of the implementation to use |
| `_asset_type`        | `uint8`       | Asset type of the pool as an integer; more [here](../../stableswap-ng/overview.md#supported-assets) |
| `_method_id`         | `bytes4`      | First four bytes of the Keccak-256 hash of the function signatures of the oracle addresses that give rate oracles |
| `_oracle`            | `address`     | Rate oracle address |

Returns: Deployed metapool (`address`).

Emits: `MetaPoolDeployed`

:::info[Implementation ID]

There might be multiple metapool implementations. To query all available ones, see [above](#query-implementations). As of the current date (31.10.2023), there is only one metapool implementation available. Since the **`_implementation_idx`**starts at 0, users need to input "0" when deploying a pool.


:::

<SourceCode>
```vyper
event MetaPoolDeployed:
    coin: address
    base_pool: address
    A: uint256
    fee: uint256
    deployer: address

MAX_COINS: constant(uint256) = 8

MAX_FEE: constant(uint256) = 5 * 10 **9
FEE_DENOMINATOR: constant(uint256) = 10 **10

@external
def deploy_metapool(
    _base_pool: address,
    _name: String[32],
    _symbol: String[10],
    _coin: address,
    _A: uint256,
    _fee: uint256,
    _offpeg_fee_multiplier: uint256,
    _ma_exp_time: uint256,
    _implementation_idx: uint256,
    _asset_type: uint8,
    _method_id: bytes4,
    _oracle: address,
) -> address:
    """
    @notice Deploy a new metapool
    @param _base_pool Address of the base pool to use
                    within the metapool
    @param _name Name of the new metapool
    @param _symbol Symbol for the new metapool - will be
                concatenated with the base pool symbol
    @param _coin Address of the coin being used in the metapool
    @param _A Amplification co-efficient - a higher value here means
            less tolerance for imbalance within the pool's assets.
            Suggested values include:
            * Uncollateralized algorithmic stablecoins: 5-10
            * Non-redeemable, collateralized assets: 100
            * Redeemable assets: 200-400
    @param _fee Trade fee, given as an integer with 1e10 precision. The
                the maximum is 1% (100000000).
                50% of the fee is distributed to veCRV holders.
    @param _ma_exp_time Averaging window of oracle. Set as time_in_seconds / ln(2)
                        Example: for 10 minute EMA, _ma_exp_time is 600 / ln(2) ~= 866
    @param _implementation_idx Index of the implementation to use
    @param _asset_type Asset type for token, as an integer
    @param _method_id  First four bytes of the Keccak-256 hash of the function signatures
                    of the oracle addresses that gives rate oracles.
                    Calculated as: keccak(text=event_signature.replace(" ", ""))[:4]
    @param _oracle Rate oracle address.
    @return Address of the deployed pool
    """
    assert not self.base_pool_assets[_coin], "Invalid asset: Cannot pair base pool asset with base pool's LP token"
    assert _fee <= 100000000, "Invalid fee"
    assert _offpeg_fee_multiplier * _fee <= MAX_FEE * FEE_DENOMINATOR

    base_pool_n_coins: uint256 = len(self.base_pool_data[_base_pool].coins)
    assert base_pool_n_coins != 0, "Base pool is not added"

    implementation: address = self.metapool_implementations[_implementation_idx]
    assert implementation != empty(address), "Invalid implementation index"

    # things break if a token has >18 decimals
    decimals: uint256 = ERC20(_coin).decimals()
    assert decimals < 19, "Max 18 decimals for coins"

    # combine _coins's _asset_type and basepool coins _asset_types:
    base_pool_asset_types: DynArray[uint8, MAX_COINS] = self.base_pool_data[_base_pool].asset_types
    asset_types: DynArray[uint8, MAX_COINS]  = [_asset_type, 0]

    for i in range(0, MAX_COINS):
        if i == base_pool_n_coins:
            break
        asset_types.append(base_pool_asset_types[i])

    _coins: DynArray[address, MAX_COINS] = [_coin, self.base_pool_data[_base_pool].lp_token]
    _rate_multipliers: DynArray[uint256, MAX_COINS] = [10 **(36 - decimals), 10 **18]
    _method_ids: DynArray[bytes4, MAX_COINS] = [_method_id, empty(bytes4)]
    _oracles: DynArray[address, MAX_COINS] = [_oracle, empty(address)]

    pool: address = create_from_blueprint(
        implementation,
        _name,                                          # _name: String[32]
        _symbol,                                        # _symbol: String[10]
        _A,                                             # _A: uint256
        _fee,                                           # _fee: uint256
        _offpeg_fee_multiplier,                         # _offpeg_fee_multiplier: uint256
        _ma_exp_time,                                   # _ma_exp_time: uint256
        self.math_implementation,                       # _math_implementation: address
        _base_pool,                                     # _base_pool: address
        _coins,                                         # _coins: DynArray[address, MAX_COINS]
        self.base_pool_data[_base_pool].coins,          # base_coins: DynArray[address, MAX_COINS]
        _rate_multipliers,                              # _rate_multipliers: DynArray[uint256, MAX_COINS]
        asset_types,                                    # asset_types: DynArray[uint8, MAX_COINS]
        _method_ids,                                    # _method_ids: DynArray[bytes4, MAX_COINS]
        _oracles,                                       # _oracles: DynArray[address, MAX_COINS]
        code_offset=3
    )

    # add pool to pool_list
    length: uint256 = self.pool_count
    self.pool_list[length] = pool
    self.pool_count = length + 1

    base_lp_token: address = self.base_pool_data[_base_pool].lp_token

    self.pool_data[pool].decimals = [decimals, 18, 0, 0, 0, 0, 0, 0]
    self.pool_data[pool].n_coins = 2
    self.pool_data[pool].base_pool = _base_pool
    self.pool_data[pool].coins = [_coin, self.base_pool_data[_base_pool].lp_token]
    self.pool_data[pool].implementation = implementation

    is_finished: bool = False
    swappable_coin: address = empty(address)
    for i in range(MAX_COINS):
        if i < len(self.base_pool_data[_base_pool].coins):
            swappable_coin = self.base_pool_data[_base_pool].coins[i]
        else:
            is_finished = True
            swappable_coin = base_lp_token

        key: uint256 = (convert(_coin, uint256) ^ convert(swappable_coin, uint256))
        length = self.market_counts[key]
        self.markets[key][length] = pool
        self.market_counts[key] = length + 1

        if is_finished:
            break

    log MetaPoolDeployed(_coin, _base_pool, _A, _fee, msg.sender)
    return pool
```
</SourceCode>

<Example>


```shell
>>> Factory.deploy_metapool(
    "0xbebc44782c7db0a1a60cb6fe97d0b483032ff1c7", # _base_pool
    "crvusd/3CRV", # _name
    "crvusd-3crv" # _symbol
    "0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E", # _coin
    1500 # _A
    1000000, # _fee
    20000000000, # _offpeg_fee_multiplier
    865, # _ma_exp_time
    0, # _implementation_idx
    0, # _asset_type
    "b""", # _method_id
    "0x0000000000000000000000000000000000000000" # _oracle
)

'returns address of the deployed metapool'
```


</Example>


::::

---

## Deploying Liquidity Gauges

Liquidity gauges for pools can also be deployed from this contract, but deploying gauges through a factory contract is only possible using the same factory contract that was used for deploying the pool. This feature is only available on the Ethereum mainnet, as liquidity gauges on sidechains need to be deployed through the [RootChainGaugeFactory](../../../gauges/xchain-gauges/root-gauge-factory.md).


### `deploy_gauge`
::::description[`Factory.deploy_gauge(_pool: address) -> address:`]


Function to deploy a gauge. The Factory utilizes the `gauge_implementation` to create the contract from a blueprint.

| Input    | Type      | Description                           |
| -------- | --------- | ------------------------------------- |
| `_pool`  | `address` | Pool address to deploy the gauge for  |

Returns: deployed gauge (`address`).

Emits: `LiquidityGaugeDeployed`

<SourceCode>
```vyper
event LiquidityGaugeDeployed:
    pool: address
    gauge: address

@external
def deploy_gauge(_pool: address) -> address:
    """
    @notice Deploy a liquidity gauge for a factory pool
    @param _pool Factory pool address to deploy a gauge for
    @return Address of the deployed gauge
    """
    assert self.pool_data[_pool].coins[0] != empty(address), "Unknown pool"
    assert self.pool_data[_pool].liquidity_gauge == empty(address), "Gauge already deployed"
    implementation: address = self.gauge_implementation
    assert implementation != empty(address), "Gauge implementation not set"

    gauge: address = create_from_blueprint(self.gauge_implementation, _pool, code_offset=3)
    self.pool_data[_pool].liquidity_gauge = gauge

    log LiquidityGaugeDeployed(_pool, gauge)
    return gauge
```
</SourceCode>

<Example>


```shell
>>> Factory.deploy_gauge("0x36DfE783603522566C046Ba1Fa403C8c6F569220")
'returns address of the deployed gauge'
```


</Example>


::::
