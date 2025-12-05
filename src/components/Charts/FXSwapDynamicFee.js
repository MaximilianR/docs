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
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartContent = () => {
  const { colorMode } = useColorMode();
  const css = getComputedStyle(document.documentElement);
  const primaryColor = css.getPropertyValue('--ifm-color-primary-light').trim() || '#3b82f6';
  const txtColor = css.getPropertyValue('--ifm-color-emphasis-800').trim() || '#1f2937';
  const gridColor = css.getPropertyValue('--ifm-color-emphasis-200').trim() || '#e5e7eb';

  // Fee configuration options
  const midFeeOptions = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1];
  const outFeeOptions = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1];
  const gammaOptions = [0.0005, 0.002, 0.01, 0.05, 0.2, 1];

  const [midFee, setMidFee] = useState(0.1); 
  const [outFee, setOutFee] = useState(0.2); 
  const [gamma, setGamma] = useState(0.003); 

  // Curve V2 dynamic fee calculation
  const calculateFee = (pct, mFee, oFee, g) => {
    const p = pct / 100;
    
    // Boundary check
    if (p <= 0 || p >= 1) return oFee;

    // Calculate Balance Indicator (B_raw) for 2 coins: 4 * p * (1-p)
    const bRaw = 4 * p * (1 - p);

    // Regulate slope using fee_gamma
    const numerator = g * bRaw;
    const denominator = numerator + (1 - bRaw);
    const bNew = denominator === 0 ? 0 : numerator / denominator;

    // Linear interpolation between mid_fee and out_fee
    return (mFee * bNew) + (oFee * (1 - bNew));
  };

  const chartData = useMemo(() => {
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
          borderWidth: 4,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4,
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
            const effectiveMult = midFee > 0 ? (currentFee / midFee) : 0;
            return [
              `Dynamic Fee: ${currentFee.toFixed(4)}%`,
              `Relative Increase: ${effectiveMult.toFixed(2)}x`,
              `Asset 1: ${context.parsed.x}%`,
              `Asset 2: ${100 - context.parsed.x}%`
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
      borderRadius: '0px', 
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
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {midFeeOptions.map((val) => (
              <option key={val} value={val}>{val}%</option>
            ))}
          </select>
        </div>

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
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {outFeeOptions.map((val) => (
              <option key={val} value={val}>{val}%</option>
            ))}
          </select>
        </div>

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
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {gammaOptions.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ position: 'relative', height: '320px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default function FXSwapDynamicFeeChart() {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: '320px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        Loading Chart...
      </div>
    }>
      {() => <ChartContent />}
    </BrowserOnly>
  );
}