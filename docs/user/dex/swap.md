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

For a quick guide showing how to make a swap using the **Curve Swap Router**, see below.

<GuideCardGrid guideKeys={['howToSwap']} />

---

## FAQ

### Does Curve have any frontend fees?

No, none of Curve products have any frontend fees.  Curve does have a small pool fee, but this exists no matter where the swap happens, so very often the Curve Swap Router will give a better price than any aggregator because there are no extra fees.

### What are the fees for swapping on Curve?

When you swap, there are typically two types of fees:

1.  **Trading Fee:** A small fee (often around 0.04%) is paid to the liquidity providers of the pool you are using. This fee is already included in the exchange rate you see in the UI.
2.  **Gas Fee:** This is a fee you pay to the blockchain network (e.g., Ethereum) to process and secure your transaction. Curve does not control or receive any part of this fee.

Curve charges **no frontend fees**, meaning you often get a better final price here than on other platforms or aggregators.

### My transaction failed. Did I lose my funds?

No, your funds are safe. If a swap transaction fails, it means the trade did not happen, and your original tokens never left your wallet. The only thing you lose is the small gas fee you paid for the attempted transaction on the blockchain. Transactions usually fail as a safety measure, for instance, if the price moved beyond your set slippage tolerance while the trade was pending.

### Why do I have to 'Approve' a token before I can swap it?

The `Approve` transaction is a standard security feature across all of DeFi. It gives the Curve smart contract your permission to interact with *only that specific token* you want to swap. Think of it as giving a valet the key to your car, but not the keys to your entire house. It's a one-time security step you must complete for each new token you want to swap from.

### What is 'slippage' and what should I set it to?

Slippage is a safety setting that protects you from getting a much worse price than you expected. If you set slippage to 1%, you're telling Curve that you are willing to accept a final price that is up to 1% lower than what was quoted. If the price slips more than that while your transaction is pending, the transaction will fail, protecting your funds.

The default slippage values are low, and should normally work well.  You should only increase the slippage if you're having issues with a highly volatile token/asset.
