export function formatPainArea(value: string) {
  if (value === 'NONE') return 'General wellness';

  return value
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
