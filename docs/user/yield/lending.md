---
title: Earning Yield on Llamalend
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';

Llamalend (Curve's lending infrastructure) lets you **earn yield by supplying assets** to lending markets. Doing so, other users can borrow your lent out assets and you'll earn interest on it.

Some lending markets also offer additional rewards, like CRV emissions, other tokens or points.

<GuideCardGrid guideKeys={['learnLlamalend', 'learnLlamalendSupplying']} />

<ButtonGrid buttonKeys={['gotoLend']} />

---

## How Lending on Llamalend Works

When you lend out your assets on Llamalend, you deposit them into a **lending market**. Each market lets users borrow one asset by using another as collateral, for example, borrowing crvUSD by using ETH as collateral. You earn interest according to the market's interest rate as assets are borrowed. You can withdraw your assets anytime, as long as there's enough available (unborrowed) in the pool.

Interest rates on Llamalend are **dynamic** and change based on supply and demand. High demand for borrowing means higher interest for lenders; low demand means lower interest.

todo maybe a little yield calculator here

## Earning Yield as a Lender

As a lender on Llamalend, your primary sources of yield comes from:

* **Borrowing Interest:** This is the direct interest paid by borrowers for using your supplied assets. This interest automatically accrues to your deposited assets, increasing their value over time.
* **CRV Rewards:** Similar to providing liquidity in swap pools, some Llamalend markets may offer additional CRV tokens as rewards for supplying assets.
* **Other Token Rewards and Points:** Protocols or asset issuers might also provide other tokens or points as additional rewards for lenders in specific markets. They often do so for bootstrapping their lending markets.


