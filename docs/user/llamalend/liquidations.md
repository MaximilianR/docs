---
id: liquidations
title: Liquidation Protection & Loan Health
sidebar_label: Liquidation Protection & Loan Health
---

import ThemedImage from '@theme/ThemedImage';

Curve's lending system is designed to protect your position during market volatility, unlike most other DeFi platforms that instantly liquidate positions when prices drop. Instead of a harsh "all-or-nothing" approach, Curve uses a range of collateral prices in which the protection against liquidation of the borrowed position will be implemented. This range is configured by the user when creating a position or can be set by default automatically. In this price range, the collateral is converted into a borrowed asset when the price decreases and vice versa when it recovers, which significantly reduces the risk of capital loss.


**⚠️ THE MOST IMPORTANT THING TO WATCH:** Your position's **health indicator** is the critical factor. **A full liquidation only happens when health reaches 0%** — not when the collateral price reaches a certain level. This means your collateral price can go up and down, and your position can remain in the liquidation protection zone for a long time, but as long as health stays above 0%, your position will not be fully liquidated.

Simply put: When the price of your collateral falls into the liquidation protection zone, the system begins to protect your position by gradually converting some of the volatile collateral into stable crvUSD. This creates a safety buffer that can help your position recover if prices bounce back. **Even If the collateral price falls into the liquidation protection range, your position will be preserved as long as the health is above zero percent. This will protect you from large losses in the event of liquidation on other credit protocols.**

This protective system gives borrowers more time and control compared to traditional liquidation methods.

todo: add different examples here. e.g. https://x.com/ilivinskiy/status/1949800748541210655

:::info "How Protection Works"
    The liquidation protection zone acts like a safety net. When your collateral price drops into this zone, the system starts protecting your position by gradually adjusting the collateral composition. This gives you time to either:
    
    - Let the system protect your position (it may recover automatically)
    - Repay part of your loan to improve your position
    - Close the position entirely
    
    Learn what actions you can take: [**Managing Your Position**](./guides/beginner/liquidation.md)
:::

---

## **Liquidation Protection Range**

The liquidation protection range is defined by two price points for your collateral asset: a high and a low. Your position enters protection mode when the collateral price drops into this zone.

**The size of this range depends on your bands:** The size of your liquidation protection zone depends on the number of bands you chose when creating your loan. The more bands you select (maximum 50, minimum 4), the bigger the protection zone. The fewer bands you choose, the narrower the zone.

- **More bands = Wider protection zone = lower risk**
- **Fewer bands = Narrower protection zone = higher risk**

<figure>
<ThemedImage
    alt="Mint and Lend Markets"
    sources={{
        light: require('@site/static/img/user/llamalend/education/liquidation/liq_range_light.png').default,
        dark: require('@site/static/img/user/llamalend/education/liquidation/liq_range_dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
/>
</figure>

!!!question "How does this compare to other protocols?"
    Most lending protocols instantly liquidate your entire position when the collateral price drops below a specific threshold. With crvUSD, your position isn't instantly liquidated. Instead, it enters protection mode and the system begins gradually adjusting the collateral composition to reduce risk. This gives you time to react—for example, by repaying part of the loan or letting the position potentially recover. Only if the position remains in the protection zone for too long and health reaches 0% will it be fully liquidated.

---

### **How does the liquidation protection process work?**

When your position enters the liquidation protection zone, the system begins protecting it by gradually adjusting the collateral composition. As the price of your collateral drops, portions of it are gradually converted to crvUSD. This creates a safety buffer by replacing part of the volatile asset with a stable one.

At this point, your position is backed by a mix of your original collateral and crvUSD. **If the price of your collateral increases again, the system automatically converts some of that crvUSD back to your original collateral** — a process called recovery.

This process may result in some temporary losses, but **it also allows your position to potentially recover**. If the price rebounds and position health remains above 0%, you retain your position (minus some temporary losses) — something that wouldn't be possible on other platforms where liquidation is instant and permanent.

### **How to get out of Liqudation Protection**



---

## **Understanding Losses**

When your position enters the liquidation protection zone, losses occur due to the constant change of your collateral composition. As the system gradually converts your volatile collateral into stable crvUSD, these composition changes result in losses that reduce the total value of your collateral.

These losses are hard to predict because they depend on multiple external factors such as market volatility, available liquidity, and the number of bands you chose. While volatility and liquidity are not really influenceable by you, **you have significant control over potential losses by choosing the number of bands when creating your loan**.

**Your Band Choice Matters:**
- **More bands = Fewer losses** in the liquidation protection zone
- **Fewer bands = Higher losses** in the liquidation protection zone

For example, having only 4 bands can result in quite high losses during liquidation protection, which can destroy your health very quickly. This is why band selection is such an important decision when creating your position.

Learn more about bands and how to customize them when creating a position [here](./guides/intermediate/custom-bands.md).

!!!question "Do losses always occur?"
    No. Losses occur **only** when your position is within the liquidation protection zone. As long as your position remains outside this zone, no losses are incurred, regardless of market conditions.

!!!warning "Important Note"
    These losses are not temporary - they are permanent reductions in your collateral value that occur during the liquidation protection process. The key is to monitor your position's health and take action before losses accumulate too much.

---

## **How Does Curve's Protection Compare to Other Protocols?**

Most DeFi lending protocols use a harsh liquidation model. In these systems, if the value of your collateral falls below a specific price threshold, your entire position is liquidated instantly. This often results in:

- Losing all your collateral permanently
- Paying additional liquidation penalties
- Having no chance to recover your position if the market bounces back

Curve's crvUSD takes a protective approach. **Here's how Curve protects you:**

- **No harsh liquidation threshold:** Instead of a sharp liquidation point, Curve uses a liquidation protection zone. Your position isn't instantly liquidated when a specific price is hit—instead, the system gradually protects your position as the price moves within the zone.

- **Gradual protection:** As the price drops into the liquidation protection zone, your collateral is partially converted into crvUSD (creating a safety buffer). If the price recovers, that crvUSD is used to buy back your original collateral — a process called recovery.

- **Your position stays protected if health remains above 0%:** As long as position health doesn't reach 0%, your position remains active and can recover. This means temporary price dips can be absorbed without permanently losing your collateral or paying liquidation fees.

- **More time, more control:** This protective mechanism gives you more time to manage your position. You can let the system protect you, repay debt, close the position, or adjust your strategy before any permanent liquidation happens.


The health of a loan indicates how well-collateralized it is and essentially shows how much of your collateral value can be decreased until a loan is fully liquidated.

The **health** of a loan is the most important—and ultimately the only—factor to monitor when it comes to liquidations. Once a loan’s health reaches **0%**, it becomes subject to **hard liquidation**. This results in the loan being closed and the collateral being removed. The borrower retains full control over the assets originally borrowed.

---

## **Out of Liquidation**

When a loan is not in liquidation, health can still decline due to two main factors:

- **Collateral price decrease:** A drop in the price of the collateral reduces loan health. The larger the decrease, the lower the health.
- **Interest (borrow) rate:** Interest accrues on the borrowed amount over time, gradually increasing the total debt and lowering loan health.

Conversely, if the price of the collateral increases, loan health improves.

---

## **In Liquidation**

Once a loan enters liquidation, loan health can no longer increase—it becomes strictly **down only** from that point onward. During this phase, the position is subject to **unpredictable losses** resulting from the ongoing rebalancing between the collateral asset and crvUSD.

These losses gradually reduce the loan’s health and are influenced by several external factors, including:

- **Loan configuration:** Parameters such as the number of bands and the loan’s position within the liquidation range affect how efficiently rebalancing occurs.
- **Collateral liquidity:** Illiquid assets are more prone to losses due to wider price spreads and less efficient arbitrage.
- **Market volatility:** Sudden or unpredictable price movements increase slippage and reduce the efficiency of liquidation mechanisms.
- **Other market dynamics**

Because loan health cannot recover while in liquidation, proactive monitoring and early adjustments—**before** entering the liquidation range—are critical to avoiding a **hard liquidation**.

---

## **Observing Loan Health**

While Curve’s unique liquidation mechanism offers greater flexibility and safety compared to other protocols, it is still crucial to monitor the health of a loan. **Positions can be fully liquidated once health reaches 0%.** To avoid this outcome, it is highly recommended to monitor loan status regularly and take action when needed.

To simplify this process, a dedicated [Telegram Bot](https://news.curve.finance/llamalend-telegram-bot/) has been developed to continuously track and monitor loan positions. Its features include:

- **Multi-Address Monitoring:** Track multiple wallet addresses simultaneously.
- **Cross-Chain Coverage:** Monitor positions across Ethereum, Arbitrum, Fraxtal, and Optimism.
- **Automated Health Checks:** Perform regular position checks every 5–10 minutes.
- **Prompt Alerts:** Receive notifications when a loan enters liquidation protection (soft-liquidation) or becomes eligible for liquidation (hard-liquidation).
- **On-Demand Information:** Access current on-chain data for monitored positions.

Check out this article for more information on how to set up the Telegram Bot: https://news.curve.finance/llamalend-telegram-bot/
