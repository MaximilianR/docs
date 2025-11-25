---
id: how-it-works
title: Liquidation Protection & Loan Health
sidebar_label: Liquidation Protection & Health
---

import ThemedImage from '@theme/ThemedImage';
import CollateralConversion from '@site/src/components/CollateralConversion';
import ThemedVideo from '@site/src/components/ThemedVideo';


## Quick Reference

| Concept | What It Means |
|---------|---------------|
| **Liquidation Protection** | Your loan enters liquidation protection mode when collateral price drops into the liquidation protection range. The system gradually converts your collateral to protect you, and automatically converts back when prices recover. |
| **Health** | A value showing how close you are to full liquidation. Think of it like a fuel gauge: when it hits 0%, your loan is closed. |
| **Liquidation Protection Range** | A price zone (e.g., ETH \$3,000-$2,500). When price enters this zone, liquidation protection activates. |
| **Full Liquidation** | When health reaches 0%, your loan is fully closed. |
| **Bands** | Small price ranges that make up your protection range. More bands = wider range = lower risk. |
| **Protection ≠ Liquidation** | Being in liquidation protection doesn't mean you lost all your collateral (although losses occur) — it means the system is actively defending it. |
| **Losses in Liquidation Protection** | Losses from conversions reduce your total collateral value permanently. If you enter with 10 ETH and exit protection later, you'll have less than 10 ETH (10 ETH minus losses). This reduction doesn't recover even if prices fully recover. |

:::important
**The Golden Rule**: Monitor your health constantly. As long as it's above 0%, you're protected from full liquidation.

For answers to common questions, see the [FAQ](./faq.md).
:::

---

## The Simple Idea

:::info
**Analogy for Liquidation Protection:**  
Other protocols are like a trapdoor: if your collateral price hits a certain point, the floor drops out and you instantly lose everything with no warning. Curve is like a safety net that gradually activates as you fall, catching you over a range of prices and giving you time to react and recover.

Think of the safety net as having two parts: the **liquidation protection range** is the net itself (the price zone where protection activates), and **health** is how strong and intact the net remains. As long as your health stays above 0%, the net is there to catch you. When health reaches 0%, the net is gone and you're fully liquidated.
:::

Instead of instant liquidation at a fixed price, Curve protects your loan gradually over a price range. When your collateral price drops into the **liquidation protection range**, the system automatically starts converting your volatile collateral (like ETH) into stable crvUSD. This protects you from further price declines while giving you time to manage your position. Your **health decreases as losses accumulate, but as long as it stays above 0%, the safety net remains intact.**

Conversion works both ways. When prices drop, your collateral converts to crvUSD to protect you. When prices recover, the system automatically converts crvUSD back to your original collateral, helping restore your position. This automatic recovery is impossible with instant liquidation systems. Once you're liquidated elsewhere, you're done. With Curve, your position can automatically improve as market conditions recover.

Liquidation protection does not mean zero losses. It means losses are gradual instead of instant. Losses occur while in protection (see [Understanding Losses](#understanding-losses)).

---

## Understanding Health: Your Safety Measurement

Health is like a fuel gauge for your loan. It shows how much buffer you have before full liquidation.

- **High health (e.g., 20%+)**: You have a large safety buffer
- **Medium health (e.g., 10%)**: Moderate risk. Consider taking action
- **Low health (e.g., 5%)**: Critical: immediate action needed
- **0% health**: Full liquidation occurs

### How Health Decreases

Health decreases from four main factors:

1. **Price drops**: When your collateral becomes less valuable
2. **Losses in liquidation protection**: When you're in liquidation protection and collateral swaps occur
3. **Interest**: Charged continuously every second (very slowly)
4. **Borrowing more or removing collateral**: Taking on additional debt or removing collateral obviously decreases your health as well

:::important
Even if price is rising, health can still fall while you're inside the protection range because losses from conversions continue until you exit the range completely. A rising price does not guarantee improving health unless price moves above the full protection range.
:::

### How to Monitor Health

- **In the UI**: View your health percentage in the [Llamalend UI](https://www.curve.finance/llamalend/ethereum/markets)
- **Telegram Bot**: Get automated alerts via the [Llamalend Telegram Bot](https://news.curve.fi/llamalend-telegram-bot/)

For the technical health calculation formula, see the [FAQ](./faq.md#how-is-health-calculated).

---

## How It Works: Two Stages

### Stage 1: Liquidation Protection

The **liquidation protection range** is a price zone defined by a higher and lower price of your collateral asset. For example, if ETH is trading at \$3,000, your liquidation protection range might be between \$3,200 and \$2,900. This range is determined by your Loan-To-Value Ratio (LTV) and the number of bands you selected when opening your loan.

When your collateral price drops into the liquidation protection range:
- Your position enters **liquidation protection**
- The system gradually converts your volatile collateral (ETH) into stable crvUSD as prices drop, and converts crvUSD back into ETH as prices recover
- This protects you from further price drops
- Losses occur while in protection (see [Understanding Losses](#understanding-losses))
- ❌ You cannot add collateral or borrow more while in liquidation protection

Conversion works both ways:
- **Prices drop**: ETH converts to crvUSD to protect you
- **Prices recover**: crvUSD automatically converts back to ETH, helping restore your position

The illustration below is a real example where the price of the collateral (ETH) dropped into the liquidation range between \$3,200 and \$2,900 where the collateral protection was active. As can be seen, the loan was not fully liquidated because the health always stayed above zero. Once the health of the position approached closer to 0, the user repaid some debt to increase it again to avoid full liquidation.

:::example
For a more detailed illustration which shows how the collateral of the loan is actually converted, see here: [How the System Works (Technical Details)](#how-the-system-works-technical-details).
:::

<figure>
  <ThemedVideo
    alt="Liquidation Protection (repay and no full liquidation)"
    sources={{
      light: require('@site/static/img/user/llamalend/15_chart.mp4').default,
      dark: require('@site/static/img/user/llamalend/15_chart.mp4').default,
    }}
    style={{ minWidth: '750px', width: '75%', display: 'block', margin: '0 auto' }}
  />
  <figcaption>
    This loan continuously entered and exited liquidation protection and stayed in it for quite some time (around 4 hours). The user constantly monitored its health and repaid some debt as soon as health got closer to 0%.
  </figcaption>
</figure>

### Stage 2: Full Liquidation

Full liquidation only happens when your **health reaches 0%**, not at a fixed price. At this point, your loan is completely closed and your collateral is lost. As long as health stays above 0%, you're protected from full liquidation.

Full liquidation can still happen during a price recovery if health is already critically low when inside the range.

The illustration below shows how a full liquidation works. The position entered liquidation protection where losses started occurring. Because the health of the loan reached 0 eventually, the position was fully liquidated. The user could have avoided it by repaying some debt to increase the health.

<figure>
  <ThemedVideo
    alt="Liquidation Protection (full liquidation)"
    sources={{
      light: require('@site/static/img/user/llamalend/27_chart.mp4').default,
      dark: require('@site/static/img/user/llamalend/27_chart.mp4').default,
    }}
    style={{ minWidth: '750px', width: '75%', display: 'block', margin: '0 auto' }}
  />
  <figcaption>
    This liquidation occurred during an extremely volatile market event. BTC price dropped around 15% in an hour. Because Llamalend uses smooth oracles, prices did not drop as sharply compared to the general market. Even though the position ended up being fully liquidated, liquidation protection gave the user around 40 minutes (200 blocks) to repay some debt to increase health again.
  </figcaption>
</figure>

---

## I'm in Liquidation Protection. What Now?

Being in liquidation protection doesn't mean you're liquidated. The system is actively protecting your position. Monitor your health constantly. As long as it stays above 0%, you're protected from full liquidation.

### What You Can Do

**Available Actions:**
- ✅ **Repay partial debt**: Increases health but doesn't exit protection
- ✅ **Repay full debt**: Closes loan and exits protection

**Repaying 99% of your debt does NOT exit liquidation protection. Only full repayment does.**

**Restricted Actions:**
- ❌ **Add/remove collateral**: Not possible in protection
- ❌ **Borrow more**: Not possible in protection

### How to Exit

You have two options:
1. **Wait for price recovery**: Price must rise above your protection range
2. **Fully repay debt**: Close the loan and open a new one

Repaying debt improves health but doesn't change the protection range boundaries. The range only adjusts when you're not in protection.

For more details, see the [FAQ](./faq.md#how-to-get-out-of-liquidation-protection).

---

## What Happens in Different Scenarios?

### Scenario 1: Price Above Protection Range

ETH at \$3,200, protection range is \$3,000-\$2,500

- ✅ You're safe: no losses in liquidation protection
- ⚠️ Health still decreases if ETH price drops or from interest
- ✅ You have full control: can add/remove collateral, borrow more

### Scenario 2: Price Inside Protection Range

ETH at \$2,750, protection range is \$3,000-\$2,500

- ⚠️ You're in liquidation protection
- ⚠️ System is converting ETH to crvUSD to protect you (as price drops)
- ⚠️ Losses occur while in protection (see [Understanding Losses](#understanding-losses))
- ⚠️ Health decreases from both price drops AND losses in liquidation protection
- ✅ If price recovers, system automatically converts crvUSD back to ETH, helping restore your position
- ❌ You cannot add/remove collateral or borrow more
- ✅ You can still repay debt to improve health

**Why losses still occur during recovery:** Until price climbs above the protection range, up-and-down price movements cause repeated conversions, which accumulate losses.

### Scenario 3: Price Below Protection Range

ETH at \$2,400, protection range is \$3,000-\$2,500. This is a special case where your loan was fully protected while moving through the entire liquidation range. At this point, all of your collateral would have been converted to crvUSD.

- ✅ No more losses in liquidation protection (if fully converted)
- ✅ Protected from further ETH price declines (because your entire collateral is now crvUSD)

Being below the protection range does NOT mean you're "safe". It means your entire position is now in crvUSD.

- ⚠️ Health only decreases from interest
- ⚠️ If price recovers back into range, you re-enter protection
- ⚠️ If price stays far below the range for a long time, interest alone can eventually push health to 0%

### Scenario 4: Health Reaches 0%

- ❌ Your loan is fully liquidated
- ❌ Loan is closed, collateral used to repay debt
- ❌ Cannot recover the position

---

## Understanding Losses

While in liquidation protection, you'll incur losses from conversions. This is the cost of protection, but it's much better than instant liquidation.

**Important: Losses reduce your total collateral value permanently.** If your loan enters liquidation protection with 10 ETH as collateral, stays in protection and takes losses, then exits protection, your total collateral will be less than 10 ETH (10 ETH minus the losses incurred during protection). This reduction in collateral value is permanent and does not recover even if prices fully recover.

**Losses depend on:**
- **Market volatility**: More volatility = more conversions = more losses
- **Time in range**: Longer time = more accumulated losses
- **Number of bands**: More bands typically mean fewer losses
- **Sideways volatility**: Repeated up-and-down price movement inside the range causes multiple conversions and increases losses

:::info
Losses in liquidation protection only occur when you're inside the protection range. Outside the range, no losses in liquidation protection occur, though health still decreases from price drops and interest. However, once losses have occurred, your total collateral value remains reduced even after exiting protection.
:::

For more on losses, see the [FAQ](./faq.md#what-are-the-losses-during-liquidation-protection).

---

## How the System Works (Technical Details)

### The Conversion Mechanism

When your collateral price drops into the liquidation protection range, the system automatically begins converting your collateral. This is powered by **LLAMMA** (Lending-Liquidating AMM Algorithm).

A quick overview of how it works:
- Collateral is deposited into **price bands** (small price ranges)
- As price moves through bands, collateral in those bands gets converted
- **Price moving down**: ETH converts to crvUSD to protect you
- **Price moving up**: crvUSD automatically converts back to ETH, restoring your position
- Each conversion involves a small discount to incentivize arbitrageurs

<figure>
  <ThemedVideo
    alt="Liquidation Protection"
    sources={{
      light: require('@site/static/img/user/llamalend/12_chart.mp4').default,
      dark: require('@site/static/img/user/llamalend/12_chart.mp4').default,
    }}
    style={{ minWidth: '750px', width: '75%', display: 'block', margin: '0 auto' }}
  />
</figure>

See how the collateral composition of bands changes based on the collateral price:

<CollateralConversion />

### Why Losses Occur

Liquidation protection mechanisms incur losses as a result of the conversion mechanism. The system offers collateral at a small discount to incentivize arbitrageurs. This discount ensures swaps happen, but means you receive slightly less value than market price.

**Loss factors:**
- **Number of bands**: More bands = wider range = slower conversion = typically smaller losses
- **Price volatility**: High volatility = more frequent conversions = more losses
- **Time in range**: Longer time = more conversions = more accumulated losses

---

## Common Misconceptions

- **"Being in liquidation protection means I'm liquidated."** → False. Being in liquidation protection means the system is defending your position, not that you've lost everything. However, your total collateral value will shrink due to losses (see [Understanding Losses](#understanding-losses)).

- **"If price goes up, health always goes up."** → False. Health can decrease even when prices are rising if you're still inside the protection range, because losses from conversions continue.

- **"Repaying part of my debt lets me exit protection."** → False. Only full repayment exits liquidation protection. Repaying 99% of your debt only increases health but doesn't exit protection.

- **"Below the protection range means I'm safe."** → False. While below the range, health only decreases from interest, but if price stays far below for a long time, interest alone can eventually push health to 0%.

- **"Losses stop when price goes up."** → False. Losses continue until you exit the protection range completely. Up-and-down price movements inside the range cause repeated conversions and accumulate losses.

---

For answers to common questions, see the [FAQ](./faq.md).
