

# StableSwap-NG: Overview 
:::deploy[Contract Source & Deployment]


Source code is available on [ GitHub](https://github.com/curvefi/stableswap-ng). The following documentation covers source code up until commit number [`5f582a6`](https://github.com/curvefi/stableswap-ng/commit/5f582a6b8f709d863825c5fbe026cd3b4fa2d840).

All stableswap-ng deployments can be found in the "Deployment Addresses" section. [↗](../../references/deployed-contracts.md#stableswap-ng)


:::

For an in-depth understanding of the StableSwap invariant design, please refer to the official [StableSwap whitepaper](../../assets/pdf/whitepaper_stableswap.pdf).


---


**The Stableswap-NG AMM infrastructure represents a technically enhanced iteration of the previous stableswap implementation. It comprises the following key components:**

-    **AMM Blueprint Contracts**---

    *Stableswap-NG has two main implementations:*

    - **Plain Pools**[↗](./pools/plainpool.md)
    - **Metapools**[↗](./pools/metapool.md)

    The **admin controls**for pools are documented separately. [↗](./pools/admin_controls.md)


-    **Pool and Gauge Factory**---

    The Pool Factory is used to **permissionlessly deploy new plain and metapools**, as well as **liquidity gauges**. It also acts as a registry for finding the deployed pools and querying information about them.

    [→ `CurveStableSwapFactoryNG.vy`](../../factory/stableswap-ng/overview.md)

-    **Math Contract**---

    Contract which provides **mathematical utilities**for the AMM blueprint contracts.

    [→ `CurveStableSwapNGMath.vy`](./utility_contracts/math.md)

-    **Views Contract**---

    Contract targeted at **integrators**. Contains **view-only external methods**for the AMMs.

    [→ `CurveStableSwapNGViews.vy`](./utility_contracts/views.md)

-    **Liquidity Gauge Blueprint Contract**---

    A liquidity gauge blueprint implementation which deploys a liquidity gauge of a pool on Ethereum. Gauges on sidechains must be deployed via the `RootChainGaugeFactory`.

-    **Oracles**---

    Exponential moving-average oracles for the `D` invariant and for the prices of coins within the AMM.

    [→ `Oracles`](./pools/oracles.md)
