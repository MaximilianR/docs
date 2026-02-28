import DocCard, { DocCardGrid } from '@site/src/components/DocCard'

# Stableswap-NG: Overview
:::deploy[Contract Source & Deployment]


Source code is available on [ GitHub](https://github.com/curvefi/stableswap-ng). The following documentation covers source code up until commit number [`5f582a6`](https://github.com/curvefi/stableswap-ng/commit/5f582a6b8f709d863825c5fbe026cd3b4fa2d840).

All stableswap-ng deployments can be found in the "Deployment Addresses" section. [↗](../../deployments.md)


:::

For an in-depth understanding of the Stableswap invariant design, please refer to the official [Stableswap whitepaper](../../assets/pdf/whitepaper_stableswap.pdf).


---


**The Stableswap-NG AMM infrastructure represents a technically enhanced iteration of the previous stableswap implementation. It comprises the following key components:**

<DocCardGrid>
  <DocCard title="AMM Blueprint Contracts" link="./pools/plainpool" linkText="Plain Pools">

Stableswap-NG has two main implementations: [**Plain Pools**](./pools/plainpool.md) and [**Metapools**](./pools/metapool.md). The admin controls for pools are documented [separately](./pools/admin-controls.md).

  </DocCard>
  <DocCard title="CurveStableSwapFactoryNG.vy" icon="vyper" link="../../factory/stableswap-ng/overview" linkText="CurveStableSwapFactoryNG.vy">

The Pool Factory is used to **permissionlessly deploy new plain and metapools**, as well as **liquidity gauges**. It also acts as a registry for finding the deployed pools and querying information about them.

  </DocCard>
  <DocCard title="CurveStableSwapNGMath.vy" icon="vyper" link="./utility-contracts/math" linkText="CurveStableSwapNGMath.vy">

Contract which provides **mathematical utilities** for the AMM blueprint contracts.

  </DocCard>
  <DocCard title="CurveStableSwapNGViews.vy" icon="vyper" link="./utility-contracts/views" linkText="CurveStableSwapNGViews.vy">

Contract targeted at **integrators**. Contains **view-only external methods** for the AMMs.

  </DocCard>
  <DocCard title="Liquidity Gauge Blueprint">

A liquidity gauge blueprint implementation which deploys a liquidity gauge of a pool on Ethereum. Gauges on sidechains must be deployed via the `RootChainGaugeFactory`.

  </DocCard>
  <DocCard title="Oracles" link="./pools/oracles" linkText="Oracles">

Exponential moving-average oracles for the `D` invariant and for the prices of coins within the AMM.

  </DocCard>
</DocCardGrid>
