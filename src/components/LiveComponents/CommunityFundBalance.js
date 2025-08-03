// src/components/CommunityFundBalance.js

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
// Change 1: Import the new formatter function
import { formatNumber } from '../../utils/formatters';

import CrvLogo from '@site/static/img/logos/CRV_xs.png';

// --- Configuration for this specific component ---
const CRV_TOKEN_ADDRESS = '0xD533a949740bb3306d119CC777fa900bA034cd52';
const COMMUNITY_FUND_ADDRESS = '0xe3997288987e6297ad550a69b31439504f513267';
const RPC_URL = 'https://eth.llamarpc.com';

// CRV token ABI (minimal for balanceOf)
const CRV_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  }
];

const CommunityFundBalance = () => {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        setLoading(true);
        
        // Initialize Web3
        const web3 = new Web3(RPC_URL);

        // Fetch CRV price from Curve Finance API
        const priceResponse = await fetch('https://prices.curve.finance/v1/usd_price/ethereum/0xD533a949740bb3306d119CC777fa900bA034cd52');
        const priceData = await priceResponse.json();
        
        console.log('Curve Finance API response:', priceData); // Debug log
        
        // Check if the response has the expected structure
        if (!priceData || !priceData.data || !priceData.data.usd_price) {
          console.error('Invalid price data structure:', priceData);
          throw new Error('Invalid price data from Curve Finance API');
        }
        
        const crvPrice = priceData.data.usd_price;

        // Create contract instance
        const crvContract = new web3.eth.Contract(CRV_ABI, CRV_TOKEN_ADDRESS);

        // Get balance
        const balanceWei = await crvContract.methods.balanceOf(COMMUNITY_FUND_ADDRESS).call();
        const balanceFormatted = parseFloat(web3.utils.fromWei(balanceWei, 'ether'));
        
        // Calculate USD value
        const usdValueFormatted = balanceFormatted * crvPrice;

        setBalanceData({ 
          crvBalance: balanceFormatted, 
          usdValue: usdValueFormatted,
          lastUpdated: new Date()
        });

      } catch (err) {
        console.error("Failed to fetch community fund data:", err);
        setError("Could not retrieve data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, []);

  if (loading) return <div>Loading Community Fund Data...</div>;
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
            <td><img src={CrvLogo} className="subheading-inline-logo" alt="CRV" /> CRV</td>
            <td>{balanceData?.crvBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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

export default CommunityFundBalance; 