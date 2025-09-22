---
id: check-earnings
title: 'Guide: Checking Earned Interest'
sidebar_label: Check Earnings
---

import ButtonGrid from '@site/src/components/ButtonGrid';
import ThemedImage from '@theme/ThemedImage';

This guide shows how to check your earned interest while holding scrvUSD tokens on Ethereum mainnet.

:::info Important Note
While scrvUSD tokens exist and earn interest on all deployed networks, the deposit, withdrawal, and functions for the scrvUSD vault are exclusively available on the Ethereum mainnet. You can simply buy and sell scrvUSD from a curve pool and it will essentially have the same effect.
:::

## Step 1: Navigate to the scrvUSD Vault and Connect Your Wallet

Go to the official [scrvUSD vault page on Curve.finance](https://www.curve.finance/crvusd/ethereum/scrvUSD/):

<ButtonGrid buttonKeys={['gotoScrvusd']} />

## Step 2: Checking Your Earned Interest

You can easily see how much interest you've earned directly on the scrvUSD UI:

1.  Navigate to the `Position Details` section.
2.  Hover your mouse over the `Your crvUSD Staked` box.

This will reveal the current crvUSD value of your scrvUSD holdings. For instance, here we see our initial **953 scrvUSD (which acquired by depositing 1,000 crvUSD)** is now worth **1,016 crvUSD after 3 months**, representing a gain of **16 crvUSD, or 1.6%**.

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Position Details"
    sources={{
      light: require('@site/static/img/ui/savings/position-details-light.png').default,
      dark: require('@site/static/img/ui/savings/position-details-dark.png').default,
    }}
    style={{
      maxWidth: '1000px',
      width: '100%'
    }}
  />
  <figcaption>*Value of 953 scrvUSD after 3 months*</figcaption>
</figure>