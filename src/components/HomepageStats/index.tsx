import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type SectionItem = {
  title: string;
  description: string;
  link: string;
  isExternal?: boolean;
};

const sections: SectionItem[] = [
  {
    title: 'Users',
    description: 'Learn how to use Curve DEX, provide liquidity, swap tokens, and understand yield opportunities.',
    link: '/user/introduction',
    isExternal: false,
  },
  {
    title: 'Developers',
    description: 'Technical documentation for developers building integrations, understanding smart contracts, and working with Curve APIs.',
    link: 'https://dev.curve.finance/documentation-overview/',
    isExternal: true,
  },
  {
    title: 'Build on Curve',
    description: 'Resources for protocols and projects looking to integrate with Curve, understand the ecosystem, and leverage Curve infrastructure.',
    link: '/protocol/why-curve',
    isExternal: false,
  },
];

function SectionCard({title, description, link, isExternal}: SectionItem) {
  const content = (
    <div className={styles.sectionCard}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <p className={styles.sectionDescription}>{description}</p>
      <span className={styles.sectionLink}>Learn more →</span>
    </div>
  );

  if (isExternal) {
    return (
      <a href={link} className={styles.sectionLinkWrapper} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link to={link} className={styles.sectionLinkWrapper}>
      {content}
    </Link>
  );
}

export default function HomepageStats(): React.ReactNode {
  return (
    <section className={styles.stats}>
      <div className="container">
        <div className="row guide-card-row">
          {sections.map((section, idx) => (
            <div key={idx} className="col col--4">
              <SectionCard {...section} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 