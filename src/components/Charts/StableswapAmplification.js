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
import curveData from '../../data/data_stableswap_a.json';

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
  const css = getComputedStyle(document.documentElement);
  const primaryColor = css.getPropertyValue('--ifm-color-primary-light').trim() || '#3eaf7c';
  const txtColor = css.getPropertyValue('--ifm-color-emphasis-800').trim() || '#1f2937';
  const gridColor = css.getPropertyValue('--ifm-color-emphasis-200').trim() || '#e5e7eb';

  // Extract and sort unique A values
  const availableAValues = useMemo(() => {
    return [...new Set(curveData.map((d) => d.A))].sort((a, b) => a - b);
  }, []);

  const [selectedA, setSelectedA] = useState(100);

  const chartData = useMemo(() => {
    const filtered = curveData.filter((d) => d.A === selectedA);
    return {
      datasets: [
        {
          label: `Price (A = ${selectedA})`,
          data: filtered.map((d) => ({ x: d.pct_yourusd, y: d.price_yourusd })),
          borderColor: primaryColor,
          backgroundColor: primaryColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4,
        },
      ],
    };
  }, [selectedA, primaryColor]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            return [
              `Price newUSD: $${context.parsed.y.toFixed(4)}`,
              `Balance newUSD: ${context.parsed.x}%`,
              `Price crvUSD: $1.00`,
              `Balance crvUSD: ${100 - context.parsed.x}%`
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
        min: 20,
        max: 100,
        title: {
          display: true,
          text: 'Pool Composition (% newUSD)',
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => value + '%'
        }
      },
      y: {
        min: 0,
        max: 2,
        title: {
          display: true,
          text: 'Price (USD)',
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => '$' + value.toFixed(2)
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
        marginBottom: '16px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="amp-select" style={{ fontSize: '14px', fontWeight: 600, color: txtColor }}>
            Select A:
          </label>
          <select
            id="amp-select"
            value={selectedA}
            onChange={(e) => setSelectedA(Number(e.target.value))}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '6px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px'
            }}
          >
            {availableAValues.map((val) => (
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

export default function StableswapAmplificationChart() {
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