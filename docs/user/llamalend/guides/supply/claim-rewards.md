---
id: claim-rewards
title: Claiming Rewards
sidebar_label: Claiming Rewards
---

import ThemedImage from '@theme/ThemedImage';

Rewards can only be claimed if the lending market offers additional rewards like CRV emissions or other external rewards. The base rate for lending assets is automatically accrued and reflected in the increasing value of your vault shares - over time, you'll be able to withdraw more assets than you originally deposited.

To claim rewards:
1. Navigate to the market you want to claim from
2. Go to the **Claim Rewards** tab under **Withdraw**
3. Confirm the transaction

<figure>
<ThemedImage
    alt="Claim rewards interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/supply/claim-rewards/rewards-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/supply/claim-rewards/rewards-dark.png').default,
    }}
    style={{ width: '400px', display: 'block', margin: '0 auto' }}
/>
</figure>

:::tip Important
If you plan to claim rewards before withdrawing all your assets from the market, make sure to unstake the assets first to avoid leaving any dust rewards behind.
:::