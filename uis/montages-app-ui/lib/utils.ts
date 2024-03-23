export function asIntPercentage(n: number) {
  return `${Math.round(n)}%`;
}

export function asCurrency(x: number) {
  // Input should be int/floatd
  if (isNaN(x)) return null;

  x = parseInt(x.toString());
  return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function pixelsToMeters(pixels: number, dpi: number = 150): number {
  // 1 inch = 0.0254 meters
  const inchToMeter = 0.0254;
  // Calculate inches
  const inches = pixels / dpi;
  // Convert inches to meters
  const meters = inches * inchToMeter;
  return meters;
}
