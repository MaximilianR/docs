import React from 'react';
import ButtonIcon from '@site/src/components/ButtonIcon';

export const ALL_BUTTONS = {
  lockCrv: {
    link: 'https://www.curve.finance/dao/ethereum/vecrv/create/',
    line1: 'Lock',
    line2Content: (
      <>
        <ButtonIcon src="/img/logos/CRV_s.png" alt="CRV" />
        CRV &nbsp; ⟶ &nbsp;
        <ButtonIcon src="/img/logos/veCRV_s.png" alt="veCRV" />
        veCRV
      </>
    ),
  },
  claimVecrvRevenue: {
    link: 'https://www.curve.finance/dex/ethereum/dashboard/',
    line1: 'Claim',
    line2Content: (
      <>
        <ButtonIcon src="/img/logos/veCRV_s.png" alt="veCRV" />
        veCRV Revenue
      </>
    ),
  },
  vecrvDashboard: {
    link: 'https://www.curve.finance/dex/ethereum/dashboard/',
    line1: 'Go to',
    line2Content: (
      <>
        <ButtonIcon src="/img/logos/CRV_s.png" alt="CRV" />
        DEX Dashboard
      </>
    ),
  },
  boostCalculator: {
    link: 'https://dao-old.curve.finance/minter/calc',
    line1: 'Go to',
    line2Content: (
      <>
        <ButtonIcon src="/img/logos/CRV_s.png" alt="CRV" />
        Boost Calculator
      </>
    ),
  },
  gotoScrvusd: {
    link: 'https://www.curve.finance/crvusd/ethereum/scrvUSD/',
    line1: 'Go to',
    line2Content: (
      <>
        <ButtonIcon src="/img/logos/scrvUSD_s.png" alt="scrvUSD" />
        scrvUSD Savings Vault
      </>
    ),
  },
  gotoVecrvAnalytics: {
    link: 'https://www.curve.finance/dao/ethereum/analytics/',
    line1: 'Check',
    line2Content: (
      <>
        <ButtonIcon src="/img/logos/veCRV_s.png" alt="veCRV" />
        veCRV Revenue & Metrics
      </>
    ),
  },
  gotoDex: {
    link: 'https://www.curve.finance/dex/ethereum/pools/',
    line1: 'Go to',
    line2Content: (
      <>
        <ButtonIcon src="/img/logos/CRV_s.png" alt="Curve" />
        Curve's DEX
      </>
    ),
  },
  gotoSwap: {
    link: 'https://www.curve.finance/dex/ethereum/swap/',
    line1: 'Go to',
    line2Content: (
      <>
        <ButtonIcon src="/img/logos/CRV_s.png" alt="Curve" />
        Curve Swap
      </>
    ),
  },
  gotoLend: {
    link: 'https://www.curve.finance/lend/ethereum/markets/',
    line1: 'Go to',
    line2Content: (
      <>
        <ButtonIcon
          src="/img/favicon.png"
          alt="Llamalend"
          rounded={false}
        />
        Llamalend
      </>
    ),
  }
  // --- Add any other buttons you want to reuse here ---
  // example: {
  //   link: '...',
  //   line1: '...',
  //   line2Content: '...'
  // }
};