// src/components/Charts/CrvAllocation.js

import React, { useState } from 'react';
import { useMobile } from '@site/src/hooks/useMobile';

export default function CrvAllocationChart() {
  const isMobile = useMobile();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const data = [
    { label: 'Community (Emissions)', percentage: 57.0, amount: '1,879M CRV', color: '#3b82f6' },
    { label: 'Core Team', percentage: 26.4, amount: '801M CRV', color: '#f59e0b' },
    { label: 'Early Users', percentage: 5.0, amount: '152M CRV', color: '#ef4444' },
    { label: 'Community Reserve', percentage: 5, amount: '152M CRV', color: '#f97316' },
    { label: 'Investors', percentage: 3.6, amount: '108M CRV', color: '#8b5cf6' },
    { label: 'Employees', percentage: 3, amount: '91M CRV', color: '#10b981' },
  ];

  // Calculate SVG circle parameters
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  const getHoverColor = (baseColor, isHovered) => {
    if (!isHovered) return baseColor;
    // Lighten the color on hover
    return baseColor + '80'; // Add transparency for hover effect
  };

  // Helper function to render circles
  const renderCircles = (onHover = null) => {
    let currentOffset = 0;
    return data.map((item, index) => {
      const strokeDasharray = (item.percentage / 100) * circumference;
      const strokeDashoffset = -currentOffset;
      currentOffset += strokeDasharray;
      const isHovered = hoveredIndex === index;
      
      return (
        <circle
          key={index}
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={onHover ? getHoverColor(item.color, isHovered) : item.color}
          strokeWidth={onHover && isHovered ? "65" : "60"}
          strokeDasharray={`${strokeDasharray} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          style={onHover ? {
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            filter: isHovered ? 'drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'none',
          } : {}}
          onMouseEnter={onHover ? () => setHoveredIndex(index) : undefined}
          onMouseLeave={onHover ? () => setHoveredIndex(null) : undefined}
        />
      );
    });
  };

  // Mobile: simplified static version
  if (isMobile) {
    return (
      <div style={{ 
        margin: '2rem 0',
        maxWidth: '100%'
      }}>
        {/* Static donut chart - smaller for mobile */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <svg width="250" height="250" viewBox="0 0 300 300">
            {renderCircles()}
          </svg>
        </div>
        
        {/* Legend - simplified, no hover */}
        <div>
          {data.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '0.5rem',
                padding: '0.4rem',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: item.color,
                  borderRadius: '50%',
                  marginRight: '0.75rem',
                  flexShrink: 0,
                }}
              />
              <span style={{ 
                fontSize: '0.9rem',
                color: 'var(--ifm-color-emphasis-700)'
              }}>
                <strong style={{ color: 'var(--ifm-color-emphasis-900)' }}>{item.label}:</strong> {item.percentage}% ({item.amount})
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: full interactive version
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '2rem', 
      margin: '2rem 0',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <svg width="300" height="300" viewBox="0 0 300 300">
          {renderCircles(true)}
        </svg>
        
        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            {data[hoveredIndex].label}
            <br />
            {data[hoveredIndex].percentage}% ({data[hoveredIndex].amount})
          </div>
        )}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '1rem' }}>
          {data.map((item, index) => {
            const isHovered = hoveredIndex === index;
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
                    backgroundColor: item.color,
                    borderRadius: '50%',
                    marginRight: '0.75rem',
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                />
                <span style={{ 
                  fontWeight: '400',
                  fontSize: '0.95rem',
                  color: 'var(--ifm-color-emphasis-700)'
                }}>
                  <strong style={{ color: 'var(--ifm-color-emphasis-900)' }}>{item.label}:</strong> {item.percentage}% ({item.amount})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}