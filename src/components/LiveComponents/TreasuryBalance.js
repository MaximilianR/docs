// src/components/TreasuryBalance.js

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
// Change 1: Import the new formatter function
import { formatNumber } from '../../utils/formatters';

import CrvusdLogo from '@site/static/img/logos/crvUSD_xs.png';

// --- Configuration for this specific component ---
const CRVUSD_TOKEN_ADDRESS = '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E';
const TREASURY_ADDRESS = '0x6508eF65b0Bd57eaBD0f1D52685A70433B2d290B';
const RPC_URL = 'https://eth.llamarpc.com';

// crvUSD token ABI (minimal for balanceOf)
const CRVUSD_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

const TreasuryBalance = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        setLoading(true);
        
        // Initialize Web3
        const web3 = new Web3(RPC_URL);

        // Fetch crvUSD price from Curve Finance API
        const priceResponse = await fetch('https://prices.curve.finance/v1/usd_price/ethereum/0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E');
        const priceData = await priceResponse.json();
        
        console.log('Curve Finance API response:', priceData); // Debug log
        
        // Check if the response has the expected structure
        if (!priceData || !priceData.data || !priceData.data.usd_price) {
          console.error('Invalid price data structure:', priceData);
          throw new Error('Invalid price data from Curve Finance API');
        }
        
        const crvusdPrice = priceData.data.usd_price;

        // Create contract instance
        const crvusdContract = new web3.eth.Contract(CRVUSD_ABI, CRVUSD_TOKEN_ADDRESS);

        // Get balance
        const balanceWei = await crvusdContract.methods.balanceOf(TREASURY_ADDRESS).call();
        const balanceFormatted = parseFloat(web3.utils.fromWei(balanceWei, 'ether'));
        
        // Calculate USD value
        const usdValueFormatted = balanceFormatted * crvusdPrice;

        setBalanceData({ 
          crvusdBalance: balanceFormatted, 
          usdValue: usdValueFormatted,
          lastUpdated: new Date()
        });

      } catch (err) {
        console.error("Failed to fetch treasury data:", err);
        setError("Could not retrieve data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, []);

  if (loading) return <div>Loading Treasury Data...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <table className="metric-table" style={{ marginBottom: '0.5rem' }}>
        <thead>
          <tr>
            <th>Holdings</th>
            <th>Balance</th>
            <th>USD Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><img src={CrvusdLogo} className="subheading-inline-logo" alt="CRV" /> crvUSD</td>
            <td>{balanceData?.crvusdBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>${balanceData?.usdValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
        Last updated: {balanceData?.lastUpdated?.toLocaleString()}
      </div>
    </div>
  );
};

export default TreasuryBalance; 