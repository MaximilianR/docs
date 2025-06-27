---
title: Governance Proposals
hide_title: true
description: How on-chain proposals are created, voted on and executed in the Curve DAO.
---

import ThemedImage from '@theme/ThemedImage';

## What are Governance Proposals

Governance proposals are the primary mechanism for making changes to the Curve protocol. veCRV holders can create and vote on proposals that affect protocol parameters, add new features, or make other important decisions. All proposals are open for voting for **7 days** and require specific quorum and support thresholds to pass.

<figure>
<ThemedImage
    alt="Curve DAO proposals interface showing active and past proposals"
    sources={{
        light: require('@site/static/img/user/dao/voting-proposal-example-light.png').default,
        dark:  require('@site/static/img/user/dao/voting-proposal-example-dark.png').default,
    }}
    style={{ width: '900px', display: 'block', margin: '0 auto' }}
/>
<figcaption>Curve DAO proposals interface showing active and completed proposals</figcaption>
</figure>

To view all current and past proposals, visit the [Curve DAO Proposals page](https://www.curve.finance/dao/ethereum/proposals/) and connect your wallet to see your voting options.

---

## Proposal Types

[Curve DAO proposals](https://www.curve.finance/dao/ethereum/proposals/) fall into three main categories:

**Ownership Vote** – The most common proposal type, used for a wide range of DAO matters such as gaining control over protocol fees, whitelisting new gauges, changing pool parameters, adding crvUSD mint markets, or implementing protocol upgrades. Requires **30% quorum** and **51% minimum support** to pass.

**Parameter Vote** – Used to modify parameters on older liquidity pools, such as fees, amplification factors, or other pool-level settings. Requires **15% quorum** and **60% minimum support** to pass. This type of vote is rarely used in todays Curve governance as most operations are now handled through ownership votes.

:::info Quorum 
    In the Curve DAO, only "Yes" votes count towards quorum.
:::

---

## Voting on Proposals

Voting on proposals always happens on Ethereum. Anyone who **already held veCRV when the vote began** can participate in voting. Since voting is fully on-chain, each vote requires signing a transaction and paying gas fees, so consider the current gas costs before voting.

### Voting Power and Decay

Voting decay is a safety measure to stop manipulation of proposals at the last minute by whales, to give all DAO members time to react to large votes in a timely manner. Your veCRV counts for **100% during the first 3.5 days**, then linearly decreases to **0% by the deadline**.

> *Note: Gauge-weight votes are exempt from this decay and retain full power for the entire weekly epoch.*

<figure>
<ThemedImage
    alt="Voting power decay chart showing linear decrease from 100% to 0% over final 3.5 days"
    sources={{
        light: require('@site/static/img/user/dao/voting-power-light.png').default,
        dark:  require('@site/static/img/user/dao/voting-power-dark.png').default,
    }}
    style={{ width: '600px', display: 'block', margin: '0 auto' }}
/>
</figure>

### How to Vote

To vote on a proposal, navigate to the [Curve DAO Proposals page](https://www.curve.finance/dao/ethereum/proposals/) and select the relevant proposal. Make sure your wallet is connected to see your voting options.

<figure>
<ThemedImage
    alt="Voting interface showing Vote For and Vote Against options"
    sources={{
        light: require('@site/static/img/user/dao/vote-light.png').default,
        dark:  require('@site/static/img/user/dao/vote-dark.png').default,
    }}
    style={{ width: '250px', display: 'block', margin: '0 auto' }}
/>
</figure>

Each proposal card displays:
- **User** - Your connected wallet address
- **Voting Power at Snapshot** – Your veCRV balance at the time the proposal was created
- **Current Voting Power** – Your current voting power (decays if proposal is older than 3.5 days)

To cast your vote:
1. Click **"Vote For"** or **"Vote Against"** depending on your preference
2. Sign the transaction in your wallet
3. Your vote is now recorded on-chain

---

## Creating Proposals

Creating a governance proposal involves three main stages:

#### 1. Ideation & Discussion
- Post a draft in the [governance forum](https://gov.curve.finance/) using the standard [proposal template](https://gov.curve.finance/t/template-governance-proposal/)
- Gather feedback from the community in [Discord](https://discord.gg/twUngQYz85) or [Telegram](https://t.me/curvefi)
- Refine your proposal based on community input

#### 2. Create the Vote
To create an on-chain vote, you need **2,500 veCRV**. You can either:
- Lock up CRV tokens to get veCRV
- Ask someone from the community to create the vote for you

#### 3. Vote & Execute
After the 7-day voting period, if the proposal passes successfully, it needs to be executed. This can be done directly via the UI using the `Execute` button.

<figure>
<ThemedImage
    alt="Execute button for passing proposals after timelock period"
    sources={{
        light: require('@site/static/img/user/dao/execute_light.png').default,
        dark: require('@site/static/img/user/dao/execute_dark.png').default,
    }}
    style={{ width: '150px', display: 'block', margin: '0 auto' }}
/>
</figure>

:::info
Need help creating your on-chain vote? Reach out to the Curve community on [Telegram](https://t.me/curvefi) — we're happy to assist.

If you're looking to whitelist a gauge, check out the [Gauge Whitelisting Guide](../../asset-issuer/gauge/request-guide.md) for a step-by-step walkthrough.
:::

---

## FAQ

### Getting Started & Prerequisites

**What is veCRV and why do I need it to vote?**  
[veCRV (vote-escrowed CRV)](../vecrv/what-is-vecrv.md) is a token you get when you lock your CRV tokens for a specific period. You need veCRV to participate in governance voting because it represents your voting power in the Curve DAO.

**What's the minimum amount of veCRV I need to vote?**  
There's no minimum amount of veCRV required to vote on proposals. However, the more veCRV you have, the more voting power you'll have. Even a small amount of veCRV allows you to participate in governance.

**How much veCRV do I need to create a proposal?**  
You need **2,500 veCRV** to create an on-chain governance proposal. This requirement helps ensure that proposals come from committed community members.

**Should I vote on every proposal?**  
While you can vote on every proposal, it's better to vote thoughtfully on proposals you understand rather than voting on everything. Quality participation is more valuable than quantity.

**How can I stay informed about new proposals?**  
Monitor the [Curve DAO page](https://www.curve.finance/dao/ethereum/proposals/), join the [Discord](https://discord.gg/twUngQYz85) or [Telegram](https://t.me/curvefi) communities, and follow the [governance forum](https://gov.curve.fi/).

### Voting Mechanics

**When can I vote on a proposal?**  
You can only vote if you **already held veCRV when the vote began**. This prevents last-minute vote manipulation by large holders who might acquire veCRV just to swing a vote.

**How long do proposals stay open for voting?**  
All proposals are open for voting for exactly **7 days** from when they are created.

**What happens if I don't vote?**  
If you don't vote, your voting power is simply not counted. You're not penalized for abstaining, but you're missing out on the opportunity to influence protocol decisions.

**Can I change my vote after casting it?**  
No, votes cannot be changed once cast. Make sure you're confident in your decision before signing the transaction.

### Voting Power & Decay

**Why does my voting power decay?**  
Voting power decays during the final 3.5 days of a proposal to prevent last-minute vote manipulation by large holders. This encourages early participation and thoughtful voting.

**How does the voting power decay work?**  
Your veCRV counts for **full 100% during the first 3.5 days**, then linearly falls to **0% by the deadline**. This means voting early maximizes your influence.

**Does voting power decay affect gauge voting?**  
No, gauge-weight votes are exempt from this decay. They retain full power for the entire weekly epoch.

### Proposal Execution

**Who can execute a passed proposal?**  
Anyone can execute a passed proposal after the timelock expires. You don't need veCRV to execute proposals.

**What if a proposal fails?**  
Failed proposals cannot be executed and the proposed changes do not take effect. The proposal creator can submit a new proposal with modifications if desired.