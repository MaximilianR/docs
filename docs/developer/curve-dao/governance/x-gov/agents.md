
# L2 Agents

The `Agent` contracts acts as a proxy for the agents on Ethereum. Relayed votes are directly executed from the `Relayer` contract itself. Execution of messages is done automatically by the `Agent` contract.

:::vyper[`Agent.vy`]

The source code of the `Agent.vy` contract can be found on [GitHub ](https://github.com/curvefi/curve-xgov/blob/master/contracts/Agent.vy).

A comprehensive list of all deployed contracts is available [here ↗](../../../deployments.md).


:::

Just like on Ethereum, there are three different agent contracts: The `Ownership Agent`, the `Parameter Agent`, and the `Emergency Agent`, each one with their own specific roles.

---

### `execute`
::::description[`Agent.execute(_messages: DynArray[Message, MAX_MESSAGES])`]


:::guard[Guarded Method]

This function can only be called by the `RELAYER` of the contract.


:::

Function to execute a sequence of relayed messages. Calling this function directly from the `Agent` contract will result in a reverted transaction, as it can only be called directly from the `Relayer` contract. Execution happens automatically after a message has been relayed.

| Input       | Type                               | Description  |
| ----------- | ---------------------------------- | ------------ |
| `_messages` |  `DynArray[Message, MAX_MESSAGES]` | Message to execute. |

<SourceCode>

```vyper
struct Message:
    target: address
    data: Bytes[MAX_BYTES]

MAX_BYTES: constant(uint256) = 1024
MAX_MESSAGES: constant(uint256) = 8

RELAYER: public(immutable(address))

@external
def execute(_messages: DynArray[Message, MAX_MESSAGES]):
    """
    @notice Execute a sequence of messages.
    @param _messages An array of messages to be executed.
    """
    assert msg.sender == RELAYER

    for message in _messages:
        raw_call(message.target, message.data)
```

</SourceCode>


::::

### `RELAYER`
::::description[`Agent.RELAYER() -> address: view`]


Getter for the relayer contract, which relays the messages to the according agent.

Returns: relayer contract (`address`).

<SourceCode>

```vyper
RELAYER: public(immutable(address))

@external
def __init__():
    RELAYER = msg.sender
```

</SourceCode>

<Example>

This example returns the `Relayer` contracts for the Arbitrum and Optimism chains.

```shell
>>> Agent.RELAYER()     # arbitrum
'0xb7b0FF38E0A01D798B5cd395BbA6Ddb56A323830'

>>> Agent.RELAYER()     # optimism
'0x8e1e5001C7B8920196c7E3EdF2BCf47B2B6153ff'
```

</Example>


::::
