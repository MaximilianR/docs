---
id: swap
title: Swapping on Curve
sidebar_label: Swap Tokens on Curve
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';

Swapping on Curve is simple, secure, and as the main liquidity hub for many tokens, Curve gives you excellent swap rates.

Curve is a decentralized exchange, so **you are always in control of your funds**.  Your assets never leave your personal wallet until a trade successfully completes. Every swap is protected from unexpected price changes. You're guaranteed to receive a specific minimum amount of tokens, or the transaction will not complete, leaving your funds untouched.

Here are the main ways you can swap on Curve:

1.  **Use Curve Swap (Swap Router)**: This is the easiest and most recommended method. The Swap Router automatically finds the best possible price across all Curve pools. It also handles convenient extras, like:

      * Depositing/withdrawing from the [scrvUSD savings vault](../curve-tokens/scrvusd.md).
      * Wrapping/unwrapping `ETH` and `WETH` automatically.

    Best of all, Curve charges **no frontend fee** for this service, meaning you often get a better final price here than anywhere else.
2. **Swap Directly Within a Pool**: For advanced users looking to minimize gas fees, you can trade directly inside a specific liquidity pool. For example, the [crvUSD/USDC pool's swap tab](https://www.curve.finance/dex/ethereum/pools/factory-crvusd-0/swap/). This doesn't search all pools for the best price, but can be cheaper for simple, direct swaps.
3. **Use a Swap Aggregator**: Curve is integrated into all popular swap aggregators like CoWSwap, 1inch, and Odos. If you frequently use an aggregator, you're likely already benefiting from Curve's liquidity without even knowing it\!

This guide will focus on the easiest and most popular method: using the **Curve Swap Router**.

## How to use Curve Swap Router

#### 1. Go to Curve Swap

First, head to [Curve Swap](https://www.curve.finance/dex/ethereum/swap/):

<ButtonGrid buttonKeys={['gotoSwap']} />

#### 2. Connect Wallet

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

#### 3. Select Your Tokens and Amount

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

#### 3. Approve and Swap

To complete the swap, you'll likely need to perform two separate transactions:

1.  **Approve**: Before swapping a token for the first time, you must grant the Curve smart contract permission to interact with it. This is a standard security step in DeFi. Click `Approve` and confirm the transaction in your wallet. You only need to do this once per token.
2.  **Swap**: Once the approval transaction is confirmed, the button will change to `Swap`. Click it and confirm the final transaction in your wallet to execute the trade.

#### 4. Confirmation

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

# FAQ

## Does Curve have any frontend fees?

No, none of Curve products have any frontend fees.  Curve does have a small pool fee, but this exists no matter where the swap happens, so very often the Curve Swap Router will give a better price than any aggregator because there are no extra fees.

## What are the fees for swapping on Curve?

When you swap, there are typically two types of fees:

1.  **Trading Fee:** A small fee (often around 0.04%) is paid to the liquidity providers of the pool you are using. This fee is already included in the exchange rate you see in the UI.
2.  **Gas Fee:** This is a fee you pay to the blockchain network (e.g., Ethereum) to process and secure your transaction. Curve does not control or receive any part of this fee.

Curve charges **no frontend fees**, meaning you often get a better final price here than on other platforms or aggregators.

## My transaction failed. Did I lose my funds?

No, your funds are safe. If a swap transaction fails, it means the trade did not happen, and your original tokens never left your wallet. The only thing you lose is the small gas fee you paid for the attempted transaction on the blockchain. Transactions usually fail as a safety measure, for instance, if the price moved beyond your set slippage tolerance while the trade was pending.

## Why do I have to 'Approve' a token before I can swap it?

The `Approve` transaction is a standard security feature across all of DeFi. It gives the Curve smart contract your permission to interact with *only that specific token* you want to swap. Think of it as giving a valet the key to your car, but not the keys to your entire house. It's a one-time security step you must complete for each new token you want to swap from.

## What is 'slippage' and what should I set it to?

Slippage is a safety setting that protects you from getting a much worse price than you expected. If you set slippage to 1%, you're telling Curve that you are willing to accept a final price that is up to 1% lower than what was quoted. If the price slips more than that while your transaction is pending, the transaction will fail, protecting your funds.

The default slippage values are low, and should normally work well.  You should only increase the slippage if you're having issues with a highly volatile token/asset.