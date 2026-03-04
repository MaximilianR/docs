import React, { useState, useEffect } from 'react';

// --- Configuration ---
const MARKETS_API_URL = 'https://prices.curve.finance/v1/crvusd/markets?fetch_on_chain=false';
const RPC_URL = 'https://eth.llamarpc.com';
const MULTICALL3 = '0xcA11bde05977b3631167028862bE2a173976CA11';

// monetary_policy() selector = keccak256("monetary_policy()")[:4]
const MONETARY_POLICY_SELECTOR = '0x7a28fb88';

// Known monetary policy addresses -> labels + doc links
const KNOWN_POLICIES = {
  '0xc684432fd6322c6d58b6bc5d28b18569aa0ad0a1': {
    label: 'AggMonetaryPolicy',
    link: '/developer/crvusd/monetary-policy/monetary-policy',
  },
  '0x07491d124ddb3ef59a8938fcb3ee50f9fa0b9251': {
    label: 'AggMonetaryPolicy (v4)',
    link: '/developer/crvusd/monetary-policy/agg-monetary-policy-v4',
  },
};

// Etherscan base URL
const ETHERSCAN_BASE = 'https://etherscan.io/address/';

// Helper: encode multicall3 aggregate3 call
function encodeAggregate3(calls) {
  // aggregate3((address,bool,bytes)[]) -> selector 0x82ad56cb
  // Each call: (target, allowFailure, callData)
  const abiCoder = {
    encodeCall(target, allowFailure, callData) {
      const targetBytes = target.slice(2).toLowerCase().padStart(64, '0');
      const allowFailureBytes = (allowFailure ? '1' : '0').padStart(64, '0');
      // callData offset, length, data
      return { targetBytes, allowFailureBytes, callData: callData.slice(2) };
    }
  };

  // We'll use raw JSON-RPC with eth_call and hand-encode the multicall
  // Actually, let's just do individual calls batched in a single JSON-RPC batch
  return calls;
}

// Batch JSON-RPC calls
async function batchRpcCalls(calls) {
  const batch = calls.map((call, i) => ({
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [{ to: call.to, data: call.data }, 'latest'],
    id: i + 1,
  }));

  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(batch),
  });

  const results = await response.json();
  // Sort by id to maintain order
  results.sort((a, b) => a.id - b.id);
  return results.map(r => r.result || null);
}

// Extract address from a 32-byte padded hex result
function decodeAddress(hex) {
  if (!hex || hex === '0x') return null;
  return '0x' + hex.slice(26).toLowerCase();
}

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

        // 2. Batch RPC calls to get monetary_policy() for each controller
        const calls = markets.map(m => ({
          to: m.address,
          data: MONETARY_POLICY_SELECTOR,
        }));

        const results = await batchRpcCalls(calls);

        // 3. Build table data
        const rows = markets.map((m, i) => {
          const policyAddress = decodeAddress(results[i]);
          const policyKey = policyAddress?.toLowerCase();
          const knownPolicy = policyKey ? KNOWN_POLICIES[policyKey] : null;

          return {
            collateral: m.collateral_token?.symbol || 'Unknown',
            controllerAddress: m.address,
            policyAddress,
            policyLabel: knownPolicy?.label || null,
            policyLink: knownPolicy?.link || null,
          };
        });

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

  // Group rows by policy
  const policyGroups = {};
  data.rows.forEach(row => {
    const key = row.policyAddress?.toLowerCase() || 'unknown';
    if (!policyGroups[key]) {
      policyGroups[key] = {
        address: row.policyAddress,
        label: row.policyLabel,
        link: row.policyLink,
        markets: [],
      };
    }
    policyGroups[key].markets.push(row);
  });

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
            <tr key={i}>
              <td><strong>{row.collateral}</strong></td>
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
