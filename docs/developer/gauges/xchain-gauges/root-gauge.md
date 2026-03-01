# Root Gauge Implementation

The `RootGauge` is a simplified liquidity gauge contract on Ethereum used for bridging CRV from Ethereum to a sidechain. This gauge can be, just like any other liquidity gauge, be added to the `GaugeController` and is then eligible to receive voting weight. If that is the case, it can [mint any new emissions and transmit](#checkpointing-emissions) them to the child gauge on another chain using a [bridger contract](#bridger).


:::vyper[`RootGauge.vy`]

The source code for the `RootGauge.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-xchain-factory/blob/master/contracts/implementations/RootGauge.vy). The contract is written using [Vyper](https://github.com/vyperlang/vyper) version `0.3.10`.

The contract is deployed on :logos-ethereum: Ethereum at [`0x96720942F9fF22eFd8611F696E5333Fe3671717a`](https://etherscan.io/address/0x96720942F9fF22eFd8611F696E5333Fe3671717a).

:::

Root gauges are deployed from the `RootGaugeFactory` and makes use of Vyper's built-in [create_minimal_proxy_to](https://docs.vyperlang.org/en/stable/built-in-functions.html#create_minimal_proxy_to) function to create a EIP1167-compliant "minimal proxy contract" that duplicates the logic of the contract at target.

---

## Initialization

Because the root gauges are deployed using a proxy pattern, they are automatically initialized directly after deployment.

### `initialize`
::::description[`RootGauge.initialize(_bridger: Bridger, _chain_id: uint256, _child: address)`]


Function to initialize the root gauge. Initializes the child gauge address, chain ID, bridger contract, and factory, aswell as sets the `inflation_params` and `last_period`. The function also sets the CRV token approval of the bridger contract to `max_value(uint256)`.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `_bridger` | `Bridger` | The bridger contract |
| `_chain_id` | `uint256` | The chain ID |
| `_child` | `address` | The child gauge address |

<SourceCode>

```vyper
@external
def initialize(_bridger: Bridger, _chain_id: uint256, _child: address):
    """
    @notice Proxy initialization method
    """
    assert self.factory == empty(Factory)  # dev: already initialized

    self.child_gauge = _child
    self.chain_id = _chain_id
    self.bridger = _bridger
    self.factory = Factory(msg.sender)

    inflation_params: InflationParams = InflationParams({
        rate: CRV.rate(),
        finish_time: CRV.future_epoch_time_write()
    })
    assert inflation_params.rate != 0

    self.inflation_params = inflation_params
    self.last_period = block.timestamp / WEEK

    CRV.approve(_bridger.address, max_value(uint256))
```

</SourceCode>

<Example>

This example initializes a root gauge with a bridger contract on Arbitrum.

```py
>>> RootGauge.initialize('0xceda55279fe22d256c4e6a6F2174C1588e94B2BB', 42161, '0x1234567890123456789012345678901234567896')
```

</Example>


::::

---

## Checkpointing & CRV Emissions

### `user_checkpoint`
::::description[`RootGauge.user_checkpoint(_user: address) -> bool`]


Function to checkpoint a gauge and update the total emissions.

Returns: true (`bool`).

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `_user` | `address` | The user address. This parameter is vestigial and has no impact on the function |

<SourceCode>

```vyper
interface GaugeController:
    def checkpoint_gauge(addr: address): nonpayable
    def gauge_relative_weight(addr: address, time: uint256) -> uint256: view

last_period: public(uint256)
total_emissions: public(uint256)

@external
def user_checkpoint(_user: address) -> bool:
    """
    @notice Checkpoint the gauge updating total emissions
    @param _user Vestigial parameter with no impact on the function
    """
    # the last period we calculated emissions up to (but not including)
    last_period: uint256 = self.last_period
    # our current period (which we will calculate emissions up to)
    current_period: uint256 = block.timestamp / WEEK

    # only checkpoint if the current period is greater than the last period
    # last period is always less than or equal to current period and we only calculate
    # emissions up to current period (not including it)
    if last_period != current_period:
        # checkpoint the gauge filling in any missing weight data
        GAUGE_CONTROLLER.checkpoint_gauge(self)

        params: InflationParams = self.inflation_params
        emissions: uint256 = 0

        # only calculate emissions for at most 256 periods since the last checkpoint
        for i in range(last_period, last_period + 256):
            if i == current_period:
                # don't calculate emissions for the current period
                break
            period_time: uint256 = i * WEEK
            weight: uint256 = GAUGE_CONTROLLER.gauge_relative_weight(self, period_time)

            if period_time <= params.finish_time and params.finish_time < period_time + WEEK:
                # calculate with old rate
                emissions += weight * params.rate * (params.finish_time - period_time) / 10 ** 18
                # update rate
                params.rate = params.rate * RATE_DENOMINATOR / RATE_REDUCTION_COEFFICIENT
                # calculate with new rate
                emissions += weight * params.rate * (period_time + WEEK - params.finish_time) / 10 ** 18
                # update finish time
                params.finish_time += RATE_REDUCTION_TIME
                # update storage
                self.inflation_params = params
            else:
                emissions += weight * params.rate * WEEK / 10 ** 18

        self.last_period = current_period
        self.total_emissions += emissions

    return True
```

</SourceCode>

<Example>

```py
>>> RootGauge.user_checkpoint('0x1234567890123456789012345678901234567896')
```

</Example>


::::

### `transmit_emissions`
::::description[`RootGauge.transmit_emissions()`]


:::guard[Guarded Method]

This function is only callable by the `RootGaugeFactory`.


:::

Function to mint any new emissions and transmit them to the child gauge on another chain. Calling this function directly on the root gauge will not revert. The function to bridge emissions can only be called via the `RootGaugeFactory` using its `transmit_emissions(gauge)` function. The contract uses the `bridger` contract to bridge the emissions.

<SourceCode>

This source code example makes use of the Arbitrum Bridger Wrapper. The function to bridge to other chains can vary depending on the bridger contract used.

```vyper
interface Bridger:
    def cost() -> uint256: view
    def bridge(_token: CRV20, _destination: address, _amount: uint256): payable

CRV: immutable(CRV20)
GAUGE_CONTROLLER: immutable(GaugeController)
MINTER: immutable(Minter)

@external
def transmit_emissions():
    """
    @notice Mint any new emissions and transmit across to child gauge
    """
    assert msg.sender == self.factory.address  # dev: call via factory

    MINTER.mint(self)
    minted: uint256 = CRV.balanceOf(self)

    assert minted != 0  # dev: nothing minted
    bridger: Bridger = self.bridger

    bridger.bridge(CRV, self.child_gauge, minted, value=bridger.cost())
```

</SourceCode>

<Example>

```py
>>> RootGauge.transmit_emissions()
```

</Example>


::::

### `integrate_fraction`
::::description[`RootGauge.integrate_fraction(_user: address) -> uint256: view`]


Function to query the total emissions a user is entitled to. Any value of `_user` other than the gauge address will return 0  (only the gauge itself if entitled to emissions as it is the one who mints and bridges them).

Returns: The total emissions the user is entitled to (`uint256`).

| Parameter | Type      | Description |
| --------- | --------- | ------------ |
| `_user`   | `address` | Address of the user |

<SourceCode>

```vyper
total_emissions: public(uint256)

@view
@external
def integrate_fraction(_user: address) -> uint256:
    """
    @notice Query the total emissions `_user` is entitled to
    @dev Any value of `_user` other than the gauge address will return 0
    """
    if _user == self:
        return self.total_emissions
    return 0
```

</SourceCode>

<Example>

```py
>>> RootGauge.integrate_fraction('0x1234567890123456789012345678901234567896')
0
```

</Example>


::::

### `inflation_params`
::::description[`RootGauge.inflation_params() -> InflationParams: view`]


Getter for the inflation parameters.

Returns: `InflationParams` struct containing the CRV emission [`rate`](../../curve-dao/crv-token.md#rate) and [`future_epoch_time_write()`](../../curve-dao/crv-token.md#future_epoch_time_write).

<SourceCode>

```vyper
struct InflationParams:
    rate: uint256
    finish_time: uint256

inflation_params: public(InflationParams)
```

</SourceCode>

<Example>

```py
>>> RootGauge.inflation_params()
{'rate': 1000000000000000000, 'finish_time': 1735689600}
```

</Example>


::::

### `last_period`
::::description[`RootGauge.last_period() -> uint256: view`]


Getter for the last period.

Returns: last period (`uint256`).

<SourceCode>

```vyper
last_period: public(uint256)
```

</SourceCode>

<Example>

```py
>>> RootGauge.last_period()
1735689600
```

</Example>


::::

### `total_emissions`
::::description[`RootGauge.total_emissions() -> uint256: view`]


Getter for the total emissions of the gauge. This value increases each time the gauge is checkpointed.

Returns: total emissions (`uint256`).

<SourceCode>

```vyper
total_emissions: public(uint256)
```

</SourceCode>

<Example>

```py
>>> RootGauge.total_emissions()
0
```

</Example>


::::

---

## Bridger Contracts

The contract makes use of wrapper contracts around different bridging architectures to bridge CRV emissions to child gauges on other chains. These contracts are granted max approval when initialized in order for being able to transmit CRV tokens. The bridger contract used depends on the chain the child gauge is on. The `RootGaugeFactory` holds different bridger implementations for each chain.

If a bridger contract needs to be updated for whatever reason, this can only be done within the `RootGaugeFactory` using the `set_child` function. After the bridger has been updated, the `update_bridger()` function needs to be called on the specific gauge to update the bridger contract used by the gauge. This sets the CRV token approval of the "old" bridger to 0 and the new bridger to `max_value(uint256)`.

<Dropdown title="`RootGaugeFactory.set_child(_chain_id: uint256, _bridger: Bridger, _child_factory: address, _child_impl: address)`">


Source code for the `set_child` function, which is used to set the bridger for a specific chain ID.

```vyper
event ChildUpdated:
    _chain_id: indexed(uint256)
    _new_bridger: Bridger
    _new_factory: address
    _new_implementation: address

get_bridger: public(HashMap[uint256, Bridger])
get_child_factory: public(HashMap[uint256, address])
get_child_implementation: public(HashMap[uint256, address])

@external
def set_child(_chain_id: uint256, _bridger: Bridger, _child_factory: address, _child_impl: address):
    """
    @notice Set the bridger for `_chain_id`
    @param _chain_id The chain identifier to set the bridger for
    @param _bridger The bridger contract to use
    @param _child_factory Address of factory on L2 (needed in price derivation)
    @param _child_impl Address of gauge implementation on L2 (needed in price derivation)
    """
    assert msg.sender == self.owner  # dev: only owner

    log ChildUpdated(_chain_id, _bridger, _child_factory, _child_impl)
    self.get_bridger[_chain_id] = _bridger
    self.get_child_factory[_chain_id] = _child_factory
    self.get_child_implementation[_chain_id] = _child_impl
```


</Dropdown>

### `bridger`
::::description[`RootGauge.bridger() -> Bridger: view`]


Getter for the bridger contract used by the gauge to bridge CRV emissions to the child gauge on another chain. The bridger contract is set during initialization and can only be updated within the `RootGaugeFactory`.

Returns: bridger contract (`address`).

<SourceCode>

```vyper
interface Bridger:
    def cost() -> uint256: view
    def bridge(_token: CRV20, _destination: address, _amount: uint256): payable

bridger: public(Bridger)
```

</SourceCode>

<Example>

This example returns the bridger contract for transmitting CRV emissions from Ethereum to Arbitrum.

```py
>>> RootGauge.bridger()
'0xceda55279fe22d256c4e6a6F2174C1588e94B2BB'
```

</Example>


::::

### `update_bridger`
::::description[`RootGauge.update_bridger()`]


Function to update the bridger used by this contract. This function call will only have effect if the bridger implementation of the chain is updated. Bridger contracts should prevent bridging if ever updated, therefore the approval of the old bridger is set to 0 and the new bridger is set to `max_value(uint256)`. Function call is permissionless, anyone can call it.

<SourceCode>

```vyper
interface CRV20:
    def approve(_account: address, _value: uint256): nonpayable

bridger: public(Bridger)

@external
def update_bridger():
    """
    @notice Update the bridger used by this contract
    @dev Bridger contracts should prevent bridging if ever updated
    """
    # reset approval
    bridger: Bridger = self.factory.get_bridger(self.chain_id)
    CRV.approve(self.bridger.address, 0)
    CRV.approve(bridger.address, max_value(uint256))
    self.bridger = bridger
```

</SourceCode>

<Example>

This function updates the `bridger` contract. Updating this variable is only possible when the bridger contract implementation within the `RootGaugeFactory` is updated.

```py
>>> RootGauge.bridger()
'0xceda55279fe22d256c4e6a6F2174C1588e94B2BB'

>>> RootGaugeFactory.set_child(42161, '0x1234567890123456789012345678901234567896', '0x1234567890123456789012345678901234567896', '0x1234567890123456789012345678901234567896')

>>> RootGauge.update_bridger()

>>> RootGauge.bridger()
'0x1234567890123456789012345678901234567896'
```

</Example>


::::

---

## Child Gauge

If a according child gauge is deployed with the same salt as the root gauge, the `child_gauge` variable will hold the address of the child gauge. Additionally, there is a function to set the child gauge in case something went wrong (e.g. between implementation updates or zkSync).

### `child_gauge`
::::description[`RootGauge.child_gauge() -> address: view`]


Getter for the corresponding child gauge on another chain.

Returns: child gauge contract (`address`).

<SourceCode>

```vyper
child_gauge: public(address)
```

</SourceCode>

<Example>

```py
>>> RootGauge.child_gauge()
'0xcde3Cdf332E35653A7595bA555c9fDBA3c78Ec04'
```

</Example>


::::

### `set_child_gauge`
::::description[`RootGauge.set_child_gauge(_child: address)`]


:::guard[Guarded Method]

This function is only callable by the `owner` of the `RootGaugeFactory`.


:::

Function to set the child gauge in case something went wrong (e.g. between implementation updates or zkSync).

| Parameter | Type | Description |
| --------- | ---- | ------------ |
| `_child` | `address` | The child gauge address |

<SourceCode>

```vyper
interface Factory:
    def owner() -> address: view

child_gauge: public(address)

@external
def set_child_gauge(_child: address):
    """
    @notice Set Child contract in case something went wrong (e.g. between implementation updates or zkSync)
    @param _child Child gauge to set
    """
    assert msg.sender == self.factory.owner()
    assert _child != empty(address)

    self.child_gauge = _child
```

</SourceCode>

<Example>

```py
>>> RootGauge.child_gauge()
'0xcde3Cdf332E35653A7595bA555c9fDBA3c78Ec04'

>>> RootGauge.set_child_gauge('0x1234567890123456789012345678901234567890')

>>> RootGauge.child_gauge()
'0x1234567890123456789012345678901234567890'
```

</Example>


::::

### `chain_id`
::::description[`RootGauge.chain_id() -> uint256: view`]


Getter for the chain ID of the child gauge.

Returns: chain ID (`uint256`).

<SourceCode>

```vyper
chain_id: public(uint256)
```

</SourceCode>

<Example>

This example returns the chain ID on which the corresponding child gauge is deployed.

```py
>>> RootGauge.chain_id()
42161
```

</Example>


::::

---

## Killing Root Gauges

Root gauges can be killed by the `owner` of the `RootGaugeFactory` to disable emissions of the specific gauge. Killed gauges will have their inflation rate be set to 0 and therefor restrict any minting of CRV emissions.

### `is_killed`
::::description[`RootGauge.is_killed() -> bool: view`]


Getter for the kill status of the gauge.

Returns: kill status (`bool`).

<SourceCode>

```vyper
is_killed: public(bool)
```

</SourceCode>

<Example>

```py
>>> RootGauge.is_killed()
False
```

</Example>


::::

### `set_killed`
::::description[`RootGauge.set_killed(_is_killed: bool)`]


:::guard[Guarded Method]

This function is only callable by the `owner` of the `RootGaugeFactory`.


:::

Function to set the kill status of the gauge. If a gauge is killed, inflation params are modified accordingly to disable emissions. A gauge can be "unkilled" by setting the kill status to `False`, which restores the inflation params to their actual values.

| Parameter | Type | Description |
| --------- | ---- | ------------ |
| `_is_killed` | `bool` | The kill status |

<SourceCode>

```vyper
interface Factory:
    def owner() -> address: view

interface CRV20:
    def rate() -> uint256: view
    def future_epoch_time_write() -> uint256: nonpayable

struct InflationParams:
    rate: uint256
    finish_time: uint256

last_period: public(uint256)

is_killed: public(bool)

@external
def set_killed(_is_killed: bool):
    """
    @notice Set the gauge kill status
    @dev Inflation params are modified accordingly to disable/enable emissions
    """
    assert msg.sender == self.factory.owner()

    if _is_killed:
        self.inflation_params.rate = 0
    else:
        self.inflation_params = InflationParams({
            rate: CRV.rate(),
            finish_time: CRV.future_epoch_time_write()
        })
        self.last_period = block.timestamp / WEEK
    self.is_killed = _is_killed
```

</SourceCode>

<Example>

```py
>>> RootGauge.set_killed(True)

>>> RootGauge.is_killed()
True

>>> RootGauge.inflation_params()
{'rate': 0, 'finish_time': 1735689600}
```

</Example>


::::

---

## Other Methods

### `factory`
::::description[`RootGauge.factory() -> Factory: view`]


Getter for the `RootGaugeFactory` contract.

Returns: root gauge factory (`address`).

<SourceCode>

```vyper
factory: public(Factory)
```

</SourceCode>

<Example>

```py
>>> RootGauge.factory()
'0x306A45a1478A000dC701A6e1f7a569afb8D9DCD6'
```

</Example>


::::

### `version`
::::description[`RootGauge.version() -> String[8]: view`]


Getter for the contract version.

Returns: contract version (`String[8]`).

<SourceCode>

```vyper
VERSION: constant(String[8]) = "1.0.0"

@pure
@external
def version() -> String[8]:
    """
    @notice Get the version of this gauge
    """
    return VERSION
```

</SourceCode>

<Example>

```py
>>> RootGauge.version()
'1.0.0'
```

</Example>


::::
