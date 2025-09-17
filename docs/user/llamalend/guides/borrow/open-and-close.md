---
id: open-and-close
title: Open and Close Loan
sidebar_label: Open and Close Loan
---

import ThemedImage from '@theme/ThemedImage';

## Open a new Loan

### Select a Market

The UI provides various filtering methods to find the most suitable market.

<figure>
<ThemedImage
    alt="Available lending markets"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/open-close/overview-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/open-close/overview-dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
/>
</figure>

### Specify Loan Parameters

To create a loan, enter the amount of collateral you want to use and choose how much crvUSD to borrow. If its your first time creating a loan within this market, you will need to sign two transactions.
1. approval
2. create loan

<figure>
<ThemedImage
    alt="Loan parameters interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/open-close/open-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/open-close/open-dark.png').default,
    }}
    style={{ width: '300px', display: 'block', margin: '0 auto' }}
/>
</figure>

The UI will provide an overview of the price range ([liquidation protection range](../../liquidation-protection.md)), health of the loan, borrow rate, etc.

Additionally, there is a chart which displays the price of the collateral token (blue line) and your liquidation range (orange area). 

<figure>
<ThemedImage
    alt="Loan parameters interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/open-close/liquidation-range-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/open-close/liquidation-range-dark.png').default,
    }}
    style={{ width: '700px', display: 'block', margin: '0 auto' }}
/>
</figure>

### View Your Position

After a loan has been created, all your position details show in a single card. The "Get alerts" button on the top redirects you to a telegram bot which lets you monitor your position.

<figure>
<ThemedImage
    alt="Loan position overview"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/open-close/position-overview-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/open-close/position-overview-dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
/>
</figure>

---

## Closing Your Loan

To fully close your loan, you need to repay all of your debt. There are two options:
1. Fully repay your loan
2. Self-liquidate your loan if its in liquidation protection mode

### Fully Repaying 
Navigate to the "Repay" tab and select how to repay your debt. You have the following options:
- **Repay from Collateral**: Repay your debt using your current collateral. The system will sell as much collateral as needed to repay the debt and return the remaining balance to your wallet.
- **Repay from Wallet**: Repay your debt using assets directly from your wallet. You can use either the collateral token or the debt token.

<figure>
<ThemedImage
    alt="Close loan interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/open-close/repay-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/open-close/repay-dark.png').default,
    }}
    style={{ width: '400px', display: 'block', margin: '0 auto' }}
/>
</figure>

Alternatively, you can check the "Repay in full and close loan" box for a streamlined process.

### Self Liquidate
Another option to close your loan is to self-liquidate when your loan is in liquidation protection mode. This is essentially the same as repaying the full debt with crvUSD from your wallet.

<figure>
<ThemedImage
    alt="Close loan interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/open-close/self-liquidate-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/open-close/self-liquidate-dark.png').default,
    }}
    style={{ width: '400px', display: 'block', margin: '0 auto' }}
/>
</figure>