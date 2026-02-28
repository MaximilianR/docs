# RewardsHandler

The `RewardsHandler` contract manages the distribution of crvUSD rewards to `Savings crvUSD (scrvUSD)`. The contract takes snapshots of the ratio of crvUSD deposited into the Vault relative to the total circulating supply of crvUSD to calculate a time-weighted average of this ratio to determine the amount of rewards to request from the `FeeSplitter`.

:::vyper[`RewardsHandler.vy`]

The source code for the `RewardsHandler.vy` contract is available on [ GitHub](https://github.com/curvefi/scrvusd/blob/main/contracts/RewardsHandler.vy). The contract is written in [Vyper](https://vyperlang.org/) version `~=0.4`.

The contract is deployed on :logos-ethereum: Ethereum at [`0xe8d1e2531761406af1615a6764b0d5ff52736f56`](https://etherscan.io/address/0xe8d1e2531761406af1615a6764b0d5ff52736f56).

The source code was audited by [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/). The audit report is available on [ GitHub](https://github.com/curvefi/scrvusd/blob/main/audits/ChainSecurity_Curve_scrvUSD_audit.pdf).

:::

---

## General Explainer

The weight allocated to the `RewardsHandler` in the `FeeSplitter` is determined by the time-weighted average of the ratio of crvUSD deposited into the Vault compared to the total circulating supply of crvUSD. The weight allocated to the `RewardsHandler` can be permissionlessly distributed as rewards to the `Savings Vault (scrvUSD)` by anyone calling the [`process_rewards`](#process_rewards) function.

To calculate this time-weighted average, the `RewardsHandler` uses a `TWA module` that takes snapshots of the deposited supply ratio and stores them in a `Snapshot` struct. All structs are stored in a dynamic array called `snapshots`. Each snapshot includes a ratio value and the timestamp at which it was taken.

<details>
<summary>Source code for snapshot calculation and storage</summary>

```vyper
from contracts.interfaces import IStablecoinLens

@external
def take_snapshot():
    """
    @notice Function that anyone can call to take a snapshot of the current
    deposited supply ratio in the vault. This is used to compute the time-weighted
    average of the TVL to decide on the amount of rewards to ask for (weight).

    @dev There's no point in MEVing this snapshot as the rewards distribution rate
    can always be reduced (if a malicious actor inflates the value of the snapshot)
    or the minimum amount of rewards can always be increased (if a malicious actor
    deflates the value of the snapshot).
    """
    self._take_snapshot()

@internal
def _take_snapshot():
    """
    @notice Internal function to take a snapshot of the current deposited supply
    ratio in the vault.
    """
    # get the circulating supply from a helper contract.
    # supply in circulation = controllers' debt + peg keppers' debt
    circulating_supply: uint256 = staticcall self.stablecoin_lens.circulating_supply()

    # obtain the supply of crvUSD contained in the vault by checking its totalAssets.
    # This will not take into account rewards that are not yet distributed.
    supply_in_vault: uint256 = staticcall vault.totalAssets()

    # here we intentionally reduce the precision of the ratio because the
    # dynamic weight interface expects a percentage in BPS.
    supply_ratio: uint256 = supply_in_vault * MAX_BPS // circulating_supply

    twa._take_snapshot(supply_ratio)
```

```vyper
event SnapshotTaken:
    value: uint256
    timestamp: uint256

snapshots: public(DynArray[Snapshot, MAX_SNAPSHOTS])
min_snapshot_dt_seconds: public(uint256)  # Minimum time between snapshots in seconds
twa_window: public(uint256)  # Time window in seconds for TWA calculation
last_snapshot_timestamp: public(uint256)  # Timestamp of the last snapshot

@internal
def _take_snapshot(_value: uint256):
    """
    @notice Stores a snapshot of the tracked value.
    @param _value The value to store.
    """
    if (len(self.snapshots) == 0) or (  # First snapshot
        self.last_snapshot_timestamp + self.min_snapshot_dt_seconds <= block.timestamp # after dt
    ):
        self.last_snapshot_timestamp = block.timestamp
        self.snapshots.append(
            Snapshot(tracked_value=_value, timestamp=block.timestamp)
        )  # store the snapshot into the DynArray
        log SnapshotTaken(_value, block.timestamp)
```

</details>

---

## Snapshots

Snapshots are used to calculate the time-weighted average (TWA) of the ratio between crvUSD deposited into the Vault and the total circulating supply of crvUSD. Each snapshot stores the ratio of crvUSD deposited in the Vault to the circulating supply of crvUSD, along with the timestamp when the snapshot was taken. Taking a snapshot is fully permissionless—anyone can take one by calling the [`take_snapshot`](#take_snapshot) function. The snapshot values are stored in a `Snapshot` struct, and each struct is saved in a dynamic array called `snapshots`.

```vyper
MAX_SNAPSHOTS: constant(uint256) = 10**18  # 31.7 billion years if snapshot every second

snapshots: public(DynArray[Snapshot, MAX_SNAPSHOTS])

struct Snapshot:
    tracked_value: uint256
    timestamp: uint256
```

Snapshots can only be taken once a minimum time interval ([`min_snapshot_dt_seconds`](#min_snapshot_dt_seconds)) has passed since the last one. The TWA is then computed using the trapezoidal rule, iterating over the stored snapshots in reverse chronological order to calculate the weighted average of the tracked value over the specified time window ([`twa_window`](#twa_window)).

*Snapshots are taken by calling the [`take_snapshot`](#take_snapshot) function. When this function is called, the snapshot value is computed and stored as follows:*

1. **Determine the circulating supply of crvUSD.**Directly calling `crvUSD.totalSupply()` is not feasible because some crvUSD is minted to specific contracts and is not part of the circulating supply (e.g., unborrowed crvUSD held by Controllers, crvUSD allocated to PegKeepers, or crvUSD assigned to the [`FlashLender`](../crvusd/flash-lender.md)). Therefore, the [`StablecoinLens`](./stablecoin-lens.md) contract is used to obtain the actual circulating supply of crvUSD.

2. **Obtain the amount of crvUSD held in the Vault**by calling `Vault.totalAssets()`, which excludes rewards that have not yet been distributed.

3. **Calculate the supply ratio**as follows:

    $$\text\{SupplyRatio\} = \frac\{\text\{SupplyInVault\} \times 10^\{18\}\}\{\text\{CirculatingSupply\}\}$$

4. **Store the calculated supply ratio**and the timestamp at which the snapshot was taken in the dynamic array.

---

### `take_snapshot`
::::description[`RewardsHandler.take_snapshot()`]

:::warning[MEVing Snapshot Taking]

There's no point in MEVing this snapshot as the rewards distribution rate can always be reduced (if a malicious actor inflates the value of the snapshot) or the minimum amount of rewards can always be increased (if a malicious actor deflates the value of the snapshot).

:::

Function to take a snapshot of the current deposited supply ratio in the Vault. This function is fully permissionless and can be called by anyone. Snapshots are used to compute the time-weighted average of the TVL to decide on the amount of rewards to ask for (weight).

Minimum time inbetween snapshots is defined by `min_snapshot_dt_seconds`. The maximum number of snapshots is set to `10^18`, which is equivalent to 31.7 billion years if a snapshot were to be taken every second.

Emits: `SnapshotTaken` event.

<SourceCode>

```vyper
@external
def take_snapshot():
    """
    @notice Function that anyone can call to take a snapshot of the current
    deposited supply ratio in the vault. This is used to compute the time-weighted
    average of the TVL to decide on the amount of rewards to ask for (weight).

    @dev There's no point in MEVing this snapshot as the rewards distribution rate
    can always be reduced (if a malicious actor inflates the value of the snapshot)
    or the minimum amount of rewards can always be increased (if a malicious actor
    deflates the value of the snapshot).
    """
    self._take_snapshot()

@internal
def _take_snapshot():
    """
    @notice Internal function to take a snapshot of the current deposited supply
    ratio in the vault.
    """
    # get the circulating supply from a helper contract.
    # supply in circulation = controllers' debt + peg keppers' debt
    circulating_supply: uint256 = staticcall self.stablecoin_lens.circulating_supply()

    # obtain the supply of crvUSD contained in the vault by checking its totalAssets.
    # This will not take into account rewards that are not yet distributed.
    supply_in_vault: uint256 = staticcall vault.totalAssets()

    # here we intentionally reduce the precision of the ratio because the
    # dynamic weight interface expects a percentage in BPS.
    supply_ratio: uint256 = supply_in_vault * MAX_BPS // circulating_supply

    twa._take_snapshot(supply_ratio)
```

</SourceCode>

<Example>

```shell
>>> RewardsHandler.take_snapshot()
```

</Example>

::::

### `snapshots`
::::description[`TWA.snapshots(arg: uint256) -> DynArray[Snapshot, MAX_SNAPSHOTS]`]

Getter for a `Snapshot` struct at a specific index. First snapshot is at index `0`, second at index `1`, etc.

Returns: `Snapshot` struct containing the ratio of deposited crvUSD into the Vault to the total circulating supply of crvUSD (`uint256`) and the timestamp (`uint256`).

| Input | Type      | Description                          |
| ----- | --------- | ------------------------------------ |
| `arg` | `uint256` | Index of the snapshot to return       |

<SourceCode>

```vyper
event SnapshotTaken:
    value: uint256
    timestamp: uint256

MAX_SNAPSHOTS: constant(uint256) = 10**18  # 31.7 billion years if snapshot every second

snapshots: public(DynArray[Snapshot, MAX_SNAPSHOTS])

struct Snapshot:
    tracked_value: uint256
    timestamp: uint256

@internal
def _take_snapshot(_value: uint256):
    """
    @notice Stores a snapshot of the tracked value.
    @param _value The value to store.
    """
    if self.last_snapshot_timestamp + self.min_snapshot_dt_seconds <= block.timestamp:
        self.last_snapshot_timestamp = block.timestamp
        self.snapshots.append(
            Snapshot(tracked_value=_value, timestamp=block.timestamp)
        )  # store the snapshot into the DynArray
        log SnapshotTaken(_value, block.timestamp)
```

</SourceCode>

<Example>

</Example>


::::

### `min_snapshot_dt_seconds`
::::description[`TWA.min_snapshot_dt_seconds() -> uint256: view`]

Getter for the minimum time between snapshots in seconds. This value can be changed using the [`set_twa_snapshot_dt`](#set_twa_snapshot_dt) function.

Returns: minimum time between snapshots in seconds (`uint256`).

<SourceCode>

```vyper
min_snapshot_dt_seconds: public(uint256)  # Minimum time between snapshots in seconds

@deploy
def __init__(_twa_window: uint256, _min_snapshot_dt_seconds: uint256):
    self._set_twa_window(_twa_window)
    self._set_snapshot_dt(max(1, _min_snapshot_dt_seconds))
```

</SourceCode>

<Example>

</Example>


::::

### `last_snapshot_timestamp`
::::description[`TWA.last_snapshot_timestamp() -> uint256: view`]

Getter for the timestamp of the last snapshot taken. This variable is adjusted each time a snapshot is taken.

Returns: timestamp of the last snapshot taken (`uint256`).

<SourceCode>

```vyper
last_snapshot_timestamp: public(uint256)  # Timestamp of the last snapshot

@internal
def _take_snapshot(_value: uint256):
    """
    @notice Stores a snapshot of the tracked value.
    @param _value The value to store.
    """
    if self.last_snapshot_timestamp + self.min_snapshot_dt_seconds <= block.timestamp:
        self.last_snapshot_timestamp = block.timestamp
        self.snapshots.append(
            Snapshot(tracked_value=_value, timestamp=block.timestamp)
        )  # store the snapshot into the DynArray
        log SnapshotTaken(_value, block.timestamp)
```

</SourceCode>

<Example>

</Example>


::::

### `get_len_snapshots`
::::description[`TWA.get_len_snapshots() -> uint256: view`]

Getter for the total number of snapshots taken and stored. Increments by one each time a snapshot is taken.

Returns: total number of snapshots stored (`uint256`).

<SourceCode>

```vyper
snapshots: public(DynArray[Snapshot, MAX_SNAPSHOTS])

@external
@view
def get_len_snapshots() -> uint256:
    """
    @notice Returns the number of snapshots stored.
    """
    return len(self.snapshots)
```

</SourceCode>

<Example>

</Example>


::::

---

## Weights and TWA

The `weight` represents the percentage of the total rewards requested from the `FeeSplitter`. This value is denominated in 10000 BPS (100%). E.g. if the weight is 500, then RewardsHandler will request 5% of the total rewards from the `FeeSplitter`.

The `weight` is computed as a time-weighted average (TWA) of the ratio between deposited crvUSD in the Vault and total circulating supply of crvUSD.

Weight calculation is handled using a time-weighted average (TWA) module. While this module can be used to calculate any kind of time-weighted value, the scrvUSD system uses it to compute the time-weighted average of the deposited crvUSD in the Vault compared to the total circulating crvUSD supply.

The value is calculated over a specified time window defined by `twa_window` by iterating backwards over the snapshots stored in the `snapshots` dynamic array.

### `compute_twa`
::::description[`TWA.compute_twa() -> uint256: view`]

Function to compute the time-weighted average of the ratio between deposited crvUSD in the Vault and total circulating supply of crvUSD by iterating over the stored snapshots in reverse chronological order.

Returns: time-weighted average of the ratio between deposited crvUSD and total circulating supply of crvUSD (`uint256`).

<SourceCode>

```vyper
snapshots: public(DynArray[Snapshot, MAX_SNAPSHOTS])
min_snapshot_dt_seconds: public(uint256)  # Minimum time between snapshots in seconds
twa_window: public(uint256)  # Time window in seconds for TWA calculation
last_snapshot_timestamp: public(uint256)  # Timestamp of the last snapshot


struct Snapshot:
    tracked_value: uint256
    timestamp: uint256

@external
@view
def compute_twa() -> uint256:
    """
    @notice External endpoint for _compute() function.
    """
    return self._compute()

@internal
@view
def _compute() -> uint256:
    """
    @notice Computes the TWA over the specified time window by iterating backwards over the snapshots.
    @return The TWA for tracked value over the self.twa_window.
    """
    num_snapshots: uint256 = len(self.snapshots)
    if num_snapshots == 0:
        return 0

    time_window_start: uint256 = block.timestamp - self.twa_window

    total_weighted_tracked_value: uint256 = 0
    total_time: uint256 = 0

    # Iterate backwards over all snapshots
    index_array_end: uint256 = num_snapshots - 1
    for i: uint256 in range(0, num_snapshots, bound=MAX_SNAPSHOTS):  # i from 0 to (num_snapshots-1)
        i_backwards: uint256 = index_array_end - i
        current_snapshot: Snapshot = self.snapshots[i_backwards]
        next_snapshot: Snapshot = current_snapshot
        if i != 0:  # If not the first iteration (last snapshot), get the next snapshot
            next_snapshot = self.snapshots[i_backwards + 1]

        # Time Axis (Increasing to the Right) --->
        #                                        SNAPSHOT
        # |---------|---------|---------|------------------------|---------|---------|
        # t0   time_window_start      interval_start        interval_end      block.timestamp (Now)

        interval_start: uint256 = current_snapshot.timestamp
        # Adjust interval start if it is before the time window start
        if interval_start < time_window_start:
            interval_start = time_window_start

        interval_end: uint256 = interval_start
        if i == 0:  # First iteration - we are on the last snapshot (i_backwards = num_snapshots - 1)
            # For the last snapshot, interval end is block.timestamp
            interval_end = block.timestamp
        else:
            # For other snapshots, interval end is the timestamp of the next snapshot
            interval_end = next_snapshot.timestamp

        if interval_end <= time_window_start:
            break

        time_delta: uint256 = interval_end - interval_start

        # Interpolation using the trapezoidal rule
        averaged_tracked_value: uint256 = (current_snapshot.tracked_value + next_snapshot.tracked_value) // 2

        # Accumulate weighted rate and time
        total_weighted_tracked_value += averaged_tracked_value * time_delta
        total_time += time_delta

    if total_time == 0 and len(self.snapshots) == 1:
        # case when only snapshot is taken in the block where computation is called
        return self.snapshots[0].tracked_value

    assert total_time > 0, "Zero total time!"
    twa: uint256 = total_weighted_tracked_value // total_time
    return twa
```

</SourceCode>

<Example>

</Example>


::::

### `twa_window`
::::description[`TWA.twa_window() -> uint256: view`]

Getter for the time window in seconds which is applied to the TWA calculation, essentially the length of the time window over which the TWA is computed. This value can be changed using the [`set_twa_window`](#set_twa_window) function.

Returns: time window in seconds for TWA calculation (`uint256`).

<SourceCode>

```vyper
twa_window: public(uint256)  # Time window in seconds for TWA calculation

@deploy
def __init__(_twa_window: uint256, _min_snapshot_dt_seconds: uint256):
    self._set_twa_window(_twa_window)
    self._set_snapshot_dt(max(1, _min_snapshot_dt_seconds))
```

</SourceCode>

<Example>

</Example>


::::

### `weight`
::::description[`RewardsHandler.weight() -> uint256: view`]

Getter for the weight of the rewards. This is the time-weighted average of the ratio between deposited crvUSD in the Vault and total circulating supply of crvUSD. This function is part of the dynamic weight interface expected by the `FeeSplitter` to know what percentage of funds should be sent for rewards distribution. Weight value is denominated in 10000 BPS (100%). E.g. if the weight is 2000, then `RewardsHandler` will request 20% of the total rewards from the `FeeSplitter`.

Returns: requested weight (`uint256`).

<SourceCode>

```vyper
MAX_BPS: constant(uint256) = 10**4  # 100%

# scaling factor for the deposited token / circulating supply ratio.
scaling_factor: public(uint256)

# the minimum amount of rewards requested to the FeeSplitter.
minimum_weight: public(uint256)

@external
@view
def weight() -> uint256:
    """
    @notice this function is part of the dynamic weight interface expected by the
    FeeSplitter to know what percentage of funds should be sent for rewards
    distribution to scrvUSD vault depositors.
    @dev `minimum_weight` acts as a lower bound for the percentage of rewards that
    should be distributed to depositors. This is useful to bootstrapping TVL by asking
    for more at the beginning and can also be increased in the future if someone
    tries to manipulate the time-weighted average of the tvl ratio.
    """
    raw_weight: uint256 = twa._compute() * self.scaling_factor // MAX_BPS
    return max(raw_weight, self.minimum_weight)
```

</SourceCode>

<Example>

</Example>


::::

### `minimum_weight`
::::description[`RewardsHandler.minimum_weight() -> uint256: view`]

Getter for the minimum weight. This is the minimum weight requested from the `FeeSplitter`. Value is set at initialization and can be changed by the [`set_minimum_weight`](#set_minimum_weight) function.

Returns: minimum weight (`uint256`).

<SourceCode>

```vyper
# the minimum amount of rewards requested to the FeeSplitter.
minimum_weight: public(uint256)

@deploy
def __init__(
    _stablecoin: IERC20,
    _vault: IVault,
    minimum_weight: uint256,
    scaling_factor: uint256,
    controller_factory: lens.IControllerFactory,
    admin: address,
):
    ...
    self._set_minimum_weight(minimum_weight)
    ...
```

</SourceCode>

<Example>

</Example>


::::

### `scaling_factor`
::::description[`RewardsHandler.scaling_factor() -> uint256: view`]

Getter for the scaling factor for the ratio between deposited crvUSD in the Vault and total circulating supply of crvUSD.

Returns: scaling factor (`uint256`).

<SourceCode>

```vyper
# scaling factor for the deposited token / circulating supply ratio.
scaling_factor: public(uint256)
```

</SourceCode>

<Example>

</Example>


::::

---

## Reward Distribution

Rewards are distributed to the Vault thought the `RewardsHandler` contract using a simple `process_rewards` function. This function permnissionlessly lets anyone distribute rewards to the Savings Vault.

### `process_rewards`
::::description[`RewardsHandler.process_rewards()`]

Function to process the crvUSD rewards by transferring the available balance to the Vault and then calling the `process_report` function to start streaming the rewards to scrvUSD. This function is permissionless and can be called by anyone. When calling this function, the contracts entire crvUSD balance will be transferred and used as rewards for the stakers.

<SourceCode>

```vyper
# the time over which rewards will be distributed mirror of the private
# `profit_max_unlock_time` variable from yearn vaults.
distribution_time: public(uint256)

@external
def process_rewards(take_snapshot: bool = True):
    """
    @notice Permissionless function that let anyone distribute rewards (if any) to
    the crvUSD vault.
    """
    # optional (advised) snapshot before distributing the rewards
    if take_snapshot:
        self._take_snapshot()

    # prevent the rewards from being distributed untill the distribution rate
    # has been set
    assert (staticcall vault.profitMaxUnlockTime() != 0), "rewards should be distributed over time"

    # any crvUSD sent to this contract (usually through the fee splitter, but
    # could also come from other sources) will be used as a reward for scrvUSD
    # vault depositors.
    available_balance: uint256 = staticcall stablecoin.balanceOf(self)

    assert available_balance > 0, "no rewards to distribute"

    # we distribute funds in 2 steps:
    # 1. transfer the actual funds
    extcall stablecoin.transfer(vault.address, available_balance)
    # 2. start streaming the rewards to users
    extcall vault.process_report(vault.address)
```

</SourceCode>

<Example>

```shell
>>> RewardsHandler.process_rewards()
''
```

</Example>

::::

### `distribution_time`
::::description[`RewardsHandler.distribution_time() -> uint256: view`]

Getter for the distribution time. This is the time it takes to stream the rewards.

Returns: distribution time (`uint256`).

<SourceCode>

```vyper
@view
@external
def distribution_time() -> uint256:
    """
    @notice Getter for the distribution time of the rewards.
    @return uint256 The time over which vault rewards will be distributed.
    """
    return staticcall vault.profitMaxUnlockTime()
```

</SourceCode>

<Example>

</Example>


::::

---

## Admin Controls

The contract uses the [Multi-Role-Based Access Control Module](https://github.com/pcaversaccio/snekmate/blob/main/src/snekmate/auth/access_control.vy) from [Snekmate](https://github.com/pcaversaccio/snekmate) to manage roles and permissions. This module ensures that only specific addresses assigned the `RATE_MANAGER` role can modify key parameters such as the Time-Weighted Average (TWA) window, the minimum time between snapshots, and the distribution time. Roles can only be granted or revoked by the `DEFAULT_ADMIN_ROLE` defined in the access module.

For a detailed explanation of how to use the access control module, please refer to the source code where its mechanics are explained in detail: [Snekmate access_control.vy](https://github.com/pcaversaccio/snekmate/blob/main/src/snekmate/auth/access_control.vy).

### `set_twa_window`
::::description[`RewardsHandler.set_twa_window(_twa_window: uint256)`]

:::guard[Guarded Method by Snekmate 🐍]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function is restricted to the `RATE_MANAGER` role.

:::

Function to set a new value for the `twa_window` variable in the `TWA` module. This value represents the time window over which the time-weighted average (TWA) is calculated.

Emits: `TWAWindowUpdated` event.

| Input         | Type      | Description                  |
| ------------- | --------- | ---------------------------- |
| `_twa_window` | `uint256` | New value for the TWA window |

<SourceCode>

```vyper
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)

RATE_MANAGER: public(constant(bytes32)) = keccak256("RATE_MANAGER")

@external
def set_twa_window(_twa_window: uint256):
    """
    @notice Setter for the time-weighted average window
    @param _twa_window The time window used to compute the TWA value of the
    balance/supply ratio.
    """
    access_control._check_role(RATE_MANAGER, msg.sender)
    twa._set_twa_window(_twa_window)
```

</SourceCode>

<Example>

This example sets the TWA window from 604800 seconds (1 week) to 302400 seconds (1/2 week).

```shell
>>> RewardsHandler.set_twa_window()
604800

>>> RewardsHandler.set_twa_window(302400)

>>> RewardsHandler.twa_window()
302400
```

</Example>

::::

### `set_twa_snapshot_dt`
::::description[`RewardsHandler.set_twa_snapshot_dt(_min_snapshot_dt_seconds: uint256)`]

:::guard[Guarded Method by Snekmate 🐍]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function is restricted to the `RATE_MANAGER` role.

:::

Function to set a new value for the `min_snapshot_dt_seconds` variable in the `TWA` module. This value represents the minimum time between snapshots.

Emits: `SnapshotIntervalUpdated` event.

| Input                      | Type      | Description                          |
| -------------------------- | --------- | ------------------------------------ |
| `_min_snapshot_dt_seconds` | `uint256` | New value for the minimum time between snapshots |

<SourceCode>

```vyper
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)

RATE_MANAGER: public(constant(bytes32)) = keccak256("RATE_MANAGER")

@external
def set_twa_snapshot_dt(_min_snapshot_dt_seconds: uint256):
    """
    @notice Setter for the time-weighted average minimal frequency.
    @param _min_snapshot_dt_seconds The minimum amount of time that should pass
    between two snapshots.
    """
    access_control._check_role(RATE_MANAGER, msg.sender)
    twa._set_snapshot_dt(_min_snapshot_dt_seconds)
```

</SourceCode>

<Example>

This example sets the minimum time between snapshots from 3600 seconds (1 hour) to 7200 seconds (2 hours).

```shell
>>> RewardsHandler.min_snapshot_dt_seconds()
3600

>>> RewardsHandler.set_twa_snapshot_dt(7200)

>>> RewardsHandler.min_snapshot_dt_seconds()
7200
```

</Example>

::::

### `set_distribution_time`
::::description[`RewardsHandler.set_distribution_time(new_distribution_time: uint256)`]

:::guard[Guarded Method by Snekmate 🐍]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function is restricted to the `RATE_MANAGER` role.

:::

Function to set the distribution time for the rewards. This is the time it takes to stream the rewards. Setting this value to 0 will immediately distribute all the rewards. If the value is set to a number greater than 0, the rewards will be distributed over the specified number of seconds.

Emits: `UpdateProfitMaxUnlockTime` and `StrategyReported` events from the `Vault` contract.

| Input                  | Type      | Description              |
| ---------------------- | --------- | ------------------------ |
| `new_distribution_time`| `uint256` | New distribution time    |

<SourceCode>

```vyper
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)

RATE_MANAGER: public(constant(bytes32)) = keccak256("RATE_MANAGER")

@external
def set_distribution_time(new_distribution_time: uint256):
    """
    @notice Admin function to correct the distribution rate of the rewards. Making
    this value lower will reduce the time it takes to stream the rewards, making it
    longer will do the opposite. Setting it to 0 will immediately distribute all the
    rewards.

    @dev This function can be used to prevent the rewards distribution from being
    manipulated (i.e. MEV twa snapshots to obtain higher APR for the vault). Setting
    this value to zero can be used to pause `process_rewards`.
    """
    access_control._check_role(RATE_MANAGER, msg.sender)

    # change the distribution time of the rewards in the vault
    extcall vault.setProfitMaxUnlockTime(new_distribution_time)

    # enact the changes
    extcall vault.process_report(vault.address)
```

</SourceCode>

<Example>

This example sets the distribution time from 1 week to 1/2 week.

```shell
>>> RewardsHandler.distribution_time()
604800

>>> RewardsHandler.set_distribution_time(302400)

>>> RewardsHandler.distribution_time()
302400
```

</Example>

::::

### `set_stablecoin_lens`
::::description[`RewardsHandler.set_stablecoin_lens(_lens: address)`]

:::guard[Guarded Method by Snekmate 🐍]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function is restricted to the `LENS_MANAGER` role.

:::

Function to set a new `stablecoin_lens` address.

Emits: `StablecoinLensUpdated` event.

| Input                      | Type      | Description                          |
| -------------------------- | --------- | ------------------------------------ |
| `_lens`                   | `address` | New `stablecoin_lens` address        |

<SourceCode>

```vyper
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)

LENS_MANAGER: public(constant(bytes32)) = keccak256("LENS_MANAGER")

event StablecoinLensUpdated:
    new_stablecoin_lens: IStablecoinLens

stablecoin_lens: public(IStablecoinLens)

@internal
def _set_stablecoin_lens(_lens: IStablecoinLens):
    assert _lens.address != empty(address), "no lens"
    self.stablecoin_lens = _lens

    log StablecoinLensUpdated(_lens)
```

</SourceCode>

<Example>

This example sets the `stablecoin_lens` address to `ZERO_ADDRESS`. This is just an example but would not make sense in practice.

```shell
>>> RewardsHandler.stablecoin_lens()
'0xe24e2dB9f6Bb40bBe7c1C025bc87104F5401eCd7'

>>> RewardsHandler.set_stablecoin_lens('0x0000000000000000000000000000000000000000')

>>> RewardsHandler.stablecoin_lens()
'0x0000000000000000000000000000000000000000'
```

</Example>

::::

### `set_minimum_weight`
::::description[`RewardsHandler.set_minimum_weight(new_minimum_weight: uint256)`]

Function to set the minimum weight that the vault will ask for.

| Input                  | Type      | Description              |
| ---------------------- | --------- | ------------------------ |
| `new_minimum_weight`   | `uint256` | New minimum weight       |

<SourceCode>

```vyper
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)

event MinimumWeightUpdated:
    new_minimum_weight: uint256

MAX_BPS: constant(uint256) = 10**4  # 100%

@external
def set_minimum_weight(new_minimum_weight: uint256):
    """
    @notice Update the minimum weight that the the vault will ask for.

    @dev This function can be used to prevent the rewards requested from being
    manipulated (i.e. MEV twa snapshots to obtain lower APR for the vault). Setting
    this value to zero makes the amount of rewards requested fully determined by the
    twa of the deposited supply ratio.
    """
    access_control._check_role(RATE_MANAGER, msg.sender)
    self._set_minimum_weight(new_minimum_weight)

@internal
def _set_minimum_weight(new_minimum_weight: uint256):
    assert new_minimum_weight <= MAX_BPS, "minimum weight should be <= 100%"
    self.minimum_weight = new_minimum_weight

    log MinimumWeightUpdated(new_minimum_weight)
```

</SourceCode>

<Example>

This example sets the minimum weight the `RewardsHandler` will ask for from 5% to 10%.

```shell
>>> RewardsHandler.minimum_weight()
500      # 5%

>>> RewardsHandler.set_minimum_weight(1000)

>>> RewardsHandler.minimum_weight()
1000     # 10%
```

</Example>

::::

### `set_scaling_factor`
::::description[`RewardsHandler.weight() -> uint256: view`]

:::guard[Guarded Method by Snekmate 🐍]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function is restricted to the `RATE_MANAGER` role.

:::

Function to change the scaling factor value.

Emits: `ScalingFactorUpdated` event.

<SourceCode>

```vyper
event ScalingFactorUpdated:
    new_scaling_factor: uint256

# scaling factor for the deposited token / circulating supply ratio.
scaling_factor: public(uint256)

@external
def set_scaling_factor(new_scaling_factor: uint256):
    """
    @notice Update the scaling factor that is used in the weight calculation.
    This factor can be used to adjust the rewards distribution rate.
    """
    access_control._check_role(RATE_MANAGER, msg.sender)
    self._set_scaling_factor(new_scaling_factor)

@internal
def _set_scaling_factor(new_scaling_factor: uint256):
    self.scaling_factor = new_scaling_factor

    log ScalingFactorUpdated(new_scaling_factor)
```

</SourceCode>

<Example>

This example sets the scaling factor from 10000 to 15000.

```shell
>>> RewardsHandler.scaling_factor()
10000

>>> RewardsHandler.set_scaling_factor(15000)

>>> RewardsHandler.scaling_factor()
15000
```

</Example>

::::

---

## Other Methods

### `vault`
::::description[`RewardsHandler.vault() -> address: view`]

Getter for the [YearnV3 Vault contract](https://github.com/yearn/yearn-vaults-v3). This contract address is at the same time also the address of the `scrvUSD` token.

Returns: YearnV3 Vault (`address`).

<SourceCode>

```vyper
from interfaces import IVault

vault: public(immutable(IVault))

@deploy
def __init__(
    _stablecoin: IERC20,
    _vault: IVault,
    minimum_weight: uint256,
    scaling_factor: uint256,
    controller_factory: lens.IControllerFactory,
    admin: address,
):
    ...
    vault = _vault
```

</SourceCode>

<Example>

</Example>


::::

### `stablecoin`
::::description[`RewardsHandler.stablecoin() -> address: view`]

Getter for the crvUSD stablecoin address.

Returns: crvUSD stablecoin (`address`).

<SourceCode>

```vyper
stablecoin: immutable(IERC20)

@deploy
def __init__(
    _stablecoin: IERC20,
    _vault: IVault,
    minimum_weight: uint256,
    scaling_factor: uint256,
    controller_factory: lens.IControllerFactory,
    admin: address,
):
    ...
    stablecoin = _stablecoin
    ...
```

</SourceCode>

<Example>

</Example>


::::

### `stablecoin_lens`
::::description[`RewardsHandler.stablecoin_lens() -> IStablecoinLens: view`]

Getter for the `stablecoin_lens` address. This value can be changed via the `set_stablecoin_lens` function.

Returns: `stablecoin_lens` contract (`address`).

<SourceCode>

```vyper
from contracts.interfaces import IStablecoinLens

stablecoin_lens: public(IStablecoinLens)
```

</SourceCode>

<Example>

</Example>


::::

### `supportsInterface`
::::description[`RewardsHandler.supportsInterface(_interfaceId: bytes32) -> bool: view`]

Function to check if the contract implements a specific interface.

Returns: `True` if the contract implements the interface, `False` otherwise.

| Input          | Type     | Description           |
| -------------- | -------- | --------------------- |
| `interface_id` | `bytes4` | Interface ID to check |

<SourceCode>

```vyper
_SUPPORTED_INTERFACES: constant(bytes4[1]) = [
    0xA1AAB33F,  # The ERC-165 identifier for the dynamic weight interface.
]

from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)

@external
@view
def supportsInterface(interface_id: bytes4) -> bool:
    """
    @dev Returns `True` if this contract implements the interface defined by
    `interface_id`.
    @param interface_id The 4-byte interface identifier.
    @return bool The verification whether the contract implements the interface or
    not.
    """
    return (
        interface_id in access_control._SUPPORTED_INTERFACES
        or interface_id in _SUPPORTED_INTERFACES
    )
```

</SourceCode>

<Example>

</Example>


::::

### `recover_erc20`
::::description[`RewardsHandler.recover_erc20(token: IERC20, receiver: address)`]

:::guard[Guarded Method by Snekmate 🐍]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function is restricted to the `RECOVERY_MANAGER` role.

:::

Function to recover funds accidently sent to the contract. This function can not recover `crvUSD` tokens as any `crvUSD` tokens sent to the contract are considered as donations and will be distributed to stakers.

| Input      | Type      | Description                            |
| ---------- | --------- | -------------------------------------- |
| `token`    | `IERC20`  | Address of the token to recover        |
| `receiver` | `address` | Receier address of the recovered funds |

<SourceCode>

```vyper
from ethereum.ercs import IERC20

from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)

RECOVERY_MANAGER: public(constant(bytes32)) = keccak256("RECOVERY_MANAGER")

@external
def recover_erc20(token: IERC20, receiver: address):
    """
    @notice This is a helper function to let an admin rescue funds sent by mistake
    to this contract. crvUSD cannot be recovered as it's part of the core logic of
    this contract.
    """
    access_control._check_role(RECOVERY_MANAGER, msg.sender)

    # if crvUSD was sent by accident to the contract the funds are lost and will
    # be distributed as rewards on the next `process_rewards` call.
    assert token != stablecoin, "can't recover crvusd"

    # when funds are recovered the whole balanced is sent to a trusted address.
    balance_to_recover: uint256 = staticcall token.balanceOf(self)

    assert extcall token.transfer(receiver, balance_to_recover, default_return_value=True)
```

</SourceCode>

<Example>

In this example, all [`wETH`](https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2) tokens sent to the contract are recovered and sent to [Curve Fee Collector](https://etherscan.io/address/0xa2Bcd1a4Efbd04B63cd03f5aFf2561106ebCCE00).

```shell
>>> RewardsHandler.recover_erc20('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '0xa2Bcd1a4Efbd04B63cd03f5aFf2561106ebCCE00')
```

</Example>

::::

---

## Access Control Module (Snekmate 🐍)

Ownership in this contract is handled by the [Access Control Module](https://github.com/pcaversaccio/snekmate/blob/main/src/snekmate/auth/access_control.vy) provided by [Snekmate 🐍](https://github.com/pcaversaccio/snekmate).

### `DEFAULT_ADMIN_ROLE`
::::description[`RewardsHandler.DEFAULT_ADMIN_ROLE() -> bytes32: view`]

Getter for the `DEFAULT_ADMIN_ROLE` role which is the keccak256 hash of the string "DEFAULT_ADMIN_ROLE". This variable is needed for compatibility with the access control module.

Returns: `DEFAULT_ADMIN_ROLE` (`bytes32`).

<SourceCode>

```vyper
# we use access control because we want to have multiple addresses being able
# to adjust the rate while only the dao (which has the `DEFAULT_ADMIN_ROLE`)
# can appoint `RATE_MANAGER`s
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)
```

</SourceCode>

<Example>

</Example>


::::

### `RATE_MANAGER`
::::description[`RewardsHandler.RATE_MANAGER() -> bytes32: view`]

Getter for the `RATE_MANAGER` role which is the keccak256 hash of the string "RATE_MANAGER". This variable is needed for compatibility with the access control module.

Returns: `RATE_MANAGER` (`bytes32`).

<SourceCode>

```vyper
RATE_MANAGER: constant(bytes32) = keccak256("RATE_MANAGER")
```

</SourceCode>

<Example>

</Example>


::::

### `RECOVERY_MANAGER`
::::description[`RewardsHandler.RECOVERY_MANAGER() -> bytes32: view`]

Getter for the `RECOVERY_MANAGER` role which is the keccak256 hash of the string "RECOVERY_MANAGER". This variable is needed for compatibility with the access control module.

Returns: `RECOVERY_MANAGER` (`bytes32`).

<SourceCode>

```vyper
RECOVERY_MANAGER: constant(bytes32) = keccak256("RECOVERY_MANAGER")
```

</SourceCode>

<Example>

</Example>


::::

### `LENS_MANAGER`
::::description[`RewardsHandler.LENS_MANAGER() -> bytes32: view`]

Getter for the `LENS_MANAGER` role which is the keccak256 hash of the string "LENS_MANAGER". This variable is needed for compatibility with the access control module.

Returns: `LENS_MANAGER` (`bytes32`).

<SourceCode>

```vyper
LENS_MANAGER: constant(bytes32) = keccak256("LENS_MANAGER")
```

</SourceCode>

<Example>

</Example>


::::

### `hasRole`
::::description[`RewardsHandler.hasRole(role: bytes32, account: address) -> bool: view`]

Getter to check if an account has a specific role.

| Input      | Type      | Description                          |
| ---------- | --------- | ------------------------------------ |
| `role`     | `bytes32` | Role to check                        |
| `account`  | `address` | Account to check the role for         |

<SourceCode>

```vyper
# we use access control because we want to have multiple addresses being able
# to adjust the rate while only the dao (which has the `DEFAULT_ADMIN_ROLE`)
# can appoint `RATE_MANAGER`s
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)
```

</SourceCode>

<Example>

This example checks if `0x40907540d8a6C65c637785e8f8B742ae6b0b9968` has the `DEFAULT_ADMIN_ROLE` role.

```shell
>>> RewardsHandler.hasRole('0x0000000000000000000000000000000000000000000000000000000000000000', '0x40907540d8a6C65c637785e8f8B742ae6b0b9968')
true
```

</Example>

::::

### `getRoleAdmin`
::::description[`RewardsHandler.getRoleAdmin(role: bytes32) -> bytes32: view`]

Getter to get the admin role for a specific role.

| Input      | Type      | Description                          |
| ---------- | --------- | ------------------------------------ |
| `role`     | `bytes32` | Role to get the admin role for        |

<SourceCode>

```vyper
# we use access control because we want to have multiple addresses being able
# to adjust the rate while only the dao (which has the `DEFAULT_ADMIN_ROLE`)
# can appoint `RATE_MANAGER`s
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)
```

</SourceCode>

<Example>

This example returns the admin role for the `RATE_MANAGER` role.

```shell
>>> RewardsHandler.getRoleAdmin('0x2eb8ae3bf4f7ccce3124b351006550c82803b59ffcc079d490ebdc6c9946d68c')
0x0000000000000000000000000000000000000000000000000000000000000000
```

</Example>

::::

### `grantRole`
::::description[`RewardsHandler.grantRole(role: bytes32, account: address)`]

Grants a role to an account.

| Input      | Type      | Description                          |
| ---------- | --------- | ------------------------------------ |
| `role`     | `bytes32` | Role to grant                        |
| `account`  | `address` | Account to grant the role to         |

<SourceCode>

```vyper
# we use access control because we want to have multiple addresses being able
# to adjust the rate while only the dao (which has the `DEFAULT_ADMIN_ROLE`)
# can appoint `RATE_MANAGER`s
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)
```

</SourceCode>

<Example>

This example grants the `RATE_MANAGER` role to `0x40907540d8a6C65c637785e8f8B742ae6b0b9968`.

```shell
>>> RewardsHandler.grantRole('0x2eb8ae3bf4f7ccce3124b351006550c82803b59ffcc079d490ebdc6c9946d68c', '0x40907540d8a6C65c637785e8f8B742ae6b0b9968')
```

</Example>

::::

### `revokeRole`
::::description[`RewardsHandler.revokeRole(role: bytes32, account: address)`]

Revokes a role from an account.

| Input      | Type      | Description                          |
| ---------- | --------- | ------------------------------------ |
| `role`     | `bytes32` | Role to revoke                       |
| `account`  | `address` | Account to revoke the role from        |

<SourceCode>

```vyper
# we use access control because we want to have multiple addresses being able
# to adjust the rate while only the dao (which has the `DEFAULT_ADMIN_ROLE`)
# can appoint `RATE_MANAGER`s
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)
```

</SourceCode>

<Example>

This example revokes the `RATE_MANAGER` role from `0x40907540d8a6C65c637785e8f8B742ae6b0b9968`.

```shell
>>> RewardsHandler.revokeRole('0x2eb8ae3bf4f7ccce3124b351006550c82803b59ffcc079d490ebdc6c9946d68c', '0x40907540d8a6C65c637785e8f8B742ae6b0b9968')
```

</Example>

::::

### `renounceRole`
::::description[`RewardsHandler.renounceRole(role: bytes32, account: address)`]

Renounces a role.

| Input      | Type      | Description                          |
| ---------- | --------- | ------------------------------------ |
| `role`     | `bytes32` | Role to renounce                      |
| `account`  | `address` | Account to renounce the role from     |

<SourceCode>

```vyper
# we use access control because we want to have multiple addresses being able
# to adjust the rate while only the dao (which has the `DEFAULT_ADMIN_ROLE`)
# can appoint `RATE_MANAGER`s
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)
```

</SourceCode>

<Example>

This example renounces the `RATE_MANAGER` role from `0x40907540d8a6C65c637785e8f8B742ae6b0b9968`.

```shell
>>> RewardsHandler.renounceRole('0x2eb8ae3bf4f7ccce3124b351006550c82803b59ffcc079d490ebdc6c9946d68c', '0x40907540d8a6C65c637785e8f8B742ae6b0b9968')
```

</Example>

::::

### `set_role_admin`
::::description[`RewardsHandler.set_role_admin(role: bytes32, admin_role: bytes32)`]

Sets the admin role for a role.

| Input      | Type      | Description                          |
| ---------- | --------- | ------------------------------------ |
| `role`     | `bytes32` | Role to set the admin role for       |
| `admin_role`  | `bytes32` | New admin role                    |

<SourceCode>

```vyper
# we use access control because we want to have multiple addresses being able
# to adjust the rate while only the dao (which has the `DEFAULT_ADMIN_ROLE`)
# can appoint `RATE_MANAGER`s
from snekmate.auth import access_control

initializes: access_control
exports: (
    # we don't expose `supportsInterface` from access control
    access_control.grantRole,
    access_control.revokeRole,
    access_control.renounceRole,
    access_control.set_role_admin,
    access_control.DEFAULT_ADMIN_ROLE,
    access_control.hasRole,
    access_control.getRoleAdmin,
)
```

</SourceCode>

<Example>

This example sets the admin role for the `RATE_MANAGER` role to the `DEFAULT_ADMIN_ROLE`.

```shell
>>> RewardsHandler.set_role_admin('0x2eb8ae3bf4f7ccce3124b351006550c82803b59ffcc079d490ebdc6c9946d68c', '0x0000000000000000000000000000000000000000000000000000000000000000')
```

</Example>

::::
