---
title: Providing Liquidity in Pools
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';

One of the primary ways to **earn yield** on Curve is by providing liquidity to liquidity pools. When you deposit assets, you become a liquidity provider (LP) and, in return, receive LP tokens. These tokens represent your ownership stake in the pool's assets.

<ButtonGrid buttonKeys={['gotoDex']} />

---

## How Do You Earn by Providing Liquidity?

When you **deposit assets into a liquidity pool on Curve**, you become a **liquidity provider (LP)** which means you are providing your asset in a pool for other to trade. This helps other users trade (swap) between the assets in that pool. In return for providing this valuable liquidity, you receive **LP tokens**, which represent your share of the pool.

As a liquidity provider, you can earn in several ways:

* **Trading Fees:** Every time someone swaps coins in the pool, a fee is collected from this trade. You get a share of these fees, which makes your LP tokens more valuable over time.
* **CRV Rewards:** If you stake your LP tokens in something called a [gauge](lp.md#what-is-a-gauge), you can earn extra CRV tokens. You can claim these rewards whenever you want and you can unstake at any point in time. There is no lockup period.
* **Other Token Rewards:** Sometimes, projects or asset issuers give out additional token rewards to the LP's of their pools. You can earn these too by staking your LP tokens in the same [gauge](lp.md#what-is-a-gauge).
* **Points:** Some pools give you points for adding or staking your crypto. These points might get you extra perks or airdrops in the future, but check each project's rules to be sure.

All these rewards can add up, making liquidity providing potentially a great way to earn more from your crypto.


### What is a Gauge?

A "gauge" is a simple smart contract where you can stake your LP tokens to earn additional CRV and other token rewards. Gauges are designed to distribute these reward tokens evenly over time, effectively incentivizing liquidity provision to specific pools.  Users can claim their earned rewards at any time from the gauge.

todo: link to gauge section

---

## Guides

<GuideCardGrid guideKeys={['learnAboutPools', 'learnDexPoolRewards', 'howToDexDeposit', 'howToDexClaim']} />
