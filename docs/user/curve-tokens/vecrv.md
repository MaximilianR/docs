---
title: veCRV
sidebar_label: veCRV
hide_title: true
---

import GuideCardGrid from '@site/src/components/GuideCardGrid';
import VecrvSupply from '@site/src/components/LiveComponents/VecrvSupply';
import InlinePill from '@site/src/components/InlinePill';

import VecrvLogo from '@site/static/img/logos/veCRV_s.png';

# <img src={VecrvLogo} className="heading-inline-logo" alt="veCRV" /> veCRV

veCRV stands for vote-escrowed CRV (locked CRV). You receive veCRV by locking your CRV tokens for a period between 1 week and 4 years. **The longer the lock, the more veCRV you receive.**

:::warning
veCRV is not transferable. If you lock CRV into veCRV, the only way to get it back is by waiting for your lock to expire.
:::

Holding veCRV has four main benefits:

1. [**Revenue Share**](../vecrv/revenue): Receive a share of the weekly fee revenue Curve generates
2. [**Gauge weight voting**](../dao/gauge-weights): Decide which pools and Llamalend markets receive the weekly CRV inflation
3. [**Voting**](../dao/proposals): Vote on governance proposals
4. [**Boosting**](../vecrv/boosting): Boost your own CRV rewards by up to 2.5x if you provide liquidity to a pool or lending market

<GuideCardGrid guideKeys={['lockingCrv', 'claimingVecrvRevenue']} />

For more on how locking works and how rewards and boosting are calculated, see the [main veCRV documentation](../vecrv/what-is-vecrv).

---

## Current veCRV Stats

Current veCRV stats directly fetched from <InlinePill icon="/img/logos/ethereum.png" label="Ethereum" />

<VecrvSupply />

---

## FAQ

### Can I send my veCRV to a different wallet?

No, veCRV cannot be transferred or traded. It stays in the wallet that locked the CRV.

### Can I lock CRV through a multisig wallet or smart contract?

Yes, CRV can now be locked to veCRV by any wallet, multisig, or smart contract. Previously, smart contracts needed to be whitelisted, but this was removed by a [DAO vote in May 2025](https://www.curve.finance/dao/ethereum/proposals/1062-ownership/).

### Can I withdraw my CRV before my lock ends?

No, once locked, your CRV cannot be withdrawn until your chosen lock-up period expires.
