---
id: revenue
title: Claiming veCRV Revenue Share
sidebar_label: Claiming veCRV Revenue Share
---

import ThemedImage from '@theme/ThemedImage';
import RevenueStats from '@site/src/components/RevenueStats';

Holding veCRV not only gives you voting power in Curve governance, but also entitles you to a share of protocol revenue.

<RevenueStats />


## How is Revenue Generated?

Curve collects fees from several sources:

- **Trading fees:** Every time users swap tokens on Curve, a portion of the trading fee is going to veCRV holders.
- **crvUSD interest:** Parts of the interest accrued from Curve’s stablecoin (crvUSD) markets is distributed to veCRV holders.


## How is Revenue Distributed?

All collected fees are converted to crvUSD and distributed among veCRV holders. The amount you receive depends on your veCRV balance relative to the total veCRV supply at the time of distribution. The more veCRV you hold, the larger your share of the revenue.

Rewards are distributed on a weekly basis and can be claimed each week within 24hrs after Thursday 00:00 UTC.


## How to Claim Your Revenue

Users can claim their rewards in the dashboard here: [Curve Dashboard](https://www.curve.finance/dex/ethereum/dashboard/)

Simply connect your wallet and claim your rewards by clicking the blue "Claim crvUSD" button. The rewards will be sent directly to your wallet. The rewards do not need to claimed on a weekly basis as all rewards accure and can be claimed at any point in time without forfeiting any rewards.

<figure>
<ThemedImage
    alt="Weekly gauge weight cycle showing the voting and distribution timeline"
    sources={{
        light: require('@site/static/img/user/vecrv/dashboard_light.png').default,
        dark: require('@site/static/img/user/vecrv/dashboard_dark.png').default,
    }}
    style={{ width: '700px', display: 'block', margin: '0 auto' }}
/>
</figure>

:::info 3CRV as the original reward token
    Before the DAO decided to have crvUSD as the reward token, revenue was distributed using the 3CRV token which is the LP tokens of DeFi's biggest stablecoin pool (3pool).
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
