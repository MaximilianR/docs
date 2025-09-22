---
id: revenue
title: Claiming veCRV Revenue Share
sidebar_label: Claiming veCRV Revenue Share
---

import ThemedImage from '@theme/ThemedImage';
import RevenueStats from '@site/src/components/RevenueStats';

Holding veCRV not only gives you voting power in Curve governance, but also entitles you to a share of protocol revenue.

## How is Revenue Generated?

Curve collects fees from several sources:

- **Trading fees:** Every time users swap tokens on Curve, a portion of the trading fee is going to veCRV holders.
- **crvUSD interest:** Parts of the interest accrued from Curve’s stablecoin (crvUSD) markets is distributed to veCRV holders.

## How is Revenue Distributed?

All collected fees are converted to crvUSD and distributed among veCRV holders. The amount you receive depends on your veCRV balance relative to the total veCRV supply at the time of distribution. The more veCRV you hold, the larger your share of the revenue.

Rewards are distributed on a weekly basis and can be claimed each week within 24hrs after Thursday 00:00 UTC.

## Claiming Eligibility

Before you can claim veCRV revenue, you need to meet the following criteria:

1.  **Have veCRV (locked CRV) in your wallet.**
    If you hold tokens from 'liquid lockers' (like cvxCRV, sdCRV, or yCRV), these are derivatives of veCRV. You'll need to claim your revenue through that specific project's website. If you don't have veCRV, see the guide on how to lock CRV here: [Guide: Locking CRV](../vecrv/how-to-lock.md).

2.  **You've held veCRV through a full revenue week (Thursday 00:00 UTC to Thursday 00:00 UTC).**
    Curve distributes revenue based on weekly snapshots. If you acquire veCRV on a Friday, for example, your first claim will be available roughly 13 days later.

## How to Claim Your Revenue

Users can claim their rewards in the dashboard here: [Curve Dashboard](https://www.curve.finance/dex/ethereum/dashboard/)

Simply connect your wallet and claim your rewards by clicking the blue "Claim crvUSD" button. The rewards will be sent directly to your wallet. The rewards do not need to claimed on a weekly basis as all rewards accure and can be claimed at any point in time without forfeiting any rewards.

If you have claimable revenue, it will be visible as shown below:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Claim Revenue UI"
    sources={{
      light: require('@site/static/img/ui/dashboard/claim-revenue-light.png').default,
      dark: require('@site/static/img/ui/dashboard/claim-revenue-dark.png').default,
    }}
    style={{
      maxWidth: '400px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

:::info 3CRV as the original reward token
    Before the DAO decided to have crvUSD as the reward token (June 20th, 2024), revenue was distributed using the 3CRV token which is the LP tokens of DeFi's biggest stablecoin pool (3pool).
:::

:::info Consider Re-locking CRV
    Remember that your veCRV balance, and thus your rewards, are affected by how long is left on your CRV lock. Consider [re-locking your CRV](../vecrv/what-is-vecrv.md) to maintain your rewards.
:::

## Revenue Stats

All veCRV metrics and revenue stats can be viewed on the [analytics page](https://www.curve.finance/dao/ethereum/analytics/).



<figure>
<ThemedImage
    alt="Weekly gauge weight cycle showing the voting and distribution timeline"
    sources={{
        light: require('@site/static/img/user/vecrv/vecrv_analytics_light.png').default,
        dark: require('@site/static/img/user/vecrv/vecrv_analytics_dark.png').default,
    }}
    style={{ width: '700px', display: 'block', margin: '0 auto' }}
/>
</figure>
