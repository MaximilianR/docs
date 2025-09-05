---
title: Post Deployment
---

After deploying a pool, there are a few important steps to ensure it’s visible, functional, and capable of attracting liquidity and rewards.

## **Seed Initial Liquidity**
Before your pool can process any trades, it must be seeded with initial liquidity.

On the frontend, there is a filter enabled by default that hides low-TVL pools. If your pool has less than **$10,000 TVL**, it will not appear unless users manually disable that filter.

To kickstart your pool, it's recommended to add liquidity in **proportional balances**.


## **Integrations**
Pools deployed from Curve Factories are automatically picked up by major aggregators like 1inch, Odos or CowSwap. No need to hustle for integrations!


## **Token Logo Submission**

If your pool includes a token that does not yet have a logo on Curve, you can submit one:

- Open a pull request to the [**Curve token assets repository**](https://github.com/curvefi/curve-assets?tab=readme-ov-file#adding-a-token-icon).

This ensures the token displays correctly in the Curve UI.

---

## **Grow Liquidity Using Incentives (Optional)**

You can attract more liquidity to your pool using incentives like CRV emissions or external token rewards.

- Learn more in the [**Gauge Overview**](../gauge/overview.md)

> 💡 Many protocols also use bribe markets or partnership campaigns to grow TVL and boost gauge votes.

---

## **Monitor Performance and Update Parameters**

After deployment, it’s important to monitor the pool’s health:

- Check volume, TVL, and token balance regularly
- Watch for signs of imbalance or oracle issues (if applicable)
- Adjust parameters like amplification or fees if needed

Some pools are later optimized by external contributors or protocols. However, **it’s still a good idea to monitor your own pool** and explore whether tuning the parameters could improve performance.

If you'd like help evaluating or optimizing your pool, feel free to reach out in the official Curve channels.

---

## **Need Help?**

If anything seems broken or you're unsure how to proceed:

- Ask in the [**Curve Telegram**](https://t.me/curvefi) or [**Discord**](https://discord.gg/rgrfS7W)
- For protocol integrations and liquidity strategy, see the [**Protocols section**](../protocols/index.md)
