# Pool Creation Overview

:::danger Liquidity Pool Risks
Each liquidity pool brings risks with it. Before using or creating any pools, please read the [**Risk Disclaimer**](../risks-security/risks/pool.md).
:::

[:logos-crv: `Pool Creation Interface`](https://curve.fi/#/ethereum/create-pool)

---

To get started, visit the [**`Pool Creation`**](https://curve.fi/#/ethereum/create-pool) tab at the top of the Curve homepage, and select whether you would like to create a "Stableswap Pool" (a pool with pegged assets, e.g., crvUSD &lt;&gt; USDT) or a "Cryptoswap Pool" (containing assets whose prices may be volatile, e.g., CRV &lt;&gt; ETH).

:::info
NG stands for New-Generation and represents enhanced and improved versions of prior implementations. All newly created pools are "new-generation pools".
:::

<div className="grid cards">

-   **Stableswap**

    ---

    *A pool for assets that are pegged to the same value, such as stablecoins or liquid staking derivatives.*

    [:material-link: **`Create a Stableswap Pool`**](./creating-a-stableswap-pool.md)

-   **Cryptoswap**

    ---

    *A pool for assets that may have volatile prices relative to each other.*

    [:material-link: **`Create a Cryptoswap Pool`**](./creating-a-cryptoswap-pool.md)

</div>

---

## Pool Creation Process

The process of creating a pool involves several steps:

1. **Select Pool Type**: Choose between Stableswap and Cryptoswap based on your assets.
2. **Choose Assets**: Select the tokens that will be in your pool.
3. **Set Parameters**: Configure the pool's parameters based on your assets' characteristics.
4. **Deploy Pool**: Deploy the pool to the blockchain.
5. **Add Liquidity**: Seed the pool with initial liquidity.
6. **Create Gauge**: Create a gauge to enable CRV emissions to your pool.

For detailed instructions on creating each type of pool, follow the links above.


