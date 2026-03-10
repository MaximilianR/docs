# Monetary Policy Overview

import CrvusdMonetaryPolicies from '@site/src/components/LiveComponents/CrvusdMonetaryPolicies';

Monetary policy contracts determine the **borrow interest rate** for each crvUSD mint market. They are called by the Controller on every user interaction (`rate_write`) and can be queried for the current rate at any time (`rate`).

The current production monetary policy is the [**AggMonetaryPolicy (v4)**](agg-monetary-policy-v4.md), deployed at [`0x0749...251`](https://etherscan.io/address/0x07491D124ddB3Ef59a8938fCB3EE50F9FA0b9251). It is used by all active crvUSD mint markets. The original [AggMonetaryPolicy](monetary-policy.md) ([`0xc684...0a1`](https://etherscan.io/address/0xc684432fd6322c6d58b6bc5d28b18569aa0ad0a1)) is only used by one deprecated market.

## Rate Formula

Both versions share the same core formula:

$$r = rate0 \cdot e^{\text{power}} \quad \text{where} \quad \text{power} = \frac{1 - price\_crvusd}{\sigma} - \frac{DebtFraction}{TargetFraction}$$

The v4 contract uses an EMA of the debt ratio instead of the raw value and adjusts rates per-market based on debt ceiling utilization. See the [AggMonetaryPolicy (v4)](agg-monetary-policy-v4.md) page for full details.

### Intuition Behind Sigma

While sigma is often described as a "sensitivity parameter," it has a concrete financial interpretation. Consider the price deviation component of the formula in isolation (ignoring the debt ratio term):

$$r \approx rate0 \cdot e^{d/\sigma}$$

where $d = 1 - price\_crvusd$ is the depeg. This exponential can be approximated as:

$$e^{d/\sigma} \approx \left(\frac{1}{1 - d}\right)^{1/\sigma}$$

When this rate is applied over a period of length $T = \sigma$, the total interest cost equals the depeg itself. In other words, **sigma represents the time period over which a borrower effectively pays for the current depeg through elevated interest rates**.

This gives a practical decision rule: if a borrower expects crvUSD to remain depegged and can borrow elsewhere at `rate0`, they should compare their expected loan duration to sigma. If they plan to borrow for **longer** than sigma, it may be cheaper to close the loan now and reborrow elsewhere. If **shorter**, sitting through the elevated rate could be acceptable.

A smaller sigma means the rate spikes more sharply during a depeg (borrowers pay for it quickly), while a larger sigma spreads the cost over a longer period with a gentler rate increase.

## Market → Monetary Policy Mapping

The table below is fetched live from on-chain data. Each Controller's `monetary_policy()` is queried to show which policy version is currently active for each market.

<CrvusdMonetaryPolicies />
