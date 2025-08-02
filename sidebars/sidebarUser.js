export default {
    user: [
        {
            type: 'doc',
            id: 'introduction',
            label: 'Introduction',
        },
        {
            type: 'category',
            label: 'Curve Ecosystem Tokens',
            items: [
                {
                    type: 'doc',
                    id: 'curve-tokens/crv',
                    label: 'CRV',
                },
                {
                    type: 'doc',
                    id: 'curve-tokens/vecrv',
                    label: 'veCRV',
                },
                {
                    type: 'doc',
                    id: 'curve-tokens/crvusd',
                    label: 'crvUSD',
                },
                {
                    type: 'doc',
                    id: 'curve-tokens/scrvusd',
                    label: 'scrvUSD',
                },
                {
                    type: 'doc',
                    id: 'curve-tokens/faq',
                    label: 'FAQ',
                },
            ],
        },
        {
            type: 'category',
            label: 'Earning Yield',
            items: [
                {
                    type: 'doc',
                    id: 'yield/overview',
                    label: 'Overview',
                },
                {
                    type: 'doc',
                    id: 'yield/lp',
                    label: 'Providing Liquidity in Pools',
                },
                {
                    type: 'doc',
                    id: 'yield/lending',
                    label: 'Lending Assets',
                },
                {
                    type: 'doc',
                    id: 'yield/scrvusd',
                    label: 'Savings Vault (scrvUSD)',
                },
                {
                    type: 'doc',
                    id: 'yield/boosting',
                    label: 'Boosting with veCRV',
                },
                {
                    type: 'doc',
                    id: 'yield/revenue',
                    label: 'Claiming Revenue Share',
                },
                {
                    type: 'doc',
                    id: 'yield/faq',
                    label: 'Yield FAQ',
                },
            ],
        },
        {
            type: 'category',
            label: 'Curve DEX',
            items: [
                {
                    type: 'doc',
                    id: 'dex/primitives',
                    label: 'Primitives',
                },
                {
                    type: 'doc',
                    id: 'dex/swap',
                    label: 'Swap Tokens on Curve',
                },
                {
                    type: 'doc',
                    id: 'dex/liquidity',
                    label: 'Provide & Withdraw Liquidity',
                },
                {
                    type: 'doc',
                    id: 'dex/earning-yield',
                    label: 'Understanding Rewards',
                },
                {
                    type: 'doc',
                    id: 'dex/stableswap-vs-cryptoswap',
                    label: 'Stableswap vs Cryptoswap',
                },
                {
                    type: 'doc',
                    id: 'dex/faq',
                    label: 'FAQ',
                },
                {
                    type: 'category',
                    label: 'Guides',
                    items: [
                        {
                            type: 'doc',
                            id: 'dex/guides/how-to-swap',
                            label: 'How to Swap',
                        },
                        {
                            type: 'doc',
                            id: 'dex/guides/how-to-lp',
                            label: 'How to LP',
                        },
                        {
                            type: 'doc',
                            id: 'dex/guides/how-to-claim-rewards',
                            label: 'How to Claim Rewards',
                        },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Lending & crvUSD (LlamaLend)',
            items: [
                {
                    type: 'doc',
                    id: 'lending/primitives',
                    label: 'Overview',
                },
                {
                    type: 'doc',
                    id: 'lending/liquidations',
                    label: 'Liquidations',
                },
                {
                    type: 'doc',
                    id: 'lending/loan-health',
                    label: 'Loan Health',
                },
                {
                    type: 'doc',
                    id: 'lending/borrow-rate',
                    label: 'Borrow Rate',
                },
                {
                    type: 'doc',
                    id: 'lending/faq',
                    label: 'FAQ',
                },
                {
                    type: 'category',
                    label: 'Guides',
                    items: [
                        {
                            type: 'category',
                            label: 'Beginner Guides',
                            items: [
                                {
                                    type: 'doc',
                                    id: 'lending/guides/beginner/open-and-close',
                                    label: 'Open & Close Loan',
                                },
                                {
                                    type: 'doc',
                                    id: 'lending/guides/beginner/lending',
                                    label: 'Lending',
                                },
                                {
                                    type: 'doc',
                                    id: 'lending/guides/beginner/loan-management',
                                    label: 'Manage Loan',
                                },
                                {
                                    type: 'doc',
                                    id: 'lending/guides/beginner/liquidation',
                                    label: 'Loan in Liquidation',
                                },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Intermediate Guides',
                            items: [
                                {
                                    type: 'doc',
                                    id: 'lending/guides/intermediate/custom-bands',
                                    label: 'Custom Bands',
                                },
                                {
                                    type: 'doc',
                                    id: 'lending/guides/intermediate/leveraged-loans',
                                    label: 'Leveraged Loans',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'veCRV & Boosting Rewards',
            items: [
                {
                    type: 'doc',
                    id: 'vecrv/what-is-vecrv',
                    label: 'What is veCRV?',
                },
                {
                    type: 'doc',
                    id: 'vecrv/how-to-lock',
                    label: 'How to Lock CRV',
                },
                {
                    type: 'doc',
                    id: 'vecrv/boosting',
                    label: 'Boosting Pool Rewards',
                },
                {
                    type: 'doc',
                    id: 'vecrv/revenue',
                    label: 'Claiming Revenue Share',
                },
                {
                    type: 'doc',
                    id: 'vecrv/faq',
                    label: 'FAQ',
                },
            ],
        },
        {
            type: 'category',
            label: 'DAO & Governance',
            items: [
                {
                    type: 'doc',
                    id: 'dao/overview',
                    label: 'Curve DAO',
                },
                {
                    type: 'doc',
                    id: 'dao/gauge-weights',
                    label: 'Gauge Weights',
                },
                {
                    type: 'doc',
                    id: 'dao/proposals',
                    label: 'Proposals',
                },
                {
                    type: 'doc',
                    id: 'dao/how-to-vote',
                    label: 'How to Vote',
                },
                {
                    type: 'doc',
                    id: 'dao/community-fund-treasury',
                    label: 'Community Fund & Treasury',
                },
            ],
        },
        {
            type: 'category',
            label: 'Cross-Chain Curve',
            items: [
                {
                    type: 'doc',
                    id: 'cross-chain/overview',
                    label: 'Overview',
                },
                {
                    type: 'doc',
                    id: 'cross-chain/supported-chains',
                    label: 'Supported Chains & Features',
                },
                {
                    type: 'doc',
                    id: 'cross-chain/using-on-l2s',
                    label: 'Using Curve on L2s',
                },
                {
                    type: 'doc',
                    id: 'cross-chain/bridging-tokens',
                    label: 'Bridging Curve Tokens',
                },
                {
                    type: 'doc',
                    id: 'cross-chain/dao-on-l2',
                    label: 'Curve DAO & Voting on L2s',
                },
                {
                    type: 'doc',
                    id: 'cross-chain/faq',
                    label: 'Cross-Chain FAQ',
                },
            ],
        },
        {
            type: 'category',
            label: 'Audits & Security',
            items: [
                {
                    type: 'doc',
                    id: 'security/audits',
                    label: 'Audits',
                },
                {
                    type: 'category',
                    label: 'Risk Disclaimers',
                    items: [
                        {
                            type: 'doc',
                            id: 'risks/pools',
                            label: 'Liquidity Pool Risks',
                        },
                        {
                            type: 'doc',
                            id: 'risks/crvusd',
                            label: 'crvUSD Risks',
                        },
                        {
                            type: 'doc',
                            id: 'risks/lending',
                            label: 'Lending Risks',
                        },
                        {
                            type: 'doc',
                            id: 'risks/scrvusd',
                            label: 'scrvUSD Risks',
                        },
                    ],
                },
                {
                    type: 'doc',
                    id: 'security/bug-bounty',
                    label: 'Bug Bounty',
                },
                {
                    type: 'doc',
                    id: 'security/practices',
                    label: 'Security Practices',
                },
            ],
        },
        {
            type: 'category',
            label: 'Reference',
            items: [
                {
                    type: 'doc',
                    id: 'reference/glossary',
                    label: 'Glossary',
                },
                {
                    type: 'doc',
                    id: 'reference/branding',
                    label: 'Branding & Icons',
                },
                {
                    type: 'doc',
                    id: 'reference/links',
                    label: 'Useful Links',
                },
            ],
        },
    ],
};
