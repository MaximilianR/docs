import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
Chart.register(...registerables);

const CollateralConversion = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  const [bottomRange, setBottomRange] = useState(2311.92);
  const [topRange, setTopRange] = useState(2556.35);
  const [sliderValue, setSliderValue] = useState(50);
  const [collateral, setCollateral] = useState(1);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Collateral'],
          datasets: [
            {
              label: 'ETH',
              data: [0],
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
              yAxisID: 'y'
            },
            {
              label: 'crvUSD',
              data: [0],
              backgroundColor: 'rgba(58, 124, 73, 255)',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              stacked: false,
              categoryPercentage: 0.8,
              barPercentage: 0.9,
              title: {
                display: false,
                text: 'Collateral'
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              beginAtZero: true,
              title: {
                display: true,
                text: 'ETH Collateral'
              },
              ticks: {
                callback: function(value) {
                  return value.toFixed(2) + ' ETH';
                }
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              beginAtZero: true,
              title: {
                display: true,
                text: 'crvUSD Collateral'
              },
              ticks: {
                callback: function(value) {
                  return value.toFixed(0) + ' crvUSD';
                }
              },
              grid: {
                drawOnChartArea: false,
              },
            }
          },
          plugins: {
            legend: {
              display: true
            },
            title: {
              display: false,
              text: 'Soft-Liquidation Collateral Conversion'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  if (label === 'ETH') {
                    return context.parsed.y.toFixed(2) + ' ETH';
                  } else {
                    return context.parsed.y.toFixed(2) + ' crvUSD';
                  }
                }
              }
            }
          }
        }
      });

      // Initial update
      updateChart();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const updateChart = () => {
    if (!chartInstance.current) return;

    const ethPercentage = sliderValue;
    const crvUSDPercentage = 100 - ethPercentage;
    const currentPrice = bottomRange + (topRange - bottomRange) * (sliderValue / 100);
    const avgSellPrice = (topRange + currentPrice) / 2;
    const eth = (ethPercentage / 100) * collateral;
    const crvUSDEth = (crvUSDPercentage / 100) * collateral;
    const crvUSDValue = crvUSDEth * avgSellPrice;

    chartInstance.current.data.datasets[0].data = [eth];
    chartInstance.current.data.datasets[1].data = [crvUSDValue];

    chartInstance.current.options.scales.y.max = Math.ceil(collateral);
    chartInstance.current.options.scales.y1.max = Math.ceil(topRange * collateral);

    chartInstance.current.update();
  };

  useEffect(() => {
    updateChart();
  }, [bottomRange, topRange, sliderValue, collateral]);

  const currentPrice = bottomRange + (topRange - bottomRange) * (sliderValue / 100);
  const ethPercentage = sliderValue;
  const crvUSDPercentage = 100 - ethPercentage;
  const avgSellPrice = (topRange + currentPrice) / 2;
  const eth = (ethPercentage / 100) * collateral;
  const crvUSDEth = (crvUSDPercentage / 100) * collateral;
  const crvUSDValue = crvUSDEth * avgSellPrice;

  return (
    <div style={{ width: '80%', margin: '0 auto', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h3 style={{ margin: '5px 0 10px', fontWeight: 'bold' }}>Visualisation of the Liquidation Process</h3>
      
      <div style={{ marginTop: '5px' }}>
        <input 
          type="hidden" 
          value={collateral} 
          min="0" 
          step="0.1"
        />
      </div>
      
      <div style={{ position: 'relative', marginTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span>Bottom of Liquidation Range</span>
          <span>Top of Liquidation Range</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
          <input 
            type="number" 
            value={bottomRange}
            onChange={(e) => setBottomRange(Number(e.target.value))}
            style={{ border: '1px solid #ccc', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f8f9fa', width: '100px' }}
          />
          <span style={{ fontWeight: 'bold' }}>${currentPrice.toFixed(2)}</span>
          <input 
            type="number" 
            value={topRange}
            onChange={(e) => setTopRange(Number(e.target.value))}
            style={{ border: '1px solid #ccc', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f8f9fa', width: '100px' }}
          />
        </div>
        <input 
          type="range" 
          style={{ width: '100%' }} 
          min="0" 
          max="100" 
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
        />
      </div>
      
      <canvas ref={chartRef}></canvas>
      
      <div style={{ textAlign: 'center', marginTop: '5px' }}>
        Collateral: {eth.toFixed(2)} ETH, {crvUSDValue.toFixed(2)} crvUSD<br/>
        Average Swap Price: {avgSellPrice.toFixed(2)} crvUSD/ETH<br/>
        ETH Swapped to crvUSD: {crvUSDPercentage}%
      </div>
    </div>
  );
};

export default CollateralConversion;
