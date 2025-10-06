---
title: veCRV
sidebar_label: veCRV
hide_title: true
---

import GuideCardGrid from '@site/src/components/GuideCardGrid';
import VecrvSupply from '@site/src/components/LiveComponents/VecrvSupply';
import InlinePill from '@site/src/components/InlinePill';

import VecrvLogo from '@site/static/img/logos/veCRV_s.png';


# <img src={VecrvLogo} className="heading-inline-logo" alt="veCRV" /> The veCRV Token

veCRV stands for vote-escrowed CRV (locked CRV). You receive veCRV by locking your CRV tokens for a period between 1 week and 4 years. **The longer the lock, the more veCRV you receive.**

Holding veCRV has 4 main benefits:

1. [**Proposal Creation and Voting**](../dao/proposals): veCRV holders can create and vote on governance proposals
2. [**Gauge weight voting**](../dao/voting-gauges): Deciding which pools and Llamalend markets receive the weekly CRV inflation
3. [**Boosting**](../vecrv/boosting): Boosting your own CRV rewards by up to 2.5x if you LP in a pool or Llamalend market
4. [**Fee Revenue**](../vecrv/revenue): Receiving a share of the weekly fee revenue Curve generates

See the guides below for how to lock your CRV for veCRV, and how to claim your earned share of DAO revenue.

<GuideCardGrid guideKeys={['lockingCrv', 'claimingVecrvRevenue']} />

---

## Current veCRV Stats

The following table pulls current data from <InlinePill icon="/img/logos/ethereum.png" label="Ethereum" />

<VecrvSupply />

## More Information

For more on how locking works and how rewards and boosting are calculated, see the [main veCRV documentation](../vecrv/what-is-vecrv).

## FAQ

### Can I send my veCRV to a different wallet?

No, veCRV cannot be transferred or traded. It stays in the wallet that locked the CRV.

### Can I lock CRV through a multisig wallet or smart contract?

Yes, CRV can now be locked to veCRV by any wallet, multisig or smart contract.  Previously smart contracts needed to be whitelisted, but this was removed by [DAO vote in May, 2025](https://www.curve.finance/dao/ethereum/proposals/1062-ownership/).

### Can I withdraw my CRV before my lock ends?

No, once locked, your CRV cannot be withdrawn until your chosen lock-up period expires.
