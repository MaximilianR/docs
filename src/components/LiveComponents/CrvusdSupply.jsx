import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/formatters'; // Make sure the path is correct

import CrvusdLogo from '@site/static/img/logos/crvUSD_xs.png';

// --- API Configuration ---
const MARKETS_API_URL = 'https://prices.curve.finance/v1/crvusd/markets?fetch_on_chain=false';
const PEGKEEPERS_API_URL = 'https://prices.curve.finance/v1/crvusd/pegkeepers/ethereum';
const PRICE_API_URL = 'https://prices.curve.finance/v1/usd_price/ethereum/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E';

const CrvusdSupply = () => {
  const [supplyData, setSupplyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrvusdData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch data with CORS proxy for development
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const isDevelopment = window.location.hostname === 'localhost';
        
        const marketsUrl = isDevelopment ? `${corsProxy}${MARKETS_API_URL}` : MARKETS_API_URL;
        const pegkeepersUrl = isDevelopment ? `${corsProxy}${PEGKEEPERS_API_URL}` : PEGKEEPERS_API_URL;
        const priceUrl = isDevelopment ? `${corsProxy}${PRICE_API_URL}` : PRICE_API_URL;

        // Fetch all data points concurrently
        const [marketsRes, pegkeepersRes, priceRes] = await Promise.all([
          fetch(marketsUrl, {
            headers: isDevelopment ? {
              'X-Requested-With': 'XMLHttpRequest'
            } : {}
          }),
          fetch(pegkeepersUrl, {
            headers: isDevelopment ? {
              'X-Requested-With': 'XMLHttpRequest'
            } : {}
          }),
          fetch(priceUrl, {
            headers: isDevelopment ? {
              'X-Requested-With': 'XMLHttpRequest'
            } : {}
          }),
        ]);

        if (!marketsRes.ok || !pegkeepersRes.ok || !priceRes.ok) {
          throw new Error('Failed to fetch data from one or more API endpoints.');
        }

        const marketsData = await marketsRes.json();
        const pegkeepersData = await pegkeepersRes.json();
        const priceData = await priceRes.json();

        // 1. Calculate total borrowed crvUSD
        const borrowed = marketsData.chains.ethereum.data.reduce(
          (acc, market) => acc + market.total_debt,
          0
        );

        // 2. Calculate total deployed PegKeeper reserves
        const pegkeeperReserves = pegkeepersData.keepers.reduce(
          (acc, keeper) => acc + keeper.total_debt,
          0
        );

        // 3. Calculate total supply
        const totalSupply = borrowed + pegkeeperReserves;

        // 4. Get the current peg price
        const peg = priceData.data.usd_price;

        setSupplyData({
          totalSupply,
          borrowed,
          pegkeeperReserves,
          peg,
        });

      } catch (err) {
        console.error("Failed to fetch crvUSD data:", err);
        
        // Fallback to static data for development
        if (window.location.hostname === 'localhost') {
          console.log("Using fallback data for development");
          setSupplyData({
            totalSupply: 150000000, // Example fallback data
            borrowed: 120000000,
            pegkeeperReserves: 30000000,
            peg: 0.9998,
          });
          setError(null); // Clear error for fallback data
        } else {
          setError("Could not retrieve crvUSD supply data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCrvusdData();
  }, []);

  if (loading) return <div>Loading crvUSD Data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <table className="metric-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> crvUSD Total Supply</td>
          <td>{formatNumber(supplyData?.totalSupply, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> crvUSD Borrowed</td>
          <td>{formatNumber(supplyData?.borrowed, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> Deployed PegKeeper Reserves</td>
          <td>{formatNumber(supplyData?.pegkeeperReserves, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> Price</td>
          <td>${formatNumber(supplyData?.peg, 5)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default CrvusdSupply;