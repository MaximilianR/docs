---
id: deploy-stableswap
title: "Deploying a Stableswap Pool"
sidebar_label: "Deploying a Stableswap Pool"
---

import ThemedImage from '@theme/ThemedImage';

The Stableswap pool creation is appropriate for assets expected to hold a price peg very close to each other, like a pair of dollarcoins. The creation wizard will guide you through the process of creating a pool, but if you have questions throughout you are encouraged to speak with a member of the Curve team in the [**Telegram**](https://t.me/curvefi) or [**Discord**](https://discord.gg/rgrfS7W).

Stableswap pools are liquidity pools containing **up to eight tokens** using the StableSwap algorithm (Curve V1). For a better understanding of StableSwap, please see here: [**Understanding Curve Pools**](../pools/overview.md).

## **Step 1: Choose Pool Type**

Make sure your wallet is connected (top right corner) and your network is set to the chain where you want to deploy the pool. Curve supports pool deployment on all networks where Curve is live — just switch chains in your wallet, and the UI will follow automatically.

Select Stableswap as the pool type. This is used for assets that should maintain the same value — such as stablecoins (USDC, DAI, USDT), liquid staking tokens (ETH/stETH), or yield-bearing versions of pegged assets.

<figure>
  <ThemedImage
    alt="Standard ERC20"
    sources={{
      light: require('@site/static/img/protocol/deploy-pool/pool_type_light.png').default,
      dark: require('@site/static/img/protocol/deploy-pool/pool_type_dark.png').default,
    }}
    style={{ 
      width: "500px",
      display: "block",
      margin: "0 auto"
    }}
  />
  <figcaption></figcaption>
</figure>

## **Step 2: Select Tokens**

In this step, you'll define which assets your pool will support. The interface allows you to choose **between two and eight tokens**, with support for standard **ERC-20s, tokens using oracles, rebasing assets, and ERC‑4626 vault tokens**.

To add a metapool, simply tick on "View Metapools" when selecting a the token and choose one of the metapools from that list.


<figure>
  <ThemedImage
    alt="Standard ERC20"
    sources={{
      light: require('@site/static/img/protocol/deploy-pool/tokens_in_pool_light.png').default,
      dark: require('@site/static/img/protocol/deploy-pool/tokens_in_pool_dark.png').default,
    }}
    style={{ 
      width: "600px",
      display: "block",
      margin: "0 auto"
    }}
  />
  <figcaption></figcaption>
</figure>


*For the AMM to function correctly, the appropriate asset type needs to be chosen when selecting the assets. The following asset types are supported:*

- ### Standard (ERC‑20)

  For most ERC‑20 tokens, no additional configuration is needed. Simply select the token and leave all type boxes unchecked.

  :::warning ERC‑20 Token Safety
  Curve contracts cannot detect malicious or non‑standard ERC‑20 behavior. Double-check that tokens do not charge transfer fees or use reentrancy tricks.
  :::

  <figure>
    <ThemedImage
      alt="Standard ERC20"
      sources={{
        light: require('@site/static/img/protocol/deploy-pool/standard_light.png').default,
        dark: require('@site/static/img/protocol/deploy-pool/standard_dark.png').default,
      }}
      style={{ 
        width: "500px",
        display: "block",
        margin: "0 auto"
      }}
    />
    <figcaption></figcaption>
  </figure>

- ### Oracle-Based Tokens

  Check the **Oracle** box if a token requires an external price feed. You'll be asked to enter:
  - The oracle contract address
  - The function name used to return the rate (e.g. `getExchangeRate()`)

  This is common for wrapped or staked tokens like rETH, where the rate against the underlying asset must be tracked.

  :::warning Oracle Requirements
  - The oracle function must return a value with **1e18 precision**
  - Oracles may be externally controlled (e.g. by an EOA), so proceed with caution
  :::

  <figure>
    <ThemedImage
      alt="Oracle"
      sources={{
        light: require('@site/static/img/protocol/deploy-pool/oracle_light.png').default,
        dark: require('@site/static/img/protocol/deploy-pool/oracle_dark.png').default,
      }}
      style={{ 
        width: "500px",
        display: "block",
        margin: "0 auto"
      }}
    />
    <figcaption></figcaption>
  </figure>

  <figure>
    <ThemedImage
      alt="Oracle Input"
      sources={{
        light: require('@site/static/img/protocol/deploy-pool/oracle_input_light.png').default,
        dark: require('@site/static/img/protocol/deploy-pool/oracle_input_dark.png').default,
      }}
      style={{ 
        width: "500px",
        display: "block",
        margin: "0 auto"
      }}
    />
    <figcaption></figcaption>
  </figure>

- ### Rebasing Tokens

  Enable the **Rebasing** option for tokens whose balances adjust automatically (e.g. stETH). These behave differently from standard ERC‑20s and require special handling in the AMM.

  :::warning Rebasing Support
  Make sure you understand how rebasing affects pool math and accounting. Unexpected results can occur if treated as a standard token.
  :::

  <figure>
    <ThemedImage
      alt="Rebasing"
      sources={{
        light: require('@site/static/img/protocol/deploy-pool/rebasing_light.png').default,
        dark: require('@site/static/img/protocol/deploy-pool/rebasing_dark.png').default,
      }}
      style={{ 
        width: "500px",
        display: "block",
        margin: "0 auto"
      }}
    />
    <figcaption></figcaption>
  </figure>

- ### ERC‑4626 Vault Tokens

  Select **ERC‑4626** for tokens that follow the yield-bearing vault standard (e.g. Yearn, Beefy). These represent shares of an underlying asset and must be handled accordingly by the pool.

  :::warning ERC‑4626 Caveats
  Some ERC‑4626 implementations may be vulnerable to donation/inflation exploits. Only use well-audited and battle-tested vaults.
  :::

  <figure>
    <ThemedImage
      alt="ERC-4626"
      sources={{
        light: require('@site/static/img/protocol/deploy-pool/erc4626_light.png').default,
        dark: require('@site/static/img/protocol/deploy-pool/erc4626_dark.png').default,
      }}
      style={{ 
        width: "500px",
        display: "block",
        margin: "0 auto"
      }}
    />
    <figcaption></figcaption>
  </figure>

Once you've selected and configured all your tokens, click **Next →** to continue to the pool parameters.

## **Step 3: Set Pool Parameters**

You can choose a preset configuration or switch to advanced mode to fine-tune the pool's behavior.

<figure>
  <ThemedImage
    alt="Parameters"
    sources={{
      light: require('@site/static/img/protocol/deploy-pool/parameters_light.png').default,
      dark: require('@site/static/img/protocol/deploy-pool/parameters_dark.png').default,
    }}
    style={{ 
      width: "500px",
      display: "block",
      margin: "0 auto"
    }}
  />
  <figcaption></figcaption>
</figure>

### Preset Options

The UI offers three default parameter sets optimized for typical use cases. These are great starting points if you're unsure what values to use.

<figure>
  <ThemedImage
    alt="Presets"
    sources={{
      light: require('@site/static/img/protocol/deploy-pool/presets_light.png').default,
      dark: require('@site/static/img/protocol/deploy-pool/presets_dark.png').default,
    }}
    style={{ 
      width: "500px",
      display: "block",
      margin: "0 auto"
    }}
  />
  <figcaption></figcaption>
</figure>

You can use these as-is or switch to **Advanced** mode to adjust parameters manually.

### Advanced Parameters

To choose your own parameters, simply toggle on the "Advanced" toggle:

<figure>
  <ThemedImage
    alt="Advanced Parameters"
    sources={{
      light: require('@site/static/img/protocol/deploy-pool/presets_advanced_light.png').default,
      dark: require('@site/static/img/protocol/deploy-pool/presets_advanced_dark.png').default,
    }}
    style={{ 
      width: "500px",
      display: "block",
      margin: "0 auto"
    }}
  />
  <figcaption></figcaption>
</figure>

| Parameter                 | Range           | Description                                                                 |
|--------------------------|------------------|-----------------------------------------------------------------------------|
| **Swap Fee**             | `0%` to `1%`     | Charged on each swap. Higher fees discourage arbitrage and low-volume trades. |
| **A (Amplification)**    | `1` to `5,000`   | Controls price stability near the peg. Higher = flatter curve = deeper liquidity. |
| **Off-peg Fee Multiplier** | `0` to `12.5`   | Dynamically increases the fee when the pool becomes imbalanced. Try the [Desmos Simulator](https://www.desmos.com/calculator/zhrwbvcipo) to visualize how this works. |
| **Moving Average Time**  | `60` to `3600s`  | Smooths the oracle price over time to reduce short-term volatility. |

Once you're satisfied with the parameter settings, click **Next →** to continue.

## **Step 4: Enter Pool Info**

After configuring your parameters, you’ll be prompted to set the **Pool Name** and **Pool Symbol**.

These values will be used as the ERC‑20 metadata for the pool’s LP token and will appear in block explorers and in the Curve UI.

- **Pool Name** – A human-readable label for the pool (e.g. `USDC/DAI/USDT Stable`)
- **Pool Symbol** – The LP token symbol (e.g. `3CRV`, `sUSDeCRV`, `bUSD3CRV`)

<figure>
  <ThemedImage
    alt="Oracle Input"
    sources={{
      light: require('@site/static/img/protocol/deploy-pool/pool_info_light.png').default,
      dark: require('@site/static/img/protocol/deploy-pool/pool_info_dark.png').default,
    }}
    style={{ 
      width: "500px",
      display: "block",
      margin: "0 auto"
    }}
  />
  <figcaption></figcaption>
</figure>

> 💡 **Tip:** Use short, clear names that reflect the assets in the pool. For metapools, it’s common to include the base pool symbol (e.g. `sDAI3CRV` for a sDAI/3CRV pool). These fields are immutable after deployment — double-check for typos.

## **Step 5: Deploy the Pool**

Before deploying, review all your settings in the **Summary panel** on the right. This includes:

- Selected tokens and their types
- Pool parameters (Swap Fee, A, etc.)
- Pool name and symbol

Once everything looks correct, click the blue **Create Pool** button at the bottom of the page. Your wallet will prompt you to approve the transaction.

<figure>
  <ThemedImage
    alt="Pool Summary"
    sources={{
      light: require('@site/static/img/resource/pool_creation/ss_summary_light.png').default,
      dark: require('@site/static/img/resource/pool_creation/ss_summary_dark.png').default,
    }}
    style={{ width: "200px", display: "block", margin: "0 auto" }}
  />
</figure>

---

## **What to do after deployment**

✅ **Seed initial liquidity** — a pool with zero balance cannot process trades.  
✅ (Optional) **[Create a gauge](../reward-gauges/creating-a-pool-gauge.md)** to distribute CRV or other incentives to LPs.
