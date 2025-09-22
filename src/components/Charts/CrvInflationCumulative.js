// src/components/Charts/CrvInflationCumulative.js

import React, { useState, useEffect } from 'react';

export default function CrvInflationCumulative() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Helper functions from the original JavaScript
  function roundAmount(amount) {
    if (amount > 100) {
      return Math.round(amount);
    } else {
      return Number(amount.toPrecision(3));
    }
  }

  function calcVestingAmount(chosenDate, vestingYears, vestingAmount) {
    // Vesting periods:
    // Early Users: 1 year
    // Core Team: 4 years  
    // Investors: 2 years
    // Employees: 2 years
    // Community Reserve: No vesting (fully available from launch)
    const referenceDate = new Date("2020-08-13");
    const timeDiff = Math.abs(chosenDate.getTime() - referenceDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < (365*vestingYears)) {
      var vestedPerDay = vestingAmount / (365*vestingYears);
      var totalVested = vestedPerDay * daysDiff;
      return [totalVested, vestedPerDay];
    } else {
      return [vestingAmount, 0];
    }
  }

  function calcEmissionsAmount(chosenDate) {
    const referenceDate = new Date("2020-08-13");
    if (chosenDate < referenceDate) {
      return [0, 0];
    }
    const timeDiff = Math.abs(chosenDate.getTime() - referenceDate.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const yearsDiff = Math.floor(daysDiff/365);
    const daysInCurrentYear = daysDiff % 365;
    let totalEmissions = 0;
    const emissionsReductionFactor = Math.pow(2, 1/4);
    const initialEmissions = 274815283

    for (let i = 0; i < yearsDiff; i++) {
      const yearlyEmissions = initialEmissions / Math.pow(emissionsReductionFactor, i);
      totalEmissions += yearlyEmissions;
    }

    const currentYearEmissions = initialEmissions / Math.pow(emissionsReductionFactor, yearsDiff);
    const currentDailyEmissions = currentYearEmissions / 365;
    const partialYearEmissions = currentDailyEmissions * daysInCurrentYear;
    totalEmissions += partialYearEmissions;

    return [totalEmissions+currentDailyEmissions, currentDailyEmissions];
  }

  function calcAmounts(chosenDate) {
    const community = calcEmissionsAmount(chosenDate);
    const earlyUsers = calcVestingAmount(chosenDate, 1, 151515152);
    const coreTeam = calcVestingAmount(chosenDate, 4, 800961153);
    const investors = calcVestingAmount(chosenDate, 2, 108129756);
    const employees = calcVestingAmount(chosenDate, 2, 90909091);
    // Community Reserve has no vesting period - fully available from launch
    const reserve = [151515152, 0];
    const vestingTotal = 1303030303;

    const totalEmitted = community[0] + earlyUsers[0] + coreTeam[0] + investors[0] + employees[0] + reserve[0];
    const dailyEmitted = community[1] + earlyUsers[1] + coreTeam[1] + investors[1] + employees[1] + reserve[1];
    const yearlyEmitted = dailyEmitted * 365;
    const inflationRate = yearlyEmitted / totalEmitted * 100;
    const maxSupply = 3030303032;
    const percentEmitted = totalEmitted / maxSupply * 100;
    const vestingRemaining = vestingTotal - earlyUsers[0] - coreTeam[0] - investors[0] - employees[0] - reserve[0];

    return {
      emissionsTotal: community[0],
      emissionsDaily: community[1],
      earlyUsersTotal: earlyUsers[0],
      earlyUsersDaily: earlyUsers[1],
      coreTeamTotal: coreTeam[0],
      coreTeamDaily: coreTeam[1],
      investorsTotal: investors[0],
      investorsDaily: investors[1],
      employeesTotal: employees[0],
      employeesDaily: employees[1],
      reserveTotal: reserve[0],
      reserveDaily: reserve[1],
      totalEmitted: totalEmitted,
      dailyEmitted: dailyEmitted,
      yearlyEmitted: yearlyEmitted,
      inflationRate: inflationRate,
      maxSupply: maxSupply,
      percentEmitted: percentEmitted,
      vestingRemaining: vestingRemaining
    };
  }

  function generateDatasets() {
    const datasets = {
      emissionsTotal: [],
      earlyUsersTotal: [],
      coreTeamTotal: [],
      investorsTotal: [],
      employeesTotal: [],
      reserveTotal: [],
      totalEmitted: [],
      percentEmitted: [],
      inflationRate: []
    };

    const startDate = new Date('2020-08-13');
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 10);

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 30)) {
      const amounts = calcAmounts(date);

      for (const key in amounts) {
        if (datasets[key]) {
          let value;
          if (key === 'percentEmitted' || key === 'inflationRate') {
            value = parseFloat(amounts[key].toFixed(2));
            datasets[key].push({ x: new Date(date), y: value });
          } else {
            value = Math.round(amounts[key]);
            datasets[key].push({ x: new Date(date), y: value });
          }
        }
      }
    }

    return datasets;
  }

  const [datasets, setDatasets] = useState(null);

  useEffect(() => {
    const generatedDatasets = generateDatasets();
    setDatasets(generatedDatasets);
  }, []);

  if (!datasets) return <div>Loading...</div>;

  // Use the same colors as CrvAllocationChart
  const categories = [
    { name: 'Community Reserve', color: '#f97316', key: 'reserveTotal' },
    { name: 'Employees', color: '#10b981', key: 'employeesTotal' },
    { name: 'Investors', color: '#8b5cf6', key: 'investorsTotal' },
    { name: 'Early Users', color: '#ef4444', key: 'earlyUsersTotal' },
    { name: 'Core Team', color: '#f59e0b', key: 'coreTeamTotal' },
    { name: 'Community (Emissions)', color: '#3b82f6', key: 'emissionsTotal' }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: '2rem', 
      margin: '2rem 0',
      marginTop: '3rem', // Increased top margin for more space from admonition
      maxWidth: '1000px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      {/* Chart */}
      <div style={{ flex: 1, position: 'relative' }}>
        
        <svg 
          width="600" 
          height="400" 
          viewBox="0 0 600 400"
          style={{ display: 'block' }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            // Only respond to hover within the actual plot area (x=50 to x=550)
            if (x >= 50 && x <= 550) {
              const relativeX = (x - 50) / 500; // Convert to 0-1 range
              const dataIndex = Math.round(relativeX * (datasets[categories[0].key].length - 1));
              const clampedDataIndex = Math.max(0, Math.min(datasets[categories[0].key].length - 1, dataIndex));
              
              if (datasets && datasets[categories[0].key] && datasets[categories[0].key][clampedDataIndex]) {
                const pointData = {};
                const hoveredDate = datasets[categories[0].key][clampedDataIndex].x;
                const year = hoveredDate.getFullYear();
                
                categories.forEach(category => {
                  if (datasets[category.key] && datasets[category.key][clampedDataIndex]) {
                    pointData[category.key] = datasets[category.key][clampedDataIndex].y;
                  }
                });
                setHoveredPoint({
                  year: year,
                  x: x,
                  data: pointData
                });
              }
            } else {
              // Clear hover when outside plot area
              setHoveredPoint(null);
            }
          }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines */}
          {[0, 500, 1000, 1500, 2000, 2500, 3000].map((value, index) => (
            <line
              key={index}
              x1="50"
              y1={50 + (3000 - value) / 3000 * 300}
              x2="550"
              y2={50 + (3000 - value) / 3000 * 300}
              stroke="var(--ifm-color-emphasis-200)"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis labels */}
          {[0, 500, 1000, 1500, 2000, 2500, 3000].map((value, index) => (
            <text
              key={index}
              x="45"
              y={50 + (3000 - value) / 3000 * 300 + 4}
              fontSize="12"
              fill="var(--ifm-color-emphasis-600)"
              textAnchor="end"
            >
              {value}M
            </text>
          ))}
          
          {/* X-axis labels */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((year, index) => {
            const x = 50 + (index / 10) * 500;
            return (
              <text
                key={index}
                x={x}
                y="375"
                fontSize="10"
                fill="var(--ifm-color-emphasis-600)"
                textAnchor="middle"
              >
                {2020 + year}
              </text>
            );
          })}
          
          {/* Stacked areas - render in reverse order so last category appears on top */}
          {categories.slice().reverse().map((category, reverseIndex) => {
            const categoryIndex = categories.length - 1 - reverseIndex;
            const points = datasets[category.key];
            if (points.length < 2) return null;
            
            // Calculate stacked values - each area should stack on top of the previous ones
            const stackedPoints = points.map((point, pointIndex) => {
              let bottomStack = 0;
              let topStack = 0;
              
              // Calculate bottom of this area (sum of all previous categories)
              for (let i = 0; i < categoryIndex; i++) {
                const currentCategory = categories[i];
                const currentPoints = datasets[currentCategory.key];
                if (currentPoints[pointIndex]) {
                  bottomStack += currentPoints[pointIndex].y / 1000000; // Convert to millions
                }
              }
              
              // Calculate top of this area (bottom + current category)
              topStack = bottomStack + (point.y / 1000000);
              
              return {
                x: point.x,
                bottomY: bottomStack,
                topY: topStack
              };
            });
            
            // Create the area path
            const topPath = stackedPoints.map((point, index) => {
              const x = 50 + (index / (stackedPoints.length - 1)) * 500;
              const y = 50 + (3000 - point.topY) / 3000 * 300;
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ');
            
            const bottomPath = stackedPoints.map((point, index) => {
              const x = 50 + (index / (stackedPoints.length - 1)) * 500;
              const y = 50 + (3000 - point.bottomY) / 3000 * 300;
              return `L ${x} ${y}`;
            }).reverse().join(' ');
            
            const areaPath = `${topPath} ${bottomPath} Z`;
            
            return (
              <path
                key={categoryIndex}
                d={areaPath}
                fill={category.color}
                opacity={0.6}
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease-in-out'
                }}
              />
            );
          })}
          
          {/* Vertical hover line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1="50"
              x2={hoveredPoint.x}
              y2="350"
              stroke="#666"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          )}
          
          {/* Hover points on each area */}
          {hoveredPoint && categories.map((category, categoryIndex) => {
            const value = hoveredPoint.data[category.key];
            if (!value) return null;
            
            // Calculate stacked position
            let stackedValue = 0;
            for (let i = 0; i <= categoryIndex; i++) {
              const currentCategory = categories[i];
              if (hoveredPoint.data[currentCategory.key]) {
                stackedValue += hoveredPoint.data[currentCategory.key] / 1000000; // Convert to millions
              }
            }
            
            const y = 50 + (3000 - stackedValue) / 3000 * 300;
            
            return (
              <circle
                key={category.key}
                cx={hoveredPoint.x}
                cy={y}
                r="4"
                fill={category.color}
                stroke="white"
                strokeWidth="2"
                opacity="0.9"
              />
            );
          })}
        </svg>
      </div>
      
      {/* Legend */}
      <div style={{ 
        flex: '0 0 220px', 
        height: '400px', // Fixed height to match chart
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header section - top 50px to match chart's top margin */}
        <div style={{ 
          height: '50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: '0.5rem'
        }}>
          <h4 style={{ 
            margin: '0 0 0.25rem 0', 
            color: 'var(--ifm-color-emphasis-900)',
            fontSize: '1rem',
            lineHeight: '1.2'
          }}>
            {hoveredPoint ? `Cumulative CRV Emitted by ${hoveredPoint.year}` : 'Cumulative CRV Emitted by 2030'}
          </h4>
          <p style={{ 
            fontSize: '0.75rem', 
            color: 'var(--ifm-color-emphasis-600)', 
            margin: '0',
            fontStyle: 'italic',
            lineHeight: '1.2'
          }}>
            Total amount of CRV distributed to each category up to this point in time
          </p>
        </div>

        {/* Legend items section - middle 300px to match chart's plot area */}
        <div style={{ 
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {categories.map((category, index) => {
            const isHovered = hoveredIndex === index;
            
            // Calculate percentage and value for hovered category
            let percentage = '';
            let currentValue = '';
            
            if (hoveredPoint && hoveredPoint.data[category.key]) {
              // Show cumulative emitted amounts when hovering over chart
              const value = hoveredPoint.data[category.key];
              const totalEmitted = Object.values(hoveredPoint.data).reduce((sum, val) => sum + val, 0);
              percentage = totalEmitted > 0 ? ` (${((value / totalEmitted) * 100).toFixed(1)}%)` : '';
              currentValue = `${roundAmount(value).toLocaleString()} CRV`;
            } else if (isHovered && datasets[category.key] && datasets[category.key].length > 0) {
              // Show final year data when hovering over legend
              const latestValue = datasets[category.key][datasets[category.key].length - 1].y;
              const totalEmitted = categories.reduce((sum, cat) => {
                if (datasets[cat.key] && datasets[cat.key].length > 0) {
                  return sum + datasets[cat.key][datasets[cat.key].length - 1].y;
                }
                return sum;
              }, 0);
              percentage = totalEmitted > 0 ? ` (${((latestValue / totalEmitted) * 100).toFixed(1)}%)` : '';
              currentValue = `${roundAmount(latestValue).toLocaleString()} CRV`;
            } else {
              // Show default final year data when not hovering
              if (datasets[category.key] && datasets[category.key].length > 0) {
                const latestValue = datasets[category.key][datasets[category.key].length - 1].y;
                const totalEmitted = categories.reduce((sum, cat) => {
                  if (datasets[cat.key] && datasets[cat.key].length > 0) {
                    return sum + datasets[cat.key][datasets[cat.key].length - 1].y;
                  }
                  return sum;
                }, 0);
                percentage = totalEmitted > 0 ? ` (${((latestValue / totalEmitted) * 100).toFixed(1)}%)` : '';
                currentValue = `${roundAmount(latestValue).toLocaleString()} CRV`;
              }
            }
            
            return (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  marginBottom: '0.5rem',
                  padding: '0.4rem',
                  borderRadius: '4px',
                  backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'background-color 0.2s ease-in-out',
                  cursor: 'pointer',
                  minHeight: '45px'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: category.color,
                    borderRadius: '50%',
                    marginRight: '0.5rem',
                    marginTop: '2px',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.2s ease-in-out',
                    flexShrink: 0
                  }}
                />
                <div style={{ 
                  fontWeight: isHovered ? '600' : '400',
                  fontSize: '0.85rem',
                  color: 'var(--ifm-color-emphasis-700)',
                  lineHeight: '1.3'
                }}>
                  <div style={{ marginBottom: '1px' }}>
                    <strong style={{ color: 'var(--ifm-color-emphasis-900)' }}>{category.name}</strong>
                  </div>
                  {currentValue && (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--ifm-color-emphasis-600)', 
                      fontWeight: 'normal',
                      marginBottom: '1px'
                    }}>
                      {currentValue}
                    </div>
                  )}
                  {percentage && (
                    <div style={{ 
                      fontSize: '0.7rem', 
                      color: 'var(--ifm-color-emphasis-500)', 
                      fontWeight: 'normal'
                    }}>
                      {percentage}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom spacing - 50px to match chart's bottom margin */}
        <div style={{ height: '50px' }}></div>
      </div>
    </div>
  );
}
