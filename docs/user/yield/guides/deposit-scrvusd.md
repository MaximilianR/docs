---
id: deposit-scrvusd
title: 'Guide: How to Deposit into scrvUSD'
sidebar_label: Deposit
---

import ButtonGrid from '@site/src/components/ButtonGrid';
import ThemedImage from '@theme/ThemedImage';

Before you can start earning interest by depositing into the scrvUSD savings vault, you'll **need to have crvUSD tokens on the Ethereum mainnet**.

If you don't have crvUSD, you can also swap directly into scrvUSD using [Curve Swap](https://www.curve.finance/dex/ethereum/swap).  A guide for using Curve Swap is here: [Guide: How to Swap](../../dex/guides/swap.md)

:::info Important Note
While scrvUSD tokens exist and earn interest on all deployed networks, the deposit and withdrawal functions for the scrvUSD vault are exclusively available on the Ethereum mainnet. You can simply buy and sell scrvUSD from a curve pool and it will essentially have the same effect.
:::

## Step 1: Navigate to the scrvUSD Vault and Connect Your Wallet

Go to the official [scrvUSD vault page on Curve.finance](https://www.curve.finance/crvusd/ethereum/scrvUSD/):

<ButtonGrid buttonKeys={['gotoScrvusd']} />

Once on the page, connect your Web3 wallet by clicking the "Connect Wallet" button in the top right corner of the interface.  After successfully connecting your wallet, you should see an interface similar to the following:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="scrvUSD Whole UI"
    sources={{
      light: require('@site/static/img/ui/savings/no-deposit-whole-ui-light.png').default,
      dark: require('@site/static/img/ui/savings/no-deposit-whole-ui-dark.png').default,
    }}
    style={{
      maxWidth: '1684px',
      width: '100%'
    }}
  />
  <figcaption>*Here we have 1000 crvUSD we can deposit, which can earn 6.9% APY*</figcaption>
</figure>

## Step 2: Choose Your Deposit Amount

On the left you'll see the `Deposit` tab. Here, enter the amount of crvUSD you wish to deposit, or click `Max` to deposit all your crvUSD from your wallet.

After entering your amount, you'll see how many scrvUSD vault tokens you'll receive. In the example below, if we deposit **1,000 crvUSD**, we would receive **953 scrvUSD**. This is because scrvUSD is designed to continuously grow in value against crvUSD (1 scrvUSD = 1.049 crvUSD).

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Deposit Amount"
    sources={{
      light: require('@site/static/img/ui/savings/deposit-amount-light.png').default,
      dark: require('@site/static/img/ui/savings/deposit-amount-dark.png').default,
    }}
    style={{
      maxWidth: '400px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

## Step 3: Approve & Deposit Your crvUSD

If this is your **first time depositing crvUSD into the scrvUSD vault**, you'll need to complete two separate transactions:

1.  **Approve:** This transaction gives the scrvUSD vault permission to access and transfer your crvUSD tokens from your wallet.
2.  **Deposit:** This second transaction actually sends your crvUSD into the vault, and in return, you'll receive scrvUSD tokens.

However, if you've deposited into the scrvUSD vault before, you'll only need to complete the **Deposit** transaction.

These transactions will appear sequentially in your Web3 wallet for you to review and sign. Once you've approved and sent both transactions, you'll see their progress displayed just below the deposit box on the interface:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Deposit Success"
    sources={{
      light: require('@site/static/img/ui/savings/deposit-success-light.png').default,
      dark: require('@site/static/img/ui/savings/deposit-success-dark.png').default,
    }}
    style={{
      maxWidth: '400px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

## Congratulations! Your Deposit is Complete.

You've successfully deposited your crvUSD! In our example, you now hold **953.2 scrvUSD**. Remember, the scrvUSD token balance will not change, but the value of each scrvUSD token will automatically become worth *more* crvUSD over time, reflecting your earned interest.

---

