export const ALL_AUDITS = [
  // DAO Audits
  {
    id: 'dao-1',
    category: 'dao',
    auditor: 'TrailOfBits',
    date: '31. January, 2020',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/00-ToB.pdf',
    logo: 'tob.svg'
  },
  {
    id: 'dao-2',
    category: 'dao',
    auditor: 'TrailOfBits',
    date: '10. July, 2020',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/curve-dao-ToB-final.pdf',
    logo: 'tob.svg'
  },
  {
    id: 'dao-3',
    category: 'dao',
    auditor: 'MixBytes',
    date: '13. July, 2020',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/Curve%20Finance%20DAO%20Voting%20Forwarder%20Security%20Audit%20Report.pdf',
    logo: 'mixbytes_light.svg'
  },
  {
    id: 'dao-4',
    category: 'dao',
    auditor: 'MixBytes',
    date: '22. July, 2020',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/Curve%20Finance%20DAO%20Voting%20Security%20Audit%20Report.pdf',
    logo: 'mixbytes_light.svg'
  },
  {
    id: 'dao-5',
    category: 'dao',
    auditor: 'Quantstamp',
    date: '5. August, 2020',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/curve-dao-quantstamp.pdf',
    logo: 'quantstamp.svg'
  },
  {
    id: 'dao-6',
    category: 'dao',
    auditor: 'ChainSecurity',
    date: '25. September, 2024',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dao/ChainSecurity_FeeSplitter.pdf',
    logo: 'chainsecurity.jpg'
  },

  // DEX Audits
  {
    id: 'dex-1',
    category: 'dex',
    auditor: 'Quantstamp',
    date: '15. October, 2020',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/CurveMetapoolAudit.pdf',
    logo: 'quantstamp.svg'
  },
  {
    id: 'dex-2',
    category: 'dex',
    auditor: 'ChainSecurity',
    date: '27. September, 2021',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/ChainSecurity_Curve_Finance_Curve_ETH_sETH_Smart_contract_audit.pdf',
    logo: 'chainsecurity.jpg'
  },
  {
    id: 'dex-3',
    category: 'dex',
    auditor: 'MixBytes',
    date: '27. September, 2021',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/Curve%20Finance%20StableSwapNG%20Security%20Audit%20Report.pdf',
    logo: 'mixbytes_light.svg'
  },
  {
    id: 'dex-4',
    category: 'dex',
    auditor: 'ChainSecurity',
    date: '29. September, 2021',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/ChainSecurity_Curve_Finance_Tricrypto_smart_contract_audit_September.pdf',
    logo: 'chainsecurity.jpg'
  },
  {
    id: 'dex-5',
    category: 'dex',
    auditor: 'ChainSecurity',
    date: '23. June, 2023',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/ChainSecurity_Curve_tricrypto-ng_audit.pdf',
    logo: 'chainsecurity.jpg'
  },
  {
    id: 'dex-6',
    category: 'dex',
    auditor: 'ChainSecurity',
    date: '1. April, 2022',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/dex/private_ChainSecurity_Curve_CurveCryptoSwap2ETH_audit_draft.pdf',
    logo: 'chainsecurity.jpg'
  },

  // Stablecoin and Lending Audits
  {
    id: 'stablecoin-1',
    category: 'stablecoin',
    auditor: 'MixBytes',
    date: '5. June, 2023',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/Curve%20Stablecoin%20(crvUSD)%20Security%20Audit%20Report.pdf',
    logo: 'mixbytes_light.svg'
  },
  {
    id: 'stablecoin-2',
    category: 'stablecoin',
    auditor: 'ChainSecurity',
    date: '24. January, 2024',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/ChainSecurity_Curve_Curve_Stablecoin_audit-1.pdf',
    logo: 'chainsecurity.jpg'
  },
  {
    id: 'stablecoin-3',
    category: 'stablecoin',
    auditor: 'ChainSecurity',
    date: '21. February, 2025',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/ChainSecurity_Curve_Curve_Stablecoin_audit_250221.pdf',
    logo: 'chainsecurity.jpg'
  },
  {
    id: 'stablecoin-4',
    category: 'stablecoin',
    auditor: 'ChainSecurity',
    date: '12. December, 2023',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/ChainSecurity_Curve_PegKeeperV2_audit.pdf',
    logo: 'chainsecurity.jpg'
  },
  {
    id: 'stablecoin-5',
    category: 'stablecoin',
    auditor: 'StateMind',
    date: '2. February, 2024',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/StateMind_Curve_Lending.pdf',
    logo: 'statemind_light.svg'
  },
  {
    id: 'stablecoin-6',
    category: 'stablecoin',
    auditor: 'ChainSecurity',
    date: '03. December, 2024',
    reportUrl: 'https://github.com/curvefi/security-incident-reports/blob/main/audits/crvusd/ChainSecurity_Curve_scrvUSD_audit.pdf',
    logo: 'chainsecurity.jpg'
  }
];
