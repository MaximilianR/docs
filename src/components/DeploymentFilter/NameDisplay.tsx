import React from 'react';
import styles from './styles.module.css';

const TOKEN_LOGOS: Record<string, { src: string; label: string }> = {
  crv:     { src: '/img/logos/crv.png',        label: 'CRV' },
  vecrv:   { src: '/img/logos/vecrv.png',      label: 'veCRV' },
  crvusd:  { src: '/img/logos/crvusd.png',  label: 'crvUSD' },
  scrvusd: { src: '/img/logos/scrvusd.png', label: 'scrvUSD' },
};

export function NameDisplay({ name }: { name: string }) {
  const token = TOKEN_LOGOS[name.toLowerCase()];

  if (token) {
    return (
      <code className={styles.nameCode}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={token.src} alt={token.label} className={styles.nameLogo} />
        <span>{token.label}</span>
      </code>
    );
  }

  return <code className={styles.nameCode}>{name}</code>;
}
