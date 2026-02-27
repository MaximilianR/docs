# Security
Curve Finance prioritizes the security of its protocols and user funds above all else. We maintain a bug bounty program to encourage responsible disclosure of potential vulnerabilities and actively collaborate with security researchers and whitehat hackers to ensure the safety of our ecosystem. Our security practices include regular audits, continuous monitoring, and swift response to potential threats.

:::github[Security Contact & Disclosure Reports]

For security-related inquiries and vulnerability reports: security@curve.fi

Security audits and disclosure reports are available on [GitHub](https://github.com/curvefi/security-incident-reports)


:::

---

# **Bug Bounty****Scope**Issues which can lead to substantial loss of money, critical bugs like a broken live-ness condition or irreversible loss of funds.

**Disclosure policy**Let us know as soon as possible upon discovery of a potential security issue.
Provide us a reasonable amount of time to resolve the issue before any disclosure to the public or a third-party.

**Exclusions**Already known vulnerabilities.
Vulnerabilities in front-end code not leading to smart contract vulnerabilities.

**Eligibility**You must be the first reporter of the vulnerability
You must be able to verify a signature from same address
Provide enough information about the vulnerability

**Bug Bounty Payout**

| Likelihood / Severity | Low | Moderate | High |
| :-: | :-: | :-: | :-: |
| Almost Certain | $10,000 | $50,000 | $250,000 |
| Possible | $1,000 | $10,000 | $50,000 |
| Unlikely | $250 | $1,000 | $5,000 |

---

# **Security Audits**## **DAO**

-   **Curve DAO Contracts**---

    Auditor: [TrailOfBits](https://trailofbits.com/)  
    Date: 31. January, 2020

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/00-ToB.pdf)

-   **Curve DAO Contracts**---

    Auditor: [TrailOfBits](https://trailofbits.com/)  
    Date: 10. July, 2020

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/curve-dao-ToB-final.pdf)

-   :logos-solidity: **`BalanceTimeForwarder.sol`**---

    Auditor: [:logos-mixbytes: MixBytes](https://mixbytes.io/)  
    Date: 13. July, 2020

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/Curve%20Finance%20DAO%20Voting%20Forwarder%20Security%20Audit%20Report.pdf)

-   :logos-solidity: **`Voting.sol` (Aragon Voting Fork)**---

    Auditor: [:logos-mixbytes: MixBytes](https://mixbytes.io/)  
    Date: 22. July, 2020

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/Curve%20Finance%20DAO%20Voting%20Security%20Audit%20Report.pdf)

-   **Curve DAO Contracts**---

    Auditor: [:logos-quantstamp: Quantstamp](https://quantstamp.com/)  
    Date: 5. August, 2020

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/curve-dao-quantstamp.pdf)

-   [ Docs](../fees/FeeSplitter.md/)
    :logos-vyper: **`FeeSplitter.vy`**--- 

    Auditor: [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/)  
    Date: 25. September, 2024

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/ChainSecurity_FeeSplitter.pdf)


---

## **DEX**

-   [ Docs](../stableswap-exchange/stableswap/pools/metapools.md)
    **Metapools**---

    Auditor: [:logos-quantstamp: Quantstamp](https://quantstamp.com/)  
    Date: 15. October, 2020

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/CurveMetapoolAudit.pdf)

-   **ETH/sETH Pool**---

    Auditor: [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/)  
    Date: 27. September, 2021

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/ChainSecurity_Curve_Finance_Curve_ETH_sETH_Smart_contract_audit.pdf)

-   [ Docs](../stableswap-exchange/stableswap-ng/overview.md)
    **Stableswap-NG**---

    Auditor: [:logos-mixbytes: MixBytes](https://mixbytes.io/)  
    Date: 27. September, 2021

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/Curve%20Finance%20StableSwapNG%20Security%20Audit%20Report.pdf)

-   **Tricrypto**---

    Auditor: [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/)  
    Date: 29. September, 2021

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/ChainSecurity_Curve_Finance_Tricrypto_smart_contract_audit_September.pdf)

-   [ Docs](../cryptoswap-exchange/tricrypto-ng/overview.md)
    **Tricrypto-NG**---

    Auditor: [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/)  
    Date: 23. June, 2023

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/ChainSecurity_Curve_tricrypto-ng_audit.pdf)

-   [ Docs](../cryptoswap-exchange/cryptoswap/pools/crypto-pool.md)
    **Twocrypto**---

    Auditor: [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/)  
    Date: 1. April, 2022

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/private_ChainSecurity_Curve_CurveCryptoSwap2ETH_audit_draft.pdf)


---

## **Stablecoin and Lending**

-   [ Docs](../crvUSD/overview.md)
    **Curve Stablecoin**---

    Auditor: [:logos-mixbytes: MixBytes](https://mixbytes.io/)  
    Date: 5. June, 2023

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/Curve%20Stablecoin%20(crvUSD)%20Security%20Audit%20Report.pdf)

-   [ Docs](../crvUSD/overview.md)
    **Curve Stablecoin**---

    Auditor: [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/)  
    Date: 24. January, 2024

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/ChainSecurity_Curve_Curve_Stablecoin_audit-1.pdf)

-   [ Docs](../crvUSD/overview.md)
    **Curve Stablecoin**---

    Auditor: [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/)  
    Date: 21. February, 2025

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/ChainSecurity_Curve_Curve_Stablecoin_audit_250221.pdf)

-   [ Docs](../crvUSD/pegkeepers/overview.md)
    **crvUSD PegKeeperV2**---

    Auditor: [:logos-chainsecurity: ChainSecurity](https://www.chainsecurity.com/)  
    Date: 12. December, 2023

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/ChainSecurity_Curve_PegKeeperV2_audit.pdf)

-   [ Docs](../lending/overview.md)
    **Curve Lending**---

    Auditor: [StateMind](https://statemind.io/)  
    Date: 2. February, 2024

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/StateMind_Curve_Lending.pdf)

-   [ Docs](../scrvusd/overview.md)
    **Savings-crvUSD (scrvUSD)**---

    Auditor: [ChainSecurity](https://www.chainsecurity.com/)  
    Date: 03. December, 2024

    [ Audit Report](https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/ChainSecurity_Curve_scrvUSD_audit.pdf)
