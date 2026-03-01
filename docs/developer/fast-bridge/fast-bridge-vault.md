# FastBridgeVault

The FastBridgeVault is the Ethereum mainnet component of the FastBridge system, responsible for managing pre-minted crvUSD tokens and handling the fast bridge mechanism. This contract serves as the central vault that holds crvUSD tokens that can be immediately released to users while their native bridge transactions are still pending.

The vault operates as a secure intermediary that bridges the gap between the slow but reliable native bridge mechanism and the immediate access requirements of users. It implements sophisticated risk management through debt ceilings, fee collection, and emergency controls to ensure system stability and user fund safety.

:::vyper[`FastBridgeVault.vy`]

The source code for the `FastBridgeVault.vy` contract can be found on [GitHub](https://github.com/curvefi/fast-bridge/blob/main/contracts/FastBridgeVault.vy). The contract is written using [Vyper](https://github.com/vyperlang/vyper) version `0.4.3` and utilizes a [Snekmate module](https://github.com/pcaversaccio/snekmate/blob/main/src/snekmate/auth/access_control.vy) to handle contract ownership.

The source code was audited by [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/). The full audit report can be found [here](/pdf/audits/ChainSecurity_Curve_Fast_Bridge_audit.pdf).

:::

---

## Core Functions

The FastBridgeVault provides essential functions for managing the fast bridge process, including token minting, fee collection, and emergency controls. These functions work together to provide immediate access to bridged funds while maintaining the security and economic sustainability of the system.

### `mint`
::::description[`FastBridgeVault.mint(_receiver: address, _amount: uint256) -> uint256`]

Releases pre-minted crvUSD from the vault's balance to the receiver. For callers with `MINTER_ROLE`, the function can additionally increase the receiver's claimable balance by `_amount`. The operation applies fees and respects kill switches for emergency situations. The vault's fast releases are economically backed by the incoming native-bridge transfers and debt-ceiling rug mechanism; it does not increase total crvUSD supply beyond what is backed by the slow bridge path.

If the vault does not have enough crvUSD at the time of the call (e.g. the native bridge transfer has not yet arrived), the receiver's pending balance is recorded in `balanceOf[_receiver]`. The receiver (or anyone) can later call `mint(_receiver, 0)` to claim the pending amount once the vault has been replenished.

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `_receiver` | `address` | Receiver of crvUSD tokens |
| `_amount` | `uint256` | Amount of crvUSD to mint (0 if not minter); use `0` to claim a pending balance |

Returns: Amount of crvUSD actually transferred to the receiver (`uint256`).

Emits: `Minted`

<SourceCode>

```vyper
@external
@nonreentrant
def mint(_receiver: address, _amount: uint256) -> uint256:
    """
    @notice Receive bridged crvUSD
    @param _receiver Receiver of crvUSD
    @param _amount Amount of crvUSD to mint (0 if not minter)
    @return Amount of crvUSD minted to receiver
    """
    assert not (self.is_killed[empty(address)] or self.is_killed[msg.sender])

    amount: uint256 = self.balanceOf[_receiver]
    if access_control.hasRole[MINTER_ROLE][msg.sender]:
        amount += _amount

        # Apply fee
        fee: uint256 = _amount * self.fee // 10 ** 18
        fee_receiver: address = self.fee_receiver
        if _receiver != fee_receiver:
            self.balanceOf[fee_receiver] += fee
            amount -= fee

    available: uint256 = min(self._get_balance(), amount)
    if available != 0:
        assert extcall CRVUSD.transfer(_receiver, available, default_return_value=True)
    self.balanceOf[_receiver] = amount - available

    log Minted(receiver=_receiver, amount=available)
    return available
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.mint('0x1234...', 10000 * 10**18)
10000000000000000000000
```

</Example>

::::

### `schedule_rug`
::::description[`FastBridgeVault.schedule_rug() -> bool`]

Checks if the vault needs to rug (reduce) its debt ceiling due to changes in the minter's debt ceiling. This function can be called by anyone and schedules the rugging process if necessary.

Returns: Boolean indicating whether rugging is needed (`bool`).

Emits: `RugScheduled`

<SourceCode>

```vyper
@external
def schedule_rug() -> bool:
    """
    @notice Schedule rugging debt ceiling if necessary. Callable by anyone
    @return Boolean whether need to rug or not
    """
    rug_scheduled: bool = self._need_to_rug()
    self.rug_scheduled = rug_scheduled
    log RugScheduled(status=rug_scheduled)
    return rug_scheduled
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.schedule_rug()
False
```

</Example>

::::

## Variables

The FastBridgeVault contract maintains several important state variables that control its operation, track balances, manage fees, and implement security mechanisms. These variables work together to ensure proper functioning of the fast bridge system while maintaining security and economic sustainability.

### `balanceOf`
::::description[`FastBridgeVault.balanceOf(address) -> uint256: view`]

Tracks the pending crvUSD balance for each address. This represents tokens that have been bridged but not yet claimed by the recipient.

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `arg0` | `address` | Address to check pending balance for |

Returns: Pending crvUSD balance for the given address (`uint256`).

<SourceCode>

```vyper
balanceOf: public(HashMap[address, uint256])
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.balanceOf('0x1234...')
0
```

</Example>

::::

### `fee`
::::description[`FastBridgeVault.fee() -> uint256: view`]

The fee rate applied to bridge transactions, expressed with 10^18 precision (e.g., 1% = 10^16).

Returns: Fee rate with 10^18 precision (`uint256`).

<SourceCode>

```vyper
fee: public(uint256)  # 10^18 precision
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.fee()
0
```

</Example>

::::

### `fee_receiver`
::::description[`FastBridgeVault.fee_receiver() -> address: view`]

The address that receives the fees collected from bridge transactions.

Returns: Fee receiver address (`address`).

<SourceCode>

```vyper
fee_receiver: public(address)
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.fee_receiver()
'0xa2Bcd1a4Efbd04B63cd03f5aFf2561106ebCCE00'
```

</Example>

::::

### `rug_scheduled`
::::description[`FastBridgeVault.rug_scheduled() -> bool: view`]

Indicates whether a debt ceiling rugging operation has been scheduled. This happens when the minter's debt ceiling has been reduced.

Returns: Boolean indicating if rugging is scheduled (`bool`).

<SourceCode>

```vyper
rug_scheduled: public(bool)
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.rug_scheduled()
False
```

</Example>

::::

### `is_killed`
::::description[`FastBridgeVault.is_killed(address) -> bool: view`]

Emergency kill switch that can disable specific minters or all minting operations. When killed, the specified address cannot mint tokens.

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `address` | `address` | Address to check kill status for |

Returns: Boolean indicating if the address is killed (`bool`).

<SourceCode>

```vyper
is_killed: public(HashMap[address, bool])
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.is_killed('0x0000...')
False
```

</Example>

::::

### `version`
::::description[`FastBridgeVault.version() -> String[8]: view`]

The version identifier for this contract implementation.

Returns: Contract version string (`String[8]`).

<SourceCode>

```vyper
version: public(constant(String[8])) = "0.0.1"
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.version()
'0.0.1'
```

</Example>

::::

### `MINTER_ROLE`
::::description[`FastBridgeVault.MINTER_ROLE() -> bytes32: view`]

The role identifier for addresses that can mint crvUSD from the vault.

Returns: Role identifier for minters (`bytes32`).

<SourceCode>

```vyper
MINTER_ROLE: public(constant(bytes32)) = keccak256("MINTER")
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.MINTER_ROLE()
b'\xf0\x88{\xa6^\xe2\x02N\xa8\x81\xd9\x1bt\xc2E\x0e\xf1\x9e\x15W\xf0;\xed>\xa9\xf1k\x03|\xbe-\xc9'
```

</Example>

::::

### `KILLER_ROLE`
::::description[`FastBridgeVault.KILLER_ROLE() -> bytes32: view`]

The role identifier for addresses that can kill/unkill minters in emergency situations.

Returns: Role identifier for emergency operators (`bytes32`).

<SourceCode>

```vyper
KILLER_ROLE: public(constant(bytes32)) = keccak256("KILLER")
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.KILLER_ROLE()
b'\x99\xf84\xfa\xe7\x1e\xae\x91\x9b\x81\x02\x81z\x18\xb0-eU\x05ij\x88\xccI\xe3\nImu\xa0-\xec'
```

</Example>

::::

### `CRVUSD`
::::description[`FastBridgeVault.CRVUSD() -> IERC20: view`]

The crvUSD token contract address on mainnet. This is the token that gets minted from the vault.

Returns: crvUSD token contract address (`IERC20`).

<SourceCode>

```vyper
CRVUSD: public(constant(IERC20)) = IERC20(0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E)
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.CRVUSD()
'0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E'
```

</Example>

::::

### `MINTER`
::::description[`FastBridgeVault.MINTER() -> IMinter: view`]

The minter contract (ControllerFactory) that manages debt ceilings and can rug debt when necessary.

Returns: Minter contract address (`IMinter`).

<SourceCode>

```vyper
MINTER: public(constant(IMinter)) = IMinter(0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC)
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.MINTER()
'0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC'
```

</Example>

::::

---

## Admin Functions

The FastBridgeVault includes several administrative functions that allow authorized parties to manage the system's operation, configure parameters, and respond to emergency situations. These functions are protected by role-based access control to ensure only authorized personnel can make critical changes to the system.

### `set_killed`
::::description[`FastBridgeVault.set_killed(_status: bool, _who: address=empty(address))`]

:::guard[Guarded Method by [Snekmate](https://github.com/pcaversaccio/snekmate)]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function can only be called by the `KILLER_ROLE` role.

:::

Emergency function to kill or unkill specific minters or all minting operations. Only addresses with KILLER_ROLE can call this function.

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `_status` | `bool` | Boolean whether to stop minter from working |
| `_who` | `address` | Minter to kill/unkill, empty address to kill all receiving (default: empty address) |

Emits: `SetKilled`

<SourceCode>

```vyper
@external
def set_killed(_status: bool, _who: address=empty(address)):
    """
    @notice Emergency method to kill minter
    @param _status Boolean whether to stop minter from working
    @param _who Minter to kill/unkill, empty address to kill all receiving
    """
    access_control._check_role(KILLER_ROLE, msg.sender)

    self.is_killed[_who] = _status
    log SetKilled(actor=_who, killed=_status)
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.set_killed(True, '0x1234...')
```

</Example>

::::

### `set_fee`
::::description[`FastBridgeVault.set_fee(_new_fee: uint256)`]

:::guard[Guarded Method by [Snekmate](https://github.com/pcaversaccio/snekmate)]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function can only be called by the `DEFAULT_ADMIN_ROLE` role.

:::

Updates the fee rate applied to bridge transactions. Only the admin can call this function. The fee cannot exceed 100% (10^18).

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `_new_fee` | `uint256` | New fee rate with 10^18 precision (max: 10^18) |

Emits: `SetFee`

<SourceCode>

```vyper
@external
def set_fee(_new_fee: uint256):
    """
    @notice Set fee on bridge transactions
    @param _new_fee Fee with 10^18 precision
    """
    access_control._check_role(access_control.DEFAULT_ADMIN_ROLE, msg.sender)
    assert _new_fee <= 10 ** 18

    self.fee = _new_fee
    log SetFee(fee=_new_fee)
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.set_fee(0)
```

</Example>

::::

### `set_fee_receiver`
::::description[`FastBridgeVault.set_fee_receiver(_new_fee_receiver: address)`]

:::guard[Guarded Method by [Snekmate](https://github.com/pcaversaccio/snekmate)]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function can only be called by the `DEFAULT_ADMIN_ROLE` role.

:::

Updates the address that receives fees from bridge transactions. Only the admin can call this function.

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `_new_fee_receiver` | `address` | New fee receiver address |

Emits: `SetFeeReceiver`

<SourceCode>

```vyper
@external
def set_fee_receiver(_new_fee_receiver: address):
    """
    @notice Set new fee receiver
    @param _new_fee_receiver Fee receiver address
    """
    access_control._check_role(access_control.DEFAULT_ADMIN_ROLE, msg.sender)
    assert _new_fee_receiver != empty(address)

    self.fee_receiver = _new_fee_receiver
    log SetFeeReceiver(fee_receiver=_new_fee_receiver)
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.set_fee_receiver('0xa2Bcd...')
```

</Example>

::::

### `recover`
::::description[`FastBridgeVault.recover(_recovers: DynArray[RecoverInput, 32], _receiver: address)`]

:::guard[Guarded Method by [Snekmate](https://github.com/pcaversaccio/snekmate)]

This contract makes use of a Snekmate module to manage roles and permissions. This specific function can only be called by the `DEFAULT_ADMIN_ROLE` role.

:::

Emergency function to recover ERC20 tokens from the contract. This is needed in case of minter malfunction or other emergencies. Only the admin can call this function.

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `_recovers` | `DynArray[RecoverInput, 32]` | Array of (token, amount) pairs to recover |
| `_receiver` | `address` | Address to receive the recovered tokens |

Emits: `Recovered`

<SourceCode>

```vyper
@external
def recover(_recovers: DynArray[RecoverInput, 32], _receiver: address):
    """
    @notice Recover ERC20 tokens from this contract. Needed in case of minter malfunction.
    @dev Callable only by owner
    @param _recovers (Token, amount) to recover
    @param _receiver Receiver of coins
    """
    access_control._check_role(access_control.DEFAULT_ADMIN_ROLE, msg.sender)

    for input: RecoverInput in _recovers:
        amount: uint256 = input.amount
        if amount == max_value(uint256):
            amount = staticcall input.coin.balanceOf(self)
        extcall input.coin.transfer(_receiver, amount, default_return_value=True)  # do not need safe transfer
        log Recovered(token=input.coin, receiver=_receiver, amount=amount)
```

</SourceCode>

<Example>

```python
>>> FastBridgeVault.recover([('0xf939...', 1000 * 10**18)], '0x1234...')
```

</Example>

::::
