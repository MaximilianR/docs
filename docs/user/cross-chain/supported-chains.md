---
id: supported-chains
title: Supported Chains & Assets
sidebar_label: Supported Chains & Assets
---

import ThemedImage from '@theme/ThemedImage';

While Ethereum remains Curve's primary network, Curve products and assets are available across multiple blockchains. Each network offers unique advantages in terms of transaction speed and costs. To use Curve on alternate networks, you'll typically need to bridge your funds from Ethereum using the target network's bridge.

## Ecosystem Components

The Curve ecosystem consists of five key components with varying cross-chain availability:

- [**Curve DEX** (Decentralized Exchange)](dex-llamalend.md) - Available on many chains, and now deployable permissionlessly to any chain.
- [**Curve Lending (Llamalend)**](dex-llamalend.md) - Available on Ethereum and select L2s, with deployment to any chain coming soon.
- [**Curve Assets** (CRV, crvUSD, scrvUSD)](curve-assets.md) - Available on many chains through native bridges and LayerZero.
- **CrvUSD Minting** - Ethereum-only, with no plans for deployment to other networks.
- **CurveDAO** -  Ethereum-only, with no plans for cross-chain deployment.
- **CRV Rewards** - CRV inflation rewards are available to pools and llamalend markets on all chains that Curve supports, but the DAO must vote to add the market to the Gauge Controller (controls which markets can get rewards).

See the linked pages above for more details on how this works.

## Checking Network Availability

To verify product availability on a specific network:

1. Visit the specific product page (e.g., [Curve Swap](https://curve.fi/#/ethereum/swap))
2. Connect your wallet
3. Click the network dropdown menu on the top right to see all supported networks

<figure>
    <ThemedImage
        alt="Weekly gauge weight cycle showing the voting and distribution timeline"
        sources={{
            light: require('@site/static/img/user/cross-chain/networks_light.png').default,
            dark: require('@site/static/img/user/cross-chain/networks_light.png').default,
        }}
        style={{ width: '300px', display: 'block', margin: '0 auto' }}
    />
</figure>

---

## <img src="/img/logos/crv.svg" alt="CRV" style={{height: '1.3em', verticalAlign: 'middle'}} /> CRV (Curve DAO Token)

The Curve token can be bridged across various chains, though it does not always retain full functionality. Locking CRV to obtain veCRV, as well as rewards voting for cross-chain gauges, must be conducted on the Ethereum blockchain.

| Network | Contract Address | Bridge |
| ------- | :--------------: | :----: |
| <img src="/img/logos/ethereum.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Ethereum** | [0xD533a949740bb3306d119CC777fa900bA034cd52](https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52) | --- |
| <img src="/img/logos/arbitrum.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Arbitrum** | [0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978](https://arbiscan.io/address/0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978) | [**Arbitrum Bridge**](https://bridge.arbitrum.io/)​ |
| <img src="/img/logos/base.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Base** | [0x8Ee73c484A26e0A5df2Ee2a4960B789967dd0415](https://basescan.org/address/0x8Ee73c484A26e0A5df2Ee2a4960B789967dd0415) | [**Base Bridge**](https://bridge.base.org/deposit) |
| <img src="/img/logos/optimism.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Optimism** | [0x0994206dfE8De6Ec6920FF4D779B0d950605Fb53](https://optimistic.etherscan.io/address/0x0994206dfe8de6ec6920ff4d779b0d950605fb53) | [**Optimism Bridge**](https://app.optimism.io/bridge) |
| <img src="/img/logos/polygon.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Polygon** | [0x172370d5Cd63279eFa6d502DAB29171933a610AF](https://polygonscan.com/address/0x172370d5cd63279efa6d502dab29171933a610af) | [**Polygon Bridge**](https://wallet.polygon.technology/bridge/)​ |
| <img src="/img/logos/gnosis.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Gnosis** | [0x712b3d230F3C1c19db860d80619288b1F0BDd0Bd](https://gnosisscan.io/address/0x712b3d230f3c1c19db860d80619288b1f0bdd0bd) | [**Gnosis Bridge**](https://bridge.gnosischain.com/)​ |
| <img src="/img/logos/xlayer.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **X-Layer** | [0x3d5320821bfca19fb0b5428f2c79d63bd5246f89](https://www.okx.com/web3/explorer/xlayer/address/0x3d5320821bfca19fb0b5428f2c79d63bd5246f89) | [**X-Layer Bridge**](https://www.okx.com/xlayer/bridge)​ |


---


## <img src="/img/logos/crvusd.svg" alt="CRV" style={{height: '1.3em', verticalAlign: 'middle'}} /> crvUSD

crvUSD was first introduced in May 2023 on the Ethereum blockchain. For now, this stablecoin can be minted exclusively on the Ethereum mainnet.

[Understanding crvUSD](../crvusd/overview.md)

*Despite being launched on Ethereum, crvUSD can be bridged to various chains:*

| Chain                         | crvUSD Token Address | Official Bridge |
| ----------------------------- | :------------------: | :-------------: |
| <img src="/img/logos/ethereum.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Ethereum** | [0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E](https://etherscan.io/token/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E) | --- |
| <img src="/img/logos/arbitrum.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Arbitrum** | [0x498Bf2B1e120FeD3ad3D42EA2165E9b73f99C1e5](https://arbiscan.io/address/0x498Bf2B1e120FeD3ad3D42EA2165E9b73f99C1e5) | [Arbitrum Bridge](https://bridge.arbitrum.io/?destinationChain=arbitrum-one&sourceChain=ethereum) |
| <img src="/img/logos/optimism.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Optimism** | [0xc52d7f23a2e460248db6ee192cb23dd12bddcbf6](https://optimistic.etherscan.io/address/0xc52d7f23a2e460248db6ee192cb23dd12bddcbf6) | [Optimism Bridge](https://app.optimism.io/bridge/deposit) |
| <img src="/img/logos/base.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Base**         | [0x417Ac0e078398C154EdFadD9Ef675d30Be60Af93](https://basescan.org/address/0x417Ac0e078398C154EdFadD9Ef675d30Be60Af93) | [Base Bridge](https://bridge.base.org/deposit) |
| <img src="/img/logos/gnosis.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Gnosis**     | [0xaBEf652195F98A91E490f047A5006B71c85f058d](https://gnosisscan.io/address/0xaBEf652195F98A91E490f047A5006B71c85f058d) | [Gnosis Bridge](https://bridge.gnosischain.com/) |
| <img src="/img/logos/polygon.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Polygon**     | [0xc4Ce1D6F5D98D65eE25Cf85e9F2E9DcFEe6Cb5d6](https://polygonscan.com/address/0xc4Ce1D6F5D98D65eE25Cf85e9F2E9DcFEe6Cb5d6) | [Polygon Bridge](https://wallet.polygon.technology/) |
| <img src="/img/logos/xlayer.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **X-Layer**     | [0xda8f4eb4503acf5dec5420523637bb5b33a846f6](https://www.okx.com/web3/explorer/xlayer/address/0xda8f4eb4503acf5dec5420523637bb5b33a846f6) | [X-Layer Bridge](https://www.okx.com/xlayer/bridge) |


---


## <img src="/img/logos/scrvusd.svg" alt="CRV" style={{height: '1.3em', verticalAlign: 'middle'}} /> scrvUSD (Savings-crvUSD)

Savings crvUSD (scrvUSD) was first introduced in November 2024 on Ethereum.

[Understanding scrvUSD](../crvusd/scrvusd.md)

*Despite being launched on Ethereum, scrvUSD can be bridged to various chains:*

| Chain                         | crvUSD Token Address | Official Bridge |
| ----------------------------- | :------------------: | :-------------: |
| <img src="/img/logos/ethereum.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Ethereum** | [0x0655977FEb2f289A4aB78af67BAB0d17aAb84367](https://etherscan.io/address/0x0655977FEb2f289A4aB78af67BAB0d17aAb84367) | - |
| <img src="/img/logos/optimism.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Optimism** | [0x289f635106d5b822a505b39ac237a0ae9189335b](https://optimistic.etherscan.io/address/0x289f635106d5b822a505b39ac237a0ae9189335b) | [Superbridge](https://superbridge.app/base) |
| <img src="/img/logos/base.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Base** | [0x646a737b9b6024e49f5908762b3ff73e65b5160c](https://basescan.org/address/0x646a737b9b6024e49f5908762b3ff73e65b5160c) | [Superbridge](https://superbridge.app/base) |
| <img src="/img/logos/fraxtal.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Fraxtal** | [0xaB94C721040b33aA8b0b4D159Da9878e2a836Ed0](https://fraxscan.com/address/0xaB94C721040b33aA8b0b4D159Da9878e2a836Ed0) | [Superbridge](https://superbridge.app/base) |
| <img src="/img/logos/fantom.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Fantom** | [`0x5191946500e75f0A74476F146dF7d386e52961d9`](https://ftmscout.com/address/0x5191946500e75f0A74476F146dF7d386e52961d9) | [Guide here](./bridging-curve-eco-tokens.md) |
| <img src="/img/logos/bsc.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **BSC** | [`0x0094Ad026643994c8fB2136ec912D508B15fe0E5`](https://bscscan.com/address/0x0094Ad026643994c8fB2136ec912D508B15fe0E5) | [Guide here](./bridging-curve-eco-tokens.md) |
| <img src="/img/logos/avalanche.svg" alt="CRV" style={{height: '1.2em', verticalAlign: 'middle'}} /> **Avalanche** | [`0xA3ea433509F7941df3e33857D9c9f212Ad4A4e64`](https://snowscan.xyz/address/0xA3ea433509F7941df3e33857D9c9f212Ad4A4e64) | [Guide here](./bridging-curve-eco-tokens.md) |
