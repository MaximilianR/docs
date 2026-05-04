# Pool Factory: Overview


The Twocrypto-NG Factory allows the permissionless deployment of two-coin volatile asset pools, as well as gauges. **The liquidity pool and LP token share the same contract.**Additionally, the Factory contract is the direct admin and fee receiver of all pools. In turn, the Factory is controlled by the CurveDAO.

:::deploy[Contract Source & Deployment]

Source code for the Factory is available on [Github](https://github.com/curvefi/twocrypto-ng/blob/main/contracts/main/TwocryptoFactory.vy).   
A full list of all deployments can be found [here](../../../deployments.md).


:::

---


## Implementations

The Twocrypto-NG Factory makes use of **blueprint contracts**([EIP-5202](https://eips.ethereum.org/EIPS/eip-5202)) to deploy liquidity pools and gauges.

:::warning

**Implementation contracts are upgradable.**They can either be replaced, or additional implementation contracts can be added. Therefore, always make sure to check the most recent ones.


:::

It utilizes four different implementations:

- **`pool_implementations`**, containing multiple blueprint contracts that are used to deploy the pools.
- **`gauge_implementation`**, containing a blueprint contract that is used when deploying gauges for pools. This is only available on Ethereum Mainnet.
- **`views_implementation`**, containing a view methods contract relevant for integrators and users looking to interact with the AMMs.
- **`math_implementation`**, containing math functions used in the AMM.

*More on the [**Math Implementation**](../../twocrypto-ng/utility-contracts/math.md) and [**Views Implementation**](../../twocrypto-ng/utility-contracts/views.md).*


## Query Implementations

### `pool_implementations`
::::description[`Factory.pool_implementations(arg0: uint256) -> address: view`]


Getter for the pool implementation at index `arg0`.

| Input  | Type      | Description                |
| ------ | --------- | -------------------------- |
| `arg0` | `uint256` | Index of pool implementation |

Returns: Pool implementation (`address`).

<SourceCode>
```vyper
pool_implementations: public(HashMap[uint256, address])
```
</SourceCode>

<Example>


```shell
>>> Factory.pool_implementations(0)
'0x04Fd6beC7D45EFA99a27D29FB94b55c56dD07223'
```


</Example>


::::

### `gauge_implementation`
::::description[`Factory.gauge_implementation() -> address: view`]


Getter for the current gauge implementation. Only Ethereum mainnet has a valid gauge implementation; on other chains, the implementation is set to `ZERO_ADDRESS`, as sidechain gauges need to be deployed via the `RootChainGaugeFactory`.

Returns: Gauge implementation (`address`).

<SourceCode>
```vyper
gauge_implementation: public(address)
```
</SourceCode>

<Example>


```shell
>>> Factory.gauge_implementation()
'0x38D9BdA812da2C68dFC6aDE85A7F7a54E77F8325'
```


</Example>


::::

### `views_implementation`
::::description[`Factory.views_implementation() -> address: view`]


Getter for the current views contract implementation.

Returns: Views contract implementation (`address`).

<SourceCode>
```vyper
views_implementation: public(address)
```
</SourceCode>

<Example>


```shell
>>> Factory.views_implementation()
'0x07CdEBF81977E111B08C126DEFA07818d0045b80'
```


</Example>


::::

### `math_implementation`
::::description[`Factory.math_implementation() -> address: view`]


Getter for the current math contract implementation.

Returns: Math contract implementation (`address`).

<SourceCode>
```vyper
math_implementation: public(address)
```
</SourceCode>

<Example>


```shell
>>> Factory.math_implementation()
'0x2005995a71243be9FB995DaB4742327dc76564Df'
```


</Example>


::::

## Set New Implementations

*New implementations can be set via the following admin-only functions:*


### `set_pool_implementation`
::::description[`Factory.set_pool_implementation(_pool_implementation: address, _implementation_index: uint256):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new pool implementation at a certain index. The Factory allows multiple pool implementations as some pools might require a different one.

| Input                    | Type      | Description                   |
| ------------------------ | --------- | ----------------------------- |
| `_pool_implementation`   | `address` | New pool implementation       |
| `_implementation_index`  | `uint256` | Index for the implementation  |

Emits: `UpdatePoolImplementation`

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
>>> soon
```


</Example>


::::

### `set_gauge_implementation`
::::description[`Factory.set_gauge_implementation(_gauge_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new gauge implementation (blueprint contract). This implementation is only available on Ethereum mainnet. To deploy a gauge on a sidechain, this needs to be done through the `RootChainGaugeFactory`.

| Input                      | Type      | Description                |
| -------------------------- | --------- | -------------------------- |
| `_gauge_implementation`    | `address` | New gauge implementation   |

Emits: `UpdateGaugeImplementation`

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
>>> soon
```


</Example>


::::

### `set_views_implementation`
::::description[`Factory.set_views_implementation(_views_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new views contract.

| Input                   | Type      | Description                            |
| ----------------------- | --------- | -------------------------------------- |
| `_views_implementation` | `address` | New views contract implementation      |

Emits: `UpdateViewsImplementation`


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
>>> soon
```


</Example>


::::

### `set_math_implementation`
::::description[`Factory.set_math_implementation(_math_implementation: address):`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to set a new math contract.

| Input                   | Type      | Description                          |
| ----------------------- | --------- | ------------------------------------ |
| `_math_implementation`  | `address` | New math contract implementation     |

Emits: `UpdateMathImplementation`

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
>>> soon
```


</Example>


::::

## Fee Receiver

### `fee_receiver`
::::description[`Factory.fee_receiver() -> address: view`]


Getter for the fee receiver address of the admin fee. The fee receiver is initially set by calling the `initialize_ownership` function. It can later be changed via the `set_fee_receiver` method.

Returns: fee receiver (`address`).

<SourceCode>
```vyper
fee_receiver: public(address)

@external
def initialise_ownership(_fee_receiver: address, _admin: address):

    assert msg.sender == self.deployer
    assert self.admin == empty(address)

    self.fee_receiver = _fee_receiver
    self.admin = _admin

    log UpdateFeeReceiver(empty(address), _fee_receiver)
    log TransferOwnership(empty(address), _admin)
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

Function to set a new fee receiver address.

| Input              | Type      | Description                  |
| ------------------ | --------- | ---------------------------- |
| `_fee_receiver`    | `uint256` | New fee receiver address     |

Emits: `UpdateFeeReceiver`

<SourceCode>
```vyper
event UpdateFeeReceiver:
    _old_fee_receiver: address
    _new_fee_receiver: address

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
>>> soon
```


</Example>


::::

---


## Deploying Pools

### `deploy_pool`
::::description[`Factory.deploy_pool(_name: String[64], _symbol: String[32], _coins: address[N_COINS], implementation_id: uint256, A: uint256, gamma: uint256, mid_fee: uint256, out_fee: uint256, fee_gamma: uint256, allowed_extra_profit: uint256, adjustment_step: uint256, ma_exp_time: uint256, initial_price: uint256) -> address:`]


Function to deploy a Twocrypto-NG liquidity pool.

| Input                 | Type                | Description                                        |
|-----------------------|---------------------|----------------------------------------------------|
| `_name`               | `String[64]`        | Pool name                                          |
| `_symbol`             | `String[32]`        | Pool symbol                                        |
| `_coins`              | `address[N_COINS]`  | Coins                                              |
| `implementation_id`   | `uint256`           | Implementation index of `Factory.poolImplementations()` |
| `A`                   | `uint256`           | Amplification Coefficient                          |
| `gamma`               | `uint256`           | Gamma                                              |
| `mid_fee`             | `uint256`           | Mid Fee                                            |
| `out_fee`             | `uint256`           | Out Fee                                            |
| `fee_gamma`           | `uint256`           | Fee Gamma                                          |
| `allowed_extra_profit`| `uint256`           | Allowed Extra Profit                               |
| `adjustment_step`     | `uint256`           | Adjustment Step                                    |
| `ma_exp_time`         | `uint256`           | Moving Average Time Period                         |
| `initial_price`       | `uint256`           | Initial Prices                                     |

Returns: deployed pool (`address`).

Emits: `TwocryptoPoolDeployed`


*Limitations when deploying liquidity pools:*

- pool and math implementation must not be empty
- no duplicate coins
- maximum 18 decimal coins

| Parameter            | Limitation                                           |
| -------------------- | ---------------------------------------------------- |
| `mid_fee`            | mid_fee < MAX_FEE - 1; mid_fee can be 0              |
| `out_fee`            | mid_fee &lt;= out_fee &lt; MAX_FEE - 1         |
| `fee_gamma`          | 0 < fee_gamma < 10^18 + 1                            |
| `allowed_extra_profit` | allowed_extra_profit < 10^18 + 1                  |
| `adjustment_step`    | 0 < adjustment_step < 10^18 + 1                      |
| `ma_exp_time`        | 86 < ma_exp_time < 872542                            |
| `initial_prices`     | 10^6 < initial_prices[0] and initial_prices[1] < 10^30 |

<SourceCode>
```vyper
event TwocryptoPoolDeployed:
    pool: address
    name: String[64]
    symbol: String[32]
    coins: address[N_COINS]
    math: address
    salt: bytes32
    precisions: uint256[N_COINS]
    packed_A_gamma: uint256
    packed_fee_params: uint256
    packed_rebalancing_params: uint256
    packed_prices: uint256
    deployer: address

@external
def deploy_pool(
    _name: String[64],
    _symbol: String[32],
    _coins: address[N_COINS],
    implementation_id: uint256,
    A: uint256,
    gamma: uint256,
    mid_fee: uint256,
    out_fee: uint256,
    fee_gamma: uint256,
    allowed_extra_profit: uint256,
    adjustment_step: uint256,
    ma_exp_time: uint256,
    initial_price: uint256,
) -> address:
    """
    @notice Deploy a new pool
    @param _name Name of the new plain pool
    @param _symbol Symbol for the new plain pool - will be concatenated with factory symbol

    @return Address of the deployed pool
    """
    pool_implementation: address = self.pool_implementations[implementation_id]
    _math_implementation: address = self.math_implementation
    assert pool_implementation != empty(address), "Pool implementation not set"
    assert _math_implementation != empty(address), "Math implementation not set"

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

    assert initial_price > 10**6 and initial_price < 10**30  # dev: initial price out of bound

    assert _coins[0] != _coins[1], "Duplicate coins"

    decimals: uint256[N_COINS] = empty(uint256[N_COINS])
    precisions: uint256[N_COINS] = empty(uint256[N_COINS])
    for i in range(N_COINS):
        d: uint256 = ERC20(_coins[i]).decimals()
        assert d < 19, "Max 18 decimals for coins"
        decimals[i] = d
        precisions[i] = 10 **(18 - d)

    # pack precision
    packed_precisions: uint256 = self._pack_2(precisions[0], precisions[1])

    # pack fees
    packed_fee_params: uint256 = self._pack_3(
        [mid_fee, out_fee, fee_gamma]
    )

    # pack liquidity rebalancing params
    packed_rebalancing_params: uint256 = self._pack_3(
        [allowed_extra_profit, adjustment_step, ma_exp_time]
    )

    # pack gamma and A
    packed_gamma_A: uint256 = self._pack_2(gamma, A)

    # pool is an ERC20 implementation
    _salt: bytes32 = block.prevhash
    pool: address = create_from_blueprint(
        pool_implementation,  # blueprint: address
        _name,  # String[64]
        _symbol,  # String[32]
        _coins,  # address[N_COINS]
        _math_implementation,  # address
        _salt,  # bytes32
        packed_precisions,  # uint256
        packed_gamma_A,  # uint256
        packed_fee_params,  # uint256
        packed_rebalancing_params,  # uint256
        initial_price,  # uint256
        code_offset=3,
    )

    # populate pool data
    self.pool_list.append(pool)

    self.pool_data[pool].decimals = decimals
    self.pool_data[pool].coins = _coins
    self.pool_data[pool].implementation = pool_implementation

    # add coins to market:
    self._add_coins_to_market(_coins[0], _coins[1], pool)

    log TwocryptoPoolDeployed(
        pool,
        _name,
        _symbol,
        _coins,
        _math_implementation,
        _salt,
        precisions,
        packed_gamma_A,
        packed_fee_params,
        packed_rebalancing_params,
        initial_price,
        msg.sender,
    )

    return pool
```
</SourceCode>

<Example>


```shell
>>> Factory.deploy_pool(
    _name: CRV/ETH,
    _symbol: crv-eth,
    _coins: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xD533a949740bb3306d119CC777fa900bA034cd52',
    implementation_id: 0,
    A: 2700000,
    gamma: 1300000000000,
    mid_fee: 2999999,
    out_fee: 80000000,
    fee_gamma: 350000000000000,
    allowed_extra_profit: 100000000000,
    adjustment_step: 100000000000,
    ma_exp_time: 600,
    initial_prices: 0.00023684735380012821,
    )

'returns address of the deployed pool'
```


</Example>


::::

---

## Deploying Gauges

### `deploy_gauge`
::::description[`Factory.deploy_gauge(_pool: address) -> address:`]


:::warning

Deploying a liquidity gauge through the Factory is only possible on Ethereum Mainnet. Gauge deployments on sidechains must be done via the [`RootChainGaugeFactory`](../../../gauges/xchain-gauges/root-gauge-factory.md).


:::

Function to deploy a liquidity gauge on Ethereum mainnet. This function can only be used on pools deployed from this Factory contract.

| Input      | Type      | Description |
| ---------- | --------- | ----------- |
| `_pool`    | `address` | Pool to deploy a gauge for |

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
    assert self.gauge_implementation != empty(address), "Gauge implementation not set"

    gauge: address = create_from_blueprint(self.gauge_implementation, _pool, code_offset=3)
    self.pool_data[_pool].liquidity_gauge = gauge

    log LiquidityGaugeDeployed(_pool, gauge)
    return gauge
```
</SourceCode>

<Example>


```shell
>>> Factory.deploy_gauge('pool address')

'returns address of the deployed gauge'
```

</Example>


::::
