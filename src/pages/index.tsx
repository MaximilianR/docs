import React from 'react';
import Layout from '@theme/Layout';
import HomepageStats from '@site/src/components/HomepageStats';
import GhostPosts from '@site/src/components/GhostPosts';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout title="Curve Knowledge Hub" description="Your gateway to understanding and building with Curve - Documentation, metrics, and latest updates">
      <main className={styles.homepageMain}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Curve Knowledge Hub</h1>
          </div>
        </section>

        {/* Documentation Sections */}
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


        {/* Easter egg removed per request */}
      </main>
    </Layout>
  );
}
