---
title: What is veCRV?
---

import ThemedImage from '@theme/ThemedImage';


**veCRV** stands for **vote-escrowed CRV**. It is a token you receive when you lock your CRV tokens for a period of time, which can range from a minimum of 1 week up to a maximum of 4 years. The longer you choose to lock your CRV, the more veCRV you receive in return. Unlike regular tokens, **veCRV is not transferrable**, and the **amount you hold gradually decreases** as your lock approaches its expiry date.


## Why lock CRV?

Locking CRV for veCRV is designed to align incentives within Curve's governance system. By requiring users to commit their tokens for a set period, the protocol ensures that only those with a long-term interest can influence important decisions. This mechanism helps prevent short-term manipulation, as voting power is directly tied to the duration of your commitment. In short, the longer you lock your CRV, the greater your influence in governance and other aspects.

## How does veCRV work?

When you lock your CRV, the amount of veCRV you receive depends on both the quantity of CRV locked and the length of the lock. For example, locking 1 CRV for the maximum period of 4 years grants you 1 veCRV, while locking the same amount for just 1 year gives you 0.25 veCRV. This relationship is defined by a simple formula:

$$veCRV = \frac{CRV_{locked} \times {locktime_{left}}}{4}$$

As time passes, your veCRV balance decays linearly, reflecting the decreasing time left on your lock. You can **only have one active lock per address**, but you are free to **add more CRV or extend the lock duration** at any time. Once the lock expires, your veCRV balance reaches zero and you can withdraw all your originally locked CRV tokens.

## What are the benefits of holding veCRV?

Holding veCRV unlocks several important benefits:

- **Earn Protocol Fees:** veCRV holders receive a share of trading fees and a portion of interest from Curve's stablecoin markets. See [Revenue](./revenue.md) for details.
- **Boosted CRV Rewards:** If you provide liquidity to Curve pools, holding veCRV can boost your CRV rewards. See [Boosting](./boosting.md) for more info.
- **Governance:** veCRV gives you voting power in the Curve DAO, including on proposals and gauge weight votes that determine CRV emissions. See [FAQ](./faq.md) for more.
