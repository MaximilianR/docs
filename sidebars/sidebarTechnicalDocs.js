// NOTICE: don't use relative links in this file when setting hrefs, as they append to the current URL, which may not be what you expect.
// GOOD: href: '/developers/smart-contracts/V1/interfaces',
// BAD: href: './smart-contracts/V1/interfaces',

export default {
    developers: [
      {
        type: 'category',
        label: 'Curve Finance Technical Docs',
        link: {
          type: 'doc',
          id: 'documentation-overview',
        },
        collapsed: true,
        items: [
          // Documentation Overview
          {
            type: 'doc',
            id: 'documentation-overview',
            label: 'Documentation Overview',
          },
          // CRV Token
          {
            type: 'category',
            label: 'Curve DAO Token',
            link: {
              type: 'doc',
              id: 'curve_dao/crv-token',
            },
            items: [],
          },
          // Vote-Escrowed CRV
          {
            type: 'category',
            label: 'Vote-Escrowed CRV',
            items: [
              {
                type: 'category',
                label: 'VotingEscrow',
                items: [
                  'curve_dao/voting-escrow/voting-escrow',
                  'curve_dao/voting-escrow/admin-controls',
                ],
              },
              'curve_dao/voting-escrow/smartwalletchecker',
            ],
          },
          // Liquidity Gauges and Minting CRV
          {
            type: 'category',
            label: 'Liquidity Gauges and Minting CRV',
            items: [
              'liquidity-gauges-and-minting-crv/overview',
              'liquidity-gauges-and-minting-crv/gauge-controller/GaugeController',
              'liquidity-gauges-and-minting-crv/minter/Minter',
              {
                type: 'category',
                label: 'Gauges',
                items: [
                  'liquidity-gauges-and-minting-crv/gauges/overview',
                  'liquidity-gauges-and-minting-crv/gauges/LiquidityGaugeV6',
                ],
              },
              {
                type: 'category',
                label: 'Gauges for EVM Sidechains',
                items: [
                  'liquidity-gauges-and-minting-crv/xchain-gauges/overview',
                  'liquidity-gauges-and-minting-crv/xchain-gauges/RootGaugeFactory',
                  'liquidity-gauges-and-minting-crv/xchain-gauges/ChildGaugeFactory',
                  'liquidity-gauges-and-minting-crv/xchain-gauges/RootGauge',
                  'liquidity-gauges-and-minting-crv/xchain-gauges/ChildGauge',
                  'liquidity-gauges-and-minting-crv/xchain-gauges/Bridgers',
                ],
              },
            ],
          },
          // Governance and Voting
          {
            type: 'category',
            label: 'Governance and Voting',
            items: [
              'governance/overview',
              'governance/curve-dao',
              {
                type: 'category',
                label: 'L2 Governance (x-gov)',
                items: [
                  'governance/x-gov/overview',
                  'governance/x-gov/broadcaster',
                  'governance/x-gov/relayer',
                  'governance/x-gov/agents',
                  'governance/x-gov/vault',
                ],
              },
            ],
          },
          // Fee Collection & Distribution
          {
            type: 'category',
            label: 'Fee Collection & Distribution',
            items: [
              'fees/overview',
              'fees/FeeSplitter',
              'fees/FeeCollector',
              'fees/CowSwapBurner',
              'fees/Hooker',
              'fees/FeeDistributor',
              {
                type: 'category',
                label: 'Original Architecture',
                items: [
                  'fees/original-architecture/overview',
                  'fees/original-architecture/burner',
                  'fees/original-architecture/distributor',
                  'fees/original-architecture/sidechains',
                  'fees/original-architecture/withdraw-and-burn',
                ],
              },
            ],
          },
          // Registry
          {
            type: 'category',
            label: 'Registry',
            items: [
              'registry/overview',
              'registry/MetaRegistryAPI',
            ],
          },
          // Curve API
          {
            type: 'category',
            label: 'Curve API',
            items: [
              'curve-api/curve-api',
              'curve-api/curve-prices',
            ],
          },
          // Routers
          {
            type: 'category',
            label: 'Routers',
            items: [
              'router/CurveRouterNG',
              'router/CurveRegistryExchange',
            ],
          },
          // crvUSD
          {
            type: 'category',
            label: 'crvUSD',
            items: [
              'crvUSD/overview',
              'crvUSD/crvUSD',
              'crvUSD/controller',
              'crvUSD/amm',
              'crvUSD/monetarypolicy',
              'crvUSD/priceaggregator',
              'crvUSD/oracle',
              'crvUSD/flashlender',
              {
                type: 'category',
                label: 'PegKeepers',
                items: [
                  'crvUSD/pegkeepers/overview',
                  'crvUSD/pegkeepers/PegKeeperV1',
                  'crvUSD/pegkeepers/PegKeeperV2',
                  'crvUSD/pegkeepers/PegKeeperRegulator',
                ],
              },
              {
                type: 'category',
                label: 'Leverage',
                items: [
                  'crvUSD/leverage/overview',
                  'crvUSD/leverage/LeverageZap',
                  'crvUSD/leverage/LeverageZap1inch',
                  'crvUSD/leverage/LlamaLendOdosLeverageZap',
                ],
              },
              {
                type: 'category',
                label: 'Factory',
                items: [
                  'crvUSD/factory/overview',
                  'crvUSD/factory/deployer-api',
                  'crvUSD/factory/admin-controls',
                ],
              },
            ],
          },
          // Savings crvUSD
          {
            type: 'category',
            label: 'Savings crvUSD',
            items: [
              'scrvusd/overview',
              'scrvusd/RewardsHandler',
              'scrvusd/StablecoinLens',
              {
                type: 'category',
                label: 'Crosschain Oracles',
                items: [
                  'scrvusd/crosschain/oracle-v0/oracle',
                  {
                    type: 'category',
                    label: 'Oracle V1/V2',
                    items: [
                      'scrvusd/crosschain/oracle-v2/overview',
                      'scrvusd/crosschain/oracle-v2/oracle',
                      'scrvusd/crosschain/oracle-v2/verifier',
                      'scrvusd/crosschain/oracle-v2/blockhash',
                    ],
                  },
                ],
              },
            ],
          },
          // Curve Lending
          {
            type: 'category',
            label: 'Curve Lending',
            items: [
              'lending/overview',
              'lending/contracts/vault',
              'lending/contracts/controller-llamma',
              'lending/contracts/oneway-factory',
              'lending/contracts/leverage',
              {
                type: 'category',
                label: 'Monetary Policies',
                items: [
                  'lending/contracts/mp-overview',
                  'lending/contracts/semilog-mp',
                  'lending/contracts/secondary-mp',
                ],
              },
              {
                type: 'category',
                label: 'Oracles Contracts',
                items: [
                  'lending/contracts/oracle-overview',
                  'lending/contracts/cryptofrompool',
                  'lending/contracts/cryptofrompoolsrate',
                  'lending/contracts/cryptofrompoolvault',
                ],
              },
            ],
          },
          // StableSwap Exchange
          {
            type: 'category',
            label: 'StableSwap Exchange',
            items: [
              'stableswap-exchange/overview',
              {
                type: 'category',
                label: 'Stableswap',
                items: [
                  {
                    type: 'category',
                    label: 'Pools',
                    items: [
                      'stableswap-exchange/stableswap/pools/overview',
                      'stableswap-exchange/stableswap/pools/plain_pools',
                      'stableswap-exchange/stableswap/pools/lending_pools',
                      'stableswap-exchange/stableswap/pools/metapools',
                      'stableswap-exchange/stableswap/pools/admin_pool_settings',
                    ],
                  },
                  {
                    type: 'category',
                    label: 'Liquidity Pool Tokens',
                    items: [
                      'stableswap-exchange/stableswap/lp_tokens/overview',
                      'stableswap-exchange/stableswap/lp_tokens/curve_token_v1',
                      'stableswap-exchange/stableswap/lp_tokens/curve_token_v2',
                      'stableswap-exchange/stableswap/lp_tokens/curve_token_v3',
                    ],
                  },
                  {
                    type: 'category',
                    label: 'Deposit Contracts',
                    items: [
                      'stableswap-exchange/stableswap/deposit_contracts/overview',
                      'stableswap-exchange/stableswap/deposit_contracts/lending_pool_deposits',
                      'stableswap-exchange/stableswap/deposit_contracts/metapool_deposits',
                    ],
                  },
                ],
              },
              {
                type: 'category',
                label: 'Stableswap-NG',
                items: [
                  'stableswap-exchange/stableswap-ng/overview',
                  {
                    type: 'category',
                    label: 'Pools',
                    items: [
                      'stableswap-exchange/stableswap-ng/pools/overview',
                      'stableswap-exchange/stableswap-ng/pools/plainpool',
                      'stableswap-exchange/stableswap-ng/pools/metapool',
                      'stableswap-exchange/stableswap-ng/pools/oracles',
                      'stableswap-exchange/stableswap-ng/pools/admin_controls',
                    ],
                  },
                  {
                    type: 'category',
                    label: 'Utility Contracts',
                    items: [
                      'stableswap-exchange/stableswap-ng/utility_contracts/math',
                      'stableswap-exchange/stableswap-ng/utility_contracts/views',
                    ],
                  },
                  {
                    type: 'category',
                    label: 'Custom Implementations',
                    items: [
                      'stableswap-exchange/stableswap-ng/implementations/custom1',
                    ],
                  },
                ],
              },
            ],
          },
          // CryptoSwap Exchange
          {
            type: 'category',
            label: 'CryptoSwap Exchange',
            items: [
              'cryptoswap-exchange/overview',
              {
                type: 'category',
                label: 'CryptoSwap',
                items: [
                  {
                    type: 'category',
                    label: 'Pools',
                    items: [
                      'cryptoswap-exchange/cryptoswap/pools/crypto-pool',
                      'cryptoswap-exchange/cryptoswap/pools/admin-controls',
                    ],
                  },
                  {
                    type: 'category',
                    label: 'Liquidity Pool Tokens',
                    items: [
                      'cryptoswap-exchange/cryptoswap/lp_tokens/overview',
                      'cryptoswap-exchange/cryptoswap/lp_tokens/lp-token-V5',
                    ],
                  },
                ],
              },
              {
                type: 'category',
                label: 'TwoCrypto-NG',
                items: [
                  'cryptoswap-exchange/twocrypto-ng/overview',
                  {
                    type: 'category',
                    label: 'Pools',
                    items: [
                      'cryptoswap-exchange/twocrypto-ng/pools/overview',
                      'cryptoswap-exchange/twocrypto-ng/pools/twocrypto',
                      'cryptoswap-exchange/twocrypto-ng/pools/admin-controls',
                    ],
                  },
                  {
                    type: 'category',
                    label: 'Utility Contracts',
                    items: [
                      'cryptoswap-exchange/twocrypto-ng/utility-contracts/math',
                      'cryptoswap-exchange/twocrypto-ng/utility-contracts/views',
                    ],
                  },
                ],
              },
              {
                type: 'category',
                label: 'TriCrypto-NG',
                items: [
                  'cryptoswap-exchange/tricrypto-ng/overview',
                  {
                    type: 'category',
                    label: 'Pools',
                    items: [
                      'cryptoswap-exchange/tricrypto-ng/pools/tricrypto',
                      'cryptoswap-exchange/tricrypto-ng/pools/oracles',
                      'cryptoswap-exchange/tricrypto-ng/pools/admin-controls',
                    ],
                  },
                  {
                    type: 'category',
                    label: 'Utility Contracts',
                    items: [
                      'cryptoswap-exchange/tricrypto-ng/utility-contracts/math',
                      'cryptoswap-exchange/tricrypto-ng/utility-contracts/views',
                    ],
                  },
                ],
              },
            ],
          },
          // Pool Factory
          {
            type: 'category',
            label: 'Pool Factory',
            items: [
              'factory/overview',
              {
                type: 'category',
                label: 'StableSwap-NG',
                items: [
                  'factory/stableswap-ng/overview',
                  'factory/stableswap-ng/deployer-api',
                ],
              },
              {
                type: 'category',
                label: 'TwoCrypto-NG',
                items: [
                  'factory/twocrypto-ng/overview',
                  'factory/twocrypto-ng/deployer-api',
                ],
              },
              {
                type: 'category',
                label: 'TriCrypto-NG',
                items: [
                  'factory/tricrypto-ng/overview',
                  'factory/tricrypto-ng/deployer-api',
                ],
              },
              {
                type: 'category',
                label: 'StableSwap',
                items: [
                  'factory/stableswap/overview',
                  'factory/stableswap/deployer-api',
                  'factory/stableswap/implementations',
                ],
              },
              {
                type: 'category',
                label: 'CryptoSwap',
                items: [
                  'factory/cryptoswap/overview',
                  'factory/cryptoswap/deployer-api',
                  'factory/cryptoswap/implementations',
                ],
              },
            ],
          },
          // Integration & Guides
          {
            type: 'category',
            label: 'Integration & Guides',
            items: [
              'integration/overview',
              'integration/address-provider',
              'integration/metaregistry',
              'integration/rate-provider',
            ],
          },
          // Bug Bounty & Audits
          {
            type: 'doc',
            id: 'security/security',
            label: 'Bug Bounty & Audits',
          },
          // References
          {
            type: 'category',
            label: 'References',
            items: [
              'references/whitepaper',
              'references/curve-practices',
              'references/notebooks',
            ],
          },
          // Deployment Addresses
          {
            type: 'category',
            label: 'Deployment Addresses',
            items: [
              'deployments/dao',
              'deployments/crosschain',
              'deployments/amm',
              'deployments/router-zaps',
              'deployments/crvusd',
              'deployments/lending',
              'deployments/integration',
            ],
          },
        ],
      },
    ],
};
