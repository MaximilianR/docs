import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { formatNumber } from '../../utils/formatters';

const RPC_URL = 'https://eth.llamarpc.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const ERC20_BALANCE_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
];

const TokenBalance = ({ tokenAddress, holderAddress, tokenName, logo, priceApiUrl }) => {
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      try {
        setLoading(true);

        const contract = new ethers.Contract(tokenAddress, ERC20_BALANCE_ABI, provider);

        const [balanceWei, priceResponse] = await Promise.all([
          contract.balanceOf(holderAddress),
          fetch(priceApiUrl),
        ]);

        const priceData = await priceResponse.json();
        if (!priceData?.data?.usd_price) {
          throw new Error('Invalid price data');
        }

        const balance = parseFloat(ethers.formatEther(balanceWei));
        const usdValue = balance * priceData.data.usd_price;

        setBalanceData({ balance, usdValue, lastUpdated: new Date() });
      } catch (err) {
        console.error(`Failed to fetch ${tokenName} balance:`, err);
        setError('Could not retrieve data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculate();
  }, [tokenAddress, holderAddress, priceApiUrl, tokenName]);

  if (loading) return <div>Loading {tokenName} Data...</div>;
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
            <td>
              {logo && <img src={logo} className="subheading-inline-logo" alt={tokenName} />}{' '}
              {tokenName}
            </td>
            <td>{balanceData?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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

export default TokenBalance;
