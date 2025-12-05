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
import fxData from '../../data/data_fxswap_a.json';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

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

const ChartContent = () => {
  const { colorMode } = useColorMode();
  const css = getComputedStyle(document.documentElement);
  
  const primaryColor = css.getPropertyValue('--ifm-color-primary-light').trim() || '#3eaf7c';
  const txtColor = css.getPropertyValue('--ifm-color-emphasis-800').trim()
  const gridColor = css.getPropertyValue('--ifm-color-emphasis-200').trim() || '#e5e7eb';

  const centerLinePlugin = {
    id: 'centerLine',
    beforeDatasetsDraw(chart) {
      const cssPlugin = getComputedStyle(document.documentElement);
      const txtPluginColor = cssPlugin.getPropertyValue('--ifm-color-emphasis-800').trim() || '#000';

      const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;      
      
      const dataset = chart.data.datasets[0].data;
      const midpoint = dataset.find(d => d.x === 50);
      
      const xPos = x.getPixelForValue(50);
      const yPos = y.getPixelForValue(midpoint.y);      
      ctx.save();
      
      // 1. Draw the vertical dashed line
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#D41E26'; 
      ctx.setLineDash([4, 4]);
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.stroke();

      // 2. Draw the vertical label
      ctx.font = '12px system-ui';
      ctx.fillStyle = txtPluginColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('perfect balance', xPos+5, top + 5); 
      
      // 1. Draw the vertical dashed line
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFC300'; 
      ctx.setLineDash([4, 4]);
      ctx.moveTo(left, yPos);
      ctx.lineTo(right, yPos);
      ctx.stroke();

      // 2. Draw the vertical label
      ctx.font = '12px system-ui';
      ctx.fillStyle = txtPluginColor;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText('center of liquidity', right -5, yPos - 15); 

      ctx.restore();
    }
  };

  // 1. Extract unique Markets (Assets)
  const availableAssets = useMemo(() => {
    return [...new Set(fxData.map((d) => d.asset))];
  }, []);

  // 2. Extract unique A values
  const availableAValues = useMemo(() => {
    return [...new Set(fxData.map((d) => d.A))];
  }, []);

  // Initialize state
  const [selectedAsset, setSelectedAsset] = useState(availableAssets[0] || 'ETHUSD');
  const [selectedA, setSelectedA] = useState(availableAValues[0]);

  const assetName = selectedAsset.slice(0, 3);
  
  // Filter data based on BOTH Asset and A
  const chartData = useMemo(() => {
    const filtered = fxData.filter(
      (d) => d.asset === selectedAsset && d.A === selectedA
    );

    return {
      datasets: [
        {
          label: `Price (${selectedAsset})`,
          data: filtered.map((d) => ({ x: d.ratio, y: d.price })),
          borderColor: primaryColor,
          backgroundColor: primaryColor,
          borderWidth: 4,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4,
        },
      ],
    };
  }, [selectedA, selectedAsset, primaryColor]);

  // Helper to format currency dynamically based on magnitude
  const formatCurrency = (val) => {
    if (val < 1) return '$' + val.toFixed(5);
    if (val > 1000) return '$' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return '$' + val.toFixed(2);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const price = context.parsed.y;
            return [
              `Price ${assetName}: ${formatCurrency(price)}`,
              `Balance ${assetName}: ${context.parsed.x}%`,
              `Balance USD: ${100 - context.parsed.x}%`
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
          text: `Pool Composition (% ${assetName})`,
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => value + '%'
        }
      },
      y: {
        title: {
          display: true,
          text: `${assetName} Price (USD)`,
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => formatCurrency(value)
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
          <label htmlFor="asset-select" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ifm-color-emphasis-800)' }}>
            Market:
          </label>
          <select
            id="asset-select"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200)',
              fontSize: '14px'
            }}
          >
            {availableAssets.map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="amp-select" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ifm-color-emphasis-800)' }}>
            Amplification:
          </label>
          <select
            id="amp-select"
            value={selectedA}
            onChange={(e) => setSelectedA(e.target.value)}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200)',
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
        <Line data={chartData} options={options} plugins={[centerLinePlugin]} />
      </div>
    </div>
  );
};

export default function FXSwapAmplificationChart() {
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