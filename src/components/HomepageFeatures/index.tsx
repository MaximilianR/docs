import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'User Docs',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Learn how to use Curve's interface, swap tokens, provide liquidity, and earn rewards. 
        Perfect for users new to Curve or DeFi.
      </>
    ),
    link: '/resources/intro',
  },
  {
    title: 'Technical Docs',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Dive into Curve's technical architecture, smart contracts, and integration guides. 
        Essential for developers and technical users.
      </>
    ),
    link: '/developer/documentation-overview',
  },
  {
    title: 'Asset Issuers',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Comprehensive guides for projects looking to deploy pools, add gauges, and 
        incentivize liquidity on Curve.
      </>
    ),
    link: '/protocol/overview',
  },
];

function Feature({title, Svg, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.featureLink}>
        <div className={styles.featureCard}>
          <div className="text--center">
            <Svg className={styles.featureSvg} role="img" />
          </div>
          <div className="text--center padding-horiz--md">
            <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
            <p className={styles.featureDescription}>{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function VisionStatement() {
  return (
    <div className={styles.visionContainer}>
      <div className={styles.visionContent}>
        <Heading as="h2" className={styles.visionTitle}>
          Curve's Vision
        </Heading>
        <p className={styles.visionText}>
          Curve is building the foundation for a new financial system - one that is open, 
          efficient, and accessible to all. Through our innovative AMM design, we're creating 
          the most capital-efficient exchange for stable assets, enabling seamless value transfer 
          across the DeFi ecosystem. Our mission is to be the backbone of decentralized finance, 
          providing the infrastructure that powers the future of money.
        </p>
        <p className={styles.visionText}>
          We believe in the power of community-driven development and transparent governance. 
          Every protocol upgrade, every new feature, and every strategic decision is made through 
          the collective wisdom of our DAO. This is not just our protocol - it's yours.
        </p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <VisionStatement />
        <div className={styles.featureGrid}>
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
