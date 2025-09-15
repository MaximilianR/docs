---
id: supplying
title: Supplying
sidebar_label: Supplying
---

import ThemedImage from '@theme/ThemedImage';

Supplying assets means lending out your crypto assets to other users who can borrow them, earning interest in return.

## Why Supply to Llamalend?

Supplying crypto to Llamalend is a way to earn a return on your holdings. When you provide liquidity, or "supply assets," you’re essentially lending your crypto to borrowers. As a lender, you **earn passive income from the interest borrowers pay**. 

Llamalend markets are **isolated and one-way**, which makes them safer. This means each market is self-contained with just one type of collateral and one type of borrowable token. Because markets are separate, a problem in one won't spread to another. This design helps reduce risk, making it more comfortable to supply your assets, and importantly, it means it's safe to allow the creation of lending markets by anyone.

## How Supplying Works

Llamalend's lending markets operate through a traditional lending model where you supply assets to earn yield. Here's how it all works:

* **Vaults**: Vaults are the smart contracts where you can deposit (lend) your assets and where borrowers take loans from. Each market has its own vault that manages a specific debt token, keeping everything organized and separate.
* **Supply Process**: You deposit your crypto assets (like crvUSD) into the lending market vaults. These assets become available for other users to borrow.
* **Yield Generation**: You earn interest from borrowers who pay rates based on how much of the market is being used (the ratio of supplied assets to borrowed assets, called utilization). If most of the supplied assets are being borrowed, the yield for suppliers goes up. The fees borrowers pay are split evenly among all the people who supplied assets.
* **Liquidity Provision**: Your supplied assets provide the liquidity that makes borrowing within each market possible. The more assets supplied, the more borrowing capacity is available for everyone.
* **Flexible Withdrawal**: You can withdraw your supplied assets at any time, as long as there are enough unborrowed assets available in the vault. This makes it a flexible way to earn yield without any long-term commitments.

### Supplying Yield

Supply yields are directly tied to the borrow rates in each market. When borrowers pay interest on their loans, that interest is distributed to suppliers based on their share of the total supplied assets.

$\text{supply yield} = \frac{total borrowed}{total supplied} \times \text{borrowing interest rate}$

In many lending markets the borrowing and supplying interest rates are solely based on the utilization, as more of the supply is borrowed, interest rates for borrowers and suppliers increase. When utilization is low, yields are lower and it's more attractive for borrowers to borrow.

---

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

