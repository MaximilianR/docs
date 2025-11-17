---
id: faq
title: FAQ
sidebar_label: FAQ
---

import ThemedImage from '@theme/ThemedImage';
import ThemedVideo from '@site/src/components/ThemedVideo';

## What is the Liquidation Protection Range?

A user's **liquidation protection range** is a price zone for their collateral defined by a high and a low point. Their loan enters protection mode if the market price of their collateral drops into this zone.

The range's position and size are each controlled by a key factor:

**Where the Range Sits (Position)**: The location of the range is set by the **Loan-To-Value Ratio** (LTV):

* A **higher LTV** moves the protection range **closer** to the current market price.
* A **lower LTV** keeps the range **further away**, giving users a larger safety margin before protection mode kicks in.

**How Wide the Range Is (Size)**: The width of the range is set by the number of **bands** users choose when opening a loan:

* **More bands** (e.g., 20-50) = **Wider** protection range = Lower risk.
* **Fewer bands** (e.g., 4-10) = **Narrower** protection range = Higher risk.

## What are Bands?

Bands are small price ranges where all user collateral is grouped together.  Using bands makes Llamalend more efficient, because it can convert one piece of collateral for all users at single time, instead of each user requiring their own separate conversion.  Bands are only shown under the `Advanced view` on Llamalend:

<figure>
<ThemedImage
    alt="Liquidation protection range visualization"
    sources={{
        light: require('@site/static/img/user/llamalend/ui/bands-light.png').default,
        dark: require('@site/static/img/user/llamalend/ui/bands-dark.png').default,
    }}
    style={{ width: '100%', maxWidth: '1078px', display: 'block', margin: '0 auto' }}
/>
</figure>

## What is Loan Health and How Does It Decrease?

**Health is the most important metric to monitor** because it determines when a loan will be fully liquidated. Users should always keep track of their loan's health, regardless of market conditions.

**Health decreases due to:**

- **Collateral price drops**: Above the Liquidation Protection range, health will decrease as the range gets closer
- **Losses in Liquidation Protection**: To swap collateral in Liquidation Protection, it's offered for sale at a small discount to the current price, this means each swap causes a small loss and health reduction
- **Borrowing more funds**: Taking on additional debt reduces health
- **Interest accumulation**: Interest is "charged" every second by gradually increasing the debt, constantly decreasing health (albeit very slowly)

For tips on monitoring and preventing health issues, see [How Can Users Monitor and Prevent Problems?](#how-can-users-monitor-and-prevent-problems).

## What are the Losses During Liquidation Protection?

When a position enters the liquidation protection zone, losses occur due to the constant change of collateral composition. The system gradually converts volatile collateral into stable crvUSD by offering it for sale at a discount to the current price. This results in losses.

The exact amount of loss is hard to predict as it depends on external factors like market volatility and liquidity. However, the most significant factor is one users can control: **the number of bands they select for their loan.**

### Band Choice Impact

- **More bands = Bigger Range = Fewer losses**: Spreading collateral across many bands creates a wide protection range. This gives the system more time to gradually convert collateral during a price drop, which typically results in **smaller losses**.
- **Fewer bands = Smaller Range = Higher losses**: Fewer bands concentrates collateral over a very small protection range. This works fine when prices move very slowly. However, a sudden price drop can force the system to sell collateral very quickly, leading to **higher losses** and increasing the risk of full liquidation.

Learn more about bands and how to customize them when creating a position [here](./guides/borrow/custom-bands.md).

:::info Do losses always occur?
No. Losses occur **only** when a position is within the liquidation protection zone. As long as a position remains outside this zone, no losses are incurred, regardless of market conditions.
:::

:::warning Important Note
These losses are not temporary - they are permanent reductions in collateral value that occur during the liquidation protection process. The key is to monitor a position's health and take action before losses accumulate too much.
:::

## When Does a Loan Enter Liquidation Protection?

A loan enters liquidation protection when the price of the collateral asset falls into the liquidation protection range.

<figure>
<ThemedImage
    alt="Liquidation protection range visualization"
    sources={{
        light: require('@site/static/img/user/llamalend/education/liquidation/liq_range_light.png').default,
        dark: require('@site/static/img/user/llamalend/education/liquidation/liq_range_dark.png').default,
    }}
    style={{ width: '500px', display: 'block', margin: '0 auto' }}
/>
</figure>

## What Can Users Do When Their Loan is in Liquidation Protection?

While a loan is in liquidation protection, the actions users can take are limited. The most important metric to watch is the loan's health. If a loan is NOT in liquidation protection, users have all possibilities and there are no restrictions at all.

**Restricted Actions:**
- **Collateral actions**: Users cannot add or remove any collateral
- **Borrowing**: Users cannot borrow any more funds

**Available Actions:**
- **Debt repayment**: Users can repay some or all of the debt

**Important Understanding:**
Only repaying all of the debt and therefore fully closing the loan will get users out of liquidation protection. Repaying some debt (even if it's 99% of all their debt) will only increase the health of the loan, but will not get the loan out of liquidation nor change the liquidation range.

## Can a Position Recover from Liquidation Protection?

:::info Recovery and Time Flexibility
**Important Understanding**: If prices recover while users are in liquidation protection, they can theoretically return to their original state (minus some losses due to the liquidation protection process). The system gives users more time to act because there's no instant liquidation, but there's actually no need to act at all.

**Key Point**: Users can theoretically stay in liquidation protection forever as long as they ensure their health stays above 0. The system will continue protecting their position automatically, and if market conditions improve, their position can recover without any manual intervention.
:::

<figure>
  <ThemedVideo
    alt="Liquidation Protection"
    sources={{
      light: require('@site/static/img/user/llamalend/liq-prot-recover-light.mp4').default,
      dark: require('@site/static/img/user/llamalend/liq-prot-recover-dark.mp4').default,
    }}
    style={{ minWidth: '550px', width: '75%', display: 'block', margin: '0 auto' }}
  />
</figure>

Note that above, when collateral is swapped, users lose health, regardless if prices are increasing or decreasing. So health can go to 0 even if prices are increasing.  

## What happens underneath the Liquidation Protection Range?

If the price goes lower than the Liquidation Protection range with positive health and fully converted collateral, users are completely safe from further price declines. While underneath the range, health will only decline from debt increasing from interest on the loan.

<figure>
  <ThemedVideo
    alt="Liquidation Protection"
    sources={{
      light: require('@site/static/img/user/llamalend/liq-prot-under-range-light.mp4').default,
      dark: require('@site/static/img/user/llamalend/liq-prot-under-range-dark.mp4').default,
    }}
    style={{ minWidth: '550px', width: '75%', display: 'block', margin: '0 auto' }}
  />
</figure>

If users get here, it's normally best to repay the loan and reopen it, because there is a very high chance of liquidation from collateral conversion losses if they go back up through the Liquidation Protection range.

## How Do Users Get Out of Liquidation Protection?

Because user actions during liquidation protection are partially restricted, the only way to get a loan out of liquidation protection mode is to fully repay the loan and open up a new one.

**Key Points:**
- Adding collateral is restricted
- Even repaying 99% of the debt will not get the loan out of liquidation protection
- Only full debt repayment and loan closure will exit liquidation protection mode

## What Happens When a Loan's Health Reaches 0?

**Important**: Full Liquidation only occurs when health reaches 0. As long as health stays above 0, even by a tiny amount, a position remains protected and can potentially recover if market conditions improve.

When health reaches 0, a loan becomes eligible for liquidation, meaning anyone can repay the debt and claim the collateral in return.

## How Can Users Change Their Liquidation Protection Range?

The liquidation protection range can only be changed if a loan is currently not in liquidation. If a loan IS in liquidation mode, the only option is to fully repay the loan and create a new one.

**Collateral Actions:**
- **Adding more collateral**: Pushes the liquidation ranges down (e.g., from $1000-$900 to $800-$700)
- **Removing collateral**: Pushes the liquidation range further up (e.g., from $1000-$900 to $1100-$1000)

**Debt Actions:**
- **Borrowing more**: Pushes the liquidation range further up
- **Repaying some debt**: Pushes the liquidation range down
- **Repay all debt**: Fully closes the loan (no liquidation range anymore)

**Rule of Thumb**: The higher the LTV of the loan gets, the closer the liquidation range gets to the current market price.

## Why Are Actions Restricted in Liquidation Protection Mode?

Users are not able to add or remove collateral because the loan is already in liquidation protection and the collateral is currently being protected through Llamalend. The nature of the system does not allow any collateral actions when the position is in liquidation range, as this is a unique situation where the collateral is being actively protected.

## How Can Users Monitor and Prevent Problems?

While Curve's liquidation mechanism offers greater flexibility and safety, it is still crucial to monitor the health of a loan. **Positions can be fully liquidated once health reaches 0.** To avoid this outcome, it is highly recommended to monitor loan status regularly and take action when needed.

To simplify this process, a dedicated [Telegram Bot](https://news.curve.fi/llamalend-telegram-bot/) has been developed to continuously track and monitor loan positions.

**Bot Features:**
- **Multi-Address Monitoring**: Track multiple wallet addresses simultaneously
- **Cross-Chain Coverage**: Monitor positions across Ethereum, Arbitrum, Fraxtal, and Optimism
- **Automated Health Checks**: Perform regular position checks every 5–10 minutes
- **Prompt Alerts**: Receive notifications when a loan enters liquidation protection (soft-liquidation) or becomes eligible for liquidation (hard-liquidation)
- **On-Demand Information**: Access current on-chain data for monitored positions

Check out this article for more information on how to set up the Telegram Bot: [Llamalend Telegram Bot](https://news.curve.fi/llamalend-telegram-bot/)
