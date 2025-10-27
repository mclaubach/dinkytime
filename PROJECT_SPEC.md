# BabyTime - Project Specification

## Project Overview
**BabyTime** is an immersive, web-based musical-visual jamming experience for babies and toddlers. Inspired by KidPix aesthetics and Blipblox synthesizers, it transforms keyboard mashing into a creative, multi-sensory art session that records and plays back the chaos.

## Core Concept
When a baby opens the app and starts pressing keys, they create a unique audio-visual composition. Each key triggers random combinations of:
- Synthesizer sounds and musical notes
- Visual canvas additions (shapes, symbols, words, animals, numbers)
- Animated effects (bouncing, moving, transforming elements)
- Background effects (color changes, sparkles, stars, gradients)
- Silly sound effects mixed with musical patterns

## Phase 1: Core Jamming Experience (Current Scope)
Focus exclusively on the jam session functionality. Gallery, sharing, and social features are Phase 2.

---

## Functional Requirements

### 1. Application Launch & Modal
- **Landing Modal**: On first visit, display a modal overlay on top of the canvas
  - Bright, fun, KidPix-style design
  - Clear "START JAM" button
  - Brief explanation of the concept (optional info toggle)
  - Modal sits on top of the canvas background
  
- **Starting a Jam**: Clicking "START JAM" dismisses modal and begins session

### 2. Jam Session Core Mechanics

#### Key Assignment System
- **Random Assignment**: On session start, randomly assign all keyboard keys to functions
- **Function Types**:
  - Musical synthesizer notes (various synth modes)
  - Percussion/beat triggers
  - Visual canvas painters (permanent additions)
  - Animated elements (temporary, moving)
  - Symbol/emoji spawners
  - Word generators (baby words like "BABA", "MAMA", "WOW")
  - Background effect triggers
  - Animal images/sounds
  - Shape generators
  - Number spawners
  - Color changers
  - Shader/WebGL effects
  
- **Mixed Functionality**: Some keys can trigger BOTH audio and visual simultaneously
- **Randomization Strategy**: Ensure a good mix of:
  - 40% musical/synth functions
  - 30% visual permanent additions
  - 20% animated effects
  - 10% background/shader effects

#### Audio Engine
- **Synthesizer Modes**:
  - Bass mode (low, rumbling tones)
  - Melody mode (mid to high range notes)
  - Percussion mode (drums, clicks, claps)
  - Chaos mode (glitchy, weird sounds)
  - Mixed mode (combination of above)
  
- **Sound Effects Library**: Include silly sounds:
  - Boings, lasers, zaps
  - Animal sounds (no dinosaurs!)
  - Bubbles, pops, whooshes
  - Baby giggles, silly voices
  - Musical instruments (toy-like)
  
- **Beat/Pattern Engine**: 
  - Some keys trigger looping beats that drive the session
  - Patterns can layer and combine
  - Tempo randomized per session (keep it upbeat)

#### Visual Engine
- **Canvas System**: HTML5 Canvas with WebGL overlay for effects
  
- **Permanent Additions**:
  - Thick black outlines (KidPix style, 4px stroke width)
  - High-contrast, primary colors from session color scheme
  - Shapes: circles, squares, triangles, stars, hearts (canvas-drawn, not images)
  - Animals: emoji representations (🐱🐶🐦🐠🐰🐻) for simplicity, no image assets needed
  - Numbers: 1-10 in Comic Sans or web font, size range 40-120px
  - Symbols: Unicode characters (★ ♥ ● ■ ▲ ✿ ☀ ☾) rendered as text
  - Words: baby words (BABA, MAMA, WOW, YAY, BOO, HI) in bold, fun fonts
  - Splatter/paint effects: random bezier curves with varying opacity
  
- **Animated Elements**:
  - Bouncing shapes that persist for 3-10 seconds
  - Moving text that scrolls across
  - Spinning/rotating elements
  - Growing/shrinking animations
  - Physics-based bounces
  
- **Background Effects**:
  - Full background color changes
  - Gradient shifts
  - Sparkle overlays
  - Star fields
  - Particle systems
  
- **WebGL/Shader Effects**:
  - Screen shake
  - Color distortions
  - Glitch effects
  - Trails and motion blur
  - Kaleidoscope patterns
  - Ripple effects
  - Rainbow chromatic aberration
  - Pixelation/mosaic effects

#### Color Scheme
- **Random Per Session**: Each jam gets a unique color palette
- **Palette Options**:
  - Primary colors (red, blue, yellow)
  - Neon (hot pink, electric blue, lime green)
  - Pastels (soft pink, baby blue, mint)
  - Earth tones (orange, brown, forest green)
  - Ocean (teal, navy, aqua)
  - Candy (magenta, purple, cyan)
  
- **Always Include**: Black for outlines, white for highlights

### 3. Session Management

#### Recording
- **Duration**: Sessions feel continuous and infinite to the user (no visible timer or limits)
- **Saved Duration**: Only last 3 minutes are retained (rolling buffer silently discards older data)
- **Recording Buffer**: Circular 3-minute buffer that continuously overwrites oldest events
- **Buffer Strategy**: As new events arrive, events older than 180 seconds are automatically removed
- **Data Captured**:
  - Timestamp of each keypress (milliseconds since jam start)
  - Key pressed (key code and character)
  - Assigned function that was triggered
  - Random seed for reproducibility (stored once at session start)
  - Audio events (including beat pattern starts/stops)
  - Canvas state snapshots every 10 seconds (for faster replay seeking)

#### Playback System
- **Replay Capability**: Recorded sessions can be replayed
- **Real-time Recreation**: Playback recreates both audio and visual in sync
- **Playback Controls**: (minimal, parent-facing)
  - Play/Pause
  - Download canvas as PNG
  - Download audio as WAV/MP3
  - Restart replay

#### Exiting Jam Mode
- **Hidden Exit**: Hold ESCAPE key for 5 seconds continuously
- **Visual Feedback**: Subtle progress indicator appears after 2 seconds
- **Exit Action**: Returns to landing modal overlay
- **Options Presented**:
  - "REPLAY YOUR JAM"
  - "DOWNLOAD CANVAS"
  - "DOWNLOAD AUDIO"
  - "START NEW JAM"

### 4. Session Protection
- **No Accidental Exits**: Single keypresses, clicks, or gestures don't end session
- **No Clear Canvas**: No way to accidentally clear work during jam
- **Full Screen Immersion**: No visible UI elements during jam
- **No Timer Visible**: 3-minute limit is hidden from user

---

## Technical Requirements

### Technology Stack
- **Frontend Framework**: Three.js for WebGL + React for UI/state management
- **Audio Engine**: Tone.js (Web Audio API wrapper) for synthesis and effects
- **Canvas Rendering**: HTML5 Canvas 2D + WebGL (Three.js) for shader effects
- **Build Tool**: Vite for fast dev and optimized builds
- **Language**: TypeScript for type safety
- **Styling**: CSS Modules or Styled Components (keep it playful)

### Architecture
- **Modular Design**:
  - `AudioEngine`: Manages synthesis, sounds, patterns
  - `VisualEngine`: Manages canvas rendering, animations
  - `ShaderEngine`: Manages WebGL effects via Three.js
  - `KeyboardMapper`: Random key assignment system
  - `SessionRecorder`: Captures and stores session data
  - `PlaybackEngine`: Recreates sessions from recordings
  - `ModalManager`: Handles UI overlays
  
### Performance Requirements
- **60 FPS**: Maintain smooth animation even with many elements
- **Audio Latency**: < 50ms from keypress to sound (target < 30ms)
- **Memory Management**: Clear old animations, limit simultaneous effects, dispose WebGL resources
- **Browser Tab Handling**: Properly suspend/resume audio context when tab loses focus
- **Asset Loading**: Graceful fallbacks if sound samples fail to load (synthesize tones only)
- **Mobile Support**: NOT in Phase 1 scope (keyboard-only focus)

### Data Storage
- **Session Format**: JSON structure containing:
  ```json
  {
    "id": "unique-session-id",
    "timestamp": "ISO-8601",
    "duration": 180,
    "seed": 12345,
    "colorScheme": "neon",
    "events": [
      {
        "time": 1.234,
        "key": "a",
        "function": "shape-circle",
        "params": {...}
      }
    ]
  }
  ```
  
- **Local Storage**: Phase 1 uses browser localStorage for session saving
- **Export Format**: 
  - Canvas: PNG (2000x2000px)
  - Audio: MP3 (compressed) or WAV (lossless)

---

## Design Requirements

### Visual Aesthetic
- **KidPix Inspiration**: 
  - Thick black outlines on everything
  - Bright, saturated colors
  - Simple, chunky shapes
  - Fun, bouncy fonts
  - Stamp-like elements
  - Textured/patterned fills
  
- **Baby-Focused**:
  - Large, high-contrast elements
  - Rounded corners everywhere
  - No small details or fine lines
  - Recognizable animals and objects
  - Friendly, welcoming vibe

### Audio Aesthetic
- **Toy-like Quality**: Sounds should feel playful, not professional
- **Layering**: Multiple sounds can play simultaneously without cacophony
- **Dynamic Range**: Mix quiet and loud, low and high
- **Rhythm**: Beat patterns provide structure to chaos
- **No Harsh Sounds**: Avoid anything scary or jarring

### Animation Principles
- **Bounce and Squash**: Use easing functions for playful motion
- **Overlap**: Multiple animations happening at once
- **Unpredictability**: Same key might behave slightly differently each press
- **Energy**: Keep everything lively and dynamic

---

## User Experience Flow

1. **Landing**: User visits site → sees canvas with modal overlay
2. **Start**: Clicks "START JAM" → modal fades away
3. **Jamming**: Baby mashes keyboard → chaos ensues for ~1-3 minutes
4. **Exit**: Parent holds ESCAPE for 5 seconds → progress bar appears
5. **Review**: Modal returns with playback and download options
6. **Actions**: Parent can replay, download, or start new jam

---

## Out of Scope (Phase 2)
- User authentication
- Gallery/feed of public jams
- Social sharing features
- Commenting or liking
- User profiles
- Database storage
- Server-side processing
- Advanced editing tools
- Multi-user collaborative jams

---

## Success Criteria
1. A baby can mash keys and create interesting audio-visual output
2. No way to accidentally break or exit the experience
3. Sessions are recordable and replayable with accuracy
4. Visual effects are delightful and varied
5. Audio feels musical despite randomness
6. Parents can easily save and share the output
7. App loads quickly and runs smoothly
8. Experience feels unique each time (high randomization)

---

## Deployment
- **Development**: Local server (Vite dev server)
- **Production**: Cloudflare Pages deployment at dinkytime.com
- **Requirements**:
  - Static hosting (no backend needed for Phase 1)
  - HTTPS for Web Audio API (automatic with Cloudflare)
  - Global CDN for fast delivery
  - Browser compatibility: Modern Chrome, Firefox, Safari

---

## Timeline Estimate (Realistic Assessment)
- **Setup & Architecture**: 3-4 hours (dependencies, config, folder structure)
- **Core Utilities & Types**: 2-3 hours (seeded random, colors, shapes, constants)
- **Audio Engine**: 6-8 hours (Tone.js setup, synths, samples, beat patterns, polyphony)
- **Visual Engine**: 8-10 hours (canvas rendering, animations, element management, export)
- **Shader/WebGL Effects**: 6-8 hours (Three.js, EffectComposer, custom shaders, debugging)
- **Keyboard System**: 3-4 hours (input handling, mapper, distribution algorithm)
- **Recording/Playback**: 5-7 hours (circular buffer, MediaRecorder, sync logic, replay)
- **React Components**: 4-5 hours (App, Modal, JamSession, hooks integration)
- **UI/Styling**: 3-4 hours (KidPix aesthetic, CSS, modal design)
- **Integration**: 4-5 hours (wiring engines together, debugging interactions)
- **Testing & Polish**: 5-7 hours (cross-browser, performance tuning, UX refinement)
- **Deployment**: 1-2 hours (Cloudflare Pages setup, custom domain, production testing)
- **Total**: ~51-68 hours of focused development (1.5-2 weeks full-time or 3-4 weeks part-time)

**Note**: This assumes experienced developer with React/Tone.js/Three.js knowledge. Add 30-50% time for learning curve if new to these technologies.

---

## Notes
- Embrace chaos and fun over perfection
- Art and weirdness are features, not bugs
- Every jam should feel unique
- The baby is the artist, the app is the instrument

