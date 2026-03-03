# Pool Factory: Overview


The Tricrypto-NG Factory allows the permissionless deployment of two-coin volatile asset pools, as well as gauges. **The liquidity pool and LP token share the same contract.**Additionally, the Factory contract is the direct admin and fee receiver of all pools. In turn, the Factory is controlled by the CurveDAO. 

:::deploy[Contract Source & Deployment]

Source code for this contract is available on [Github](https://github.com/curvefi/tricrypto-ng/blob/main/contracts/main/CurveTricryptoFactory.vy).  
A list of all deployed contracts can be found [here](../../../deployments.md).


:::

---


## Implementations**The Tricrypto-NG Factory makes use of blueprint contracts to deploy its contracts from the implementations.**:::warning

**Implementation contracts are upgradable.**They can either be replaced, or additional implementation contracts can be added. Therefore, please always make sure to check the most recent ones.


:::

It utilizes four different implementations:

- `pool_implementations`, containing multiple blueprint contracts that are used to deploy the pools.
- `gauge_implementation`, containing a blueprint contract that is used when deploying gauges for pools.
- `views_implementation`, containing a view methods contract relevant for integrators and users looking to interact with the AMMs.
- `math_implementation`, containing math functions used in the AMM.

*More on the [**Math Implementation**](../../tricrypto-ng/utility-contracts/math.md) and [**Views Implementation**](../../tricrypto-ng/utility-contracts/views.md).* 


## Query Implementations

### `pool_implementation`
::::description[`Factory.pool_implementations(arg0: uint256) -> address: view`]


Getter for the current pool implementation contract. This accounts for variations such as two-coin and three-pool pools.

| Input   | Type      | Description   |
| ------- | --------- | ------------- |
| `arg0`  | `uint256` | Index         |

Returns: Pool blueprint contract (`address`).


<SourceCode>


```vyper
pool_implementations: public(HashMap[uint256, address])
```


</SourceCode>

<Example>


```shell
>>> Factory.pool_implementation(0)
'0x66442B0C5260B92cAa9c234ECf2408CBf6b19a6f'
```


</Example>


::::

### `gauge_implementation`
::::description[`Factory.gauge_implementation() -> address: view`]


Getter for the current gauge implementation contract.

Returns: Gauge blueprint contract (`address`).

<SourceCode>


```vyper
gauge_implementation: public(address)
```


</SourceCode>

<Example>


```shell
>>> Factory.gauge_implementation()
'0x5fC124a161d888893529f67580ef94C2784e9233'
```


</Example>


::::

### `views_implementation`
::::description[`Factory.views_implementation() -> address: view`]


Getter for the current views implementation contract.

Returns: Views blueprint contract (`address`).

<SourceCode>


```vyper
views_implementation: public(address)
```


</SourceCode>

<Example>


```shell
>>> Factory.views_implementation()
'0x064253915b8449fdEFac2c4A74aA9fdF56691a31'
```


</Example>


::::

### `math_implementation`
::::description[`Factory.math_implementation() -> address: view`]


Getter for the current pool implementation contract.

Returns: Math blueprint contract (`address`).

<SourceCode>


```vyper
math_implementation: public(address)
```


</SourceCode>

<Example>


```shell
>>> Factory.math_implementation()
'0xcBFf3004a20dBfE2731543AA38599A526e0fD6eE'
```


</Example>


::::

## Set New Implementations*New implementations can be set via these admin-only functions:*

### `set_pool_implementation`
::::description[`Factory.set_pool_implementation(_pool_implementation: address, _implementation_index: uint256):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a `_pool_implementation` for `_implementation_index`.

| Input                   | Type      | Description               |
| ----------------------- | --------- | ------------------------- |
| `_pool_implementation`  | `address` | New pool implementation   |
| `_implementation_index` | `uint256` | Index                     |

Emits event: `UpdatePoolImplementation`


<SourceCode>


```vyper
event UpdatePoolImplementation:
    _implemention_id: uint256
    _old_pool_implementation: address
    _new_pool_implementation: address

pool_implementations: public(HashMap[uint256, address])

@external
def set_pool_implementation(
    _pool_implementation: address, _implementation_index: uint256
):
    """
    @notice Set pool implementation
    @dev Set to empty(address) to prevent deployment of new pools
    @param _pool_implementation Address of the new pool implementation
    @param _implementation_index Index of the pool implementation
    """
    assert msg.sender == self.admin, "dev: admin only"

    log UpdatePoolImplementation(
        _implementation_index,
        self.pool_implementations[_implementation_index],
        _pool_implementation
    )

    self.pool_implementations[_implementation_index] = _pool_implementation
```


</SourceCode>

<Example>

```shell
>>> Factory.set_pool_implementation("todo")
'todo'
```


</Example>


::::

### `set_gauge_implementation`
::::description[`Factory.set_gauge_implementation(_gauge_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new `_gauge_implementation`.

| Input                    | Type      | Description               |
| ------------------------ | --------- | ------------------------- |
| `_gauge_implementation`  | `address` | Gauge blueprint contract  |

Emits event: `UpdateGaugeImplementation`

<SourceCode>


```vyper
event UpdateGaugeImplementation:
    _old_gauge_implementation: address
    _new_gauge_implementation: address

gauge_implementation: public(address)

@external
def set_gauge_implementation(_gauge_implementation: address):
    """
    @notice Set gauge implementation
    @dev Set to empty(address) to prevent deployment of new gauges
    @param _gauge_implementation Address of the new token implementation
    """
    assert msg.sender == self.admin, "dev: admin only"

    log UpdateGaugeImplementation(self.gauge_implementation, _gauge_implementation)
    self.gauge_implementation = _gauge_implementation
```


</SourceCode>

<Example>

```shell
>>> Factory.set_gauge_implementation("todo")
'todo'
```


</Example>


::::

### `set_views_implementation`
::::description[`Factory.set_views_implementation(_views_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new `_views_implementation`.

| Input                     | Type      | Description              |
| ------------------------- | --------- | ------------------------ |
| `_views_implementation`   | `address` | Views blueprint contract |

Emits event: `UpdateViewsImplementation`

<SourceCode>


```vyper
event UpdateViewsImplementation:
    _old_views_implementation: address
    _new_views_implementation: address

views_implementation: public(address)

@external
def set_views_implementation(_views_implementation: address):
    """
    @notice Set views contract implementation
    @param _views_implementation Address of the new views contract
    """
    assert msg.sender == self.admin,  "dev: admin only"

    log UpdateViewsImplementation(self.views_implementation, _views_implementation)
    self.views_implementation = _views_implementation
```


</SourceCode>

<Example>

```shell
>>> Factory.set_views_implementation("todo")
'todo'
```


</Example>


::::

### `set_math_implementation`
::::description[`Factory.set_math_implementation(_math_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new `_math_implementation`.

| Input                    | Type      | Description              |
| ------------------------ | --------- | ------------------------ |
| `_math_implementation`   | `address` | Math blueprint contract  |

Emits event: `UpdateMathImplementation`

<SourceCode>


```vyper
event UpdateMathImplementation:
    _old_math_implementation: address
    _new_math_implementation: address

math_implementation: public(address)

@external
def set_math_implementation(_math_implementation: address):
    """
    @notice Set math implementation
    @param _math_implementation Address of the new math contract
    """
    assert msg.sender == self.admin, "dev: admin only"

    log UpdateMathImplementation(self.math_implementation, _math_implementation)
    self.math_implementation = _math_implementation
```


</SourceCode>

<Example>

```shell
>>> Factory.set_math_implementation("todo")
'todo'
```


</Example>


::::

---


## Deploying Pools

:::warning

The transaction will revert if the following requirements are not met.


:::

### `deploy_pool`

The pool **deployment is permissionless**, but it must adhere to certain parameter limitations:

| Parameter            | Limitation                                           |
| -------------------- | ---------------------------------------------------- |
| `A`                  | A_min - 1 < A < A_max + 1                            |
| `gamma`              | gamma_min - 1 < gamma < gamma_max + 1                |
| `mid_fee`            | mid_fee < fee_max - 1; (mid_fee can be 0)            |
| `out_fee`            | out_fee >= mid_fee AND out_fee < fee_max - 1         |
| `fee_gamma`          | 0 < fee_gamma < 10^18 + 1                            |
| `allowed_extra_profit` | allowed_extra_profit < 10^18 + 1                  |
| `adjustment_step`    | 0 < adjustment_step < 10^18 + 1                      |
| `ma_exp_time`        | 86 < ma_exp_time < 872542                            |
| `initial_prices`     | 10^6 < initial_prices[0] and initial_prices[1] < 10^30 |

- Three coins; no duplicate coins possible.
- **`implementation_id`**cannot be **`ZERO_ADDRESS`**.

*With:*

| Parameters       | Value                                    |
| ---------------- | ---------------------------------------- |
| n_coins          | 3                                        |
| A_multiplier     | 10000                                    |
| A_min            | n_coins^n_coins * A_multiplier = 270000  |
| A_max            | 1000 * A_multiplier * n_coins^n_coins = 270000000 |
| gamma_min        | 10^10 = 10000000000                      |
| gamma_max        | 5 * 10^16 = 50000000000000000            |
| fee_max          | 10 * 10^9 = 10000000000                  |

::::description[`Factory.deploy_pool(_name: String[64], _symbol: String[32], _coins: address[N_COINS], _weth: address, implementation_id: uint256, A: uint256, gamma: uint256, mid_fee: uint256, out_fee: uint256, fee_gamma: uint256, allowed_extra_profit: uint256, adjustment_step: uint256, ma_exp_time: uint256, initial_prices: uint256[N_COINS-1],) -> address:`]


Function to deploy a tricrypto pool.

| Input               | Type                  | Description |
| ------------------- | --------------------- | ----------- |
| `_name`             | `String[64]`          | Pool Name |
| `_symbol`           | `String[32]`          | Pool Symbol |
| `_coins`            | `address[N_COINS]`    | Included Coins |
| `_weth`             | `address`             | WETH Address |
| `implementation_id` | `uint256`             | Index of Pool Implementation |
| `A`                 | `uint256`             | Amplification Factor |
| `gamma`             | `uint256`             | Gamma |
| `mid_fee`           | `uint256`             | Mid Fee |
| `out_fee`           | `uint256`             | Out Fee |
| `fee_gamma`         | `uint256`             | Fee Gamma |
| `allowed_extra_profit` | `uint256`          | Allowed Extra Profit |
| `adjustment_step`   | `uint256`             | Adjustment Step |
| `ma_exp_time`       | `uint256`             | Exponential Moving Average Time |
| `initial_prices`    | `uint256[N_COINS-1]`  | Initial Prices |

Returns: Deployed pool (`address`).

Emits event: `TricryptoPoolDeployed`


<SourceCode>


```vyper hl_lines="1"
event TricryptoPoolDeployed:
    pool: address
    name: String[64]
    symbol: String[32]
    weth: address
    coins: address[N_COINS]
    math: address
    salt: bytes32
    packed_precisions: uint256
    packed_A_gamma: uint256
    packed_fee_params: uint256
    packed_rebalancing_params: uint256
    packed_prices: uint256
    deployer: address

N_COINS: constant(uint256) = 3
A_MULTIPLIER: constant(uint256) = 10000

MAX_FEE: constant(uint256) = 10 * 10 **9

MIN_GAMMA: constant(uint256) = 10 **10
MAX_GAMMA: constant(uint256) = 5 * 10**16

MIN_A: constant(uint256) = N_COINS **N_COINS * A_MULTIPLIER / 100
MAX_A: constant(uint256) = 1000 * A_MULTIPLIER * N_COINS**N_COINS

PRICE_SIZE: constant(uint128) = 256 / (N_COINS - 1)
PRICE_MASK: constant(uint256) = 2**PRICE_SIZE - 1

@external
def deploy_pool(
    _name: String[64],
    _symbol: String[32],
    _coins: address[N_COINS],
    _weth: address,
    implementation_id: uint256,
    A: uint256,
    gamma: uint256,
    mid_fee: uint256,
    out_fee: uint256,
    fee_gamma: uint256,
    allowed_extra_profit: uint256,
    adjustment_step: uint256,
    ma_exp_time: uint256,
    initial_prices: uint256[N_COINS-1],
) -> address:
    """
    @notice Deploy a new pool
    @param _name Name of the new plain pool
    @param _symbol Symbol for the new plain pool - will be concatenated with factory symbol

    @return Address of the deployed pool
    """
    pool_implementation: address = self.pool_implementations[implementation_id]
    assert pool_implementation != empty(address), "Pool implementation not set"

    # Validate parameters
    assert A > MIN_A-1
    assert A < MAX_A+1

    assert gamma > MIN_GAMMA-1
    assert gamma < MAX_GAMMA+1

    assert mid_fee < MAX_FEE-1  # mid_fee can be zero
    assert out_fee >= mid_fee
    assert out_fee < MAX_FEE-1
    assert fee_gamma < 10**18+1
    assert fee_gamma > 0

    assert allowed_extra_profit < 10**18+1

    assert adjustment_step < 10**18+1
    assert adjustment_step > 0

    assert ma_exp_time < 872542  # 7 * 24 * 60 * 60 / ln(2)
    assert ma_exp_time > 86  # 60 / ln(2)

    assert min(initial_prices[0], initial_prices[1]) > 10**6
    assert max(initial_prices[0], initial_prices[1]) < 10**30

    assert _coins[0] != _coins[1] and _coins[1] != _coins[2] and _coins[0] != _coins[2], "Duplicate coins"

    decimals: uint256[N_COINS] = empty(uint256[N_COINS])
    precisions: uint256[N_COINS] = empty(uint256[N_COINS])
    for i in range(N_COINS):
        d: uint256 = ERC20(_coins[i]).decimals()
        assert d < 19, "Max 18 decimals for coins"
        decimals[i] = d
        precisions[i] = 10**(18 - d)

    # pack precisions
    packed_precisions: uint256 = self._pack(precisions)

    # pack fees
    packed_fee_params: uint256 = self._pack(
        [mid_fee, out_fee, fee_gamma]
    )

    # pack liquidity rebalancing params
    packed_rebalancing_params: uint256 = self._pack(
        [allowed_extra_profit, adjustment_step, ma_exp_time]
    )

    # pack A_gamma
    packed_A_gamma: uint256 = A << 128
    packed_A_gamma = packed_A_gamma | gamma

    # pack initial prices
    packed_prices: uint256 = 0
    for k in range(N_COINS - 1):
        packed_prices = packed_prices << PRICE_SIZE
        p: uint256 = initial_prices[N_COINS - 2 - k]
        assert p < PRICE_MASK
        packed_prices = p | packed_prices

    # pool is an ERC20 implementation
    _salt: bytes32 = block.prevhash
    _math_implementation: address = self.math_implementation
    pool: address = create_from_blueprint(
        pool_implementation,
        _name,
        _symbol,
        _coins,
        _math_implementation,
        _weth,
        _salt,
        packed_precisions,
        packed_A_gamma,
        packed_fee_params,
        packed_rebalancing_params,
        packed_prices,
        code_offset=3
    )

    # populate pool data
    length: uint256 = self.pool_count
    self.pool_list[length] = pool
    self.pool_count = length + 1
    self.pool_data[pool].decimals = decimals
    self.pool_data[pool].coins = _coins

    # add coins to market:
    self._add_coins_to_market(_coins[0], _coins[1], pool)
    self._add_coins_to_market(_coins[0], _coins[2], pool)
    self._add_coins_to_market(_coins[1], _coins[2], pool)

    log TricryptoPoolDeployed(
        pool,
        _name,
        _symbol,
        _weth,
        _coins,
        _math_implementation,
        _salt,
        packed_precisions,
        packed_A_gamma,
        packed_fee_params,
        packed_rebalancing_params,
        packed_prices,
        msg.sender,
    )

    return pool
```


</SourceCode>

<Example>


```shell
>>> TricryptoFactory.deploy_pool(
    _name: crv/weth/tbtc tripool,
    _symbol: crv-weth-tbtc,
    _coins: '0xD533a949740bb3306d119CC777fa900bA034cd52', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
    _weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    implementation_id: 0,
    A: 2700000,
    gamma: 1300000000000,
    mid_fee: 2999999,
    out_fee: 80000000,
    fee_gamma: 350000000000000,
    allowed_extra_profit: 100000000000,
    adjustment_step: 100000000000,
    ma_exp_time: 600,
    initial_prices: todo,
    )

'returns address of the deployed pool'
```


</Example>


::::

---

## Deploying Gauges

:::info

Liquidity gauges can only be successfully deployed from the same contract from which the pool was deployed!


:::

### `deploy_gauge`

::::description[`deploy_gauge(_pool: address) -> address`]


Deploy a liquidity gauge for a factory pool. The deployed gauge implementation is based on what the factory admin has set for `gauge_implementation`.

| Input    | Type      | Description                          |
| -------- | --------- | ------------------------------------ |
| `_pool`  | `address` | Pool address to deploy a gauge for   |


<SourceCode>


```vyper
@external
def deploy_gauge(_pool: address) -> address:
    """
    @notice Deploy a liquidity gauge for a factory pool
    @param _pool Factory pool address to deploy a gauge for
    @return Address of the deployed gauge
    """
    assert self.pool_data[_pool].coins[0] != ZERO_ADDRESS, "Unknown pool"
    assert self.pool_data[_pool].liquidity_gauge == ZERO_ADDRESS, "Gauge already deployed"
    implementation: address = self.gauge_implementation
    assert implementation != ZERO_ADDRESS, "Gauge implementation not set"

    gauge: address = create_forwarder_to(implementation)
    LiquidityGauge(gauge).initialize(_pool)
    self.pool_data[_pool].liquidity_gauge = gauge

    log LiquidityGaugeDeployed(_pool, gauge)
    return gauge
```


</SourceCode>

<Example>


```shell
>>> Factory.deploy_gauge('0x...')

'returns address of the deployed gauge'
```

</Example>


::::

---


## Fee Receiver

### `fee_receiver`
::::description[`Factory.fee_receiver() -> address: view`]


Getter for the fee receiver.

Returns: fee receiver (`address`).

<SourceCode>
```vyper
fee_receiver: public(address)
```
</SourceCode>

<Example>


```shell
>>> Factory.fee_receiver()
'0xeCb456EA5365865EbAb8a2661B0c503410e9B347'
```


</Example>


::::

### `set_fee_receiver`
::::description[`Factory.set_fee_receiver(_fee_receiver: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new `fee_receiver` address.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `_fee_receiver` |  `address` | new fee receiver address |

Emits event: `UpdateFeeReceiver`

<SourceCode>


```vyper
event UpdateFeeReceiver:
    _old_fee_receiver: address
    _new_fee_receiver: address

admin: public(address) 
fee_receiver: public(address)

@external
def set_fee_receiver(_fee_receiver: address):
    """
    @notice Set fee receiver
    @param _fee_receiver Address that fees are sent to
    """
    assert msg.sender == self.admin, "dev: admin only"

    log UpdateFeeReceiver(self.fee_receiver, _fee_receiver)
    self.fee_receiver = _fee_receiver
```


</SourceCode>

<Example>

```shell
>>> Factory.set_fee_receiver("todo")
'todo'
```

</Example>


::::
