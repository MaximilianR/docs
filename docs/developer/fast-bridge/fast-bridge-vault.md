# FastBridgeVault

The FastBridgeVault is the Ethereum mainnet component of the FastBridge system, responsible for managing pre-minted crvUSD tokens and handling the fast bridge mechanism. This contract serves as the central vault that holds crvUSD tokens that can be immediately released to users while their native bridge transactions are still pending.

The vault operates as a secure intermediary that bridges the gap between the slow but reliable native bridge mechanism and the immediate access requirements of users. It implements sophisticated risk management through debt ceilings, fee collection, and emergency controls to ensure system stability and user fund safety.

:::vyper[`FastBridgeVault.vy`]

The source code for the `FastBridgeVault.vy` contract can be found on [GitHub](https://github.com/curvefi/fast-bridge/blob/main/contracts/FastBridgeVault.vy). The contract is written using [Vyper](https://github.com/vyperlang/vyper) version `0.4.3` and utilizes a [Snekmate module](https://github.com/pcaversaccio/snekmate/blob/main/src/snekmate/auth/access_control.vy) to handle contract ownership.

The source code was audited by [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/). The full audit report can be found [here](/pdf/audits/ChainSecurity_Curve_Fast_Bridge_audit.pdf).

The contract is deployed on :logos-ethereum: Ethereum for the following L2 routes:

- :logos-arbitrum: Arbitrum: [`0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D`](https://etherscan.io/address/0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D)
- :logos-optimism: Optimism: [`0x97d024859B68394122B3d0bb407dD7299cC8E937`](https://etherscan.io/address/0x97d024859B68394122B3d0bb407dD7299cC8E937)
- :logos-fraxtal: Fraxtal: [`0x5EF620631AA46e7d2F6f963B6bE4F6823521B9eC`](https://etherscan.io/address/0x5EF620631AA46e7d2F6f963B6bE4F6823521B9eC)

<ContractABI>

```json
[{"anonymous":false,"inputs":[{"indexed":true,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"status","type":"bool"}],"name":"RugScheduled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fee","type":"uint256"}],"name":"SetFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fee_receiver","type":"address"}],"name":"SetFeeReceiver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"actor","type":"address"},{"indexed":false,"name":"killed","type":"bool"}],"name":"SetKilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Recovered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"role","type":"bytes32"},{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"role","type":"bytes32"},{"indexed":true,"name":"account","type":"address"},{"indexed":true,"name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"role","type":"bytes32"},{"indexed":true,"name":"previousAdminRole","type":"bytes32"},{"indexed":true,"name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"inputs":[{"name":"arg0","type":"bytes32"},{"name":"arg1","type":"address"}],"name":"hasRole","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"role","type":"bytes32"},{"name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"role","type":"bytes32"},{"name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"role","type":"bytes32"},{"name":"account","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"role","type":"bytes32"},{"name":"admin_role","type":"bytes32"}],"name":"set_role_admin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"schedule_rug","outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_receiver","type":"address"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_status","type":"bool"}],"name":"set_killed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_status","type":"bool"},{"name":"_who","type":"address"}],"name":"set_killed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_new_fee","type":"uint256"}],"name":"set_fee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_new_fee_receiver","type":"address"}],"name":"set_fee_receiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"name":"coin","type":"address"},{"name":"amount","type":"uint256"}],"name":"_recovers","type":"tuple[]"},{"name":"_receiver","type":"address"}],"name":"recover","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"KILLER_ROLE","outputs":[{"name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CRVUSD","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee_receiver","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rug_scheduled","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"address"}],"name":"is_killed","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"_ownership","type":"address"},{"name":"_emergency","type":"address"},{"name":"_minters","type":"address[]"}],"outputs":[],"stateMutability":"nonpayable","type":"constructor"}]
```

</ContractABI>

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

Emits: `Minted` event.

<SourceCode>

<Tabs>
<TabItem value="FastBridgeVault.vy" label="FastBridgeVault.vy">

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

</TabItem>
<TabItem value="access_control.vy" label="access_control.vy (Snekmate 🐍)">

```vyper
# @dev Returns `True` if `account` has been granted `role`.
hasRole: public(HashMap[bytes32, HashMap[address, bool]])
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
>>> FastBridgeVault.mint('0x1234...', 10000 * 10**18)
10000000000000000000000
```

</Example>

::::

### `schedule_rug`
::::description[`FastBridgeVault.schedule_rug() -> bool`]

Checks if the vault needs to rug (reduce) its debt ceiling due to changes in the minter's debt ceiling. This function can be called by anyone and schedules the rugging process if necessary.

Returns: Boolean indicating whether rugging is needed (`bool`).

Emits: `RugScheduled` event.

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

```shell
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

This example returns the pending crvUSD balance for a given address on the Arbitrum route vault. Enter an address and click **Query** to fetch the value live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function balanceOf(address) view returns (uint256)"]}
  method="balanceOf"
  args={["0x0000000000000000000000000000000000000000"]}
  labels={["arg0"]}
  contractName="FastBridgeVault"
/>

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

This example returns the current fee rate on the Arbitrum route vault. The value is fetched live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function fee() view returns (uint256)"]}
  method="fee"
  contractName="FastBridgeVault"
/>

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

This example returns the current fee receiver address on the Arbitrum route vault. The value is fetched live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function fee_receiver() view returns (address)"]}
  method="fee_receiver"
  contractName="FastBridgeVault"
/>

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

This example returns whether a rug operation is currently scheduled on the Arbitrum route vault. The value is fetched live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function rug_scheduled() view returns (bool)"]}
  method="rug_scheduled"
  contractName="FastBridgeVault"
/>

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

This example checks the kill status for the zero address (global kill switch) on the Arbitrum route vault. Enter an address and click **Query** to fetch the value live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function is_killed(address) view returns (bool)"]}
  method="is_killed"
  args={["0x0000000000000000000000000000000000000000"]}
  labels={["address"]}
  contractName="FastBridgeVault"
/>

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

This example returns the contract version on the Arbitrum route vault. The value is fetched live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function version() view returns (string)"]}
  method="version"
  contractName="FastBridgeVault"
/>

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

This example returns the MINTER_ROLE identifier on the Arbitrum route vault. The value is fetched live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function MINTER_ROLE() view returns (bytes32)"]}
  method="MINTER_ROLE"
  contractName="FastBridgeVault"
/>

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

This example returns the KILLER_ROLE identifier on the Arbitrum route vault. The value is fetched live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function KILLER_ROLE() view returns (bytes32)"]}
  method="KILLER_ROLE"
  contractName="FastBridgeVault"
/>

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

This example returns the crvUSD token address on the Arbitrum route vault. The value is fetched live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function CRVUSD() view returns (address)"]}
  method="CRVUSD"
  contractName="FastBridgeVault"
/>

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

This example returns the MINTER (ControllerFactory) contract address on the Arbitrum route vault. The value is fetched live from the blockchain.

<ContractCall
  address="0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D"
  abi={["function MINTER() view returns (address)"]}
  method="MINTER"
  contractName="FastBridgeVault"
/>

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

Emits: `SetKilled` event.

<SourceCode>

<Tabs>
<TabItem value="FastBridgeVault.vy" label="FastBridgeVault.vy">

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

</TabItem>
<TabItem value="access_control.vy" label="access_control.vy (Snekmate 🐍)">

```vyper
# @dev Returns `True` if `account` has been granted `role`.
hasRole: public(HashMap[bytes32, HashMap[address, bool]])

@internal
@view
def _check_role(role: bytes32, account: address):
    """
    @dev Reverts with a standard message if `account`
         is missing `role`.
    @param role The 32-byte role definition.
    @param account The 20-byte address of the account.
    """
    assert self.hasRole[role][account], "access_control: account is missing role"
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
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

Emits: `SetFee` event.

<SourceCode>

<Tabs>
<TabItem value="FastBridgeVault.vy" label="FastBridgeVault.vy">

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

</TabItem>
<TabItem value="access_control.vy" label="access_control.vy (Snekmate 🐍)">

```vyper
# @dev The default 32-byte admin role.
DEFAULT_ADMIN_ROLE: public(constant(bytes32)) = empty(bytes32)

# @dev Returns `True` if `account` has been granted `role`.
hasRole: public(HashMap[bytes32, HashMap[address, bool]])

@internal
@view
def _check_role(role: bytes32, account: address):
    """
    @dev Reverts with a standard message if `account`
         is missing `role`.
    @param role The 32-byte role definition.
    @param account The 20-byte address of the account.
    """
    assert self.hasRole[role][account], "access_control: account is missing role"
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
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

Emits: `SetFeeReceiver` event.

<SourceCode>

<Tabs>
<TabItem value="FastBridgeVault.vy" label="FastBridgeVault.vy">

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

</TabItem>
<TabItem value="access_control.vy" label="access_control.vy (Snekmate 🐍)">

```vyper
# @dev The default 32-byte admin role.
DEFAULT_ADMIN_ROLE: public(constant(bytes32)) = empty(bytes32)

# @dev Returns `True` if `account` has been granted `role`.
hasRole: public(HashMap[bytes32, HashMap[address, bool]])

@internal
@view
def _check_role(role: bytes32, account: address):
    """
    @dev Reverts with a standard message if `account`
         is missing `role`.
    @param role The 32-byte role definition.
    @param account The 20-byte address of the account.
    """
    assert self.hasRole[role][account], "access_control: account is missing role"
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
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

Emits: `Recovered` event.

<SourceCode>

<Tabs>
<TabItem value="FastBridgeVault.vy" label="FastBridgeVault.vy">

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

</TabItem>
<TabItem value="access_control.vy" label="access_control.vy (Snekmate 🐍)">

```vyper
# @dev The default 32-byte admin role.
DEFAULT_ADMIN_ROLE: public(constant(bytes32)) = empty(bytes32)

# @dev Returns `True` if `account` has been granted `role`.
hasRole: public(HashMap[bytes32, HashMap[address, bool]])

@internal
@view
def _check_role(role: bytes32, account: address):
    """
    @dev Reverts with a standard message if `account`
         is missing `role`.
    @param role The 32-byte role definition.
    @param account The 20-byte address of the account.
    """
    assert self.hasRole[role][account], "access_control: account is missing role"
```

</TabItem>
</Tabs>

</SourceCode>

<Example>

```shell
>>> FastBridgeVault.recover([('0xf939...', 1000 * 10**18)], '0x1234...')
```

</Example>

::::
