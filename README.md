# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.


---


- Introduction: single page which welcomes a user, explains what curve is and what it stands for; mention the three key products: DEX, Lending and DAO; what makes Curve different; 

- Curve Ecosystem Tokens:
  - CRV: curve-tokens/crv.md
  - veCRV: curve-tokens/vecrv.md
  - crvUSD: curve-tokens/crvusd.md
  - scrvUSD: curve-tokens/scrvusd.md
  - FAQ: curve-tokens/faq.md

- Using the Curve DEX:
  - Primitives: dex/primitives.md  # <– high-level intro
  - Swap Tokens on Curve: dex/swap.md
  - Provide & Withdraw Liquidity: dex/liquidity.md
  - Understanding Yield & Returns: dex/earning-yield.md
  - Differences Between Pool Types (Optional): dex/stableswap-vs-cryptoswap.md
  - FAQ: dex/faq.md

- Lending & crvUSD:
  - Overview: lending/primitives.md  # what this used to be
  - Liquidations: lending/liquidations.md
  - Loan Health: lending/loan-health.md
  - Borrow Rate: lending/borrow-rate.md
  - FAQ: lending/faq.md
  - Guides:
      - Beginner Guides:
          - Open & Close Loan: lending/guides/beginner/open-close.md
          - Manage Loan: lending/guides/beginner/manage.md
          - Loan in Liquidation: lending/guides/beginner/liquidation.md
      - Intermediate Guides:
          - Custom Bands: lending/guides/intermediate/custom-bands.md

- veCRV & Boosting Rewards:
    - What is veCRV?: vecrv/what-is-vecrv.md
    - How to Lock CRV: vecrv/how-to-lock.md
    - Boosting Pool Rewards: vecrv/boosting.md
    - Claiming Revenue Share: vecrv/revenue.md
    - veCRV FAQ: vecrv/faq.md

- Governance:
    - What is the Curve DAO?: dao/overview.md
    - Voting & Gauge Weights: dao/voting-gauges.md
    - How to Vote: dao/how-to-vote.md
    - Submitting a Proposal: dao/proposals.md
    - Community Fund & Treasury: dao/community-fund.md
    - Governance FAQ: dao/faq.md

- Cross-Chain Curve:
  - Overview: cross-chain/overview.md  # Why Curve is multi-chain, what’s available where
  - Supported Chains & Features: cross-chain/supported-chains.md
  - Using Curve on L2s: cross-chain/using-on-l2s.md
  - Bridging Curve Tokens: cross-chain/bridging-tokens.md
  - Curve DAO & Voting on L2s (Optional): cross-chain/dao-on-l2.md
  - Cross-Chain FAQ: cross-chain/faq.md

- Risks & Security:
    - Overview: risks/overview.md  # Why risk awareness matters, how to think about risk in DeFi
    - Liquidity Pool Risks: risks/pools.md
    - Lending & crvUSD Risks: risks/lending.md
    - scrvUSD Risks: risks/scrvusd.md
    - Security Practices & Audits: risks/audits.md

- Glossary: glossary.md
 
- Branding & Icons: branding.md

- Useful Links: links.md
