// Semi-log formula: rate = rate_min * (rate_max / rate_min)^utilization
function calculateRate(utilization, min, max) {
  if (utilization === 0) return min;
  if (utilization === 100) return max;
  
  const util = utilization / 100;
  const minRate = min / 100;
  const maxRate = max / 100;
  
  return minRate * Math.pow(maxRate / minRate, util) * 100;
}

function updateChart() {
  const minRate = parseFloat(document.getElementById('minRate').value) || 0;
  const maxRate = parseFloat(document.getElementById('maxRate').value) || 0;
  
  const canvas = document.getElementById('rateChart');
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw chart
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  for (let i = 0; i <= 100; i++) {
    const rate = calculateRate(i, minRate, maxRate);
    const x = padding + (i / 100) * (width - 2 * padding);
    const y = height - padding - (rate / maxRate) * (height - 2 * padding);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
  
  // Draw axes
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Draw labels
  ctx.fillStyle = '#000';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Utilization (%)', width / 2, height - 10);
  ctx.save();
  ctx.translate(20, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Borrow Rate (%)', 0, 0);
  ctx.restore();
}

// Initialize chart
document.addEventListener('DOMContentLoaded', function() {
  updateChart();
  
  // Add event listeners
  document.getElementById('minRate').addEventListener('input', updateChart);
  document.getElementById('maxRate').addEventListener('input', updateChart);
}); 