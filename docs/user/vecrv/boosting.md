---
id: boosting
title: Boosting CRV Rewards
sidebar_label: Boosting Rewards
---

import ThemedImage from '@theme/ThemedImage';
import ButtonGrid from '@site/src/components/ButtonGrid';

# Boosting CRV Rewards

:::info Prerequisites
This guide assumes you have already provided liquidity and are currently staking LP tokens on the DAO gauge. If you haven't done this yet, see our [DEX liquidity provision guide](../dex/liquidity.md) or [Llamalend supplying guide](../llamalend/supplying.md).
:::

One of the main incentives for holding CRV is the ability to boost rewards on provided liquidity. By locking CRV for veCRV, you not only gain voting power in the DAO and revenue share, but also earn a boost of up to **2.5x** on your liquidity rewards across Curve pools and lending markets.

## How Rewards Are Displayed

In Curve's interface, rewards are always displayed as a range showing the difference between unboosted rewards (for regular liquidity providers) and maximum boosted rewards (for veCRV holders). This range helps you understand the potential value of holding veCRV.

<figure>
<ThemedImage
    alt=""
    sources={{
        light: require('@site/static/img/user/vecrv/range_light.png').default,
        dark: require('@site/static/img/user/vecrv/range_dark.png').default,
    }}
    style={{ width: '300px', display: 'block', margin: '0 auto' }}
/>
</figure>

:::warning Important Note
Only **CRV rewards** are boosted by veCRV. External reward tokens (like tokens from other protocols) are distributed solely based on your liquidity share and are not affected by veCRV holdings.
:::

## Step 1: Calculate Required veCRV

The first step to getting rewards boosted is to determine how much veCRV you need. Each gauge has different requirements, meaning some pools are easier to boost than others. This depends on:
- The amount of veCRV others have locked
- The total value locked (TVL) in the gauge
- Your own liquidity position

Use the [boost calculator](https://dao-old.curve.finance/minter/calc) to determine your specific requirements:

<ButtonGrid buttonKeys={['boostCalculator']} />

## Step 2: Lock CRV for veCRV

After determining how much veCRV you need, visit the [CRV Locker](https://curve.fi/dao/ethereum/vecrv/create/) to create your lock. For detailed instructions on locking CRV, see [Locking CRV & Managing Locks](./how-to-lock.md).


## Step 3: Check Your Boost

After creating your lock, proceed to the desired pool page and click on **Your Details** as shown below. Under this tab you can see your current rewards boost.

<figure>
<ThemedImage
    alt="Weekly gauge weight cycle showing the voting and distribution timeline"
    sources={{
        light: require('@site/static/img/user/vecrv/boost_light.png').default,
        dark: require('@site/static/img/user/vecrv/boost_dark.png').default,
    }}
    style={{ width: '500px', display: 'block', margin: '0 auto' }}
/>
</figure>

### Troubleshooting Boost Updates

- ✅ **If the new boost is visible** after **'Current boost:'**, then no further action is required.
- ⚠️ **If the current boost hasn't updated**, try claiming CRV from each of the gauges where you have liquidity. This should trigger the boost update.

:::info Boost Update Timing
Boosts are only updated when you make a withdrawal, deposit, or claim from a liquidity gauge. This is why claiming rewards can help refresh your boost display.
:::

## How the Boost Formula Works

Your boost multiplier can be between 1 and 2.5.  This means if you have a 2.5x boost and deposit \$10,000, your rewards are calculated as if you deposited $25,000.  It depends on the following factors:

    * **Your veCRV balance:** More veCRV means a higher potential boost.
    * **The amount of liquidity you provide:** Your boost is calculated relative to your liquidity.
    * **The total veCRV and liquidity in the gauge:** The boost mechanism balances your veCRV power against everyone else's in the Pool or Lending market's gauge.

By boosting, you're essentially getting a larger share of the new CRV tokens distributed. This incentivizes users to lock CRV, which in turn strengthens the Curve DAO's governance and promotes long-term alignment with the protocol.

### The Boost Formula

$$
B = \min\left(2.5, 0.4 + 2.5 \times \frac{\text{veCRV}_\text{user}}{\text{veCRV}_\text{total}} \times \frac{\text{Value}_\text{pool}}{\text{Value}_\text{user}}\right)
$$

**Formula Variables:**

- **$B$** = Your rewards boost (capped at 2.5x maximum)
- **$\text{Value}_\text{user}$** = Your deposited value in USD
- **$\text{Value}_\text{pool}$** = Total value in the pool's reward gauge in USD
- **$\text{veCRV}_\text{user}$** = Your veCRV amount (vote weight)
- **$\text{veCRV}_\text{total}$** = Total veCRV in the system ([check current amount](https://dao-old.curve.finance/minter/calc))
