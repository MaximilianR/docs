---
title: Curve DAO
hide_title: true
---

## Overview

The Curve DAO is the decentralized governance system that controls all aspects of Curve Finance. All contracts and decisions on Curve are in the hands of the DAO, governed solely by its holders through a system pioneered by Curve called **veTokenomics**. Members receive governance power by locking CRV for veCRV tokens. The longer a user locks their tokens up for, the more voting power they receive. This reduces governance attacks and helps align incentives so the DAO passes proposals which benefit the protocol long term.

**Governance Mechanics**
- [**Locking CRV:**](../vecrv/how-to-lock.md) Users must lock CRV to participate in DAO governance and access protocol benefits.
- [**Proposals:**](./proposals.md) These are DAO votes that last 7 days and can contain all sorts of different actions. Votes pass if they meet the Quorum and Min support thresholds. Anyone with veCRV can vote on proposals, and holders of at least 2,500 veCRV can create votes.
- [**Gauge Weights:**](./gauge-weights.md) Each week veCRV holders vote on where the weekly CRV emissions will go. Gauges distribute CRV emissions to LPs in DEX pools or suppliers to lending markets.

The [governance discussion forum](https://gov.curve.finance/) allows users to post and discuss current proposals, future proposals, or ideas.

Users can access the Curve DAO dashboard at https://curve.finance/dao. This dashboard provides an overview of all current and closed votes. Each proposal should have a corresponding topic on the Curve governance forum, accessible at https://gov.curve.finance/.

Ready to participate in Curve governance? Start by [locking your CRV tokens](../vecrv/how-to-lock.md) to receive veCRV and gain voting power. Then visit the [governance forum](https://gov.curve.finance/) to join discussions, stay informed about current proposals and start voting on proposals on [https://www.curve.finance/dao/ethereum/proposals/](https://www.curve.finance/dao/ethereum/proposals/).

## Emergency DAO
The EmergencyDAO is a 5-of-9 multisig authorized for emergency interventions, such as:

- Stopping CRV emissions on most gauges, however, it cannot stop deposits/withdrawals from the gauge.
- Recovering ERC20 tokens from the DAO's revenue collection and distribution process.
- Pausing the Peg Stabilization Reserve's associated contracts to stop them from depositing or withdrawing crvUSD. This pause does not affect the pool level.

The EmergencyDAO is deployed on Ethereum at [`0x467947EE34aF926cF1DCac093870f613C96B1E0c`](https://etherscan.io/address/0x467947EE34aF926cF1DCac093870f613C96B1E0c) and consists of the following members:

<div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }} markdown="block">
| Name            | Telegram Handle       |
| --------------- | --------------------- |
| `banteg`        | `Yearn, @banteg`      |
| `Calvin`        | `@calchulus`          |
| `C2tP`          | `Convex, @c2tp_eth`   |
| `Darly Lau`     | `@Daryllautk`         |
| `Ga3b_node`     | `@ga3b_node`          |
| `Naga King`     | `@nagakingg`          |
| `Peter MM`      | `@PeterMm`            |
| `Addison`       | `@addisonthunderhead` |
| `Quentin Milne` | `StakeDAO, @Kii_iu`   |
</div>


## Cross-Chain Governance
Just because Curve is operational on multiple networks, this does not come along with a centralization of powers. All L1 and L2 deployments are fully in control of the DAO. To make changes on chains other than Ethereum, an on-chain vote needs to be created on Ethereum whose outcomes are broadcasted to the corresponding chain. 
