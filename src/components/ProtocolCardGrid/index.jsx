import React from 'react';
import ProtocolCard from '../ProtocolCard';
import styles from '../ProtocolCard/styles.module.css';

export default function ProtocolCardGrid({ protocols }) {
  return (
    <div className={styles.protocolCardsGrid}>
      {protocols.map((protocol, index) => (
        <ProtocolCard
          key={index}
          name={protocol.name}
          logo={protocol.logo}
          description={protocol.description}
        />
      ))}
    </div>
  );
}
