---
title: crvUSD
sidebar_label: crvUSD
hide_title: true
---

import CrvusdSupply from '@site/src/components/LiveComponents/CrvusdSupply';
import InlinePill from '@site/src/components/InlinePill';
import GuideCardGrid from '@site/src/components/GuideCardGrid';

import CrvusdLogo from '@site/static/img/logos/crvUSD_s.png';

# <img src={CrvusdLogo} className="heading-inline-logo" alt="crvUSD" /> crvUSD

crvUSD is a fully **decentralized, censorship-resistant, and un-freezable** USD stablecoin created by Curve. Unlike centralized stablecoins like USDC or USDT, which are mostly backed by t-bills, crvUSD is fully backed by crypto assets and is controlled by smart contracts and the Curve DAO. Its home is Ethereum, but crvUSD can be bridged to most EVM-compatible chains.

crvUSD can be obtained in two ways: by borrowing it using crypto assets like ETH or BTC as collateral (which lets you access liquidity without selling your crypto) or by simply buying it.

<GuideCardGrid guideKeys={['borrowCrvusd']} />

---

## Current crvUSD Stats

Current crvUSD stats directly fetched from <InlinePill icon="/img/logos/ethereum.png" label="Ethereum" />

<CrvusdSupply />

---

## FAQ

### What can I do with crvUSD?

You can do many things with crvUSD: from simply holding it to earning yield or spending it for real-life expenses. 

### Can I earn yield with crvUSD?

Yes, you can earn rewards with your crvUSD on Curve in a few ways:

- **Deposit into [scrvUSD](./scrvusd.md)**: Earn yield with the savings version of crvUSD
- **Supply it to a lending market**: Provide your crvUSD to borrowers and earn interest on it
- **Provide liquidity to a crvUSD trading pool**: Add crvUSD to a liquidity pool and earn trading fees

### What chains is crvUSD available on?

crvUSD is primarily minted on Ethereum, but it can be bridged and used on many other chains. See [crvUSD Chain Deployment Addresses](https://docs.curve.finance/deployments/crvusd/#crvusd-crosschain) for a full list.
