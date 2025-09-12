---
title: Boosting CRV Rewards
hide_title: true
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';
import VecrvLogo from '@site/static/img/logos/veCRV_s.png';

# <img src={VecrvLogo} className="heading-inline-logo" alt="veCRV" /> veCRV - Boosting CRV rewards

While providing liquidity to Curve pools and lending to Llamalend markets already earns you trading fees and CRV rewards (if available), there's a powerful way to **maximize your CRV earnings**: by **boosting** them. Boosting allows you to **increase the amount of CRV you earn by up to 2.5x**.

Your current pool boosts can be seen on the DEX Dashboard, and you can calculate the boost your potential boost with the boost calculator, links below.

<ButtonGrid buttonKeys={['vecrvDashboard', 'boostCalculator']} />

## What is Boosting?

Boosting is a mechanism tied to [**veCRV**](../vecrv/what-is-vecrv.md) (vote-escrowed CRV). To get veCRV, you **lock your CRV tokens** for a set period, ranging from one week to four years. The longer you lock your CRV, the more veCRV you receive.

Think of veCRV as your long-term commitment to the Curve ecosystem. In return for this commitment, the protocol rewards you with increased CRV emissions on your supplied liquidity. Essentially, with enough veCRV, you can earn up to **2.5 times** the CRV rewards you would normally receive from your LP tokens!

## How Boosting Works

1.  [**Lock CRV for veCRV**](../vecrv/how-to-lock.md): The first step is to take your CRV tokens lock them on Curve. This converts your CRV into non-transferable veCRV. Remember, as your CRV unlock date approaches, your veCRV balance will decrease.
2.  **Provide Liqidity & Stake:** Provide liquidity to your chosen pool or lending market and stake your LP tokens in its gauge.
3.  **Apply Your Boost:** Usually this happens automatically, but sometimes you may need to "apply" your boost by claiming any available CRV rewards.
4. **Your Boost is Applied**: 

## What will my Boost Mutliplier be?

You can calculate the boost you will receive with the Boost Caculator, link below:

<ButtonGrid buttonKeys={['boostCalculator']} />

Your boost multiplier can be between 1 and 2.5.  It depends on the following factors:

    * **Your veCRV balance:** More veCRV means a higher potential boost.
    * **The amount of liquidity you provide:** Your boost is calculated relative to your liquidity.
    * **The total veCRV and liquidity in the gauge:** The boost mechanism balances your veCRV power against everyone else's in the Pool or Lending market's gauge.

By boosting, you're essentially getting a larger share of the new CRV tokens distributed. This incentivizes users to lock CRV, which in turn strengthens the Curve DAO's governance and promotes long-term alignment with the protocol.

**Why Boost?**
Boosting is a key incentive for long-term participation in the Curve ecosystem. It allows active liquidity providers to significantly increase their CRV farming efficiency, making their contributions even more profitable.

---

## Guides

<GuideCardGrid guideKeys={['lockingCrv', 'claimingCrvRewards']} />

---