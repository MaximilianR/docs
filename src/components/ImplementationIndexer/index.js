import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ethers } from 'ethers';
import deployments from '@site/static/deployments.json';

const MULTICALL3 = '0xcA11bde05977b3631167028862bE2a173976CA11';
const MULTICALL3_ABI = [
  'function aggregate3((address target, bool allowFailure, bytes callData)[] calls) view returns ((bool success, bytes returnData)[])',
];

const BATCH_SIZE = 300;
const CACHE_KEY_PREFIX = 'curve-impl-indexer-';

// Free public RPCs per chain
const PUBLIC_RPCS = {
  ethereum: 'https://ethereum-rpc.publicnode.com',
  arbitrum: 'https://arbitrum-one-rpc.publicnode.com',
  optimism: 'https://optimism-rpc.publicnode.com',
  polygon: 'https://polygon-bor-rpc.publicnode.com',
  avalanche: 'https://avalanche-c-chain-rpc.publicnode.com',
  base: 'https://base-rpc.publicnode.com',
  gnosis: 'https://gnosis-rpc.publicnode.com',
  fantom: 'https://fantom-rpc.publicnode.com',
  bsc: 'https://bsc-rpc.publicnode.com',
  fraxtal: 'https://rpc.frax.com',
  mantle: 'https://rpc.mantle.xyz',
  celo: 'https://forno.celo.org',
  moonbeam: 'https://rpc.api.moonbeam.network',
  kava: 'https://evm.kava.io',
  aurora: 'https://mainnet.aurora.dev',
  taiko: 'https://rpc.taiko.xyz',
  sonic: 'https://rpc.soniclabs.com',
  'x-layer': 'https://rpc.xlayer.tech',
  corn: 'https://rpc.ankr.com/corn_maizenet',
  ink: 'https://rpc-gel.inkonchain.com',
  unichain: 'https://mainnet.unichain.org',
  hyperliquid: 'https://rpc.hyperliquid.xyz/evm',
  etherlink: 'https://node.mainnet.etherlink.com',
  plume: 'https://rpc.plume.org',
  stable: 'https://free.rpc.fastsync.io',
  monad: 'https://monad-mainnet.g.alchemy.com/public',
  tac: 'https://turin.rpc.tac.build',
  xdc: 'https://erpc.xinfin.network',
  plasma: 'https://evm-rpc.planq.network',
};

const CHAIN_IDS = {
  ethereum: 1, arbitrum: 42161, optimism: 10, polygon: 137,
  avalanche: 43114, base: 8453, gnosis: 100, fantom: 250,
  bsc: 56, fraxtal: 252, mantle: 5000, celo: 42220,
  moonbeam: 1284, kava: 2222, aurora: 1313161554, taiko: 167000,
  sonic: 146, 'x-layer': 196, corn: 21000000, ink: 57073,
  unichain: 130, hyperliquid: 998, etherlink: 42793, plume: 98866,
  stable: 101010, monad: 10143, tac: 2390, xdc: 50, plasma: 7765,
};

const AMM_TYPE_CONFIG = {
  'stableswap-ng': {
    label: 'Stableswap-NG',
    deploymentKey: 'stableswap',
    poolCountSig: 'function pool_count() view returns (uint256)',
    poolListSig: 'function pool_list(uint256) view returns (address)',
    getImplSig: 'function get_implementation_address(address) view returns (address)',
    isMetaSig: 'function is_meta(address) view returns (bool)',
    hasPoolType: true,
    hasPerPoolImpl: true,
    currentImplSigs: [
      'function pool_implementations(uint256) view returns (address)',
      'function metapool_implementations(uint256) view returns (address)',
    ],
    currentImplScans: [
      { method: 'pool_implementations', type: 'plain' },
      { method: 'metapool_implementations', type: 'meta' },
    ],
    // Known removed implementations (Ethereum mainnet, pools #0–#28)
    knownRemovedImpls: new Set([
      '0x3e3b5f27bbf5cc967e074b70e9f4046e31663181', // plain v1, pools #0–#6
      '0x64afa95e0c3d8410240a4262df9fd82b12b64edd', // meta v1, pools #5–#8
      '0x933f4769dcc27fc7345d9d5975ae48ec4d0f829c', // plain v2, pools #7–#28
      '0x1f7c86affe5bcf7a1d74a8c8e2ef9e03bf31c1bd', // meta v2, pool #10
      '0xdd7ebb1c49780519dd9755b8b1a23a6f42ce099e', // meta v3, pools #13–#26
    ]),
    infraGetters: [
      { label: 'Math', method: 'math_implementation' },
      { label: 'Views', method: 'views_implementation' },
      { label: 'Gauge', method: 'gauge_implementation' },
    ],
  },
  'twocrypto-ng': {
    label: 'Twocrypto-NG',
    deploymentKey: 'twocrypto',
    poolCountSig: 'function pool_count() view returns (uint256)',
    poolListSig: 'function pool_list(uint256) view returns (address)',
    hasPoolType: false,
    hasPerPoolImpl: false,
    currentImplSigs: [
      'function pool_implementations(uint256) view returns (address)',
    ],
    currentImplScans: [
      { method: 'pool_implementations', type: 'plain' },
    ],
    infraGetters: [
      { label: 'Math', method: 'math_implementation' },
      { label: 'Views', method: 'views_implementation' },
      { label: 'Gauge', method: 'gauge_implementation' },
    ],
  },
  'tricrypto-ng': {
    label: 'Tricrypto-NG',
    deploymentKey: 'tricrypto',
    poolCountSig: 'function pool_count() view returns (uint256)',
    poolListSig: 'function pool_list(uint256) view returns (address)',
    hasPoolType: false,
    hasPerPoolImpl: false,
    currentImplSigs: [
      'function pool_implementations(uint256) view returns (address)',
    ],
    currentImplScans: [
      { method: 'pool_implementations', type: 'plain' },
    ],
    infraGetters: [
      { label: 'Math', method: 'math_implementation' },
      { label: 'Views', method: 'views_implementation' },
      { label: 'Gauge', method: 'gauge_implementation' },
    ],
  },
};

async function multicallBatch(provider, calls) {
  const multicall = new ethers.Contract(MULTICALL3, MULTICALL3_ABI, provider);
  const results = [];
  for (let i = 0; i < calls.length; i += BATCH_SIZE) {
    const batch = calls.slice(i, i + BATCH_SIZE);
    const aggregate = batch.map((c) => ({
      target: c.target,
      allowFailure: true,
      callData: c.callData,
    }));
    const res = await multicall.aggregate3(aggregate);
    results.push(...res);
  }
  return results;
}

function loadCache(ammType, chain) {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${ammType}-${chain}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCache(ammType, chain, data) {
  try {
    localStorage.setItem(`${CACHE_KEY_PREFIX}${ammType}-${chain}`, JSON.stringify(data));
  } catch {}
}

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatChainName(chain) {
  return chain.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// --- Chain logo (same pattern as DeploymentFilter) ---
const LOGO_EXTS = ['png', 'svg', 'webp'];

function ChainLogo({ chain, size = 18 }) {
  const slug = toSlug(chain);
  const imgRef = useRef(null);
  const idxRef = useRef(0);

  const handleError = () => {
    idxRef.current += 1;
    if (idxRef.current < LOGO_EXTS.length) {
      if (imgRef.current) imgRef.current.src = `/img/chains/${slug}.${LOGO_EXTS[idxRef.current]}`;
    } else {
      if (imgRef.current) imgRef.current.style.display = 'none';
    }
  };

  return (
    <img
      ref={imgRef}
      src={`/img/chains/${slug}.${LOGO_EXTS[0]}`}
      alt=""
      onError={handleError}
      style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0 }}
    />
  );
}

// --- Custom chain dropdown ---
function ChainDropdown({ chains, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.6rem',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 'var(--ifm-global-radius)',
          background: 'var(--ifm-background-color)',
          color: 'var(--ifm-color-content)',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
      >
        <ChainLogo chain={value} />
        <span>{formatChainName(value)}</span>
        <span style={{
          marginLeft: '0.2rem',
          fontSize: '0.65rem',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>
          ▼
        </span>
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '0.25rem',
          background: 'var(--ifm-background-color)',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 'var(--ifm-global-radius)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          zIndex: 1000,
          maxHeight: 280,
          overflowY: 'auto',
          minWidth: 180,
        }}>
          {chains.map((c) => (
            <div
              key={c}
              onClick={() => { onChange(c); setOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.7rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                background: c === value ? 'var(--ifm-color-emphasis-100)' : 'transparent',
                fontWeight: c === value ? 600 : 400,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ifm-color-emphasis-100)'; }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = c === value ? 'var(--ifm-color-emphasis-100)' : 'transparent';
              }}
            >
              <ChainLogo chain={c} size={16} />
              <span>{formatChainName(c)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main component ---
export default function ImplementationIndexer({ ammType = 'stableswap-ng' }) {
  const typeConfig = AMM_TYPE_CONFIG[ammType];
  if (!typeConfig) return <div>Unknown AMM type: {ammType}</div>;

  const availableChains = useMemo(() => {
    const chains = [];
    for (const chain of Object.keys(deployments)) {
      if (chain.startsWith('_')) continue;
      const chainData = deployments[chain];
      if (!chainData?.amm) continue;
      const ammData = chainData.amm[typeConfig.deploymentKey];
      if (!ammData?.factory) continue;
      if (!PUBLIC_RPCS[chain]) continue;
      chains.push(chain);
    }
    return chains;
  }, [ammType]);

  const [chain, setChain] = useState('ethereum');
  const [customRpc, setCustomRpc] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');

  useEffect(() => {
    const cached = loadCache(ammType, chain);
    if (cached) setData(cached);
    else setData(null);
  }, [ammType, chain]);

  const chainDeployment = useMemo(() => {
    const chainData = deployments[chain];
    if (!chainData?.amm) return null;
    return chainData.amm[typeConfig.deploymentKey] || null;
  }, [chain, ammType]);

  const explorerBase = useMemo(() => {
    return deployments._explorers?.[chain] || 'https://etherscan.io/address/';
  }, [chain]);

  const explorerUrl = useCallback((addr) => `${explorerBase}${addr}`, [explorerBase]);
  const shortAddr = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const fetchData = useCallback(async () => {
    if (!chainDeployment?.factory) return;
    setLoading(true);
    setError(null);
    setProgress('Connecting...');

    try {
      const rpcUrl = customRpc.trim() || PUBLIC_RPCS[chain];
      const chainId = CHAIN_IDS[chain] || 1;
      const provider = new ethers.JsonRpcProvider(rpcUrl, chainId, { staticNetwork: true });
      const factory = chainDeployment.factory;

      const infraSigs = (typeConfig.infraGetters || []).map(
        (g) => `function ${g.method}() view returns (address)`
      );
      const factoryIface = new ethers.Interface([
        typeConfig.poolCountSig, typeConfig.poolListSig, typeConfig.getImplSig,
        ...(typeConfig.isMetaSig ? [typeConfig.isMetaSig] : []),
        ...(typeConfig.currentImplSigs || []),
        ...infraSigs,
      ]);

      const factoryContract = new ethers.Contract(factory, factoryIface, provider);
      const poolCount = Number(await factoryContract.pool_count());

      // Fetch infrastructure contracts from factory
      const infraContracts = [{ label: 'Factory', address: factory }];
      for (const getter of (typeConfig.infraGetters || [])) {
        try {
          const addr = await factoryContract[getter.method]();
          if (addr && addr !== ethers.ZeroAddress) {
            infraContracts.push({ label: getter.label, address: addr });
          }
        } catch {}
      }

      // Scan indices 0–9 for active implementations
      const currentImplSet = new Set();
      const currentImplIndex = {}; // addr (lowercase) -> factory index
      if (typeConfig.currentImplScans) {
        const scanCalls = [];
        const scanMeta = [];
        for (const scan of typeConfig.currentImplScans) {
          for (let idx = 0; idx < 10; idx++) {
            scanCalls.push({ target: factory, callData: factoryIface.encodeFunctionData(scan.method, [idx]) });
            scanMeta.push({ type: scan.type, idx });
          }
        }
        const scanResults = await multicallBatch(provider, scanCalls);
        scanResults.forEach((r, i) => {
          if (!r.success) return;
          try {
            const addr = factoryIface.decodeFunctionResult(
              typeConfig.currentImplScans[Math.floor(i / 10)].method, r.returnData
            )[0];
            if (addr !== ethers.ZeroAddress) {
              const addrLower = addr.toLowerCase();
              currentImplSet.add(addrLower);
              currentImplIndex[addrLower] = scanMeta[i].idx;
            }
          } catch {}
        });
      }

      let sorted, allEntries, pools;

      if (typeConfig.hasPerPoolImpl) {
        // --- Per-pool implementation scan (stableswap-ng) ---
        const cached = loadCache(ammType, chain);
        const startFrom = cached ? cached.poolCount : 0;
        pools = cached?.pools || [];

        if (poolCount > startFrom) {
          setProgress(`Fetching ${poolCount - startFrom} new pools (${startFrom} cached)...`);
          const poolListCalls = [];
          for (let i = startFrom; i < poolCount; i++) {
            poolListCalls.push({ target: factory, callData: factoryIface.encodeFunctionData('pool_list', [i]) });
          }
          const poolListResults = await multicallBatch(provider, poolListCalls);
          const newPools = poolListResults.map((r) => {
            if (!r.success) return null;
            return factoryIface.decodeFunctionResult('pool_list', r.returnData)[0];
          }).filter(Boolean);

          pools = startFrom === 0 ? newPools : [...pools, ...newPools];

          setProgress(`Fetching implementations...`);
          const newSlice = pools.slice(startFrom);
          const implCalls = newSlice.map((p) => ({ target: factory, callData: factoryIface.encodeFunctionData('get_implementation_address', [p]) }));
          let metaCalls = [];
          if (typeConfig.hasPoolType && typeConfig.isMetaSig) {
            metaCalls = newSlice.map((p) => ({ target: factory, callData: factoryIface.encodeFunctionData('is_meta', [p]) }));
          }
          const allResults = await multicallBatch(provider, [...implCalls, ...metaCalls]);
          const implResults = allResults.slice(0, newSlice.length);
          const metaResults = typeConfig.hasPoolType ? allResults.slice(newSlice.length) : [];

          var newEntries = newSlice.map((pool, idx) => {
            if (!implResults[idx].success) return null;
            const impl = factoryIface.decodeFunctionResult('get_implementation_address', implResults[idx].returnData)[0];
            let poolType = 'plain';
            if (typeConfig.hasPoolType && metaResults[idx]?.success) {
              poolType = factoryIface.decodeFunctionResult('is_meta', metaResults[idx].returnData)[0] ? 'meta' : 'plain';
            }
            return { address: pool, implementation: impl, poolType, index: startFrom + idx };
          }).filter(Boolean);
          allEntries = [...(cached?.entries || []), ...newEntries];
        } else {
          setProgress('Checking current implementations...');
          allEntries = cached?.entries || [];
        }

        // Group by implementation
        const implMap = {};
        allEntries.forEach((entry) => {
          const key = `${entry.implementation}-${entry.poolType}`;
          if (!implMap[key]) {
            implMap[key] = { implementation: entry.implementation, poolType: entry.poolType, pools: [], firstIndex: entry.index, lastIndex: entry.index };
          }
          implMap[key].pools.push({ index: entry.index, address: entry.address });
          if (entry.index < implMap[key].firstIndex) implMap[key].firstIndex = entry.index;
          if (entry.index > implMap[key].lastIndex) implMap[key].lastIndex = entry.index;
        });

        sorted = Object.values(implMap).sort((a, b) => a.firstIndex - b.firstIndex);

        // Determine status: hardcoded removed > factory scan > unknown
        const knownRemoved = typeConfig.knownRemovedImpls || new Set();
        sorted.forEach((impl) => {
          const addrLower = impl.implementation.toLowerCase();
          if (knownRemoved.has(addrLower)) {
            impl.status = 'removed';
            impl.factoryIndex = null;
          } else if (currentImplSet.has(addrLower)) {
            impl.status = 'current';
            impl.factoryIndex = currentImplIndex[addrLower] ?? null;
          } else {
            impl.status = 'unknown';
            impl.factoryIndex = null;
          }
        });
      } else {
        // --- Factory-only scan (twocrypto-ng, tricrypto-ng) ---
        // No per-pool implementation getter — just show what the factory has at indices 0–9
        pools = [];
        allEntries = [];
        sorted = [...currentImplSet].map((addrLower) => ({
          implementation: addrLower,
          poolType: 'plain',
          pools: [],
          status: 'current',
          factoryIndex: currentImplIndex[addrLower] ?? null,
        }));
      }

      const result = {
        factory, poolCount, fetchedAt: new Date().toISOString(),
        implementations: sorted, currentImplSet: [...currentImplSet],
        infraContracts, pools, entries: allEntries,
        hasPerPoolImpl: !!typeConfig.hasPerPoolImpl,
      };
      setData(result);
      saveCache(ammType, chain, result);
      setProgress('');
    } catch (err) {
      setError(err.message);
      setProgress('');
    } finally {
      setLoading(false);
    }
  }, [ammType, chain, chainDeployment, customRpc]);

  // --- Render ---
  const mono = { fontFamily: 'var(--ifm-font-family-monospace)', fontSize: '0.8rem' };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <ChainDropdown chains={availableChains} value={chain} onChange={setChain} />
        <input
          type="text"
          value={customRpc}
          onChange={(e) => setCustomRpc(e.target.value)}
          placeholder={PUBLIC_RPCS[chain] ? 'Custom RPC (optional)' : 'RPC URL (required)'}
          style={{
            padding: '0.3rem 0.5rem',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: 'var(--ifm-global-radius)',
            background: 'var(--ifm-background-color)',
            color: 'var(--ifm-color-content)',
            fontSize: '0.85rem',
            width: '200px',
            fontFamily: 'var(--ifm-font-family-monospace)',
          }}
        />
        <button
          onClick={fetchData}
          disabled={loading || !chainDeployment?.factory}
          className="button button--primary button--sm"
          title="Fetches infrastructure contracts (Math, Views, Gauge) and scans all deployed pools to discover which implementation each one uses. Results are cached in your browser."
        >
          {loading ? 'Fetching...' : data ? 'Refresh' : 'Fetch Contracts & Implementations'}
        </button>
        {progress && (
          <span style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)' }}>{progress}</span>
        )}
        {!loading && data && (() => {
          const ageMs = Date.now() - new Date(data.fetchedAt).getTime();
          const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
          const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
          const isStale = ageDays >= 7;
          const ageText = ageDays > 0 ? `${ageDays}d ago` : ageHours > 0 ? `${ageHours}h ago` : 'just now';
          return (
            <span style={{ fontSize: '0.8rem', color: isStale ? 'var(--ifm-color-warning-darkest)' : 'var(--ifm-color-emphasis-500)' }}>
              {isStale && '\u26A0 '}Updated {ageText}{isStale && ' — click Refresh'}
            </span>
          );
        })()}
      </div>

      {error && (
        <div className="admonition admonition-danger" style={{ marginBottom: '0.75rem' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {/* Two-column layout: infra contracts + pool implementations */}
      <div style={{ display: 'grid', gridTemplateColumns: data ? '1fr 2fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Infrastructure contracts (fetched from factory) */}
        {data?.infraContracts && (
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--ifm-color-emphasis-700)' }}>
              Contracts
            </p>
            <table style={{ width: '100%', marginBottom: 0 }}>
              <tbody>
                {data.infraContracts.map(({ label, address }) => (
                  <tr key={label}>
                    <td style={{ whiteSpace: 'nowrap' }}>{label}</td>
                    <td>
                      <a href={explorerUrl(address)} target="_blank" rel="noopener noreferrer" style={mono}>
                        {shortAddr(address)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pool implementations */}
        {data && (
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--ifm-color-emphasis-700)' }}>
              Pool Implementations
              <span style={{ fontWeight: 400, color: 'var(--ifm-color-emphasis-500)', marginLeft: '0.5rem' }}>
                {data.poolCount} pools from{' '}
                <a href={explorerUrl(data.factory)} target="_blank" rel="noopener noreferrer">Factory</a>
              </span>
            </p>
            <table style={{ width: '100%', marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Implementation</th>
                  {typeConfig.hasPoolType && <th>Type</th>}
                  {data.hasPerPoolImpl && <th>Pools</th>}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.implementations.map((impl, i) => (
                  <tr key={i} style={impl.status === 'current' ? {} : { opacity: 0.4 }}>
                    <td style={mono}>{impl.factoryIndex != null ? impl.factoryIndex : ''}</td>
                    <td>
                      <a href={explorerUrl(impl.implementation)} target="_blank" rel="noopener noreferrer" style={mono}>
                        {shortAddr(impl.implementation)}
                      </a>
                    </td>
                    {typeConfig.hasPoolType && (
                      <td><code>{impl.poolType}</code></td>
                    )}
                    {data.hasPerPoolImpl && <td>{impl.pools.length}</td>}
                    <td>
                      {impl.status === 'current' && (
                        <span style={{ color: 'var(--ifm-color-success-darkest)', fontWeight: 600 }}>current</span>
                      )}
                      {impl.status === 'removed' && (
                        <span style={{ color: 'var(--ifm-color-emphasis-500)' }}>removed</span>
                      )}
                      {impl.status === 'unknown' && (
                        <span style={{ color: 'var(--ifm-color-warning-darkest)', fontWeight: 600 }}
                              title="This implementation was found on deployed pools but is not at factory indices 0–9 and not in the known-removed list">
                          unknown index
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.hasPerPoolImpl && data.entries.length > 0 && (
              <p style={{ marginTop: '0.3rem', fontSize: '0.85rem', marginBottom: 0 }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const json = {};
                    data.entries.forEach((entry) => {
                      json[entry.address] = {
                        index: entry.index, implementation: entry.implementation,
                        ...(typeConfig.hasPoolType ? { type: entry.poolType } : {}),
                      };
                    });
                    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
                    window.open(URL.createObjectURL(blob), '_blank');
                  }}
                >
                  View full pool mapping as JSON
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
