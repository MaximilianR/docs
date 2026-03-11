export interface TabConfig {
  id: string
  label: string
  nodeIds: Set<string>
  // Per-tab default positions (overrides graph.ts defaults)
  positions: Record<string, { x: number; y: number }>
}

export const tabs: TabConfig[] = [
  {
    id: 'fees',
    label: 'Fee Architecture',
    nodeIds: new Set([
      'stableswap', 'twocrypto', 'tricrypto',
      'fee-collector', 'cowswap-burner', 'fee-allocator', 'fee-splitter', 'fee-distributor',
      'vecrv', 'crvusd-mint-markets', 'rewards-handler', 'scrvusd',
      'treasury',
    ]),
    positions: {
      // Left column: AMM fee sources
      'stableswap': { x: -400, y: 50 },
      'twocrypto': { x: -400, y: 140 },
      'tricrypto': { x: -400, y: 230 },
      // Top right: crvUSD interest path → scrvUSD
      'crvusd-mint-markets': { x: 100, y: -200 },
      'fee-splitter': { x: 100, y: -50 },
      'rewards-handler': { x: 400, y: -50 },
      'scrvusd': { x: 650, y: -50 },
      // Center: fee collection & burn loop
      'fee-collector': { x: 100, y: 140 },
      'cowswap-burner': { x: 400, y: 140 },
      // Bottom: allocation & distribution
      'fee-allocator': { x: 100, y: 340 },
      'treasury': { x: -150, y: 500 },
      'fee-distributor': { x: 350, y: 500 },
      'vecrv': { x: 600, y: 500 },
    },
  },
  {
    id: 'governance',
    label: 'Governance',
    nodeIds: new Set([
      'crv', 'vecrv', 'gauge-controller', 'minter', 'gauges',
      'dao-voting',
    ]),
    positions: {
      'crv': { x: -188, y: -80 },
      'vecrv': { x: -61, y: 102 },
      'gauge-controller': { x: 272, y: 104 },
      'gauges': { x: 473, y: -38 },
      'minter': { x: 300, y: -100 },
      'dao-voting': { x: -62, y: 324 },
    },
  },
  {
    id: 'stablecoin',
    label: 'Stablecoin (crvUSD)',
    nodeIds: new Set([
      'crvusd-token',
      'scrvusd', 'rewards-handler', 'fee-splitter',
    ]),
    positions: {
      'crvusd-token': { x: 37, y: 166 },
      'fee-splitter': { x: -247, y: 148 },
      'rewards-handler': { x: -123, y: 428 },
      'scrvusd': { x: 200, y: 400 },
      'dyn-mint-markets': { x: 23, y: -42 },
      'dyn-pegkeepers': { x: 315, y: -2 },
    },
  },
  {
    id: 'amm',
    label: 'AMM Pools',
    nodeIds: new Set([
      'stableswap', 'twocrypto', 'tricrypto',
      'router', 'stableswap-factory', 'twocrypto-factory', 'tricrypto-factory',
      'gauges',
    ]),
    positions: {
      'router': { x: -300, y: 400 },
      'stableswap': { x: 0, y: -150 },
      'twocrypto': { x: 0, y: 50 },
      'tricrypto': { x: 0, y: 250 },
      'gauges': { x: 407, y: 50 },
      'stableswap-factory': { x: -300, y: -150 },
      'twocrypto-factory': { x: -300, y: 50 },
      'tricrypto-factory': { x: -300, y: 250 },
    },
  },
  {
    id: 'lending',
    label: 'Llamalend',
    nodeIds: new Set([
      'llamalend', 'llamalend-factory', 'llamma',
    ]),
    positions: {
      'llamalend': { x: 0, y: 50 },
      // Dev-only
      'llamalend-factory': { x: -350, y: 50 },
      'llamma': { x: 300, y: 50 },
    },
  },
  {
    id: 'overview',
    label: 'Overview',
    nodeIds: new Set(), // empty = show all
    positions: {}, // uses graph.ts defaults
  },
]
