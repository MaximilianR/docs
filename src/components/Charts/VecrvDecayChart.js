// src/components/Charts/VecrvDecayChart.js

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useColorMode } from '@docusaurus/theme-common';

Chart.register(...registerables);

export default function VecrvDecayChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Get theme colors
      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--ifm-font-color-base').trim();
      const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--ifm-color-emphasis-300').trim();
      
      let tooltipBackgroundColor;
      const cardBackgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--ifm-card-background-color').trim();
      
      if (cardBackgroundColor && cardBackgroundColor !== 'transparent') {
        tooltipBackgroundColor = cardBackgroundColor;
      } else {
        tooltipBackgroundColor = colorMode === 'light' ? '#ffffff' : '#242526';
      }

      // Generate veCRV decay data
      const data = [];
      const maxYears = 4;
      const maxDays = maxYears * 365;
      
      // Generate data points for 4 years (1460 days)
      for (let day = 0; day <= maxDays; day += 7) { // Data point every 7 days
        const yearsLeft = (maxDays - day) / 365;
        const veCRV = Math.max(0, yearsLeft / maxYears); // Linear decay from 1 to 0 over 4 years
        data.push({
          x: day,
          y: veCRV * 100 // Convert to percentage
        });
      }

      const chartConfig = {
        type: 'line',
        data: {
          datasets: [{
            label: 'veCRV Balance',
            data: data,
            borderColor: '#00D4AA', // Curve green
            backgroundColor: 'rgba(0, 212, 170, 0.1)',
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 8,
            pointHitRadius: 10,
            borderWidth: 3,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'veCRV Decay Over Time',
              font: { size: 16 },
              color: textColor,
            },
            tooltip: {
              backgroundColor: tooltipBackgroundColor,
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: gridColor,
              borderWidth: 1,
              displayColors: false,
              callbacks: {
                title: (context) => {
                  if (!context || !context[0] || !context[0].parsed) {
                    return '';
                  }
                  const days = context[0].parsed.x;
                  const years = days / 365;
                  return `${years.toFixed(1)} years remaining`;
                },
                label: (context) => {
                  if (!context || !context[0] || !context[0].parsed) {
                    return '';
                  }
                  const veCRV = context[0].parsed.y;
                  const days = context[0].parsed.x;
                  const years = days / 365;
                  return [
                    `veCRV: ${veCRV.toFixed(1)}%`,
                    `Time left: ${years.toFixed(1)} years`,
                    `Days left: ${days.toFixed(0)} days`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              title: {
                display: true,
                text: 'Time Remaining (days)',
                color: textColor,
                font: { size: 12 }
              },
              ticks: {
                color: textColor,
                callback: function(value) {
                  const years = value / 365;
                  return `${years.toFixed(1)}y`;
                }
              },
              grid: {
                color: gridColor,
                borderColor: gridColor
              }
            },
            y: {
              title: {
                display: true,
                text: 'veCRV Balance (%)',
                color: textColor,
                font: { size: 12 }
              },
              ticks: {
                color: textColor,
                callback: function(value) {
                  return `${value}%`;
                }
              },
              grid: {
                color: gridColor,
                borderColor: gridColor
              },
              min: 0,
              max: 100
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
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '2rem'
    }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
} 