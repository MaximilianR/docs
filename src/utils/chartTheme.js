/**
 * Reads chart-relevant CSS custom properties from the document root.
 * Call inside a component body (after mount) so `document` is available.
 *
 * NOTE: Each chart component must still call `useColorMode()` — the hook
 * triggers a React re-render on theme toggle even though the actual colors
 * come from CSS variables resolved here.
 */
export function getChartColors() {
  const css = getComputedStyle(document.documentElement);
  return {
    primaryColor: css.getPropertyValue('--ifm-color-primary-light').trim() || '#3eaf7c',
    txtColor:     css.getPropertyValue('--ifm-color-emphasis-800').trim() || '#1f2937',
    gridColor:    css.getPropertyValue('--ifm-color-emphasis-200').trim() || '#e5e7eb',
    bgColor:      css.getPropertyValue('--ifm-background-color').trim() || '#ffffff',
  };
}
