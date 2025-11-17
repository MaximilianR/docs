---
id: practices
title: Security Practices
sidebar_label: Security Practices
---

# Security Practices

Curve Finance prioritizes the security of its protocols and user funds above all else.

:::warning Always Do Your Own Research
While Curve implements extensive security measures, users should always conduct their own due diligence and understand the risks involved in DeFi protocols.
:::

## Comprehensive Security Audits

Curve conducts extensive security audits across all protocol components:

- **Immutable contracts**: Core pool contracts are intentionally immutable
- **Multiple audit firms**: Trail of Bits, MixBytes, QuantStamp, ChainSecurity, and others
- **Public audit reports**: All audit reports are publicly available. See: [Security Audits](audits.md)

## Bug Bounty Program

Curve maintains a bug bounty program:

- **Up to $250,000** for critical vulnerabilities
- **Clear scope**: Focus on smart contract vulnerabilities that could lead to substantial loss of funds
- **Responsible disclosure**: Encourages security researchers to report issues responsibly
- **Transparent process**: Clear eligibility requirements and payout structure

:::info Bug Bounty Contact
Report security vulnerabilities to: **security@curve.finance**
:::

## Vyper

Curve's smart contracts have been written in **Vyper since day 1**. With very few exceptions, all contracts are written in Vyper. Curve developers actively contribute to Vyper to make it a better and more secure language and also fund Vyper development via a fundraising gauge, where users can vote for the gauge and the CRV emissions are "donated" to Vyper development.

Vyper's cleaner, more readable syntax tends to reduce the likelihood of bugs compared to Solidity. The language design prioritizes security and makes common vulnerabilities harder to introduce. Curve's ongoing contributions and funding help improve Vyper's security and functionality. For detailed information about Vyper's security improvements, see the [State of Vyper Security - September 2024](https://blog.vyperlang.org/posts/vyper-security/) blog post.

## Decentralized Governance & Multisig Removal

Curve is committed to true decentralization:

- **DAO-first approach**: The Curve DAO is governed solely by veCRV holders
- **No Multisig-Finance**: Almost no multisig controls, and if any exist, only for contracts not holding any funds
- **Emergency DAO**: Limited 5-of-9 multisig with very restricted emergency powers only
- **Community control and transparent governance**: All major protocol decisions require DAO approval through on-chain voting. All proposals and voting records are publicly available.
