---
id: what-is-vecrv
title: What is veCRV?
sidebar_label: What is veCRV?
---

import ThemedImage from '@theme/ThemedImage';
import GhostArticle from '@site/src/components/GhostArticle';

**veCRV** stands for **vote-escrowed CRV**. It is a token users receive when they lock their CRV tokens for a period of time, which can range from a minimum of 1 week up to a maximum of 4 years. The longer users choose to lock their CRV, the more veCRV they receive in return. 

:::warning
Unlike regular tokens, **veCRV is not transferrable**, and the **amount users hold gradually decreases** as their lock approaches its expiry date. The initial locked CRV can be withdrawn after the lock has ended.
:::

## Benefits of Holding veCRV

Holding veCRV unlocks several important benefits:

- [Earn Protocol Fees:](./revenue.md) veCRV holders receive a share of trading fees and a portion of interest from Curve's stablecoin markets.
- [Boosted CRV Rewards:](./boosting.md) If users provide liquidity to Curve pools, holding veCRV can boost their CRV rewards.
- [Governance:]((./faq.md)) veCRV gives users voting power in the Curve DAO, including on proposals and gauge weight votes that determine CRV emissions.


## How veCRV Works

When users lock their CRV, the amount of veCRV they receive depends on both the quantity of CRV locked and the length of the lock. For example, locking 1 CRV for the maximum period of 4 years grants users 1 veCRV, while locking the same amount for just 1 year gives users 0.25 veCRV. This relationship is defined by a simple formula:

$$
\text{veCRV} = \frac{\text{CRV locked} \times \text{Years until unlock}}{4}
$$

As time passes, users' veCRV balance decays linearly, reflecting the decreasing time left on their lock. Users can **only have one active lock per address**, but they are free to **add more CRV or extend the lock duration** at any time. Once the lock expires, users' veCRV balance reaches zero and they can withdraw all their originally locked CRV tokens.

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="veCRV Decay"
    sources={{
      light: require('@site/static/img/user/vecrv/vecrv_decay1.png').default,
      dark: require('@site/static/img/user/vecrv/vecrv_decay1.png').default,
    }}
    style={{
      maxWidth: '500px',
      width: '100%'
    }}
  />
</figure>


## The Idea Behind Vote-Escrow 

Curve pioneered the vote-escrow (ve) tokenomics model with the launch of veCRV in 2020, setting the standard for commitment-based governance in DeFi. This innovative approach has since been adopted by many other protocols, establishing ve-tokenomics as a dominant framework for aligning long-term incentives in decentralized systems.

The veCRV model builds sustainable value through commitment, not scarcity. By locking tokens for governance and rewards, veCRV creates a governance-driven ecosystem where long-term users are incentivized to participate, vote, and contribute to protocol success. Unlike buyback-and-burn models that treat holders as passive beneficiaries, veCRV empowers users to shape the protocol's direction while rewarding them in line with their commitment. The longer users lock their CRV, the greater their voting power, boosted rewards, and share of protocol revenue.

<GhostArticle 
  slug="beyond-burn-why-vecrv-unlocks-sustainable-tokenomics-for-curve"
  showTitle={true}
  showMeta={false}
/>