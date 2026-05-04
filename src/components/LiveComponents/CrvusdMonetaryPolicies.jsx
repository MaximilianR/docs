import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// --- Configuration ---
const MARKETS_API_URL = 'https://prices.curve.finance/v1/crvusd/markets?fetch_on_chain=false';
const RPC_URL = 'https://ethereum-rpc.publicnode.com/';
const MULTICALL3 = '0xcA11bde05977b3631167028862bE2a173976CA11';
const MULTICALL3_ABI = [
  'function aggregate3((address target, bool allowFailure, bytes callData)[] calls) view returns ((bool success, bytes returnData)[])',
];
const CONTROLLER_ABI = ['function monetary_policy() view returns (address)'];

// Known monetary policy addresses -> labels + doc links
const KNOWN_POLICIES = {
  '0xc684432fd6322c6d58b6bc5d28b18569aa0ad0a1': {
    label: 'AggMonetaryPolicy',
    link: '/developer/crvusd/monetary-policy/',
  },
  '0x07491d124ddb3ef59a8938fcb3ee50f9fa0b9251': {
    label: 'AggMonetaryPolicy (v4)',
    link: '/developer/crvusd/monetary-policy/agg-monetary-policy-v4',
  },
};

// Deprecated controller addresses (sorted to bottom, shown with label)
const DEPRECATED_CONTROLLERS = new Set([
  '0x8472a9a7632b173c8cf3a86d3afec50c35548e76',
  '0x8aca5a776a878ea1f8967e70a23b8563008f58ef',
]);

// Etherscan base URL
const ETHERSCAN_BASE = 'https://etherscan.io/address/';

const CrvusdMonetaryPolicies = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch markets from API
        const marketsRes = await fetch(MARKETS_API_URL);
        if (!marketsRes.ok) throw new Error('Failed to fetch market data.');
        const marketsJson = await marketsRes.json();

        const markets = marketsJson?.chains?.ethereum?.data || [];
        if (markets.length === 0) throw new Error('No markets found.');

        // 2. Use multicall3 to batch monetary_policy() calls
        const provider = new ethers.JsonRpcProvider(RPC_URL, 1, { staticNetwork: true });
        const multicall = new ethers.Contract(MULTICALL3, MULTICALL3_ABI, provider);
        const iface = new ethers.Interface(CONTROLLER_ABI);
        const callData = iface.encodeFunctionData('monetary_policy');

        const aggregate = markets.map(m => ({
          target: m.address,
          allowFailure: true,
          callData,
        }));

        const results = await multicall.aggregate3(aggregate);

        // 3. Build table data
        const rows = markets.map((m, i) => {
          let policyAddress = null;
          if (results[i].success) {
            try {
              const decoded = iface.decodeFunctionResult('monetary_policy', results[i].returnData);
              policyAddress = decoded[0].toLowerCase();
            } catch (e) {
              // skip
            }
          }

          const knownPolicy = policyAddress ? KNOWN_POLICIES[policyAddress] : null;

          return {
            collateral: m.collateral_token?.symbol || 'Unknown',
            controllerAddress: m.address,
            policyAddress,
            policyLabel: knownPolicy?.label || null,
            policyLink: knownPolicy?.link || null,
            deprecated: DEPRECATED_CONTROLLERS.has(m.address.toLowerCase()),
          };
        });

        // Sort: active markets first, deprecated at bottom
        rows.sort((a, b) => (a.deprecated === b.deprecated ? 0 : a.deprecated ? 1 : -1));

        setData({
          rows,
          fetchedAt: new Date(),
        });
      } catch (err) {
        console.error('CrvusdMonetaryPolicies error:', err);
        setError('Could not retrieve data. An adblocker may be blocking the RPC call.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '1rem', color: 'var(--ifm-color-emphasis-600)' }}>
        Loading market data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', color: 'var(--ifm-color-danger)' }}>
        {error}
      </div>
    );
  }

  if (!data) return null;

  const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—';

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Collateral</th>
            <th>Controller</th>
            <th>Monetary Policy</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} style={row.deprecated ? { opacity: 0.55 } : undefined}>
              <td>
                <strong>{row.collateral}</strong>
                {row.deprecated && (
                  <span style={{ marginLeft: '0.4em', fontSize: '0.75em', color: 'var(--ifm-color-emphasis-600)', fontWeight: 'normal' }}>
                    (deprecated)
                  </span>
                )}
              </td>
              <td>
                <a href={`${ETHERSCAN_BASE}${row.controllerAddress}`} target="_blank" rel="noopener noreferrer">
                  <code>{truncate(row.controllerAddress)}</code>
                </a>
              </td>
              <td>
                {row.policyAddress ? (
                  <a href={`${ETHERSCAN_BASE}${row.policyAddress}`} target="_blank" rel="noopener noreferrer">
                    <code>{truncate(row.policyAddress)}</code>
                  </a>
                ) : '—'}
              </td>
              <td>
                {row.policyLink ? (
                  <a href={row.policyLink}>{row.policyLabel}</a>
                ) : (
                  row.policyLabel || <em>Unknown</em>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        Data fetched live from on-chain at {data.fetchedAt.toLocaleTimeString()}.
      </p>
    </div>
  );
};

export default CrvusdMonetaryPolicies;
