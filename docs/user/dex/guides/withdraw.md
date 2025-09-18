---
id: withdraw
title: 'Guide: How to Unstake & Withdraw'
sidebar_label: Unstake & Withdraw
---

import ThemedImage from '@theme/ThemedImage';
import ButtonGrid from '@site/src/components/ButtonGrid';

To withdraw from a pool, you may have to first `Unstake` your tokens if you have staked them.  These are two separate actions, and unfortunately cannot be done together like `Deposit & Stake`.  

## Unstaking

To unstake, go to the `Withdraw/Claim` tab on the left, then click `Unstake`:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Unstake"
    sources={{
      light: require('@site/static/img/ui/dex/unstake-light.png').default,
      dark: require('@site/static/img/ui/dex/unstake-dark.png').default,
    }}
    style={{
      maxWidth: '300px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

You can choose to unstake a portion or all of your LP tokens.  After choosing your desired amount, click the `Unstake` button and confirm the transaction within your wallet.  Once successful you will receive confirmation that your tokens are now unstaked:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Unstake"
    sources={{
      light: require('@site/static/img/ui/dex/unstake-success-light.png').default,
      dark: require('@site/static/img/ui/dex/unstake-success-dark.png').default,
    }}
    style={{
      maxWidth: '300px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

## Withdrawing

To withdraw, go to the `Withdraw/Claim` tab on the left, then click `withdraw`.  You should then a menu like this:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Unstake"
    sources={{
      light: require('@site/static/img/ui/dex/withdraw-light.png').default,
      dark: require('@site/static/img/ui/dex/withdraw-dark.png').default,
    }}
    style={{
      maxWidth: '300px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

Above we have chosen to withdraw all our LP tokens by clicking `MAX`, then we chose what assets we wanted:

- **One Coin**: Withdraw everything as just `crvUSD` or `USDC`
- **Balanced**: Each LP token is worth an equal share of the all the `crvUSD` and `USDC` in the pool.  In our case, each LP token was worth 0.61 `USDC` and 0.41 `crvUSD`, so in total our balanced withdrawal of 9805 LP tokens would be 5989 `USDC` and 4047 `crvUSD`
- **Custom**: This lets you withdraw in any ratio you wish, for example, receiving 1000 `crvUSD` and the rest as `USDC`

Above we are going to withdraw our LP tokens as solely `crvUSD`, because that is what we initially deposited.

Click on `Withdraw` and confirm the withdrawal within your wallet.  Once this is successful the UI will show a confirmation:

<figure style={{ textAlign: 'center' }}>
  <ThemedImage
    alt="Withdraw"
    sources={{
      light: require('@site/static/img/ui/dex/withdraw-success-light.png').default,
      dark: require('@site/static/img/ui/dex/withdraw-success-dark.png').default,
    }}
    style={{
      maxWidth: '300px',
      width: '100%'
    }}
  />
  <figcaption></figcaption>
</figure>

Congratulations you successfully provided liquidity to a Curve DEX pool!

You can see here that we initially deposited 10,000 `crvUSD`, but were able to withdraw 10,034 `crvUSD`, a profit of 34 `crvUSD` which was earned from swap fees.