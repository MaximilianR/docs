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
      'stableswap': { x: -350, y: 50 },
      'twocrypto': { x: -350, y: 180 },
      'tricrypto': { x: -350, y: 310 },
      // Top: crvUSD interest path → scrvUSD
      'crvusd-mint-markets': { x: 50, y: -280 },
      'fee-splitter': { x: 50, y: -80 },
      'rewards-handler': { x: 450, y: -80 },
      'scrvusd': { x: 800, y: -80 },
      // Center: fee collection & burn loop
      'fee-collector': { x: 50, y: 180 },
      'cowswap-burner': { x: 450, y: 250 },
      // Bottom: allocation & distribution
      'fee-allocator': { x: 50, y: 440 },
      'treasury': { x: -250, y: 640 },
      'fee-distributor': { x: 350, y: 640 },
      'vecrv': { x: 700, y: 640 },
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
