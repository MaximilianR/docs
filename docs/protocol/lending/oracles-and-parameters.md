---
id: oracles-and-parameters
title: Oracles & Parameters
sidebar_label: Oracles & Parameters
---

import SemiLogChart from '@site/src/components/SemiLogChart';

When deploying a Llamalend lending market, two critical components must be carefully configured: **price oracles** and **market parameters**. These form the foundation for a secure, efficient, and profitable lending market.

For Llamalend's liquidation engine to work optimally, the system requires a smooth price oracle for the collateral asset. **Spot oracles are not recommended** as they can cause significant losses due to price jumps during liquidations. Proper parameter selection is equally important for market security and efficiency.


## Oracles

Each Llamalend market requires a smooth (exponential moving average) oracle for the collateral asset. The easiest way to obtain this is through **Curve liquidity pools**, which include built-in oracles that can be used for lending markets.

Every Curve pool includes a direct built-in oracle that can be used for lending markets, provided the pool has sufficient TVL. Curve offers pools for various asset types including stable assets (e.g., USDT/USDC), two-token volatile assets (e.g., ETH/USDC), and three-token volatile assets (e.g., ETH/BTC/USDT).

**Critical**: The collateral asset oracle must be priced against **crvUSD**, not other stablecoins. If the Curve pool contains crvUSD (e.g., ETH/crvUSD), the oracle can be used directly. If the pool doesn't contain crvUSD (e.g., ETH/USDC), the oracle must be chained with a USDC/crvUSD oracle to create an ETH/crvUSD price feed.

For assets without suitable Curve pools, you can deploy custom oracles using the [custom oracle deployment guide](https://paragraph.com/@curvefi/llamalend_market_deploy#h-deploying-a-custom-priceoracle-contract). If this sounds complicated, the Curve team is happy to help with deployment - simply reach out on Telegram.


## Parameters

Parameter selection when creating a new lending market is the foundation for an optimally working liquidation engine and secure lending market. The process of finding optimal parameters requires a thorough analysis of historical price data for the collateral asset.

### A, fee, loan- and liquidation discount

The following parameters need to be simulated:
- **Band width (A)**: Determines the range of prices where liquidations can occur
- **Fee**: Transaction fees for liquidations
- **Liquidation discount**: Price discount applied during liquidations
- **Loan discount**: Collateral discount for loan-to-value calculations

A dedicated GitHub repository was set up for running these simulations: [Llamma Simulator](https://github.com/curvefi/llamma-simulator). An in-depth explainer can be found here: [Parameter Analysis Guide](https://paragraph.com/@curvefi/llamma-simulator).

### Borrow Rate Parameters

Each market needs minimum and maximum borrow rate values that are charged depending on the utilization of the market. The minimum rate is charged when nothing (0% utilization) is borrowed, and 100% of the maximum rate is charged at 100% utilization.

**Rate Limits**: Rates are bounded by MIN_RATE at 1% and MAX_RATE at 1000%.

**Rate Structure:**
- **0% utilization**: Minimum rate charged
- **100% utilization**: Maximum rate charged  
- **Target utilization**: Typically 80%, where the "market rate" is achieved

**Setting Optimal Rates:**
When setting rates, a target utilization (usually 80%) is chosen where the "market rate" should be charged. For example, if the current global rate for borrowing crvUSD is 10%, minimum and maximum borrow rates should be configured so that the borrow rate at 80% utilization equals 10%. This ensures that lenders have a buffer to withdraw their supplied assets without facing fully utilized markets.

**Rate Calculation:**
Rates are charged per second. When deploying a new market, borrow rates must be denominated in seconds using this formula:

$APR = \frac{rate}{10^{18}} \times (60 \times 60 \times 24 \times 365)$

**Example**: For a 1% APR, the rate parameter would be `317097919`.


## Name

The market name can be chosen freely. While the UI currently doesn't use the name variable from the contract for display, it's still good practice to give it a clear, understandable name.

**Naming Convention**: Usually follows the pattern of the collateral token name appended by the market direction (long/short).

**Examples**:
- **ETH-long**: ETH as collateral token, crvUSD as borrowable token
- **BTC-short**: crvUSD as collateral token, BTC as borrowable token


