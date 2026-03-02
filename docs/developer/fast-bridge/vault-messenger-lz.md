# VaultMessengerLZ

The VaultMessengerLZ contract serves as the Ethereum mainnet receiver for LayerZero messages in the FastBridge system. This contract receives fast bridge messages from L2 networks and triggers immediate crvUSD minting in the FastBridgeVault, enabling users to access their bridged funds instantly while the native bridge transaction is still pending.

The contract implements LayerZero's OApp (Omnichain Application) standard to provide secure and efficient cross-chain communication. It works in conjunction with the L2MessengerLZ contracts on L2 networks to complete the fast bridge message flow and enable immediate access to bridged funds.

:::vyper[`VaultMessengerLZ.vy`]

The source code for the `VaultMessengerLZ.vy` contract can be found on [GitHub](https://github.com/curvefi/fast-bridge/blob/main/contracts/messengers/VaultMessengerLZ.vy). The contract is written using [Vyper](https://github.com/vyperlang/vyper) version `0.4.3` and utilizes [LayerZero OApp](https://docs.layerzero.network/v2/concepts/applications/oapp-standard) modules for cross-chain messaging.

The source code was audited by [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/). The full audit report can be found [here](/pdf/audits/ChainSecurity_Curve_Fast_Bridge_audit.pdf).

The contract is deployed on :logos-ethereum: Ethereum for the following L2 routes:

- :logos-arbitrum: Arbitrum: [`0x15945526b5c32d963391343e9bc080838fe3e6d9`](https://etherscan.io/address/0x15945526b5c32d963391343e9bc080838fe3e6d9)
- :logos-optimism: Optimism: [`0x4a10d0ff9e394f3a3dcdb297973db40ce304b44f`](https://etherscan.io/address/0x4a10d0ff9e394f3a3dcdb297973db40ce304b44f)
- :logos-fraxtal: Fraxtal: [`0xec0e1c5cc900d87b1fa44584310c43f82f75870f`](https://etherscan.io/address/0xec0e1c5cc900d87b1fa44584310c43f82f75870f)

<ContractABI>

```json
[{"anonymous":false,"inputs":[{"components":[{"name":"srcEid","type":"uint32"},{"name":"sender","type":"bytes32"},{"name":"nonce","type":"uint64"}],"indexed":false,"name":"origin","type":"tuple"},{"indexed":false,"name":"guid","type":"bytes32"},{"indexed":false,"name":"message","type":"bytes"}],"name":"Receive","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"vault","type":"address"}],"name":"SetVault","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previous_owner","type":"address"},{"indexed":true,"name":"new_owner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"eid","type":"uint32"},{"indexed":false,"name":"peer","type":"bytes32"}],"name":"PeerSet","type":"event"},{"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"new_owner","type":"address"}],"name":"transfer_ownership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounce_ownership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endpoint","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"arg0","type":"uint32"}],"name":"peers","outputs":[{"name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"_eid","type":"uint32"},{"name":"_peer","type":"bytes32"}],"name":"setPeer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_delegate","type":"address"}],"name":"setDelegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"name":"srcEid","type":"uint32"},{"name":"sender","type":"bytes32"},{"name":"nonce","type":"uint64"}],"name":"_origin","type":"tuple"},{"name":"_message","type":"bytes"},{"name":"_sender","type":"address"}],"name":"isComposeMsgSender","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"name":"srcEid","type":"uint32"},{"name":"sender","type":"bytes32"},{"name":"nonce","type":"uint64"}],"name":"_origin","type":"tuple"}],"name":"allowInitializePath","outputs":[{"name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"_srcEid","type":"uint32"},{"name":"_sender","type":"bytes32"}],"name":"nextNonce","outputs":[{"name":"","type":"uint64"}],"stateMutability":"pure","type":"function"},{"inputs":[{"name":"_vault","type":"address"}],"name":"set_vault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"name":"srcEid","type":"uint32"},{"name":"sender","type":"bytes32"},{"name":"nonce","type":"uint64"}],"name":"_origin","type":"tuple"},{"name":"_guid","type":"bytes32"},{"name":"_message","type":"bytes"},{"name":"_executor","type":"address"},{"name":"_extraData","type":"bytes"}],"name":"lzReceive","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"vault","outputs":[{"name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"name":"_endpoint","type":"address"}],"outputs":[],"stateMutability":"nonpayable","type":"constructor"}]
```

</ContractABI>

:::

---

## Core Functions

The VaultMessengerLZ contract provides essential functions for receiving LayerZero messages, decoding bridge requests, and triggering crvUSD minting in the vault. These functions work together to complete the fast bridge mechanism and provide immediate access to bridged funds.

### `lzReceive`
::::description[`VaultMessengerLZ.lzReceive(_origin: OApp.Origin, _guid: bytes32, _message: Bytes[OApp.MAX_MESSAGE_SIZE], _executor: address, _extraData: Bytes[OApp.MAX_EXTRA_DATA_SIZE])`]

Receives LayerZero messages originating from L2 networks and processes fast bridge requests. This function decodes the message payload and triggers crvUSD minting in the FastBridgeVault, providing immediate access to bridged funds.

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `_origin` | `OApp.Origin` | Origin information containing srcEid, sender, and nonce |
| `_guid` | `bytes32` | Global unique identifier for the message |
| `_message` | `Bytes[OApp.MAX_MESSAGE_SIZE]` | The encoded message payload containing to and amount |
| `_executor` | `address` | Address of the executor for the message |
| `_extraData` | `Bytes[OApp.MAX_EXTRA_DATA_SIZE]` | Additional data passed by the executor |

Emits: `Receive` event.

<SourceCode>

```vyper
interface IVault:
    def mint(_receiver: address, _amount: uint256) -> uint256: nonpayable

event Receive:
    origin: OApp.Origin
    guid: bytes32
    message: Bytes[OApp.MAX_MESSAGE_SIZE]

vault: public(IVault)

@payable
@external
def lzReceive(
    _origin: OApp.Origin,
    _guid: bytes32,
    _message: Bytes[OApp.MAX_MESSAGE_SIZE],
    _executor: address,
    _extraData: Bytes[OApp.MAX_EXTRA_DATA_SIZE],
):
    """
    @notice Receive message from main chain
    @param _origin Origin information containing srcEid, sender, and nonce
    @param _guid Global unique identifier for the message
    @param _message The encoded message payload containing to and amount
    @param _executor Address of the executor for the message
    @param _extraData Additional data passed by the executor
    """
    # Verify message source
    OApp._lzReceive(_origin, _guid, _message, _executor, _extraData)

    # Decode message
    to: address = empty(address)
    amount: uint256 = empty(uint256)
    to, amount = abi_decode(_message, (address, uint256))

    # Pass mint command to vault
    extcall self.vault.mint(to, amount)
    log Receive(origin=_origin, guid=_guid, message=_message)
```

</SourceCode>

<Example>

```shell
>>> VaultMessengerLZ.lzReceive(origin, guid, message, executor, extra_data)
```

</Example>

::::

---

## Variables

The VaultMessengerLZ contract maintains important state variables that control its operation and store contract addresses. These variables work together to ensure proper functioning of the cross-chain messaging system while maintaining security and efficiency.

### `vault`
::::description[`VaultMessengerLZ.vault() -> IVault: view`]

The address of the FastBridgeVault contract that receives mint commands. This contract holds pre-minted crvUSD tokens and can immediately release them to users upon receiving fast bridge messages.

Returns: FastBridgeVault contract address (`IVault`).

<SourceCode>

```vyper
vault: public(IVault)
```

</SourceCode>

<Example>

This example returns the vault address on the Arbitrum route messenger. The value is fetched live from the blockchain.

<ContractCall
  address="0x15945526b5c32d963391343e9bc080838fe3e6d9"
  abi={["function vault() view returns (address)"]}
  method="vault"
  contractName="VaultMessengerLZ"
/>

</Example>

::::

---

## Owner Functions

The VaultMessengerLZ contract includes administrative functions that allow the contract owner to manage system parameters and update contract addresses. These functions are protected by ownership checks to ensure only authorized personnel can make critical changes to the system.

### `set_vault`
::::description[`VaultMessengerLZ.set_vault(_vault: IVault)`]

:::guard[Guarded Method by [Snekmate](https://github.com/pcaversaccio/snekmate)]

This contract makes use of a Snekmate module to handle ownership. This specific function is only callable by the `owner` of the contract.

:::

Updates the address of the FastBridgeVault contract that receives mint commands. Only the contract owner can call this function. This allows for updating the vault address if the vault contract is upgraded or replaced.

| Input      | Type      | Description |
| ---------- | --------- | ------------ |
| `_vault` | `IVault` | New FastBridgeVault contract address |

Emits: `SetVault` event.

<SourceCode>

<Tabs>
<TabItem value="VaultMessengerLZ.vy" label="VaultMessengerLZ.vy">

```vyper
@external
def set_vault(_vault: IVault):
    """
    @notice Set vault address
    @param _vault new vault address
    """
    ownable._check_owner()
    assert _vault != empty(IVault), "Bad vault"

    self.vault = _vault
    log SetVault(vault=_vault)
```

</TabItem>
<TabItem value="ownable.vy" label="ownable.vy (Snekmate 🐍)">

```vyper
owner: public(address)

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
>>> VaultMessengerLZ.set_vault('0xadB10d2d5A95e58Ddb1A0744a0d2D7B55Db7843D')
```

</Example>

::::
