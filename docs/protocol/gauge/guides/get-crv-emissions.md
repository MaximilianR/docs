---
title: How to Get CRV Emissions
---

Once your gauge has been whitelisted by the Curve DAO, it becomes eligible to receive CRV emissions — but this does **not** happen automatically. Emissions are distributed based on **gauge weight voting**, a weekly process where veCRV holders decide how Curve’s inflation is allocated across pools.


## **CRV Emissions Depend on Gauge Weight Voting**

Every week, the Curve DAO distributes newly minted CRV tokens across all **whitelisted gauges**. The distribution is **proportional** to how much voting weight each gauge receives from veCRV holders.

- veCRV holders vote for the gauges they want to support
- The more voting weight your gauge receives, the larger the share of CRV emissions it gets
- If your gauge receives **0% weight**, it receives **0 CRV** — even if it's whitelisted


## **How Gauge Weight Voting Works**

All veCRV holders can vote on gauges using the [Curve voting interface](https://curve.fi/#/ethereum/dao/gauges). They can split their weight across multiple gauges or concentrate it on a single one.

- Votes are **relative**: if your gauge receives 10% of all votes, it will receive 10% of that week's CRV inflation
- You can vote at any time, but votes are **locked in** at the weekly update
- Weights are reset weekly — your gauge must continuously attract votes to maintain emissions


## **Weekly Update Cycle**

Gauge weights — and therefore CRV emissions — are updated **every Thursday at 00:00 UTC**.

- Any votes submitted before that time are included in the next cycle
- The system automatically recalculates weights and distributes emissions accordingly
- Historical and live weights can be viewed at: [curve.finance/dao/ethereum/gauges](https://www.curve.finance/dao/ethereum/gauges/)


## **How to Attract Gauge Weight**

Being whitelisted is only the beginning. You still need to get veCRV holders to vote for your gauge. This can be done by:

- **Engaging with the Curve community**
- **Offering bribes** using platforms like Votium (see [Using Bribes](../gauge/using-bribes.md))
- **Aligning incentives** with veCRV holders (e.g. providing value to Curve’s ecosystem)


## **Where to Track Emissions**

Here are a few tools to monitor your gauge and emissions:

- [Gauge Weights](https://dao.curve.fi/gaugeweights) – current vote weights
- [Curve Vote UI](https://curve.fi/#/ethereum/dao/gauges) – voting interface
- [Curve Stats](https://stats.curve.fi) – historical emissions and pool metrics
