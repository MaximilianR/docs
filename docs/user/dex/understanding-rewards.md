---
id: understanding-rewards
title: Understanding Rewards
sidebar_label: Understanding Rewards
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';

One of the primary ways to earn yield on Curve is by providing liquidity to a pool. When you deposit your assets, you become a liquidity provider (LP) and receive LP tokens in return. These tokens represent your share of the pool and are your key to earning rewards.

This page explains the different types of rewards you can earn and how they are displayed on the pool page.  However, if you're looking for a guide on how to claim your earned rewards, see below.

If you are just looking for how to claim your earned CRV or other token rewards, see the guide below.

<GuideCardGrid guideKeys={['howToDexClaim']} />

---

## How Rewards Are Displayed

Let's look at the standard pools overview page to understand the rewards you can earn.

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Pools Overview"
    sources={{
      light: require('@site/static/img/ui/dex/dex-rewards-light.png').default,
      dark: require('@site/static/img/ui/dex/dex-rewards-dark.png').default,
    }}
    style={{
      maxWidth: '800px',
      width: '100%',
      height: 'auto',
      border: '1px solid var(--Layer-2-Outline)',
    }}
  />
  <figcaption></figcaption>
</figure>

Here is a breakdown of the reward types shown in the UI:

1.  **Base vAPY (Trading Fees & Underlying Yield)**: This is the foundational yield you earn simply by holding a pool's LP tokens. It is composed of:

      * **Trading Fees:** A share of the fees from all swaps in the pool. (e.g., 1a - USDC/USDT pool)
      * **Underlying Yield (if applicable):** Some pools contain yield-bearing tokens (e.g., stETH, sUSDS). The interest from these assets is also included in the Base vAPY (e.g., 1b - ETH/stETH pool).

    The figure shown is a variable Annual Percentage Yield (vAPY) based on the pool's recent daily activity (weekly figure shown on hover). It autocompounds, meaning the value of your deposits grows in value automatically over time.

2.  **CRV Rewards**: Many pools offer additional rewards in the form of CRV tokens. To earn these, you must stake your LP tokens in the pool's gauge. The reward rate is shown as a range, as your earnings can be boosted by your [veCRV balance](https://www.google.com/search?q=../vecrv/boosting.md).

3.  **Other Token Rewards**: Partner projects may provide their own tokens as extra incentives for liquidity providers. Like CRV, these rewards require you to stake your LP tokens in the gauge, however these can't be boosted.

4.  **Points**: Some pools feature Points programs, which may qualify you for future benefits or airdrops. The requirements for earning points vary by project, so always check the specific details for each pool.

### What is a Gauge?

As mentioned above, a "gauge" is a smart contract where you stake your LP tokens to earn additional rewards like CRV and other tokens. Gauges are designed to distribute these reward tokens to LPs over time, incentivizing liquidity for specific pools.

Stakers accrue rewards in the gauge over time and can be claimed whenever they like.

### Summary: How to Earn Different Rewards

This table provides an at-a-glance summary of how to earn each type of reward.

| Action Required                  | Earn Base vAPY    | Earn CRV Rewards | Earn Other Token Rewards | Earn Points        |
|----------------------------------|-------------------|------------------|--------------------------|--------------------|
| Deposit to Pool (Hold LP Tokens) | ✅                 | ❌                | ❌                        | ❓\* |
| Stake LP Tokens in Gauge         | ✅                 | ✅                | ✅                        | ❓\* |
| **Reward Mechanism** | **Autocompounds** | **Must be Claimed** | **Must be Claimed** | ❓\* |

*\*Points programs have unique criteria; some reward for depositing, others for staking. Always check the specific pool's requirements.*

---

## Earning Rewards

### Depositing to Pool

When you deposit your assets into a pool, you receive LP tokens.  These tokens immediately begin earning the **Base vAPY**, which automatically compounds and increases the value of your LP tokens over time. You don't need to do anything else to earn this base yield.

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Depositing and Earning Rewards"
    sources={{
      light: '/img/user/dex/dex-depositing-light.svg',
      dark: '/img/user/dex/dex-depositing-dark.svg',
    }}
    style={{
      maxWidth: '700px',
      width: '100%',
      height: 'auto',
      border: '1px solid var(--Layer-2-Outline)',
    }}
  />
  <figcaption></figcaption>
</figure>

### Staking LP Tokens in a Gauge

To earn additional rewards like **CRV** or **Other Tokens**, you must complete the extra step of staking your LP tokens in the pool's gauge. Once staked, you will begin accumulating these rewards, which you can claim at your convenience from the pool's "Claim" section.

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Staking and Earning Rewards"
    sources={{
      light: '/img/user/dex/dex-staking-light.svg',
      dark: '/img/user/dex/dex-staking-dark.svg',
    }}
    style={{
      maxWidth: '700px',
      width: '100%',
      height: 'auto',
      border: '1px solid var(--Layer-2-Outline)',
    }}
  />
  <figcaption></figcaption>
</figure>
