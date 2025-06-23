---
title: Gauge Weights
hide_title: true
---

import ThemedImage from '@theme/ThemedImage';

## What are Gauge Weights

On Curve, CRV token inflation is distributed through a weekly gauge weight system. Each gauge's weight is determined by the amount of veCRV votes it receives, with updates occurring every **Thursday at 00:00 UTC**. Gauges are smart contracts where users stake their LP tokens or vault shares, and the contract tracks each user's position to distribute rewards proportionally based on their share of the total staked value.

:::info Example
    **Thursday 00:00 UTC**: A snapshot is taken for this week's gauge weights. Pool A's gauge receives 10% of all veCRV votes. As a result, 10% of the weekly CRV inflation is allocated to Pool A's gauge and distributed to stakers throughout the week.
:::

<figure>
<ThemedImage
    alt="Weekly gauge weight cycle showing the voting and distribution timeline"
    sources={{
        light: require('@site/static/img/user/dao/gauge-weight-cycle-light.png').default,
        dark: require('@site/static/img/user/dao/gauge-weight-cycle-dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
/>
<figcaption>Weekly gauge weight cycle: votes are collected throughout the week and weights are updated every Thursday at 00:00 UTC</figcaption>
</figure>

To check the current gauge weights across all gauges, visit the [Curve DAO Gauge Section](https://www.curve.finance/dao/ethereum/gauges/) and connect your wallet to load the data.

<figure>
<ThemedImage
    alt="Current gauge weight distribution chart showing relative weights across different pools"
    sources={{
        light: require('@site/static/img/user/dao/gauge-relative-weight-light.png').default,
        dark: require('@site/static/img/user/dao/gauge-relative-weight-dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
/>
<figcaption></figcaption>
</figure>

Below the chart is a table listing each gauge. Users can click on a gauge to view analytics like past relative weights, how much CRV it's receiving this week, and other details.

<figure>
<ThemedImage
    alt="Individual gauge details page showing voting history and current metrics"
    sources={{
        light: require('@site/static/img/user/dao/gauge-light.png').default,
        dark: require('@site/static/img/user/dao/gauge-dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
/>
<figcaption></figcaption>
</figure>

---

## Voting for Gauge Weight

Users can vote in the next gauge weight week if they have a positive veCRV balance. If a user locks CRV, they will not be able to take part in the current gauge weight voting cycle and must wait for the next week. Gauge weights are not final and can be adjusted. You can change your vote on each gauge every 10 days. Your votes are not reset every Thursday at 00:00 UTC - if you don't change your weight, it will simply remain the same.

To get started, simply navigate to `DAO -> Gauges -> Voting` and connect your wallet:

<figure>
  <ThemedImage
    alt="Step 1: Navigate to DAO Gauges Voting page and connect wallet"
    sources={{
      light: require('@site/static/img/user/dao/enter-voting-light.png').default,
      dark:  require('@site/static/img/user/dao/enter-voting-dark.png').default,
    }}
    style={{ width: '800px', display: 'block', margin: '0 auto' }}
  />
</figure>

If you have already allocated some or all of your voting power, your vote weight distribution will show up:

<figure>
  <ThemedImage
    alt="Current vote weight distribution showing allocated voting power across gauges"
    sources={{
      light: require('@site/static/img/user/dao/vote-weight-distribution-light.png').default,
      dark:  require('@site/static/img/user/dao/vote-weight-distribution-dark.png').default,
    }}
    style={{ width: '600px', display: 'block', margin: '0 auto' }}
  />
</figure>

### Voting For the First Time

If you are voting for the first time, your used voting power is 0%. You are free to distribute up to 100% of your voting power across as many gauges as you wish.

<figure>
  <ThemedImage
    alt="First-time voter interface showing 0% used voting power"
    sources={{
      light: require('@site/static/img/user/dao/no-votes-light.png').default,
      dark:  require('@site/static/img/user/dao/no-votes-dark.png').default,
    }}
    style={{ width: '700px', display: 'block', margin: '0 auto' }}
  />
</figure>

To vote for your first gauge, click the blue "Add Gauge" button and select the gauge you want to vote for. You can search by name or gauge address.

<figure>
  <ThemedImage
    alt="Gauge search interface allowing users to find specific gauges"
    sources={{
      light: require('@site/static/img/user/dao/search-gauge-light.png').default,
      dark:  require('@site/static/img/user/dao/search-gauge-dark.png').default,
    }}
    style={{ width: '300px', display: 'block', margin: '0 auto' }}
  />
</figure>

After selecting the gauge, input the percentage of your voting power you want to assign, click the blue `Vote` button, and sign the transaction in your wallet to cast the vote.

<figure>
  <ThemedImage
    alt="Voting interface showing percentage allocation and vote button"
    sources={{
      light: require('@site/static/img/user/dao/vote-gauge-light.png').default,
      dark:  require('@site/static/img/user/dao/vote-gauge-dark.png').default,
    }}
    style={{ width: '700px', display: 'block', margin: '0 auto' }}
  />
</figure>

You can vote for as many gauges as you wish and use up to 100% of your voting power. Your overview page will update accordingly after each vote.

<figure>
  <ThemedImage
    alt="Updated vote weight distribution after casting votes"
    sources={{
      light: require('@site/static/img/user/dao/weight-update-light.png').default,
      dark:  require('@site/static/img/user/dao/weight-update-dark.png').default,
    }}
    style={{ width: '700px', display: 'block', margin: '0 auto' }}
  />
</figure>

### Updating Your Gauge Weights

If you've already voted for a gauge and want to adjust your allocation, you can do so at any time — but with one important restriction: You can only **change your vote on a specific gauge once every 10 days**.

To update your current weights:
1. Click on the gauge you want to update
2. Enter the new percentage you want to allocate (any value between 0% and your available voting power)
3. Click the `Update Vote` button
4. Sign the transaction in your wallet

<figure>
  <ThemedImage
    alt="Gauge weight update interface showing current allocation and update options"
    sources={{
      light: require('@site/static/img/user/dao/update-weight-light.png').default,
      dark:  require('@site/static/img/user/dao/update-weight-dark.png').default,
    }}
    style={{ width: '900px', display: 'block', margin: '0 auto' }}
  />
</figure>

The UI shows you the exact date and time when you'll be able to update your vote on each gauge again. In this example, the user needs to wait until June 27th to adjust the weight.

:::info **Example**  
You previously allocated **80%** of your voting power to the reUSD/scrvUSD gauge. You can reduce it to **60%**, and immediately reallocate the freed-up **20%** to other gauges.  
However, if you later want to reduce your vote on reUSD/scrvUSD again (e.g., from 20% to 10%), you'll need to wait 10 days from your last change to that specific gauge.
:::

---

## FAQ

### Getting Started & Prerequisites

**What is veCRV & why do I need it to vote?**  
veCRV (vote-escrowed CRV) is a token you get when you lock your CRV tokens for a specific period. The longer you lock, the more veCRV you receive. You need veCRV to participate in gauge weight voting because it represents your voting power in the Curve DAO.

**What if I add more CRV or extend my lock?**  
If you increase your veCRV balance (by locking more CRV or extending the lock), your vote power increases — but you must **re-vote** to apply the new power.

**What's the minimum amount of veCRV I need to vote?**  
There's no minimum amount of veCRV required to vote. However, the more veCRV you have, the more voting power you'll have. Even a small amount of veCRV allows you to participate in the governance process.

**Do I need to stake LP tokens to vote on gauges?**  
No, you don't need to stake LP tokens to vote on gauges. Gauge voting and LP staking are separate activities. You can vote on gauges with just your veCRV tokens. However, to earn rewards from the gauges you vote for, you would need to stake LP tokens in those specific pools.

### Voting Mechanics

**Can I vote for multiple gauges at once?**  
Yes! You can vote for as many gauges as you want, but your total voting allocation cannot exceed 100% of your voting power. You can distribute your votes across multiple gauges (e.g., 40% to gauge A, 30% to gauge B, 30% to gauge C).

**How often can I change my vote?**  
You can update your voting weights **once every 10 days**.

**How often are gauge weights updated?**  
Gauge weights are recalculated every **Thursday at 00:00 UTC**, based on all active votes.

**What happens if I don't use all 100% of my voting power?**  
If you don't use all 100% of your voting power, the unused portion simply goes unused. You're not penalized for this, but you're missing out on potential influence. You can always come back later to allocate the remaining voting power.

**When do my votes take effect?**  
Your votes take effect at the next weekly update, which happens every **Thursday at 00:00 UTC**. If you vote on Wednesday, your votes will be active starting Thursday. If you vote on Friday, you'll need to wait until the following Thursday.

**What happens if I try to vote on a gauge before the 10-day cooldown expires?**  
The UI will prevent you from voting on that gauge. If you attempt to do so, the transaction will fail and you'll see an error message. You'll need to wait until the 10-day cooldown period expires before you can modify your vote on that specific gauge again.

**Do my votes carry over to the next week if I don't change them?**  
Yes! Your votes automatically carry over to the next week. You don't need to re-vote every week unless you want to change your allocations.

**Should I reset my gauge votes before re-voting?**  
No. Resetting your votes (setting your votes to 0%) will trigger a 10-day cooldown for those gauges. To update your vote, just re-cast it — no reset needed. E.g. if you want to decrease your vote for a gauge from 80% to 60%, don't do `80 -> 0 -> 60`. Simply do `80 -> 60`.

:::warning
Resetting gauge weights before re-voting will block you from voting again for 10 days on those same gauges.  
Always **re-vote directly** unless you're intentionally changing your selection.
:::

### Rewards & Benefits

**How do I earn rewards from gauge voting?**  
Gauge voting itself doesn't directly earn you rewards. However, by voting on gauges, you're helping direct CRV emissions to specific pools. To actually earn rewards, you need to stake your LP tokens in the pools that have gauges you voted for.

**Do I earn CRV just by voting, or do I need to stake LP tokens too?**  
You need to stake LP tokens to earn CRV rewards. Voting on gauges only directs where the CRV emissions go - it doesn't earn you rewards directly. You must stake LP tokens in the pools you voted for to receive the CRV rewards.

**When do I receive rewards from my gauge votes?**  
Rewards are distributed continuously throughout the week to users who have staked LP tokens in the gauges. The rewards you receive depend on your share of the total staked value in that gauge. You can claim your rewards at any time through the Curve interface.