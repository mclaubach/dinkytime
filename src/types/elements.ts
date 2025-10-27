export interface PermanentElement {
  id: number;
  type: 'shape' | 'symbol' | 'word' | 'animal' | 'number';
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  baseScale: number;
  data: any;
  opacity?: number; // For fade-out animations
  fadingOut?: boolean; // Mark for removal
  birthTime?: number; // When element was created
}

export interface AnimatedElement extends PermanentElement {
  animation: 'bounce' | 'move' | 'spin' | 'grow' | 'explode';
  startTime: number;
  duration: number;
  velocity?: { x: number; y: number };
  easing: (t: number) => number;
  particles?: Array<{ x: number; y: number; vx: number; vy: number; life: number }>;
}

export interface BackgroundEffect {
  type: 'sparkle' | 'stars' | 'particles';
  params: Record<string, any>;
}

