import React, { useState } from 'react';
import Layout from '@theme/Layout';
import HomepageStats from '@site/src/components/HomepageStats';
import GhostPosts from '@site/src/components/GhostPosts';
import styles from './index.module.css';

export default function Home() {
  const [eggOpen, setEggOpen] = useState(false);
  return (
    <Layout title="Curve Knowledge Hub" description="Your gateway to understanding and building with Curve - Documentation, metrics, and latest updates">
      <main className={styles.homepageMain}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Curve Knowledge Hub</h1>
            <p className={styles.heroSubtitle}>For users, developers, and protocols building on Curve.</p>
          </div>
        </section>

        {/* Key Metrics */}
        <section className={styles.metricsSection}>
          <div className={styles.metricsContainer}>
            <HomepageStats />
          </div>
        </section>

        {/* Latest Ghost Posts */}
        <section className={styles.postsSection}>
          <div className={styles.postsContainer}>
            <GhostPosts limit={3} />
          </div>
        </section>


        {/* Easter Egg - Pixel Llama */}
        <button
          type="button"
          className={styles.easterEgg}
          onClick={() => setEggOpen((v) => !v)}
          aria-label="Curve llama easter egg"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
          <img src={require('@site/static/img/favicon.png').default} alt="Curve llama" />
        </button>
        {eggOpen && (
          <div className={styles.easterEggPopup} role="dialog" aria-modal="true">
            <div className={styles.easterEggTitle}>You found the llama! 🦙</div>
            {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
            <img
              src={require('@site/static/img/always-has-been.png').default}
              alt="Always has been"
              className={styles.easterEggImage}
            />
            <button type="button" className={styles.easterEggClose} onClick={() => setEggOpen(false)}>Close</button>
          </div>
        )}
      </main>
    </Layout>
  );
}
