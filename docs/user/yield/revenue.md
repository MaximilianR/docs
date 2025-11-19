---
title: veCRV Revenue Share
hide_title: true
sidebar_label: veCRV Revenue Share
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';
import ButtonGrid from '@site/src/components/ButtonGrid';
import VecrvLogo from '@site/static/img/logos/veCRV_s.png';

# <img src={VecrvLogo} className="heading-inline-logo" alt="veCRV" /> veCRV Revenue Share

Users who lock their CRV for veCRV will earn a portion of the revenue generated on Curve. **Every week within 24hrs after Thursday 00:00 UTC, the previous week's revenue is being distributed to veCRV holders to claim.** Revenue is mainly generated from two sources:

1.  **DEX Trades**: Each time a trade happens on Curve, a portion of trading fees are collected and distributed to veCRV holders.
2.  **crvUSD**: When a user borrows crvUSD from a [minting market](https://curve.finance/crvusd), portions of the interest paid is going to veCRV holders.

You can check the current veCRV metrics, estimated earnings, and historical data using the button below, or here: [veCRV Analytics](https://www.curve.finance/dao/ethereum/analytics/)

<GuideCardGrid guideKeys={['claimingVecrvRevenue']} />

<ButtonGrid buttonKeys={['gotoVecrvAnalytics', 'claimVecrvRevenue']} />
