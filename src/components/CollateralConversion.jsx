import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import { getChartColors } from '../utils/chartTheme';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartContent = () => {
  const { colorMode } = useColorMode();
  const { txtColor, gridColor, bgColor } = getChartColors();

  // Logic State
  const [bottomRange, setBottomRange] = useState(2311.92);
  const [topRange, setTopRange] = useState(2556.35);
  const [sliderValue, setSliderValue] = useState(50);
  const [collateral] = useState(1);

  // Calculations
  const calculations = useMemo(() => {
    const currentPrice = bottomRange + (topRange - bottomRange) * (sliderValue / 100);
    const ethPercentage = sliderValue;
    const crvUSDPercentage = 100 - ethPercentage;
    const avgSellPrice = (topRange + currentPrice) / 2;
    const ethAmount = (ethPercentage / 100) * collateral;
    const crvUSDEth = (crvUSDPercentage / 100) * collateral;
    const crvUSDValue = crvUSDEth * avgSellPrice;

    return {
      currentPrice,
      ethPercentage,
      crvUSDPercentage,
      avgSellPrice,
      ethAmount,
      crvUSDValue
    };
  }, [bottomRange, topRange, sliderValue, collateral]);

  const chartData = useMemo(() => {
    return {
      labels: ['Collateral Composition'],
      datasets: [
        {
          label: 'ETH Amount',
          data: [calculations.ethAmount],
          backgroundColor: '#ACBEF1',
          borderColor: '#ACBEF1',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'crvUSD Value',
          data: [calculations.crvUSDValue],
          backgroundColor: '#A8EFC6',
          borderColor: '#A8EFC6',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
    };
  }, [calculations]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        labels: { color: txtColor }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            if (label === 'ETH Amount') {
              return context.parsed.y.toFixed(2) + ' ETH';
            } else {
              return context.parsed.y.toFixed(2) + ' crvUSD';
            }
          }
        },
        backgroundColor: '#1f2937',
        padding: 12,
        cornerRadius: 8,
        titleFont: { weight: 'bold' },
        bodyFont: { weight: 'bold' },
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false } 
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        max: Math.ceil(collateral),
        title: {
          display: true,
          text: 'ETH Amount',
          color: txtColor,
          font: { weight: 'bold' }
        },
        ticks: {
          color: txtColor,
          callback: (value) => value.toFixed(2) + ' ETH'
        },
        grid: { color: gridColor }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        max: Math.ceil(topRange * collateral),
        title: {
          display: true,
          text: 'crvUSD Value',
          color: txtColor,
          font: { weight: 'bold' }
        },
        ticks: {
          color: txtColor,
          callback: (value) => value.toFixed(0) + ' crvUSD'
        },
        grid: { display: false }
      }
    }
  };

return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      marginBottom: '2rem', 
      border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)', 
      borderRadius: '0px', 
      padding: '16px',
      backgroundColor: bgColor
    }}>
      
      {/* Title */}
      <h3 style={{ 
        margin: '0 0 16px 0', 
        fontSize: '1.1rem', 
        fontWeight: 'bold', 
        color: txtColor 
      }}>
        Liquidation Progress Visualizer
      </h3>

      {/* Controls Row: Bottom Range | Price | Top Range */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        gap: '10px',
        marginBottom: '12px' 
      }}>
        
        {/* Left: Bottom Range */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: txtColor }}>
            Bottom of Range
          </label>
          <input
            type="number"
            value={bottomRange}
            onChange={(e) => setBottomRange(Number(e.target.value))}
            style={{ 
              padding: '6px 8px', 
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px',
              width: '90px',
              color: txtColor,
            }}
          />
        </div>

        {/* Center: Current Price */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: txtColor, textAlign: 'center'}}>
            Current Price
          </label>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: txtColor,
          marginBottom: '6px',
          textAlign: 'center'
        }}>
          ${calculations.currentPrice.toFixed(2)}
        </div>
        </div>

        {/* Right: Top Range */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: txtColor }}>
            Top of Range
          </label>
          <input
            type="number"
            value={topRange}
            onChange={(e) => setTopRange(Number(e.target.value))}
            style={{ 
              padding: '6px 8px', 
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px',
              width: '90px',
              color: txtColor,
              textAlign: 'right'
            }}
          />
        </div>
      </div>

      {/* Slider Control */}
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="range" 
          style={{ width: '100%', cursor: 'pointer' }} 
          min="0" 
          max="100" 
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
        />
      </div>

      {/* Chart Area */}
      <div style={{ position: 'relative', height: '320px', width: '100%' }}>
        <Bar data={chartData} options={options} />
      </div>

      {/* Footer Info */}
      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        fontSize: '0.85rem',
        color: txtColor,
        borderTop: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <strong>Collateral State:</strong><br/>
            {calculations.ethAmount.toFixed(2)} ETH + {calculations.crvUSDValue.toFixed(2)} crvUSD
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Stats:</strong><br/>
            Avg Swap Price: {calculations.avgSellPrice.toFixed(2)}<br/>
            Swapped: {calculations.crvUSDPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CollateralConversion() {
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