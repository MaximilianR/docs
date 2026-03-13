// Brief descriptions shown when clicking on edge labels
export const edgeDescriptions: Record<string, string> = {
  // Governance — developer (technical)
  'crv-vecrv': 'Lock CRV for 1 week to 4 years to gain voting power, earn protocol revenue, and boost LP rewards. Voting power decays linearly toward unlock time. [Learn more](/user/vecrv/how-to-lock)',
  'vecrv-gc': 'veCRV holders vote to direct CRV emissions to pools. Votes persist until changed. [Learn more](/user/dao/gauge-weights#voting-for-gauge-weight)',
  'vecrv-dao': 'Voting.vote(vote_id, supports, executes_if_decided) — Cast a yes/no vote on an active DAO proposal.',
  'gc-gauges': 'GaugeController.gauge_relative_weight(gauge) — Returns the gauge\'s share of total emissions for the current epoch.',
  'yearn-gc': 'veCRV holders and protocols vote to allocate CRV emissions across gauges. Votes are cast per-gauge and persist until changed (10-day cooldown per gauge). [Learn more](/user/dao/gauge-weights#voting-for-gauge-weight)',
  'minter-crv': 'The Minter creates new CRV tokens according to the emission schedule. The emission rate decreases over time following a predetermined curve. [Learn more](/user/crv/overview)',
  'minter-gc': 'The Minter reads gauge weights from the GaugeController to determine how much CRV each gauge should receive for the current epoch.',
  'minter-gauges': 'Minter.mint(gauge_addr) — Mints CRV and transfers it to the gauge contract for LP distribution.',
  // Governance — user (simple)
  'u-crv-vecrv': 'Lock CRV for 1 week to 4 years to gain voting power, earn protocol revenue, and boost LP rewards up to 2.5x. [Learn more](https://docs.curve.finance/user/vecrv/how-to-lock)',
  'u-vecrv-gc': 'veCRV holders vote weekly to direct CRV emissions to pools and lending markets. Each gauge\'s weight determines its share of new CRV. [Learn more](/user/dao/gauge-weights#voting-for-gauge-weight)',
  'u-vecrv-dao': 'veCRV holders vote on governance proposals that affect protocol parameters, add new features, or allocate resources. [Learn more](https://docs.curve.finance/user/dao/proposals#voting-on-proposals)',
  'u-gc-gauges': 'CRV emissions are distributed to gauges based on weekly veCRV votes. Gauges with more votes receive more CRV rewards. [Learn more](https://docs.curve.finance/user/dao/gauge-weights)',
  'gauges-stableswap': 'Pools with gauge weight receive CRV emissions. LPs must stake their LP tokens in the gauge to earn CRV, with a boost up to 2.5x from veCRV. [Learn more](https://docs.curve.finance/user/yield/boosting)',
  'gauges-twocrypto': 'Pools with gauge weight receive CRV emissions. LPs must stake their LP tokens in the gauge to earn CRV, with a boost up to 2.5x from veCRV. [Learn more](https://docs.curve.finance/user/yield/boosting)',
  'gauges-tricrypto': 'Pools with gauge weight receive CRV emissions. LPs must stake their LP tokens in the gauge to earn CRV, with a boost up to 2.5x from veCRV. [Learn more](https://docs.curve.finance/user/yield/boosting)',

  // Fee architecture
  'stableswap-fees': 'Pools charge a small fee on every swap. 50% goes to LPs automatically, the other 50% (admin fee) is collected for the DAO. [Learn more](https://docs.curve.finance/user/dex/understanding-rewards)',
  'twocrypto-fees': 'Pools charge a small fee on every swap. 50% goes to LPs automatically, the other 50% (admin fee) is collected for the DAO. [Learn more](https://docs.curve.finance/user/dex/understanding-rewards)',
  'tricrypto-fees': 'Pools charge a small fee on every swap. 50% goes to LPs automatically, the other 50% (admin fee) is collected for the DAO. [Learn more](https://docs.curve.finance/user/dex/understanding-rewards)',
  'fc-burner': 'Collected fee tokens are converted to crvUSD via CowSwap for MEV-protected swaps, ensuring fair pricing.',
  'burner-dist': 'Converted crvUSD is forwarded to the FeeDistributor, which prepares weekly distributions for veCRV holders.',
  'dist-vecrv': 'veCRV holders claim weekly protocol revenue in crvUSD, proportional to their veCRV balance at distribution time. [Learn more](https://docs.curve.finance/user/vecrv/revenue)',
  'fc-treasury': '10% of all collected DAO revenue funds development, audits, bug bounties, and other initiatives voted on by the DAO. [Learn more](https://docs.curve.finance/user/dao/community-fund-treasury)',

  // crvUSD / Stablecoin
  'mint-markets-splitter': 'Interest paid by crvUSD borrowers is collected and sent to the FeeSplitter for allocation.',
  'splitter-rh': 'A dynamic portion (~80%) of crvUSD interest goes to the RewardsHandler to generate yield for scrvUSD holders.',
  'splitter-fc': 'The remaining portion (~20%) of crvUSD interest goes to the FeeCollector for distribution to veCRV holders.',
  'rh-scrvusd': 'The RewardsHandler distributes crvUSD yield to the scrvUSD vault, increasing the value of scrvUSD over time.',
  'mint-markets-crvusd': 'Borrowers deposit collateral (ETH, WBTC, wstETH) to mint crvUSD stablecoins.',
  'mint-markets-llamma': 'LLAMMA provides soft-liquidation for crvUSD loans, gradually converting collateral instead of instant liquidation.',
  'crvusd-scrvusd': 'Deposit crvUSD into the savings vault to receive scrvUSD, which automatically earns yield from borrowing interest. [Learn more](https://docs.curve.finance/user/yield/scrvusd)',
  'policy-mint-markets': 'Monetary Policy algorithmically adjusts borrow rates based on crvUSD peg and market utilization.',
  'agg-pegkeepers': 'The PriceAggregator feeds crvUSD price data to PegKeepers for automated peg stabilization.',
  'pegkeepers-pools': 'PegKeepers mint or burn crvUSD into Curve pools to stabilize the peg when price deviates from $1.',

  // Lending
  'llamalend-vaults': 'Lenders deposit assets into ERC-4626 vaults to earn interest from borrowers in Llamalend markets.',
  'llamalend-llamma': 'Llamalend uses LLAMMA for soft-liquidation, gradually converting borrower collateral to protect against losses.',

  // Factories
  'sf-stableswap': 'Anyone can deploy new Stableswap pools for similarly-priced assets through the permissionless factory.',
  'tf-twocrypto': 'Anyone can deploy new two-token volatile asset pools through the permissionless factory.',
  'trf-tricrypto': 'Anyone can deploy new three-token volatile asset pools through the permissionless factory.',
  'lf-llamalend': 'Anyone can create new lending markets for any asset pair through the permissionless factory.',
  'mmf-mint-markets': 'New crvUSD mint markets are deployed via the factory, subject to DAO governance approval.',

  // External
  'convex-vecrv': 'Convex locks CRV permanently on behalf of depositors, offering liquid cvxCRV in return plus boosted yield.',
  'yearn-vecrv': 'Yearn locks CRV to boost yields for its vault strategies, auto-compounding rewards for depositors.',
  'stakedao-vecrv': 'StakeDAO locks CRV and offers liquid sdCRV, allowing governance participation without the 4-year lock.',

  // User-only AMM flows
  'u-lp-pools': 'Deposit token pairs into Curve pools to earn trading fees and CRV gauge rewards. Receive LP tokens representing your share.',
  'u-pools-lp': 'LPs automatically earn 50% of all swap fees, proportional to their share of pool liquidity. Fees accrue directly in the pool. [Learn more](https://docs.curve.finance/user/yield/lp)',
  'u-pools-lp-ss': 'LPs automatically earn 50% of all swap fees, proportional to their share of pool liquidity. Fees accrue directly in the pool. [Learn more](https://docs.curve.finance/user/yield/lp)',
  'u-pools-lp-tc': 'LPs automatically earn 50% of all swap fees, proportional to their share of pool liquidity. Fees accrue directly in the pool. [Learn more](https://docs.curve.finance/user/yield/lp)',
  'u-traders-router': 'Traders submit swaps to the Router, which finds the optimal route across all Curve pools for best pricing. [Learn more](https://docs.curve.finance/user/dex/swap)',
  'u-suppliers-llamalend': 'Lenders deposit assets into Llamalend markets to earn interest. Each market is an ERC-4626 vault. [Learn more](https://docs.curve.finance/user/llamalend/supplying)',
  'u-llamalend-borrowers': 'Borrowers deposit collateral to borrow assets. Loans use LLAMMA for soft-liquidation protection instead of instant liquidation. [Learn more](https://docs.curve.finance/user/llamalend/borrowing)',
  'u-borrowers-suppliers': 'Borrowers pay interest to suppliers. Rates adjust dynamically based on market utilization. [Learn more](https://docs.curve.finance/user/yield/lending)',

  // Router / DAO
  'dao-emergency': 'The Emergency DAO is a multisig that can pause contracts and kill gauges in case of critical vulnerabilities. [Learn more](https://docs.curve.finance/user/dao/emergency-dao)',
}

// Pattern-based descriptions for dynamic edges
const dynamicPatterns: [RegExp, string][] = [
  [/^dyn-mint-mint$/, 'Borrowers deposit collateral (WETH, WBTC, wstETH, etc.) to mint crvUSD. Loans use LLAMMA for soft-liquidation protection.'],
  [/^dyn-mint-interest$/, 'Interest paid by borrowers flows to the FeeSplitter, which allocates it between scrvUSD yield and veCRV revenue.'],
  [/^dyn-pk-stabilize$/, 'PegKeepers mint or burn crvUSD into Curve pools (USDT, USDC, pyUSD, frxUSD) to keep the price close to $1.'],
  [/^dyn-em-bridge-/, 'CRV emissions are bridged from the proxy gauge on Ethereum to the L2 chain using the native bridge, which takes ~7 days. This means L2 gauge rewards are delayed by one week compared to Ethereum gauges. [Learn more](/user/dao/gauge-weights#gauge-weights-on-l2s)'],
]

export function getEdgeDescription(edgeId: string): string | undefined {
  const exact = edgeDescriptions[edgeId]
  if (exact) return exact
  for (const [pattern, desc] of dynamicPatterns) {
    if (pattern.test(edgeId)) return desc
  }
  return undefined
}
