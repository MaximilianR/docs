import type { Node, Edge } from '@xyflow/react'

export type Category = 'amm' | 'lending' | 'stablecoin' | 'savings' | 'governance' | 'gauge' | 'fees' | 'token' | 'external'

export interface ProtocolNodeData {
  label: string
  category: Category
  description: string
  address?: string
  docPath?: string
  icon?: string
  liveDataKey?: string
  [key: string]: unknown
}

// ── Nodes ──────────────────────────────────────────────────────────────

export const initialNodes: Node<ProtocolNodeData>[] = [
  // ── Tokens (center) ───
  {
    id: 'crv',
    type: 'tokenNode',
    position: { x: 500, y: -150 },
    data: {
      label: 'CRV',
      category: 'token',
      description: 'Curve DAO governance token. Used for staking, voting, and boosting rewards.',
      address: '0xD533a97B49629800559223b95449FD8E1E04e162',
      docPath: '/developer/curve-dao/crv-token',
      icon: 'crv',
      liveDataKey: 'crvSupply',
    },
  },
  {
    id: 'crvusd-token',
    type: 'tokenNode',
    position: { x: 0, y: -150 },
    data: {
      label: 'crvUSD',
      category: 'token',
      description: 'Curve\'s native stablecoin, minted by depositing collateral into LLAMMA markets.',
      address: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
      docPath: '/developer/crvusd/overview',
      icon: 'crvusd',
      liveDataKey: 'crvusdSupply',
    },
  },
  {
    id: 'vecrv',
    type: 'tokenNode',
    position: { x: 500, y: 50 },
    data: {
      label: 'veCRV',
      category: 'token',
      description: 'Vote-escrowed CRV. Lock CRV for up to 4 years to get voting power and fee revenue.',
      address: '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2',
      docPath: '/user/curve-tokens/vecrv',
      icon: 'vecrv',
      liveDataKey: 'vecrvSupply',
    },
  },
  {
    id: 'scrvusd',
    type: 'tokenNode',
    position: { x: 0, y: 50 },
    data: {
      label: 'scrvUSD',
      category: 'token',
      description: 'Savings crvUSD — an ERC-4626 vault that earns yield from crvUSD markets.',
      address: '0x0655977FEb2f289A4aB78af67BAB0d17aAb84367',
      docPath: '/user/curve-tokens/scrvusd',
      icon: 'scrvusd',
      liveDataKey: 'scrvusdAssets',
    },
  },

  // ── AMM (left) ───
  {
    id: 'stableswap',
    type: 'systemNode',
    position: { x: -350, y: -150 },
    data: {
      label: 'Stableswap-NG Pools',
      category: 'amm',
      description: 'AMM optimized for similarly-priced assets (stablecoins, LSTs). Low slippage swaps.',
      docPath: '/developer/amm/stableswap-ng/overview',
      icon: 'stableswap',
      liveDataKey: 'stableswapCount',
    },
  },
  {
    id: 'twocrypto',
    type: 'systemNode',
    position: { x: -350, y: 0 },
    data: {
      label: 'Twocrypto-NG Pools',
      category: 'amm',
      description: 'AMM for volatile asset pairs using the Cryptoswap invariant with auto-rebalancing.',
      docPath: '/developer/amm/twocrypto-ng/overview',
      icon: 'cryptoswap',
      liveDataKey: 'twocryptoCount',
    },
  },
  {
    id: 'tricrypto',
    type: 'systemNode',
    position: { x: -350, y: 150 },
    data: {
      label: 'Tricrypto-NG Pools',
      category: 'amm',
      description: 'Three-asset volatile pools (e.g., USDT/WBTC/WETH). Core liquidity for DeFi.',
      docPath: '/developer/amm/tricrypto-ng/overview',
      icon: 'tricrypto',
    },
  },
  {
    id: 'router',
    type: 'contractNode',
    position: { x: -580, y: 300 },
    data: {
      label: 'Router',
      category: 'amm',
      description: 'Finds optimal swap routes across all Curve pools. Used by aggregators.',
      address: '0xF0d4c12A5768D806021F80a262B4d39d26C58b8D',
      docPath: '/developer/amm/router/curve-router-ng',
      icon: 'router',
    },
  },

  // ── Factories (dev only, left of pools) ───
  {
    id: 'stableswap-factory',
    type: 'contractNode',
    position: { x: -580, y: -150 },
    data: {
      label: 'Stableswap Factory',
      category: 'amm',
      description: 'Permissionless factory for deploying new Stableswap-NG pools.',
      address: '0x6A8cbed756804B16E05E741eDaBd5cB544AE21bf',
      docPath: '/developer/amm/factory/stableswap-ng/overview',
      icon: 'factory',
    },
  },
  {
    id: 'twocrypto-factory',
    type: 'contractNode',
    position: { x: -580, y: 0 },
    data: {
      label: 'Twocrypto Factory',
      category: 'amm',
      description: 'Permissionless factory for deploying new Twocrypto-NG pools.',
      address: '0x98EE851a00abeE0d95D08cF4CA2BdCE32aeaAF7F',
      docPath: '/developer/amm/factory/twocrypto-ng/overview',
      icon: 'factory',
    },
  },
  {
    id: 'tricrypto-factory',
    type: 'contractNode',
    position: { x: -580, y: 150 },
    data: {
      label: 'Tricrypto Factory',
      category: 'amm',
      description: 'Permissionless factory for deploying new Tricrypto-NG pools.',
      address: '0x0c0e5f2fF0ff18a3be9b835635039256dC4B4963',
      docPath: '/developer/amm/factory/tricrypto-ng/overview',
      icon: 'factory',
    },
  },

  // ── Stablecoin (top center) ───
  {
    id: 'mint-market-factory',
    type: 'contractNode',
    position: { x: 0, y: -500 },
    data: {
      label: 'Mint Market Factory',
      category: 'stablecoin',
      description: 'Factory for deploying crvUSD mint markets. These markets mint crvUSD against collateral and generate interest revenue for veCRV holders.',
      address: '0xC9332fdCB1C491Dcc683bAe86Fe3cb70360738BC',
      docPath: '/developer/crvusd/factory',
      icon: 'factory',
    },
  },
  {
    id: 'crvusd-mint-markets',
    type: 'systemNode',
    position: { x: 0, y: -350 },
    data: {
      label: 'crvUSD Mint Markets',
      category: 'stablecoin',
      description: 'Markets that mint crvUSD against collateral (e.g., WETH, WBTC, wstETH). Interest from these markets flows to veCRV holders via the fee system.',
      docPath: '/developer/crvusd/overview',
      icon: 'controller',
    },
  },
  {
    id: 'llamma',
    type: 'systemNode',
    position: { x: -200, y: -350 },
    data: {
      label: 'LLAMMA',
      category: 'stablecoin',
      description: 'Lending-Liquidating AMM. Provides soft-liquidation instead of hard liquidation for crvUSD loans.',
      docPath: '/developer/crvusd/amm',
      icon: 'llamma',
    },
  },
  {
    id: 'pegkeepers',
    type: 'systemNode',
    position: { x: 250, y: -350 },
    data: {
      label: 'PegKeepers',
      category: 'stablecoin',
      description: 'Stabilize crvUSD peg by minting/burning into Curve pools. Automated arbitrage.',
      docPath: '/developer/crvusd/pegkeepers/overview',
      icon: 'pegkeeper',
    },
  },
  {
    id: 'monetary-policy',
    type: 'contractNode',
    position: { x: -200, y: -500 },
    data: {
      label: 'Monetary Policy',
      category: 'stablecoin',
      description: 'Algorithmically adjusts crvUSD borrow rates based on peg and utilization.',
      address: '0xc684432FD6322c6D58b6bC5d28B18569aA0AD0A1',
      docPath: '/developer/crvusd/monetary-policy/overview',
      icon: 'policy',
      liveDataKey: 'monetaryRate',
    },
  },
  {
    id: 'price-aggregator',
    type: 'contractNode',
    position: { x: 250, y: -500 },
    data: {
      label: 'PriceAggregator',
      category: 'stablecoin',
      description: 'Aggregates crvUSD price from multiple pool oracles for peg stability.',
      address: '0xe5Afcf332a5457E8FafCD668BcE3dF953762Dfe7',
      docPath: '/developer/crvusd/oracles/price-aggregator',
      icon: 'oracle',
    },
  },

  // ── Lending (upper left) ───
  {
    id: 'llamalend-factory',
    type: 'contractNode',
    position: { x: -580, y: -350 },
    data: {
      label: 'Llamalend Factory',
      category: 'lending',
      description: 'Permissionless factory for deploying Llamalend lending markets. Anyone can create markets for any asset pair.',
      address: '0xeA6876DDE9e3467564acBeE1Ed5bac88783205E0',
      docPath: '/developer/lending/contracts/oneway-factory',
      icon: 'factory',
    },
  },
  {
    id: 'llamalend',
    type: 'systemNode',
    position: { x: -400, y: -350 },
    data: {
      label: 'Llamalend Markets',
      category: 'lending',
      description: 'Permissionless lending markets using LLAMMA for soft-liquidation. Any asset pair. Interest stays with lenders — does not flow to veCRV holders.',
      docPath: '/developer/lending/overview',
      icon: 'llamalend',
    },
  },
  {
    id: 'lending-vaults',
    type: 'systemNode',
    position: { x: -450, y: -200 },
    data: {
      label: 'Lending Vaults',
      category: 'lending',
      description: 'ERC-4626 vaults where lenders deposit assets to earn interest from borrowers.',
      docPath: '/developer/lending/contracts/vault',
      icon: 'vault',
    },
  },

  // ── Savings ───
  {
    id: 'rewards-handler',
    type: 'contractNode',
    position: { x: 0, y: 250 },
    data: {
      label: 'RewardsHandler',
      category: 'savings',
      description: 'Receives crvUSD fees from the FeeSplitter and streams them as yield to the scrvUSD vault. Anyone can call process_rewards() to trigger a distribution.',
      address: '0xE8d1E2531761406Af1615A6764B0d5fF52736F56',
      docPath: '/developer/scrvusd/rewards-handler',
      icon: 'rewards',
    },
  },

  // ── Governance (right) ───
  {
    id: 'gauge-controller',
    type: 'contractNode',
    position: { x: 750, y: 50 },
    data: {
      label: 'GaugeController',
      category: 'governance',
      description: 'Manages gauge weights for CRV emission distribution. veCRV holders and protocols (Convex, StakeDAO, Yearn) vote to allocate emissions across gauges. A snapshot of weights is taken every Thursday at 00:00 UTC, locking the distribution for that epoch. CRV emissions are then streamed to gauges proportionally over the following week.',
      address: '0x2F50D538606Fa9Edd2B11E2446BEb18C9D5846bB',
      docPath: '/developer/gauges/gauge-controller',
      icon: 'gauge',
      liveDataKey: 'nGauges',
    },
  },
  {
    id: 'minter',
    type: 'contractNode',
    position: { x: 750, y: -150 },
    data: {
      label: 'Minter',
      category: 'governance',
      description: 'Mints CRV tokens for liquidity gauges according to the emission schedule.',
      address: '0xd061D61a4d941c39E5453435B6345Dc261C2fcE0',
      docPath: '/developer/gauges/minter',
      icon: 'minter',
      liveDataKey: 'minterRate',
    },
  },
  {
    id: 'gauges',
    type: 'systemNode',
    position: { x: 250, y: 150 },
    data: {
      label: 'Liquidity Gauges',
      category: 'governance',
      description: 'Distribute CRV rewards to LPs. Weight determined by GaugeController votes.',
      docPath: '/developer/gauges/gauges/overview',
      icon: 'gauge',
    },
  },
  {
    id: 'dao-voting',
    type: 'systemNode',
    position: { x: 750, y: 200 },
    data: {
      label: 'DAO Voting',
      category: 'governance',
      description: 'On-chain governance. veCRV holders vote on protocol changes and parameter updates.',
      address: '0xE478de485ad2fe566d49342Cbd03E49ed7DB3356',
      docPath: '/developer/curve-dao/governance/overview',
      icon: 'dao',
    },
  },
  {
    id: 'emergency-dao',
    type: 'contractNode',
    position: { x: 950, y: 300 },
    data: {
      label: 'Emergency DAO',
      category: 'governance',
      description: 'Multisig that can kill gauges and pause contracts in emergencies.',
      address: '0x467947EE34aF926cF1DCac093870f613C96B1E0c',
      docPath: '/user/dao/emergency-dao',
      icon: 'emergency',
    },
  },

  // ── Emissions simulation ───
  {
    id: 'vlcvx-holders',
    type: 'tokenNode',
    position: { x: -800, y: -200 },
    data: {
      label: 'vlCVX Holders',
      category: 'governance',
      description: 'Holders of vote-locked CVX (vlCVX). They vote on which gauges Convex should allocate its veCRV voting power to. Convex then executes these votes on-chain as a proxy.',
      liveDataKey: 'vlcvxHolders',
    },
  },
  {
    id: 'sdcrv-holders',
    type: 'tokenNode',
    position: { x: -800, y: -60 },
    data: {
      label: 'sdCRV Holders',
      category: 'governance',
      description: 'Holders of sdCRV (StakeDAO liquid-locked CRV). They vote on which gauges StakeDAO should allocate its veCRV voting power to. StakeDAO then executes these votes on-chain as a proxy.',
    },
  },
  {
    id: 'voter-convex',
    type: 'tokenNode',
    position: { x: -500, y: -200 },
    data: {
      label: 'Convex',
      category: 'external',
      description: 'Largest veCRV holder. Acts as a proxy — vlCVX holders vote on gauge weights, and Convex executes those votes on-chain using its veCRV position.',
      icon: 'convex',
      liveDataKey: 'lockerConvex',
    },
  },
  {
    id: 'voter-stakedao',
    type: 'tokenNode',
    position: { x: -500, y: -60 },
    data: {
      label: 'StakeDAO',
      category: 'external',
      description: 'Liquid locker protocol. Acts as a proxy — sdCRV holders vote on gauge weights, and StakeDAO executes those votes on-chain using its veCRV position.',
      icon: 'stakedao',
      liveDataKey: 'lockerStakedao',
    },
  },
  {
    id: 'voter-yearn',
    type: 'tokenNode',
    position: { x: -500, y: 80 },
    data: {
      label: 'Yearn',
      category: 'external',
      description: 'DeFi yield aggregator. Holds veCRV and directs gauge votes via a multisig to optimize vault yields.',
      icon: 'yearn',
      liveDataKey: 'lockerYearn',
    },
  },
  {
    id: 'voter-user1',
    type: 'tokenNode',
    position: { x: -500, y: 220 },
    data: {
      label: 'Alice',
      category: 'governance',
      description: 'Individual veCRV holder voting on gauge weights. Can change vote per gauge once every 10 days.',
    },
  },
  {
    id: 'voter-user2',
    type: 'tokenNode',
    position: { x: -500, y: 360 },
    data: {
      label: 'Bob',
      category: 'governance',
      description: 'Individual veCRV holder voting on gauge weights. Can change vote per gauge once every 10 days.',
    },
  },
  {
    id: 'gauge-chart',
    type: 'gaugeChartNode',
    position: { x: 400, y: 0 },
    data: {
      label: 'Gauge Weights',
      category: 'governance',
      description: 'Current gauge weight distribution. Weights determine each gauge\'s share of CRV emissions. Updated every Thursday at 00:00 UTC via snapshot.',
    },
  },

  // ── Epoch Clock ───
  {
    id: 'epoch-clock',
    type: 'epochNode',
    position: { x: 0, y: 0 },
    data: {
      label: 'Weekly Epoch',
      category: 'governance',
      description: 'CRV emissions follow a weekly cycle. veCRV holders vote on gauge weights continuously. Every Thursday at 00:00 UTC, weights are finalized and CRV emissions for the next week are distributed accordingly.',
    },
  },

  // ── Fees (bottom center) ───
  {
    id: 'fee-collector',
    type: 'contractNode',
    position: { x: -150, y: 400 },
    data: {
      label: 'FeeCollector',
      category: 'fees',
      description: 'Entry point for fee burning. Collects admin fees from pools via withdraw_many(), burns them to crvUSD via CowSwapBurner, then forwards to FeeDistributor via Hooker. Operates in weekly epochs: SLEEP (4d) → COLLECT (1d) → EXCHANGE (1d) → FORWARD (1d).',
      address: '0xa2Bcd1a4Efbd04B63cd03f5aFf2561106ebCCE00',
      docPath: '/developer/fees/fee-collector',
      icon: 'fees',
    },
  },
  {
    id: 'cowswap-burner',
    type: 'contractNode',
    position: { x: 50, y: 500 },
    data: {
      label: 'CowSwap Burner',
      category: 'fees',
      description: 'Burns collected admin fees into crvUSD using CowSwap conditional orders. Called by FeeCollector during the COLLECT epoch.',
      address: '0xC0fC3dDfec95ca45A0D2393F518D3EA1ccF44f8b',
      docPath: '/developer/fees/cow-swap-burner',
      icon: 'cowswap',
    },
  },
  {
    id: 'fee-allocator',
    type: 'contractNode',
    position: { x: 250, y: 500 },
    data: {
      label: 'FeeAllocator',
      category: 'fees',
      description: 'Allocates crvUSD fees between receivers by weight. Currently sends 10% to DAO Treasury and 90% to FeeDistributor (for veCRV holders). Max 50% can go to non-distributor receivers.',
      address: '0x22530d384cd9915e096ead2db7f82ee81f8eb468',
      icon: 'fees',
    },
  },
  {
    id: 'fee-splitter',
    type: 'contractNode',
    position: { x: 200, y: 350 },
    data: {
      label: 'FeeSplitter',
      category: 'fees',
      description: 'Collects crvUSD interest from mint market Controllers via dispatch_fees() and splits it between receivers by weight.',
      address: '0x2dFd89449faff8a532790667baB21cF733C064f2',
      docPath: '/developer/fees/fee-splitter',
      icon: 'splitter',
    },
  },
  {
    id: 'fee-distributor',
    type: 'contractNode',
    position: { x: 400, y: 400 },
    data: {
      label: 'FeeDistributor',
      category: 'fees',
      description: 'Distributes crvUSD to veCRV holders proportional to their lock weight. Claims happen on Ethereum mainnet only.',
      address: '0xD16d5eC345Dd86Fb63C6a9C43c517210F1027914',
      docPath: '/developer/fees/fee-distributor',
      icon: 'distributor',
    },
  },

  // ── Treasury ───
  {
    id: 'treasury',
    type: 'contractNode',
    position: { x: -350, y: 500 },
    data: {
      label: 'DAO Treasury',
      category: 'fees',
      description: 'DAO-controlled treasury receiving 10% of protocol revenue. Funds can be used for development, audits, bug bounties, bad debt insurance, or any purpose the DAO votes on.',
      address: '0x6508ef65b0bd57eabd0f1d52685a70433b2d290b',
      docPath: '/user/dao/community-fund-treasury#treasury',
      icon: 'treasury',
      liveDataKey: 'treasuryBalance',
    },
  },

  // ── External (far right) ───
  {
    id: 'convex',
    type: 'externalNode',
    position: { x: 950, y: -100 },
    data: {
      label: 'Convex Finance',
      category: 'external',
      description: 'Largest veCRV holder. Boosts LP rewards and offers liquid CRV staking (cvxCRV).',
      icon: 'convex',
    },
  },
  {
    id: 'yearn',
    type: 'externalNode',
    position: { x: 950, y: 50 },
    data: {
      label: 'Yearn Finance',
      category: 'external',
      description: 'Yield aggregator that auto-compounds Curve LP positions for optimal returns.',
      icon: 'yearn',
    },
  },
  {
    id: 'stakedao',
    type: 'externalNode',
    position: { x: 950, y: 200 },
    data: {
      label: 'StakeDAO',
      category: 'external',
      description: 'Yield optimizer and liquid locker for CRV with governance participation.',
      icon: 'stakedao',
    },
  },
]

// ── Edges ──────────────────────────────────────────────────────────────

export const initialEdges: Edge[] = [
  // CRV → veCRV (lock) — straight down
  { id: 'crv-vecrv', source: 'crv', target: 'vecrv', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'dataFlow', label: 'Lock CRV', animated: true },

  // Minter → CRV (emissions) — left
  { id: 'minter-crv', source: 'minter', target: 'crv', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'emissionFlow', label: 'Mint CRV' },

  // Holders → Vote Proxies
  { id: 'vlcvx-convex', source: 'vlcvx-holders', target: 'voter-convex', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow', animated: true, label: 'Gauge Votes' },
  { id: 'sdcrv-stakedao', source: 'sdcrv-holders', target: 'voter-stakedao', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow', animated: true, label: 'Gauge Votes' },
  // Vote Proxies → GaugeController
  { id: 'convex-gc', source: 'voter-convex', target: 'gauge-controller', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow', animated: true },
  { id: 'stakedao-gc', source: 'voter-stakedao', target: 'gauge-controller', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow', animated: true },
  { id: 'yearn-gc', source: 'voter-yearn', target: 'gauge-controller', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow', animated: true, label: 'Vote (Multisig)', zIndex: 10 },
  { id: 'user1-gc', source: 'voter-user1', target: 'gauge-controller', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow', animated: true },
  { id: 'user2-gc', source: 'voter-user2', target: 'gauge-controller', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow', animated: true },

  // GaugeController → Gauge Chart (weights)
  { id: 'gc-chart', source: 'gauge-controller', target: 'gauge-chart', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'emissionFlow', label: 'CRV Emissions', animated: true },

  // Minter → GaugeController (reads weights)
  { id: 'minter-gc', source: 'gauge-controller', target: 'minter', sourceHandle: 'top-source', targetHandle: 'bottom-target', type: 'dataFlow', label: 'Read Weights' },

  // GaugeController → Gauges (weights) — left-down
  { id: 'gc-gauges', source: 'gauge-controller', target: 'gauges', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'governanceFlow', label: 'Emission Weights' },

  // Minter → Gauges (CRV) — left-down
  { id: 'minter-gauges', source: 'minter', target: 'gauges', sourceHandle: 'left-source', targetHandle: 'top-target', type: 'emissionFlow', label: 'CRV Emissions' },

  // Gauges → Pools — left
  { id: 'gauges-stableswap', source: 'gauges', target: 'stableswap', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'emissionFlow', label: 'CRV Rewards' },
  { id: 'gauges-twocrypto', source: 'gauges', target: 'twocrypto', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'emissionFlow' },
  { id: 'gauges-tricrypto', source: 'gauges', target: 'tricrypto', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'emissionFlow' },

  // veCRV → GaugeController (voting) — right
  { id: 'vecrv-gc', source: 'vecrv', target: 'gauge-controller', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow', label: 'Gauge Weight Voting' },

  // veCRV → DAO — right-down
  { id: 'vecrv-dao', source: 'vecrv', target: 'dao-voting', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'votingFlow', label: 'Vote on Proposals' },

  // DAO → Emergency DAO — right-down
  { id: 'dao-emergency', source: 'dao-voting', target: 'emergency-dao', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'governanceFlow' },

  // External → veCRV — left
  { id: 'convex-vecrv', source: 'convex', target: 'vecrv', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'dataFlow', label: 'Lock CRV' },
  { id: 'yearn-vecrv', source: 'yearn', target: 'vecrv', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'dataFlow' },
  { id: 'stakedao-vecrv', source: 'stakedao', target: 'vecrv', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'dataFlow' },

  // Factory → Pools (deploy) — right
  { id: 'sf-stableswap', source: 'stableswap-factory', target: 'stableswap', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow', label: 'Deploy' },
  { id: 'tf-twocrypto', source: 'twocrypto-factory', target: 'twocrypto', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow', label: 'Deploy' },
  { id: 'trf-tricrypto', source: 'tricrypto-factory', target: 'tricrypto', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow', label: 'Deploy' },

  // Pool fees → FeeCollector — right to left
  { id: 'stableswap-fees', source: 'stableswap', target: 'fee-collector', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'feeFlow', label: '50% Admin Fee' },
  { id: 'twocrypto-fees', source: 'twocrypto', target: 'fee-collector', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'feeFlow' },
  { id: 'tricrypto-fees', source: 'tricrypto', target: 'fee-collector', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'feeFlow' },

  // AMM fee flow: FeeCollector → CowSwapBurner → FeeCollector → FeeAllocator → FeeDistributor → veCRV
  { id: 'fc-burner', source: 'fee-collector', target: 'cowswap-burner', sourceHandle: 'right-source', targetHandle: 'top-target', type: 'feeFlow', label: 'Swap to crvUSD', animated: true },
  { id: 'burner-fc', source: 'cowswap-burner', target: 'fee-collector', sourceHandle: 'bottom-source', targetHandle: 'right-target', type: 'feeFlow', animated: true },
  { id: 'fc-allocator', source: 'fee-collector', target: 'fee-allocator', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'feeFlow', label: 'Allocate' },
  { id: 'allocator-treasury', source: 'fee-allocator', target: 'treasury', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'feeFlow', label: '10% Treasury' },
  { id: 'allocator-dist', source: 'fee-allocator', target: 'fee-distributor', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'feeFlow', label: '90% to veCRV' },
  { id: 'dist-vecrv', source: 'fee-distributor', target: 'vecrv', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'feeFlow', label: 'Weekly Revenue' },

  // crvUSD mint markets
  { id: 'mmf-mint-markets', source: 'mint-market-factory', target: 'crvusd-mint-markets', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'dataFlow', label: 'Deploy' },
  { id: 'mint-markets-crvusd', source: 'crvusd-mint-markets', target: 'crvusd-token', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'dataFlow', label: 'Mint' },
  { id: 'mint-markets-llamma', source: 'crvusd-mint-markets', target: 'llamma', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'dataFlow', label: 'Manage' },
  { id: 'policy-mint-markets', source: 'monetary-policy', target: 'crvusd-mint-markets', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'oracleFlow', label: 'Rates' },

  // Mint market fee flow: FeeSplitter → RewardsHandler / FeeCollector
  { id: 'mint-markets-splitter', source: 'crvusd-mint-markets', target: 'fee-splitter', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'feeFlow', label: 'Borrow Interest' },
  { id: 'splitter-rh', source: 'fee-splitter', target: 'rewards-handler', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'feeFlow', label: '80%' },
  { id: 'splitter-fc', source: 'fee-splitter', target: 'fee-collector', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'feeFlow', label: '20%' },
  { id: 'rh-scrvusd', source: 'rewards-handler', target: 'scrvusd', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'feeFlow', label: 'Savings Yield' },
  { id: 'agg-pegkeepers', source: 'price-aggregator', target: 'pegkeepers', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'oracleFlow', label: 'Price' },
  { id: 'pegkeepers-pools', source: 'pegkeepers', target: 'stableswap', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'dataFlow', label: 'Stabilize' },

  // Llamalend
  { id: 'lf-llamalend', source: 'llamalend-factory', target: 'llamalend', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow', label: 'Deploy' },
  { id: 'llamalend-llamma', source: 'llamalend', target: 'llamma', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow', label: 'Uses' },
  { id: 'llamalend-vaults', source: 'llamalend', target: 'lending-vaults', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'dataFlow', label: 'Deposits' },

  // Router → pools — right-up
  { id: 'router-stableswap', source: 'router', target: 'stableswap', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow' },
  { id: 'router-twocrypto', source: 'router', target: 'twocrypto', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow' },
  { id: 'router-tricrypto', source: 'router', target: 'tricrypto', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow' },

  // scrvUSD ← crvUSD — down
  { id: 'crvusd-scrvusd', source: 'crvusd-token', target: 'scrvusd', sourceHandle: 'bottom-source', targetHandle: 'top-target', type: 'dataFlow', label: 'Deposit' },

]

// Category metadata
export const categories: Record<Category, { label: string; color: string }> = {
  amm: { label: 'AMM', color: '#3b82f6' },
  lending: { label: 'Lending', color: '#22c55e' },
  stablecoin: { label: 'Stablecoin', color: '#14b8a6' },
  savings: { label: 'Savings', color: '#06b6d4' },
  governance: { label: 'Governance', color: '#8b5cf6' },
  gauge: { label: 'Gauge', color: '#a855f7' },
  fees: { label: 'Fees', color: '#f97316' },
  token: { label: 'Tokens', color: '#eab308' },
  external: { label: 'External', color: '#6b7280' },
}
