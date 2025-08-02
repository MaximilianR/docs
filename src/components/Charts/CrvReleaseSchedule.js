// src/components/Charts/CrvReleaseSchedule.js

import React, { useState } from 'react';
import { crvInflationData } from '@site/src/data/crv_inflation';

export default function CrvReleaseScheduleChart() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Use the JavaScript data directly
  const processedData = crvInflationData;

  // Categories for the chart
  const categories = [
    { 
      name: 'Early Users', 
      color: '#ef4444',
      key: 'earlyUsers'
    },
    { 
      name: 'Core Team', 
      color: '#3b82f6',
      key: 'coreTeam'
    },
    { 
      name: 'Investors', 
      color: '#f59e0b',
      key: 'investors'
    },
    { 
      name: 'Employees', 
      color: '#10b981',
      key: 'employees'
    },
    { 
      name: 'Community Reserve', 
      color: '#8b5cf6',
      key: 'reserve'
    }
  ];

  // Format CRV amount
  const formatCRV = (amount) => {
    return (amount / 1000000).toFixed(0) + 'M';
  };

  // Get the final values for legend
  const finalValues = processedData[processedData.length - 1];

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '2rem', 
      margin: '2rem 0',
      maxWidth: '1000px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      {/* Chart */}
      <div style={{ flex: 1, position: 'relative' }}>
        <svg width="600" height="400" viewBox="0 0 600 400">
          {/* Grid lines */}
          {[0, 500, 1000, 1500, 2000, 2500].map((value, index) => (
            <line
              key={index}
              x1="50"
              y1={400 - (value / 2500) * 300}
              x2="550"
              y2={400 - (value / 2500) * 300}
              stroke="var(--ifm-color-emphasis-200)"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 500, 1000, 1500, 2000, 2500].map((value, index) => (
            <text
              key={index}
              x="45"
              y={400 - (value / 2500) * 300 + 4}
              fontSize="12"
              fill="var(--ifm-color-emphasis-600)"
              textAnchor="end"
            >
              {value}M
            </text>
          ))}
          
          {/* X-axis labels */}
          {processedData.filter((_, index) => index % 3 === 0).map((dataPoint, index) => {
            const x = 50 + (index * 3 / processedData.length) * 500;
            return (
              <text
                key={index}
                x={x}
                y="395"
                fontSize="10"
                fill="var(--ifm-color-emphasis-600)"
                textAnchor="middle"
              >
                Year {dataPoint.year}
              </text>
            );
          })}
          
          {/* Stacked areas */}
          {processedData.map((dataPoint, dataIndex) => {
            if (dataIndex === 0) return null;
            
            const prevDataPoint = processedData[dataIndex - 1];
            
            return categories.map((category, categoryIndex) => {
              const currentValue = dataPoint[category.key];
              const prevValue = prevDataPoint[category.key];
              
              const x1 = 50 + (dataIndex - 1) / (processedData.length - 1) * 500;
              const x2 = 50 + dataIndex / (processedData.length - 1) * 500;
              const y1 = 400 - (prevValue / 2500000000) * 300;
              const y2 = 400 - (currentValue / 2500000000) * 300;
              
              // Calculate stacked position
              let prevStack = 0;
              let currentStack = 0;
              
              for (let i = 0; i < categoryIndex; i++) {
                prevStack += prevDataPoint[categories[i].key];
                currentStack += dataPoint[categories[i].key];
              }
              
              const y3 = 400 - ((prevStack + prevValue) / 2500000000) * 300;
              const y4 = 400 - ((currentStack + currentValue) / 2500000000) * 300;
              
              return (
                <path
                  key={`${dataIndex}-${categoryIndex}`}
                  d={`M ${x1} ${y1} L ${x2} ${y2} L ${x2} ${y4} L ${x1} ${y3} Z`}
                  fill={category.color}
                  opacity={hoveredIndex === categoryIndex ? 0.8 : 0.6}
                  style={{
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease-in-out'
                  }}
                  onMouseEnter={() => setHoveredIndex(categoryIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            });
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div style={{ flex: '0 0 300px' }}>
        <div style={{ marginBottom: '1rem' }}>
          {categories.map((category, index) => {
            const isHovered = hoveredIndex === index;
            const finalValue = finalValues[category.key];
            return (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '0.75rem',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'background-color 0.2s ease-in-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: category.color,
                    borderRadius: '50%',
                    marginRight: '0.75rem',
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                />
                <span style={{ 
                  fontWeight: isHovered ? '600' : '400',
                  fontSize: '0.95rem',
                  color: 'var(--ifm-color-emphasis-700)'
                }}>
                  <strong style={{ color: 'var(--ifm-color-emphasis-900)' }}>{category.name}:</strong> {formatCRV(finalValue)} CRV
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 