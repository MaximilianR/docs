import React, { useState, useEffect, useRef } from 'react';

const LendingRateChart = () => {
  const [minRate, setMinRate] = useState(1);
  const [maxRate, setMaxRate] = useState(66);
  const [hoverData, setHoverData] = useState(null);
  const canvasRef = useRef(null);

  // Semi-log formula: rate = rate_min * (rate_max / rate_min)^utilization
  const calculateRate = (utilization, min, max) => {
    if (utilization === 0) return min;
    if (utilization === 100) return max;
    
    const util = utilization / 100;
    const minRate = min / 100;
    const maxRate = max / 100;
    
    return minRate * Math.pow(maxRate / minRate, util) * 100;
  };

  const updateChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set high DPI for crisp rendering
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Draw chart
    const width = rect.width;
    const height = rect.height;
    const padding = 80;
    
    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (utilization)
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (width - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines (rate)
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * (height - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels (utilization)
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (width - 2 * padding);
      const label = `${i * 10}%`;
      ctx.fillText(label, x, height - padding + 25);
    }
    
    // Y-axis labels (rate)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i++) {
      const y = height - padding - (i / 10) * (height - 2 * padding);
      const rate = minRate + (i / 10) * (maxRate - minRate);
      const label = `${rate.toFixed(1)}%`;
      ctx.fillText(label, padding - 15, y + 4);
    }
    
    // Draw curve with gradient
    const gradient = ctx.createLinearGradient(padding, 0, width - padding, 0);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1d4ed8');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    for (let i = 0; i <= 200; i++) {
      const utilization = (i / 200) * 100;
      const rate = calculateRate(utilization, minRate, maxRate);
      const x = padding + (utilization / 100) * (width - 2 * padding);
      const y = height - padding - (rate / maxRate) * (height - 2 * padding);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw hover point if hovering
    if (hoverData) {
      // Draw shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(hoverData.x, hoverData.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(hoverData.x, hoverData.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Draw tooltip
      const tooltipWidth = 140;
      const tooltipHeight = 60;
      const tooltipX = Math.min(hoverData.x + 15, width - tooltipWidth - 20);
      const tooltipY = Math.max(hoverData.y - tooltipHeight - 15, padding);
      
      // Tooltip background with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Tooltip text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Utilization: ${hoverData.utilization}%`, tooltipX + 12, tooltipY + 20);
      ctx.fillText(`Rate: ${hoverData.rate.toFixed(2)}%`, tooltipX + 12, tooltipY + 40);
    }
    
    // Draw axis titles
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Utilization (%)', width / 2, height - 15);
    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Borrow Rate (%)', 0, 0);
    ctx.restore();
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const padding = 80;
    const width = rect.width;
    const height = rect.height;
    
    // Check if mouse is within chart area
    if (x >= padding && x <= width - padding && y >= padding && y <= height - padding) {
      const utilization = Math.round(((x - padding) / (width - 2 * padding)) * 100);
      const rate = calculateRate(utilization, minRate, maxRate);
      const chartY = height - padding - (rate / maxRate) * (height - 2 * padding);
      
      setHoverData({
        x: x,
        y: chartY,
        utilization: utilization,
        rate: rate
      });
    } else {
      setHoverData(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  useEffect(() => {
    updateChart();
  }, [minRate, maxRate, hoverData]);

  return (
    <div style={{ 
      margin: '0.25rem 0', 
      padding: '0.5rem', 
      border: '1px solid #e5e7eb', 
      borderRadius: '4px', 
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        marginBottom: '0', 
        flexWrap: 'wrap', 
        alignItems: 'center' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <label htmlFor="minRate" style={{ fontWeight: '600', color: '#374151', fontSize: '13px' }}>
            Min Rate (%):
          </label>
          <input
            id="minRate"
            type="number"
            value={minRate}
            onChange={(e) => setMinRate(parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="1"
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              width: '50px',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <label htmlFor="maxRate" style={{ fontWeight: '600', color: '#374151', fontSize: '13px' }}>
            Max Rate (%):
          </label>
          <input
            id="maxRate"
            type="number"
            value={maxRate}
            onChange={(e) => setMaxRate(parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="1"
            style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              width: '50px',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
      </div>

      <canvas 
        ref={canvasRef}
        style={{ 
          display: 'block', 
          margin: '0 auto', 
          cursor: 'crosshair',
          borderRadius: '4px',
          maxWidth: '100%',
          height: '350px'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      <div style={{ 
        marginTop: '0.25rem', 
        padding: '0.5rem', 
        backgroundColor: '#f9fafb', 
        borderRadius: '4px',
        fontSize: '0.8rem',
        border: '1px solid #f3f4f6'
      }}>
        <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: '#374151' }}>
          How it works:
        </p>
        <p style={{ margin: '0', lineHeight: '1.3', color: '#6b7280' }}>
          The rate follows a semi-logarithmic curve: <strong style={{ color: '#374151' }}>rate = min_rate × (max_rate ÷ min_rate)^utilization</strong>. 
          This creates a smooth curve that starts low and increases exponentially as utilization rises, 
          encouraging early borrowing while preventing over-utilization.
        </p>
      </div>
    </div>
  );
};

export default LendingRateChart; 