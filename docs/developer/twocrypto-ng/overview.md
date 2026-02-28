import DocCard, { DocCardGrid } from '@site/src/components/DocCard'

The **Twocrypto-NG contract infrastructure** represents an **optimized version of Curve Finance Crypto pools**.

:::deploy[Contract Source & Deployment]

Source code is available on [GitHub](https://github.com/curvefi/twocrypto-ng).


:::

---


**The AMM infrastructure involves the following parts:**

<DocCardGrid>
  <DocCard title="AMM Blueprint Contracts" link="./pools/twocrypto" linkText="CurveTwocryptoOptimized.vy">

The AMM is a **2-coin, auto-rebalancing Cryptoswap implementation** (version 2.0.0) with several optimizations. Unlike the older version, the **pool contract is an ERC20-compliant LP token**. The AMMs have a hardcoded `ADMIN_FEE`, set to 50% of the earned profits.

  </DocCard>
  <DocCard title="CurveTwocryptoFactory.vy" icon="vyper" link="../../factory/twocrypto-ng/overview" linkText="CurveTwocryptoFactory.vy">

The Factory allows the permissionless deployment of liquidity pools and gauges. It can accommodate **multiple blueprints of the AMM** contract. The admin can implement parameter changes, change the fee recipient, and upgrade implementations.

  </DocCard>
  <DocCard title="Views Contract" link="./utility-contracts/views" linkText="CurveCryptoViews2Optimized.vy">

Contains **view methods relevant for integrators** and users. The address of the deployed Views contract is stored in the Factory and is upgradeable by the Factory's admin.

  </DocCard>
  <DocCard title="Math Contract" link="./utility-contracts/math" linkText="CurveCryptoMathOptimized2.vy">

A contract which contains different **math functions used in the AMM**.

  </DocCard>
  <DocCard title="Liquidity Gauge Blueprint">

A liquidity gauge blueprint contract which deploys a liquidity gauge of a pool on Ethereum. On sidechains, gauges need to be deployed via the [`RootChainGaugeFactory`](../../gauges/xchain-gauges/root-gauge-factory.md).

  </DocCard>
</DocCardGrid>
