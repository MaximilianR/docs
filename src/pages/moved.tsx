import React from 'react';
import Layout from '@theme/Layout';

export default function Moved(): React.JSX.Element {
  return (
    <Layout
      title="Docs moved"
      description="Curve documentation has been unified on docs.curve.finance."
    >
      <main style={{ padding: '2rem 1rem', maxWidth: 720, margin: '0 auto' }}>
        <h1>Documentation has moved</h1>
        <p>
          Curve documentation is now unified on <strong>docs.curve.finance</strong>.
          What used to live on resources.curve.finance and the previous docs.curve.finance
          is now here or on our legacy technical docs.
        </p>
        <ul>
          <li>
            <a href="/">Docs home</a>
          </li>
          <li>
            <a href="/search">Search</a>
          </li>
          <li>
            <a href="/developer/documentation-overview">Technical docs (developers &amp; contracts)</a>
          </li>
        </ul>
      </main>
    </Layout>
  );
}
