---
title: How to Whitelist a Gauge
---

To receive CRV emissions, a deployed gauge must be **whitelisted** — meaning it must be added to the `GaugeController` contract. This contract tracks which gauges are eligible to receive CRV based on weekly veCRV votes.

The whitelisting process is fully decentralized and governed by the DAO. This guide walks you through how to request approval from veCRV holders and get your gauge added to the emissions system.

> ⚠️ **Important:** Gauges for tokens with transfer restrictions, tax mechanisms, blacklists, or other non-standard behavior are generally **not approved** by the DAO. Only freely transferable, openly accessible tokens are considered eligible for CRV emissions.  
>  
> While final decisions are made through governance, the DAO prioritizes protecting LPs and the protocol from potential value extraction or misuse.

---

## **Step 1: Post a Governance Forum Proposal (Recommended)**

Before submitting an on-chain vote, it's good practice to post a proposal on the [Curve Governance Forum](https://gov.curve.fi/). This allows the community and veCRV holders to review your request and ask questions.

Your post should include:

- A short explanation of your protocol or pool
- Why you're requesting CRV emissions
- How the pool benefits Curve (e.g. volume, stickiness, new use cases)
- A link to the gauge contract (already deployed)
- Any supporting audits or docs

> 💡 Use this template: [**Gauge Whitelisting Proposal Template**](https://gov.curve.fi/t/template-gauge-whitelisting-request/xxx) *(TBD)*

This step is not required, but it increases transparency and support — especially for lesser-known protocols or assets.

---

## **Step 2: Submit an On-Chain Vote**

Once your gauge is deployed and you’ve shared your proposal, go to the [Gauge Factory UI](https://dao.curve.fi/gauge-factory) to start the DAO approval process.

To submit a whitelisting vote:

- Connect your wallet
- Enter your deployed gauge address
- Sign and confirm the transaction

> You must hold **2,500 veCRV** to create the proposal  
> Or coordinate with a veCRV holder who can do it on your behalf

After a few minutes, your proposal will appear on the [Curve DAO proposals page](https://www.curve.fi/dao/ethereum/proposals/), where veCRV holders can vote **yes** or **no**.

This begins a 7-day on-chain vote to add your gauge to the `GaugeController`.

---

## **Step 3: Promote the Vote**

Once the vote is live:

- Share it in Curve’s [Discord](https://discord.gg/rgrfS7W) and [Telegram](https://t.me/curvefi)
- Notify veCRV voters 

Engaging the community increases your chances of success.

---

## **Step 4: After the Vote**

If the vote passes:

- Your gauge will be whitelisted and added to the GaugeController
- It becomes eligible to receive CRV emissions
- Emissions begin with the next update (**Thursdays at 00:00 UTC**)

> CRV emissions are not automatic — veCRV holders must still vote for your gauge to assign weight and receive emissions.

---

## **Next Steps**

- → [How CRV Emissions Work](../gauge/incentives.md)  
- → [Using Bribes to Grow Gauge Weight](../gauge/using-bribes.md) *(coming soon)*  
- → [Adding Permissionless Rewards](../gauge/adding-permissionless-rewards.md) *(coming soon)*
