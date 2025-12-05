---
title: Providing Liquidity in Pools
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';

One of the primary ways to **earn yield** on Curve is by providing liquidity to liquidity pools. When you deposit assets, you become a liquidity provider (LP) and, in return, receive LP tokens which represent your ownership stake in the pool's assets.

Users can withdraw their provided liquidity at any point in time, which burns the LP tokens again. 

<GuideCardGrid guideKeys={['learnAboutPools', 'learnDexPoolRewards', 'howToDexDeposit', 'howToDexClaim']} />

<ButtonGrid buttonKeys={['gotoDex']} />

---

When you **deposit assets into a liquidity pool on Curve**, you become a **liquidity provider (LP)** which means you are providing your asset(s) in a pool for others to trade. Simply put, if you are e.g. providing USDT and USDC liquidity into a USDC/USDT pool, you provide liquidity for other traders to swap between USDC and USDT.

A liquidity provider can potentially earn in several ways:

- **Trading Fees:** Every time someone exchanges coins in the pool you provide liquidity to, a fee is charged. LPs get a share of these fees (typically 50%).
- **CRV Rewards:** Because of the way Curve works, some pools might receive CRV tokens as rewards. If that is the case and users want to earn these extra rewards, they need to stake their LP tokens in a so called [gauge](lp.md#what-is-a-gauge). You can claim these rewards whenever you want and you can unstake at any point in time. There is no lockup period.
- **Other Token Rewards:** Sometimes, projects or asset issuers give out extra token rewards to the LP's of their pools. You can earn these too by staking your LP tokens in the same gauge.
- **Points:** Some pools give you points for adding or staking your crypto. These points might get you extra perks or airdrops in the future, but check each project's rules to be sure.

All these rewards can add up, making liquidity providing potentially a great way to earn more from your crypto.

---

## FAQ

### What is a Gauge?

A "gauge" is a simple smart contract where you can stake your LP tokens to earn additional CRV and other token rewards. Gauges are designed to distribute these reward tokens evenly over time, effectively incentivizing liquidity provision to specific pools.  Users can claim their earned rewards at any time from the gauge.
