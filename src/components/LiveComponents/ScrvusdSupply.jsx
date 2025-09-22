import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/formatters'; // Adjust path if needed

import CrvusdLogo from '@site/static/img/logos/crvUSD_xs.png';
import ScrvusdLogo from '@site/static/img/logos/scrvUSD_xs.png';


// --- API Configuration ---
const MARKETS_API_URL = 'https://prices.curve.finance/v1/crvusd/markets?fetch_on_chain=false';
const PEGKEEPERS_API_URL = 'https://prices.curve.finance/v1/crvusd/pegkeepers/ethereum';

const ScrvusdSupply = () => {
  const [supplyData, setSupplyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScrvusdData = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- Step 1: Fetch and calculate the total crvUSD supply ---
        const [marketsRes, pegkeepersRes] = await Promise.all([
          fetch(MARKETS_API_URL),
          fetch(PEGKEEPERS_API_URL),
        ]);

        if (!marketsRes.ok || !pegkeepersRes.ok) {
          throw new Error('Failed to fetch base crvUSD supply data.');
        }

        const marketsData = await marketsRes.json();
        const pegkeepersData = await pegkeepersRes.json();
        
        const borrowed = marketsData.chains.ethereum.data.reduce((acc, market) => acc + market.total_debt, 0);
        const crvusdTotalSupply = borrowed;


        // --- Step 2: Fetch the savings/yield data ---
        const endTime = Math.floor(Date.now() / 1000);
        const startTime = endTime - (86400 * 7); // 7 days ago
        const savingsApiUrl = `https://prices.curve.finance/v1/crvusd/savings/yield?agg_number=1&agg_units=hour&start=${startTime}&end=${endTime}`;

        const savingsRes = await fetch(savingsApiUrl);
        if (!savingsRes.ok) {
          throw new Error('Failed to fetch scrvUSD savings data.');
        }
        const savingsData = await savingsRes.json();
        
        if (!savingsData.data || savingsData.data.length === 0) {
            throw new Error('No scrvUSD savings data returned from the API.');
        }

        // --- Step 3: Get the latest data point and calculate metrics ---
        const latestData = savingsData.data[savingsData.data.length - 1];

        const totalStaked = latestData.assets;
        const scrvusdTotalSupply = latestData.supply;
        const stakedRatio = crvusdTotalSupply > 0 ? (totalStaked / crvusdTotalSupply) * 100 : 0;
        const yieldApy = latestData.proj_apy;
        const price = latestData.price;
        const lastUpdated = new Date();

        setSupplyData({
          crvusdTotalSupply,
          totalStaked,
          scrvusdTotalSupply,
          stakedRatio,
          yieldApy,
          price,
          lastUpdated,
        });

      } catch (err) {
        console.error("Failed to fetch scrvUSD data:", err);
        // Always set the error state on failure
        setError("Could not retrieve scrvUSD supply data.");
      } finally {
        setLoading(false);
      }
    };

    fetchScrvusdData();
  }, []);

  if (loading) return <div>Loading scrvUSD Data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
    <table className="metric-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> Total crvUSD borrowed</td>
          <td>{formatNumber(supplyData?.crvusdTotalSupply, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> Total Staked crvUSD</td>
          <td>{formatNumber(supplyData?.totalStaked, 3)} <span style={{ color: 'var(--ifm-color-emphasis-600)', fontWeight: 'normal'}}>
  ({formatNumber(supplyData?.stakedRatio, 3)}%)
</span></td>
        </tr>
        <tr>
          <td><img src={ScrvusdLogo} className="subheading-inline-logo" alt="scrvUSD" /> Total scrvUSD Supply</td>
          <td>{formatNumber(supplyData?.scrvusdTotalSupply, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> crvUSD per <img src={ScrvusdLogo} className="subheading-inline-logo" alt="scrvUSD" /> scrvUSD</td>
          <td>{formatNumber(supplyData?.price, 5)}</td>
        </tr>
        <tr>
          <td><img src={ScrvusdLogo} className="subheading-inline-logo" alt="scrvUSD" /> scrvUSD Yield (APY)</td>
          <td>{formatNumber(supplyData?.yieldApy, 3)}%</td>
        </tr>
      </tbody>
    </table>
    <div style={{ 
      fontSize: '0.8rem', 
      color: 'var(--ifm-color-emphasis-600)',
      fontStyle: 'italic',
      textAlign: 'center',
      marginBottom: '1.5rem'
    }}>
      Last updated: {supplyData?.lastUpdated?.toLocaleString()}
    </div>
    </div>
  );
};

export default ScrvusdSupply;