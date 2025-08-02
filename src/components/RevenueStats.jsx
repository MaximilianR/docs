import React, { useState, useEffect } from 'react';

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
        console.error('Error fetching revenue data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`;
    } else {
      return `$${num.toFixed(0)}`;
    }
  };

  const getRecentWeeks = (weeklyData, count = 4) => {
    return weeklyData.slice(0, count);
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        textAlign: 'center'
      }}>
        <div style={{ color: '#666' }}>Loading revenue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        textAlign: 'center',
        color: '#d32f2f'
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const recentWeeks = getRecentWeeks(data.weeklyFeesTable);
  const totalFees = data.totalFees.fees;

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '1.5rem',
      border: '1px solid #e1e5e9',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center'
    }}>
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#fff',
        border: '1px solid #e1e5e9',
        borderRadius: '4px'
      }}>
        <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
          Total Revenue Distributed to veCRV Holders
        </div>
        <div style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: '#2c3e50',
          marginBottom: '0.5rem'
        }}>
          {formatNumber(totalFees)}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          USD equivalent (all time)
        </div>
      </div>
    </div>
  );
};

export default RevenueStats; 