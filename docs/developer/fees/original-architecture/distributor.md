
# Distributor

Fees are distributed to veCRV holders through the FeeDistributor contract in the form of 3CRV tokens.

:::deploy[Contract Source & Deployment]

**FeeDistributor** contract is deployed to the Ethereum mainnet at: [0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc](https://etherscan.io/address/0xa464e6dcda8ac41e03616f95f4bc98a13b8922dc).
Source code available on [GitHub](https://github.com/curvefi/curve-dao-contracts/blob/master/contracts/FeeDistributor.vy).  


:::

**Fees are distributed on a weekly basis.** The proportional amount of fees that each user is to receive is calculated based on their veCRV balance relative to the total veCRV supply. This amount is calculated at the start of the week.  
The actual distribution occurs at the end of the week based on the fees that were collected. As such, a user that creates a new vote-lock should expect to receive their first fee payout at the end of the following epoch week.

:::info[Changing the Reward Token]

Changing the reward token from 3CRV to, for example, crvUSD, would require the creation of a new FeeDistributor, as the reward token cannot be configured within the existing contract.


:::

The available 3CRV balance to distribute is tracked via the “**token checkpoint**”. This is updated at minimum every 24 hours. Fees that are received between the last checkpoint of the previous week and first checkpoint of the new week will be split evenly between the weeks.


---


## Claiming Fees

### `token`
::::description[`FeeDistributor.token() -> address: view`]


Getter for the token address in which the fees are distributed.

Returns: reward token (`address`).

<SourceCode>


```vyper 
token: public(address)

@external
def __init__(
    _voting_escrow: address,
    _start_time: uint256,
    _token: address,
    _admin: address,
    _emergency_return: address
):
    """
    @notice Contract constructor
    @param _voting_escrow VotingEscrow contract address
    @param _start_time Epoch time for fee distribution to start
    @param _token Fee token address (crvUSD)
    @param _admin Admin address
    @param _emergency_return Address to transfer `_token` balance to
                            if this contract is killed
    """
    t: uint256 = _start_time / WEEK * WEEK
    self.start_time = t
    self.last_token_time = t
    self.time_cursor = t
    self.token = _token
    self.voting_escrow = _voting_escrow
    self.admin = _admin
    self.emergency_return = _emergency_return
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function token() view returns (address)"]}
  method="token"
  contractName="FeeDistributor"
/>

</Example>


::::

### `claim`
::::description[`FeeDistributor.claim(_addr: address = msg.sender) -> uint256`]


Function to claim fees for an account.

:::note

For off-chain integrators, this function can be called as though it were a view method in order to check the claimable amount.

Every veCRV related action (locking, extending a lock, increasing the locktime) increments a user’s veCRV epoch. A call to claim will consider at most 50 user epochs. For accounts that performed many veCRV actions, it may be required to call claim more than once to receive the fees. In such cases it can be more efficient to use `claim_many`.


:::

| Input   | Type   | Description |
| ------- | ------- | ----|
| `_addr` |  `address` | Addresses to claim for. Defaults to `msg.sender`. |

Returns: amount of rewards claimed (`uint256`).

Emits: `Claimed` event.

<SourceCode>


```vyper
event Claimed:
    recipient: indexed(address)
    amount: uint256
    claim_epoch: uint256
    max_epoch: uint256

@external
@nonreentrant('lock')
def claim(_addr: address = msg.sender) -> uint256:
    """
    @notice Claim fees for `_addr`
    @dev Each call to claim look at a maximum of 50 user veCRV points.
        For accounts with many veCRV related actions, this function
        may need to be called more than once to claim all available
        fees. In the `Claimed` event that fires, if `claim_epoch` is
        less than `max_epoch`, the account may claim again.
    @param _addr Address to claim fees for
    @return uint256 Amount of fees claimed in the call
    """
    assert not self.is_killed

    if block.timestamp >= self.time_cursor:
        self._checkpoint_total_supply()

    last_token_time: uint256 = self.last_token_time

    if self.can_checkpoint_token and (block.timestamp > last_token_time + TOKEN_CHECKPOINT_DEADLINE):
        self._checkpoint_token()
        last_token_time = block.timestamp

    last_token_time = last_token_time / WEEK * WEEK

    amount: uint256 = self._claim(_addr, self.voting_escrow, last_token_time)
    if amount != 0:
        token: address = self.token
        assert ERC20(token).transfer(_addr, amount)
        self.token_last_balance -= amount

    return amount

@internal
def _claim(addr: address, ve: address, _last_token_time: uint256) -> uint256:
    # Minimal user_epoch is 0 (if user had no point)
    user_epoch: uint256 = 0
    to_distribute: uint256 = 0

    max_user_epoch: uint256 = VotingEscrow(ve).user_point_epoch(addr)
    _start_time: uint256 = self.start_time

    if max_user_epoch == 0:
        # No lock = no fees
        return 0

    week_cursor: uint256 = self.time_cursor_of[addr]
    if week_cursor == 0:
        # Need to do the initial binary search
        user_epoch = self._find_timestamp_user_epoch(ve, addr, _start_time, max_user_epoch)
    else:
        user_epoch = self.user_epoch_of[addr]

    if user_epoch == 0:
        user_epoch = 1

    user_point: Point = VotingEscrow(ve).user_point_history(addr, user_epoch)

    if week_cursor == 0:
        week_cursor = (user_point.ts + WEEK - 1) / WEEK * WEEK

    if week_cursor >= _last_token_time:
        return 0

    if week_cursor < _start_time:
        week_cursor = _start_time
    old_user_point: Point = empty(Point)

    # Iterate over weeks
    for i in range(50):
        if week_cursor >= _last_token_time:
            break

        if week_cursor >= user_point.ts and user_epoch <= max_user_epoch:
            user_epoch += 1
            old_user_point = user_point
            if user_epoch > max_user_epoch:
                user_point = empty(Point)
            else:
                user_point = VotingEscrow(ve).user_point_history(addr, user_epoch)

        else:
            # Calc
            # + i * 2 is for rounding errors
            dt: int128 = convert(week_cursor - old_user_point.ts, int128)
            balance_of: uint256 = convert(max(old_user_point.bias - dt * old_user_point.slope, 0), uint256)
            if balance_of == 0 and user_epoch > max_user_epoch:
                break
            if balance_of > 0:
                to_distribute += balance_of * self.tokens_per_week[week_cursor] / self.ve_supply[week_cursor]

            week_cursor += WEEK

    user_epoch = min(max_user_epoch, user_epoch - 1)
    self.user_epoch_of[addr] = user_epoch
    self.time_cursor_of[addr] = week_cursor

    log Claimed(addr, to_distribute, user_epoch, max_user_epoch)

    return to_distribute
```


</SourceCode>

::::

### `claim_many`
::::description[`FeeDistributor.claim_many(_receivers: address[20]) -> bool`]


Function to perform multiple claims in a single call. This is useful to claim for multiple accounts at once, or for making many claims against the same account if that account has performed more than 50 veCRV related actions.

| Input   | Type   | Description |
| ------- | ------- | ----|
| `_receivers` |  `address[20]` | List of addresses to claim for. |

Returns: true (`bool`).

Emits: `Claimed` event.

<SourceCode>


```vyper
event Claimed:
    recipient: indexed(address)
    amount: uint256
    claim_epoch: uint256
    max_epoch: uint256

@external
@nonreentrant('lock')
def claim_many(_receivers: address[20]) -> bool:
    """
    @notice Make multiple fee claims in a single call
    @dev Used to claim for many accounts at once, or to make
        multiple claims for the same address when that address
        has significant veCRV history
    @param _receivers List of addresses to claim for. Claiming
                    terminates at the first `ZERO_ADDRESS`.
    @return bool success
    """
    assert not self.is_killed

    if block.timestamp >= self.time_cursor:
        self._checkpoint_total_supply()

    last_token_time: uint256 = self.last_token_time

    if self.can_checkpoint_token and (block.timestamp > last_token_time + TOKEN_CHECKPOINT_DEADLINE):
        self._checkpoint_token()
        last_token_time = block.timestamp

    last_token_time = last_token_time / WEEK * WEEK
    voting_escrow: address = self.voting_escrow
    token: address = self.token
    total: uint256 = 0

    for addr in _receivers:
        if addr == ZERO_ADDRESS:
            break

        amount: uint256 = self._claim(addr, voting_escrow, last_token_time)
        if amount != 0:
            assert ERC20(token).transfer(addr, amount)
            total += amount

    if total != 0:
        self.token_last_balance -= total

    return True

@internal
def _claim(addr: address, ve: address, _last_token_time: uint256) -> uint256:
    # Minimal user_epoch is 0 (if user had no point)
    user_epoch: uint256 = 0
    to_distribute: uint256 = 0

    max_user_epoch: uint256 = VotingEscrow(ve).user_point_epoch(addr)
    _start_time: uint256 = self.start_time

    if max_user_epoch == 0:
        # No lock = no fees
        return 0

    week_cursor: uint256 = self.time_cursor_of[addr]
    if week_cursor == 0:
        # Need to do the initial binary search
        user_epoch = self._find_timestamp_user_epoch(ve, addr, _start_time, max_user_epoch)
    else:
        user_epoch = self.user_epoch_of[addr]

    if user_epoch == 0:
        user_epoch = 1

    user_point: Point = VotingEscrow(ve).user_point_history(addr, user_epoch)

    if week_cursor == 0:
        week_cursor = (user_point.ts + WEEK - 1) / WEEK * WEEK

    if week_cursor >= _last_token_time:
        return 0

    if week_cursor < _start_time:
        week_cursor = _start_time
    old_user_point: Point = empty(Point)

    # Iterate over weeks
    for i in range(50):
        if week_cursor >= _last_token_time:
            break

        if week_cursor >= user_point.ts and user_epoch <= max_user_epoch:
            user_epoch += 1
            old_user_point = user_point
            if user_epoch > max_user_epoch:
                user_point = empty(Point)
            else:
                user_point = VotingEscrow(ve).user_point_history(addr, user_epoch)

        else:
            # Calc
            # + i * 2 is for rounding errors
            dt: int128 = convert(week_cursor - old_user_point.ts, int128)
            balance_of: uint256 = convert(max(old_user_point.bias - dt * old_user_point.slope, 0), uint256)
            if balance_of == 0 and user_epoch > max_user_epoch:
                break
            if balance_of > 0:
                to_distribute += balance_of * self.tokens_per_week[week_cursor] / self.ve_supply[week_cursor]

            week_cursor += WEEK

    user_epoch = min(max_user_epoch, user_epoch - 1)
    self.user_epoch_of[addr] = user_epoch
    self.time_cursor_of[addr] = week_cursor

    log Claimed(addr, to_distribute, user_epoch, max_user_epoch)

    return to_distribute
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.claim_many()
'True'
```


</Example>


::::

### `can_checkpoint_token`
::::description[`FeeDistributor.can_checkpoint_token() -> bool: view`]


Getter to check if tokens can be checkpointed.

Returns: true or false (`bool`).

<SourceCode>


```vyper
can_checkpoint_token: public(bool)
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function can_checkpoint_token() view returns (bool)"]}
  method="can_checkpoint_token"
  contractName="FeeDistributor"
/>

</Example>


::::

### `checkpoint_token`
::::description[`FeeDistributor.checkpoint_token()`]


Function to update the token checkpoint. The token checkpoint tracks the balance of 3CRV within the distributor to determine the amount of fees to distribute in the given week. The checkpoint can be updated at most once every 24 hours. Fees that are received between the last checkpoint of the previous week and first checkpoint of the new week will be split evenly between the weeks. To ensure full distribution of fees in the current week, the burn process must be completed prior to the last checkpoint within the week. A token checkpoint is automatically taken during any `claim` action, if the last checkpoint is more than 24 hours old.

Emits: `CheckpointToken` event.

<SourceCode>


```vyper
event CheckpointToken:
    time: uint256
    tokens: uint256

can_checkpoint_token: public(bool)

@external
def checkpoint_token():
    """
    @notice Update the token checkpoint
    @dev Calculates the total number of tokens to be distributed in a given week.
        During setup for the initial distribution this function is only callable
        by the contract owner. Beyond initial distro, it can be enabled for anyone
        to call.
    """
    assert (msg.sender == self.admin) or\
        (self.can_checkpoint_token and (block.timestamp > self.last_token_time + TOKEN_CHECKPOINT_DEADLINE))
    self._checkpoint_token()

@internal
def _checkpoint_token():
    token_balance: uint256 = ERC20(self.token).balanceOf(self)
    to_distribute: uint256 = token_balance - self.token_last_balance
    self.token_last_balance = token_balance

    t: uint256 = self.last_token_time
    since_last: uint256 = block.timestamp - t
    self.last_token_time = block.timestamp
    this_week: uint256 = t / WEEK * WEEK
    next_week: uint256 = 0

    for i in range(20):
        next_week = this_week + WEEK
        if block.timestamp < next_week:
            if since_last == 0 and block.timestamp == t:
                self.tokens_per_week[this_week] += to_distribute
            else:
                self.tokens_per_week[this_week] += to_distribute * (block.timestamp - t) / since_last
            break
        else:
            if since_last == 0 and next_week == t:
                self.tokens_per_week[this_week] += to_distribute
            else:
                self.tokens_per_week[this_week] += to_distribute * (next_week - t) / since_last
        t = next_week
        this_week = next_week

    log CheckpointToken(block.timestamp, to_distribute)
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.checkpoint_token()
```


</Example>

::::

### `toggle_allow_checkpoint_token`
::::description[`FeeDistributor.toggle_allow_checkpoint_token()`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to toggle permission for checkpointing by an account.

Emits: `ToggleAllowCheckpointToken` event.

<SourceCode>


```vyper
event ToggleAllowCheckpointToken:
    toggle_flag: bool

@external
def toggle_allow_checkpoint_token():
    """
    @notice Toggle permission for checkpointing by any account
    """
    assert msg.sender == self.admin
    flag: bool = not self.can_checkpoint_token
    self.can_checkpoint_token = flag
    log ToggleAllowCheckpointToken(flag)
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.toggle_allow_checkpoint_token()
```


</Example>


::::

### `checkpoint_total_supply`
::::description[`FeeDistributor.checkpoint_total_supply()`]


Function to update the veCRV total supply checkpoint. The checkpoint is also updated by the first claimant each new epoch week. This function may be called independently of a claim, to reduce claiming gas costs.

<SourceCode>


```vyper 
@external
def checkpoint_total_supply():
    """
    @notice Update the veCRV total supply checkpoint
    @dev The checkpoint is also updated by the first claimant each
        new epoch week. This function may be called independently
        of a claim, to reduce claiming gas costs.
    """
    self._checkpoint_total_supply()

@internal
def _checkpoint_total_supply():
    ve: address = self.voting_escrow
    t: uint256 = self.time_cursor
    rounded_timestamp: uint256 = block.timestamp / WEEK * WEEK
    VotingEscrow(ve).checkpoint()

    for i in range(20):
        if t > rounded_timestamp:
            break
        else:
            epoch: uint256 = self._find_timestamp_epoch(ve, t)
            pt: Point = VotingEscrow(ve).point_history(epoch)
            dt: int128 = 0
            if t > pt.ts:
                # If the point is at 0 epoch, it can actually be earlier than the first deposit
                # Then make dt 0
                dt = convert(t - pt.ts, int128)
            self.ve_supply[t] = convert(max(pt.bias - pt.slope * dt, 0), uint256)
        t += WEEK

    self.time_cursor = t
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.checkpoint_total_supply()
```


</Example>

::::

### `burn`
::::description[`FeeDistributor.burn(_coin: address) -> bool`]


Function to receive 3CRV or crvUSD into the contract and trigger a token checkpoint.

| Input   | Type   | Description |
| ------- | -------| ----|
| `_coin` |  `address` | Address of the coin being received. |

Returns: true (`bool`).

<SourceCode>


```vyper
@external
def burn(_coin: address) -> bool:
    """
    @notice Receive 3CRV into the contract and trigger a token checkpoint
    @param _coin Address of the coin being received (must be 3CRV)
    @return bool success
    """
    assert _coin == self.token
    assert not self.is_killed

    amount: uint256 = ERC20(_coin).balanceOf(msg.sender)
    if amount != 0:
        ERC20(_coin).transferFrom(msg.sender, self, amount)
        if self.can_checkpoint_token and (block.timestamp > self.last_token_time + TOKEN_CHECKPOINT_DEADLINE):
            self._checkpoint_token()

    return True
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.burn("0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490")
```


</Example>

::::

---


## Killing The FeeDistributor

The `FeeDistributor` can be killed by the `admin` of the contract, which is the Curve DAO. Doing so, transfers the entire token balance to the `emergency_return` address and blocks the ability to claim or burn. The contract cannot be unkilled. 


### `is_killed`
::::description[`FeeDistributor.is_killed() -> bool: view`]


Getter method to check if the `FeeDistributor` contract is killed. When killed, the contract blocks `claim` and `burn` and the entire token balance is transferred to the `emergency_return` address.

Returns: true or false (`bool`).

<SourceCode>


```vyper 
is_killed: public(bool)
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function is_killed() view returns (bool)"]}
  method="is_killed"
  contractName="FeeDistributor"
/>


</Example>


::::

### `kill_me`
::::description[`FeeDistributor.kill_me()`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to kill the `FeeDistributor` contract.

:::danger

Killing transfers the entire token balance to the [`emergency_return`](#emergency_return) address and blocks the ability to `claim` or `burn`.


:::

<SourceCode>


```vyper
is_killed: public(bool)

@external
def kill_me():
    """
    @notice Kill the contract
    @dev Killing transfers the entire 3CRV balance to the emergency return address
        and blocks the ability to claim or burn. The contract cannot be unkilled.
    """
    assert msg.sender == self.admin

    self.is_killed = True

    token: address = self.token
    assert ERC20(token).transfer(self.emergency_return, ERC20(token).balanceOf(self))
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.kill_me()
```


</Example>


::::

### `emergency_return`
::::description[`FeeDistributor.emergency_return() -> address: view`]


Getter for the emergency return address. This address cannot be changed.

Returns: emergency return (`address`).

<SourceCode>


```vyper
emergency_return: public(address)
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function emergency_return() view returns (address)"]}
  method="emergency_return"
  contractName="FeeDistributor"
/>

</Example>


::::

### `recover_balance`
::::description[`FeeDistributor.recover_balance(_coin: address) -> bool`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to recover ERC20 tokens from the contract. Tokens are sent to the emergency return address. This function only works for tokens other than the address set for `token`. E.g. this function on the 3CRV distributor contract cannot be called to transfer 3CRV. The same applies to the crvUSD distributor.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `_coin` |  `address` | Coin address to recover |

Returns: true (`bool`).

<SourceCode>


```vyper
@external
def recover_balance(_coin: address) -> bool:
    """
    @notice Recover ERC20 tokens from this contract
    @dev Tokens are sent to the emergency return address.
    @param _coin Token address
    @return bool success
    """
    assert msg.sender == self.admin
    assert _coin != self.token

    amount: uint256 = ERC20(_coin).balanceOf(self)
    response: Bytes[32] = raw_call(
        _coin,
        concat(
            method_id("transfer(address,uint256)"),
            convert(self.emergency_return, bytes32),
            convert(amount, bytes32),
        ),
        max_outsize=32,
    )
    if len(response) != 0:
        assert convert(response, bool)

    return True
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.recover_balance("0xdAC17F958D2ee523a2206206994597C13D831ec7")
```


</Example>

::::

---


## Admin Ownership

### `admin`
::::description[`FeeDistributor.admin() -> address: view`]


Getter for the admin of the contract.

Returns: admin (`address`).

<SourceCode>


```vyper 
admin: public(address)
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function admin() view returns (address)"]}
  method="admin"
  contractName="FeeDistributor"
/>

</Example>


::::

### `future_admin`
::::description[`FeeDistributor.future_admin() -> address: view`]


Getter for the future admin of the contract.

Returns: future admin (`address`).

<SourceCode>


```vyper 
future_admin: public(address)
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function future_admin() view returns (address)"]}
  method="future_admin"
  contractName="FeeDistributor"
/>

</Example>


::::

### `commit_admin`
::::description[`FeeDistributor.commit_admin(_addr: address)`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to commit transfer of the ownership.

| Input      | Type   | Description |
| ----------- | -------| ---- |
| `_addr` |  `address` | Address to commit the ownership transfer to. |

Emits: `CommitAdmin` event.

<SourceCode>


```vyper
event CommitAdmin:
    admin: address

admin: public(address)
future_admin: public(address)

@external
def commit_admin(_addr: address):
    """
    @notice Commit transfer of ownership
    @param _addr New admin address
    """
    assert msg.sender == self.admin  # dev: access denied
    self.future_admin = _addr
    log CommitAdmin(_addr)
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.commit_admin("0x0000000000000000000000000000000000000000")
```


</Example>

::::

### `apply_admin`
::::description[`FeeDistributor.apply_admin()`]


:::guard[Guarded Method]

This function is only callable by the `admin` of the contract.


:::

Function to apply the transfer of the ownership.

Emits: `ApplyAdmin` event.

<SourceCode>


```vyper
event ApplyAdmin:
    admin: address

admin: public(address)
future_admin: public(address)

@external
def apply_admin():
    """
    @notice Apply transfer of ownership
    """
    assert msg.sender == self.admin
    assert self.future_admin != ZERO_ADDRESS
    future_admin: address = self.future_admin
    self.admin = future_admin
    log ApplyAdmin(future_admin)
```


</SourceCode>

<Example>

```shell
>>> FeeDistributor.apply_admin()
```


</Example>

::::

---


## Query Contract Information

### `ve_for_at`
::::description[`FeeDistributor.ve_for_at(_user: address, _timestamp: uint256) -> uint256: view`]


Getter for the veCRV balance for `_user` at `_timestamp`.

Returns: veCRV balance (`uint256`).

| Input      | Type   | Description |
| ----------- | -------| ----|
| `_user` |  `address` | Address to query the veCRV balance for. |
| `_timestamp` |  `uint256` | Timestamp. |

<SourceCode>


```vyper 
@view
@external
def ve_for_at(_user: address, _timestamp: uint256) -> uint256:
    """
    @notice Get the veCRV balance for `_user` at `_timestamp`
    @param _user Address to query balance for
    @param _timestamp Epoch time
    @return uint256 veCRV balance
    """
    ve: address = self.voting_escrow
    max_user_epoch: uint256 = VotingEscrow(ve).user_point_epoch(_user)
    epoch: uint256 = self._find_timestamp_user_epoch(ve, _user, _timestamp, max_user_epoch)
    pt: Point = VotingEscrow(ve).user_point_history(_user, epoch)
    return convert(max(pt.bias - pt.slope * convert(_timestamp - pt.ts, int128), 0), uint256)
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function ve_for_at(address _user, uint256 _timestamp) view returns (uint256)"]}
  method="ve_for_at"
  args={["0x989AEb4d175e16225E39E87d0D97A3360524AD80", "1685972555"]}
  labels={["_user", "_timestamp"]}
  contractName="FeeDistributor"
/>

</Example>


::::

### `start_time`
::::description[`FeeDistributor.start_time() -> uint256: view`]


Getter for the epoch time for fee distribution to start.

Returns: epoch time (`uint256`).

<SourceCode>


```vyper 
start_time: public(uint256)

@external
def __init__(
    _voting_escrow: address,
    _start_time: uint256,
    _token: address,
    _admin: address,
    _emergency_return: address
):
    """
    @notice Contract constructor
    @param _voting_escrow VotingEscrow contract address
    @param _start_time Epoch time for fee distribution to start
    @param _token Fee token address (3CRV)
    @param _admin Admin address
    @param _emergency_return Address to transfer `_token` balance to
                            if this contract is killed
    """
    t: uint256 = _start_time / WEEK * WEEK
    self.start_time = t
    self.last_token_time = t
    self.time_cursor = t
    self.token = _token
    self.voting_escrow = _voting_escrow
    self.admin = _admin
    self.emergency_return = _emergency_return
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function start_time() view returns (uint256)"]}
  method="start_time"
  contractName="FeeDistributor"
/>

</Example>


::::

### `user_epoch_of`
::::description[`FeeDistributor.user_epoch_of(arg0: address) -> uint256: view`]


Getter for the user epoch of `arg0`.

| Input      | Type   | Description |
| ----------- | -------| ----|
| `arg0` |  `address` | Address to get the user epoch for. |

Returns: user epoch (`uint256`).

<SourceCode>


```vyper
user_epoch_of: public(HashMap[address, uint256])
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function user_epoch_of(address) view returns (uint256)"]}
  method="user_epoch_of"
  args={["0x989AEb4d175e16225E39E87d0D97A3360524AD80"]}
  labels={["arg0"]}
  contractName="FeeDistributor"
/>

</Example>


::::

### `voting_escrow`
::::description[`FeeDistributor.voting_escrow() -> address: view`]


Getter for the voting escrow contract.

Returns: voting-escrow (`address`).

<SourceCode>


```vyper 
voting_escrow: public(address)

@external
def __init__(
    _voting_escrow: address,
    _start_time: uint256,
    _token: address,
    _admin: address,
    _emergency_return: address
):
    """
    @notice Contract constructor
    @param _voting_escrow VotingEscrow contract address
    @param _start_time Epoch time for fee distribution to start
    @param _token Fee token address (3CRV)
    @param _admin Admin address
    @param _emergency_return Address to transfer `_token` balance to
                            if this contract is killed
    """
    t: uint256 = _start_time / WEEK * WEEK
    self.start_time = t
    self.last_token_time = t
    self.time_cursor = t
    self.token = _token
    self.voting_escrow = _voting_escrow
    self.admin = _admin
    self.emergency_return = _emergency_return
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function voting_escrow() view returns (address)"]}
  method="voting_escrow"
  contractName="FeeDistributor"
/>

</Example>


::::

### `token_last_balance`
::::description[`FeeDistributor.token_last_balance() -> uint256: view`]


Getter for the token balance of `token`.

Returns: last token balance (`uint256`).

<SourceCode>


```vyper 
token_last_balance: public(uint256)
```


</SourceCode>

<Example>

<ContractCall
  address="0xA464e6DCda8AC41e03616F95f4BC98a13b8922Dc"
  abi={["function token_last_balance() view returns (uint256)"]}
  method="token_last_balance"
  contractName="FeeDistributor"
/>

</Example>


::::
