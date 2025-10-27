import { SeededRandom } from './random';

export interface ColorScheme {
  name: string;
  palette: string[];
  background: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: 'primary',
    palette: ['#FF0000', '#0000FF', '#FFFF00', '#00FF00', '#FF00FF'],
    background: '#FFFFFF',
  },
  {
    name: 'neon',
    palette: ['#FF1493', '#00FFFF', '#00FF00', '#FF00FF', '#FFFF00'],
    background: '#000000',
  },
  {
    name: 'pastel',
    palette: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFD1FF'],
    background: '#FFF8E1',
  },
  {
    name: 'earth',
    palette: ['#FF6B35', '#8B4513', '#228B22', '#F4A460', '#D2691E'],
    background: '#FFFACD',
  },
  {
    name: 'ocean',
    palette: ['#008080', '#000080', '#00CED1', '#4682B4', '#1E90FF'],
    background: '#F0F8FF',
  },
  {
    name: 'candy',
    palette: ['#FF1493', '#9400D3', '#00CED1', '#FF69B4', '#DA70D6'],
    background: '#FFF0F5',
  },
];

export function getRandomScheme(rng: SeededRandom): ColorScheme {
  return rng.choice(COLOR_SCHEMES);
}

export function getRandomColor(scheme: ColorScheme, rng: SeededRandom): string {
  return rng.choice(scheme.palette);
}

/**
 * Convert hex to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { h: 0, s: 0, l: 0 };
  }

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to hex
 */
export function hslToHex(hsl: { h: number; s: number; l: number }): string {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

