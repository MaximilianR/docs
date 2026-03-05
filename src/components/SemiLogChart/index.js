import React, { useState, useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

const SemiLogChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [hoveredRate, setHoveredRate] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      // Generate data points for the semi-log curve
      const generateSemiLogData = () => {
        const data = [];
        const minRate = 0.01; // 1%
        const maxRate = 0.80; // 80%

        for (let utilization = 0; utilization <= 1; utilization += 0.01) {
          // Semi-log formula: rate = rate_min * (rate_max / rate_min)^utilization
          const rate = minRate * Math.pow(maxRate / minRate, utilization);
          
          data.push({
            x: utilization * 100, // Convert to percentage
            y: rate * 100 // Convert to percentage
          });
        }
        return data;
      };

      const data = generateSemiLogData();

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Borrow Rate',
            data: data,
            borderColor: '#00D4AA',
            backgroundColor: 'rgba(0, 212, 170, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#00D4AA',
            pointHoverBorderColor: '#ffffff',
            pointHoverBorderWidth: 2
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
            tooltip: {
              enabled: false,
              external: function(context) {
                const tooltipEl = document.getElementById('chartjs-tooltip');
                if (context.tooltip.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
                }

                const position = context.chart.canvas.getBoundingClientRect();

                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + context.tooltip.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + context.tooltip.caretY + 'px';
                tooltipEl.style.font = '14px Arial, sans-serif';
                tooltipEl.style.pointerEvents = 'none';

                if (context.tooltip.body) {
                  const titleLines = context.tooltip.title || [];
                  const bodyLines = context.tooltip.body.map(b => b.lines);

                  let innerHtml = '<div>';

                  titleLines.forEach(title => {
                    innerHtml += '<div style="font-weight: bold; margin-bottom: 5px;">' + title + '</div>';
                  });

                  bodyLines.forEach((body, i) => {
                    const colors = context.tooltip.labelColors[i];
                    let style = 'background:' + colors.backgroundColor;
                    style += '; border-color:' + colors.borderColor;
                    style += '; border-width: 2px';
                    const span = '<span style="display:inline-block;width:10px;height:10px;margin-right:10px;' + style + '"></span>';
                    innerHtml += '<div>' + span + body + '</div>';
                  });

                  innerHtml += '</div>';
                  tooltipEl.innerHTML = innerHtml;
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              display: true,
              title: {
                display: true,
                text: 'Utilization Rate (%)',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              min: 0,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            y: {
              type: 'linear',
              display: true,
              title: {
                display: true,
                text: 'Borrow Rate (%)',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              min: 0,
              max: 80,
              ticks: {
                callback: function(value) {
                  return value.toFixed(1) + '%';
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          onHover: (event, activeElements) => {
            if (activeElements.length > 0) {
              const dataIndex = activeElements[0].index;
              const utilization = data[dataIndex].x;
              const rate = data[dataIndex].y;
              setHoveredRate({ utilization, rate });
            } else {
              setHoveredRate(null);
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <canvas ref={chartRef} />
      <div
        id="chartjs-tooltip"
        style={{
          opacity: 0,
          position: 'absolute',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '4px',
          padding: '8px 12px',
          fontSize: '12px',
          pointerEvents: 'none',
          zIndex: 1000
        }}
      />
      {hoveredRate && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 212, 170, 0.9)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          Utilization: {hoveredRate.utilization.toFixed(1)}%<br />
          Rate: {hoveredRate.rate.toFixed(2)}%
        </div>
      )}
    </div>
  );
};

export default SemiLogChart;
