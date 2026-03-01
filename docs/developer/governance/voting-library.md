# Curve Voting Library

The `curve-voting-lib` is a Python toolkit for creating and simulating Curve DAO governance votes. Built on [titanoboa](https://github.com/vyperlang/titanoboa) (a Vyper/EVM execution framework), it replaces the deprecated `curve-dao` package.

:::github[GitHub]

Source code for `curve-voting-lib` can be found on [GitHub](https://github.com/curvefi/curve-voting-lib).

:::

---

## Overview

The library uses a **context manager** pattern (`vote()`) that automatically captures contract interactions and constructs [Aragon EVM scripts](https://hack.aragon.org/docs/aragonos-ref#evmscripts). Every vote is **simulation-first**: before going live, the library creates the vote using the Convex voter proxy (the largest veCRV holder), votes yes, time-travels past the voting period, and executes — verifying the entire lifecycle on a forked mainnet.

Key features:

- **Context manager voting** — `vote()` monkey-patches titanoboa's `prepare_calldata` to capture contract calls
- **Automatic simulation** — every vote is simulated before going live
- **IPFS integration** — vote descriptions are pinned via Pinata with local caching
- **Cross-chain support** — `xvote()` context manager for cross-chain governance across 20+ chains

---

## Installation

```bash
git clone https://github.com/curvefi/curve-voting-lib.git
cd curve-voting-lib
uv sync
uv run python -m pip install -e .
```

### Environment Variables

| Variable     | Description                              |
| ------------ | ---------------------------------------- |
| `RPC_URL`    | Ethereum RPC endpoint URL                |
| `PINATA_JWT` | Pinata API JWT token for IPFS pinning    |

---

## DAO Types

Curve has two DAO types with different quorum and support requirements:

| DAO Type      | Quorum | Support | Use Case                                      |
| ------------- | ------ | ------- | --------------------------------------------- |
| `OWNERSHIP`   | 30%    | 51%     | Critical changes (ownership transfers, etc.)   |
| `PARAMETER`   | 15%    | 60%     | Parameter adjustments (pool fees, etc.)        |

Each DAO type is a `DAOParameters` dataclass containing the agent, voting contract, token, and quorum:

```python
from voting import OWNERSHIP, PARAMETER

# OWNERSHIP
# agent:  0x40907540d8a6C65c637785e8f8B742ae6b0b9968
# voting: 0xE478de485ad2fe566d49342Cbd03E49ed7DB3356
# token:  0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2
# quorum: 30

# PARAMETER
# agent:  0x4eeb3ba4f221ca16ed4a0cc7254e2e32df948c5f
# voting: 0xbcff8b0b9419b9a88c44546519b1e909cf330399
# token:  0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2
# quorum: 15
```

---

## Core API

### `vote()` Context Manager

The primary interface. Any mutable contract call made inside the `with vote(...)` block is automatically captured and bundled into an Aragon EVM script.

```python
from voting import vote, OWNERSHIP

with vote(
    OWNERSHIP,
    "Description of what this vote does",
    live_env=None,  # None = simulation only, BrowserEnv() or CustomEnv() for live
):
    # All contract calls here are captured as vote actions
    contract.do_something(value)
    assert contract.something() == value  # assertions work too
```

The context manager also acts as a **prank** (the caller is set to the DAO agent) and an **anchor** (state changes are reverted after the block). On exit, it:

1. Prepares the EVM script from captured actions
2. Creates the vote using the Convex voter proxy (`0x989AEB4D175E16225E39E87D0D97A3360524AD80`)
3. Votes yes, time-travels past the voting period, and executes
4. If `live_env` is set, pins the description to IPFS and creates the vote on-chain

### `vote_test()` Context Manager

Use `vote_test()` inside a `vote()` block to run assertions without capturing them as vote actions:

```python
with vote(OWNERSHIP, "Set pool implementation"):
    factory.set_pool_implementation(new_impl, impl_hash)

    with vote_test():
        # These calls are NOT captured as vote actions
        assert factory.pool_implementations(impl_hash) == new_impl
```

### Live Voting Environments

For creating actual on-chain votes (not just simulations):

```python
from voting import vote, OWNERSHIP, BrowserEnv, CustomEnv

# Using a browser wallet (Rabby, MetaMask, etc.)
with vote(OWNERSHIP, "Description", live_env=BrowserEnv()):
    contract.do_something()

# Using a custom account
from eth_account import Account
env = CustomEnv(rpc="https://eth.llamarpc.com", account=Account.from_key("0x..."))
with vote(OWNERSHIP, "Description", live_env=env):
    contract.do_something()
```

---

## Usage Example

This example sets a new pool implementation on the TwoCrypto-NG factory:

```python
import os
import boa
from voting import vote, abi, OWNERSHIP, BrowserEnv
from eth_utils import keccak

RPC_URL = os.getenv("RPC_URL")
boa.fork(RPC_URL)
factory = abi.twocrypto_ng_mainnet_factory.at("0x98EE851a00abeE0d95D08cF4CA2BdCE32aeaAF7F")

with vote(
    OWNERSHIP,
    "[twocrypto] Add implementations for donations-enabled pools",
    live=BrowserEnv(),
):
    factory.set_pool_implementation(
        donations_pool := "0xbab4CA419DF4e9ED96435823990C64deAD976a9F",
        donations_hash := int.from_bytes(keccak(b"donations"), "big"),
    )

    assert factory.pool_implementations(donations_hash) == donations_pool
```

Scripts can be run using:

```bash
uv run scripts/gauges/add_gauge.py
uv run scripts/twocrypto-ng/set_implementation.py
```

---

## Cross-chain Governance (`xvote()`)

The `xvote()` context manager nests inside `vote()` to create cross-chain governance proposals. It forks the target chain, captures messages, and broadcasts them through the appropriate broadcaster contract.

```python
from voting import vote, xvote, OWNERSHIP
from voting.xgov.chains import FRAXTAL

with vote(OWNERSHIP, description="[Fraxtal] Set things"):
    with xvote(FRAXTAL, "https://rpc.frax.com"):
        things.set()
```

### Supported Chains

The library supports 20+ chains including Arbitrum, Optimism, Base, Fraxtal, Mantle, Polygon, Gnosis, Avalanche, BSC, Fantom, Sonic, Kava, Celo, Aurora, Moonbeam, X Layer, Taiko, Ink, Etherlink, XDC, Corn, Plume, Hyperliquid, and TAC.

Each chain uses one of several broadcaster types:

| Broadcaster Type   | Chains                                |
| ------------------ | ------------------------------------- |
| Arbitrum           | Arbitrum                              |
| Optimism           | Optimism, Fraxtal, Base, Mantle       |
| Polygon zkEVM      | X Layer                               |
| Taiko              | Taiko                                 |
| Storage Proofs     | All other chains (Gnosis, Polygon, BSC, Avalanche, Fantom, Sonic, Kava, Celo, etc.) |

For more details on the cross-chain governance infrastructure, see the [Cross-chain Governance](x-gov/overview.md) section.

---

## Pre-built ABIs

The `abi` module provides pre-configured contract interfaces for common Curve contracts:

```python
from voting import abi

# Available ABIs include:
abi.aragon_agent          # Aragon Agent contract
abi.voting                # Aragon Voting contract
abi.twocrypto_ng_mainnet_factory  # TwoCrypto-NG Factory
# ... and more
```

These are loaded using `boa.loads_abi()` and can be attached to deployed addresses with `.at()`.
