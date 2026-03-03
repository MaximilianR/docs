import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/formatters';

import CrvusdLogo from '@site/static/img/logos/crvusd.png';

// --- API Configuration ---
const MARKETS_API_URL = 'https://prices.curve.finance/v1/crvusd/markets?fetch_on_chain=false';
const PEGKEEPERS_API_URL = 'https://prices.curve.finance/v1/crvusd/pegkeepers/ethereum';
const PRICE_API_URL = 'https://prices.curve.finance/v1/usd_price/ethereum/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E';
const YB_API_URL = 'https://prices.curve.finance/v1/crvusd/yield_basis/ethereum/supply';

// --- RPC Configuration for RSUP ---
const RPC_URL = 'https://eth.llamarpc.com';
const RSUP_CONTRACT = '0xC32B0Cf36e06c790A568667A17DE80cba95A5Aad';
const RSUP_HOLDER = '0x21862cA8d044c104ac9EB728c86Bc38B8625BeCD';
const PRICE_PER_SHARE_SELECTOR = '0x99530b06'; // keccak256("pricePerShare()")
const BALANCE_OF_SELECTOR = '0x70a08231';      // keccak256("balanceOf(address)")

// Helper to make eth_call
const ethCall = async (to, data) => {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{ to, data }, 'latest'],
      id: 1,
    }),
  });
  const json = await response.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
};

// Fetch RSUP mint amount from blockchain
const fetchRsupMintAmt = async () => {
  // Get pricePerShare
  const pricePerShareHex = await ethCall(RSUP_CONTRACT, PRICE_PER_SHARE_SELECTOR);
  const pricePerShare = BigInt(pricePerShareHex);

  // Get balanceOf - pad address to 32 bytes
  const paddedAddress = RSUP_HOLDER.slice(2).toLowerCase().padStart(64, '0');
  const balanceOfData = BALANCE_OF_SELECTOR + paddedAddress;
  const numSharesHex = await ethCall(RSUP_CONTRACT, balanceOfData);
  const numShares = BigInt(numSharesHex);

  // Calculate: rsup_mint_amt = numShares * pricePerShare / 1e18 / 1e18
  const rsupMintAmt = Number((numShares * pricePerShare) / BigInt(10 ** 18) / BigInt(10 ** 18));

  return rsupMintAmt;
};

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
        const [marketsRes, pegkeepersRes, priceRes, ybRes, rsupMintAmt] = await Promise.all([
          fetch(MARKETS_API_URL),
          fetch(PEGKEEPERS_API_URL),
          fetch(PRICE_API_URL),
          fetch(YB_API_URL),
          fetchRsupMintAmt(),
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
        const collateralUsd = marketsData.chains.ethereum.data.reduce(
          (acc, market) => acc + Number(market.collateral_amount_usd) + Number(market.stablecoin_amount_usd),
          0
        );
        const collateralRatio =  collateralUsd / borrowed * 100;
        console.log({ borrowed, collateralUsd, collateralRatio });
        const ybDebt = Number(ybData?.data?.yb_total_amm_debt ?? 0);

        const pegkeeperReserves = pegkeepersData.keepers.reduce(
          (acc, keeper) => acc + Number(keeper.total_debt),
          0
        );

        const totalSupply = borrowed + pegkeeperReserves + ybDebt + rsupMintAmt;

        const peg = priceData.data.usd_price;
        const lastUpdated = new Date();

        setSupplyData({
          totalSupply,
          borrowed,
          collateralUsd,
          collateralRatio,
          pegkeeperReserves,
          peg,
          ybDebt,
          rsupMintAmt,
          lastUpdated,
        });

      } catch (err) {
        console.error("Failed to fetch crvUSD data:", err);
        setError("Could not retrieve data.  Sometimes an Adblocker is blocking the RPC call.");
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
          <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="crvUSD" /> crvUSD Collateralization</td>
          <td>
            {supplyData?.collateralRatio.toFixed(1)}%   
            <span style={{ color: 'var(--ifm-color-emphasis-500)' , marginLeft: '0.4em', fontWeight: 'normal' }}>
              (${formatNumber(supplyData?.collateralUsd, 3)})
            </span>
          </td>
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