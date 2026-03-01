# RootGaugeFactory


The `RootGaugeFactory` contract is used to deploy liquidity gauges on the Ethereum mainnet. These gauges can then be voted on to be added to the `GaugeController`. If successful, the gauges will be able to receive CRV emissions, which then can be bridged via a `Bridger` contract to the child chains `ChildGauge`.

:::vyper[`RootGaugeFactory.vy`]

The source code for the `RootGaugeFactory.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-xchain-factory/blob/master/contracts/RootGaugeFactory.vy). The contract is written using [Vyper](https://github.com/vyperlang/vyper) version `0.3.10`.

The contract is deployed on :logos-ethereum: Ethereum at [`0x306A45a1478A000dC701A6e1f7a569afb8D9DCD6`](https://etherscan.io/address/0x306A45a1478A000dC701A6e1f7a569afb8D9DCD6).

:::

---

## Deploying Gauges

The `RootGaugeFactory` allows the deployment of root gauges on Ethereum and child gauges on the child chains. Root gauges can only be deployed if there is a `bridger` contract set for the given chain ID, otherwise the chain is not supported.

:::info[Supported Chains]

If `get_bridger(chain_id)` returns a non-zero address, the chain is supported and a `RootGauge` can be deployed.

```vyper
>>> RootGaugeFactory.get_bridger(252)           # fraxtal
'0x0199429171bcE183048dccf1d5546Ca519EA9717'    # supported

>>> RootGaugeFactory.get_bridger(7700)          # canto
'0x0000000000000000000000000000000000000000'    # not supported
```


:::

### `deploy_gauge`
::::description[`RootGaugeFactory.deploy_gauge(_chain_id: uint256, _salt: bytes32) -> RootGauge`]


Function to deploy and initialize a new root gauge for a given chain ID. This function is `@payable` to allow for bridging costs. This function call reverts if there is no `bridger` contract set for the given `_chain_id`.

Returns: newly deployed gauge (`RootGauge`).

Emits: `DeployedGauge` event.

| Input       | Type      | Description |
| ----------- | --------- | ----------- |
| `_chain_id` | `uint256` | Chain ID of the child gauge |
| `_salt`     | `bytes32` | Salt for the child gauge |


<SourceCode>


```vyper
event DeployedGauge:
    _implementation: indexed(address)
    _chain_id: indexed(uint256)
    _deployer: indexed(address)
    _salt: bytes32
    _gauge: RootGauge

interface RootGauge:
    def bridger() -> Bridger: view
    def initialize(_bridger: Bridger, _chain_id: uint256, _child: address): nonpayable
    def transmit_emissions(): nonpayable

call_proxy: public(CallProxy)
get_bridger: public(HashMap[uint256, Bridger])
get_child_factory: public(HashMap[uint256, address])
get_child_implementation: public(HashMap[uint256, address])
get_implementation: public(address)

get_gauge: public(HashMap[uint256, RootGauge[max_value(uint256)]])
get_gauge_count: public(HashMap[uint256, uint256])
is_valid_gauge: public(HashMap[RootGauge, bool])

@payable
@external
def deploy_gauge(_chain_id: uint256, _salt: bytes32) -> RootGauge:
    """
    @notice Deploy a root liquidity gauge
    @param _chain_id The chain identifier of the counterpart child gauge
    @param _salt A value to deterministically deploy a gauge
    """
    bridger: Bridger = self.get_bridger[_chain_id]
    assert bridger != empty(Bridger)  # dev: chain id not supported

    implementation: address = self.get_implementation
    salt: bytes32 = keccak256(_abi_encode(_chain_id, _salt))
    gauge: RootGauge = RootGauge(create_minimal_proxy_to(
        implementation,
        value=msg.value,
        salt=salt,
    ))
    child: address = self._get_child(_chain_id, salt)

    idx: uint256 = self.get_gauge_count[_chain_id]
    self.get_gauge[_chain_id][idx] = gauge
    self.get_gauge_count[_chain_id] = idx + 1
    self.is_valid_gauge[gauge] = True

    gauge.initialize(bridger, _chain_id, child)

    log DeployedGauge(implementation, _chain_id, msg.sender, _salt, gauge)
    return gauge

@internal
def _get_child(_chain_id: uint256, salt: bytes32) -> address:
    """
    @dev zkSync address derivation is ignored, so need to set child address through a vote manually
    """
    child_factory: address = self.get_child_factory[_chain_id]
    child_impl: bytes20 = convert(self.get_child_implementation[_chain_id], bytes20)

    assert child_factory != empty(address)  # dev: child factory not set
    assert child_impl != empty(bytes20)  # dev: child implementation not set

    gauge_codehash: bytes32 = keccak256(
        concat(0x602d3d8160093d39f3363d3d373d3d3d363d73, child_impl, 0x5af43d82803e903d91602b57fd5bf3))
    digest: bytes32 = keccak256(concat(0xFF, convert(child_factory, bytes20), salt, gauge_codehash))
    return convert(convert(digest, uint256) & convert(max_value(uint160), uint256), address)
```


</SourceCode>

<Example>


This example deploys a `RootGauge` for Fraxtal.

```shell
>>> RootGaugeFactory.deploy_gauge(252, '0x0000000000000000000000000000000000000000000000000000000000000000')
```


</Example>


::::


### `deploy_child_gauge`
::::description[`RootGaugeFactory.deploy_child_gauge(_chain_id: uint256, _lp_token: address, _salt: bytes32, _manager: address = msg.sender)`]


:::warning[Important]

This function will only work if a `call_proxy` is set. Otherwise, the function will revert.


:::

Function to deploy a new child gauge on the child chain.

| Input      | Type      | Description |
| ----------- | --------- | ----------- |
| `_chain_id` | `uint256` | Chain ID of the child gauge |
| `_lp_token` | `address` | Address of the LP token |
| `_salt`     | `bytes32` | Salt for the child gauge |
| `_manager`  | `address` | Address of the manager |


<SourceCode>


```vyper
call_proxy: public(CallProxy)
get_bridger: public(HashMap[uint256, Bridger])

@external
def deploy_child_gauge(_chain_id: uint256, _lp_token: address, _salt: bytes32, _manager: address = msg.sender):
    bridger: Bridger = self.get_bridger[_chain_id]
    assert bridger != empty(Bridger)  # dev: chain id not supported

    self.call_proxy.anyCall(
        self,
        _abi_encode(
            _lp_token,
            _salt,
            _manager,
            method_id=method_id("deploy_gauge(address,bytes32,address)")
        ),
        empty(address),
        _chain_id
    )
```


</SourceCode>

<Example>


This example deploys a `ChildGauge` on Optimism for the `0xb757fc30bb2d96782188c45b6ebf20defe165ac7` LP token. `0x1234567890123456789012345678901234567890` is specified as the manager.

```shell
>>> RootGaugeFactory.deploy_child_gauge(10, '0xb757fc30bb2d96782188c45b6ebf20defe165ac7', '0x0000000000000000000000000000000000000000000000000000000000000000', '0x1234567890123456789012345678901234567890')
```


</Example>


::::


---

## Transmitting Emissions

Once a root gauge has received emissions, they can be transmitted to the child gauge. This is done by calling the `transmit_emissions` function. Emissions can only be transmitted from the `RootGaugeFactory`.

Transmitting emissions is permissionless. Anyone can do it.

### `transmit_emissions`
::::description[`RootGaugeFactory.transmit_emissions(_gauge: RootGauge)`]


Function to mint and transmit emissions to the `ChildGauge` on the destination chain. This function is permissionless and can be called by anyone.

| Input    | Type      | Description |
| -------- | --------- | ----------- |
| `_gauge` | `RootGauge` | Root gauge to transmit emissions for |


<SourceCode>


```vyper
interface Bridger:
    def check(_addr: address) -> bool: view

interface RootGauge:
    def transmit_emissions(): nonpayable

@external
def transmit_emissions(_gauge: RootGauge):
    """
    @notice Call `transmit_emissions` on a root gauge
    @dev Entrypoint to request emissions for a child gauge.
        The way that gauges work, this can also be called on the root
        chain without a request.
    """
    # in most cases this will return True
    # for special bridges *cough cough Multichain, we can only do
    # one bridge per tx, therefore this will verify msg.sender in [tx.origin, self.call_proxy]
    assert _gauge.bridger().check(msg.sender)
    _gauge.transmit_emissions()
```


</SourceCode>

<Example>


This example transmits CRV emissions for the `RootGauge` at `0x6233394c3C466A45A505EFA4857489743168E9Fa` to the `ChildGauge` on Fraxtal.

```shell
>>> RootGaugeFactory.transmit_emissions('0x6233394c3C466A45A505EFA4857489743168E9Fa')
```


</Example>


::::


### `get_bridger`
::::description[`RootGaugeFactory.get_bridger(_chain_id: uint256) -> Bridger: view`]


Getter for the bridger for a given chain ID. This contract is used to bridge CRV emissions to the `ChildGauge`.

Returns: bridger (`Bridger`).

| Input      | Type      | Description |
| ----------- | --------- | ----------- |
| `_chain_id` | `uint256` | Chain ID of the child gauge |


<SourceCode>


```vyper
interface Bridger:
    def check(_addr: address) -> bool: view

get_bridger: public(HashMap[uint256, Bridger])
```


</SourceCode>

<Example>

```py
>>> RootGaugeFactory.get_bridger(252)
'0x0199429171bcE183048dccf1d5546Ca519EA9717'
```

</Example>


::::


---

## Gauge Information

The `RootGaugeFactory` contract also provides a few getters to retrieve information about the deployed `RootGauges`.

### `get_gauge`
::::description[`RootGaugeFactory.get_gauge(_chain_id: uint256, _idx: uint256) -> RootGauge: view`]


Getter for gauges on a given chain ID and index.

Returns: gauge (`address`).

| Input      | Type      | Description |
| ----------- | --------- | ----------- |
| `_chain_id` | `uint256` | Chain ID of the child gauge |
| `_idx`      | `uint256` | Index of the gauge |


<SourceCode>


```vyper
get_gauge: public(HashMap[uint256, RootGauge[max_value(uint256)]])
```


</SourceCode>

<Example>

```py
>>> RootGaugeFactory.get_gauge(252, 0)
'0x6233394c3C466A45A505EFA4857489743168E9Fa'
```

</Example>


::::


### `get_gauge_count`
::::description[`RootGaugeFactory.get_gauge_count(_chain_id: uint256) -> uint256: view`]


Getter to get the number of gauges for a given chain ID. This value is incremented by one for each new gauge deployed.

Returns: number of gauges (`uint256`).

| Input      | Type      | Description |
| ----------- | --------- | ----------- |
| `_chain_id` | `uint256` | Chain ID of the child gauge |


<SourceCode>


```vyper
get_gauge_count: public(HashMap[uint256, uint256])
```


</SourceCode>

<Example>

```py
>>> RootGaugeFactory.get_gauge_count(252)
3
```

</Example>


::::


### `is_valid_gauge`
::::description[`RootGaugeFactory.is_valid_gauge(_gauge: RootGauge) -> bool: view`]


Getter to check if a gauge is valid.

Returns: `True` if the gauge is valid, `False` otherwise (`bool`).

| Input    | Type      | Description |
| -------- | --------- | ----------- |
| `_gauge` | `RootGauge` | Root gauge to check validity for |


<SourceCode>


```vyper
is_valid_gauge: public(HashMap[RootGauge, bool])
```


</SourceCode>

<Example>

```py
>>> RootGaugeFactory.is_valid_gauge('0x6233394c3C466A45A505EFA4857489743168E9Fa')
True
```

</Example>


::::


---

## Child and Root Implementations and Factories

The `RootGaugeFactory` contract also provides a few getters to retrieve information about the deployed `ChildGauge` implementations and factories.

### `get_implementation`
::::description[`RootGaugeFactory.get_implementation() -> address: view`]


Getter for the `RootGauge` implementation contract. This implementation contract is used to deploy new `RootGauge` contracts using Vyper's built-in `create_minimal_proxy_to` function.

Returns: implementation address (`address`).


<SourceCode>


```vyper
get_implementation: public(address)
```


</SourceCode>

<Example>

```py
>>> RootGaugeFactory.get_implementation()
'0x96720942F9fF22eFd8611F696E5333Fe3671717a'
```

</Example>


::::


### `set_implementation`
::::description[`RootGaugeFactory.set_implementation(_implementation: address)`]


:::guard[Guarded Method]

This function is only callable by the `owner` of the contract.


:::

:::warning

Changing the implementation contract requires a change on all child factories.


:::

Function to set the implementation contract of the `RootGauge`.

Emits: `UpdateImplementation` event.

| Input             | Type        | Description |
| ----------------- | ----------- | ----------- |
| `_implementation` | `address`   | Address of the new implementation |


<SourceCode>


```vyper
event UpdateImplementation:
    _old_implementation: address
    _new_implementation: address

get_implementation: public(address)

owner: public(address)

@external
def set_implementation(_implementation: address):
    """
    @notice Set the implementation
    @dev Changing implementation require change on all child factories
    @param _implementation The address of the implementation to use
    """
    assert msg.sender == self.owner  # dev: only owner

    log UpdateImplementation(self.get_implementation, _implementation)
    self.get_implementation = _implementation
```


</SourceCode>

<Example>


This example sets the `RootGauge` implementation to the address `0x6233394c3C466A45A505EFA4857489743168E9Fa`.

```shell
>>> RootGaugeFactory.get_implementation()
'0x0000000000000000000000000000000000000000'

>>> RootGaugeFactory.set_implementation('0x6233394c3C466A45A505EFA4857489743168E9Fa')

>>> RootGaugeFactory.get_implementation()
'0x6233394c3C466A45A505EFA4857489743168E9Fa'
```


</Example>


::::


### `get_child_factory`
::::description[`RootGaugeFactory.get_child_factory(_chain_id: uint256) -> address: view`]


Getter for the child factory for a given chain ID.

Returns: child factory address (`address`).

| Input       | Type      | Description |
| ----------- | --------- | ----------- |
| `_chain_id` | `uint256` | Chain ID of the child gauge |


<SourceCode>


```vyper
get_child_factory: public(HashMap[uint256, address])
```


</SourceCode>

<Example>

```py
>>> RootGaugeFactory.get_child_factory(252)
'0x0B8D6B6CeFC7Aa1C2852442e518443B1b22e1C52'
```

</Example>


::::


### `get_child_implementation`
::::description[`RootGaugeFactory.get_child_implementation(_chain_id: uint256) -> address: view`]


Getter for the child implementation for a given chain ID.

Returns: child implementation address (`address`).

| Input      | Type      | Description |
| ----------- | --------- | ----------- |
| `_chain_id` | `uint256` | Chain ID of the child gauge |


<SourceCode>


```vyper
get_child_implementation: public(HashMap[uint256, address])
```


</SourceCode>

<Example>

```py
>>> RootGaugeFactory.get_child_implementation(252)
'0x6A611215540555A7feBCB64CB0Ed11Ac90F165Af'
```

</Example>


::::


### `set_child`
::::description[`RootGaugeFactory.set_child(_chain_id: uint256, _bridger: Bridger, _child_factory: address, _child_impl: address)`]


:::guard[Guarded Method]

This function is only callable by the `owner` of the contract.


:::

Function to set different child properties for a given chain ID such as the bridger contract, `ChildGaugeFactory` and `ChildGauge` implementation.

Emits: `ChildUpdated` event.

| Input      | Type      | Description |
| ----------- | --------- | ----------- |
| `_chain_id` | `uint256` | Chain ID of the child gauge |
| `_bridger`  | `Bridger` | Bridger contract for the child gauge |
| `_child_factory` | `address` | Address of the new `ChildGaugeFactory` |
| `_child_impl` | `address` | Address of the new `ChildGauge` implementation |


<SourceCode>


```vyper
event ChildUpdated:
    _chain_id: indexed(uint256)
    _new_bridger: Bridger
    _new_factory: address
    _new_implementation: address

get_bridger: public(HashMap[uint256, Bridger])
get_child_factory: public(HashMap[uint256, address])
get_child_implementation: public(HashMap[uint256, address])

owner: public(address)

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


</SourceCode>

<Example>


This example sets the following properties for chain ID `252`:

- Bridger: `0x0199429171bcE183048dccf1d5546Ca519EA9717`
- ChildGaugeFactory: `0x0B8D6B6CeFC7Aa1C2852442e518443B1b22e1C52`
- ChildGauge implementation: `0x6A611215540555A7feBCB64CB0Ed11Ac90F165Af`

```shell
>>> RootGaugeFactory.set_child(252, '0x0199429171bcE183048dccf1d5546Ca519EA9717', '0x0B8D6B6CeFC7Aa1C2852442e518443B1b22e1C52', '0x6A611215540555A7feBCB64CB0Ed11Ac90F165Af')
```


</Example>


::::


---

## Call Proxy

### `call_proxy`
::::description[`RootGaugeFactory.call_proxy() -> CallProxy: view`]


Getter to get the call proxy which is used for inter-chain communication. This variable is initially set at contract initialization and can be changed via the [`set_call_proxy`](#set_call_proxy) function.

Returns: call proxy (`CallProxy`).


<SourceCode>


```vyper
interface CallProxy:
    def anyCall(
        _to: address, _data: Bytes[1024], _fallback: address, _to_chain_id: uint256
    ): nonpayable

call_proxy: public(CallProxy)

@external
def __init__(_call_proxy: CallProxy, _owner: address):
    self.call_proxy = _call_proxy
    log UpdateCallProxy(empty(CallProxy), _call_proxy)

    self.owner = _owner
    log TransferOwnership(empty(address), _owner)
```


</SourceCode>

<Example>

```py
>>> RootGaugeFactory.call_proxy()
'0x0000000000000000000000000000000000000000'
```

</Example>


::::


### `set_call_proxy`
::::description[`RootGaugeFactory.set_call_proxy(_call_proxy: CallProxy)`]


:::guard[Guarded Method]

This function is only callable by the `owner` of the contract.


:::

Function to set the call proxy.

Emits: `UpdateCallProxy` event.

| Input         | Type        | Description       |
| ------------- | ----------- | ----------------- |
| `_call_proxy` | `CallProxy` | Call proxy to set |


<SourceCode>


```vyper
event UpdateCallProxy:
    _old_call_proxy: CallProxy
    _new_call_proxy: CallProxy

call_proxy: public(CallProxy)

@external
def set_call_proxy(_call_proxy: CallProxy):
    """
    @notice Set CallProxy
    @param _call_proxy Contract to use for inter-chain communication
    """
    assert msg.sender == self.owner

    self.call_proxy = _call_proxy
    log UpdateCallProxy(empty(CallProxy), _call_proxy)
```


</SourceCode>

<Example>


This example sets the call proxy to `0x1234567890123456789012345678901234567890`.

```shell
>>> RootGaugeFactory.call_proxy()
'0x0000000000000000000000000000000000000000'

>>> RootGaugeFactory.set_call_proxy('0x1234567890123456789012345678901234567890')

>>> RootGaugeFactory.call_proxy()
'0x1234567890123456789012345678901234567890'
```


</Example>


::::


---

## Contract Ownership

For contract ownership details, see [here](../../references/curve-practices.md#commit--accept).
