// src/components/Charts/CrvAllocation.js

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default function CrvAllocationChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // --- Data and Configuration ---
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
          },
          title: {
            display: true,
            text: 'CRV Supply Allocation',
            font: {
              size: 18
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const percentage = percentages[context.dataIndex];
                
                if (label) {
                  return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                }
                return `${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    // --- Chart Initialization and Cleanup ---
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      
      // Destroy the previous chart instance if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      
      // Create a new chart instance
      chartRef.current = new Chart(ctx, chartConfig);
    }

    // --- Cleanup on component unmount ---
    // Prevent memory leaks after page change
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

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