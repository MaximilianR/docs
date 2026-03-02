# Voting Escrow (veCRV)

Participating in Curve DAO governance requires that an account have a balance of vote-escrowed CRV (veCRV). **veCRV is a non-standard ERC-20 implementation, used within the Aragon DAO to determine each account's voting power.**

:::vyper[`VotingEscrow.vy`]

The source code for the `VotingEscrow.vy` contract can be found on [GitHub](https://github.com/curvefi/curve-dao-contracts/blob/master/contracts/VotingEscrow.vy). The contract is written using [Vyper](https://vyper.readthedocs.io) version `0.2.4`.

The contract is deployed on :logos-ethereum: Ethereum at [`0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2`](https://etherscan.io/address/0x5f3b5dfeb7b28cdbd7faba78963ee202a494e2a2).

<ContractABI>


```json
[{"name":"CommitOwnership","inputs":[{"type":"address","name":"admin","indexed":false}],"anonymous":false,"type":"event"},{"name":"ApplyOwnership","inputs":[{"type":"address","name":"admin","indexed":false}],"anonymous":false,"type":"event"},{"name":"Deposit","inputs":[{"type":"address","name":"provider","indexed":true},{"type":"uint256","name":"value","indexed":false},{"type":"uint256","name":"locktime","indexed":true},{"type":"int128","name":"type","indexed":false},{"type":"uint256","name":"ts","indexed":false}],"anonymous":false,"type":"event"},{"name":"Withdraw","inputs":[{"type":"address","name":"provider","indexed":true},{"type":"uint256","name":"value","indexed":false},{"type":"uint256","name":"ts","indexed":false}],"anonymous":false,"type":"event"},{"name":"Supply","inputs":[{"type":"uint256","name":"prevSupply","indexed":false},{"type":"uint256","name":"supply","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[{"type":"address","name":"token_addr"},{"type":"string","name":"_name"},{"type":"string","name":"_symbol"},{"type":"string","name":"_version"}],"stateMutability":"nonpayable","type":"constructor"},{"name":"commit_transfer_ownership","outputs":[],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"nonpayable","type":"function"},{"name":"apply_transfer_ownership","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function"},{"name":"commit_smart_wallet_checker","outputs":[],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"nonpayable","type":"function"},{"name":"apply_smart_wallet_checker","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function"},{"name":"create_lock","outputs":[],"inputs":[{"type":"uint256","name":"_value"},{"type":"uint256","name":"_unlock_time"}],"stateMutability":"nonpayable","type":"function"},{"name":"increase_amount","outputs":[],"inputs":[{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function"},{"name":"increase_unlock_time","outputs":[],"inputs":[{"type":"uint256","name":"_unlock_time"}],"stateMutability":"nonpayable","type":"function"},{"name":"deposit_for","outputs":[],"inputs":[{"type":"address","name":"_addr"},{"type":"uint256","name":"_value"}],"stateMutability":"nonpayable","type":"function"},{"name":"withdraw","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function"},{"name":"checkpoint","outputs":[],"inputs":[],"stateMutability":"nonpayable","type":"function"},{"name":"changeController","outputs":[],"inputs":[{"type":"address","name":"_newController"}],"stateMutability":"nonpayable","type":"function"},{"name":"get_last_user_slope","outputs":[{"type":"int128","name":""}],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"view","type":"function"},{"name":"user_point_history__ts","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"_addr"},{"type":"uint256","name":"_idx"}],"stateMutability":"view","type":"function"},{"name":"locked__end","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"_addr"}],"stateMutability":"view","type":"function"},{"name":"balanceOf","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"}],"stateMutability":"view","type":"function"},{"name":"balanceOf","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"},{"type":"uint256","name":"_t"}],"stateMutability":"view","type":"function"},{"name":"balanceOfAt","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"addr"},{"type":"uint256","name":"_block"}],"stateMutability":"view","type":"function"},{"name":"totalSupply","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"totalSupply","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"t"}],"stateMutability":"view","type":"function"},{"name":"totalSupplyAt","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"uint256","name":"_block"}],"stateMutability":"view","type":"function"},{"name":"token","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"supply","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"locked","outputs":[{"type":"int128","name":"amount"},{"type":"uint256","name":"end"}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function"},{"name":"epoch","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"point_history","outputs":[{"type":"int128","name":"bias"},{"type":"int128","name":"slope"},{"type":"uint256","name":"ts"},{"type":"uint256","name":"blk"}],"inputs":[{"type":"uint256","name":"arg0"}],"stateMutability":"view","type":"function"},{"name":"user_point_history","outputs":[{"type":"int128","name":"bias"},{"type":"int128","name":"slope"},{"type":"uint256","name":"ts"},{"type":"uint256","name":"blk"}],"inputs":[{"type":"address","name":"arg0"},{"type":"uint256","name":"arg1"}],"stateMutability":"view","type":"function"},{"name":"user_point_epoch","outputs":[{"type":"uint256","name":""}],"inputs":[{"type":"address","name":"arg0"}],"stateMutability":"view","type":"function"},{"name":"slope_changes","outputs":[{"type":"int128","name":""}],"inputs":[{"type":"uint256","name":"arg0"}],"stateMutability":"view","type":"function"},{"name":"controller","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"transfersEnabled","outputs":[{"type":"bool","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"name","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"symbol","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"version","outputs":[{"type":"string","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"decimals","outputs":[{"type":"uint256","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"future_smart_wallet_checker","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"smart_wallet_checker","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"admin","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function"},{"name":"future_admin","outputs":[{"type":"address","name":""}],"inputs":[],"stateMutability":"view","type":"function"}]
```

</ContractABI>

:::

`locktime` is denominated in years. The *maximum lock duration is four years* and the *minimum is one week*.

| CRV  | veCRV   | Locktime |
| :--: | :-----: | :------: |
| 1    | 1       | 4 years  |
| 1    | 0.75    | 3 years  |
| 1    | 0.5     | 2 years  |
| 1    | 0.25    | 1 year   |
| x    | x * n/4 | n        |

:::warning

When a user locks their CRV tokens for voting, they will receive veCRV based on the lock duration and the amount locked. Locking is **not reversible** and veCRV tokens are **non-transferable**. If a user decides to vote-lock their CRV tokens, they will only be able to **reclaim the CRV tokens after the lock duration has ended**.

Additionally, a user **cannot have multiple locks** with different expiry dates. However, a lock can be extended, or additional CRV can be added to it at any time.

:::

---

## Implementation Details

User voting power $w_{i}$ is linearly decreasing since the moment of lock. So does the total voting power $W$. In order to avoid periodic check-ins, every time the user deposits, or withdraws, or changes the locktime, we record user's slope and bias for the linear function $w_{i}(t)$ in the public mapping `user_point_history`. We also change slope and bias for the total voting power $W(t)$ and record it in `point_history`. In addition, when a user's lock is scheduled to end, we schedule change of slopes of $W(t)$ in the future in `slope_changes`. Every change involves increasing the `epoch` by 1.

This way we don't have to iterate over all users to figure out how much $W(t)$ should change by, neither do we require users to check in periodically. However, we limit the end of user locks to times rounded off by whole weeks.

Slopes and biases change both when a user deposits and locks governance tokens, and when the locktime expires. All the possible expiration times are rounded to whole weeks to make the number of reads from blockchain proportional to the number of missed weeks at most, not the number of users (which is potentially large).

---

## Lock Management

### `create_lock`
::::description[`VotingEscrow.create_lock(_value: uint256, _unlock_time: uint256)`]


Function to deposit `_value` CRV into the VotingEscrow and create a new lock until `_unlock_time`. The unlock time is rounded down to whole weeks.

| Input          | Type      | Description                        |
| -------------- | --------- | ---------------------------------- |
| `_value`       | `uint256` | Amount of CRV to deposit           |
| `_unlock_time` | `uint256` | Timestamp of the unlock time       |

Emits: `Deposit` and `Supply` events.

<SourceCode>

```vyper
struct LockedBalance:
    amount: int128
    end: uint256

locked: public(HashMap[address, LockedBalance])

WEEK: constant(uint256) = 7 * 86400  # all future times are rounded by week
MAXTIME: constant(uint256) = 4 * 365 * 86400  # 4 years

@external
@nonreentrant('lock')
def create_lock(_value: uint256, _unlock_time: uint256):
    """
    @notice Deposit `_value` tokens for `msg.sender` and lock until `_unlock_time`
    @param _value Amount to deposit
    @param _unlock_time Epoch time when tokens unlock, rounded down to whole weeks
    """
    self.assert_not_contract(msg.sender)
    unlock_time: uint256 = (_unlock_time / WEEK) * WEEK  # Locktime is rounded down to weeks
    _locked: LockedBalance = self.locked[msg.sender]

    assert _value > 0  # dev: need non-zero value
    assert _locked.amount == 0, "Withdraw old tokens first"
    assert unlock_time > block.timestamp, "Can only lock until time in the future"
    assert unlock_time <= block.timestamp + MAXTIME, "Voting lock can be 4 years max"

    self._deposit_for(msg.sender, _value, unlock_time, _locked, CREATE_LOCK_TYPE)
```

</SourceCode>

<Example>

This example creates a new lock of 100 CRV tokens until a specified unlock timestamp.

```shell
>>> VotingEscrow.create_lock(100000000000000000000, 1694003759)
```

</Example>


::::

### `increase_amount`
::::description[`VotingEscrow.increase_amount(_value: uint256)`]


Function to deposit `_value` additional CRV tokens to an existing lock without modifying the unlock time.

| Input    | Type      | Description                       |
| -------- | --------- | --------------------------------- |
| `_value` | `uint256` | Amount of CRV to additionally lock |

Emits: `Deposit` and `Supply` events.

<SourceCode>

```vyper
struct LockedBalance:
    amount: int128
    end: uint256

locked: public(HashMap[address, LockedBalance])

@external
@nonreentrant('lock')
def increase_amount(_value: uint256):
    """
    @notice Deposit `_value` additional tokens for `msg.sender`
            without modifying the unlock time
    @param _value Amount of tokens to deposit and add to the lock
    """
    self.assert_not_contract(msg.sender)
    _locked: LockedBalance = self.locked[msg.sender]

    assert _value > 0  # dev: need non-zero value
    assert _locked.amount > 0, "No existing lock found"
    assert _locked.end > block.timestamp, "Cannot add to expired lock. Withdraw"

    self._deposit_for(msg.sender, _value, 0, _locked, INCREASE_LOCK_AMOUNT)
```

</SourceCode>

<Example>

This example adds 100 CRV tokens to an existing lock.

```shell
>>> VotingEscrow.increase_amount(100000000000000000000)
```

</Example>


::::

### `increase_unlock_time`
::::description[`VotingEscrow.increase_unlock_time(_unlock_time: uint256)`]


Function to extend the unlock time on an already existing lock until `_unlock_time`. The unlock time is rounded down to whole weeks.

| Input          | Type      | Description            |
| -------------- | --------- | ---------------------- |
| `_unlock_time` | `uint256` | New unlock timestamp   |

Emits: `Deposit` and `Supply` events.

<SourceCode>

```vyper
struct LockedBalance:
    amount: int128
    end: uint256

locked: public(HashMap[address, LockedBalance])

WEEK: constant(uint256) = 7 * 86400  # all future times are rounded by week
MAXTIME: constant(uint256) = 4 * 365 * 86400  # 4 years

@external
@nonreentrant('lock')
def increase_unlock_time(_unlock_time: uint256):
    """
    @notice Extend the unlock time for `msg.sender` to `_unlock_time`
    @param _unlock_time New epoch time for unlocking
    """
    self.assert_not_contract(msg.sender)
    _locked: LockedBalance = self.locked[msg.sender]
    unlock_time: uint256 = (_unlock_time / WEEK) * WEEK  # Locktime is rounded down to weeks

    assert _locked.end > block.timestamp, "Lock expired"
    assert _locked.amount > 0, "Nothing is locked"
    assert unlock_time > _locked.end, "Can only increase lock duration"
    assert unlock_time <= block.timestamp + MAXTIME, "Voting lock can be 4 years max"

    self._deposit_for(msg.sender, 0, unlock_time, _locked, INCREASE_UNLOCK_TIME)
```

</SourceCode>

<Example>

This example extends the unlock time of an existing lock to a new timestamp.

```shell
>>> VotingEscrow.increase_unlock_time(1694003759)
```

</Example>


::::

### `deposit_for`
::::description[`VotingEscrow.deposit_for(_addr: address, _value: uint256)`]


Function to deposit `_value` tokens for `_addr` and add them to an existing lock. Anyone (even a smart contract) can deposit for someone else, but cannot extend their locktime or deposit for a brand new user.

| Input    | Type      | Description                   |
| -------- | --------- | ----------------------------- |
| `_addr`  | `address` | Address to deposit for        |
| `_value` | `uint256` | Amount of tokens to lock      |

Emits: `Deposit` and `Supply` events.

<SourceCode>

```vyper
struct LockedBalance:
    amount: int128
    end: uint256

locked: public(HashMap[address, LockedBalance])

@external
@nonreentrant('lock')
def deposit_for(_addr: address, _value: uint256):
    """
    @notice Deposit `_value` tokens for `_addr` and add to the lock
    @dev Anyone (even a smart contract) can deposit for someone else, but
        cannot extend their locktime and deposit for a brand new user
    @param _addr User's wallet address
    @param _value Amount to add to user's lock
    """
    _locked: LockedBalance = self.locked[_addr]

    assert _value > 0  # dev: need non-zero value
    assert _locked.amount > 0, "No existing lock found"
    assert _locked.end > block.timestamp, "Cannot add to expired lock. Withdraw"

    self._deposit_for(_addr, _value, 0, self.locked[_addr], DEPOSIT_FOR_TYPE)
```

</SourceCode>

<Example>

This example deposits 100 CRV tokens into an existing lock owned by another address.

```shell
>>> VotingEscrow.deposit_for("0x7a16fF8270133F063aAb6C9977183D9e72835428", 100000000000000000000)
```

</Example>


::::

### `withdraw`
::::description[`VotingEscrow.withdraw()`]


Function to withdraw all deposited CRV tokens once a lock has expired.

Emits: `Withdraw` and `Supply` events.

<SourceCode>

```vyper
struct LockedBalance:
    amount: int128
    end: uint256

locked: public(HashMap[address, LockedBalance])
supply: public(uint256)
token: public(address)

@external
@nonreentrant('lock')
def withdraw():
    """
    @notice Withdraw all tokens for `msg.sender`
    @dev Only possible if the lock has expired
    """
    _locked: LockedBalance = self.locked[msg.sender]
    assert block.timestamp >= _locked.end, "The lock didn't expire"
    value: uint256 = convert(_locked.amount, uint256)

    old_locked: LockedBalance = _locked
    _locked.end = 0
    _locked.amount = 0
    self.locked[msg.sender] = _locked
    supply_before: uint256 = self.supply
    self.supply = supply_before - value

    # old_locked can have either expired <= timestamp or zero end
    # _locked has only 0 end
    # Both can have >= 0 amount
    self._checkpoint(msg.sender, old_locked, _locked)

    assert ERC20(self.token).transfer(msg.sender, value)

    log Withdraw(msg.sender, value, block.timestamp)
    log Supply(supply_before, supply_before - value)
```

</SourceCode>

<Example>

This example withdraws all CRV tokens after the lock has expired.

```shell
>>> VotingEscrow.withdraw()
```

</Example>


::::

### `checkpoint`
::::description[`VotingEscrow.checkpoint()`]


Function to record global data to a checkpoint. This updates the global `point_history` and `epoch`. Can be called by anyone.

<SourceCode>

```vyper
ZERO_ADDRESS: constant(address) = 0x0000000000000000000000000000000000000000

struct LockedBalance:
    amount: int128
    end: uint256

@external
def checkpoint():
    """
    @notice Record global data to checkpoint
    """
    self._checkpoint(ZERO_ADDRESS, empty(LockedBalance), empty(LockedBalance))
```

</SourceCode>

<Example>

This example records a global data checkpoint, updating the `point_history` and `epoch`.

```shell
>>> VotingEscrow.checkpoint()
```

</Example>


::::

---

## Voting Power & Balances

### `balanceOf`
::::description[`VotingEscrow.balanceOf(addr: address, _t: uint256 = block.timestamp) -> uint256: view`]


Getter for the current veCRV balance (= voting power) of `addr` at timestamp `_t`. Defaults to `block.timestamp`.

:::note

These are not real ERC-20 balances. They measure voting weights that decay linearly over time.

:::

| Input  | Type      | Description                                    |
| ------ | --------- | ---------------------------------------------- |
| `addr` | `address` | User wallet address                            |
| `_t`   | `uint256` | Timestamp; defaults to `block.timestamp`       |

Returns: voting power (`uint256`).

<SourceCode>

```vyper
struct Point:
    bias: int128
    slope: int128  # - dweight / dt
    ts: uint256
    blk: uint256  # block

user_point_epoch: public(HashMap[address, uint256])
user_point_history: public(HashMap[address, Point[1000000000]])  # user -> Point[user_epoch]

@external
@view
def balanceOf(addr: address, _t: uint256 = block.timestamp) -> uint256:
    """
    @notice Get the current voting power for `msg.sender`
    @dev Adheres to the ERC20 `balanceOf` interface for Aragon compatibility
    @param addr User wallet address
    @param _t Epoch time to return voting power at
    @return User voting power
    """
    _epoch: uint256 = self.user_point_epoch[addr]
    if _epoch == 0:
        return 0
    else:
        last_point: Point = self.user_point_history[addr][_epoch]
        last_point.bias -= last_point.slope * convert(_t - last_point.ts, int128)
        if last_point.bias < 0:
            last_point.bias = 0
        return convert(last_point.bias, uint256)
```

</SourceCode>

<Example>

This example returns the current veCRV balance (voting power) of an address. Enter an address and click **Query** to fetch the value live from the blockchain.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function balanceOf(address) view returns (uint256)"]}
  method="balanceOf"
  args={["0x7a16fF8270133F063aAb6C9977183D9e72835428"]}
  labels={["address"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `balanceOfAt`
::::description[`VotingEscrow.balanceOfAt(addr: address, _block: uint256) -> uint256: view`]


Getter for the veCRV balance (= voting power) of `addr` at block height `_block`.

| Input    | Type      | Description              |
| -------- | --------- | ------------------------ |
| `addr`   | `address` | User wallet address      |
| `_block` | `uint256` | Block height             |

Returns: voting power (`uint256`) at a specific block.

<SourceCode>

```vyper
struct Point:
    bias: int128
    slope: int128  # - dweight / dt
    ts: uint256
    blk: uint256  # block

epoch: public(uint256)
point_history: public(Point[100000000000000000000000000000])  # epoch -> unsigned point
user_point_epoch: public(HashMap[address, uint256])
user_point_history: public(HashMap[address, Point[1000000000]])  # user -> Point[user_epoch]

@external
@view
def balanceOfAt(addr: address, _block: uint256) -> uint256:
    """
    @notice Measure voting power of `addr` at block height `_block`
    @dev Adheres to MiniMe `balanceOfAt` interface: https://github.com/Giveth/minime
    @param addr User's wallet address
    @param _block Block to calculate the voting power at
    @return Voting power
    """
    assert _block <= block.number

    # Binary search
    _min: uint256 = 0
    _max: uint256 = self.user_point_epoch[addr]
    for i in range(128):  # Will be always enough for 128-bit numbers
        if _min >= _max:
            break
        _mid: uint256 = (_min + _max + 1) / 2
        if self.user_point_history[addr][_mid].blk <= _block:
            _min = _mid
        else:
            _max = _mid - 1

    upoint: Point = self.user_point_history[addr][_min]

    max_epoch: uint256 = self.epoch
    _epoch: uint256 = self.find_block_epoch(_block, max_epoch)
    point_0: Point = self.point_history[_epoch]
    d_block: uint256 = 0
    d_t: uint256 = 0
    if _epoch < max_epoch:
        point_1: Point = self.point_history[_epoch + 1]
        d_block = point_1.blk - point_0.blk
        d_t = point_1.ts - point_0.ts
    else:
        d_block = block.number - point_0.blk
        d_t = block.timestamp - point_0.ts
    block_time: uint256 = point_0.ts
    if d_block != 0:
        block_time += d_t * (_block - point_0.blk) / d_block

    upoint.bias -= upoint.slope * convert(block_time - upoint.ts, int128)
    if upoint.bias >= 0:
        return convert(upoint.bias, uint256)
    else:
        return 0
```

</SourceCode>

<Example>

This example returns the veCRV balance (voting power) of an address at a specific block height.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function balanceOfAt(address, uint256) view returns (uint256)"]}
  method="balanceOfAt"
  args={["0x7a16fF8270133F063aAb6C9977183D9e72835428", "18483472"]}
  labels={["address", "block"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `totalSupply`
::::description[`VotingEscrow.totalSupply(t: uint256 = block.timestamp) -> uint256: view`]


Getter for the current total supply of veCRV (= total voting power) at timestamp `t`. Defaults to `block.timestamp`.

| Input | Type      | Description                              |
| ----- | --------- | ---------------------------------------- |
| `t`   | `uint256` | Timestamp; defaults to `block.timestamp` |

Returns: total voting power (`uint256`).

<SourceCode>

```vyper
struct Point:
    bias: int128
    slope: int128  # - dweight / dt
    ts: uint256
    blk: uint256  # block

epoch: public(uint256)
point_history: public(Point[100000000000000000000000000000])  # epoch -> unsigned point

@external
@view
def totalSupply(t: uint256 = block.timestamp) -> uint256:
    """
    @notice Calculate total voting power
    @dev Adheres to the ERC20 `totalSupply` interface for Aragon compatibility
    @return Total voting power
    """
    _epoch: uint256 = self.epoch
    last_point: Point = self.point_history[_epoch]
    return self.supply_at(last_point, t)
```

</SourceCode>

<Example>

This example returns the current total veCRV voting power. The value is fetched live from the blockchain.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function totalSupply() view returns (uint256)"]}
  method="totalSupply"
  contractName="VotingEscrow"
/>

</Example>


::::

### `totalSupplyAt`
::::description[`VotingEscrow.totalSupplyAt(_block: uint256) -> uint256: view`]


Getter for the total supply of veCRV (= total voting power) at block height `_block`.

| Input    | Type      | Description  |
| -------- | --------- | ------------ |
| `_block` | `uint256` | Block height |

Returns: total voting power (`uint256`) at a specific block.

<SourceCode>

```vyper
struct Point:
    bias: int128
    slope: int128  # - dweight / dt
    ts: uint256
    blk: uint256  # block

epoch: public(uint256)
point_history: public(Point[100000000000000000000000000000])  # epoch -> unsigned point

@external
@view
def totalSupplyAt(_block: uint256) -> uint256:
    """
    @notice Calculate total voting power at some point in the past
    @param _block Block to calculate the total voting power at
    @return Total voting power at `_block`
    """
    assert _block <= block.number
    _epoch: uint256 = self.epoch
    target_epoch: uint256 = self.find_block_epoch(_block, _epoch)

    point: Point = self.point_history[target_epoch]
    dt: uint256 = 0
    if target_epoch < _epoch:
        point_next: Point = self.point_history[target_epoch + 1]
        if point.blk != point_next.blk:
            dt = (_block - point.blk) * (point_next.ts - point.ts) / (point_next.blk - point.blk)
    else:
        if point.blk != block.number:
            dt = (_block - point.blk) * (block.timestamp - point.ts) / (block.number - point.blk)
    # Now dt contains info on how far are we beyond point

    return self.supply_at(point, point.ts + dt)
```

</SourceCode>

<Example>

This example returns the total veCRV voting power at a specific block height.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function totalSupplyAt(uint256) view returns (uint256)"]}
  method="totalSupplyAt"
  args={["18483472"]}
  labels={["block"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `supply`
::::description[`VotingEscrow.supply() -> uint256: view`]


Getter for the total amount of CRV tokens locked in the contract.

Returns: locked CRV amount (`uint256`).

<SourceCode>

```vyper
supply: public(uint256)
```

</SourceCode>

<Example>

This example returns the total amount of CRV tokens locked in the contract. The value is fetched live from the blockchain.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function supply() view returns (uint256)"]}
  method="supply"
  contractName="VotingEscrow"
/>

</Example>


::::

### `locked`
::::description[`VotingEscrow.locked(arg0: address) -> amount: int128, end: uint256: view`]


Getter for the locked balance of address `arg0`. Returns the `LockedBalance` struct containing the locked amount and the unlock timestamp.

| Input  | Type      | Description    |
| ------ | --------- | -------------- |
| `arg0` | `address` | User address   |

Returns: amount (`int128`) and unlock time (`uint256`).

<SourceCode>

```vyper
struct LockedBalance:
    amount: int128
    end: uint256

locked: public(HashMap[address, LockedBalance])
```

</SourceCode>

<Example>

This example returns the locked CRV amount and unlock timestamp for a given address.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function locked(address) view returns (int128, uint256)"]}
  method="locked"
  args={["0x7a16fF8270133F063aAb6C9977183D9e72835428"]}
  labels={["address"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `locked__end`
::::description[`VotingEscrow.locked__end(_addr: address) -> uint256: view`]


Getter for the timestamp when `_addr`'s lock finishes.

| Input   | Type      | Description  |
| ------- | --------- | ------------ |
| `_addr` | `address` | User address |

Returns: unlock timestamp (`uint256`).

<SourceCode>

```vyper
struct LockedBalance:
    amount: int128
    end: uint256

locked: public(HashMap[address, LockedBalance])

@external
@view
def locked__end(_addr: address) -> uint256:
    """
    @notice Get timestamp when `_addr`'s lock finishes
    @param _addr User wallet
    @return Epoch time of the lock end
    """
    return self.locked[_addr].end
```

</SourceCode>

<Example>

This example returns the unlock timestamp for a given address.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function locked__end(address) view returns (uint256)"]}
  method="locked__end"
  args={["0x7a16fF8270133F063aAb6C9977183D9e72835428"]}
  labels={["address"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `get_last_user_slope`
::::description[`VotingEscrow.get_last_user_slope(addr: address) -> int128: view`]


Getter for the most recently recorded rate of voting power decrease for `addr`.

| Input  | Type      | Description  |
| ------ | --------- | ------------ |
| `addr` | `address` | User address |

Returns: slope value (`int128`).

<SourceCode>

```vyper
struct Point:
    bias: int128
    slope: int128  # - dweight / dt
    ts: uint256
    blk: uint256  # block

user_point_epoch: public(HashMap[address, uint256])
user_point_history: public(HashMap[address, Point[1000000000]])  # user -> Point[user_epoch]

@external
@view
def get_last_user_slope(addr: address) -> int128:
    """
    @notice Get the most recently recorded rate of voting power decrease for `addr`
    @param addr Address of the user wallet
    @return Value of the slope
    """
    uepoch: uint256 = self.user_point_epoch[addr]
    return self.user_point_history[addr][uepoch].slope
```

</SourceCode>

<Example>

This example returns the most recent rate of voting power decrease for a given address.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function get_last_user_slope(address) view returns (int128)"]}
  method="get_last_user_slope"
  args={["0x7a16fF8270133F063aAb6C9977183D9e72835428"]}
  labels={["address"]}
  contractName="VotingEscrow"
/>

</Example>


::::

---

## Checkpoints & History

### `epoch`
::::description[`VotingEscrow.epoch() -> uint256: view`]


Getter for the current global epoch. The epoch is incremented by 1 every time a checkpoint is recorded.

Returns: current epoch (`uint256`).

<SourceCode>

```vyper
epoch: public(uint256)
```

</SourceCode>

<Example>

This example returns the current global epoch. The value is fetched live from the blockchain.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function epoch() view returns (uint256)"]}
  method="epoch"
  contractName="VotingEscrow"
/>

</Example>


::::

### `point_history`
::::description[`VotingEscrow.point_history(arg0: uint256) -> bias: int128, slope: int128, ts: uint256, blk: uint256: view`]


Getter for the global point history at epoch `arg0`. Each point records the aggregate bias, slope, timestamp, and block number.

| Input  | Type      | Description  |
| ------ | --------- | ------------ |
| `arg0` | `uint256` | Epoch number |

Returns: bias (`int128`), slope (`int128`), ts (`uint256`) and blk (`uint256`).

<SourceCode>

```vyper
struct Point:
    bias: int128
    slope: int128  # - dweight / dt
    ts: uint256
    blk: uint256  # block

point_history: public(Point[100000000000000000000000000000])  # epoch -> unsigned point
```

</SourceCode>

<Example>

This example returns the global point history at epoch 3 (bias, slope, timestamp, block number).

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function point_history(uint256) view returns (int128, int128, uint256, uint256)"]}
  method="point_history"
  args={["3"]}
  labels={["epoch"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `user_point_epoch`
::::description[`VotingEscrow.user_point_epoch(arg0: address) -> uint256: view`]


Getter for the current checkpoint epoch for a specific user. This is incremented each time the user's lock state changes (create, increase amount, increase time, withdraw).

| Input  | Type      | Description  |
| ------ | --------- | ------------ |
| `arg0` | `address` | User address |

Returns: user epoch (`uint256`).

<SourceCode>

```vyper
user_point_epoch: public(HashMap[address, uint256])
```

</SourceCode>

<Example>

This example returns the current checkpoint epoch for a specific user.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function user_point_epoch(address) view returns (uint256)"]}
  method="user_point_epoch"
  args={["0x7a16fF8270133F063aAb6C9977183D9e72835428"]}
  labels={["address"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `user_point_history`
::::description[`VotingEscrow.user_point_history(arg0: address, arg1: uint256) -> bias: int128, slope: int128, ts: uint256, blk: uint256: view`]


Getter for a user's point history at a specific user epoch. Each point records the user's bias, slope, timestamp, and block number at that checkpoint.

| Input  | Type      | Description       |
| ------ | --------- | ----------------- |
| `arg0` | `address` | User address      |
| `arg1` | `uint256` | User epoch number |

Returns: bias (`int128`), slope (`int128`), ts (`uint256`) and blk (`uint256`).

<SourceCode>

```vyper
user_point_history: public(HashMap[address, Point[1000000000]])  # user -> Point[user_epoch]
```

</SourceCode>

<Example>

This example returns the point history for a user at their first checkpoint (bias, slope, timestamp, block number).

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function user_point_history(address, uint256) view returns (int128, int128, uint256, uint256)"]}
  method="user_point_history"
  args={["0x7a16fF8270133F063aAb6C9977183D9e72835428", "1"]}
  labels={["address", "epoch"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `user_point_history__ts`
::::description[`VotingEscrow.user_point_history__ts(_addr: address, _idx: uint256) -> uint256: view`]


Convenience getter for the timestamp of checkpoint `_idx` for `_addr`.

| Input   | Type      | Description       |
| ------- | --------- | ----------------- |
| `_addr` | `address` | User address      |
| `_idx`  | `uint256` | User epoch number |

Returns: timestamp (`uint256`).

<SourceCode>

```vyper
struct Point:
    bias: int128
    slope: int128  # - dweight / dt
    ts: uint256
    blk: uint256  # block

user_point_history: public(HashMap[address, Point[1000000000]])  # user -> Point[user_epoch]

@external
@view
def user_point_history__ts(_addr: address, _idx: uint256) -> uint256:
    """
    @notice Get the timestamp for checkpoint `_idx` for `_addr`
    @param _addr User wallet address
    @param _idx User epoch number
    @return Epoch time of the checkpoint
    """
    return self.user_point_history[_addr][_idx].ts
```

</SourceCode>

<Example>

This example returns the timestamp of the first checkpoint for a given address.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function user_point_history__ts(address, uint256) view returns (uint256)"]}
  method="user_point_history__ts"
  args={["0x7a16fF8270133F063aAb6C9977183D9e72835428", "1"]}
  labels={["address", "epoch"]}
  contractName="VotingEscrow"
/>

</Example>


::::

### `slope_changes`
::::description[`VotingEscrow.slope_changes(arg0: uint256) -> int128: view`]


Getter for scheduled slope changes at a future timestamp. When a lock expires, the global slope decreases. These changes are pre-scheduled so the contract doesn't need to iterate over all users.

| Input  | Type      | Description               |
| ------ | --------- | ------------------------- |
| `arg0` | `uint256` | Timestamp (rounded to week) |

Returns: signed slope change (`int128`).

<SourceCode>

```vyper
slope_changes: public(HashMap[uint256, int128])  # time -> signed slope change
```

</SourceCode>

<Example>

This example returns the scheduled slope change at a specific future timestamp.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function slope_changes(uint256) view returns (int128)"]}
  method="slope_changes"
  args={["1808956800"]}
  labels={["timestamp"]}
  contractName="VotingEscrow"
/>

</Example>


::::

---

## SmartWalletChecker

The `SmartWalletChecker` is an external contract referenced by VotingEscrow to determine whether smart contracts are allowed to lock CRV. The internal `assert_not_contract` function checks callers against this contract whenever `create_lock`, `increase_amount`, or `increase_unlock_time` is called.

:::info[SmartWalletChecker Upgrade]

The SmartWalletChecker was originally used to **restrict which smart contracts could lock CRV** — contracts needed to be explicitly whitelisted via an `approveWallet` function, and access could be revoked via `revokeWallet`. This was in place to prevent tokenizing the escrow.

The checker has since been upgraded to a simple Vyper contract that **returns `True` for any input**, effectively removing all smart contract restrictions. Any smart contract can now lock CRV without needing prior approval.

```vyper
# pragma version 0.4.1
# @title Smart Wallet Whitelist
# @notice Dummy contract bypassing smart wallet check for veCRV.
#         Returns 'true' for any input.

@view
@external
def check(_wallet: address) -> bool:
    return True
```

:::

### `smart_wallet_checker`
::::description[`VotingEscrow.smart_wallet_checker() -> address: view`]


Getter for the current SmartWalletChecker contract address.

Returns: SmartWalletChecker contract (`address`).

<SourceCode>

```vyper
smart_wallet_checker: public(address)
```

</SourceCode>

<Example>

This example returns the current SmartWalletChecker contract address.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function smart_wallet_checker() view returns (address)"]}
  method="smart_wallet_checker"
  contractName="VotingEscrow"
/>

</Example>


::::

### `future_smart_wallet_checker`
::::description[`VotingEscrow.future_smart_wallet_checker() -> address: view`]


Getter for the future SmartWalletChecker contract address. Set via [`commit_smart_wallet_checker`](#commit_smart_wallet_checker) and applied via [`apply_smart_wallet_checker`](#apply_smart_wallet_checker).

Returns: future SmartWalletChecker contract (`address`).

<SourceCode>

```vyper
future_smart_wallet_checker: public(address)
```

</SourceCode>

<Example>

This example returns the future SmartWalletChecker contract address (zero address means no pending change).

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function future_smart_wallet_checker() view returns (address)"]}
  method="future_smart_wallet_checker"
  contractName="VotingEscrow"
/>

</Example>


::::

### `commit_smart_wallet_checker`
::::description[`VotingEscrow.commit_smart_wallet_checker(addr: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.

:::

Function to commit a new SmartWalletChecker contract address. Changes need to be applied via [`apply_smart_wallet_checker`](#apply_smart_wallet_checker).

| Input  | Type      | Description                     |
| ------ | --------- | ------------------------------- |
| `addr` | `address` | New SmartWalletChecker contract |

<SourceCode>

```vyper
future_smart_wallet_checker: public(address)

@external
def commit_smart_wallet_checker(addr: address):
    """
    @notice Set an external contract to check for approved smart contract wallets
    @param addr Address of Smart contract checker
    """
    assert msg.sender == self.admin
    self.future_smart_wallet_checker = addr
```

</SourceCode>

<Example>

This example commits a new SmartWalletChecker contract address.

```shell
>>> VotingEscrow.commit_smart_wallet_checker("0x1234567890abcdef1234567890abcdef12345678")
```

</Example>


::::

### `apply_smart_wallet_checker`
::::description[`VotingEscrow.apply_smart_wallet_checker()`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.

:::

Function to apply the previously committed SmartWalletChecker address.

<SourceCode>

```vyper
smart_wallet_checker: public(address)
future_smart_wallet_checker: public(address)

@external
def apply_smart_wallet_checker():
    """
    @notice Apply setting external contract to check approved smart contract wallets
    """
    assert msg.sender == self.admin
    self.smart_wallet_checker = self.future_smart_wallet_checker
```

</SourceCode>

<Example>

This example applies the previously committed SmartWalletChecker address.

```shell
>>> VotingEscrow.apply_smart_wallet_checker()
```

</Example>


::::

---

## Contract Info

### `token`
::::description[`VotingEscrow.token() -> address: view`]


Getter for the CRV token address that is locked in the contract.

Returns: CRV token address (`address`).

<SourceCode>

```vyper
token: public(address)

@external
def __init__(token_addr: address, _name: String[64], _symbol: String[32], _version: String[32]):
    ...
    self.token = token_addr
    ...
```

</SourceCode>

<Example>

This example returns the CRV token address locked in the contract.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function token() view returns (address)"]}
  method="token"
  contractName="VotingEscrow"
/>

</Example>


::::

### `name`
::::description[`VotingEscrow.name() -> String[64]: view`]


Getter for the name of the token.

Returns: name (`String[64]`).

<SourceCode>

```vyper
name: public(String[64])
```

</SourceCode>

<Example>

This example returns the name of the token.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function name() view returns (string)"]}
  method="name"
  contractName="VotingEscrow"
/>

</Example>


::::

### `symbol`
::::description[`VotingEscrow.symbol() -> String[32]: view`]


Getter for the symbol of the token.

Returns: symbol (`String[32]`).

<SourceCode>

```vyper
symbol: public(String[32])
```

</SourceCode>

<Example>

This example returns the symbol of the token.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function symbol() view returns (string)"]}
  method="symbol"
  contractName="VotingEscrow"
/>

</Example>


::::

### `version`
::::description[`VotingEscrow.version() -> String[32]: view`]


Getter for the version of the contract.

Returns: version (`String[32]`).

<SourceCode>

```vyper
version: public(String[32])
```

</SourceCode>

<Example>

This example returns the version of the contract.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function version() view returns (string)"]}
  method="version"
  contractName="VotingEscrow"
/>

</Example>


::::

### `decimals`
::::description[`VotingEscrow.decimals() -> uint256: view`]


Getter for the decimals of the token.

Returns: decimals (`uint256`).

<SourceCode>

```vyper
decimals: public(uint256)
```

</SourceCode>

<Example>

This example returns the number of decimals of the token.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function decimals() view returns (uint256)"]}
  method="decimals"
  contractName="VotingEscrow"
/>

</Example>


::::

### `controller`
::::description[`VotingEscrow.controller() -> address: view`]


Getter for the Aragon controller of the contract.

Returns: controller address (`address`).

<SourceCode>

```vyper
controller: public(address)
```

</SourceCode>

<Example>

This example returns the Aragon controller address.

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function controller() view returns (address)"]}
  method="controller"
  contractName="VotingEscrow"
/>

</Example>


::::

### `changeController`
::::description[`VotingEscrow.changeController(_newController: address)`]


:::guard[Guarded Method]

This function is only callable by the `controller` of the contract.

:::

Dummy method required for Aragon compatibility.

| Input             | Type      | Description            |
| ----------------- | --------- | ---------------------- |
| `_newController`  | `address` | New controller address |

<SourceCode>

```vyper
controller: public(address)

@external
def changeController(_newController: address):
    """
    @dev Dummy method required for Aragon compatibility
    """
    assert msg.sender == self.controller
    self.controller = _newController
```

</SourceCode>

<Example>

This example changes the Aragon controller address.

```shell
>>> VotingEscrow.changeController("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
```

</Example>


::::

### `transfersEnabled`
::::description[`VotingEscrow.transfersEnabled() -> bool: view`]


View method required for Aragon compatibility. Always returns `True`.

Returns: transfers enabled (`bool`).

<SourceCode>

```vyper
transfersEnabled: public(bool)

@external
def __init__(token_addr: address, _name: String[64], _symbol: String[32], _version: String[32]):
    ...
    self.transfersEnabled = True
    ...
```

</SourceCode>

<Example>

This example returns whether transfers are enabled (always `True` for Aragon compatibility).

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function transfersEnabled() view returns (bool)"]}
  method="transfersEnabled"
  contractName="VotingEscrow"
/>

</Example>


::::

---

## Admin Controls

The **CurveOwnershipAgent** ([`0x40907540d8a6C65c637785e8f8B742ae6b0b9968`](https://etherscan.io/address/0x40907540d8a6C65c637785e8f8B742ae6b0b9968)) is the current `admin` of the VotingEscrow. Any changes to admin-controlled parameters require a successfully passed DAO vote.

### `admin`
::::description[`VotingEscrow.admin() -> address: view`]


Getter for the current admin of the contract.

Returns: admin (`address`).

<SourceCode>

```vyper
admin: public(address)  # Can and will be a smart contract
```

</SourceCode>

<Example>

This example returns the current admin of the contract (CurveOwnershipAgent).

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function admin() view returns (address)"]}
  method="admin"
  contractName="VotingEscrow"
/>

</Example>


::::

### `future_admin`
::::description[`VotingEscrow.future_admin() -> address: view`]


Getter for the future admin of the contract. Set via [`commit_transfer_ownership`](#commit_transfer_ownership) and applied via [`apply_transfer_ownership`](#apply_transfer_ownership).

Returns: future admin (`address`).

<SourceCode>

```vyper
future_admin: public(address)
```

</SourceCode>

<Example>

This example returns the future admin address (zero address means no pending transfer).

<ContractCall
  address="0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2"
  abi={["function future_admin() view returns (address)"]}
  method="future_admin"
  contractName="VotingEscrow"
/>

</Example>


::::

### `commit_transfer_ownership`
::::description[`VotingEscrow.commit_transfer_ownership(addr: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.

:::

Function to commit the transfer of ownership to `addr`. Changes need to be applied via [`apply_transfer_ownership`](#apply_transfer_ownership).

| Input  | Type      | Description       |
| ------ | --------- | ----------------- |
| `addr` | `address` | New admin address |

Emits: `CommitOwnership` event.

<SourceCode>

```vyper
event CommitOwnership:
    admin: address

future_admin: public(address)

@external
def commit_transfer_ownership(addr: address):
    """
    @notice Transfer ownership of VotingEscrow contract to `addr`
    @param addr Address to have ownership transferred to
    """
    assert msg.sender == self.admin  # dev: admin only
    self.future_admin = addr
    log CommitOwnership(addr)
```

</SourceCode>

<Example>

This example commits a new admin address for the ownership transfer.

```shell
>>> VotingEscrow.commit_transfer_ownership("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
```

</Example>


::::

### `apply_transfer_ownership`
::::description[`VotingEscrow.apply_transfer_ownership()`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.

:::

Function to apply the previously committed ownership transfer.

Emits: `ApplyOwnership` event.

<SourceCode>

```vyper
event ApplyOwnership:
    admin: address

admin: public(address)  # Can and will be a smart contract
future_admin: public(address)

@external
def apply_transfer_ownership():
    """
    @notice Apply ownership transfer
    """
    assert msg.sender == self.admin  # dev: admin only
    _admin: address = self.future_admin
    assert _admin != ZERO_ADDRESS  # dev: admin not set
    self.admin = _admin
    log ApplyOwnership(_admin)
```

</SourceCode>

<Example>

This example applies the previously committed ownership transfer.

```shell
>>> VotingEscrow.apply_transfer_ownership()
```

</Example>


::::
