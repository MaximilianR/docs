import React from 'react';
import Layout from '@theme/Layout';

export default function NotFound(): React.JSX.Element {
  return (
    <Layout title="Page not found" description="Page not found">
      <main style={{ padding: '2rem 1rem', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1>Page not found</h1>
        <p>
          The page you’re looking for doesn’t exist or has moved. Curve docs were recently
          unified—you may have followed an old link.
        </p>
        <p>
          <a href="/">Go to docs home</a>
          {' · '}
          <a href="/moved">More about the docs move</a>
        </p>
      </main>
    </Layout>
  );
}
