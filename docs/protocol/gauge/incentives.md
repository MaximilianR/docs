---
id: incentives
title: "Incentives: CRV Emissions vs. Permissionless Rewards"
sidebar_label: "Incentives: CRV Emissions vs. Permissionless Rewards"
---

import GuideCardGrid from '@site/src/components/GuideCardGrid';

There are two primary ways to incentivize liquidity on Curve: **CRV emissions** and **permissionless rewards**. Understanding how each works — and when to use them — is essential for protocols aiming to grow and sustain liquidity in their pools.

While both mechanisms distribute rewards to liquidity providers (LPs), they operate under different rules and serve different strategic purposes.

## What Are CRV Emissions and How Do They Work?

CRV emissions are distributed weekly by the Curve DAO and serve as the core long-term incentive mechanism for Curve liquidity pools and lending markets. This system is fundamental to how the protocol works: veCRV holders vote on gauges to decide how Curve’s CRV inflation is allocated, effectively directing where new CRV emissions go each week.

Only **whitelisted gauges** are eligible to receive CRV emissions. But whitelisting alone is not enough — emissions are not fixed or automatic. To actually receive CRV, a gauge must attract **gauge weight votes** from veCRV holders. The more votes a gauge receives, the higher its share of the total weekly emissions.

For example, if a gauge receives 10% of all veCRV votes in a given week, it will receive 10% of that week's CRV inflation. Gauge weights are updated every **Thursday at 00:00 UTC**, and the emissions adjust accordingly.

- CRV is allocated through weekly **gauge weight voting** by veCRV holders.
- The amount of CRV a pool receives fluctuates based on how much gauge weight it attracts.
- Protocols do not pay for CRV emissions directly — rewards come from the Curve DAO's inflation schedule.
- To receive CRV emissions, a gauge must first be approved by governance and then continue to attract votes each week.

## What Are Permissionless Rewards and How Do They Work?

Permissionless rewards are third-party incentives that are distributed through the same gauges as well — but without needing DAO approval. They allow protocols or asset issuers (or really anyone who wants to put up rewards) to immediately start rewarding liquidity providers.

Unlike CRV emissions, permissionless rewards are funded and managed directly by the gauge deployer.

- **Only the gauge deployer**, or an address authorized by the gauge deployer, can add rewards to a gauge.
- This design prevents the system from being spammed with malicious or irrelevant tokens.
- Rewards can be **any token**, not just ERC-20 — though ERC-20 is most common.
- Some tokens (e.g. rebasing or non-standard tokens) may require special handling. If using exotic tokens, it’s recommended to contact the Curve team before adding them.

Permissionless rewards are generally visible in the Curve UI and claimable by LPs alongside CRV (if applicable). They are commonly used to bootstrap liquidity or test incentive models.

## When to Use CRV Emissions vs. Permissionless Rewards

Each incentive type serves a different role in your liquidity strategy. CRV emissions are typically suited for long-term sustainability, while permissionless rewards offer flexibility and speed. The right choice depends on your project’s goals, token model, and timeline.

CRV emissions do not require funding from the protocol, but the gauge must be approved by the DAO through an on-chain vote. This takes at least 7 days, and gauge weights are updated weekly — meaning emissions may not begin until 1–2 weeks after deployment. Emission amounts vary weekly, depending on how much gauge weight is allocated to the pool by veCRV holders. These rewards are also subject to the market price of CRV: if CRV declines, incentives become less effective; if it increases, the same emissions yield higher APRs at no additional cost to the protocol.

Permissionless rewards, on the other hand, can be deployed instantly — no governance approval is needed. Rewards can be denominated in stable assets (e.g. USDC) or native tokens, making them easier to plan and budget. Because they are not subject to market volatility or weekly voting, they provide predictable and targeted incentives.

Many protocols combine both: starting with permissionless rewards to attract early liquidity and gauge market interest, then pursuing CRV emissions through a DAO vote to scale long-term liquidity more efficiently. This flexible approach allows projects to manage cost, responsiveness, and growth dynamically.

---

## Guides

<GuideCardGrid guideKeys={['HowToGetAGauge', 'HowToGetCRVEmissions', 'AddingPermissionlessRewards']} />
