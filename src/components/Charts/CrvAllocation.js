// src/components/Charts/CrvAllocation.js

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useColorMode } from '@docusaurus/theme-common';

Chart.register(...registerables);

export default function CrvAllocationChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // --- BULLETPROOF THEME COLOR FETCHING ---
      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--ifm-font-color-base').trim();
      const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--ifm-color-emphasis-300').trim();

      // --- NEW: Bulletproof Tooltip Background Logic ---
      let tooltipBackgroundColor;
      // First, try to get the semantic color for cards, which is most reliable.
      const cardBackgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ifm-card-background-color').trim();

      // If the fetched color is not transparent, use it.
      if (cardBackgroundColor && cardBackgroundColor !== 'transparent') {
        tooltipBackgroundColor = cardBackgroundColor;
      } else {
        // Otherwise, provide a hardcoded fallback based on the current theme.
        // This guarantees a solid background color.
        tooltipBackgroundColor = colorMode === 'light' ? '#ffffff' : '#242526';
      }
      // --- End of new logic ---


      const data = [1727272729 + 151515152, 800961153, 108129756, 90909091, 151515152];
      const totalSum = data.reduce((a, b) => a + b, 0);
      const percentages = data.map(value => ((value / totalSum) * 100).toFixed(2));
      const labels = ['Community', 'Core Team', 'Investors', 'Employees', 'Community Reserve'];

      const chartConfig = {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#FF6384', '#FFCE56', '#8E5EA2', '#3cba9f', '#e8c3b9'],
            borderColor: gridColor,
            borderWidth: 1,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: textColor,
              }
            },
            title: {
              display: true,
              text: 'CRV Supply Allocation',
              font: { size: 18 },
              color: textColor,
            },
            tooltip: {
              titleColor: textColor,
              bodyColor: textColor,
              backgroundColor: tooltipBackgroundColor, // Apply our new bulletproof color
              borderColor: gridColor,
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const percentage = percentages[context.dataIndex];
                  const formattedValue = value.toLocaleString();
                  return `${formattedValue} (${percentage}%)`;
                }
              }
            }
          }
        }
      };

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (chartRef.current) {
          chartRef.current.destroy();
        }
        chartRef.current = new Chart(ctx, chartConfig);
      }
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [colorMode]);

  return (
    <div style={{
      position: 'relative',
      height: '40vh',
      width: '100%',
      maxWidth: '500px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '2rem'
    }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}