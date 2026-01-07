import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/formatters'; // Make sure the path is correct

import CrvusdLogo from '@site/static/img/logos/crvUSD_xs.png';

// --- API Configuration ---
const MARKETS_API_URL = 'https://prices.curve.finance/v1/crvusd/markets?fetch_on_chain=false';
const PEGKEEPERS_API_URL = 'https://prices.curve.finance/v1/crvusd/pegkeepers/ethereum';
const PRICE_API_URL = 'https://prices.curve.finance/v1/usd_price/ethereum/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E';
const YB_API_URL = 'https://prices.curve.finance/v1/crvusd/yield_basis/ethereum/supply';
const RSUP_MINT_AMT = 15000000;

const CrvusdSupply = () => {
  const [supplyData, setSupplyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrvusdData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data points concurrently
        const [marketsRes, pegkeepersRes, priceRes, ybRes] = await Promise.all([
          fetch(MARKETS_API_URL),
          fetch(PEGKEEPERS_API_URL),
          fetch(PRICE_API_URL),
          fetch(YB_API_URL),
        ]);

        if (!marketsRes.ok || !pegkeepersRes.ok || !priceRes.ok || !ybRes.ok) {
          throw new Error('Failed to fetch data from one or more API endpoints.');
        }

        const marketsData = await marketsRes.json();
        const pegkeepersData = await pegkeepersRes.json();
        const priceData = await priceRes.json();
        const ybData = await ybRes.json();

        const borrowed = marketsData.chains.ethereum.data.reduce(
          (acc, market) => acc + Number(market.total_debt),
          0
        );

        const ybDebt = Number(ybData?.data?.yb_total_amm_debt ?? 0);

        const pegkeeperReserves = pegkeepersData.keepers.reduce(
          (acc, keeper) => acc + Number(keeper.total_debt),
          0
        );

        const totalSupply = borrowed + pegkeeperReserves + ybDebt + RSUP_MINT_AMT;

        const peg = priceData.data.usd_price;
        const lastUpdated = new Date();

        setSupplyData({
          totalSupply,
          borrowed,
          pegkeeperReserves,
          peg,
          ybDebt,
          rsupMintAmt: RSUP_MINT_AMT,
          lastUpdated,
        });

      } catch (err) {
        console.error("Failed to fetch crvUSD data:", err);
        // Always set the error state on failure, for any environment
        setError("Could not retrieve crvUSD supply data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCrvusdData();
  }, []);

  if (loading) return <div>Loading crvUSD Data...</div>;
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
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> crvUSD Total Supply</td>
          <td>{formatNumber(supplyData?.totalSupply, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> crvUSD Borrowed (Minted)</td>
          <td>{formatNumber(supplyData?.borrowed, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> Deployed PegKeeper Reserves</td>
          <td>{formatNumber(supplyData?.pegkeeperReserves, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> crvUSD in Yield Basis</td>
          <td>{formatNumber(supplyData?.ybDebt, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> crvUSD Minted to sreUSD Lend Market</td>
          <td>{formatNumber(supplyData?.rsupMintAmt, 3)}</td>
        </tr>
        <tr>
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> Price</td>
          <td>${formatNumber(supplyData?.peg, 5)}</td>
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

export default CrvusdSupply;

