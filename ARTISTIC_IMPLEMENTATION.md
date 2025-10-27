# BabyTime - Artistic Implementation Guide
## Where Code Becomes Poetry

*Technical specifications for implementing WONDER*

---

## 🎨 Visual Poetry

### The Breathing Canvas

Every visual element should feel ALIVE. Here's how:

**File**: `src/utils/lifeforce.ts`

```typescript
/**
 * The Breath of Life
 * 
 * Every element on the canvas breathes - a subtle scale pulse
 * that makes static elements feel organic and alive.
 */
export function applyBreath(
  element: VisualElement,
  time: number
): number {
  // Each element breathes at its own rhythm (based on ID for consistency)
  const rhythm = 2 + (element.id % 3) * 0.5; // 2-3.5 second cycles
  const phase = element.id * 0.618034; // Golden ratio for visual harmony
  
  // Subtle scale variation (95% to 105%)
  const breathAmount = Math.sin(time * rhythm + phase) * 0.05 + 1;
  
  return element.baseScale * breathAmount;
}

/**
 * Color Shimmer
 * 
 * Colors subtly shift over time, like they're lit by candlelight
 */
export function applyColorShimmer(
  color: string,
  time: number,
  elementId: number
): string {
  const hsl = hexToHsl(color);
  
  // Subtle hue rotation (±5 degrees)
  const hueShift = Math.sin(time * 0.5 + elementId * 0.1) * 5;
  hsl.h = (hsl.h + hueShift + 360) % 360;
  
  // Subtle lightness pulse (±3%)
  const lightnessShift = Math.sin(time * 0.7 + elementId * 0.2) * 3;
  hsl.l = Math.max(0, Math.min(100, hsl.l + lightnessShift));
  
  return hslToHex(hsl);
}

/**
 * The Heartbeat
 * 
 * Every 3 seconds, a pulse emanates from canvas center
 */
export function createHeartbeat(
  ctx: CanvasRenderingContext2D,
  time: number,
  centerX: number,
  centerY: number
): void {
  const beatInterval = 3; // seconds
  const timeSinceLastBeat = time % beatInterval;
  
  if (timeSinceLastBeat < 0.5) {
    // Pulse is visible for first 0.5 seconds of each cycle
    const progress = timeSinceLastBeat / 0.5;
    const radius = progress * 200;
    const opacity = (1 - progress) * 0.15;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Inner pulse (smaller, faster)
    const innerRadius = progress * 100;
    const innerOpacity = (1 - progress) * 0.25;
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${innerOpacity})`;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}
```

### The Ghost Effect (Motion Memory)

**File**: `src/utils/ghosting.ts`

```typescript
/**
 * Ghost Trails
 * 
 * Animated elements leave whispers of where they've been
 */
export class GhostTrail {
  private positions: Array<{ x: number; y: number; age: number }> = [];
  private maxPositions = 8;
  
  update(x: number, y: number): void {
    this.positions.unshift({ x, y, age: 0 });
    
    // Age existing positions and remove old ones
    this.positions = this.positions
      .map(p => ({ ...p, age: p.age + 1 }))
      .slice(0, this.maxPositions);
  }
  
  draw(ctx: CanvasRenderingContext2D, element: AnimatedElement): void {
    this.positions.forEach((pos, i) => {
      const opacity = (1 - i / this.maxPositions) * 0.3;
      const scale = 0.7 + (1 - i / this.maxPositions) * 0.3;
      
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(pos.x, pos.y);
      ctx.scale(scale, scale);
      
      // Draw ghosted version of element
      drawElementSimple(ctx, element);
      
      ctx.restore();
    });
  }
}
```

### The Celebration System

**File**: `src/core/CelebrationEngine.ts`

```typescript
/**
 * Automatic celebrations that reward exploration
 */
export class CelebrationEngine {
  private keypressCount = 0;
  
  onKeypress(visualEngine: VisualEngine, audioEngine: AudioEngine): void {
    this.keypressCount++;
    
    // Milestone celebrations
    if (this.keypressCount === 20) {
      this.celebrate('first', visualEngine, audioEngine);
    } else if (this.keypressCount % 50 === 0) {
      this.celebrate('milestone', visualEngine, audioEngine);
    }
    
    // Random micro-celebrations (5% chance)
    if (Math.random() < 0.05) {
      this.celebrate('surprise', visualEngine, audioEngine);
    }
  }
  
  private celebrate(
    type: 'first' | 'milestone' | 'surprise',
    visual: VisualEngine,
    audio: AudioEngine
  ): void {
    switch (type) {
      case 'first':
        // First big milestone!
        visual.burstParticles(50, 'star', 'rainbow');
        audio.playChord(['C4', 'E4', 'G4'], 'melody');
        visual.screenFlash('rainbow', 0.3, 500);
        break;
        
      case 'milestone':
        // Recurring milestones
        visual.burstParticles(30, 'heart', 'random');
        audio.playChord(['A3', 'C4', 'E4'], 'mixed');
        break;
        
      case 'surprise':
        // Random little delights
        visual.spawnRandomElement({ surprise: true });
        audio.playNote('random', 'chaos');
        break;
    }
  }
}
```

---

## 🎵 Audio Artistry

### Expressive Synthesis

**File**: `src/core/ExpressiveAudio.ts`

```typescript
/**
 * Audio that FEELS
 */
export class ExpressiveAudio {
  
  /**
   * Play a note with PERSONALITY
   */
  playExpressiveNote(
    baseNote: string,
    mode: SynthMode,
    emotion: 'joy' | 'wonder' | 'calm' | 'chaos'
  ): void {
    const synth = this.getSynthForMode(mode);
    
    // Vary duration based on emotion
    const durations = {
      joy: ['16n', '8n'],
      wonder: ['4n', '2n'],
      calm: ['2n', '1n'],
      chaos: ['32n', '16n', '8n'],
    };
    
    const duration = randomChoice(durations[emotion]);
    
    // Vary velocity for dynamics
    const velocities = {
      joy: [0.7, 0.9],
      wonder: [0.5, 0.7],
      calm: [0.4, 0.6],
      chaos: [0.6, 1.0],
    };
    
    const [minVel, maxVel] = velocities[emotion];
    const velocity = minVel + Math.random() * (maxVel - minVel);
    
    // Add organic variation
    const detune = (Math.random() - 0.5) * 15; // ±15 cents
    synth.detune.value = detune;
    
    // Slightly randomize envelope for organic feel
    if ('attack' in synth.envelope) {
      synth.envelope.attack = 0.001 + Math.random() * 0.05;
    }
    
    // PLAY IT!
    synth.triggerAttackRelease(baseNote, duration, Tone.now(), velocity);
  }
  
  /**
   * Musical Scales for Harmony
   * 
   * Even chaos can be musical
   */
  getScaleNotes(root: string, scale: 'major' | 'minor' | 'pentatonic'): string[] {
    const scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      pentatonic: [0, 2, 4, 7, 9], // Always sounds good!
    };
    
    const intervals = scales[scale];
    const rootNote = Tone.Frequency(root).toMidi();
    
    // Generate 2 octaves of the scale
    const notes: string[] = [];
    for (let octave = 0; octave < 2; octave++) {
      intervals.forEach(interval => {
        const midi = rootNote + interval + (octave * 12);
        notes.push(Tone.Frequency(midi, 'midi').toNote());
      });
    }
    
    return notes;
  }
  
  /**
   * The Surprise Chord
   * 
   * Occasional major chord that just FEELS good
   */
  playSurpriseChord(): void {
    const roots = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3'];
    const root = randomChoice(roots);
    const rootMidi = Tone.Frequency(root).toMidi();
    
    // Major chord: root, major third, perfect fifth
    const chord = [
      Tone.Frequency(rootMidi, 'midi').toNote(),
      Tone.Frequency(rootMidi + 4, 'midi').toNote(),
      Tone.Frequency(rootMidi + 7, 'midi').toNote(),
    ];
    
    // Play on multiple synths for richness
    chord.forEach((note, i) => {
      const synth = this.getRandomSynth();
      const delay = i * 0.05; // Slight arpeggio effect
      synth.triggerAttackRelease(note, '2n', Tone.now() + delay, 0.6);
    });
  }
}
```

### The Echo System

**File**: `src/core/EchoSystem.ts`

```typescript
/**
 * 5% chance to echo the last action with variation
 * Creates organic patterns and rhythm
 */
export class EchoSystem {
  private lastAction: SessionEvent | null = null;
  private echoChance = 0.05;
  
  shouldEcho(): boolean {
    return Math.random() < this.echoChance && this.lastAction !== null;
  }
  
  getEchoAction(rng: SeededRandom): SessionEvent | null {
    if (!this.lastAction) return null;
    
    // Same function, different parameters
    const echoAction = { ...this.lastAction };
    
    // Vary position slightly
    if (echoAction.params.x) {
      echoAction.params.x += rng.range(-100, 100);
    }
    if (echoAction.params.y) {
      echoAction.params.y += rng.range(-100, 100);
    }
    
    // Vary size slightly
    if (echoAction.params.size) {
      echoAction.params.size *= rng.range(0.8, 1.2);
    }
    
    // Vary color (shift hue slightly)
    if (echoAction.params.color) {
      const hsl = hexToHsl(echoAction.params.color);
      hsl.h = (hsl.h + rng.range(-30, 30) + 360) % 360;
      echoAction.params.color = hslToHex(hsl);
    }
    
    return echoAction;
  }
  
  recordAction(action: SessionEvent): void {
    this.lastAction = action;
  }
}
```

---

## 🌈 The Surprise Key

**File**: `src/core/SurpriseKeyHandler.ts`

```typescript
/**
 * One key per session does something EXTRA special
 */
export class SurpriseKeyHandler {
  private surpriseKey: string;
  private hasBeenTriggered = false;
  
  constructor(rng: SeededRandom, allKeys: string[]) {
    // Pick a random key to be THE surprise key
    this.surpriseKey = rng.choice(allKeys);
  }
  
  isSurpriseKey(key: string): boolean {
    return key === this.surpriseKey && !this.hasBeenTriggered;
  }
  
  triggerSurprise(
    visual: VisualEngine,
    audio: AudioEngine,
    shader: ShaderEngine
  ): void {
    if (this.hasBeenTriggered) return;
    this.hasBeenTriggered = true;
    
    // Choose a random surprise effect
    const surprises = [
      () => this.colorInversion(visual),
      () => this.massiveBounce(visual),
      () => this.spawnExplosion(visual),
      () => this.symphonyChord(audio),
      () => this.kaleidoscopeMoment(shader),
      () => this.rainbowBackground(visual),
    ];
    
    const surprise = randomChoice(surprises);
    surprise();
  }
  
  private colorInversion(visual: VisualEngine): void {
    visual.invertColors(2000); // 2 seconds of inverted colors
  }
  
  private massiveBounce(visual: VisualEngine): void {
    visual.bounceAllElements(1.5); // Make everything bounce!
  }
  
  private spawnExplosion(visual: VisualEngine): void {
    for (let i = 0; i < 15; i++) {
      visual.spawnRandomElement({ forcedType: 'all' });
    }
  }
  
  private symphonyChord(audio: AudioEngine): void {
    // Play a chord across ALL synth modes simultaneously
    const note = randomChoice(['C4', 'D4', 'E4', 'F4', 'G4']);
    ['bass', 'melody', 'percussion', 'chaos'].forEach(mode => {
      audio.playNote(note, mode as SynthMode);
    });
  }
  
  private kaleidoscopeMoment(shader: ShaderEngine): void {
    shader.applyEffect({
      type: ShaderEffect.Kaleidoscope,
      intensity: 1.0,
      duration: 3000,
    });
  }
  
  private rainbowBackground(visual: VisualEngine): void {
    visual.setGradientBackground([
      '#FF0000',
      '#FF7F00',
      '#FFFF00',
      '#00FF00',
      '#0000FF',
      '#4B0082',
      '#9400D3',
    ], 3000);
  }
}
```

---

## ✨ Enhanced Constants

**File**: `src/constants/artistic.ts`

```typescript
/**
 * Artistic constants that define the soul of BabyTime
 */

export const ARTISTIC_CONSTANTS = {
  // The heartbeat interval (seconds)
  HEARTBEAT_INTERVAL: 3,
  
  // Breathing animation
  BREATH_MIN_SCALE: 0.95,
  BREATH_MAX_SCALE: 1.05,
  BREATH_SPEED_RANGE: [2, 3.5], // seconds per cycle
  
  // Ghost trails
  GHOST_TRAIL_LENGTH: 8,
  GHOST_OPACITY_MAX: 0.3,
  GHOST_SCALE_MIN: 0.7,
  
  // Celebration thresholds
  FIRST_CELEBRATION_AT: 20, // keypresses
  MILESTONE_EVERY: 50, // keypresses
  RANDOM_CELEBRATION_CHANCE: 0.05, // 5%
  
  // Echo system
  ECHO_CHANCE: 0.05, // 5%
  ECHO_POSITION_VARIANCE: 100, // pixels
  ECHO_SIZE_VARIANCE: [0.8, 1.2], // multiplier range
  ECHO_HUE_VARIANCE: 30, // degrees
  
  // Color shimmer
  SHIMMER_HUE_RANGE: 5, // ± degrees
  SHIMMER_LIGHTNESS_RANGE: 3, // ± percent
  
  // Musical scales (for harmony)
  MUSICAL_SCALES: {
    JOYFUL: 'major',
    CONTEMPLATIVE: 'minor',
    UNIVERSAL: 'pentatonic', // Always sounds good!
  },
  
  // Audio expression
  DETUNE_RANGE: 15, // ± cents for organic variation
  VELOCITY_VARIATIONS: {
    JOY: [0.7, 0.9],
    WONDER: [0.5, 0.7],
    CALM: [0.4, 0.6],
    CHAOS: [0.6, 1.0],
  },
  
  // Visual energy
  PARTICLE_BURST_SIZES: {
    SMALL: 15,
    MEDIUM: 30,
    LARGE: 50,
    MASSIVE: 100,
  },
  
  // Screen flash durations
  FLASH_DURATION_SHORT: 200, // ms
  FLASH_DURATION_MEDIUM: 500, // ms
  FLASH_DURATION_LONG: 1000, // ms
  
  // Parent mode easter egg
  PARENT_MODE_SEQUENCE: ['Shift', 'P', 'A', 'R', 'E', 'N', 'T'],
  PARENT_MODE_TIMEOUT: 2000, // ms between keys
};

/**
 * Emotional palettes - colors grouped by feeling
 */
export const EMOTIONAL_PALETTES = {
  JOY: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347'],
  CALM: ['#87CEEB', '#98D8C8', '#B0E0E6', '#FFDAB9'],
  ENERGY: ['#FF00FF', '#00FF00', '#FFFF00', '#FF1493'],
  WONDER: ['#9370DB', '#DDA0DD', '#BA55D3', '#8A2BE2'],
  WARMTH: ['#FF7F50', '#F4A460', '#DEB887', '#D2691E'],
};

/**
 * Sacred ratios for aesthetic harmony
 */
export const SACRED_RATIOS = {
  GOLDEN: 0.618034, // φ (phi) - the golden ratio
  SILVER: 0.414214, // δ (delta) - the silver ratio
  FIBONACCI: [1, 1, 2, 3, 5, 8, 13, 21, 34],
};
```

---

## 🎭 The Parent Mode Easter Egg

**File**: `src/core/ParentModeDetector.ts`

```typescript
/**
 * Secret parent appreciation moment
 */
export class ParentModeDetector {
  private sequence: string[] = [];
  private targetSequence = ['Shift', 'p', 'a', 'r', 'e', 'n', 't'];
  private lastKeyTime = 0;
  private timeout = 2000; // 2 seconds between keys
  
  onKey(key: string): boolean {
    const now = Date.now();
    
    // Reset if too much time has passed
    if (now - this.lastKeyTime > this.timeout) {
      this.sequence = [];
    }
    
    this.lastKeyTime = now;
    this.sequence.push(key.toLowerCase());
    
    // Keep only last N keys
    if (this.sequence.length > this.targetSequence.length) {
      this.sequence.shift();
    }
    
    // Check if sequence matches
    if (this.sequenceMatches()) {
      this.activateParentMode();
      this.sequence = []; // Reset
      return true;
    }
    
    return false;
  }
  
  private sequenceMatches(): boolean {
    if (this.sequence.length !== this.targetSequence.length) {
      return false;
    }
    
    return this.sequence.every((key, i) => key === this.targetSequence[i]);
  }
  
  private activateParentMode(): void {
    // A tiny heart appears in corner
    // That's it. Just acknowledgment.
    // "We see you, parent. You're doing great."
    console.log('❤️ You found parent mode. You're doing amazing.');
    
    // Could also trigger a subtle visual effect
    // But keeping it minimal - just a moment of connection
  }
}
```

---

## 🌟 Implementation Priority

### Phase 1: The Essentials
1. ✅ Breathing elements (applyBreath)
2. ✅ Echo system (creates patterns)
3. ✅ Celebration at 20 keypresses
4. ✅ Surprise key (one per session)
5. ✅ Expressive audio (velocity/detune variation)

### Phase 1.5: The Magic
6. Ghost trails on animated elements
7. Heartbeat pulse (every 3 seconds)
8. Color shimmer (subtle hue shifts)
9. Musical scales for harmony
10. Particle bursts on celebrations

### Phase 2: The Soul
11. Parent mode easter egg
12. Advanced celebration system
13. Emotional audio expressions
14. Sacred ratio-based layouts
15. Emotional palette system

---

## 💫 The Promise

**Every single one of these features serves a purpose:**

- **Breathing**: Makes static feel alive
- **Ghost trails**: Creates sense of motion memory
- **Heartbeat**: Subconscious rhythm and life
- **Celebrations**: Rewards exploration without judgment
- **Echo**: Creates accidental patterns and music
- **Surprise key**: Moment of pure wonder
- **Expressive audio**: Prevents robotic feel
- **Scales**: Ensures chaos is still musical
- **Parent mode**: Acknowledges the real heroes

**None of this is frivolous. All of it matters.**

---

*Now go make a baby's day.* 🎨✨


