---
id: overview
title: Lending Overview
sidebar_label: Overview
---

import GuideCardGrid from '@site/src/components/GuideCardGrid';

Curve's lending infrastructure, **Llamalend**, is a decentralized, permissionless lending system that enables protocols and asset issuers to create lending markets for their tokens. It facilitates lending and borrowing between users while providing powerful tools for asset proliferation and ecosystem growth.

**Borrowers** can leverage Llamalend for yield farming, leverage trading, or obtaining working capital without selling collateral. **Lenders** earn interest while contributing to market liquidity across diverse asset pairs with different risk profiles.

To get started quickly, check these out:

<GuideCardGrid guideKeys={['LendingOraclesAndParameters', 'deployLendingMarket']} />

## Core Architecture

Llamalend operates on an **isolated market** model where each lending market has a single collateral token and a single borrowable token. All lending markets are completely independent from each other, preventing cross-contamination and allowing for precise risk management per asset pair.

Every lending market must include **crvUSD** as either the collateral asset or the borrowable asset. This design ensures deep integration with Curve's stablecoin ecosystem while maintaining market isolation. For example, a market could have ETH as collateral and crvUSD as borrowable, or crvUSD as collateral and USDC as borrowable.

- **Gauges for Vaults** - Lending vaults are fully compatible with Curve's gauge system, meaning lending vaults can receive gauge weights and therefore future CRV emissions to attract more supply to the market
- **Fully Permissionless** - Deploy lending markets instantly without DAO approvals
- **Isolated Markets** - Each market operates independently with its own risk parameters, preventing cross-contamination
- **crvUSD Integration** - Deep integration with Curve's stablecoin ecosystem
- **Customizable Risk Management** - Tailored liquidation thresholds and interest rate models per asset pair

## How Markets are Deployed

Deploying Llamalend markets is fully permissionless through a dedicated Factory contract. Anyone can create lending markets for any token pair, with the only requirement being that one of the tokens must be crvUSD. This ensures deep integration with Curve's stablecoin ecosystem while maintaining market isolation.

## How It Works

Users deposit collateral tokens to borrow against them, maintaining health factors above liquidation thresholds. Interest accrues on borrowed amounts and is paid to lenders providing market liquidity. Automated liquidation mechanisms protect against bad debt accumulation.

## Incentives & Liquidity Growth

Lending vaults are fully compatible with Curve's gauge system, enabling multiple strategies to attract and retain liquidity:

- **CRV Emissions** - Put lending vaults up for DAO vote to receive CRV emissions, incentivizing long-term liquidity provision
- **Permissionless Rewards** - Add custom token incentives directly to lending markets to boost initial liquidity
- **Vote Incentives** - Provide rewards to veCRV holders who vote for your lending vault gauge

These mechanisms help bootstrap initial liquidity and create sustainable demand for lending markets, making them more attractive to both borrowers and lenders.

For detailed deployment instructions and parameter optimization, see the [Deployment Guide](./guides/deploy-lending-market.md) and [Oracles & Parameters](./oracles-and-parameters.md) documentation.
