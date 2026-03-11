import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# FeeAllocator



The `FeeAllocator` is a contract that allocates protocol fees between different receivers based on configurable weights. It sits between the [`Hooker`](hooker.md) and the [`FeeDistributor`](fee-distributor.md), splitting the accumulated crvUSD fees among a set of receivers before forwarding the remainder to the `FeeDistributor` for distribution to veCRV holders.

Receivers can be assigned weights in basis points (bps), with a maximum total weight of 5,000 bps (50%). The remaining portion (at least 50%) always flows to the `FeeDistributor`.

:::vyper[`FeeAllocator.vy`]

The source code for the `FeeAllocator.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-burners/blob/main/contracts/FeeAllocator.vy). The contract is written using [Vyper](https://github.com/vyperlang/vyper) version `0.4.1` and utilizes a [Snekmate module](https://github.com/pcaversaccio/snekmate/blob/main/src/snekmate/auth/ownable.vy) to handle contract ownership.

The contract is deployed on :logos-ethereum: Ethereum at [`0x22530d384cd9915e096ead2db7f82ee81f8eb468`](https://etherscan.io/address/0x22530d384cd9915e096ead2db7f82ee81f8eb468).

<ContractABI>


```json
[{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"old_weight","type":"uint256"},{"indexed":false,"name":"new_weight","type":"uint256"}],"name":"ReceiverSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"}],"name":"ReceiverRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"total_amount","type":"uint256"},{"indexed":false,"name":"distributor_share","type":"uint256"}],"name":"FeesDistributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previous_owner","type":"address"},{"indexed":true,"name":"new_owner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"name":"new_owner","type":"address"}],"name":"transfer_ownership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"_receiver","type":"address"},{"name":"_weight","type":"uint256"}],"name":"set_receiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"name":"receiver","type":"address"},{"name":"weight","type":"uint256"}],"name":"_configs","type":"tuple[]"}],"name":"set_multiple_receivers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_receiver","type":"address"}],"name":"remove_receiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distribute_fees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"n_receivers","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"distributor_weight","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_RECEIVERS","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_TOTAL_WEIGHT","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee_distributor","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee_collector","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee_token","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"address"}],"name":"receiver_weights","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"uint256"}],"name":"receivers","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"total_weight","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"_fee_distributor","type":"address"},{"name":"_fee_collector","type":"address"},{"name":"_owner","type":"address"}],"outputs":[],"stateMutability":"nonpayable","type":"constructor"}]
```

</ContractABI>

:::


---


## Distributing Fees

### `distribute_fees`
::::description[`FeeAllocator.distribute_fees()`]

:::guard[Guarded Method]
This function can only be called by the `hooker` address of the [`FeeCollector`](fee-collector.md) contract. The `hooker` is the contract responsible for orchestrating the fee forwarding process.
:::

Function to distribute accumulated crvUSD fees to receivers based on their weights. The function first transfers the fee token balance from the caller (the `hooker`) to this contract, then distributes proportional amounts to each receiver based on their weight. The remaining balance is forwarded to the [`FeeDistributor`](fee-distributor.md) for distribution to veCRV holders.

Emits: `FeesDistributed` event.

<SourceCode>

```vyper
@external
@nonreentrant
def distribute_fees():
    """
    @notice Distribute accumulated crvUSD fees to receivers based on their weights
    """
    assert (msg.sender == staticcall fee_collector.hooker()), "distribute: hooker only"

    amount_receivable: uint256 = staticcall fee_token.balanceOf(msg.sender)
    extcall fee_token.transferFrom(msg.sender, self, amount_receivable)
    balance: uint256 = staticcall fee_token.balanceOf(self)
    assert balance > 0, "receivers: no fees to distribute"

    remaining_balance: uint256 = balance

    for receiver: address in self.receivers:
        weight: uint256 = self.receiver_weights[receiver]
        amount: uint256 = balance * weight // MAX_BPS
        if amount > 0:
            extcall fee_token.transfer(receiver, amount, default_return_value=True)
            remaining_balance -= amount
    extcall fee_distributor.burn(fee_token.address)
    log FeesDistributed(total_amount=balance, distributor_share=remaining_balance)
```

</SourceCode>

<Example>

```shell
>>> FeeAllocator.distribute_fees()
```

</Example>

::::


---


## Managing Receivers

### `set_receiver`
::::description[`FeeAllocator.set_receiver(_receiver: address, _weight: uint256)`]

:::guard[Guarded Method by [Snekmate 🐍](https://github.com/pcaversaccio/snekmate)]
This contract makes use of a Snekmate module to manage roles and permissions. This specific function can only be called by the current `owner` of the contract.
:::

Function to add a new receiver or update the weight of an existing receiver. Weights are specified in basis points (bps) where 10,000 = 100%. The total weight of all receivers cannot exceed `MAX_TOTAL_WEIGHT` (5,000 bps = 50%). To remove a receiver, use [`remove_receiver`](#remove_receiver) instead.

| Input       | Type      | Description                                       |
| ----------- | --------- | ------------------------------------------------- |
| `_receiver` | `address` | Address of the receiver                           |
| `_weight`   | `uint256` | Weight assigned to the receiver in basis points   |

Emits: `ReceiverSet` event.

<SourceCode>

<Tabs>
<TabItem value="FeeAllocator.vy" label="FeeAllocator.vy">

```vyper
@internal
def _set_receiver(_receiver: address, _weight: uint256):
    """
    @notice Add or update a receiver with a specified weight
    @param _receiver The address of the receiver
    @param _weight The weight assigned to the receiver
    """
    ownable._check_owner()
    assert _receiver != empty(address), "zeroaddr: receiver"
    assert _weight > 0, "receivers: invalid weight, use remove_receiver"

    old_weight: uint256 = self.receiver_weights[_receiver]
    new_total_weight: uint256 = self.total_weight

    if old_weight > 0:
        new_total_weight = new_total_weight - old_weight + _weight
    else:
        assert (len(self.receivers) < MAX_RECEIVERS), "receivers: max limit reached"
        new_total_weight += _weight

    assert (new_total_weight <= MAX_TOTAL_WEIGHT), "receivers: exceeds max total weight"

    if old_weight == 0:
        self.receiver_indices[_receiver] = (
            len(self.receivers) + 1
        )  # offset by 1, 0 is for deleted receivers
        self.receivers.append(_receiver)

    self.receiver_weights[_receiver] = _weight
    self.total_weight = new_total_weight

    log ReceiverSet(receiver=_receiver, old_weight=old_weight, new_weight=_weight)


@external
def set_receiver(_receiver: address, _weight: uint256):
    """
    @notice Add or update a receiver with a specified weight
    @param _receiver The address of the receiver
    @param _weight The weight assigned to the receiver
    """
    self._set_receiver(_receiver, _weight)
```

</TabItem>
<TabItem value="ownable.vy" label="ownable.vy (Snekmate 🐍)">

```vyper
@internal
def _check_owner():
    """
    @dev Throws if the sender is not the owner.
    """
    assert msg.sender == self.owner, "ownable: caller is not the owner"
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
>>> FeeAllocator.set_receiver("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", 1000)
```

</Example>

::::


### `set_multiple_receivers`
::::description[`FeeAllocator.set_multiple_receivers(_configs: DynArray[ReceiverConfig, MAX_RECEIVERS])`]

:::guard[Guarded Method by [Snekmate 🐍](https://github.com/pcaversaccio/snekmate)]
This contract makes use of a Snekmate module to manage roles and permissions. This specific function can only be called by the current `owner` of the contract.
:::

Function to add or update multiple receivers at once. Each configuration in the array specifies a receiver address and its weight. When adding new receivers whose combined weight might temporarily exceed `MAX_TOTAL_WEIGHT`, place receivers being updated with lower weights first in the array.

| Input      | Type                                      | Description                                        |
| ---------- | ----------------------------------------- | -------------------------------------------------- |
| `_configs` | `DynArray[ReceiverConfig, MAX_RECEIVERS]` | Array of receiver configurations (address, weight)  |

Emits: `ReceiverSet` event for each receiver.

<SourceCode>

<Tabs>
<TabItem value="FeeAllocator.vy" label="FeeAllocator.vy">

```vyper
@external
def set_multiple_receivers(_configs: DynArray[ReceiverConfig, MAX_RECEIVERS]):
    """
    @notice Add or update multiple receivers with specified weights
    @param _configs Array of receiver configurations (address, weight)
    @dev When adding new receivers, if total weight might exceed MAX_TOTAL_WEIGHT,
         place receivers being updated with lower weights first in the array
    """
    assert len(_configs) > 0, "receivers: empty array"

    for i: uint256 in range(MAX_RECEIVERS):
        if i >= len(_configs):
            break

        config: ReceiverConfig = _configs[i]
        self._set_receiver(config.receiver, config.weight)


@internal
def _set_receiver(_receiver: address, _weight: uint256):
    """
    @notice Add or update a receiver with a specified weight
    @param _receiver The address of the receiver
    @param _weight The weight assigned to the receiver
    """
    ownable._check_owner()
    assert _receiver != empty(address), "zeroaddr: receiver"
    assert _weight > 0, "receivers: invalid weight, use remove_receiver"

    old_weight: uint256 = self.receiver_weights[_receiver]
    new_total_weight: uint256 = self.total_weight

    if old_weight > 0:
        new_total_weight = new_total_weight - old_weight + _weight
    else:
        assert (len(self.receivers) < MAX_RECEIVERS), "receivers: max limit reached"
        new_total_weight += _weight

    assert (new_total_weight <= MAX_TOTAL_WEIGHT), "receivers: exceeds max total weight"

    if old_weight == 0:
        self.receiver_indices[_receiver] = (
            len(self.receivers) + 1
        )  # offset by 1, 0 is for deleted receivers
        self.receivers.append(_receiver)

    self.receiver_weights[_receiver] = _weight
    self.total_weight = new_total_weight

    log ReceiverSet(receiver=_receiver, old_weight=old_weight, new_weight=_weight)
```

</TabItem>
<TabItem value="ownable.vy" label="ownable.vy (Snekmate 🐍)">

```vyper
@internal
def _check_owner():
    """
    @dev Throws if the sender is not the owner.
    """
    assert msg.sender == self.owner, "ownable: caller is not the owner"
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
>>> FeeAllocator.set_multiple_receivers([("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", 1000), ("0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B", 2000)])
```

</Example>

::::


### `remove_receiver`
::::description[`FeeAllocator.remove_receiver(_receiver: address)`]

:::guard[Guarded Method by [Snekmate 🐍](https://github.com/pcaversaccio/snekmate)]
This contract makes use of a Snekmate module to manage roles and permissions. This specific function can only be called by the current `owner` of the contract.
:::

Function to remove a receiver from the list. The receiver's weight is subtracted from the total weight, effectively increasing the share that flows to the `FeeDistributor`.

| Input       | Type      | Description                       |
| ----------- | --------- | --------------------------------- |
| `_receiver` | `address` | Address of the receiver to remove |

Emits: `ReceiverRemoved` event.

<SourceCode>

<Tabs>
<TabItem value="FeeAllocator.vy" label="FeeAllocator.vy">

```vyper
@external
def remove_receiver(_receiver: address):
    """
    @notice Remove a receiver from the list
    @param _receiver The address of the receiver to remove
    """
    ownable._check_owner()
    weight: uint256 = self.receiver_weights[_receiver]
    assert weight > 0, "receivers: does not exist"

    index_to_remove: uint256 = self.receiver_indices[_receiver] - 1
    last_index: uint256 = len(self.receivers) - 1
    assert self.receivers[index_to_remove] == _receiver
    if index_to_remove < last_index:
        last_receiver: address = self.receivers[last_index]
        self.receivers[index_to_remove] = last_receiver
        self.receiver_indices[last_receiver] = index_to_remove + 1

    self.receivers.pop()

    self.receiver_weights[_receiver] = 0
    self.receiver_indices[_receiver] = 0

    self.total_weight -= weight

    log ReceiverRemoved(receiver=_receiver)
```

</TabItem>
<TabItem value="ownable.vy" label="ownable.vy (Snekmate 🐍)">

```vyper
@internal
def _check_owner():
    """
    @dev Throws if the sender is not the owner.
    """
    assert msg.sender == self.owner, "ownable: caller is not the owner"
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
>>> FeeAllocator.remove_receiver("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
```

</Example>

::::


### `receivers`
::::description[`FeeAllocator.receivers(arg0: uint256) -> address: view`]

Getter for the receiver address at a given index.

| Input  | Type      | Description          |
| ------ | --------- | -------------------- |
| `arg0` | `uint256` | Index of the receiver |

Returns: receiver address (`address`).

<SourceCode>

```vyper
receivers: public(DynArray[address, MAX_RECEIVERS])
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function receivers(uint256) view returns (address)"]}
  method="receivers"
  args={["0"]}
  labels={["arg0"]}
  contractName="FeeAllocator"
/>

</Example>

::::


### `receiver_weights`
::::description[`FeeAllocator.receiver_weights(arg0: address) -> uint256: view`]

Getter for the weight of a specific receiver in basis points.

| Input  | Type      | Description            |
| ------ | --------- | ---------------------- |
| `arg0` | `address` | Address of the receiver |

Returns: receiver weight in bps (`uint256`).

<SourceCode>

```vyper
receiver_weights: public(HashMap[address, uint256])
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function receiver_weights(address) view returns (uint256)"]}
  method="receiver_weights"
  args={["0x0000000000000000000000000000000000000000"]}
  labels={["arg0"]}
  contractName="FeeAllocator"
/>

</Example>

::::


### `n_receivers`
::::description[`FeeAllocator.n_receivers() -> uint256: view`]

Getter for the number of receivers currently registered.

Returns: number of receivers (`uint256`).

<SourceCode>

```vyper
@external
@view
def n_receivers() -> uint256:
    """
    @notice Get the number of receivers
    @return The number of receivers
    """
    return len(self.receivers)
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function n_receivers() view returns (uint256)"]}
  method="n_receivers"
  contractName="FeeAllocator"
/>

</Example>

::::


### `total_weight`
::::description[`FeeAllocator.total_weight() -> uint256: view`]

Getter for the sum of all receiver weights in basis points.

Returns: total weight in bps (`uint256`).

<SourceCode>

```vyper
total_weight: public(uint256)
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function total_weight() view returns (uint256)"]}
  method="total_weight"
  contractName="FeeAllocator"
/>

</Example>

::::


### `distributor_weight`
::::description[`FeeAllocator.distributor_weight() -> uint256: view`]

Getter for the portion of fees that flows to the `FeeDistributor` for veCRV holders. This is calculated as `MAX_BPS - total_weight`, meaning it is the complement of all receiver weights combined.

Returns: distributor weight in bps (`uint256`).

<SourceCode>

```vyper
@external
@view
def distributor_weight() -> uint256:
    """
    @notice Get the portion of fees going to the fee distributor for veCRV
    @return The distributors' weight
    """
    return MAX_BPS - self.total_weight
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function distributor_weight() view returns (uint256)"]}
  method="distributor_weight"
  contractName="FeeAllocator"
/>

</Example>

::::


---


## Contract Ownership

Ownership of the contract is managed using the [`ownable.vy`](https://github.com/pcaversaccio/snekmate/blob/main/src/snekmate/auth/ownable.vy) module from [Snekmate](https://github.com/pcaversaccio/snekmate) which implements a basic access control mechanism, where there is an `owner` that can be granted exclusive access to specific functions.


### `owner`
::::description[`FeeAllocator.owner() -> address: view`]

Getter for the owner of the contract. The owner can manage receivers and their weights via `set_receiver`, `set_multiple_receivers`, and `remove_receiver`.

Returns: contract owner (`address`).

<SourceCode>

<Tabs>
<TabItem value="FeeAllocator.vy" label="FeeAllocator.vy">

```vyper
from snekmate.auth import ownable
initializes: ownable
exports: (ownable.transfer_ownership, ownable.owner)

@deploy
def __init__(
    _fee_distributor: FeeDistributor,
    _fee_collector: FeeCollector,
    _owner: address,
):
    assert _owner != empty(address), "zeroaddr: owner"
    assert _fee_distributor.address != empty(address), "zeroaddr: fee_distributor"
    assert _fee_collector.address != empty(address), "zeroaddr: fee_collector"

    ownable.__init__()
    ownable._transfer_ownership(_owner)

    fee_distributor = _fee_distributor
    fee_collector = _fee_collector
    fee_token = IERC20(staticcall fee_collector.target())
    extcall fee_token.approve(
        fee_distributor.address, max_value(uint256), default_return_value=True
    )
```

</TabItem>
<TabItem value="ownable.vy" label="ownable.vy (Snekmate 🐍)">

```vyper
owner: public(address)

@deploy
@payable
def __init__():
    self._transfer_ownership(msg.sender)

@internal
def _transfer_ownership(new_owner: address):
    old_owner: address = self.owner
    self.owner = new_owner
    log OwnershipTransferred(old_owner, new_owner)
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function owner() view returns (address)"]}
  method="owner"
  contractName="FeeAllocator"
/>

</Example>

::::


### `transfer_ownership`
::::description[`FeeAllocator.transfer_ownership(new_owner: address)`]

:::guard[Guarded Method by [Snekmate 🐍](https://github.com/pcaversaccio/snekmate)]
This contract makes use of a Snekmate module to manage roles and permissions. This specific function can only be called by the current `owner` of the contract.
:::

Function to transfer the ownership of the contract to a new address.

| Input       | Type      | Description                  |
| ----------- | --------- | ---------------------------- |
| `new_owner` | `address` | New owner of the contract    |

Emits: `OwnershipTransferred` event.

<SourceCode>

<Tabs>
<TabItem value="FeeAllocator.vy" label="FeeAllocator.vy">

```vyper
from snekmate.auth import ownable
initializes: ownable
exports: (ownable.transfer_ownership, ownable.owner)
```

</TabItem>
<TabItem value="ownable.vy" label="ownable.vy (Snekmate 🐍)">

```vyper
owner: public(address)

event OwnershipTransferred:
    previous_owner: indexed(address)
    new_owner: indexed(address)

@external
def transfer_ownership(new_owner: address):
    self._check_owner()
    assert new_owner != empty(address), "ownable: new owner is the zero address"
    self._transfer_ownership(new_owner)

@internal
def _check_owner():
    assert msg.sender == self.owner, "ownable: caller is not the owner"

@internal
def _transfer_ownership(new_owner: address):
    old_owner: address = self.owner
    self.owner = new_owner
    log OwnershipTransferred(old_owner, new_owner)
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
>>> FeeAllocator.transfer_ownership("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
```

</Example>

::::


---


## Other Methods

### `fee_distributor`
::::description[`FeeAllocator.fee_distributor() -> address: view`]

Getter for the immutable address of the `FeeDistributor` contract that receives the remaining fees after receiver allocations.

Returns: fee distributor address (`address`).

<SourceCode>

```vyper
fee_distributor: public(immutable(FeeDistributor))
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function fee_distributor() view returns (address)"]}
  method="fee_distributor"
  contractName="FeeAllocator"
/>

</Example>

::::


### `fee_collector`
::::description[`FeeAllocator.fee_collector() -> address: view`]

Getter for the immutable address of the `FeeCollector` contract. The `hooker` of this contract is authorized to call `distribute_fees`.

Returns: fee collector address (`address`).

<SourceCode>

```vyper
fee_collector: public(immutable(FeeCollector))
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function fee_collector() view returns (address)"]}
  method="fee_collector"
  contractName="FeeAllocator"
/>

</Example>

::::


### `fee_token`
::::description[`FeeAllocator.fee_token() -> address: view`]

Getter for the immutable address of the fee token (crvUSD). This is set at deployment by reading the `target` from the `FeeCollector`.

Returns: fee token address (`address`).

<SourceCode>

```vyper
fee_token: public(immutable(IERC20))
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function fee_token() view returns (address)"]}
  method="fee_token"
  contractName="FeeAllocator"
/>

</Example>

::::


### `MAX_RECEIVERS`
::::description[`FeeAllocator.MAX_RECEIVERS() -> uint256: view`]

Getter for the maximum number of receivers that can be registered. This is a constant set to 10.

Returns: maximum number of receivers (`uint256`).

<SourceCode>

```vyper
MAX_RECEIVERS: public(constant(uint256)) = 10
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function MAX_RECEIVERS() view returns (uint256)"]}
  method="MAX_RECEIVERS"
  contractName="FeeAllocator"
/>

</Example>

::::


### `MAX_TOTAL_WEIGHT`
::::description[`FeeAllocator.MAX_TOTAL_WEIGHT() -> uint256: view`]

Getter for the maximum total weight that can be assigned to all receivers combined. This is a constant set to 5,000 bps (50%), ensuring at least half of all fees always go to the `FeeDistributor`.

Returns: maximum total weight in bps (`uint256`).

<SourceCode>

```vyper
MAX_TOTAL_WEIGHT: public(constant(uint256)) = 5_000  # in bps
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function MAX_TOTAL_WEIGHT() view returns (uint256)"]}
  method="MAX_TOTAL_WEIGHT"
  contractName="FeeAllocator"
/>

</Example>

::::


### `VERSION`
::::description[`FeeAllocator.VERSION() -> String[8]: view`]

Getter for the version of the contract.

Returns: contract version (`String[8]`).

<SourceCode>

```vyper
VERSION: public(constant(String[8])) = "0.1.0"
```

</SourceCode>

<Example>

<ContractCall
  address="0x22530d384cd9915e096ead2db7f82ee81f8eb468"
  abi={["function VERSION() view returns (string)"]}
  method="VERSION"
  contractName="FeeAllocator"
/>

</Example>

::::
