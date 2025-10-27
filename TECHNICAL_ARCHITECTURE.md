# BabyTime - Technical Architecture

## System Overview
BabyTime is a client-side web application with no backend dependencies in Phase 1. All logic, state management, and data persistence happens in the browser.

---

## Technology Stack

### Core Technologies
- **React 18**: UI component management and state
- **TypeScript 5**: Type-safe development
- **Vite 5**: Build tool and dev server
- **Tone.js 14**: Web Audio API synthesis and effects
- **Three.js r158**: WebGL rendering and shader effects
- **HTML5 Canvas API**: 2D drawing and compositing

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript Strict Mode**: Maximum type safety

### Deployment
- **Cloudflare Pages**: Static hosting with global CDN
- **Environment**: Node 20 LTS (for build)

---

## Application Architecture

### High-Level Structure
```
┌─────────────────────────────────────────┐
│           React Application             │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │      Modal Manager (UI)           │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │     Keyboard Input Handler        │  │
│  └───────────────────────────────────┘  │
│  ┌─────────────┬──────────┬──────────┐  │
│  │   Audio     │  Visual  │  Shader  │  │
│  │   Engine    │  Engine  │  Engine  │  │
│  │  (Tone.js)  │ (Canvas) │(Three.js)│  │
│  └─────────────┴──────────┴──────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Session Recorder             │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Playback Engine              │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Storage Manager              │  │
│  │      (localStorage)               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## Core Modules

### 1. App Component (`App.tsx`)
**Responsibilities**:
- Root component and state container
- Manages application mode (landing, jamming, review)
- Renders ModalManager and JamSession components
- Handles escape key detection (5-second hold)

**State**:
```typescript
interface AppState {
  mode: 'landing' | 'jamming' | 'review';
  currentSession: Session | null;
  escapeProgress: number; // 0-100
}
```

---

### 2. Modal Manager (`components/ModalManager.tsx`)
**Responsibilities**:
- Renders overlay modals (landing, review)
- Handles "START JAM" interaction
- Displays playback controls and download options
- Styled with KidPix aesthetic

**Props**:
```typescript
interface ModalManagerProps {
  mode: 'landing' | 'review';
  session?: Session;
  onStartJam: () => void;
  onReplay: () => void;
  onDownloadCanvas: () => void;
  onDownloadAudio: () => void;
}
```

---

### 3. Jam Session (`components/JamSession.tsx`)
**Responsibilities**:
- Main jamming interface container
- Orchestrates Audio, Visual, and Shader engines
- Captures keyboard events and routes to KeyboardMapper
- Manages recording buffer

**Hooks Used**:
- `useKeyboardInput()`: Captures all keyboard events
- `useSessionRecorder()`: Records events to session buffer
- `useAudioEngine()`: Interfaces with Tone.js
- `useVisualEngine()`: Interfaces with Canvas
- `useShaderEngine()`: Interfaces with Three.js

---

### 4. Keyboard Input Handler (`hooks/useKeyboardInput.ts`)
**Responsibilities**:
- Captures all keyboard events globally
- Prevents default browser behaviors (F5, Ctrl+W, etc.)
- Emits normalized key events to subscribers
- Handles escape key hold detection

**Event Format**:
```typescript
interface KeyEvent {
  key: string;
  code: string;
  timestamp: number;
}
```

---

### 5. Keyboard Mapper (`core/KeyboardMapper.ts`)
**Responsibilities**:
- Randomly assigns functions to all keyboard keys on session start
- Uses seeded random for reproducibility
- Ensures balanced distribution of function types
- Maps key events to actions

**Function Types**:
```typescript
type FunctionType =
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

interface KeyMapping {
  key: string;
  functions: FunctionType[]; // Can have multiple
  params: Record<string, any>; // Randomized params
}
```

**Distribution Algorithm**:
```typescript
// Target distribution
const distribution = {
  audio: 0.4,      // 40% musical/sound
  permanent: 0.3,  // 30% permanent visual
  animated: 0.2,   // 20% animations
  effects: 0.1,    // 10% background/shader
};
```

---

### 6. Audio Engine (`core/AudioEngine.ts`)
**Responsibilities**:
- Initializes Tone.js synthesizers and samplers
- Manages multiple synth voices (polyphony)
- Triggers sounds, notes, and patterns
- Handles beat/loop patterns that can layer

**Synth Modes**:
```typescript
enum SynthMode {
  Bass = 'bass',           // AMSynth, low freq
  Melody = 'melody',       // FMSynth, mid-high freq
  Percussion = 'percussion', // NoiseSynth + Sampler
  Chaos = 'chaos',         // MetalSynth, distortion
  Mixed = 'mixed',         // Combination
}
```

**Sound Library**:
- Load samples for: animals, silly sounds, percussion
- Use Tone.Sampler for playback
- Preload on app init

**Beat Patterns**:
```typescript
interface BeatPattern {
  id: string;
  sequence: number[]; // Steps: 0 = rest, 1 = hit
  tempo: number;      // BPM
  sound: string;      // Sample or synth
}
```

**Key Methods**:
```typescript
class AudioEngine {
  init(): Promise<void>;
  playNote(note: string, mode: SynthMode): void;
  playSoundEffect(name: string): void;
  startBeatPattern(pattern: BeatPattern): string;
  stopBeatPattern(id: string): void;
  stopAll(): void;
}
```

---

### 7. Visual Engine (`core/VisualEngine.ts`)
**Responsibilities**:
- Manages HTML5 Canvas 2D context
- Renders permanent additions (shapes, symbols, text)
- Manages animated elements with lifecycle
- Applies color scheme to all elements
- Handles canvas export to PNG

**Element Types**:
```typescript
interface PermanentElement {
  type: 'shape' | 'symbol' | 'word' | 'animal' | 'number';
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  data: any; // Type-specific data
}

interface AnimatedElement extends PermanentElement {
  animation: 'bounce' | 'move' | 'spin' | 'grow';
  startTime: number;
  duration: number;
  velocity?: { x: number; y: number };
  easing: EasingFunction;
}
```

**Rendering Pipeline**:
1. Clear frame (or accumulate for trails)
2. Render background effects
3. Render permanent elements (z-order sorted)
4. Update and render animated elements
5. Apply post-processing effects
6. Request next frame

**Key Methods**:
```typescript
class VisualEngine {
  init(canvas: HTMLCanvasElement): void;
  addPermanentElement(element: PermanentElement): void;
  addAnimatedElement(element: AnimatedElement): void;
  setBackgroundColor(color: string): void;
  addBackgroundEffect(effect: BackgroundEffect): void;
  clear(): void;
  exportPNG(): Blob;
  startRenderLoop(): void;
  stopRenderLoop(): void;
}
```

---

### 8. Shader Engine (`core/ShaderEngine.ts`)
**Responsibilities**:
- Manages Three.js WebGL renderer
- Applies full-screen post-processing shader effects
- Composites with Canvas 2D output
- Provides effect library (glitch, distortion, kaleidoscope, etc.)

**Effect Library**:
```typescript
enum ShaderEffect {
  Glitch = 'glitch',
  ChromaticAberration = 'chromatic',
  Kaleidoscope = 'kaleidoscope',
  Ripple = 'ripple',
  Pixelate = 'pixelate',
  ColorShift = 'colorshift',
  Trails = 'trails',
}

interface ShaderEffectConfig {
  type: ShaderEffect;
  intensity: number;
  duration: number; // ms, 0 = permanent
}
```

**Implementation**:
- Use Three.js EffectComposer for post-processing
- Custom fragment shaders for each effect
- Effects can stack/combine
- Render canvas texture through shader pipeline

**Key Methods**:
```typescript
class ShaderEngine {
  init(container: HTMLElement): void;
  applyEffect(config: ShaderEffectConfig): void;
  clearEffects(): void;
  setCanvasTexture(canvas: HTMLCanvasElement): void;
  render(): void;
}
```

---

### 9. Session Recorder (`core/SessionRecorder.ts`)
**Responsibilities**:
- Records all session events in real-time
- Maintains rolling 3-minute buffer
- Captures session metadata (seed, color scheme, etc.)
- Exports session to JSON format
- Records audio stream for export

**Session Format**:
```typescript
interface Session {
  id: string;
  timestamp: string;
  duration: number; // seconds
  seed: number;
  colorScheme: string;
  events: SessionEvent[];
  audioBlob?: Blob; // Recorded audio
}

interface SessionEvent {
  time: number; // seconds from start
  type: 'keypress';
  key: string;
  functions: FunctionType[];
  params: Record<string, any>;
}
```

**Rolling Buffer**:
- Keep last 180 seconds (3 minutes) of events
- Drop older events as new ones arrive
- Efficient circular buffer implementation (array with head/tail pointers)
- On each recordEvent(), check timestamp and filter out events older than 180s
- Store events in chronological order for easy replay

**Audio Recording**:
- Use MediaRecorder API with Tone.js Destination as audio source
- Capture using `const dest = Tone.getContext().rawContext.destination`
- Create MediaStream from destination: `const stream = dest.stream`
- Record to WebM format (best browser support)
- Store as Blob in session object
- Export as-is (no browser-based MP3 conversion in Phase 1)
- **Fallback**: If MediaRecorder unavailable, skip audio recording (visual-only session)

**Key Methods**:
```typescript
class SessionRecorder {
  startRecording(seed: number, colorScheme: string): void;
  recordEvent(event: SessionEvent): void;
  stopRecording(): Session;
  exportSession(): string; // JSON
  getAudioBlob(): Blob;
}
```

---

### 10. Playback Engine (`core/PlaybackEngine.ts`)
**Responsibilities**:
- Recreates session from recorded data
- Synchronizes audio and visual playback
- Uses same engines (Audio, Visual, Shader) as live mode
- Respects original timing and randomness (via seed)

**Playback Flow**:
1. Load session JSON
2. Initialize engines with session seed
3. Restore KeyboardMapper state (same random assignments)
4. Play audio blob
5. Trigger events at recorded timestamps
6. Sync audio and visual precisely

**Key Methods**:
```typescript
class PlaybackEngine {
  loadSession(session: Session): void;
  play(): void;
  pause(): void;
  stop(): void;
  seek(time: number): void;
  getCurrentTime(): number;
}
```

---

### 11. Storage Manager (`core/StorageManager.ts`)
**Responsibilities**:
- Saves sessions to browser localStorage
- Retrieves sessions by ID
- Manages storage quota
- Handles data serialization

**Storage Format**:
```typescript
// localStorage keys
const KEYS = {
  SESSION_PREFIX: 'babytime_session_',
  LATEST_SESSION: 'babytime_latest',
};
```

**Key Methods**:
```typescript
class StorageManager {
  saveSession(session: Session): boolean;
  getSession(id: string): Session | null;
  getLatestSession(): Session | null;
  clearOldSessions(): void; // Keep only last 5
}
```

---

## Data Flow

### Starting a Jam Session
```
User clicks "START JAM"
  ↓
App generates random seed
  ↓
KeyboardMapper assigns functions using seed
  ↓
Audio/Visual/Shader engines initialize
  ↓
SessionRecorder starts recording
  ↓
App enters 'jamming' mode
```

### During Jam Session
```
User presses key
  ↓
useKeyboardInput captures event
  ↓
KeyboardMapper looks up assigned functions
  ↓
Functions trigger in parallel:
  ├→ AudioEngine plays sound/note
  ├→ VisualEngine adds element to canvas
  └→ ShaderEngine applies effect
  ↓
SessionRecorder logs event
  ↓
Rolling buffer updated (drop events > 3min old)
```

### Exiting Jam Session
```
User holds ESCAPE for 5 seconds
  ↓
Progress indicator shows countdown
  ↓
At 5 seconds, App stops recording
  ↓
SessionRecorder exports Session object
  ↓
StorageManager saves to localStorage
  ↓
App enters 'review' mode
  ↓
ModalManager shows playback/download options
```

### Replaying a Session
```
User clicks "REPLAY YOUR JAM"
  ↓
PlaybackEngine loads session
  ↓
Engines re-initialize with session seed
  ↓
Audio blob begins playback
  ↓
Events trigger at recorded timestamps
  ↓
Visual recreation happens in sync
```

---

## File Structure

```
babytime/
├── public/
│   ├── sounds/              # Audio samples
│   │   ├── animals/
│   │   ├── silly/
│   │   └── percussion/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── App.tsx
│   │   ├── ModalManager.tsx
│   │   ├── JamSession.tsx
│   │   └── EscapeProgress.tsx
│   ├── core/
│   │   ├── AudioEngine.ts
│   │   ├── VisualEngine.ts
│   │   ├── ShaderEngine.ts
│   │   ├── KeyboardMapper.ts
│   │   ├── SessionRecorder.ts
│   │   ├── PlaybackEngine.ts
│   │   └── StorageManager.ts
│   ├── hooks/
│   │   ├── useKeyboardInput.ts
│   │   ├── useAudioEngine.ts
│   │   ├── useVisualEngine.ts
│   │   ├── useShaderEngine.ts
│   │   └── useSessionRecorder.ts
│   ├── shaders/
│   │   ├── glitch.frag
│   │   ├── kaleidoscope.frag
│   │   ├── chromatic.frag
│   │   └── ...
│   ├── utils/
│   │   ├── random.ts          # Seeded random
│   │   ├── colors.ts          # Color schemes
│   │   ├── shapes.ts          # Shape drawing
│   │   └── easing.ts          # Animation easing
│   ├── types/
│   │   ├── session.ts
│   │   ├── keyboard.ts
│   │   └── elements.ts
│   ├── constants/
│   │   ├── distributions.ts   # Key function distribution
│   │   └── config.ts          # App config
│   ├── styles/
│   │   ├── global.css
│   │   ├── modal.module.css
│   │   └── kidpix.css         # KidPix aesthetic
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .cursorrules
├── PROJECT_SPEC.md
├── TECHNICAL_ARCHITECTURE.md
├── WORK_INSTRUCTIONS.md
└── README.md
```

---

## Performance Considerations

### Optimization Strategies
1. **Canvas Rendering**:
   - Use off-screen canvas for complex elements
   - Implement dirty region tracking (only redraw changed areas)
   - Limit simultaneous animated elements (max 20)

2. **Audio**:
   - Limit polyphony (max 8 simultaneous voices)
   - Pool and reuse Tone.js instruments
   - Preload all samples on app init

3. **WebGL**:
   - Reuse shader programs
   - Minimize texture uploads
   - Batch draw calls

4. **Memory**:
   - Remove completed animations from array
   - Limit recording buffer to 3 minutes strict
   - Clear old sessions from localStorage

5. **Event Handling**:
   - Throttle rapid keypresses (10ms min between)
   - Debounce window resize events

---

## Browser Compatibility

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required APIs
- Web Audio API (Tone.js)
- WebGL 2.0 (Three.js)
- Canvas 2D
- localStorage
- MediaRecorder (for audio export)
- Blob/File APIs

### Fallbacks
- If WebGL fails, disable shader effects (graceful degradation)
- If MediaRecorder unavailable, skip audio recording
- If localStorage full, warn user and continue without saving

---

## Security & Privacy

### Phase 1 Considerations
- All data stays local (localStorage)
- No analytics or tracking
- No cookies
- No external API calls (except CDN for libs)
- No user data collection

---

## Testing Strategy

### Unit Tests
- KeyboardMapper random distribution
- SessionRecorder buffer rolling
- Seeded random reproducibility
- Color scheme generation

### Integration Tests
- Full jam session flow
- Playback accuracy
- Audio/visual sync
- Export functionality

### Manual Testing
- Cross-browser compatibility
- Performance on lower-end devices
- Keyboard edge cases (held keys, rapid mashing)
- Storage quota limits

---

## Deployment

### Build Process
```bash
npm run build        # Vite builds to /dist
npm run preview      # Test production build locally
```

### Cloudflare Pages Deployment

**Option 1: Git Integration (Recommended)**
1. Connect repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
3. Automatic deployment on push to main branch

**Option 2: Direct Upload**
```bash
npm run build
npx wrangler pages deploy dist --project-name=dinkytime
```

### Build Configuration
```
Build command: npm run build
Build output: dist/
Node version: 20.x
```

No server-side code needed - pure static site with edge delivery.

---

## Future Enhancements (Phase 2+)

- Backend API (Express + PostgreSQL)
- Gallery/feed with pagination
- Social sharing (Twitter, Facebook)
- User accounts and profiles
- Likes, comments, favorites
- Advanced playback controls (speed, filters)
- Collaborative multiplayer jams
- MIDI keyboard support
- Mobile/touch optimizations
- VR/AR mode

---

## Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "tone": "^14.8.0",
  "three": "^0.158.0"
}
```

### Dev Dependencies
```json
{
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "eslint": "^8.55.0",
  "prettier": "^3.1.0"
}
```

---

## Risk Assessment

### Technical Risks
1. **Audio Latency**: Web Audio can have delays on some devices
   - Mitigation: Optimize buffer sizes, preload samples

2. **Canvas Performance**: Many elements may slow down
   - Mitigation: Limit simultaneous elements, use off-screen canvas

3. **Browser Compatibility**: Older browsers may not support features
   - Mitigation: Feature detection, graceful degradation

4. **Storage Limits**: localStorage has quota limits
   - Mitigation: Implement cleanup, warn user when near limit

### UX Risks
1. **Confusing UX**: Parents may not understand how to exit
   - Mitigation: Clear instructions in landing modal

2. **Overwhelming Audio**: Too many sounds may be cacophonous
   - Mitigation: Smart polyphony limiting, volume balancing

3. **Visual Clutter**: Canvas may become unreadable
   - Mitigation: Fade old elements, limit density

---

## Success Metrics

### Technical Metrics
- FPS maintained above 55 (target 60)
- Audio latency below 50ms
- App loads in < 3 seconds
- Zero crashes during 5-minute sessions

### UX Metrics
- Parents can start and stop sessions easily
- Recordings play back accurately (no sync drift)
- Downloads work in all target browsers
- No accidental exits during testing

---

## Notes
This architecture prioritizes simplicity and client-side operation for Phase 1. All complexity is managed in the browser. Phase 2 will introduce server-side components for social features.

