---
id: overview
title: Llamalend
sidebar_label: Overview
---

import GuideCardGrid from '@site/src/components/GuideCardGrid';

## What is Llamalend?

Llamalend is Curve's lending platform that combines two distinct lending products under a unified interface:

- **crvUSD Mint Markets**: Allow users to mint crvUSD against approved collateral types (voted in by the DAO)
- **Lending Markets**: Traditional lending markets similar to Aave, where users borrow funds against collateral supplied by other users

## How to Use Llamalend

Llamalend offers two main ways to participate in the platform:

- **Borrowing**: You can borrow crvUSD or other assets by providing collateral. This is available in both mint markets and lend markets, allowing you to access liquidity while maintaining exposure to your crypto assets.

- **Supplying**: You can supply assets to earn yield by lending them to borrowers. This is only available in **lend markets** - mint markets don't offer supply opportunities since crvUSD is minted rather than borrowed from existing liquidity.

Whether you want to borrow for leverage or supply for yield, Llamalend provides a comprehensive platform for both use cases with isolated markets that keep risk contained.

**Market Structure**: All markets on Llamalend are **isolated one-way markets**, meaning each market only has one collateral token and one borrowable token. This design keeps risk contained within each market and makes it easier to understand your exposure. Unlike some other protocols where risks can spread across multiple assets, Llamalend's isolation ensures that problems in one market don't affect others.

## Mint vs Lend Markets

Mint markets enable users to **mint** crvUSD directly against specific collateral types that have been approved by the DAO. This is a direct minting process where new crvUSD tokens are created against deposited collateral. Lending markets operate like traditional DeFi lending protocols, where users **borrow** existing funds from vaults. No new tokens are minted - users borrow from the supply provided by other participants in the market.

Llamalend is all about crvUSD, therefor all lending markets must include crvUSD as either a collateral token or the borrowable token, ensuring integration with Curve's stablecoin ecosystem.

From a user interface and usage perspective, both products function identically. The primary operational difference is in how borrow rates behave between mint markets and lending markets.

<GuideCardGrid guideKeys={['howToBorrow', 'howToLend']} />

## Comparison to other protocols

Unlike traditional DeFi lending protocols like Aave or Compound, Curve's lending platform leverages a unique **LLAMMA (Lending-Liquidating AMM)** system that provides enhanced flexibility and protection during market volatility. This innovative approach combines the benefits of automated market making with lending mechanics, creating a more robust system for handling liquidations and price movements.

The LLAMMA system allows for more gradual liquidations compared to traditional protocols, reducing the risk of cascading liquidations during market stress. Additionally, the integration with Curve's AMM technology provides better price discovery and more efficient capital utilization.

Lending markets are permissionless - anyone can create new markets. This decentralized approach allows for organic growth of the lending ecosystem.

For simplicity, this documentation uses the unified "Llamalend" terminology throughout, with specific differences highlighted in relevant sections.


