---
id: withdraw-scrvusd
title: 'Guide: How to Withdraw from scrvUSD'
sidebar_label: Withdraw
---

import ButtonGrid from '@site/src/components/ButtonGrid';
import ThemedImage from '@theme/ThemedImage';

This guide shows how to withdraw directly through the vault to receive crvUSD, however, you can also swap from scrvUSD directly into crvUSD or any other asset using [Curve Swap](https://www.curve.finance/dex/ethereum/swap).  A guide for using Curve Swap is here: [Guide: How to Swap](../../dex/guides/swap.md)

:::info Important Note
While scrvUSD tokens exist and earn interest on all deployed networks, the deposit and withdrawal functions for the scrvUSD vault are exclusively available on the Ethereum mainnet. You can simply buy and sell scrvUSD from a curve pool and it will essentially have the same effect.
:::

## Step 1: Go to the scrvUSD Vault

You can withdraw your crvUSD from the vault at any time, there are **no delays or lock-ups**. Whenever you're ready to withdraw, simply navigate to the [scrvUSD vault page](https://www.curve.finance/crvusd/ethereum/scrvUSD/) on Curve.finance:

<ButtonGrid buttonKeys={['gotoScrvusd']} />

## Step 2: Select Your Withdrawal Amount

Once on the scrvUSD vault page, click on the `Withdraw` tab located on the left side of the interface.

Here, you'll see your current scrvUSD balance. Enter the amount of scrvUSD you wish to withdraw, or click `Max`:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Withdrawal Amount"
    sources={{
      light: require('@site/static/img/ui/savings/withdraw-amount-light.png').default,
      dark: require('@site/static/img/ui/savings/withdraw-amount-dark.png').default,
    }}
    style={{
      maxWidth: '400px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

Notice that the amount of scrvUSD tokens remains the same (e.g., **953 scrvUSD** from our example). However, because scrvUSD continuously grows in value, the initial **1,000 crvUSD** deposit can now be withdrawn as **1,022 crvUSD** after a few months, a profit of **22 crvUSD**!

## Step 3: Confirm and Complete Your Withdrawal

After you've selected your withdrawal amount, click the `Withdraw` button and confirm the transaction in your Web3 wallet.

Once this transaction is successfully confirmed on the blockchain, your crvUSD and earned interest will back in your wallet:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Withdrawal Success"
    sources={{
      light: require('@site/static/img/ui/savings/withdrawal-success-light.png').default,
      dark: require('@site/static/img/ui/savings/withdrawal-success-dark.png').default,
    }}
    style={{
      maxWidth: '400px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

Congratulations on successfully withdrawing your crvUSD and realizing your earned yield!