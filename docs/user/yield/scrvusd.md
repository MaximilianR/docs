---
title: Savings Vault (scrvUSD)
hide_title: true
---
import ButtonGrid from '@site/src/components/ButtonGrid';
import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ScrvusdLogo from '@site/static/img/logos/scrvUSD_s.png';
import InlinePill from '@site/src/components/InlinePill';
import ScrvusdSupply from '@site/src/components/LiveComponents/ScrvusdSupply';
import ScrvusdVaultAnimation from '@site/src/components/ScrvusdVaultAnimation';

# <img src={ScrvusdLogo} className="heading-inline-logo" alt="scrvUSD" /> Savings Vault (scrvUSD)

scrvUSD stands for “savings-crvUSD,” and works like a bank savings account for crvUSD. It is similar to other staked versions of USD stablecoins, such as sDAI, sUSDS, sUSDe, etc. Users can either stake their crvUSD to receive scrvUSD, or buy it directly on the market. Yield accrues automatically, increasing the value of their tokens over time.

scrvUSD is designed with minimal risk in mind. The underlying crvUSD deposited into the vault is not loaned out or deployed into other liquidity pools. Instead, it remains securely within the vault, minimizing risk for scrvUSD holders.

<ScrvusdVaultAnimation />

### Quick Links

<ButtonGrid buttonKeys={['gotoScrvusd']} />

---

## Guides

<GuideCardGrid guideKeys={['depositScrvusd', 'checkEarningsScrvusd', 'withdrawScrvusd']} />

---

## Current scrvUSD Stats

The following table pulls current data from <InlinePill icon="/img/logos/ethereum.png" label="Ethereum" />

<ScrvusdSupply />

## How scrvUSD Works: Earn Savings on Your crvUSD

Think of scrvUSD as a specialized savings account for your crvUSD stablecoins. When you deposit crvUSD, you receive scrvUSD tokens in return. Over time, your scrvUSD tokens will automatically increase in value, meaning each scrvUSD token will represent more crvUSD than what you deposited.

Here's how it works:

1.  **Deposit crvUSD:** Send your crvUSD to the scrvUSD vault and receive scrvUSD tokens back.
2.  **Hold scrvUSD:** Simply hold onto your scrvUSD tokens in your wallet. There's no need to stake or lock them.
3.  **Earn Interest:** As you hold scrvUSD, its value against crvUSD steadily increases. This means your scrvUSD tokens are worth more crvUSD over time, reflecting the interest earned.
4.  **Withdraw crvUSD:** You can withdraw your crvUSD at any time. You'll receive your initial crvUSD deposit plus all the interest you've earned.

### How Much Will You Earn?

The interest rate (or yield) for scrvUSD is variable and adjusts regularly, typically every few days. You can view the current and historical rates directly on the [scrvUSD UI](https://www.curve.finance/crvusd/ethereum/scrvUSD/).  
For a detailed explanation of the different rate numbers you see on the interface, please refer to our FAQ: [What do the different APR/APY numbers on the UI mean?](scrvusd.md#what-do-the-different-aprapy-numbers-on-the-ui-mean)

Generally, the interest rate earned by scrvUSD holders is set to roughly match the average crvUSD borrowing rate from the previous week across all [crvUSD minting markets](https://www.curve.finance/crvusd/ethereum/markets/). However, if more than 50% of the total crvUSD supply is held as scrvUSD, the yield may be slightly diluted. You can see the current amount of crvUSD held as scrvUSD on our [Current scrvUSD Stats](../curve-tokens/scrvusd.md#current-scrvusd-stats) page.

### Where Does the Interest Come From?

The interest paid to scrvUSD holders originates from the fees paid by users who mint crvUSD against their collateral. These users pay a continuous borrowing interest rate as long as their loan is open.

scrvUSD receives up to 50% of these borrowing fees, the remaining portion going to the Curve DAO.

### What's the catch, why does Curve give out free money?

scrvUSD plays a crucial role in maintaining crvUSD's peg to $1. Its mechanics are designed to support the stability of the crvUSD stablecoin, making it an integral part of the wider crvUSD ecosystem. Further details on this aspect are explained below.

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="scrvUSD dynamics"
    sources={{
      light: require('@site/static/img/charts/savings/scrvusd-dynamics.png').default,
      dark: require('@site/static/img/charts/savings/scrvusd-dynamics.png').default,
    }}
    style={{
      maxWidth: '800px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

---

## FAQ

### What do the different APR/APY numbers on the UI mean?

When you visit the [scrvUSD UI](https://www.curve.finance/crvusd/ethereum/scrvUSD/), you'll see a dashboard similar to this:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="scrvUSD statistics"
    sources={{
      light: require('@site/static/img/ui/savings/statistics-light.png').default,
      dark: require('@site/static/img/ui/savings/statistics-dark.png').default,
    }}
    style={{
      maxWidth: '933px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

This interface displays several different numbers about the scrvUSD yield. Here's a breakdown of what each number means:

  * **Current APY (Annual Percentage Yield):** This is current annual interest rate you would earn, taking into account the effect of **compounding** interest (where your earnings also start earning interest).
  * **APR (Annual Percentage Rate):** This shows the current annual interest rate **without** factoring in compounding.
  * **7-day MA APR (7-day Moving Average APR):** This is the average simple interest rate (APR, without compounding) calculated over the past 7 days. It helps to smooth out daily fluctuations.
  * **Average APR:** This figure shows the average simple interest rate (APR, without compounding) over a user-selected time window. For example, if "1M" (1 month) is chosen in the bottom right corner of the UI, this number will reflect the average APR for the last month.

### Do the rewards mean I get more scrvUSD tokens over time?

No, you will always have the **same number of scrvUSD tokens**. What happens is that **each scrvUSD token becomes worth more crvUSD** as time goes on. So, when you sell your scrvUSD back, you get more crvUSD than you put in.

### Where does the yield come from?

The extra crvUSD you earn comes from **fees paid by people who borrow crvUSD**. A part of these fees is collected and given to scrvUSD holders like you through the system.

### Is scrvUSD locked when I deposit?

No, your scrvUSD is **never locked up**. You can take it out or swap it back to crvUSD whenever you want, without any waiting.

### Can the value of scrvUSD go down?

**No, not in the way you might think.** scrvUSD is designed to **always increase in value compared to crvUSD** because it's constantly earning yield.

However, if you decide to trade your scrvUSD for crvUSD (or another token) on a decentralized exchange (DEX) on any network, the actual price you get might be slightly less than its perfect theoretical value. This can happen because of how much crvUSD is available to trade at that moment (liquidity) or general market activity.

Also, it's always important to remember that while Curve uses the highest standards when creating its smart contracts, using any decentralized finance (DeFi) application, including scrvUSD, involves some risks. You can learn more about these risks here: [scrvUSD risks](../security/risks/scrvusd.md).

### I have scrvUSD on an L2, does it still earn interest?

Yes, absolutely! scrvUSD earns interest no matter which blockchain network it's on (like Ethereum, or an L2 such as Polygon or Arbitrum).

However, remember that the main scrvUSD vault for depositing and withdrawing is **only on Ethereum**. So, if your scrvUSD is on another network and you want to turn it back into crvUSD from the main vault, you'll need to either:

  * Move your funds back to the Ethereum network (this is called "bridging").
  * Or, you can simply swap your scrvUSD for crvUSD (or any other token) directly on Curve on the network you are currently on.
