# BabyTime - Work Instructions

## Development Workflow Guide
This document provides step-by-step instructions for building BabyTime from scratch.

---

## ⚠️ IMPORTANT: You're Building Art, Not Just Code

Before you start, read **[THE_SOUL_OF_BABYTIME.md](THE_SOUL_OF_BABYTIME.md)**.

This isn't just another web app. Every detail matters. Every keypress should feel magical. Every visual should breathe with life. We're building the moment when a baby realizes: **"I have power."**

When you're implementing a feature at 2 AM and wondering if anyone will notice that subtle easing function... a baby will notice. Not consciously. But somewhere in their developing brain, they'll *feel* it.

**You're not building software. You're building someone's first creative experience.**

Now let's do this right. 🎨🔥

---

## Phase 0: Project Setup

### Step 0.1: Initialize Project
```bash
# Create project with Vite + React + TypeScript
npm create vite@latest babytime -- --template react-ts
cd babytime
npm install

# Install core dependencies
npm install tone three @types/three

# Install dev dependencies (including types for Node.js path module)
npm install -D eslint prettier @types/node
```

### Step 0.2: Configure TypeScript
Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 0.3: Create Project Structure
```bash
mkdir -p src/{components,core,hooks,shaders,utils,types,constants,styles}
mkdir -p public/sounds/{animals,silly,percussion}
```

### Step 0.4: Configure Vite
Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
  },
});
```

### Step 0.5: Create .cursorrules
See separate `.cursorrules` file for Cursor AI development guidelines.

---

## Phase 1: Core Utilities & Types

### Step 1.1: Define TypeScript Types

**File**: `src/types/session.ts`
```typescript
export interface Session {
  id: string;
  timestamp: string;
  duration: number;
  seed: number;
  colorScheme: string;
  events: SessionEvent[];
  audioBlob?: Blob;
}

export interface SessionEvent {
  time: number;
  type: 'keypress';
  key: string;
  functions: FunctionType[];
  params: Record<string, any>;
}

export type FunctionType =
  | 'synth-note'
  | 'percussion'
  | 'sound-effect'
  | 'beat-pattern'
  | 'shape-permanent'
  | 'symbol-spawn'
  | 'word-spawn'
  | 'animal-spawn'
  | 'number-spawn'
  | 'animation-bounce'
  | 'animation-move'
  | 'background-color'
  | 'background-effect'
  | 'shader-glitch'
  | 'shader-distort';
```

**File**: `src/types/elements.ts`
```typescript
export interface PermanentElement {
  type: 'shape' | 'symbol' | 'word' | 'animal' | 'number';
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  data: any;
}

export interface AnimatedElement extends PermanentElement {
  animation: 'bounce' | 'move' | 'spin' | 'grow';
  startTime: number;
  duration: number;
  velocity?: { x: number; y: number };
  easing: (t: number) => number;
}

export interface BackgroundEffect {
  type: 'sparkle' | 'stars' | 'particles';
  params: Record<string, any>;
}
```

**File**: `src/types/keyboard.ts`
```typescript
export interface KeyEvent {
  key: string;
  code: string;
  timestamp: number;
}

export interface KeyMapping {
  key: string;
  functions: FunctionType[];
  params: Record<string, any>;
}
```

### Step 1.2: Seeded Random Utility

**File**: `src/utils/random.ts`
```typescript
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // LCG algorithm
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2 ** 32;
    return this.seed / 2 ** 32;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  choice<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)];
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
```

### Step 1.3: Color Schemes

**File**: `src/utils/colors.ts`
```typescript
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
```

### Step 1.4: Easing Functions

**File**: `src/utils/easing.ts`
```typescript
export type EasingFunction = (t: number) => number;

export const easing = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutBounce: (t: number) => {
    if (t < 1 / 2.75) return 7.5625 * t * t;
    if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
};
```

### Step 1.5: Shape Drawing Utilities

**File**: `src/utils/shapes.ts`
```typescript
export function drawShape(
  ctx: CanvasRenderingContext2D,
  type: string,
  x: number,
  y: number,
  size: number,
  color: string,
  rotation: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;

  switch (type) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case 'square':
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    case 'star':
      drawStar(ctx, 0, 0, 5, size / 2, size / 4);
      ctx.fill();
      ctx.stroke();
      break;
    case 'heart':
      drawHeart(ctx, 0, 0, size);
      ctx.fill();
      ctx.stroke();
      break;
  }

  ctx.restore();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
): void {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  const width = size;
  const height = size;
  ctx.beginPath();
  const topCurveHeight = height * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(
    x,
    y,
    x - width / 2,
    y,
    x - width / 2,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x - width / 2,
    y + (height + topCurveHeight) / 2,
    x,
    y + (height + topCurveHeight) / 2,
    x,
    y + height
  );
  ctx.bezierCurveTo(
    x,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(
    x + width / 2,
    y,
    x,
    y,
    x,
    y + topCurveHeight
  );
  ctx.closePath();
}
```

### Step 1.6: Constants

**File**: `src/constants/config.ts`
```typescript
export const CONFIG = {
  SESSION_DURATION: 180, // 3 minutes in seconds
  MAX_ANIMATED_ELEMENTS: 20,
  MAX_POLYPHONY: 8,
  KEYPRESS_THROTTLE: 10, // ms
  ESCAPE_HOLD_DURATION: 5000, // ms
  CANVAS_WIDTH: 2000,
  CANVAS_HEIGHT: 2000,
};
```

**File**: `src/constants/distributions.ts`
```typescript
export const FUNCTION_DISTRIBUTION = {
  'synth-note': 0.15,
  percussion: 0.1,
  'sound-effect': 0.1,
  'beat-pattern': 0.05,
  'shape-permanent': 0.15,
  'symbol-spawn': 0.1,
  'word-spawn': 0.05,
  'animal-spawn': 0.1,
  'number-spawn': 0.05,
  'animation-bounce': 0.05,
  'animation-move': 0.05,
  'background-color': 0.03,
  'background-effect': 0.02,
  'shader-glitch': 0.03,
  'shader-distort': 0.02,
};

export const ANIMALS = ['cat', 'dog', 'bird', 'fish', 'bunny', 'bear'];
export const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart'];
export const SYMBOLS = ['★', '♥', '●', '■', '▲', '✿', '☀', '☾'];
export const BABY_WORDS = ['BABA', 'MAMA', 'WOW', 'YAY', 'BOO', 'HI'];
export const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
```

---

## Phase 2: Core Engines

### Step 2.1: Keyboard Mapper

**File**: `src/core/KeyboardMapper.ts`

Implement class that:
- Takes a seed in constructor
- Creates SeededRandom instance
- Generates key mappings for all keys using distribution constants
- Provides `getMapping(key: string)` method
- Ensures balanced distribution using weighted random selection

**Key method**:
```typescript
private generateMappings(): Map<string, KeyMapping> {
  // Get all keyboard keys
  // For each key, randomly assign 1-3 functions based on distribution
  // Return map of key -> KeyMapping
}
```

### Step 2.2: Audio Engine

**File**: `src/core/AudioEngine.ts`

Implement class that:
- Initializes Tone.js on construction
- Creates multiple synth instances (bass, melody, percussion, chaos)
- Loads audio samples from `/public/sounds/`
- Implements methods: `playNote()`, `playSoundEffect()`, `startBeatPattern()`, `stopAll()`
- Manages polyphony (max 8 simultaneous notes)
- Uses Tone.Sampler for sound effects

**Synth setup**:
```typescript
private setupSynths(): void {
  this.basssynth = new Tone.AMSynth().toDestination();
  this.melodySynth = new Tone.FMSynth().toDestination();
  // etc...
}
```

### Step 2.3: Visual Engine

**File**: `src/core/VisualEngine.ts`

Implement class that:
- Takes canvas element in `init()`
- Maintains arrays of permanent and animated elements
- Implements render loop with requestAnimationFrame
- Draws elements using shape utilities
- Handles animations with easing functions
- Provides `addPermanentElement()`, `addAnimatedElement()`, `setBackgroundColor()`
- Implements `exportPNG()` using canvas.toBlob()

**Render loop**:
```typescript
private render = (): void => {
  // Clear or accumulate
  // Draw background
  // Draw permanent elements
  // Update and draw animated elements
  // Request next frame
};
```

### Step 2.4: Shader Engine

**File**: `src/core/ShaderEngine.ts`

Implement class that:
- Creates Three.js WebGL renderer
- Sets up scene, camera, and EffectComposer
- Loads custom fragment shaders
- Applies effects to canvas texture
- Provides `applyEffect()`, `clearEffects()` methods

**Shader files**: Create fragment shaders in `src/shaders/`:
- `glitch.frag`: Random pixel displacement
- `chromatic.frag`: RGB channel separation
- `kaleidoscope.frag`: Mirrored symmetry
- `ripple.frag`: Wave distortion

### Step 2.5: Session Recorder

**File**: `src/core/SessionRecorder.ts`

Implement class that:
- Starts recording with `startRecording(seed, colorScheme)`
- Records events with `recordEvent(event)`
- Maintains rolling buffer (max 180 seconds)
- Uses MediaRecorder to capture audio from Tone.js
- Exports session JSON and audio blob with `stopRecording()`

**Rolling buffer**:
```typescript
private pruneOldEvents(): void {
  const now = Date.now();
  const cutoff = now - CONFIG.SESSION_DURATION * 1000;
  this.events = this.events.filter(e => e.timestamp >= cutoff);
}
```

### Step 2.6: Playback Engine

**File**: `src/core/PlaybackEngine.ts`

Implement class that:
- Loads session data with `loadSession(session)`
- Re-initializes engines with session seed
- Restores KeyboardMapper state
- Plays audio blob
- Triggers events at recorded timestamps
- Provides playback controls (play, pause, stop)

**Event scheduling**:
```typescript
private scheduleEvents(): void {
  this.session.events.forEach(event => {
    setTimeout(() => {
      this.triggerEvent(event);
    }, event.time * 1000);
  });
}
```

### Step 2.7: Storage Manager

**File**: `src/core/StorageManager.ts`

Implement class with static methods:
- `saveSession(session)`: Saves to localStorage
- `getSession(id)`: Retrieves by ID
- `getLatestSession()`: Gets most recent
- `clearOldSessions()`: Keeps only last 5 sessions
- Handles quota errors gracefully

---

## Phase 3: React Hooks

### Step 3.1: Keyboard Input Hook

**File**: `src/hooks/useKeyboardInput.ts`

Implement hook that:
- Adds global keydown/keyup event listeners
- Prevents default browser behaviors
- Throttles rapid keypresses (10ms)
- Detects escape key hold (5 seconds)
- Returns `{ lastKey, escapeProgress }`

### Step 3.2: Audio Engine Hook

**File**: `src/hooks/useAudioEngine.ts`

Implement hook that:
- Creates AudioEngine instance
- Initializes on mount
- Cleans up on unmount
- Returns engine instance

### Step 3.3: Visual Engine Hook

**File**: `src/hooks/useVisualEngine.ts`

Implement hook that:
- Takes canvas ref
- Creates VisualEngine instance
- Initializes with canvas
- Starts render loop
- Cleans up on unmount
- Returns engine instance

### Step 3.4: Shader Engine Hook

**File**: `src/hooks/useShaderEngine.ts`

Implement hook that:
- Takes container ref
- Creates ShaderEngine instance
- Initializes with container
- Cleans up on unmount
- Returns engine instance

### Step 3.5: Session Recorder Hook

**File**: `src/hooks/useSessionRecorder.ts`

Implement hook that:
- Creates SessionRecorder instance
- Provides `startRecording`, `recordEvent`, `stopRecording` methods
- Returns recorder interface

---

## Phase 4: React Components

### Step 4.1: App Component

**File**: `src/components/App.tsx`

Implement component that:
- Manages global state (mode, session, escapeProgress)
- Renders ModalManager or JamSession based on mode
- Handles mode transitions
- Provides callbacks for starting/stopping jams

```typescript
function App() {
  const [mode, setMode] = useState<'landing' | 'jamming' | 'review'>('landing');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  
  const handleStartJam = () => {
    setMode('jamming');
  };
  
  const handleStopJam = (session: Session) => {
    setCurrentSession(session);
    setMode('review');
  };
  
  return (
    <>
      {mode === 'landing' && <ModalManager mode="landing" onStartJam={handleStartJam} />}
      {mode === 'jamming' && <JamSession onStop={handleStopJam} />}
      {mode === 'review' && <ModalManager mode="review" session={currentSession} />}
    </>
  );
}
```

### Step 4.2: Modal Manager Component

**File**: `src/components/ModalManager.tsx`

Implement component that:
- Renders full-screen modal overlay
- Shows different content based on mode (landing vs review)
- Landing: Big "START JAM" button, brief explanation
- Review: Playback controls, download buttons
- Styled with KidPix aesthetic (thick borders, bright colors, fun fonts)

### Step 4.3: Jam Session Component

**File**: `src/components/JamSession.tsx`

Implement component that:
- Creates canvas and WebGL container elements
- Initializes all engines with hooks
- Creates KeyboardMapper with random seed
- Captures keyboard input
- Routes keypresses to appropriate engine methods
- Records all events
- Detects escape hold and triggers stop callback

```typescript
function JamSession({ onStop }: { onStop: (session: Session) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const audioEngine = useAudioEngine();
  const visualEngine = useVisualEngine(canvasRef);
  const shaderEngine = useShaderEngine(containerRef);
  const recorder = useSessionRecorder();
  
  const { lastKey, escapeProgress } = useKeyboardInput();
  
  // Handle keypresses, trigger engines, record events
  // ...
  
  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
      {escapeProgress > 0 && <EscapeProgress progress={escapeProgress} />}
    </div>
  );
}
```

### Step 4.4: Escape Progress Component

**File**: `src/components/EscapeProgress.tsx`

Implement component that:
- Shows subtle progress bar when escape is held
- Circular progress indicator in corner
- KidPix style

---

## Phase 5: Styling

### Step 5.1: Global Styles

**File**: `src/styles/global.css`

- Reset default styles
- Set font to something fun (Comic Sans-like or custom web font)
- Full-screen layout
- Hide scrollbars
- Cursor: crosshair during jamming

### Step 5.2: KidPix Aesthetic

**File**: `src/styles/kidpix.css`

- Define CSS variables for colors
- Thick border utilities
- Button styles (chunky, colorful, 3D effect)
- Text styles (outlined, shadowed)
- Animation keyframes (bounce, shake, wiggle)

### Step 5.3: Modal Styles

**File**: `src/styles/modal.module.css`

- Full-screen overlay (rgba background)
- Centered modal box with thick black border
- Bright gradient background
- Large, friendly buttons
- Responsive layout

---

## Phase 6: Assets

### Step 6.1: Sound Effects

**Sources for Free Sound Effects** (Creative Commons / Public Domain):
- **Freesound.org**: Community-uploaded sounds (check license, prefer CC0)
- **Zapsplat.com**: Free sound effects (attribution required)
- **SoundBible.com**: Public domain and CC sounds
- **BBC Sound Effects**: Free for personal/educational use
- **Generate synthetically**: Use Tone.js to create sounds (no licensing issues)

**Download/create**:
- Animal sounds: cat meow, dog bark, bird chirp, fish bubble, etc.
- Silly sounds: boing, laser zap, pop, whoosh, bubble
- Percussion: kick drum, snare, hihat, handclap, tambourine

**Format Requirements**:
- Format: MP3 (best browser support) or WAV (larger but universal)
- Duration: Short (< 1 second preferred, max 2 seconds)
- Channels: Mono (smaller file size)
- Sample rate: 44.1kHz or 48kHz
- Normalized: Peak amplitude near 0dB (use Audacity for normalization)

**Naming Convention**:
- Lowercase, descriptive, no spaces
- Examples: `cat_meow.mp3`, `dog_bark.mp3`, `boing.mp3`, `kick.mp3`

**Location**: `public/sounds/{animals,silly,percussion}/`

**Fallback Strategy**: If no samples available, use Tone.js synths only (fully functional without samples)

### Step 6.2: Fonts

**Option 1**: Use web fonts (Google Fonts)
- "Fredoka One" (chunky, fun)
- "Baloo 2" (rounded, friendly)

**Option 2**: Use system fonts
- Comic Sans MS (love it or hate it, very KidPix)

---

## Phase 7: Integration & Testing

### Step 7.1: Wire Everything Together

- Ensure all engines communicate properly
- Test keyboard mapping randomization
- Verify audio-visual synchronization
- Check recording buffer pruning
- Test playback accuracy

### Step 7.2: Manual Testing Checklist

- [ ] App loads without errors
- [ ] Landing modal appears on first visit
- [ ] "START JAM" button works
- [ ] Keypresses trigger both audio and visual
- [ ] Multiple simultaneous sounds work
- [ ] Canvas fills with elements
- [ ] Animated elements move correctly
- [ ] Shader effects apply and clear
- [ ] Holding escape for 5s exits jam
- [ ] Review modal shows after exit
- [ ] Replay button recreates session accurately
- [ ] Download canvas button works (PNG)
- [ ] Download audio button works (MP3/WAV)
- [ ] Starting new jam resets everything
- [ ] No crashes during 3+ minute sessions
- [ ] Performance stays smooth (60 FPS)

### Step 7.3: Cross-Browser Testing

- Test in Chrome, Firefox, Safari, Edge
- Check audio latency
- Verify WebGL support
- Test localStorage limits

---

## Phase 8: Polish & Optimization

### Step 8.1: Performance Optimization

- Profile render loop, optimize hot paths
- Implement object pooling for elements
- Reduce garbage collection pressure
- Optimize shader complexity
- Preload all assets on app init

### Step 8.2: UX Polish

- Add smooth transitions between modes
- Improve escape progress indicator
- Add subtle sound feedback for modal interactions
- Ensure color contrast is always readable
- Test with actual babies (if possible!)

### Step 8.3: Error Handling

- Wrap audio init in try-catch (user gesture required)
- Handle localStorage quota errors
- Fallback if WebGL unavailable
- Show friendly error messages

---

## Phase 9: Deployment

### Step 9.1: Build for Production

```bash
npm run build
```

- Verify build output in `/dist`
- Test production build locally: `npm run preview`

### Step 9.2: Deploy to Cloudflare Pages

**Option 1: Git Integration (Recommended)**

1. **Push code to GitHub/GitLab** (if not already):
```bash
git init
git add .
git commit -m "Initial commit: DinkyTime Phase 1 implementation"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/`
   - Click "Save and Deploy"

3. **Configure Custom Domain** (dinkytime.com):
   - Go to project → Custom domains
   - Add `dinkytime.com` and `www.dinkytime.com`
   - Cloudflare will automatically configure DNS

**Option 2: Direct Upload (Quick Deploy)**

```bash
# Build locally
npm run build

# Install Wrangler CLI (if not installed)
npm install -g wrangler

# Login to Cloudflare
npx wrangler login

# Deploy
npx wrangler pages deploy dist --project-name=dinkytime
```

### Step 9.3: Verify Deployment

- Visit your Cloudflare Pages URL (e.g., `dinkytime.pages.dev`)
- Or visit custom domain: `https://dinkytime.com`
- Test full jam session flow
- Check browser console for errors
- Verify HTTPS (automatic with Cloudflare)
- Test in multiple browsers

---

## Phase 10: Documentation

### Step 10.1: Write README

**File**: `README.md`

Include:
- Project description
- Features
- Tech stack
- Local development setup
- Build instructions
- Deployment guide
- Credits

### Step 10.2: Code Comments

- Add JSDoc comments to all public methods
- Document complex algorithms
- Explain non-obvious design decisions

---

## Development Best Practices

### Code Quality
- Use TypeScript strict mode
- No `any` types except where absolutely necessary
- Prefer functional programming patterns
- Keep components small and focused
- Extract reusable logic to hooks/utils

### Performance
- Avoid unnecessary re-renders
- Memoize expensive computations
- Use requestAnimationFrame for animations
- Batch DOM updates
- Profile before optimizing

### Git Workflow
- Commit frequently with descriptive messages
- Use branches for major features
- Keep commits atomic (one logical change per commit)

### Testing Strategy
- Test core logic (KeyboardMapper, random, etc.)
- Manual test all user flows
- Test on multiple browsers/devices
- Test performance on lower-end devices

---

## Troubleshooting

### Common Issues

**Audio doesn't play**:
- Web Audio requires user gesture to start
- Ensure Tone.js context is started: `Tone.start()`

**Canvas is blank**:
- Check canvas size is set correctly
- Verify 2D context is obtained
- Check element z-indices

**WebGL not working**:
- Check browser supports WebGL 2.0
- Implement fallback to skip shader effects

**localStorage quota exceeded**:
- Implement cleanup of old sessions
- Reduce session data size
- Warn user and continue without saving

**Escape key not working**:
- Ensure global event listener is attached
- Check event.preventDefault() is called
- Verify timer logic for 5-second hold

---

## Next Steps (Phase 2)

After Phase 1 is complete and tested:
- Design database schema for sessions
- Build Express API backend
- Implement user authentication (optional)
- Create gallery/feed UI
- Add social sharing features
- Implement session likes/comments
- Build admin moderation tools

---

## Estimated Timeline (Realistic)

**Total: 51-68 hours (1.5-2 weeks full-time or 3-4 weeks part-time)**

- Phase 0 (Setup): 3-4 hours
- Phase 1 (Utils & Types): 2-3 hours
- Phase 2 (Core Engines): 20-26 hours
  - Audio Engine: 6-8 hours
  - Visual Engine: 8-10 hours
  - Shader Engine: 6-8 hours
- Phase 3 (Hooks): 2-3 hours
- Phase 4 (Components): 4-5 hours
- Phase 5 (Styling): 3-4 hours
- Phase 6 (Assets): 2-3 hours (finding, downloading, processing)
- Phase 7 (Testing): 5-7 hours
- Phase 8 (Polish): 3-4 hours
- Phase 9 (Deployment): 2-3 hours
- Phase 10 (Docs): 1-2 hours

**Note**: Add 30-50% if learning React, Tone.js, or Three.js for first time.

---

## Success Criteria

✅ A baby can mash keyboard and create audio-visual art
✅ Sessions are recorded and replayable accurately
✅ No way to accidentally break the experience
✅ Smooth 60 FPS performance
✅ Works across modern browsers
✅ Parents can save and share output
✅ Every jam feels unique and delightful
✅ Deployed and accessible on the web

---

## Notes

- Prioritize fun and weirdness over perfection
- Embrace chaos and randomness
- Test with real users (babies!) if possible
- Iterate based on feedback
- Document learnings for Phase 2

Happy building! 🎨🎵👶

