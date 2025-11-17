---
id: liquidation-protection
title: Liquidation Protection & Loan Health
sidebar_label: Liquidation Protection & Health
---

import ThemedImage from '@theme/ThemedImage';
import CollateralConversion from '@site/src/components/CollateralConversion';
import ThemedVideo from '@site/src/components/ThemedVideo';


Curve's liquidation protection system is fundamentally different from traditional lending protocols. **Instead of instantly liquidating your position at a fixed price point, Curve protects your loan gradually over a price range.** This gives you time to react and manage your position, rather than facing sudden, complete liquidation.

Here's how it works in two stages:

1. **Liquidation Protection** (also called "In Liquidation"): When your collateral price drops into the liquidation protection range, Llamalend automatically starts converting your volatile collateral (like ETH) into stable crvUSD. This protects your total loan collateral from further value declines. While this causes small losses that reduce your health, it gives you crucial time to react and can fully protect you from additional downside.
2. **Full Liquidation**: Complete liquidation only happens when your health reaches 0%, not at a fixed price point like other protocols.

:::info
**The key benefit: The health factor protects you.** As long as your health stays above zero, your position is protected from full liquidation. This system replaces the instant liquidations used by other protocols, giving you a crucial window to manage your loan and maintain control. **You get time to react, not instant liquidation.**
:::

---

## Simple Explainer

**The main difference: Your position isn't liquidated instantly at a specific price like other protocols do.**

Instead, Curve uses a **liquidation protection range**, a price range where your collateral is gradually converted to protect your loan, rather than being suddenly sold off all at once.

When the price of your collateral drops into this protection range, your position enters "soft liquidation" mode. During this time, your collateral (like ETH) is slowly converted into stablecoins (crvUSD) to protect your position from a full liquidation. **The system is actively protecting you, not instantly liquidating you.**

**Importantly, the conversion works both ways:** If prices recover and move back up through the protection range, the system automatically converts the crvUSD back into your original collateral (like ETH). This means your position can automatically improve and potentially restore itself if market conditions recover—something that's impossible with instant liquidation systems.

Your **health** (a safety measure) decreases whenever your collateral value decreases relative to your debt. This happens in two ways:
- **Outside the protection range**: Health decreases when the collateral price drops, as your collateral becomes less valuable
- **Inside the protection range**: Health decreases from conversion losses from the protection mechanism

If your health eventually drops to 0%, your position is fully liquidated. But as long as health stays above 0%, you're protected.

**Why this is better:** Unlike other protocols that liquidate you instantly at a fixed price, Curve gives you time. The gradual conversion protects you while prices are falling, and if prices recover, your position can automatically improve as stablecoins convert back to your original collateral.

:::info
**Example:** Let's say your loan uses ETH as collateral, with a liquidation protection range between \$3,000 and \$2,500.

- **ETH above \$3,000**: You are outside the protection range → no conversion losses occur, but your health still decreases if ETH price drops (as your collateral becomes less valuable).
- **ETH between \$3,000 and \$2,500**: You are inside the protection range → the system gradually converts ETH to crvUSD to protect you. Small losses occur and your health decreases, but you're being protected from further price drops. **If ETH price recovers and moves back up through this range, the system automatically converts crvUSD back to ETH, helping restore your position.**
- **ETH below \$2,500**: You are outside the range again → no further losses from conversions occur.
  - If your health is still above 0%, your loan remains open and you're protected from further ETH price declines.
  - If the price goes back up above \$2,500 while health is still low, you re-enter liquidation protection and the system continues protecting you (converting crvUSD back to ETH as prices rise).

**The benefit:** Even if prices crash below your range, as long as your health is above 0%, you're protected. Other protocols would have liquidated you instantly.
:::

**Quick summary:**

- ✅ **Outside the protection range** → no conversion losses occur, but health decreases if collateral price drops
- ⚠️ **Inside the protection range** → gradual losses occur as the system protects you (soft liquidation)
- ❌ **Health reaches 0%** → full liquidation (but you had time to prevent this)

To understand how this works in more detail (with examples and diagrams), see the [Detailed Explainer](#detailed-explainer).

## Best Practices: How to Use Liquidation Protection

Llamalend's liquidation protection system gives you flexibility and control that other protocols don't offer. You can use various strategies when borrowing assets, depending on your risk appetite and goals. **The key advantage is that you have options and time to react, rather than facing instant liquidation.** Here are the main approaches to consider:

### Treat Entry into Liquidation Protection as Your Liquidation Price

The most straightforward and safest approach is to treat the entry point into liquidation protection as your effective liquidation price (even though full liquidation only occurs when health reaches 0%). As your position approaches the liquidation protection range, you should become increasingly vigilant. 

**Recommended actions:**
- **Before entering protection**: Repay some debt to push the liquidation range further away from the current price, giving yourself more safety margin.
- **If already in protection**: Fully repay your debt, close the loan, and open a new position. Note that repaying only part of your debt will not get you out of liquidation protection—you must fully close the loan (see [I'm in Liquidation Protection. What Now?](#im-in-liquidation-protection-what-now) for more details).

This conservative approach provides a comfortable buffer and gives you time to manage your position before entering protection mode.

### Staying in Liquidation Protection

Another option is to remain in liquidation protection and wait for prices to recover. **This is only possible because Curve gives you time—other protocols would have liquidated you instantly.** While this is not inherently bad, it's important to understand the implications:

- **Losses accumulate**: Conversion losses occur continuously while in protection, gradually decreasing your total collateral value. However, these losses are the cost of protection—much better than instant liquidation.
- **It's a bet on recovery**: By staying in protection, you're essentially betting that the collateral price will increase enough to exit the range. The system will automatically help restore your position if prices recover.
- **Health monitoring is critical**: If you choose this approach, you must actively monitor your loan's health and be prepared to repay debt if health approaches zero.


Visualization of how collateral converts and health changes while staying in liquidation protection. The system continuously adjusts your position as prices move through the protection range, with losses accumulating over time:

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

This strategy requires active monitoring and carries higher risk, but can be viable if you believe prices will recover quickly. **The key advantage: You have this option at all, which other protocols don't offer.** 


## I'm in Liquidation Protection. What Now?

**Good news: Being in liquidation protection doesn't mean you're liquidated.** Unlike other protocols where you'd be instantly liquidated, Curve's system is actively protecting your position. However, your available actions are limited due to the protocol's mechanics, and losses accumulate while you're in the range.

**The most important thing:** Either exit liquidation protection or constantly monitor your health to ensure it doesn't drop to 0%. As long as your health stays above 0%, you're protected from full liquidation.

### How Do I Exit Liquidation Protection?

A loan can only exit the liquidation protection range if the collateral price moves outside the range again. This is important to understand:

- **Repaying debt improves health** but does **not** change the liquidation range boundaries. The range boundaries only adjust when debt is repaid while you are **not** in liquidation protection.
- **Adding collateral is completely impossible** while in liquidation protection—this action is restricted by the protocol.
- **The only way to exit** is for the price to recover and move back above your liquidation protection range, or to fully repay your debt and close the loan.

If you want to exit protection mode, you have two options: wait for prices to recover naturally, or fully repay your debt and open a new position.

### What Actions Can I Do?

While in liquidation protection, your available actions are severely limited:

- **Restricted Actions:**
  - **Collateral actions**: You cannot add or remove any collateral
  - **Borrowing**: You cannot borrow additional debt

- **Available Actions:**
  - **Repay partial debt**: This increases your health but does not exit liquidation protection
  - **Repay full debt**: This closes the loan completely and exits liquidation protection

The only action you can take to improve your position is repaying debt. Even repaying 99% of your debt will only increase health—it will not get you out of liquidation protection. Only full repayment and loan closure will exit protection mode.

### Losses in Liquidation Protection

**Important to understand:** While a loan is within the liquidation protection range, you will incur losses that reduce the total value of your collateral. These losses occur because the system continuously converts your collateral between volatile assets (like ETH) and crvUSD to protect you. **This is the cost of protection—but it's much better than instant liquidation.**

Losses depend on several factors:
- **Market volatility**: Higher volatility means more frequent conversions, leading to more accumulated losses
- **Liquidity conditions**: Market liquidity affects the execution price of conversions
- **Time in range**: The longer you stay in liquidation protection, the more conversions occur and the more losses accumulate
- **Number of bands**: The number of bands you selected when opening the loan significantly influences potential losses. More bands typically mean fewer losses, while fewer bands mean higher risk of larger losses

Because losses depend on these dynamic factors, it's **not possible to precisely predict how big the losses will be**. This makes it especially important to monitor your loan's health closely when it approaches or enters the liquidation protection range.

**Important distinction:** Conversion losses (from the protection mechanism) only occur when you're inside the liquidation protection range. However, your health still decreases when collateral price drops, even outside the range, because your collateral becomes less valuable relative to your debt. As long as your loan remains outside this range, no conversion losses are incurred from the protection mechanism, regardless of market conditions. **Compare this to other protocols where you'd be instantly liquidated with no protection at all.**

:::info
**Remember:** Conversion losses (from the protection mechanism) occur only when a loan is within the liquidation protection range. However, your health will still decrease if your collateral price drops, even outside the range, because your collateral value decreases relative to your debt. As long as the loan remains outside this range, no conversion losses are incurred from the protection mechanism, regardless of market conditions. This is a major advantage over instant liquidation systems.
:::

---

## Detailed Explainer

Curve's liquidation protection system operates fundamentally differently from traditional lending protocols. Instead of waiting for a specific price threshold and then instantly liquidating a position, Curve uses a **gradual, protective conversion mechanism** that activates within a price range.

When a user's collateral price drops into the [liquidation protection range](./faq.md#what-is-the-liquidation-protection-range), the system automatically begins a protective process. The system starts converting volatile collateral (e.g., ETH, BTC) into stable crvUSD gradually as the price moves through the protection range. The deeper the price falls within the range, the more collateral gets converted. If the price is at the top of the range, only a small portion converts. As it moves toward the bottom, more and more collateral becomes crvUSD.

The conversion isn't one-way. If prices recover and move back up through the range, the system automatically converts crvUSD back into the original collateral, potentially restoring the position. As long as the price remains within the protection range, the system continues to adjust the collateral composition, always working to protect against further downside.

This mechanism creates several advantages over traditional liquidation systems: no instant liquidation (users get time to react), automatic risk management (positions are actively protected), recovery potential (positions can automatically restore themselves), and reduced slippage (gradual conversion typically results in better execution than instant liquidation at a single price point).

Below is a simple animation showing this process. The user's protection range is set to \$3920-\$4080. Watch how the collateral changes as the price moves through this range.

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

The conversion mechanism is powered by Curve's LLAMMA (Lending-Liquidating AMM Algorithm). When the collateral price drops into the liquidation protection range, the system detects this and begins monitoring. The collateral is organized into price bands, and as the price moves through different bands, the collateral in those bands gets converted automatically through the AMM mechanism.

The conversion isn't instant—it happens continuously as the price moves. If the price is moving down, more ETH (or other collateral) converts to crvUSD. If the price moves back up, crvUSD converts back to ETH. Each conversion involves a small discount (slippage) to incentivize arbitrageurs to execute the swap. These small losses accumulate and reduce the loan's health. Throughout this process, the loan's health decreases. As long as health stays above 0%, the position remains protected.

<CollateralConversion />

The **health factor** is the critical metric that determines whether your position can be fully liquidated. Health represents how much buffer you have before full liquidation, calculated based on your collateral value (in both volatile assets and crvUSD), your debt amount, and the current market prices.

**How health changes:**
- **Above the protection range**: Health decreases when your collateral price drops (as your collateral becomes less valuable), but no conversion losses occur. Health also decreases from interest accumulation on your debt.
- **Inside the protection range**: Health decreases from both price drops AND conversion losses. The rate depends on price volatility and the number of bands. Conversion losses occur continuously as collateral swaps between volatile assets and crvUSD.
- **Below the protection range** (if fully converted): Health only decreases from interest accumulation, providing protection from further price declines since your collateral is now stable crvUSD.

When health reaches 0%, the position becomes eligible for full liquidation. Anyone can repay the debt and claim the collateral.

Here are some real-world scenarios to illustrate how this works:

**Gradual Price Decline**: Imagine you have an ETH loan with a protection range of \$3,000-$2,500. At $3,200, you're outside the range and your position is safe—no conversion losses occur, but if ETH price drops, your health decreases as your collateral becomes less valuable. When ETH drops to \$3,000, you enter the protection range and the system starts converting ETH to crvUSD gradually. As ETH continues to \$2,700, more ETH converts to crvUSD and your health decreases due to both the price drop AND conversion losses, but your position is being protected. If ETH recovers to \$2,900, the system converts crvUSD back to ETH and your position improves, though you've incurred some losses.

**Rapid Price Drop**: With the same loan, if ETH crashes from \$3,200 to \$2,400, you've moved through the entire protection range quickly. Most of your ETH has been converted to crvUSD and you're now below the range. While below the range with fully converted collateral, you're protected from further ETH price declines—your health only decreases from interest. If ETH recovers to \$2,600, you re-enter the protection range and the system starts converting crvUSD back to ETH, but you're still in protection mode.

**Price Volatility Within Range**: If ETH oscillates between \$2,800-$2,900, you're inside the protection range and the price is moving up and down. Each time collateral swaps (in either direction), small losses occur. Your health continues to decrease even if the price is recovering, because the conversions themselves cause losses. Extended time in the protection range with high volatility can cause health to reach 0% even if prices are relatively stable.

It's crucial to understand that the protective swapping of collateral is what incurs losses. These losses are not fees—they're the result of the conversion mechanism. The system offers collateral for sale at a small discount to incentivize arbitrageurs. This discount ensures the swap happens, but it means you receive slightly less value than the market price. Each swap (ETH→crvUSD or crvUSD→ETH) incurs this small loss.

Loss factors include the number of bands (more bands = wider range = slower conversion = typically smaller losses), price volatility (high volatility means more frequent conversions = more losses), and time in range (longer time in protection range = more conversions = more accumulated losses). Conversion losses only occur when you're inside the protection range. Outside the range, no conversion happens, so no conversion losses occur from the protection mechanism. However, your health still decreases if your collateral price drops, as your collateral value decreases relative to your debt.

Compared to traditional liquidation systems, Curve's approach offers gradual conversion over a price range instead of liquidating at a fixed price point, a continuous gradual process instead of instant all-or-nothing liquidation, automatic recovery if prices improve instead of no recovery possible, time for users to monitor and act instead of no time to react, gradual health decreases instead of instant drops to 0%, and partial protection through the range instead of full position loss at threshold.

Key takeaways: Liquidation protection is automatic—once your price enters the range, the system protects you without requiring action. Health is the critical metric—monitor it continuously, and as long as it's above 0%, you're protected from full liquidation. Losses are inevitable in protection—the conversion mechanism causes losses, but these are the cost of protection. The alternative (instant liquidation) would be worse. Recovery is possible—if prices recover, your position can automatically improve as crvUSD converts back to collateral. Time matters—extended time in the protection range increases losses, so consider repaying debt or closing the position if you're stuck in protection mode. Band choice matters—more bands typically mean fewer losses but require more collateral, while fewer bands mean higher risk but less capital requirement.

For answers to common questions about liquidation protection, see the [FAQ](./faq.md).
