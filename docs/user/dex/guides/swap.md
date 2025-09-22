---
id: swap
title: 'Guide: How to Swap Assets'
sidebar_label: How to Swap
---

import ThemedImage from '@theme/ThemedImage';
import ButtonGrid from '@site/src/components/ButtonGrid';

Swapping on Curve is easy thanks to the Curve Swap Router, follow along below.

## 1. Go to Curve Swap

First, head to [Curve Swap](https://www.curve.finance/dex/ethereum/swap/):

<ButtonGrid buttonKeys={['gotoSwap']} />

## 2. Connect Wallet

If your wallet isn't already connected, you'll find the `CONNECT WALLET` button in the top-right corner, and choose your desired network, Ethereum is the default.

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="DEX Philosophy"
    sources={{
      light: require('@site/static/img/ui/dex/swap-connect-light.png').default,
      dark: require('@site/static/img/ui/dex/swap-connect-dark.png').default,
    }}
    style={{
      maxWidth: '1200px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

You should then see the swap interface in the center of your screen:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Blank Swap"
    sources={{
      light: require('@site/static/img/ui/dex/swap-blank-light.png').default,
      dark: require('@site/static/img/ui/dex/swap-blank-dark.png').default,
    }}
    style={{
      maxWidth: '300px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

## 3. Select Your Tokens and Amount

Use the top box (shown as `ETH` above) to select the token you want to sell and the bottom box for the token you want to buy (shown as `WETH` in the image above). Then, enter the amount you wish to trade.

Let's walk through an example of swapping `2000 USDC` for `crvUSD`. After entering these details, the interface updates to show you a detailed quote for the trade:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Example swap"
    sources={{
      light: require('@site/static/img/ui/dex/example-swap-light.png').default,
      dark: require('@site/static/img/ui/dex/example-swap-dark.png').default,
    }}
    style={{
      maxWidth: '300px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

Here’s what the detailed quote from the interface is telling us:

* **Exchange Rate**: For every `1 USDC` you swap, you will receive `1.00004 crvUSD`. This rate already includes trading fees.
* **Trade Route**: The Swap Router found the best price by routing your trade through two pools: first `USDC` → `USDT`, and then `USDT` → `crvUSD`.
* **Slippage Tolerance**: This is a safety feature that protects you from large price swings while your transaction is being processed. The default of `0.03%` means that in a worst-case scenario, the minimum you would receive is `0.99974 crvUSD` per `1 USDC`.

## 3. Approve and Swap

To complete the swap, you'll likely need to perform two separate transactions:

1.  **Approve**: Before swapping a token for the first time, you must grant the Curve smart contract permission to interact with it. This is a standard security step in DeFi. Click `Approve` and confirm the transaction in your wallet. You only need to do this once per token.
2.  **Swap**: Once the approval transaction is confirmed, the button will change to `Swap`. Click it and confirm the final transaction in your wallet to execute the trade.

## 4. Confirmation

After a few moments, the transaction will be confirmed on the blockchain. The interface will update to show your new `crvUSD` balance, confirming a successful swap:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Example swap success"
    sources={{
      light: require('@site/static/img/ui/dex/example-swap-complete-light.png').default,
      dark: require('@site/static/img/ui/dex/example-swap-complete-dark.png').default,
    }}
    style={{
      maxWidth: '300px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

Congratulations, you've successfully swapped tokens on Curve!