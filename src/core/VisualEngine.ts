import type { PermanentElement, AnimatedElement } from '../types/elements';
import { SeededRandom } from '../utils/random';
import type { ColorScheme } from '../utils/colors';
import { hexToHsl, hslToHex } from '../utils/colors';
import { drawShape, drawTextWithOutline } from '../utils/shapes';
import { CONFIG } from '../constants/config';
import { ANIMALS, SHAPES, SYMBOLS, BABY_WORDS, NUMBERS } from '../constants/distributions';

/**
 * VisualEngine - The LIVING Canvas
 * 
 * Elements breathe, shimmer, and leave ghost trails
 */
interface DrawingStroke {
  points: Array<{ x: number; y: number }>;
  color: string;
  thickness: number;
  pattern: 'solid' | 'dashed' | 'dotted' | 'wavy';
}

interface MathFlash {
  id: number;
  equation: string;
  result: string;
  x: number;
  y: number;
  color: string;
  startTime: number;
  duration: number;
}

export class VisualEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private permanentElements: PermanentElement[] = [];
  private animatedElements: AnimatedElement[] = [];
  private backgroundColor: string = '#FFFFFF';
  private animationFrameId: number | null = null;
  private startTime: number = Date.now();
  private colorScheme: ColorScheme;
  private rng: SeededRandom;
  private elementIdCounter = 0;
  private readonly MAX_BREATHING_ELEMENTS = 40; // Only recent 40 breathe
  private readonly MAX_PERMANENT_ELEMENTS = 100; // Total permanent cap (higher limit!)
  private readonly FADE_OUT_DURATION = 2000; // 2 seconds to fade out
  
  // DRAWING STATE
  private isDrawing = false;
  private currentStroke: DrawingStroke | null = null;
  private completedStrokes: DrawingStroke[] = [];
  private currentDrawStyle: { color: string; thickness: number; pattern: 'solid' | 'dashed' | 'dotted' | 'wavy' } | null = null;
  
  // MATH FLASH STATE
  private mathFlashes: MathFlash[] = [];

  constructor(seed: number, colorScheme: ColorScheme) {
    this.rng = new SeededRandom(seed);
    this.colorScheme = colorScheme;
    this.backgroundColor = colorScheme.background;
  }

  init(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) {
      console.error('Failed to get 2D context');
      return;
    }
    
    // Set canvas size
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;
    
    // Start the HEARTBEAT
    this.startRenderLoop();
    
    console.log('🎨 Visual Engine initialized - The canvas LIVES!');
  }

  /**
   * Find position - TRUE RANDOM! Center is fair game!
   */
  private findGoodPosition(size: number): { x: number; y: number } {
    if (!this.canvas) return { x: 500, y: 500 };
    
    const width = this.canvas.width;
    const height = this.canvas.height;
    const margin = size + 20;
    
    // Try to find non-colliding position
    for (let attempt = 0; attempt < 20; attempt++) {
      const x = this.rng.range(margin, width - margin);
      const y = this.rng.range(margin, height - margin);
      
      // Check collision with recent elements
      let collision = false;
      for (const elem of this.permanentElements.slice(-15)) {
        const dist = Math.sqrt((x - elem.x) ** 2 + (y - elem.y) ** 2);
        if (dist < (size + elem.size) / 2 + 40) {
          collision = true;
          break;
        }
      }
      
      if (!collision) {
        return { x, y };
      }
    }
    
    // Fallback: TRUE random position anywhere!
    return {
      x: this.rng.range(margin, width - margin),
      y: this.rng.range(margin, height - margin),
    };
  }

  /**
   * Add permanent element to canvas (with collision detection!)
   */
  addPermanentElement(type: string, x?: number, y?: number): void {
    if (!this.canvas) return;
    
    // Mark oldest elements for fade-out if we're at capacity
    if (this.permanentElements.length >= this.MAX_PERMANENT_ELEMENTS) {
      // Find oldest non-fading element
      const oldestNonFading = this.permanentElements.find(e => !e.fadingOut);
      if (oldestNonFading) {
        oldestNonFading.fadingOut = true;
        oldestNonFading.opacity = 1; // Start at full opacity
        console.log(`👻 Fading out element ${oldestNonFading.id}`);
      }
    }
    
    const size = this.rng.range(40, 120);
    const pos = (x !== undefined && y !== undefined) 
      ? { x, y } 
      : this.findGoodPosition(size);
    
    const element: PermanentElement = {
      id: this.elementIdCounter++,
      type: type as any,
      x: pos.x,
      y: pos.y,
      color: this.rng.choice(this.colorScheme.palette),
      size,
      rotation: this.rng.range(0, Math.PI * 2),
      baseScale: 1,
      data: this.getDataForType(type),
      opacity: 1,
      fadingOut: false,
      birthTime: Date.now(),
    };
    
    console.log(`✨ Permanent ${type} added at (${pos.x.toFixed(0)}, ${pos.y.toFixed(0)})`);
    this.permanentElements.push(element);
  }

  /**
   * Add animated element (bounces, moves, explodes!)
   */
  addAnimatedElement(type: string, animation?: 'bounce' | 'move' | 'spin' | 'explode'): void {
    if (!this.canvas) return;
    
    // Limit to avoid performance issues
    if (this.animatedElements.length >= CONFIG.MAX_ANIMATED_ELEMENTS) {
      this.animatedElements.shift(); // Remove oldest
    }
    
    const size = this.rng.range(50, 150);
    const pos = this.findGoodPosition(size);
    const chosenAnimation = animation || this.rng.choice(['bounce', 'move', 'spin', 'explode']);
    
    const element: AnimatedElement = {
      id: this.elementIdCounter++,
      type: type as any,
      x: pos.x,
      y: pos.y,
      color: this.rng.choice(this.colorScheme.palette),
      size,
      rotation: this.rng.range(0, Math.PI * 2),
      baseScale: 1,
      data: this.getDataForType(type),
      animation: chosenAnimation,
      startTime: Date.now(),
      duration: chosenAnimation === 'explode' ? 2000 : this.rng.range(3000, 8000),
      velocity: {
        x: this.rng.range(-3, 3),
        y: this.rng.range(-3, 3),
      },
      easing: (t: number) => t,
      particles: chosenAnimation === 'explode' ? this.createExplosionParticles(pos.x, pos.y) : undefined,
      opacity: 1,
      fadingOut: false,
      birthTime: Date.now(),
    };
    
    console.log(`💫 Animated ${type} (${chosenAnimation}) added at (${pos.x.toFixed(0)}, ${pos.y.toFixed(0)})`);
    this.animatedElements.push(element);
  }

  /**
   * Create explosion particles!
   */
  private createExplosionParticles(x: number, y: number): Array<{ x: number; y: number; vx: number; vy: number; life: number }> {
    const particles = [];
    const numParticles = 15;
    
    for (let i = 0; i < numParticles; i++) {
      const angle = (i / numParticles) * Math.PI * 2;
      const speed = this.rng.range(2, 6);
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
      });
    }
    
    return particles;
  }

  private getDataForType(type: string): any {
    switch (type) {
      case 'shape':
        return { shape: this.rng.choice(SHAPES) };
      case 'symbol':
        return { text: this.rng.choice(SYMBOLS) };
      case 'word':
        return { text: this.rng.choice(BABY_WORDS) };
      case 'animal':
        return { text: this.rng.choice(ANIMALS) };
      case 'number':
        return { text: this.rng.choice(NUMBERS) };
      default:
        return {};
    }
  }

  /**
   * The RENDER LOOP - Where magic happens 60 times per second
   */
  private render = (): void => {
    if (!this.ctx || !this.canvas) return;
    
    const now = Date.now();
    const time = (now - this.startTime) / 1000;
    
    // Clear with background
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw THE HEARTBEAT
    this.drawHeartbeat(time);
    
    // Update fade-out animations and remove fully faded elements
    this.permanentElements.forEach(element => {
      if (element.fadingOut && element.opacity !== undefined) {
        // Fade out over FADE_OUT_DURATION
        element.opacity -= 1 / (this.FADE_OUT_DURATION / 16.67); // Assuming ~60 FPS
        if (element.opacity < 0) element.opacity = 0;
      }
    });
    
    // Remove fully faded elements
    this.permanentElements = this.permanentElements.filter(e => {
      if (e.opacity !== undefined && e.opacity <= 0) {
        console.log(`💀 Removed element ${e.id}`);
        return false;
      }
      return true;
    });
    
    // Draw permanent elements with BREATHING (only recent ones!)
    this.permanentElements.forEach((element, index) => {
      const shouldBreathe = index >= this.permanentElements.length - this.MAX_BREATHING_ELEMENTS;
      this.drawElementWithBreath(element, time, shouldBreathe);
    });
    
    // Update and draw animated elements
    this.updateAnimatedElements(now);
    
    // Draw completed strokes
    this.drawStrokes();
    
    // Draw current stroke (if drawing)
    if (this.isDrawing && this.currentStroke) {
      this.drawStroke(this.currentStroke);
    }
    
    // Update and draw math flashes
    this.updateMathFlashes(now);
    
    // Continue the loop
    this.animationFrameId = requestAnimationFrame(this.render);
  };

  /**
   * THE HEARTBEAT - Pulse from canvas center every 3 seconds
   */
  private drawHeartbeat(time: number): void {
    if (!this.ctx || !this.canvas) return;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const beatInterval = CONFIG.HEARTBEAT_INTERVAL;
    const timeSinceLastBeat = time % beatInterval;
    
    if (timeSinceLastBeat < 0.5) {
      const progress = timeSinceLastBeat / 0.5;
      const radius = progress * 200;
      const opacity = (1 - progress) * 0.15;
      
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  /**
   * Draw element with BREATHING animation (only recent elements breathe!)
   */
  private drawElementWithBreath(element: PermanentElement, time: number, shouldBreathe: boolean): void {
    if (!this.ctx) return;
    
    // Calculate breathing scale ONLY for recent elements
    const breathScale = shouldBreathe 
      ? Math.sin(time * (2 + (element.id % 3) * 0.5) + element.id * 0.618034) * 0.05 + 1
      : 1;
    
    // Color shimmer (lighter on old elements)
    const color = shouldBreathe 
      ? this.applyColorShimmer(element.color, time, element.id)
      : element.color;
    
    // Apply opacity (for fade-out)
    const opacity = element.opacity !== undefined ? element.opacity : 1;
    
    this.ctx.save();
    this.ctx.globalAlpha = opacity; // FADE OUT EFFECT!
    this.ctx.translate(element.x, element.y);
    this.ctx.scale(breathScale, breathScale);
    
    if (element.type === 'shape' && element.data.shape) {
      drawShape(
        this.ctx,
        element.data.shape,
        0,
        0,
        element.size,
        color,
        element.rotation
      );
    } else if (element.data.text) {
      drawTextWithOutline(
        this.ctx,
        element.data.text,
        0,
        0,
        element.size,
        color
      );
    }
    
    this.ctx.restore();
  }

  /**
   * Color shimmer - subtle hue shifts
   */
  private applyColorShimmer(color: string, time: number, id: number): string {
    const hsl = hexToHsl(color);
    const hueShift = Math.sin(time * 0.5 + id * 0.1) * 5;
    hsl.h = (hsl.h + hueShift + 360) % 360;
    return hslToHex(hsl);
  }

  /**
   * Update animated elements (including EXPLOSIONS!)
   */
  private updateAnimatedElements(now: number): void {
    if (!this.ctx || !this.canvas) return;
    
    // Remove expired animations
    this.animatedElements = this.animatedElements.filter(element => {
      return now - element.startTime < element.duration;
    });
    
    // Update and draw
    this.animatedElements.forEach(element => {
      const elapsed = now - element.startTime;
      const progress = elapsed / element.duration;
      
      // Handle EXPLOSION animation
      if (element.animation === 'explode' && element.particles) {
        this.ctx!.save();
        element.particles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.2; // Gravity
          particle.life -= 0.02;
          
          if (particle.life > 0) {
            this.ctx!.globalAlpha = particle.life;
            this.ctx!.fillStyle = element.color;
            this.ctx!.beginPath();
            this.ctx!.arc(particle.x, particle.y, 5, 0, Math.PI * 2);
            this.ctx!.fill();
          }
        });
        this.ctx!.restore();
        return;
      }
      
      // Update position based on animation type
      if (element.animation === 'move' && element.velocity) {
        element.x += element.velocity.x;
        element.y += element.velocity.y;
        
        // Bounce off edges
        if (element.x < 0 || element.x > this.canvas!.width) {
          element.velocity.x *= -1;
        }
        if (element.y < 0 || element.y > this.canvas!.height) {
          element.velocity.y *= -1;
        }
      } else if (element.animation === 'bounce') {
        // Bounce effect with easing
        const bounce = Math.abs(Math.sin(progress * Math.PI * 4)) * 50;
        element.y -= bounce * 0.1;
      } else if (element.animation === 'spin') {
        element.rotation += 0.05;
      }
      
      // Draw with fading
      const alpha = 1 - progress * 0.5;
      this.ctx!.globalAlpha = alpha;
      
      const time = (now - this.startTime) / 1000;
      this.drawElementWithBreath(element, time, true); // Animated elements always breathe
      
      this.ctx!.globalAlpha = 1;
    });
  }

  /**
   * Set background color
   */
  setBackgroundColor(color: string): void {
    this.backgroundColor = color;
  }

  /**
   * Particle burst for CELEBRATIONS
   */
  burstParticles(_count?: number): void {
    if (!this.canvas) return;
    
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const margin = 100;
    
    // Pick a RANDOM burst origin (avoid center zone!)
    let originX, originY;
    let attempts = 0;
    
    do {
      originX = this.rng.range(margin, width - margin);
      originY = this.rng.range(margin, height - margin);
      
      // Check distance from center
      const distFromCenter = Math.sqrt((originX - centerX) ** 2 + (originY - centerY) ** 2);
      const minCenterDistance = Math.min(width, height) * 0.25; // 25% exclusion
      
      if (distFromCenter > minCenterDistance) break; // Good spot!
      attempts++;
    } while (attempts < 20);
    
    // Pick a THEME for this burst!
    const themes = [
      { type: 'animal', name: '🐾 Animals' },
      { type: 'shape', name: '🔷 Shapes' },
      { type: 'symbol', name: '✨ Symbols' },
      { type: 'word', name: '💬 Words' },
      { type: 'number', name: '🔢 Numbers' },
    ];
    
    const theme = this.rng.choice(themes);
    
    // FEWER elements (12-18 instead of 30-50!)
    const burstCount = this.rng.range(12, 18);
    
    console.log(`💥 ${theme.name} BURST! ${burstCount} particles from (${originX.toFixed(0)}, ${originY.toFixed(0)})`);
    
    // Create RADIAL burst with themed elements
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2;
      const distance = this.rng.range(80, 200);
      const x = originX + Math.cos(angle) * distance;
      const y = originY + Math.sin(angle) * distance;
      
      // Add as ANIMATED element (so they can bounce/move/explode!)
      // But use manual positioning for the radial pattern
      const size = this.rng.range(40, 100);
      
      const element: AnimatedElement = {
        id: this.elementIdCounter++,
        type: theme.type as any,
        x: Math.max(margin, Math.min(x, width - margin)),
        y: Math.max(margin, Math.min(y, height - margin)),
        color: this.rng.choice(this.colorScheme.palette),
        size,
        rotation: this.rng.range(0, Math.PI * 2),
        baseScale: 1,
        data: this.getDataForType(theme.type),
        animation: this.rng.choice(['bounce', 'spin', 'move'] as const),
        startTime: Date.now(),
        duration: this.rng.range(4000, 7000), // 4-7 seconds
        velocity: {
          x: this.rng.range(-2, 2),
          y: this.rng.range(-2, 2),
        },
        easing: (t: number) => t,
        opacity: 1,
        fadingOut: false,
        birthTime: Date.now(),
      };
      
      this.animatedElements.push(element);
    }
  }

  /**
   * Start a new drawing stroke (spacebar pressed)
   */
  startDrawing(x: number, y: number): void {
    // Pick a NEW random style for this stroke!
    this.currentDrawStyle = {
      color: this.rng.choice(this.colorScheme.palette),
      thickness: this.rng.range(3, 12),
      pattern: this.rng.choice(['solid', 'dashed', 'dotted', 'wavy'] as const),
    };
    
    this.currentStroke = {
      points: [{ x, y }],
      color: this.currentDrawStyle.color,
      thickness: this.currentDrawStyle.thickness,
      pattern: this.currentDrawStyle.pattern,
    };
    
    this.isDrawing = true;
    console.log(`🖌️ Drawing started: ${this.currentDrawStyle.pattern} ${this.currentDrawStyle.thickness}px ${this.currentDrawStyle.color}`);
  }
  
  /**
   * Continue drawing (mouse moved while spacebar held)
   */
  continueDrawing(x: number, y: number): void {
    if (!this.isDrawing || !this.currentStroke) return;
    
    // Add point to current stroke
    this.currentStroke.points.push({ x, y });
  }
  
  /**
   * End drawing stroke (spacebar released)
   */
  endDrawing(): void {
    if (!this.isDrawing || !this.currentStroke) return;
    
    // Save completed stroke
    if (this.currentStroke.points.length > 1) {
      this.completedStrokes.push(this.currentStroke);
      console.log(`🎨 Drawing complete: ${this.currentStroke.points.length} points`);
      
      // Limit strokes to prevent memory issues
      if (this.completedStrokes.length > 50) {
        this.completedStrokes.shift(); // Remove oldest
      }
    }
    
    this.currentStroke = null;
    this.isDrawing = false;
  }
  
  /**
   * Get drawing state
   */
  getIsDrawing(): boolean {
    return this.isDrawing;
  }
  
  /**
   * Update and draw math flashes
   */
  private updateMathFlashes(now: number): void {
    if (!this.ctx || !this.canvas) return;
    
    // Remove expired flashes
    this.mathFlashes = this.mathFlashes.filter(flash => {
      return now - flash.startTime < flash.duration;
    });
    
    // Draw each flash with animation
    this.mathFlashes.forEach(flash => {
      const elapsed = now - flash.startTime;
      const progress = elapsed / flash.duration;
      
      // Animation phases:
      // 0.0-0.3: Equation fades in and grows
      // 0.3-0.5: Equals sign appears
      // 0.5-0.8: Result fades in
      // 0.8-1.0: Everything fades out
      
      this.ctx!.save();
      this.ctx!.font = 'bold 80px Comic Sans MS';
      this.ctx!.textAlign = 'center';
      this.ctx!.textBaseline = 'middle';
      
      // Phase 1: Equation (0.0-0.5)
      if (progress < 0.5) {
        const phaseProgress = progress / 0.5;
        const scale = 0.5 + (phaseProgress * 0.5); // Grow from 0.5 to 1
        const alpha = Math.min(1, phaseProgress * 2); // Fade in
        
        this.ctx!.globalAlpha = alpha;
        this.ctx!.save();
        this.ctx!.translate(flash.x, flash.y);
        this.ctx!.scale(scale, scale);
        
        // Black outline
        this.ctx!.strokeStyle = '#000';
        this.ctx!.lineWidth = 6;
        this.ctx!.strokeText(flash.equation, 0, 0);
        
        // Color fill
        this.ctx!.fillStyle = flash.color;
        this.ctx!.fillText(flash.equation, 0, 0);
        this.ctx!.restore();
      }
      
      // Phase 2: Equals sign (0.3-0.6)
      if (progress >= 0.3 && progress < 0.8) {
        const phaseProgress = (progress - 0.3) / 0.3;
        const alpha = Math.min(1, phaseProgress * 3);
        
        this.ctx!.globalAlpha = alpha;
        
        // Black outline
        this.ctx!.strokeStyle = '#000';
        this.ctx!.lineWidth = 6;
        this.ctx!.strokeText('=', flash.x, flash.y + 100);
        
        // Color fill
        this.ctx!.fillStyle = flash.color;
        this.ctx!.fillText('=', flash.x, flash.y + 100);
      }
      
      // Phase 3: Result (0.5-0.8)
      if (progress >= 0.5 && progress < 0.9) {
        const phaseProgress = (progress - 0.5) / 0.3;
        const scale = 0.5 + (phaseProgress * 0.5);
        const alpha = Math.min(1, phaseProgress * 2);
        
        this.ctx!.globalAlpha = alpha;
        this.ctx!.save();
        this.ctx!.translate(flash.x, flash.y + 200);
        this.ctx!.scale(scale, scale);
        
        // Black outline
        this.ctx!.strokeStyle = '#000';
        this.ctx!.lineWidth = 6;
        this.ctx!.strokeText(flash.result, 0, 0);
        
        // Color fill (different color for result!)
        this.ctx!.fillStyle = '#FFD700'; // Gold for answer!
        this.ctx!.fillText(flash.result, 0, 0);
        this.ctx!.restore();
      }
      
      // Phase 4: Fade out everything (0.9-1.0)
      if (progress >= 0.9) {
        const fadeProgress = (progress - 0.9) / 0.1;
        const alpha = 1 - fadeProgress;
        
        this.ctx!.globalAlpha = alpha;
        
        // Draw full equation
        this.ctx!.strokeStyle = '#000';
        this.ctx!.lineWidth = 6;
        this.ctx!.fillStyle = flash.color;
        
        this.ctx!.strokeText(flash.equation, flash.x, flash.y);
        this.ctx!.fillText(flash.equation, flash.x, flash.y);
        
        this.ctx!.strokeText('=', flash.x, flash.y + 100);
        this.ctx!.fillText('=', flash.x, flash.y + 100);
        
        this.ctx!.fillStyle = '#FFD700';
        this.ctx!.strokeText(flash.result, flash.x, flash.y + 200);
        this.ctx!.fillText(flash.result, flash.x, flash.y + 200);
      }
      
      this.ctx!.restore();
    });
  }

  /**
   * Flash a math equation! 🧮
   */
  flashMath(): void {
    if (!this.canvas) return;
    
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Generate random math problem (INTEGERS ONLY!)
    const num1 = Math.floor(this.rng.range(1, 10)); // 1-9
    const num2 = Math.floor(this.rng.range(1, 10)); // 1-9
    const operation = this.rng.choice(['+', '-']);
    
    let equation: string;
    let result: number;
    
    if (operation === '+') {
      result = num1 + num2;
      equation = `${num1} + ${num2}`;
    } else {
      // Ensure no negative results for subtraction
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      result = larger - smaller;
      equation = `${larger} - ${smaller}`;
    }
    
    const mathFlash: MathFlash = {
      id: this.elementIdCounter++,
      equation,
      result: `${result}`,
      x: this.rng.range(width * 0.1, width * 0.9),
      y: this.rng.range(height * 0.1, height * 0.9),
      color: this.rng.choice(this.colorScheme.palette),
      startTime: Date.now(),
      duration: 3000, // 3 seconds
    };
    
    this.mathFlashes.push(mathFlash);
    console.log(`🧮 Math flash: ${equation} = ${result}`);
    
    // Limit flashes
    if (this.mathFlashes.length > 5) {
      this.mathFlashes.shift();
    }
  }
  
  /**
   * Draw all completed strokes
   */
  private drawStrokes(): void {
    this.completedStrokes.forEach(stroke => this.drawStroke(stroke));
  }
  
  /**
   * Draw a single stroke with pattern support
   */
  private drawStroke(stroke: DrawingStroke): void {
    if (!this.ctx || stroke.points.length < 2) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = stroke.color;
    this.ctx.lineWidth = stroke.thickness;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Apply pattern
    if (stroke.pattern === 'dashed') {
      this.ctx.setLineDash([stroke.thickness * 3, stroke.thickness * 2]);
    } else if (stroke.pattern === 'dotted') {
      this.ctx.setLineDash([stroke.thickness, stroke.thickness * 2]);
    } else {
      this.ctx.setLineDash([]);
    }
    
    // Draw the path
    this.ctx.beginPath();
    this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    if (stroke.pattern === 'wavy') {
      // Draw wavy line using quadratic curves
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const current = stroke.points[i];
        const next = stroke.points[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        this.ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      // Draw to last point
      const last = stroke.points[stroke.points.length - 1];
      this.ctx.lineTo(last.x, last.y);
    } else {
      // Draw straight line segments
      for (let i = 1; i < stroke.points.length; i++) {
        this.ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
    }
    
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Export canvas to PNG
   */
  exportPNG(): Blob | null {
    if (!this.canvas) return null;
    
    return new Promise<Blob | null>((resolve) => {
      this.canvas!.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    }) as any;
  }

  /**
   * Start the render loop
   */
  startRenderLoop(): void {
    if (!this.animationFrameId) {
      this.render();
    }
  }

  /**
   * Stop the render loop
   */
  stopRenderLoop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.stopRenderLoop();
    this.permanentElements = [];
    this.animatedElements = [];
    
    console.log('🎨 Visual Engine disposed - The canvas sleeps');
  }
}

