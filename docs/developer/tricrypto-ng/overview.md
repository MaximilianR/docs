import DocCard, { DocCardGrid } from '@site/src/components/DocCard'

# Tricrypto-NG Overview
:::deploy[Contract Source & Deployment]

Source code is available on [ GitHub](https://github.com/curvefi/tricrypto-ng). The following documentation covers source code up until commit number [`33707fc`](https://github.com/curvefi/tricrypto-ng/commit/33707fc8b84e08786acf184fcfdb744eb4657a99).

All tricrypto-ng deployments can be found in the "Deployment Addresses" section. [↗](../../deployments.md).


:::

For an in-depth understanding of the Cryptoswap invariant design, please refer to the official [Cryptoswap whitepaper](../../assets/pdf/whitepaper_cryptoswap.pdf).

---


**The Tricrypto-NG AMM infrastructure represents a technically enhanced iteration of the previous cryptoswap implementations. It comprises the following key components:**

<DocCardGrid>
  <DocCard title="CurveTricryptoOptimized.vy" icon="vyper" link="./pools/tricrypto" linkText="CurveTricryptoOptimized.vy">

The AMM is a **3-coin, auto-rebalancing Cryptoswap implementation** (version 2.0.0) with several optimizations. Unlike the older version, the **pool contract is an ERC20-compliant LP token**. Two implementations exist: one with **native transfers enabled** and one **disabled**.

  </DocCard>
  <DocCard title="CurveTricryptoFactory.vy" icon="vyper" link="../../factory/tricrypto-ng/overview" linkText="CurveTricryptoFactory.vy">

The Factory allows the permissionless deployment of liquidity pools and gauges. It can accommodate **multiple blueprints of the AMM** contract. Blueprints are specified by the user while deploying the pool.

  </DocCard>
  <DocCard title="CurveCryptoMathOptimized3.vy" icon="vyper" link="./utility-contracts/math" linkText="CurveCryptoMathOptimized3.vy">

A contract which contains different **math utility functions** used in the AMM.

  </DocCard>
  <DocCard title="CurveCryptoViews3Optimized.vy" icon="vyper" link="./utility-contracts/views" linkText="CurveCryptoViews3Optimized.vy">

Contains **view methods relevant for integrators** and users. The address of the deployed Views contract is stored in the Factory and is upgradeable by the Factory's admin.

  </DocCard>
  <DocCard title="Liquidity Gauge Blueprint">

A liquidity gauge blueprint implementation which deploys a liquidity gauge of a pool on Ethereum. Gauges on sidechains must be deployed via the [RootChainGaugeFactory](../../gauges/xchain-gauges/root-gauge-factory.md).

  </DocCard>
  <DocCard title="Price Oracles" link="./pools/oracles" linkText="Price Oracles">

Exponential moving-average oracles for the prices of coins within the AMM.

  </DocCard>
</DocCardGrid>
