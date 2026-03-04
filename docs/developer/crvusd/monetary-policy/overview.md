# Monetary Policy Overview

import CrvusdMonetaryPolicies from '@site/src/components/LiveComponents/CrvusdMonetaryPolicies';

Monetary policy contracts determine the **borrow interest rate** for each crvUSD mint market. They are called by the Controller on every user interaction (`rate_write`) and can be queried for the current rate at any time (`rate`).

The current production monetary policy is the [**AggMonetaryPolicy (v4)**](agg-monetary-policy-v4.md), deployed at [`0x0749...251`](https://etherscan.io/address/0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251). It is used by all active crvUSD mint markets. The original [AggMonetaryPolicy](monetary-policy.md) ([`0xc684...0a1`](https://etherscan.io/address/0xc684432fd6322c6d58b6bc5d28b18569aa0ad0a1)) is only used by one deprecated market.

## Rate Formula

Both versions share the same core formula:

$$r = rate0 \cdot e^{\text{power}} \quad \text{where} \quad \text{power} = \frac{1 - price\_crvusd}{\sigma} - \frac{DebtFraction}{TargetFraction}$$

The v4 contract uses an EMA of the debt ratio instead of the raw value and adjusts rates per-market based on debt ceiling utilization. See the [AggMonetaryPolicy (v4)](agg-monetary-policy-v4.md) page for full details.

## Market → Monetary Policy Mapping

The table below is fetched live from on-chain data. Each Controller's `monetary_policy()` is queried to show which policy version is currently active for each market.

<CrvusdMonetaryPolicies />
