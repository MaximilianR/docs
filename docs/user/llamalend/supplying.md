---
id: supplying
title: Supplying
sidebar_label: Supplying
---

import ThemedImage from '@theme/ThemedImage';

Supplying assets means lending out your crypto assets to other users who can borrow them, earning interest in return.

## Why Supply to Llamalend?

Supplying assets to Llamalend allows you to earn yield on your crypto holdings by providing liquidity to borrowers. By depositing your assets into lending markets, you can generate passive income through interest payments from borrowers based on the borrow rate of the market.

Llamalend markets are **isolated markets**, meaning each market only has one collateral token and one borrowable token. This design keeps risk contained within each market, making supplying assets more comfortable because you exactly know what risk you have. Unlike some other protocols where risks can spread across multiple assets, Llamalend's isolation ensures that problems in one market don't affect others.

## How Supplying Works

Llamalend's lending markets operate through a traditional lending model where you supply assets to earn yield:

- **Vaults**: Vaults are the smart contracts where users can deposit (lend) their assets and borrowers borrow from. Each market has its own vault that manages the specific collateral and debt token pair.
- **Supply Process**: You deposit your assets (like crvUSD) into lending market vaults. These assets become available for borrowers to use as collateral or debt tokens.
- **Yield Generation**: You earn interest from borrowers who pay rates based on market utilization and demand. Higher utilization typically means higher yields for suppliers.
- **Liquidity Provision**: Your supplied assets provide the liquidity that enables borrowing on the platform. The more assets supplied, the more borrowing capacity available.
- **Flexible Withdrawal**: You can withdraw your supplied assets at any time (subject to market conditions), making it a flexible way to earn yield without long-term commitments.

## Supply Yields

When you supply assets to Llamalend markets, you earn **supply yield** based on the borrow rates paid by borrowers. Your yield is calculated from the interest payments made by borrowers in that market.

### How Supply Yields Work

Supply yields are directly tied to the borrow rates in each market. When borrowers pay interest on their loans, that interest is distributed to suppliers based on their share of the total supplied assets.

$\text{supply yield} = \frac{supplied amount}{total supplied} \times \text{interest paid by borrowers}$

### Yield Factors

Several factors affect your supply yield:

- **Market Utilization**: Higher utilization typically means higher yields because more borrowers are paying interest. When utilization is low, yields are lower but there's more liquidity available.
- **Borrow Rates**: The higher the borrow rates in a market, the higher your supply yield will be. Borrow rates fluctuate based on market conditions and utilization.
- **Your Supply Share**: The more assets you supply relative to the total market supply, the more yield you earn from the total interest pool.
- **Market Type**: Supply yields are only available in **Lend Markets**. Mint markets don't offer supply yields because crvUSD is minted rather than borrowed from existing liquidity.

## Market Overview

The same Llamalend Markets interface shows both borrowing and lending opportunities. When viewing markets from a supplier's perspective, you'll focus on:

<figure>
<ThemedImage
    alt="Llamalend Markets interface showing mint and lend markets with filtering options"
    sources={{
        light: require('@site/static/img/user/llamalend/market_overview_light.png').default,
        dark: require('@site/static/img/user/llamalend/market_overview_dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
/>
</figure>

- **Supply Yield**: The interest rate you'll earn on your supplied assets
- **Market Utilization**: How much of the available liquidity is being used (higher utilization often means higher yields)
- **Available Liquidity**: Total assets available for borrowing in the market

Note: Supplying assets to a "Mint" market is not possible because the crvUSD are minted from that market (more on ["Mint vs Lend"](overview.md#mint-vs-lend-markets)).

The interface allows you to filter markets by the same criteria as borrowers: chain, collateral tokens, debt tokens, liquidity ranges, and utilization percentages. You can also save favorite markets and track your supplied positions through the "My Markets" filter.

