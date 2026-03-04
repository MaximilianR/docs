# Monetary Policy Overview

import CrvusdMonetaryPolicies from '@site/src/components/LiveComponents/CrvusdMonetaryPolicies';

Monetary policy contracts determine the **borrow interest rate** for each crvUSD mint market. They are called by the Controller on every user interaction (`rate_write`) and can be queried for the current rate at any time (`rate`).

## Versions

There are two versions of the aggregated monetary policy in production:

| Version | Contract | Key Features |
| ------- | -------- | ------------ |
| [**AggMonetaryPolicy**](monetary-policy.md) | [`0xc684...0a1`](https://etherscan.io/address/0xc684432fd6322c6d58b6bc5d28b18569aa0ad0a1) | Original policy. Rate based on crvUSD price, PegKeeper debt fraction, `sigma`, and `rate0`. |
| [**AggMonetaryPolicy (v4)**](agg-monetary-policy-v4.md) | [`0x0749...251`](https://etherscan.io/address/0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251) | EMA-smoothed PegKeeper debt ratio, debt candles (min-debt tracking), per-market rate scaling based on debt ceiling utilization, and `extra_const` parameter. |

Both versions share the same core formula:

$$r = rate0 \cdot e^{\text{power}} \quad \text{where} \quad \text{power} = \frac{1 - price\_crvusd}{\sigma} - \frac{DebtFraction}{TargetFraction}$$

The v4 contract adds `extra_const` to the result and uses an EMA of the debt ratio instead of the raw value.

## Market → Monetary Policy Mapping

The table below is fetched live from on-chain data. Each Controller's `monetary_policy()` is queried to show which policy version is currently active for each market.

<CrvusdMonetaryPolicies />
