---
title: How Curve Compares to Other AMMs
---

# How Curve Compares to Other AMMs

Curve’s automated-market-maker (AMM) designs focus on a single goal: **help passive liquidity providers (LPs) earn more over time while keeping trading seamless for users**.  
Where many AMMs rely on active range management or frequent re-balancing, Curve pools stay *always-on* with no maintenance overhead.

## Passive Liquidity by Design

- **No range selection** – LPs deposit once and every coin stays available at every price.  
- **Zero babysitting** – no need to watch markets or migrate positions when prices move.  
- **Continuous fees** – every trade uses 100 % of the pool’s TVL, so capital never sits idle.

Teams and treasuries can treat their deposits as productive balance-sheet assets rather than trading positions that constantly need attention.

## Stableswap — Purpose-Built for Pegged Assets

For tokens that *should* trade 1 : 1 (stablecoins, liquid-staking tokens, bridged assets), Curve’s **Stableswap** invariant blends two classic AMM curves:

- **Constant-sum (`x + y = k`)** near the peg – almost zero slippage.  
- **Constant-product (`x × y = k`)** further away – continuous liquidity at wider spreads.

A single parameter, **A (amplification)**, controls how quickly the curve transitions between these behaviours. Higher *A* keeps more liquidity near the peg; lower *A* spreads it more evenly. Pool creators choose *A* once and the curve adapts automatically – no manual tuning required.

:::info
For a deeper look, see the original **Stableswap white paper**.  
:::

## Cryptoswap — Adaptive for Correlated & Volatile Pairs

Not every pair is locked to a hard peg. **Cryptoswap** (Curve v2) extends the same *always-in-range* philosophy to assets with correlated but moving prices — think ETH-stETH, BTC-wBTC, or tokenised derivatives.

**How it works (in brief)**  
1. **Dynamic price scale** – the pool tracks the market price with an on-chain moving average.  
2. **Automatic rebalancing** – an internal price parameter adjusts gradually (`ma_time`, `adjustment_step`) so the pool’s centre follows the market without large arbitrage windows.  
3. **Two-factor curve** – classic Stableswap parameters (`A`, `gamma`) shape liquidity, while the dynamic *price scale* shifts the entire curve as the market moves.  
4. **Dynamic fees** – trading fees rise when the pool is imbalanced and fall when it is in equilibrium, cushioning LPs during volatile moves.

This design keeps **all liquidity active**, handles wider correlated price swings gracefully, and provides traders with smooth slippage curves instead of sudden liquidity cliffs.

:::info
For a deep dive, see the white paper **“Automatic Market-Making with Dynamic Peg”** (Curve v2 Cryptoswap).  
:::

## Always-In-Range Liquidity

Because Curve pools never fall *out* of range, traders avoid sudden slippage spikes and LPs avoid silent fee droughts.  
In repeated market-wide stress events, Curve pools have remained liquid even when range-based AMMs showed gaps.

## Stress-Tested in the Wild

Stablecoin de-pegs, bridge outages, rapid repricings — Curve pools have processed them all while continuing to quote trades and collect fees. Years of live-market data back the design, giving builders confidence that their token markets will keep functioning when conditions turn turbulent.

Launching on Curve means offering users dependable pricing **and** giving LPs a truly passive, revenue-generating experience — no dashboards to babysit, no tick ranges to tweak, just capital that works.
