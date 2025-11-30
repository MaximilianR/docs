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

const StableswapDynamicFeeChart = () => {
  // Safe retrieval of CSS variables with fallbacks
  const css = typeof document !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const primaryColor = css ? css.getPropertyValue('--ifm-color-primary-light').trim() : '#3b82f6';
  const txtColor = css ? css.getPropertyValue('--ifm-color-emphasis-800').trim() : '#1f2937';
  const gridColor = css ? css.getPropertyValue('--ifm-color-emphasis-200').trim() : '#e5e7eb';

  // Configuration Options
  const baseFeeOptions = [0.001, 0.01, 0.1, 1]; // In Percent
  const multiplierOptions = [1, 2, 5, 10, 20, 50, 100];

  const [baseFee, setBaseFee] = useState(0.01); // Default 0.01%
  const [multiplier, setMultiplier] = useState(10); // Default 2x

  // Dynamic Fee Calculation Logic
  // Formula derived from Curve's _dynamic_fee:
  // Fee = (K * Base) / ( (K-1)*4*p*(1-p) + 1 )
  // where K = multiplier, p = balance ratio (0 to 1)
  const calculateFee = (pct, bFee, mult) => {
    if (pct == 100) {
        return mult * bFee
    }
    const p = pct / 100;
    // Safe guard for edges
    if (p <= 0 || p >= 1) return mult * bFee; 
    
    // 4 * xpi * xpj / (sum)^2  is equivalent to 4 * p * (1-p)
    const ratio = 4 * p * (1 - p);
    
    // Denominator term: ((fee_mult - FEE_DENOMINATOR) * ratio) + FEE_DENOMINATOR
    // Normalized by FEE_DENOMINATOR: (K - 1) * ratio + 1
    const denominator = (mult - 1) * ratio + 1;
    
    return (mult * bFee) / denominator;
  };

  // Generate Chart Data
  const chartData = useMemo(() => {
    // Generate points from 20% to 99%
    const dataPoints = [];
    for (let i = 20; i <= 100; i += 1) {
      const fee = calculateFee(i, baseFee, multiplier);
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
  }, [baseFee, multiplier, primaryColor]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const currentFee = context.parsed.y;
            const effectiveMult = baseFee > 0 ? (currentFee / baseFee) : 0;
            return [
              `Dynamic Fee: ${currentFee.toFixed(4)}%`,
              `Fee Multiplier: ${effectiveMult.toFixed(2)}`,
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
          text: 'Avg. Pool Composition (% newUSD)',
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => value + '%'
        }
      },
      y: {
        // Dynamic min/max based on data range could be better, 
        // but standard linear scale works. Let's start at 0.
        min: 0, 
        suggestedMax: baseFee * multiplier * 1.1, // Give some headroom
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
        
        {/* Base Fee Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="base-fee-select" style={{ fontSize: '14px', fontWeight: 600, color: txtColor }}>
            Base Fee:
          </label>
          <select
            id="base-fee-select"
            value={baseFee}
            onChange={(e) => setBaseFee(Number(e.target.value))}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '6px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {baseFeeOptions.map((val) => (
              <option key={val} value={val}>
                {val}%
              </option>
            ))}
          </select>
        </div>

        {/* Multiplier Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="mult-select" style={{ fontSize: '14px', fontWeight: 600, color: txtColor }}>
            Offpeg Multiplier:
          </label>
          <select
            id="mult-select"
            value={multiplier}
            onChange={(e) => setMultiplier(Number(e.target.value))}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '6px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {multiplierOptions.map((val) => (
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

export default StableswapDynamicFeeChart;