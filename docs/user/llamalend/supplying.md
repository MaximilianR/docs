---
id: supplying
title: Supplying
sidebar_label: Supplying
---

import ThemedImage from '@theme/ThemedImage';
import GuideCardGrid from '@site/src/components/GuideCardGrid';

## Why Supply to Llamalend?

Supplying assets to Llamalend allows users to earn yield by lending their crypto assets to borrowers. Users supply assets to lending market vaults, where they become available for other users to borrow. Users supplying to Llamalend benefit from:

- **Passive & Uncomplicated Yield**: Earn interest from borrowers who pay rates based on market utilization. The interest borrowers pay is distributed to suppliers based on their share of the total supplied assets. The supply rate accumulates automatically, so no need to spend transaction fees on claiming it. Users may also earn staking incentives such as CRV rewards or external token rewards in addition to the supply rate, though these additional rewards need to be claimed.
- **Isolated Markets**: All markets are isolated and one-way, meaning each market is self-contained with just one type of collateral and one borrowable token. Because markets are separate, problems in one market won't spread to others, reducing risk
- **No Lockups**: Users can withdraw their supplied assets at any time, as long as there are enough unborrowed assets available in the vault.
- **Permissionless Markets**: The isolated market design makes it safe to allow anyone to create lending markets, providing more opportunities for suppliers

<GuideCardGrid guideKeys={['howToLlamalendSupplyDeposit', 'howToLlamalendSupplyClaim', 'howToLlamalendSupplyWithdraw']} />

## Supply Yields

When users supply assets to Llamalend lending markets, they earn yield from multiple potential sources: **supply rate** and **staking incentives**.

### Supply Rate

The supply rate is always earned when supplying assets to lending markets. This rate is **dynamic** and directly tied to the borrow rates in each market. When borrowers pay interest on their loans, that interest is distributed to suppliers based on their share of the total supplied assets. The supply rate is calculated and accrued every second, automatically growing the user's supplied balance over time.

Supply rates in lending markets depend on market utilization — the percentage of supplied assets that are being borrowed. Each market has a minimum and maximum rate range. The higher the utilization, the higher both the borrow rate and the supply rate.

The supply rate is calculated as:

$$
\text{supply rate} = \frac{\text{total borrowed}}{\text{total supplied}} \times \text{borrow rate}
$$

When utilization is low, supply rates are lower and there's plenty of liquidity available for borrowers. As utilization increases, both borrow rates and supply rates increase, providing higher returns for suppliers. At full utilization (100%), the supply rate reaches its maximum.

### Staking Incentives

In addition to the supply rate, users may also earn **staking incentives** when supplying to lending markets. Staking incentives can include CRV rewards distributed via gauge weights every week. If a lending market has gauge weight allocated to it, CRV tokens are emitted to that market, and users who supply assets there earn a share of these rewards based on their supply share.

Some lending markets may also offer additional staking incentives such as protocol points or external token rewards, depending on the specific market and its partnerships.
