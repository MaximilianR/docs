---
search:
  exclude: true
---

# Loan Concepts

## Liquidation

LLAMMA (Lending-Liquidating AMM Algorithm) is the engine behind Curve's crvUSD liquidation mechanism. It's a two-token AMM—similar in structure to Uniswap V3—that manages collateral and crvUSD within a system of price "bands" (also called ticks). These bands define a loan's liquidation range and are key to how LLAMMA automatically protects positions.

A full comparison of borrowing on Curve vs. other protocols can be found [here](./overview.md#comparison-to-other-protocols).

When a loan is opened, collateral is distributed across a specified number of bands in the AMM. Together, these bands define the liquidation range for the position. Each band functions as a small liquidation zone, where gradual rebalancing occurs as prices change.

Unlike traditional systems, liquidation in LLAMMA does not immediately close a loan. Instead, it soft-liquidates and de-liquidates the collateral (explained below). This liquidation only happens when the loan is within the liquidation range. Outside this range, no rebalancing occurs and the collateral remains unchanged.

When the soft- and de-liquidation happens, losses accumulate due to different factory such as market volatility, general liquidity etc. A loan is [hard-liquidated](#hard-liquidation) (fully) once it reaches 0% health.

## Soft- and De-Liquidation

As the price of the collateral asset decreases and enters the liquidation range — defined by two price boundaries — the system progressively converts the volatile collateral into crvUSD. This reduces exposure to the declining asset. If the price rises again within the same range, the system reverses the process, using crvUSD to buy back the collateral and restore exposure to the volatile asset.

<div className="text--center">
  <img src="../images/llamma/liquidation-process.svg" alt="Liquidation Process" width="700" />
</div>

This continuous buying and selling between the collateral asset and crvUSD leads to losses. These losses occur in both directions: when the price of the collateral decreases, and again when it increases. However, such losses only happen while the loan is within the liquidation range.

In short, LLAMMA enables a soft-liquidation mechanism that adjusts positions in real time, avoiding the abrupt liquidations seen in traditional systems.

## Losses in Liquidation

When a loan enters the **liquidation range**, **losses occur**. These losses are difficult to quantify precisely, as they depend on various external factors.

:::warning Misconception
A common misconception is that once a loan enters the liquidation range, it **cannot be liquidated** if the collateral price begins rising again. While this may seem intuitive, **liquidation losses can also occur as the price moves upward.**
:::

Several factors influence the extent of these losses:

- **Number of Bands:** A higher number of bands reduces losses. Positions created with the maximum of **50 bands** have remained in liquidation mode for **months** while losing only a small percentage of loan health.
- **Market Volatility:** Sudden price drops in the collateral asset tend to produce **larger losses**, whereas slower, more gradual price changes enable smoother rebalancing with **lower losses**.
- **Liquidity Conditions:** Highly liquid assets (e.g., BTC, ETH, or LSDs) generally incur **smaller losses**, as deep liquidity across DeFi markets supports more efficient arbitrage and rebalancing.

Ultimately, **losses within the liquidation range are inevitable** and depend on factors such as **market volatility, asset liquidity, arbitrage efficiency, and loan configuration**. A clear understanding of these dynamics is essential for minimizing risk when structuring loans.

## Hard Liquidation

Hard liquidation occurs only when the [health](#loan-health) of a loan falls below 0%. At this point, the loan is forcefully closed at a specific price to cover the shortfall.

When a loan is hard-liquidated, the associated collateral is removed, and the loan is closed. However, the borrower retains full control over the borrowed funds.

To avoid hard liquidation, it's important to monitor loan health and take appropriate action when necessary. For more details, see [Loan Management in Liquidation](./guides/liquidation.md).

## Loan Health

Based on a user's collateral and debt amount, the UI will display a health score and status. If the position is in soft-liquidation mode, an additional warning will be displayed. Once a loan reaches **0% health**, the loan is **eligible to be hard-liquidated**. In a hard-liquidation, someone else can pay off a user's debt and, in exchange, receive their collateral. The loan will then be closed.

The **health of a loan decreases when the loan is in soft-liquidation mode. These losses do not only occur when prices go down but also when the collateral price rises again, resulting in the de-liquidation of the user's loan.** This implies that the health of a loan can decrease even though the collateral value of the position increases. If a loan is not in soft-liquidation mode, then no losses occur.

Losses are hard to quantify. There is no general rule on how big the losses are as they are dependent on various external factors such as how fast the collateral price falls or rises or how efficient the arbitrage is. But what can be said is that the **losses heavily depend on the number of bands** used; the more bands used, the fewer the losses. Daily losses based on current data are shown [here](./loan-strategies.md#soft-liquidation-losses).

The formula for health is below:

```math
health = (s × (1 - liqDiscount) + p) / debt - 1
p = collateral × priceAboveBands
```

Where:

- `collateralValue`: the value of all collateral at the current LLAMMA prices
- `liqDiscount`: the liquidation discount for the market (how much to discount the collateral value for safety during hard-liquidation)
- `debt`: the debt of the user
- `s`: an estimation of how much crvUSD a user would have after converting all collateral through their bands in soft-liquidation. This can be very roughly estimated as: `collateral × ((softLiqUpperLimit - softLiqLowerLimit) / 2)`
- `p`: The value above the soft-liquidation bands. Found by multiplying the amount of collateral by how far above soft-liquidation the current price is. If user is in or below soft-liquidation, this value is 0
- `collateral`: The amount of collateral a user has, e.g., if a user has 5 wBTC, this value is 5
- `priceAboveBands`: The price difference between the oracle price and the top of the user's soft-liquidation range (upper limit of top band). This value is 0 if user is in soft-liquidation
- `collateralPrice`: The price of a single unit of the collateral asset, e.g., if the collateral asset is wBTC, this value is the price of 1 wBTC

## Loan Discount

The `loan_discount` is used for finding the maximum LTV a user can have in a market. At the time of writing in crvUSD markets this value is a constant 9%, in Curve Lending markets this value ranges from 7% for WETH to 33% for volatile assets like UwU. The formula is:

```math
maxLTV = ((A - 1) / A)² × (1 - loan_discount)
```

## Borrow Rate

In crvUSD minting markets the general idea is that **borrow rate increases when crvUSD goes down in value and decreases when crvUSD goes up in value**. Also, contracts called [PegKeepers](#pegkeepers) can also affect the interest rate and crvUSD peg by minting and selling crvUSD or buying and burning crvUSD.

*The formula for the borrow rate is as follows:*

```math
r = rate0 × e^power
power = (price_peg - price_crvUSD) / sigma - DebtFraction / TargetFraction
DebtFraction = PegKeeperDebt / TotalDebt
```

*with:*

- `r`: The interest rate
- `rate0`: The rate when PegKeepers have no debt and the price of crvUSD is exactly 1.00
- `price_peg`: Desired crvUSD price: 1.00
- `price_crvUSD`: Current crvUSD price
- `sigma`: variable which can be configured by the DAO, lower value makes the interest rates increase and decrease faster as crvUSD loses and gains value respectively
- `DebtFraction`: Ratio of the PegKeeper's debt to the total outstanding debt
- `TargetFraction`: Target fraction
- `PegKeeperDebt`: The sum of debt of all PegKeepers
- `TotalDebt`: Total crvUSD debt across all markets

*A tool to experiment with the interest rate model is available [here](https://crvusd-rate.0xreviews.xyz/).*

## PegKeepers

A PegKeeper is a contract that helps stabilize the crvUSD price. PegKeepers are deployed for special Curve pools, a list of which can be found [here](https://docs.curve.fi/references/deployed-contracts/#curve-stablecoin).

PegKeepers take certain actions based on the price of crvUSD within the pools. All these actions are fully permissionless and callable by any user.

When the price of crvUSD in a pool is above 1.00, they are allowed to take on debt by minting un-collateralized crvUSD and depositing it into specific Curve pools. This increases the balance of crvUSD in the pool, which consequently decreases its price.

If a PegKeeper has taken on debt by depositing crvUSD into a pool, it is able to withdraw those deposited crvUSD from the pool again. This can be done when the price is below 1.00. By withdrawing crvUSD, its token balance will decrease and the price within the pool increases.

[:octicons-arrow-right-24: More on PegKeepers here](https://docs.curve.fi/crvUSD/pegkeepers/overview/)