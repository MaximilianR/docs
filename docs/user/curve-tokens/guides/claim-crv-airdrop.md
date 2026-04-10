---
id: claim-crv-airdrop
title: 'Guide: Claiming Pre-CRV Airdrop'
sidebar_label: Claim Pre-CRV Airdrop
---

# Claiming the Pre-CRV Liquidity Provider Airdrop

Before the CRV token [launched](https://etherscan.io/tx/0x5dc4a688b63cea09bf4d73a695175b77572792a2e2b3656297809ad3596d4bfe) in August 2020, early liquidity providers were already supplying assets to Curve pools. To reward these early supporters, a vesting contract was deployed that distributes CRV tokens to eligible addresses. The vesting period has fully ended, meaning all allocated tokens are now immediately claimable.

:::info
The vesting contract still holds over **11 million CRV** in unclaimed tokens. If you provided liquidity to Curve pools before CRV launched (August 2020), you may have tokens waiting for you.
:::

**Contract address:** [`0x575CCD8e2D300e2377B43478339E364000318E2c`](https://etherscan.io/address/0x575CCD8e2D300e2377B43478339E364000318E2c)

---

## Step 1: Check Your Eligibility

First, check if your address has any CRV to claim.

1. Go to the [contract on Etherscan](https://etherscan.io/address/0x575CCD8e2D300e2377B43478339E364000318E2c#readContract)
2. Find the **`balanceOf`** function (function #4) and enter your wallet address
3. Click **"Query"**

If the result is **`0`**, your address is not eligible or has already claimed. If the result is a non-zero number, you have CRV to claim. The value is in wei (18 decimals), so divide by $10^{18}$ to get the amount in CRV. For example, `1000000000000000000` = 1 CRV.

:::tip
You can also check **`initial_locked`** to see the original amount allocated to your address, and **`total_claimed`** to see how much you've already claimed.
:::

---

## Step 2: Claim Your CRV

Once you've confirmed you have a balance, you can claim your tokens.

1. Go to the [contract's Write tab on Etherscan](https://etherscan.io/address/0x575CCD8e2D300e2377B43478339E364000318E2c#writeContract)
2. Click **"Connect Wallet"** and connect the eligible wallet
3. Find the **`claim`** function (function #6, the one with no inputs)
4. Click **"Write"**
5. Confirm the transaction in your wallet
6. Once the transaction confirms, your CRV tokens will be in your wallet

:::note
Gas fees apply as this is an Ethereum mainnet transaction. Make sure you have enough ETH in your wallet to cover gas costs.
:::

---

## FAQ

### How do I know if I provided liquidity before CRV launched?

CRV launched on **August 13, 2020**. If you deposited into any Curve pool before that date, you may be eligible. The easiest way to check is to simply query `balanceOf` with your address as described in Step 1.

### Is there a deadline to claim?

No. The tokens remain in the contract indefinitely until claimed. There is no expiry.
