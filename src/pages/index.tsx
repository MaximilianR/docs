import React from 'react';
import Layout from '@theme/Layout';
import HomepageStats from '@site/src/components/HomepageStats';

export default function Home() {
  return (
    <Layout title="Curve Manifesto" description="Curve: Infrastructure for a Decentralized Financial Future">
      <main className="manifesto-main">
        {/* Rainbow logo and identity statement */}
        <div className="identity-block">
          <div className="identity-text">
            Curve isn't a product. It's infrastructure for a decentralized financial future — built for those who understand that efficiency is power, and composability is freedom.
          </div>
        </div>

        {/* Condensed Manifesto */}
        <section className="manifesto-section">
          <div className="manifesto-block">
            <p><b>CAPITAL EFFICIENCY:</b> Every line of code, every pool, every mechanism is designed for optimal use of liquidity.</p>
            <p><b>TRANSPARENT GOVERNANCE:</b> Curve is governed by its users, in the open, on-chain.</p>
            <p><b>STABILITY:</b> We build for resilience, not for hype.</p>
            <p><b>COMPOSABILITY:</b> Curve is a protocol that plays well with others — a foundation for DeFi.</p>
            <p><b>MINIMALISM:</b> No bloat. No distractions. Just the essentials.</p>
            <p><b>COMMUNITY OWNERSHIP:</b> Curve belongs to those who use and govern it.</p>
          </div>
        </section>

        {/* Three Main Entry Points */}
        <section className="entrypoints-section">
          <div className="entrypoints-grid">
            <a href="/resources/intro" className="entry-card">
              <div className="entry-label">USE IT</div>
              <div className="entry-desc">User Docs</div>
              <div className="entry-text">Learn how to swap, provide liquidity, and earn. For users who want to do more with DeFi.</div>
            </a>
            <a href="https://docs.curve.fi/documentation-overview/" className="entry-card">
              <div className="entry-label">BUILD WITH IT</div>
              <div className="entry-desc">Technical Docs</div>
              <div className="entry-text">Integrate, compose, and extend Curve. For developers and protocol architects.</div>
            </a>
            <a href="/asset-issuer/overview/why-curve" className="entry-card">
              <div className="entry-label">SUPERCHARGE IT</div>
              <div className="entry-desc">Asset Issuers</div>
              <div className="entry-text">Deploy pools, add gauges, and incentivize liquidity. For projects and DAOs.</div>
            </a>
          </div>
        </section>

        {/* Curve Stack / Ecosystem Map (placeholder) */}
        <section className="ecosystem-section">
          <div className="ecosystem-title">THE CURVE STACK</div>
          <div className="ecosystem-map">
            <pre className="ecosystem-ascii">
{`[AMM]---[crvUSD]---[LLAMMA]
   |         |         |
[veCRV]--[Gauges]--[DAO]`}
            </pre>
            <div className="ecosystem-legend">
              <span>[AMM]</span> Automated Market Maker | <span>[crvUSD]</span> Native Stablecoin | <span>[LLAMMA]</span> Lending & Liquidation | <span>[veCRV]</span> Voting Escrow | <span>[Gauges]</span> Incentive Mechanism | <span>[DAO]</span> Governance
            </div>
          </div>
        </section>

        {/* What Makes Curve Different */}
        <section className="differentiators-section">
          <div className="differentiators-grid">
            <div className="diff-card"><b>We don't chase trends.</b> We set standards.</div>
            <div className="diff-card"><b>Composability isn't a buzzword.</b> It's a requirement.</div>
            <div className="diff-card"><b>Governance isn't a checkbox.</b> It's the protocol.</div>
            <div className="diff-card"><b>Minimalism is a feature.</b> Not a lack of vision.</div>
            <div className="diff-card"><b>Curve is infrastructure.</b> Not a product.</div>
          </div>
        </section>

        {/* Real On-Chain Impact (reuse HomepageStats) */}
        <section className="stats-section">
          <div className="stats-title">REAL ON-CHAIN IMPACT</div>
          <HomepageStats />
        </section>

        {/* DAO-First Section (placeholder) */}
        <section className="dao-section">
          <div className="dao-title">DAO-FIRST</div>
          <div className="dao-desc">
            Curve is governed by its community. See recent proposals and participate in governance:
            <a href="https://gov.curve.fi/" target="_blank" rel="noopener noreferrer" className="dao-link">Forum</a>
            <a href="https://dao.curve.fi/" target="_blank" rel="noopener noreferrer" className="dao-link">Governance UI</a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
