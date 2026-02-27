import React from 'react';
import styles from './ContractInfo.module.css';

const EXPLORERS = {
  Ethereum: 'https://etherscan.io/address/',
  Arbitrum: 'https://arbiscan.io/address/',
  Optimism: 'https://optimistic.etherscan.io/address/',
  Base: 'https://basescan.org/address/',
  Polygon: 'https://polygonscan.com/address/',
  Avalanche: 'https://snowtrace.io/address/',
  Fantom: 'https://ftmscan.com/address/',
  Gnosis: 'https://gnosisscan.io/address/',
  BSC: 'https://bscscan.com/address/',
  Fraxtal: 'https://fraxscan.com/address/',
  Mantle: 'https://mantlescan.xyz/address/',
  Celo: 'https://celoscan.io/address/',
  Aurora: 'https://explorer.aurora.dev/address/',
  Kava: 'https://kavascan.com/address/',
  ZkSync: 'https://era.zksync.network/address/',
  Linea: 'https://lineascan.build/address/',
  Scroll: 'https://scrollscan.com/address/',
  'X Layer': 'https://www.okx.com/web3/explorer/xlayer/address/',
};

function truncateAddress(addr) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function ContractInfo({ name, github, vyper, solidity, deployments, children }) {
  const lang = vyper ? `Vyper ${vyper}` : solidity ? `Solidity ${solidity}` : null;

  return (
    <div className={styles.container}>
      <p className={styles.name}><code>{name}</code></p>
      {!children && (
        <>
          <p className={styles.meta}>
            {github && (
              <span>
                <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
              </span>
            )}
            {github && lang && <span className={styles.separator}>·</span>}
            {lang && <span>{lang}</span>}
          </p>
          {deployments && (
            <div className={styles.deployments}>
              {Object.entries(deployments).map(([chain, address]) => {
                const explorerBase = EXPLORERS[chain] || `https://etherscan.io/address/`;
                return (
                  <span key={chain} className={styles.deployment}>
                    {chain}:{' '}
                    <a href={`${explorerBase}${address}`} target="_blank" rel="noopener noreferrer">
                      {truncateAddress(address)}
                    </a>
                  </span>
                );
              })}
            </div>
          )}
        </>
      )}
      {children && <div className={styles.children}>{children}</div>}
    </div>
  );
}
