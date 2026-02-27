---
id: community-fund-treasury
title: Community Fund & Treasury
sidebar_label: Community Fund & Treasury
---

import TokenBalance from '@site/src/components/LiveComponents/TokenBalance';
import CrvLogo from '@site/static/img/logos/CRV_xs.png';
import CrvusdLogo from '@site/static/img/logos/crvUSD_xs.png';

## Community Fund

Curve initially distributed around 151M CRV to a Community Fund fully controlled by the DAO, intended for use in emergencies or as rewards for community-led initiatives such as grants. Funds can be allocated via a governance proposal and can only be distributed through a linear vesting over a minimum duration of one year.

The Community Fund is deployed on Ethereum at [`0xe3997288987e6297ad550a69b31439504f513267`](https://etherscan.io/address/0xe3997288987e6297ad550a69b31439504f513267).

<TokenBalance
  tokenAddress="0xD533a949740bb3306d119CC777fa900bA034cd52"
  holderAddress="0xe3997288987e6297ad550a69b31439504f513267"
  tokenName="CRV"
  logo={CrvLogo}
  priceApiUrl="https://prices.curve.finance/v1/usd_price/ethereum/0xD533a949740bb3306d119CC777fa900bA034cd52"
/>

:::info Looking for a Grant?
    If you are building something which in our view deserves a grant from Curve, please feel free to reach out in the dedicated Telegram channel: [Curve Ecosystem Grants](https://t.me/curve_grants) or create a proposal on the [Governance Forum].
:::

## Treasury

On June 27, 2025, the Curve DAO voted to establish a dedicated Treasury, allocating **10% of DAO revenue** to it. These funds belong to the DAO and remain entirely under its control. With a successful governance vote, they can be used for any purpose the DAO chooses, such as development, research, risk assessment, bad debt insurance, bug bounties, audits, or anything else the DAO deems appropriate. Check the governance forum post [here](https://gov.curve.finance/t/activate-the-fee-allocator-and-redirect-10-of-revenue-to-community-fund/10676).

In comparison to the community fund, assets do not require a one-year vesting period, which makes the usage of these funds much more convenient.

The Treasury is deployed on Ethereum at [`0x6508ef65b0bd57eabd0f1d52685a70433b2d290b`](https://etherscan.io/address/0x6508ef65b0bd57eabd0f1d52685a70433b2d290b).

<TokenBalance
  tokenAddress="0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E"
  holderAddress="0x6508eF65b0Bd57eaBD0f1D52685A70433B2d290B"
  tokenName="crvUSD"
  logo={CrvusdLogo}
  priceApiUrl="https://prices.curve.finance/v1/usd_price/ethereum/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E"
/>
