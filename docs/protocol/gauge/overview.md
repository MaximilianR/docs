---
title: What is a Gauge & How it Works?
---

A **gauge** is a smart contract that distributes rewards to liquidity providers (LPs) in a Curve pool or lending vault. When rewards (such as CRV emissions or third-party incentives) are active on a gauge, **users must stake their LP or vault tokens into the gauge contract** to be eligible for those rewards.

Protocols and asset issuers use gauges to grow liquidity — by offering incentives to LPs through **CRV emissions**, **third-party token rewards**, or both.

> ✅ **Anyone can deploy a gauge.**  
> 🗳️ **Only DAO-approved gauges can receive CRV emissions.**


---

## **Why Use a Gauge?**

Gauges let you reward users for providing liquidity in your Curve pool — either with **CRV emissions**, **third-party incentives**, or both. These incentives create a yield opportunity for LPs, which in turn attracts deposits. The more rewards a pool offers, the more attractive it becomes to liquidity providers. As more users deposit into the pool to earn yield, the total value locked (TVL) increases. Higher TVL leads to deeper liquidity, reduced slippage, and a better trading experience for your token — ultimately making it more usable and integrated across DeFi.

Gauges also align incentives between protocols, LPs, and Curve governance:

- **Protocols** benefit from deep, low-slippage liquidity
- **LPs** earn yield from CRV and/or third-party rewards
- **veCRV holders** can vote on gauge weights and are incentivized through bribes or governance participation

With a gauge, LPs can earn:

- **CRV emissions** — if your gauge is approved by the Curve DAO  
- **Third-party rewards** — any ERC-20 token you choose (e.g. your protocol’s native token)

---

## **Deploying Gauges vs. Receiving CRV Emissions**

Deploying a gauge is permissionless — **anyone can create a gauge** for their Curve pool. Once deployed, the gauge can immediately begin distributing **third-party incentives**, such as your project’s native token or other ERC-20 rewards.

However, if you want the gauge to distribute **CRV emissions**, it must first be **approved and whitelisted by the Curve DAO** through a governance vote. Only DAO-approved gauges are eligible to receive a share of Curve’s weekly CRV inflation — and emissions are not fixed: they are determined by **veCRV gauge weight voting**, which takes place weekly.

> 📌 Gauges can always distribute external (permissionless) incentives.  
> 🌀 CRV emissions require DAO approval **and** ongoing veCRV votes.

---

## **Types of Rewards Through a Gauge**

### 🎯 **Permissionless Rewards (Third-Party Incentives)**

- Any ERC-20 token can be added to a gauge
- Requires no governance or approval
- Useful to bootstrap liquidity or reward LPs using your own token
- Rewards are claimable directly through the Curve UI

### 🌀 **CRV Emissions (Gauge Weight Voting)**

- Distributed weekly from Curve DAO’s CRV inflation schedule
- Allocated based on veCRV **gauge weight voting**
- Requires DAO approval to whitelist the gauge

Learn more: [**How to Get a Gauge**](../gauge/how-to-get-a-gauge.md)

---

## **Next Steps**

→ [**How to Get a Gauge**](../gauge/how-to-get-a-gauge.md)  
→ [**Incentives: CRV Emissions vs. Permissionless Rewards**](../gauge/incentives.md)  
→ (Coming soon) **Guide: Adding Permissionless Rewards**  
→ (Coming soon) **Guide: Using Bribes to Grow Gauge Weight**
