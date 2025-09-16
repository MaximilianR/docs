---
id: liquidation
title: What to Do During Liquidation
sidebar_label: Loan in Liquidation
---

import ThemedImage from '@theme/ThemedImage';

If your loan enters liquidation protection, you have more time and flexibility to act. You have two main options:

- **Close your loan**: Stop further losses by closing the position
- **Keep your loan open**: Monitor your health closely to avoid reaching 0%

## Close Your Loan

You can close your loan in two ways:

- **Repay your full debt**: [See how to do that here.](./open-and-close.md#fully-repaying)
- **Self-liquidate**: Only available when in liquidation range. Closes your position without liquidation penalty.

## How to Get Out of Liquidation Protection

**Important**: You cannot exit liquidation protection by repaying debt, because the liquidation range does not move when actions happen in liquidation (see the [loan management table](./loan-management.md#loan-management-overview)).

You can only get out of liquidation protection by:

1. **Repay the full loan and create a new one**
2. **Wait for price recovery**: If the collateral price moves above or below the liquidation range, you'll exit liquidation protection

:::warning Monitor Your Health
Watch your health closely - if it reaches 0%, your loan will be fully liquidated.
:::

## Keep Your Loan Open

If you choose to keep your position open, monitor your loan health closely to avoid reaching 0%.

Use the [Llamalend Telegram bot](https://news.curve.fi/llamalend-telegram-bot/) to track your loan health and receive alerts.

<figure>
<ThemedImage
    alt="Telegram monitoring bot"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/open-close/monitor_bot.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/open-close/monitor_bot.png').default,
    }}
    style={{ width: '400px', display: 'block', margin: '0 auto' }}
/>
</figure>
