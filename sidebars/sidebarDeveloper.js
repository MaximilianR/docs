export default {
    developer: [
        {
            type: 'doc',
            id: 'documentation-overview',
            label: 'Documentation Overview',
        },
        {
            type: 'category',
            label: 'Curve DAO',
            items: [
                {
                    type: 'doc',
                    id: 'curve_dao/crv-token',
                    label: 'CRV Token',
                },
                {
                    type: 'category',
                    label: 'Voting Escrow',
                    items: [
                        { type: 'doc', id: 'curve_dao/voting-escrow/voting-escrow', label: 'VotingEscrow' },
                        { type: 'doc', id: 'curve_dao/voting-escrow/admin-controls', label: 'Admin Controls' },
                        { type: 'doc', id: 'curve_dao/voting-escrow/smartwalletchecker', label: 'SmartWalletChecker' },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'crvUSD',
            items: [
                { type: 'doc', id: 'crvUSD/overview', label: 'Overview' },
                { type: 'doc', id: 'crvUSD/crvUSD', label: 'crvUSD Token' },
                { type: 'doc', id: 'crvUSD/controller', label: 'Controller' },
                { type: 'doc', id: 'crvUSD/amm', label: 'LLAMMA (AMM)' },
                { type: 'doc', id: 'crvUSD/llamma-explainer', label: 'LLAMMA Explainer' },
                { type: 'doc', id: 'crvUSD/oracle', label: 'Oracle' },
                { type: 'doc', id: 'crvUSD/monetarypolicy', label: 'Monetary Policy' },
                { type: 'doc', id: 'crvUSD/flashlender', label: 'FlashLender' },
                { type: 'doc', id: 'crvUSD/priceaggregator', label: 'PriceAggregator' },
                { type: 'doc', id: 'crvUSD/priceaggregator_old', label: 'PriceAggregator (Old)' },
                {
                    type: 'category',
                    label: 'Factory',
                    items: [
                        { type: 'doc', id: 'crvUSD/factory/overview', label: 'Overview' },
                        { type: 'doc', id: 'crvUSD/factory/contract-methods', label: 'Contract Methods' },
                        { type: 'doc', id: 'crvUSD/factory/deployer-api', label: 'Deployer API' },
                        { type: 'doc', id: 'crvUSD/factory/admin-controls', label: 'Admin Controls' },
                        { type: 'doc', id: 'crvUSD/factory/factory_full', label: 'Factory (Full)' },
                    ],
                },
                {
                    type: 'category',
                    label: 'PegKeepers',
                    items: [
                        { type: 'doc', id: 'crvUSD/pegkeepers/overview', label: 'Overview' },
                        { type: 'doc', id: 'crvUSD/pegkeepers/PegKeeperV1', label: 'PegKeeperV1' },
                        { type: 'doc', id: 'crvUSD/pegkeepers/PegKeeperV2', label: 'PegKeeperV2' },
                        { type: 'doc', id: 'crvUSD/pegkeepers/PegKeeperRegulator', label: 'PegKeeperRegulator' },
                        { type: 'doc', id: 'crvUSD/pegkeepers/notes', label: 'Notes' },
                    ],
                },
                {
                    type: 'category',
                    label: 'Leverage',
                    items: [
                        { type: 'doc', id: 'crvUSD/leverage/overview', label: 'Overview' },
                        { type: 'doc', id: 'crvUSD/leverage/LeverageZap', label: 'LeverageZap' },
                        { type: 'doc', id: 'crvUSD/leverage/LeverageZap1inch', label: 'LeverageZap (1inch)' },
                        { type: 'doc', id: 'crvUSD/leverage/LlamaLendOdosLeverageZap', label: 'LlamaLend Odos Zap' },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'scrvUSD',
            items: [
                { type: 'doc', id: 'scrvusd/overview', label: 'Overview' },
                { type: 'doc', id: 'scrvusd/RewardsHandler', label: 'RewardsHandler' },
                { type: 'doc', id: 'scrvusd/StablecoinLens', label: 'StablecoinLens' },
                {
                    type: 'category',
                    label: 'Cross-chain',
                    items: [
                        {
                            type: 'category',
                            label: 'Oracle V0',
                            items: [
                                { type: 'doc', id: 'scrvusd/crosschain/oracle-v0/oracle', label: 'Oracle' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Oracle V2',
                            items: [
                                { type: 'doc', id: 'scrvusd/crosschain/oracle-v2/overview', label: 'Overview' },
                                { type: 'doc', id: 'scrvusd/crosschain/oracle-v2/oracle', label: 'Oracle' },
                                { type: 'doc', id: 'scrvusd/crosschain/oracle-v2/verifier', label: 'Verifier' },
                                { type: 'doc', id: 'scrvusd/crosschain/oracle-v2/blockhash', label: 'BlockHash' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Lending',
            items: [
                { type: 'doc', id: 'lending/overview', label: 'Overview' },
                {
                    type: 'category',
                    label: 'Contracts',
                    items: [
                        { type: 'doc', id: 'lending/contracts/oneway-factory', label: 'OneWay Lending Factory' },
                        { type: 'doc', id: 'lending/contracts/vault', label: 'Vault' },
                        { type: 'doc', id: 'lending/contracts/controller-llamma', label: 'Controller & LLAMMA' },
                        { type: 'doc', id: 'lending/contracts/leverage', label: 'Leverage' },
                        {
                            type: 'category',
                            label: 'Oracles',
                            items: [
                                { type: 'doc', id: 'lending/contracts/oracle-overview', label: 'Overview' },
                                { type: 'doc', id: 'lending/contracts/cryptofrompool', label: 'CryptoFromPool' },
                                { type: 'doc', id: 'lending/contracts/cryptofrompoolvault', label: 'CryptoFromPoolVault' },
                                { type: 'doc', id: 'lending/contracts/cryptofrompoolsrate', label: 'CryptoFromPoolsRate' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Monetary Policy',
                            items: [
                                { type: 'doc', id: 'lending/contracts/mp-overview', label: 'Overview' },
                                { type: 'doc', id: 'lending/contracts/semilog-mp', label: 'SemiLog Monetary Policy' },
                                { type: 'doc', id: 'lending/contracts/secondary-mp', label: 'Secondary Monetary Policy' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'StableSwap Exchange',
            items: [
                { type: 'doc', id: 'stableswap-exchange/overview', label: 'Overview' },
                {
                    type: 'category',
                    label: 'StableSwap',
                    items: [
                        { type: 'doc', id: 'stableswap-exchange/stableswap/overview', label: 'Overview' },
                        {
                            type: 'category',
                            label: 'Pools',
                            items: [
                                { type: 'doc', id: 'stableswap-exchange/stableswap/pools/overview', label: 'Overview' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/pools/plain_pools', label: 'Plain Pools' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/pools/lending_pools', label: 'Lending Pools' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/pools/metapools', label: 'Metapools' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/pools/admin_pool_settings', label: 'Admin Pool Settings' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'LP Tokens',
                            items: [
                                { type: 'doc', id: 'stableswap-exchange/stableswap/lp_tokens/overview', label: 'Overview' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/lp_tokens/curve_token_v1', label: 'CurveToken V1' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/lp_tokens/curve_token_v2', label: 'CurveToken V2' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/lp_tokens/curve_token_v3', label: 'CurveToken V3' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Deposit Contracts',
                            items: [
                                { type: 'doc', id: 'stableswap-exchange/stableswap/deposit_contracts/overview', label: 'Overview' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/deposit_contracts/lending_pool_deposits', label: 'Lending Pool Deposits' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/deposit_contracts/metapool_deposits', label: 'Metapool Deposits' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Cross-Asset Swaps',
                            items: [
                                { type: 'doc', id: 'stableswap-exchange/stableswap/cross_asset_swaps/overview', label: 'Overview' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap/cross_asset_swaps/synthswap_exchange', label: 'SynthSwap Exchange' },
                            ],
                        },
                    ],
                },
                {
                    type: 'category',
                    label: 'StableSwap-NG',
                    items: [
                        { type: 'doc', id: 'stableswap-exchange/stableswap-ng/overview', label: 'Overview' },
                        {
                            type: 'category',
                            label: 'Pools',
                            items: [
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/pools/overview', label: 'Overview' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/pools/plainpool', label: 'Plain Pool' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/pools/metapool', label: 'Metapool' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/pools/oracles', label: 'Oracles' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/pools/admin_controls', label: 'Admin Controls' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/pools/lp_token', label: 'LP Token' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Utility Contracts',
                            items: [
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/utility_contracts/views', label: 'Views' },
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/utility_contracts/math', label: 'Math' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Implementations',
                            items: [
                                { type: 'doc', id: 'stableswap-exchange/stableswap-ng/implementations/custom1', label: 'Custom Implementation' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'CryptoSwap Exchange',
            items: [
                { type: 'doc', id: 'cryptoswap-exchange/overview', label: 'Overview' },
                {
                    type: 'category',
                    label: 'CryptoSwap',
                    items: [
                        {
                            type: 'category',
                            label: 'Pools',
                            items: [
                                { type: 'doc', id: 'cryptoswap-exchange/cryptoswap/pools/crypto-pool', label: 'CryptoPool' },
                                { type: 'doc', id: 'cryptoswap-exchange/cryptoswap/pools/admin-controls', label: 'Admin Controls' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'LP Tokens',
                            items: [
                                { type: 'doc', id: 'cryptoswap-exchange/cryptoswap/lp_tokens/overview', label: 'Overview' },
                                { type: 'doc', id: 'cryptoswap-exchange/cryptoswap/lp_tokens/lp-token-V5', label: 'LP Token V5' },
                            ],
                        },
                    ],
                },
                {
                    type: 'category',
                    label: 'TwoCrypto-NG',
                    items: [
                        { type: 'doc', id: 'cryptoswap-exchange/twocrypto-ng/overview', label: 'Overview' },
                        {
                            type: 'category',
                            label: 'Pools',
                            items: [
                                { type: 'doc', id: 'cryptoswap-exchange/twocrypto-ng/pools/overview', label: 'Overview' },
                                { type: 'doc', id: 'cryptoswap-exchange/twocrypto-ng/pools/twocrypto', label: 'TwoCrypto' },
                                { type: 'doc', id: 'cryptoswap-exchange/twocrypto-ng/pools/oracles', label: 'Oracles' },
                                { type: 'doc', id: 'cryptoswap-exchange/twocrypto-ng/pools/admin-controls', label: 'Admin Controls' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Utility Contracts',
                            items: [
                                { type: 'doc', id: 'cryptoswap-exchange/twocrypto-ng/utility-contracts/views', label: 'Views' },
                                { type: 'doc', id: 'cryptoswap-exchange/twocrypto-ng/utility-contracts/math', label: 'Math' },
                            ],
                        },
                    ],
                },
                {
                    type: 'category',
                    label: 'TriCrypto-NG',
                    items: [
                        { type: 'doc', id: 'cryptoswap-exchange/tricrypto-ng/overview', label: 'Overview' },
                        {
                            type: 'category',
                            label: 'Pools',
                            items: [
                                { type: 'doc', id: 'cryptoswap-exchange/tricrypto-ng/pools/tricrypto', label: 'TriCrypto' },
                                { type: 'doc', id: 'cryptoswap-exchange/tricrypto-ng/pools/oracles', label: 'Oracles' },
                                { type: 'doc', id: 'cryptoswap-exchange/tricrypto-ng/pools/admin-controls', label: 'Admin Controls' },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Utility Contracts',
                            items: [
                                { type: 'doc', id: 'cryptoswap-exchange/tricrypto-ng/utility-contracts/views', label: 'Views' },
                                { type: 'doc', id: 'cryptoswap-exchange/tricrypto-ng/utility-contracts/math', label: 'Math' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Registry',
            items: [
                { type: 'doc', id: 'registry/overview', label: 'Overview' },
                { type: 'doc', id: 'registry/MetaRegistryAPI', label: 'MetaRegistry API' },
            ],
        },
        {
            type: 'category',
            label: 'Pool Factory',
            items: [
                { type: 'doc', id: 'factory/overview', label: 'Overview' },
                {
                    type: 'category',
                    label: 'StableSwap',
                    items: [
                        { type: 'doc', id: 'factory/stableswap/overview', label: 'Overview' },
                        { type: 'doc', id: 'factory/stableswap/deployer-api', label: 'Deployer API' },
                        { type: 'doc', id: 'factory/stableswap/implementations', label: 'Implementations' },
                    ],
                },
                {
                    type: 'category',
                    label: 'StableSwap-NG',
                    items: [
                        { type: 'doc', id: 'factory/stableswap-ng/overview', label: 'Overview' },
                        { type: 'doc', id: 'factory/stableswap-ng/deployer-api', label: 'Deployer API' },
                    ],
                },
                {
                    type: 'category',
                    label: 'CryptoSwap',
                    items: [
                        { type: 'doc', id: 'factory/cryptoswap/overview', label: 'Overview' },
                        { type: 'doc', id: 'factory/cryptoswap/deployer-api', label: 'Deployer API' },
                        { type: 'doc', id: 'factory/cryptoswap/implementations', label: 'Implementations' },
                    ],
                },
                {
                    type: 'category',
                    label: 'TwoCrypto-NG',
                    items: [
                        { type: 'doc', id: 'factory/twocrypto-ng/overview', label: 'Overview' },
                        { type: 'doc', id: 'factory/twocrypto-ng/deployer-api', label: 'Deployer API' },
                    ],
                },
                {
                    type: 'category',
                    label: 'TriCrypto-NG',
                    items: [
                        { type: 'doc', id: 'factory/tricrypto-ng/overview', label: 'Overview' },
                        { type: 'doc', id: 'factory/tricrypto-ng/deployer-api', label: 'Deployer API' },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Router',
            items: [
                { type: 'doc', id: 'router/CurveRouterNG', label: 'CurveRouter-NG' },
                { type: 'doc', id: 'router/CurveRegistryExchange', label: 'CurveRegistryExchange' },
            ],
        },
        {
            type: 'category',
            label: 'Gauges & Minting CRV',
            items: [
                { type: 'doc', id: 'liquidity-gauges-and-minting-crv/overview', label: 'Overview' },
                {
                    type: 'category',
                    label: 'Gauges',
                    items: [
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/gauges/overview', label: 'Overview' },
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/gauges/LiquidityGaugeV6', label: 'LiquidityGaugeV6' },
                    ],
                },
                {
                    type: 'category',
                    label: 'Gauge Controller',
                    items: [
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/gauge-controller/GaugeController', label: 'GaugeController' },
                    ],
                },
                {
                    type: 'category',
                    label: 'Minter',
                    items: [
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/minter/Minter', label: 'Minter' },
                    ],
                },
                {
                    type: 'category',
                    label: 'Cross-chain Gauges',
                    items: [
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/xchain-gauges/overview', label: 'Overview' },
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/xchain-gauges/RootGauge', label: 'RootGauge' },
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/xchain-gauges/RootGaugeFactory', label: 'RootGaugeFactory' },
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/xchain-gauges/ChildGauge', label: 'ChildGauge' },
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/xchain-gauges/ChildGaugeFactory', label: 'ChildGaugeFactory' },
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/xchain-gauges/Bridgers', label: 'Bridgers' },
                    ],
                },
                {
                    type: 'category',
                    label: 'Boosting (Sidechains)',
                    items: [
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/boosting-sidechains/L2VotingEscrowOracle', label: 'L2 VotingEscrow Oracle' },
                        { type: 'doc', id: 'liquidity-gauges-and-minting-crv/boosting-sidechains/Updater', label: 'Updater' },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Fees',
            items: [
                { type: 'doc', id: 'fees/overview', label: 'Overview' },
                { type: 'doc', id: 'fees/FeeCollector', label: 'FeeCollector' },
                { type: 'doc', id: 'fees/FeeDistributor', label: 'FeeDistributor' },
                { type: 'doc', id: 'fees/FeeSplitter', label: 'FeeSplitter' },
                { type: 'doc', id: 'fees/CowSwapBurner', label: 'CowSwapBurner' },
                { type: 'doc', id: 'fees/Hooker', label: 'Hooker' },
                {
                    type: 'category',
                    label: 'Original Architecture',
                    items: [
                        { type: 'doc', id: 'fees/original-architecture/overview', label: 'Overview' },
                        { type: 'doc', id: 'fees/original-architecture/withdraw-and-burn', label: 'Withdraw & Burn' },
                        { type: 'doc', id: 'fees/original-architecture/burner', label: 'Burner' },
                        { type: 'doc', id: 'fees/original-architecture/distributor', label: 'Distributor' },
                        { type: 'doc', id: 'fees/original-architecture/sidechains', label: 'Sidechains' },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Governance',
            items: [
                { type: 'doc', id: 'governance/overview', label: 'Overview' },
                { type: 'doc', id: 'governance/curve-dao', label: 'Curve DAO' },
                {
                    type: 'category',
                    label: 'Cross-chain Governance',
                    items: [
                        { type: 'doc', id: 'governance/x-gov/overview', label: 'Overview' },
                        { type: 'doc', id: 'governance/x-gov/broadcaster', label: 'Broadcaster' },
                        { type: 'doc', id: 'governance/x-gov/relayer', label: 'Relayer' },
                        { type: 'doc', id: 'governance/x-gov/agents', label: 'Agents' },
                        { type: 'doc', id: 'governance/x-gov/vault', label: 'Vault' },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Integration',
            items: [
                { type: 'doc', id: 'integration/overview', label: 'Overview' },
                { type: 'doc', id: 'integration/address-provider', label: 'AddressProvider' },
                { type: 'doc', id: 'integration/metaregistry', label: 'MetaRegistry' },
                { type: 'doc', id: 'integration/rate-provider', label: 'Rate Provider' },
            ],
        },
        {
            type: 'category',
            label: 'Curve API',
            items: [
                { type: 'doc', id: 'curve-api/curve-api', label: 'Curve API' },
                { type: 'doc', id: 'curve-api/curve-prices', label: 'Curve Prices' },
            ],
        },
        {
            type: 'category',
            label: 'Deployments',
            items: [
                { type: 'doc', id: 'deployments/contract-deployments', label: 'Contract Deployments' },
                { type: 'doc', id: 'deployments/amm', label: 'AMM' },
                { type: 'doc', id: 'deployments/crvusd', label: 'crvUSD' },
                { type: 'doc', id: 'deployments/lending', label: 'Lending' },
                { type: 'doc', id: 'deployments/dao', label: 'DAO' },
                { type: 'doc', id: 'deployments/integration', label: 'Integration' },
                { type: 'doc', id: 'deployments/crosschain', label: 'Cross-chain' },
                { type: 'doc', id: 'deployments/router-zaps', label: 'Router & Zaps' },
            ],
        },
        {
            type: 'category',
            label: 'Security',
            items: [
                { type: 'doc', id: 'security/security', label: 'Security' },
            ],
        },
        {
            type: 'category',
            label: 'References',
            items: [
                { type: 'doc', id: 'references/deployed-contracts', label: 'Deployed Contracts' },
                { type: 'doc', id: 'references/audits', label: 'Audits' },
                { type: 'doc', id: 'references/whitepaper', label: 'Whitepapers' },
                { type: 'doc', id: 'references/notebooks', label: 'Notebooks' },
                { type: 'doc', id: 'references/curve-practices', label: 'Curve Practices' },
                { type: 'doc', id: 'references/useful', label: 'Useful Resources' },
            ],
        },
    ],
};
