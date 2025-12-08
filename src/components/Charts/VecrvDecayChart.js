// src/components/Charts/VecrvDecayChart.js

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useColorMode } from '@docusaurus/theme-common';

// Register Chart.js components
Chart.register(...registerables);

export default function VecrvDecayChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    // Small timeout ensures CSS variables (theme colors) are loaded before reading them
    const timeoutId = setTimeout(() => {
      
      // 1. Theme & Style Setup
      // ------------------------------------------------
      const styles = getComputedStyle(document.documentElement);
      const textColor = styles.getPropertyValue('--ifm-font-color-base').trim();
      const gridColor = styles.getPropertyValue('--ifm-color-emphasis-300').trim();
      
      // Handle tooltip background based on theme (Dark/Light)
      const cardBg = styles.getPropertyValue('--ifm-card-background-color').trim();
      const tooltipBg = (cardBg && cardBg !== 'transparent') 
        ? cardBg 
        : (colorMode === 'light' ? '#ffffff' : '#242526');

      // 2. Data Generation
      // ------------------------------------------------
      const MAX_LOCK_YEARS = 4;
      const dataPoints = [];
      
      // Create 100 points for a smooth line
      const steps = 100; 
      
      for (let i = 0; i <= steps; i++) {
        // Calculate years remaining (from 4 down to 0)
        const yearsRemaining = MAX_LOCK_YEARS - (i * (MAX_LOCK_YEARS / steps));
        
        // veCRV logic: Linear decay. 
        // If 4 years remaining = 100% power. 2 years = 50% power.
        const veCrvBalance = (yearsRemaining / MAX_LOCK_YEARS) * 100;

        dataPoints.push({
          x: yearsRemaining,
          y: veCrvBalance
        });
      }

      // 3. Chart Configuration
      // ------------------------------------------------
      const chartConfig = {
        type: 'line',
        data: {
          datasets: [{
            label: 'veCRV Power',
            data: dataPoints,
            borderColor: '#00D4AA', // Curve Green
            backgroundColor: 'rgba(0, 212, 170, 0.1)', // Light Green Fill
            fill: true,
            pointRadius: 0, // Clean line without dots
            pointHoverRadius: 6,
            pointHitRadius: 20,
            borderWidth: 3,
            tension: 0, // Straight lines (linear decay)
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'veCRV Voting Power Decay',
              font: { size: 16, weight: 'bold' },
              color: textColor,
              padding: { bottom: 20 }
            },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: gridColor,
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                // Tooltip Header
                title: (items) => {
                  return '';
                },
                // Tooltip Body
                label: (context) => {
                  const remaining = context.parsed.x;
                  const balance = context.parsed.y;
                  
                  // Calculate elapsed time based on Max Lock
                  const elapsed = MAX_LOCK_YEARS - remaining;

                  return [
                    `veCRV Power: ${balance.toFixed(1)}%`,
                    `Time Elapsed: ${elapsed.toFixed(2)} years`,
                    `Lock Remaining: ${remaining.toFixed(2)} years`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              reverse: true, // IMPORTANT: Makes axis go 4 -> 0
              title: {
                display: true,
                text: 'Time Remaining (Years)',
                color: textColor,
                font: { size: 12 }
              },
              ticks: {
                color: textColor,
                stepSize: 1, // Show tick every 1 year
              },
              grid: {
                color: gridColor,
                drawBorder: false,
              },
              min: 0,
              max: 4
            },
            y: {
              title: {
                display: true,
                text: 'veCRV Amount (%)',
                color: textColor,
                font: { size: 12 }
              },
              ticks: {
                color: textColor,
                stepSize: 25,
                callback: (val) => `${val}%`
              },
              grid: {
                color: gridColor,
                drawBorder: false,
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
      height: '350px', // Fixed height for better consistency
      width: '100%',
      maxWidth: '650px',
      margin: '0 auto 2rem auto',
    }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}