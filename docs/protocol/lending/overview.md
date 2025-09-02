---
id: overview
title: Lending Overview
sidebar_label: Overview
---

# Lending Protocol Overview

Curve's lending protocol, **Llamalend**, is a decentralized, permissionless lending system built on the crvUSD stablecoin infrastructure. It enables users to borrow crvUSD against various collateral assets or use crvUSD as collateral to borrow other tokens.

## Core Architecture

Llamalend operates on a **one-way isolated market** model where each lending market has a single collateral token and a single borrowable token. These markets are completely independent from each other, preventing cross-contamination and allowing for precise risk management per asset pair.

Every lending market must include **crvUSD** as either the collateral asset or the borrowable asset. This design ensures deep integration with Curve's stablecoin ecosystem while maintaining market isolation. For example, a market could have ETH as collateral and crvUSD as borrowable, or crvUSD as collateral and USDC as borrowable.

## Key Features

The protocol is fully permissionless, meaning anyone can deploy a new lending market without requiring centralized approval. This community-driven approach allows for rapid expansion of lending options while maintaining security through proper parameter configuration. Each market operates independently with its own risk parameters, liquidation thresholds, and interest rate models.

Market isolation is a fundamental security feature that prevents bad debt from spreading across different asset pairs. If one market experiences issues, it remains contained and doesn't affect the stability of other markets. This isolation also allows for customized risk management strategies tailored to each specific asset pair.

## How It Works

Market creation begins with deploying a lending market contract with the chosen collateral and borrowable token pair. The deployer sets initial parameters including collateralization ratios, liquidation thresholds, fees, and oracle configurations. Once deployed, the market becomes immediately available for users to interact with.

The lending process involves users depositing their chosen collateral token into the market, which then allows them to borrow the borrowable token up to their collateralization limit. Users must maintain a health factor above the liquidation threshold by either adding more collateral or repaying some of their debt. Interest accrues on borrowed amounts and is paid to lenders who provide liquidity to the market.

Risk management is automated through dynamic liquidation mechanisms that trigger when positions fall below the required health factor. Oracle-based price feeds ensure accurate collateral valuation, while configurable safety parameters allow market deployers to set appropriate risk levels for their specific asset pairs.

## Market Parameters

Each lending market has configurable parameters that significantly impact its risk profile and efficiency. The collateralization ratio determines the minimum collateral required for borrowing, while the liquidation threshold sets the health factor level that triggers automatic liquidation. Interest rates are typically dynamic and based on market utilization, encouraging efficient capital allocation.

Additional parameters include protocol and market-specific fees, oracle update frequencies, and emergency pause capabilities. These settings allow market deployers to create markets that balance risk and reward according to their specific requirements and market conditions.

## Use Cases

Borrowers can leverage Llamalend for various strategies including leverage trading with borrowed crvUSD, yield farming using borrowed assets, or obtaining working capital without selling their collateral. The ability to use crvUSD as collateral also enables users to borrow other tokens while maintaining exposure to Curve's stablecoin ecosystem.

Lenders benefit from earning interest on their deposited assets while contributing to market liquidity. The isolated market structure allows for portfolio diversification across multiple asset pairs, each with different risk profiles and return characteristics. Risk-adjusted returns can be optimized by carefully selecting markets based on their parameter configurations.

## Security and Getting Started

Security is maintained through the isolated market design, oracle redundancy for price feed reliability, and robust liquidation mechanisms that protect against bad debt accumulation. Each market can have its own governance structure for parameter updates, and emergency pause capabilities provide additional protection during critical situations.

To begin using Llamalend, users should first review existing markets to understand current options and risk profiles. Those interested in deploying new markets should carefully consider parameter selection to ensure smooth operation. The deployment process requires technical knowledge but is designed to be accessible to developers familiar with smart contract deployment.

For detailed deployment instructions and parameter optimization strategies, see the [Deployment Guide](./guides/deploy-lending-market.md) and [Oracles & Parameters](./oracles-and-parameters.md) documentation.