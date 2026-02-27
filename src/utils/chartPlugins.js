/**
 * Shared Chart.js plugins for pool parameter charts.
 */

/**
 * Draws crosshair lines at the 50% balance point:
 * - Vertical red dashed line at x=50 ("perfect balance")
 * - Horizontal yellow dashed line at the corresponding y value ("center of liquidity")
 *
 * Reads CSS variables at draw time so colors update on theme toggle.
 */
export const centerLinePlugin = {
  id: 'centerLine',
  beforeDatasetsDraw(chart) {
    const css = getComputedStyle(document.documentElement);
    const txtColor = css.getPropertyValue('--ifm-color-emphasis-800').trim() || '#000';

    const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;

    const dataset = chart.data.datasets[0].data;
    const midpoint = dataset.find(d => d.x === 50);

    const xPos = x.getPixelForValue(50);
    const yPos = y.getPixelForValue(midpoint.y);
    ctx.save();

    // Vertical dashed line at 50% balance
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#D41E26';
    ctx.setLineDash([4, 4]);
    ctx.moveTo(xPos, top);
    ctx.lineTo(xPos, bottom);
    ctx.stroke();

    // Vertical label
    ctx.font = '12px system-ui';
    ctx.fillStyle = txtColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('perfect balance', xPos+5, top + 5);

    // Horizontal dashed line at center price
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFC300';
    ctx.setLineDash([4, 4]);
    ctx.moveTo(left, yPos);
    ctx.lineTo(right, yPos);
    ctx.stroke();

    // Horizontal label
    ctx.font = '12px system-ui';
    ctx.fillStyle = txtColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('center of liquidity', right -5, yPos - 15);

    ctx.restore();
  }
};
