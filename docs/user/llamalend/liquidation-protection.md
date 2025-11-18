---
id: liquidation-protection
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

:::important
**The Golden Rule**: Monitor your health constantly. As long as it's above 0%, you're protected from full liquidation.

For answers to common questions, see the [FAQ](./faq.md).
:::

---

## The Simple Idea

Other protocols are like a trapdoor: if your collateral price hits a certain point, you instantly lose everything. Curve is like a safety net that gradually activates, giving you time to react.

Instead of instant liquidation at a fixed price, Curve protects your loan gradually over a price range. When your collateral price drops into the **liquidation protection range**, the system automatically starts converting your volatile collateral (like ETH) into stable crvUSD. This protects you from further price declines while giving you time to manage your position.

Conversion works both ways. When prices drop, your collateral converts to crvUSD to protect you. When prices recover, the system automatically converts crvUSD back to your original collateral, helping restore your position. This automatic recovery is impossible with instant liquidation systems. Once you're liquidated elsewhere, you're done. With Curve, your position can automatically improve as market conditions recover.

:::info
You get time to react, not instant liquidation. Your position can automatically restore itself when prices recover.
:::

---

## How It Works: Two Stages

### Stage 1: Liquidation Protection

When your collateral price drops into the liquidation protection range:
- Your position enters **liquidation protection**
- The system gradually converts your volatile collateral (ETH) into stable crvUSD as prices drop, and converts crvUSD back into ETH as prices recover
- This protects you from further price drops
- Small losses occur, but you have time to react

Conversion works both ways:
- **Prices drop**: ETH converts to crvUSD to protect you
- **Prices recover**: crvUSD automatically converts back to ETH, helping restore your position

This automatic recovery is a major advantage: your position can survive without any action from you, something impossible with instant liquidation systems.

### Stage 2: Full Liquidation

Full liquidation only happens when your **health reaches 0%**, not at a fixed price. At this point, your loan is completely closed and your collateral is lost. As long as health stays above 0%, you're protected from full liquidation.

---

## Understanding Health: Your Safety Gauge

Health is like a fuel gauge for your loan. It shows how much buffer you have before full liquidation.

### What Health Means

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
Health can decrease even when prices are rising if you're in liquidation protection, because losses in liquidation protection occur regardless of price direction. If you're in liquidation protection and your health is very low, you can get fully liquidated despite the price only going up (because losses were bigger than the price appreciation).
:::

### How to Monitor Health

- **In the UI**: View your health percentage in the [Llamalend UI](https://www.curve.finance/llamalend/ethereum/markets)
- **Telegram Bot**: Get automated alerts via the [Llamalend Telegram Bot](https://news.curve.fi/llamalend-telegram-bot/)

For the technical health calculation formula, see the [FAQ](./faq.md#how-is-health-calculated).

---

## What Happens in Different Scenarios?

### Scenario 1: Price Above Protection Range

**Example**: ETH at $3,200, protection range is $3,000-$2,500

- ✅ You're safe: no losses in liquidation protection
- ⚠️ Health still decreases if ETH price drops or from interest
- ✅ You have full control: can add/remove collateral, borrow more

### Scenario 2: Price Inside Protection Range

**Example**: ETH at $2,750, protection range is $3,000-$2,500

- ⚠️ You're in liquidation protection
- ⚠️ System is converting ETH to crvUSD to protect you (as price drops)
- ⚠️ Small losses occur with each conversion
- ⚠️ Health decreases from both price drops AND losses in liquidation protection
- ✅ If price recovers, system automatically converts crvUSD back to ETH, helping restore your position
- ❌ You cannot add/remove collateral or borrow more
- ✅ You can still repay debt to improve health

This automatic recovery is unique to Curve. Other protocols would have liquidated you instantly with no chance of recovery.

### Scenario 3: Price Below Protection Range

**Example**: ETH at $2,400, protection range is $3,000-$2,500. This is a special case where your loan was fully protected while moving through the entire liquidation range. At this point, all of your collateral would have been converted to crvUSD.

- ✅ No more losses in liquidation protection (if fully converted)
- ✅ Protected from further ETH price declines (because your entire collateral is now crvUSD)
- ⚠️ Health only decreases from interest
- ⚠️ If price recovers back into range, you re-enter protection

### Scenario 4: Health Reaches 0%

- ❌ Your loan is fully liquidated
- ❌ Loan is closed, collateral used to repay debt
- ❌ Cannot recover the position

---

## Best Practices

### Conservative Approach: Treat Entry as Your Liquidation Price

This approach is **recommended for most users**: Treat the entry point into liquidation protection as your effective liquidation price. This gives you a comfortable safety buffer.

**What to do:**
- **Before entering protection**: Repay some debt or add more collateral to push the range further away
- **If already in protection**: Fully repay and open a new position.

### Aggressive Approach: Stay in Protection

This approach includes **higher risk and requires active monitoring**: Remain in liquidation protection and wait for prices to recover.

**What to know:**
- Losses accumulate continuously
- You're betting on price recovery
- **The system will automatically help restore your position** if prices recover (crvUSD converts back to collateral)
- Must actively monitor health
- Be prepared to repay if health approaches zero

Here's a real example of what it looks like:

<figure>
  <ThemedVideo
    alt="Liquidation Protection"
    sources={{
      light: require('@site/static/img/user/llamalend/15_chart.mp4').default,
      dark: require('@site/static/img/user/llamalend/15_chart.mp4').default,
    }}
    style={{ minWidth: '750px', width: '75%', display: 'block', margin: '0 auto' }}
  />
</figure>

---

## I'm in Liquidation Protection. What Now?

Being in liquidation protection doesn't mean you're liquidated. The system is actively protecting your position. Monitor your health constantly. As long as it stays above 0%, you're protected from full liquidation.

### What You Can Do

**Available Actions:**
- ✅ **Repay partial debt**: Increases health but doesn't exit protection
- ✅ **Repay full debt**: Closes loan and exits protection

**Restricted Actions:**
- ❌ **Add/remove collateral**: Not possible in protection
- ❌ **Borrow more**: Not possible in protection

Even repaying 99% of your debt won't get you out of protection. Only full repayment closes the loan.

### How to Exit

You have two options:
1. **Wait for price recovery**: Price must rise above your protection range
2. **Fully repay debt**: Close the loan and open a new one

Repaying debt improves health but doesn't change the protection range boundaries. The range only adjusts when you're not in protection.

For more details, see the [FAQ](./faq.md#how-to-get-out-of-liquidation-protection).

### Understanding Losses

While in liquidation protection, you'll incur losses from conversions. This is the cost of protection, but it's much better than instant liquidation.

**Losses depend on:**
- **Market volatility**: More volatility = more conversions = more losses
- **Time in range**: Longer time = more accumulated losses
- **Number of bands**: More bands typically mean fewer losses

:::info
Losses in liquidation protection only occur when you're inside the protection range. Outside the range, no losses in liquidation protection occur, though health still decreases from price drops and interest.
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

This bidirectional conversion allows your position to automatically improve as prices recover, without requiring any action from you.

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

<CollateralConversion />

### Why Losses Occur

Liquidation protection mechanisms incurs losses and are the result of the conversion mechanism. The system offers collateral at a small discount to incentivize arbitrageurs. This discount ensures swaps happen, but means you receive slightly less value than market price.

**Loss factors:**
- **Number of bands**: More bands = wider range = slower conversion = typically smaller losses
- **Price volatility**: High volatility = more frequent conversions = more losses
- **Time in range**: Longer time = more conversions = more accumulated losses

---

For answers to common questions, see the [FAQ](./faq.md).
