import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FXSwapDynamicFeeChart = () => {
  // Safe retrieval of CSS variables with fallbacks
  const css = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const primaryColor = css ? css.getPropertyValue('--ifm-color-primary-light').trim() : '#3b82f6';
  const txtColor = css ? css.getPropertyValue('--ifm-color-emphasis-800').trim() : '#1f2937';
  const gridColor = css ? css.getPropertyValue('--ifm-color-emphasis-200').trim() : '#e5e7eb';

  // Configuration Options
  const midFeeOptions = [0.03, 0.1, 0.2, 0.5]; // In Percent
  const outFeeOptions = [0.1, 0.2, 0.4, 1.0]; // In Percent
  const gammaOptions = [0.0005, 0.003, 0.01, 0.02, 0.05];

  // Defaults based on the "live pool" data provided
  const [midFee, setMidFee] = useState(0.1); 
  const [outFee, setOutFee] = useState(0.2); 
  const [gamma, setGamma] = useState(0.003); 

  // New Fee Calculation Logic
  // Logic matches the provided Vyper _fee function
  const calculateFee = (pct, mFee, oFee, g) => {
    const p = pct / 100;
    
    // Boundary checks (if p is 0 or 1, balance is 0, fee is out_fee)
    if (p <= 0 || p >= 1) return oFee;

    // 1. Calculate Balance Indicator (B_raw)
    // Corresponds to: B = PRECISION * N^N * xp[0] * xp[1] / (sum)^2
    // Simplified for 2 coins: 4 * p * (1-p)
    const bRaw = 4 * p * (1 - p);

    // 2. Regulate slope using fee_gamma
    // Corresponds to: B = fee_params[2] * B / (fee_params[2] * B + 10**18 - B)
    // Formula: (g * bRaw) / ( g * bRaw + (1 - bRaw) )
    const numerator = g * bRaw;
    const denominator = numerator + (1 - bRaw);
    
    // Prevent division by zero just in case
    const bNew = denominator === 0 ? 0 : numerator / denominator;

    // 3. Final Fee Calculation
    // Corresponds to: mid_fee * B + out_fee * (1 - B)
    // Linear interpolation between mid_fee (at equilibrium) and out_fee (at imbalance)
    return (mFee * bNew) + (oFee * (1 - bNew));
  };

  // Generate Chart Data
  const chartData = useMemo(() => {
    // Generate points from 20% to 99%
    const dataPoints = [];
    for (let i = 20; i <= 100; i += 1) {
      const fee = calculateFee(i, midFee, outFee, gamma);
      dataPoints.push({ x: i, y: fee });
    }

    return {
      datasets: [
        {
          label: `Dynamic Fee`,
          data: dataPoints,
          borderColor: primaryColor,
          backgroundColor: primaryColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4, // Smooth curve
        },
      ],
    };
  }, [midFee, outFee, gamma, primaryColor]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const currentFee = context.parsed.y;
            // Calculate effective multiplier relative to the Mid Fee
            const effectiveMult = midFee > 0 ? (currentFee / midFee) : 0;
            return [
              `Dynamic Fee: ${currentFee.toFixed(4)}%`,
              `Relative Increase: ${effectiveMult.toFixed(2)}x`,
              `Pool newUSD: ${context.parsed.x}%`,
              `Pool crvUSD: ${100 - context.parsed.x}%`
            ];
          },
          title: () => ``,
        },
        displayColors: false,
        backgroundColor: '#1f2937',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 50,
        max: 100,
        title: {
          display: true,
          text: 'Value Ratio of Assets in Pool (%)',
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => value + '/' + (100 - value)
        }
      },
      y: {
        min: 0, 
        // Suggest max based on the higher of the two fees + headroom
        suggestedMax: Math.max(midFee, outFee) * 1.1,
        title: {
          display: true,
          text: 'Dynamic Fee (%)',
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => value.toFixed(3) + '%'
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      marginBottom: '2rem', 
      border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)', 
      borderRadius: '8px', 
      padding: '16px',
      backgroundColor: 'var(--ifm-background-color, #ffffff)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        flexWrap: 'wrap',
        gap: '16px', 
        marginBottom: '16px' 
      }}>
        
        {/* Mid Fee Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="mid-fee-select" style={{ fontSize: '14px', fontWeight: 600, color: txtColor }}>
            Mid Fee:
          </label>
          <select
            id="mid-fee-select"
            value={midFee}
            onChange={(e) => setMidFee(Number(e.target.value))}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '6px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {midFeeOptions.map((val) => (
              <option key={val} value={val}>
                {val}%
              </option>
            ))}
          </select>
        </div>

        {/* Out Fee Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="out-fee-select" style={{ fontSize: '14px', fontWeight: 600, color: txtColor }}>
            Out Fee:
          </label>
          <select
            id="out-fee-select"
            value={outFee}
            onChange={(e) => setOutFee(Number(e.target.value))}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '6px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {outFeeOptions.map((val) => (
              <option key={val} value={val}>
                {val}%
              </option>
            ))}
          </select>
        </div>

        {/* Gamma Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="gamma-select" style={{ fontSize: '14px', fontWeight: 600, color: txtColor }}>
            Fee Gamma:
          </label>
          <select
            id="gamma-select"
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '6px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {gammaOptions.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ position: 'relative', height: '320px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default FXSwapDynamicFeeChart;