import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/formatters';

const RevenueStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.curve.finance/api/getWeeklyFees');
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to fetch revenue data');
        }
      } catch (err) {
        setError('Error fetching revenue data');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid var(--ifm-color-emphasis-200)',
        borderRadius: '8px',
        backgroundColor: 'var(--ifm-color-emphasis-0)',
        textAlign: 'center'
      }}>
        <div style={{ color: 'var(--ifm-color-emphasis-600)' }}>Loading revenue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid var(--ifm-color-emphasis-200)',
        borderRadius: '8px',
        backgroundColor: 'var(--ifm-color-emphasis-0)',
        textAlign: 'center',
        color: 'var(--ifm-color-danger)'
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const totalFees = data.totalFees.fees;

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '1.5rem',
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: '8px',
      backgroundColor: 'var(--ifm-color-emphasis-0)',
      textAlign: 'center'
    }}>
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--ifm-color-emphasis-100)',
        border: '1px solid var(--ifm-color-emphasis-200)',
        borderRadius: '4px'
      }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-600)', marginBottom: '0.5rem' }}>
          Total Revenue Distributed to veCRV Holders
        </div>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'var(--ifm-color-emphasis-900)',
          marginBottom: '0.5rem'
        }}>
          ${formatNumber(totalFees)}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-600)' }}>
          USD equivalent (all time)
        </div>
      </div>
    </div>
  );
};

export default RevenueStats; 