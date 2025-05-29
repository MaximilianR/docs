# How to Borrow & Use Leverage

This guide explains how to borrow assets and use leverage in Curve Lending markets.

## Basic Borrowing

1. **Supply Collateral**
   - Navigate to the lending market
   - Select the asset you want to supply as collateral
   - Enter the amount and approve the transaction

2. **Borrow Assets**
   - After supplying collateral, you can borrow other assets
   - The amount you can borrow depends on your collateral's value and the market's LTV ratio
   - Enter the amount you want to borrow and approve the transaction

## Using Leverage

### Manual Leverage Looping
1. Supply initial collateral (e.g., WETH)
2. Borrow crvUSD against your collateral
3. Swap the borrowed crvUSD back to WETH
4. Use the new WETH as additional collateral
5. Repeat the process to achieve desired leverage

### Built-in Leverage
Some markets support built-in leverage:
1. Select the market that supports built-in leverage
2. Choose your leverage multiplier
3. The protocol will automatically handle the borrowing and swapping process

## Risk Management

- Monitor your position's health factor
- Keep sufficient collateral to avoid liquidation
- Be aware that leverage multiplies both profits and losses
- Consider using stop-loss strategies for leveraged positions

## Example: 2x Leverage on WETH

1. Supply 1 WETH (worth 3,000 crvUSD)
2. Borrow 1,500 crvUSD (50% LTV)
3. Swap 1,500 crvUSD to 0.5 WETH
4. Supply the additional 0.5 WETH
5. Total position: 1.5 WETH with 1,500 crvUSD debt

This creates a 2x leveraged position on WETH.

For more information about leverage, see our [leverage guide](../lending/leverage.md). 