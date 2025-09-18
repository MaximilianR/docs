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
                    id: 'dex/philosophy',
                    label: 'DEX Philosophy',
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
            ],
        },
        {
            type: 'category',
            label: 'Lending & crvUSD (Llamalend)',
            items: [
                {
                    type: 'doc',
                    id: 'llamalend/overview',
                    label: 'Overview',
                },
                {
                    type: 'doc',
                    id: 'llamalend/borrowing',
                    label: 'Borrowing',
                },
                {
                    type: 'doc',
                    id: 'llamalend/supplying',
                    label: 'Supplying',
                },
                {
                    type: 'doc',
                    id: 'llamalend/liquidation-protection',
                    label: 'Liquidations',
                },
                {
                    type: 'category',
                    label: 'Guides',
                    items: [
                        {
                            type: 'category',
                            label: 'Borrow',
                            items: [
                                {
                                    type: 'doc',
                                    id: 'llamalend/guides/borrow/open-and-close',
                                    label: 'Open & Close Loan',
                                },
                                {
                                    type: 'doc',
                                    id: 'llamalend/guides/borrow/loan-management',
                                },
                                {
                                    type: 'doc',
                                    id: 'llamalend/guides/borrow/liquidation',
                                    label: 'Loan in Liquidation',
                                },
                                {
                                    type: 'doc',
                                    id: 'llamalend/guides/borrow/custom-bands',
                                    label: 'Custom Bands',
                                },
                                {
                                    type: 'doc',
                                    id: 'llamalend/guides/borrow/leveraged-loans',
                                },
                            ],
                        },
                        {
                            type: 'category',
                            label: 'Supply',
                            items: [
                                {
                                    type: 'doc',
                                    id: 'llamalend/guides/supply/deposit',
                                    label: 'Deposit',
                                },
                                {
                                    type: 'doc',
                                    id: 'llamalend/guides/supply/withdraw',
                                    label: 'Withdraw',
                                },
                                {
                                    type: 'doc',
                                    id: 'llamalend/guides/supply/claim-rewards',
                                    label: 'Claim Rewards',
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
                    label: 'Cross-Chain DAO Operations',
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
                    type: 'doc',
                    id: 'security/bug-bounty',
                    label: 'Bug Bounty',
                },
                {
                    type: 'doc',
                    id: 'security/practices',
                    label: 'Security Practices',
                },
                {
                    type: 'category',
                    label: 'Risk Disclaimers',
                    items: [
                        {
                            type: 'doc',
                            id: 'security/risks/pools',
                            label: 'Liquidity Pool Risks',
                        },
                        {
                            type: 'doc',
                            id: 'security/risks/crvusd',
                            label: 'crvUSD Risks',
                        },
                        {
                            type: 'doc',
                            id: 'security/risks/lending',
                            label: 'Lending Risks',
                        },
                        {
                            type: 'doc',
                            id: 'security/risks/scrvusd',
                            label: 'scrvUSD Risks',
                        },
                    ],
                },
            ],
        },
        {
            type: 'category',
            label: 'Reference',
            items: [
                {
                    type: 'link',
                    href: 'https://quiver-meadow-354.notion.site/Brand-Assets-1a6599aae064802fba11ce6a9e642d74?source=copy_link',
                    label: 'Branding Assets',
                },
                {
                    type: 'doc',
                    id: 'reference/glossary',
                    label: 'Glossary',
                },
                {
                    type: 'doc',
                    id: 'reference/links',
                    label: 'Useful Links',
                },
                {
                    type: 'doc',
                    id: 'reference/whitepapers',
                    label: 'Whitepapers',
                },
            ],
        },
    ],
};
