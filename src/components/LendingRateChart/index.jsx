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
import { getChartColors } from '../../utils/chartTheme';

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
  const { primaryColor, txtColor, gridColor, bgColor } = getChartColors();

  const [minRate, setMinRate] = useState(1);
  const [maxRate, setMaxRate] = useState(66);

  // Semi-log formula: rate = rate_min * (rate_max / rate_min)^utilization
  const calculateRate = (utilization, min, max) => {
    if (utilization === 0) return min;
    if (utilization === 100) return max;
    
    const util = utilization / 100;
    const minR = min / 100;
    const maxR = max / 100;
    
    return minR * Math.pow(maxR / minR, util) * 100;
  };

  const chartData = useMemo(() => {
    const dataPoints = [];
    // Generate points for 0 to 100% utilization
    for (let i = 0; i <= 100; i += 1) {
      const rate = calculateRate(i, minRate, maxRate);
      dataPoints.push({ x: i, y: rate });
    }

    return {
      datasets: [
        {
          label: 'Borrow Rate',
          data: dataPoints,
          borderColor: primaryColor,
          backgroundColor: primaryColor,
          borderWidth: 4,
          pointRadius: 0,
          pointHoverRadius: 6,
          // Use monotonic cubic interpolation for smooth semi-log curve look
          cubicInterpolationMode: 'monotone', 
        },
      ],
    };
  }, [minRate, maxRate, primaryColor]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const utilization = context.parsed.x;
            const rate = context.parsed.y;
            return [
              `Utilization: ${utilization}%`,
              `Borrow Rate: ${rate.toFixed(2)}%`
            ];
          },
          title: () => '',
        },
        displayColors: false,
        backgroundColor: '#1f2937',
        padding: 12,
        cornerRadius: 8,
        titleFont: { weight: 'bold' },
        bodyFont: { weight: 'bold' },
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Utilization (%)',
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => value + '%',
          stepSize: 10
        }
      },
      y: {
        min: 0,
        // Add some headroom to the top of the chart
        suggestedMax: maxRate * 1.1,
        title: {
          display: true,
          text: 'Borrow Rate (%)',
          color: txtColor,
          font: { weight: 'bold' }
        },
        grid: { color: gridColor },
        ticks: {
          callback: (value) => value.toFixed(1) + '%'
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
      backgroundColor: bgColor
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        flexWrap: 'wrap',
        gap: '16px', 
        marginBottom: '16px' 
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="min-rate-input" style={{ fontSize: '14px', fontWeight: 600, color: txtColor }}>
            Min Rate (%):
          </label>
          <input
            id="min-rate-input"
            type="number"
            value={minRate}
            onChange={(e) => setMinRate(parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            style={{ 
              padding: '4px 8px', 
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px',
              width: '70px',
              color: txtColor
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="max-rate-input" style={{ fontSize: '14px', fontWeight: 600, color: txtColor }}>
            Max Rate (%):
          </label>
          <input
            id="max-rate-input"
            type="number"
            value={maxRate}
            onChange={(e) => setMaxRate(parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            style={{ 
              padding: '4px 8px', 
              borderRadius: '0px', 
              border: '1px solid var(--ifm-color-emphasis-200, #e5e7eb)',
              fontSize: '14px',
              width: '70px',
              color: txtColor
            }}
          />
        </div>
      </div>

      <div style={{ position: 'relative', height: '320px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '0.75rem', 
        fontSize: '0.85rem',
        color: txtColor
      }}>
        <p style={{ margin: 0, lineHeight: '1.4' }}>
          <strong>How it works:</strong> The rate follows a semi-logarithmic curve. 
          This creates a smooth curve that starts low and increases exponentially as utilization rises, 
          encouraging early borrowing while preventing over-utilization.
        </p>
      </div>
    </div>
  );
};

export default function LendingRateChart() {
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