---
id: deposit
title: Depositing Assets
sidebar_label: Depositing Assets
---

import ThemedImage from '@theme/ThemedImage';

## Select a Market

The UI provides a granular filter system to help you find the right lending market for your assets. Lending markets labled with the "Mint" can't be supplied to.

<figure>
<ThemedImage
    alt="Lending markets overview"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/supply/deposit/overview-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/supply/deposit/overview-dark.png').default,
    }}
    style={{ width: '900px', display: 'block', margin: '0 auto' }}
/>
</figure>

When hovering over the supply rate, a tooltip will appear explaining the composition of the total rate (base yield, CRV emissions, etc.).

<figure>
<ThemedImage
    alt="Supply rate tooltip breakdown"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/supply/deposit/tooltip-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/supply/deposit/tooltip-dark.png').default,
    }}
    style={{ width: '250px', display: 'block', margin: '0 auto' }}
/>
</figure>

## Depositing Assets

Input the amount of assets you wish to deposit. If this is your first time interacting with this market, you will need to sign two transactions:

1. **Approve tokens** - Allow the contract to access your tokens
2. **Deposit tokens** - Transfer your tokens into the lending market

<figure>
<ThemedImage
    alt="Deposit interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/supply/deposit/deposit-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/supply/deposit/deposit-dark.png').default,
    }}
    style={{ width: '250px', display: 'block', margin: '0 auto' }}
/>
</figure>

The UI displays important information including:
- **Expected vault shares** - Represent your ownership of lent assets
- **Lending APR** - The rate you will earn on your assets
- **Estimated transaction fee** - Gas cost for the transaction

## Staking Vault Shares

If the lending market offers additional rewards, you can earn them by staking your vault shares. Unstaked shares only earn the base supply rate.

To stake your assets:
1. Switch to the **Stake** tab
2. Set the amount of vault shares to stake
3. Confirm the transaction

After staking, your position will start earning extra rewards like CRV emissions. Learn how to claim rewards in the [Claiming Rewards](/user/llamalend/guides/supply/claim-rewards) guide.

<figure>
<ThemedImage
    alt="Staking interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/supply/deposit/stake-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/supply/deposit/stake-dark.png').default,
    }}
    style={{ width: '250px', display: 'block', margin: '0 auto' }}
/>
</figure>

## Position Overview

Your lending position displays key information including:
- **Current supply rate** - The APR you're currently earning
- **Amount supplied** - Total assets deposited in the market
- **Total vault shares** - Your ownership stake in the lending pool

<figure>
<ThemedImage
    alt="Position overview dashboard"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/supply/deposit/position-overview-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/supply/deposit/position-overview-dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
/>
</figure>