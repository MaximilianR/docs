// src/components/Charts/VecrvVotingDecayChart.js

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useColorMode } from '@docusaurus/theme-common';

Chart.register(...registerables);

export default function VecrvVotingDecayChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // 1. Theme & Style Setup
      const styles = getComputedStyle(document.documentElement);
      const textColor = styles.getPropertyValue('--ifm-font-color-base').trim();
      const gridColor = styles.getPropertyValue('--ifm-color-emphasis-300').trim();
      const cardBg = styles.getPropertyValue('--ifm-card-background-color').trim();
      const tooltipBg = (cardBg && cardBg !== 'transparent') 
        ? cardBg 
        : (colorMode === 'light' ? '#ffffff' : '#242526');

      // 2. Data Generation
      // ------------------------------------------------
      const VOTE_DURATION_DAYS = 7;
      const DECAY_THRESHOLD = 3.5; // Power decays when less than 3.5 days remain
      const dataPoints = [];
      const steps = 140; // High resolution for the sharp corner at 3.5 days

      for (let i = 0; i <= steps; i++) {
        // Calculate Time Remaining (starts at 7, goes down to 0)
        const daysRemaining = VOTE_DURATION_DAYS - (i * (VOTE_DURATION_DAYS / steps));
        
        let powerPercent;

        if (daysRemaining >= DECAY_THRESHOLD) {
          // First 3.5 days (when remaining time is high): 100% Power
          powerPercent = 100;
        } else {
          // Last 3.5 days: Linear decay from 100% to 0%
          // Formula: (Remaining / 3.5) * 100
          powerPercent = (daysRemaining / DECAY_THRESHOLD) * 100;
        }

        dataPoints.push({
          x: daysRemaining,
          y: powerPercent
        });
      }

      // 3. Chart Configuration
      // ------------------------------------------------
      const chartConfig = {
        type: 'line',
        data: {
          datasets: [{
            label: 'Voting Power',
            data: dataPoints,
            borderColor: '#00D4AA', // Curve Green
            backgroundColor: 'rgba(0, 212, 170, 0.1)',
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHitRadius: 10,
            borderWidth: 3,
            tension: 0 // Must be 0 to keep the corner sharp at 3.5 days
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
              text: 'Voting Power Decay (7 Day Vote)',
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
                title: (items) => {
                  if (!items.length) return '';
                  const remaining = items[0].parsed.x;
                  return `${remaining.toFixed(2)} Days Remaining`;
                },
                label: (context) => {
                  const remaining = context.parsed.x;
                  const power = context.parsed.y;
                  const elapsed = VOTE_DURATION_DAYS - remaining;
                  
                  return [
                    `Voting Power: ${power.toFixed(1)}%`,
                    `Time Elapsed: ${elapsed.toFixed(2)} days`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              reverse: true, // Axis goes 7 -> 0
              title: {
                display: true,
                text: 'Voting Time Remaining (Days)',
                color: textColor,
                font: { size: 12 }
              },
              ticks: {
                color: textColor,
                stepSize: 1,
              },
              grid: {
                color: gridColor,
                drawBorder: false,
              },
              min: 0,
              max: 7
            },
            y: {
              title: {
                display: true,
                text: 'Voting Power (%)',
                color: textColor,
                font: { size: 12 }
              },
              ticks: {
                color: textColor,
                stepSize: 20,
                callback: function(value) {
                  if (value > 100) return null;
                  return `${value}%`;
                }
              },
              grid: {
                color: gridColor,
                drawBorder: false,
              },
              min: 0,
              max: 110
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
      height: '300px',
      width: '100%',
      maxWidth: '650px',
      margin: '0 auto 2rem auto',
    }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}