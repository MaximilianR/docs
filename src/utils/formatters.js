// src/utils/formatters.js

/**
 * Formats a large number into a human-readable string with a magnitude suffix (k, M, B).
 * Limits the output to 3 decimal places.
 *
 * @param {number | null | undefined} num The number to format.
 * @returns {string} The formatted number string.
 */
export function formatNumber(num, sigFigures=3) {
  if (num === null || num === undefined || typeof num !== 'number' || isNaN(num)) {
    return '0.000';
  }

  const absNum = Math.abs(num);
  const billion = 1_000_000_000;
  const million = 1_000_000;
  const thousand = 1_000;

  if (absNum >= billion) {
    return (num / billion).toPrecision(sigFigures) + ' B';
  }
  if (absNum >= million) {
    return (num / million).toPrecision(sigFigures) + ' M';
  }
  if (absNum >= thousand) {
    return (num / thousand).toPrecision(sigFigures) + ' k';
  }

  return num.toPrecision(sigFigures);
}
