---
id: loan-management
title: Managing a Loan
sidebar_label: Managing a Loan
---

import ThemedImage from '@theme/ThemedImage';

Prerequisite for this page is that you already have an existing loan: [Open and Close Loan](open-and-close.md)

## Loan Management Overview

The actions available to you depend on whether your loan is in **liquidation protection** or not. Understanding this distinction is crucial for effective loan management.

| Action | Available When | Effect on Liquidation Range |
|--------|----------------|----------------------------|
| **Add collateral** | Only when NOT in liquidation | ⬇️ Moves range DOWN (safer) |
| **Remove collateral** | Only when NOT in liquidation | ⬆️ Moves range UP (riskier) |
| **Borrow more** | Only when NOT in liquidation | ⬆️ Moves range UP (riskier) |
| **Repay debt (NOT in liquidation)** | When NOT in liquidation | ⬇️ Moves range DOWN (safer) |
| **Repay debt (IN liquidation)** | When IN liquidation | ➖ NO effect on range (only improves health) |
| **Self-liquidate** | Only when IN liquidation | ➖ No effect (closes loan) |

:::info Key Understanding
- **Liquidation range changes** only happen when your loan is NOT in liquidation protection
- **Repaying debt** behaves differently: it moves the liquidation range when NOT in liquidation, but has NO effect on the range when IN liquidation
- **Collateral and borrowing actions** are only possible when NOT in liquidation, so they always affect the liquidation range
:::


## Adding More Collateral
:::warning Adding Collateral while being in Liquidation is not possible
Adding collateral is not possible when your loan is in liquidation. To get out of liquidation, see [here].
:::

To add more collateral to your loan, navigate to the `Collateral` and `Add collateral` tab and select the amount of collateral tokens to add:

<figure>
<ThemedImage
    alt="Add collateral interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/loan-management/adding-collateral-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/loan-management/adding-collateral-dark.png').default,
    }}
    style={{ width: '400px', display: 'block', margin: '0 auto' }}
/>
</figure>

**Effect of Adding More Collateral**

Adding more collateral to your loan has a **positive effect on its health and liquidation range**. It increases your loan's health and moves the liquidation range further down, keeping your position further away from liquidation.

:::info Important
This action is only possible when NOT in liquidation, so it will always change your liquidation range.
:::


## Removing Collateral
:::warning Removing Collateral while being in Liquidation is not possible
Removing collateral from your loan is not possible when you are in liquidation. To get out of liquidation, see [here].
:::

To remove collateral from your loan, navigate to the `Collateral` and `Remove collateral` tab and select the amount of collateral tokens to remove. The UI will show you how much collateral you can remove to still support the current debt.

<figure>
<ThemedImage
    alt="Remove collateral interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/loan-management/removing-collateral-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/loan-management/removing-collateral-dark.png').default,
    }}
    style={{ width: '400px', display: 'block', margin: '0 auto' }}
/>
</figure>

**Effect of Removing Collateral**

Removing collateral from your loan has a **negative effect on its health and liquidation range**. It decreases your loan's health and moves the liquidation range further up, bringing you closer to liquidation.

:::info Important
This action is only possible when NOT in liquidation, so it will always change your liquidation range.
:::

---

## Borrow More

:::warning Borrowing more in Liquidation
Borrowing more crvUSD in liquidation is not possible. To get out of liquidation, see [here].
:::

To borrow more assets, specify the amountyou want to borrow. You also have the option to add more collateral at the same time — allowing you to increase both your debt and your collateral in a single transaction.

<figure>
<ThemedImage
    alt="Borrow more interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/loan-management/borrow-more-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/loan-management/borrow-more-dark.png').default,
    }}
    style={{ width: '400px', display: 'block', margin: '0 auto' }}
/>
</figure>

**Effect of Borrowing More**

Borrowing more crvUSD is only possible if the loan is not in liquidation. Borrowing more crvUSD will decrease the loan's health and move up the liquidation range, bringing you closer to liquidation.

:::info Important
This action is only possible when NOT in liquidation, so it will always change your liquidation range.
:::


## Repaying Debt

Debt can be repaid fully or partially. Repayment is always possible, whether the loan is in liquidation or not, but it will have different effects on the liquidation range.

<figure>
<ThemedImage
    alt="Partial repayment interface"
    sources={{
        light: require('@site/static/img/user/llamalend/guides/borrow/loan-management/partial-repay-light.png').default,
        dark: require('@site/static/img/user/llamalend/guides/borrow/loan-management/partial-repay-dark.png').default,
    }}
    style={{ width: '400px', display: 'block', margin: '0 auto' }}
/>
</figure>

### Partial Repayment while NOT in Liquidation

Repaying debt when the loan is not in liquidation improves the health of the loan and **moves the liquidation range down**, bringing the loan further away from liquidation.

:::info Important
When NOT in liquidation, repaying debt will change your liquidation range.
:::

### Partial Repayment while IN Liquidation

Repaying debt while being in liquidation will increase your health, but **NOT move the liquidation range**. No matter how much you repay, it will never move your liquidation range up or down but will only increase your health.

:::warning Liquidation Range will NOT move!
Your liquidation range will not move if you repay debt while you're in liquidation — not even if you repay 99% of your debt. This is a key difference from repaying when NOT in liquidation.
:::

### Full Repayment

see here: [Close Loan](./open-and-close.md#fully-repaying).