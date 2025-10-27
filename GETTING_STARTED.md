# Getting Started with BabyTime Development

**Welcome!** This guide will get you up and running with BabyTime development in 30 minutes or less.

---

## Prerequisites

Before starting, ensure you have:

1. **Node.js 20.x** installed ([Download](https://nodejs.org/))
2. **npm** (comes with Node.js)
3. **Git** ([Download](https://git-scm.com/))
4. **Code editor** (VS Code recommended with [Cursor](https://cursor.sh/))
5. **Modern browser** (Chrome, Firefox, Safari, or Edge latest version)

**Check your versions:**
```bash
node --version    # Should be v20.x
npm --version     # Should be 10.x or higher
git --version     # Any recent version
```

---

## Quick Start (5 Minutes)

```bash
# 1. Create project with Vite
npm create vite@latest babytime -- --template react-ts
cd babytime

# 2. Install dependencies
npm install
npm install tone three @types/three
npm install -D @types/node eslint prettier

# 3. Start dev server
npm run dev

# 4. Open browser
# Visit http://localhost:5173
```

You should see the default Vite + React page. Success! 🎉

---

## Project Setup (30 Minutes)

### 1. Configure TypeScript

Edit `tsconfig.json` to add path aliases:

```json
{
  "compilerOptions": {
    // ... existing options ...
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 2. Configure Vite

Edit `vite.config.ts` to enable path aliases:

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

### 3. Create Project Structure

```bash
# Create directories
mkdir -p src/{components,core,hooks,shaders,utils,types,constants,styles}
mkdir -p public/sounds/{animals,silly,percussion}
```

### 4. Copy Documentation Files

The following files should already be in your project root:
- `PROJECT_SPEC.md`
- `TECHNICAL_ARCHITECTURE.md`
- `WORK_INSTRUCTIONS.md`
- `.cursorrules`
- `DEPLOYMENT_CHECKLIST.md`
- `CHANGELOG.md`
- `README.md`
- `GETTING_STARTED.md` (this file)

If not, copy them from the planning directory.

---

## Understanding the Project

### What Are We Building?

BabyTime is a web app where babies mash keyboards to create music and art. Think:
- **KidPix** (90s paint program aesthetic)
- **Blipblox** (baby synthesizers)
- **Pure chaos** (but recorded and replayable)

### Key Features (Phase 1)

✅ Random keyboard mapping (every key does something different)  
✅ Audio synthesis (Tone.js with multiple synth modes)  
✅ Visual canvas (shapes, colors, animations)  
✅ WebGL shaders (glitch effects, kaleidoscopes)  
✅ Session recording (last 3 minutes)  
✅ Playback (recreate the chaos)  
✅ Export (download PNG and audio)  

### Technology Stack

- **React 18**: UI components
- **TypeScript 5**: Type safety
- **Vite 5**: Build tool
- **Tone.js 14**: Audio synthesis
- **Three.js**: WebGL shaders
- **HTML5 Canvas**: 2D drawing

---

## Architecture Overview

```
User presses key
    ↓
KeyboardMapper (random function assignment)
    ↓
Three Engines:
  ├─ AudioEngine (Tone.js → speakers)
  ├─ VisualEngine (Canvas → screen)
  └─ ShaderEngine (Three.js → WebGL effects)
    ↓
SessionRecorder (rolling 3-min buffer)
    ↓
localStorage (save for replay)
```

### Core Modules

1. **KeyboardMapper** (`core/KeyboardMapper.ts`)
   - Randomly assigns functions to keys
   - Uses seeded random for reproducibility

2. **AudioEngine** (`core/AudioEngine.ts`)
   - Tone.js synthesizers (bass, melody, percussion, chaos)
   - Sound effects (animals, silly sounds)
   - Beat patterns (looping rhythms)

3. **VisualEngine** (`core/VisualEngine.ts`)
   - Canvas 2D rendering
   - Permanent elements (shapes, text, emoji)
   - Animated elements (bouncing, spinning)

4. **ShaderEngine** (`core/ShaderEngine.ts`)
   - Three.js WebGL renderer
   - Post-processing effects (glitch, kaleidoscope, etc.)

5. **SessionRecorder** (`core/SessionRecorder.ts`)
   - Records keypresses with timestamps
   - Circular buffer (3-minute window)
   - MediaRecorder for audio capture

6. **PlaybackEngine** (`core/PlaybackEngine.ts`)
   - Recreates sessions from recorded data
   - Syncs audio and visual replay

---

## Development Workflow

### Read the Docs First! (20 minutes)

1. **[PROJECT_SPEC.md](PROJECT_SPEC.md)** - What we're building
2. **[TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)** - How it's structured
3. **[WORK_INSTRUCTIONS.md](WORK_INSTRUCTIONS.md)** - Step-by-step build guide

### Follow the Phases (51-68 hours total)

**Phase 0**: Setup (3-4 hours)
- Configure project
- Install dependencies
- Set up folder structure

**Phase 1**: Core Utilities (2-3 hours)
- TypeScript types
- Seeded random
- Color schemes
- Shape drawing
- Easing functions

**Phase 2**: Core Engines (20-26 hours) ⚠️ LONGEST PHASE
- Audio Engine (6-8 hours)
- Visual Engine (8-10 hours)
- Shader Engine (6-8 hours)

**Phase 3**: React Hooks (2-3 hours)
- useKeyboardInput
- useAudioEngine
- useVisualEngine
- useShaderEngine
- useSessionRecorder

**Phase 4**: Components (4-5 hours)
- App (root component)
- ModalManager (landing/review)
- JamSession (main interface)
- EscapeProgress (hold indicator)

**Phase 5**: Styling (3-4 hours)
- Global CSS
- KidPix aesthetic
- Modal styles

**Phase 6**: Assets (2-3 hours)
- Sound effects (download/create)
- Web fonts

**Phase 7**: Testing (5-7 hours)
- Manual testing checklist
- Cross-browser testing
- Performance profiling

**Phase 8**: Polish (3-4 hours)
- UX improvements
- Error handling
- Performance optimization

**Phase 9**: Deployment (1-2 hours)
- Cloudflare Pages setup
- Production build
- Custom domain configuration
- Deployment verification

---

## Development Tips

### Use Cursor AI Effectively

The `.cursorrules` file configures Cursor AI to help you. Ask questions like:
- "Implement the AudioEngine class following the spec"
- "How do I set up Three.js EffectComposer?"
- "Debug this TypeScript error in KeyboardMapper"

### Test Frequently

Don't wait until everything is built. Test each module as you complete it:
```bash
npm run dev    # Start dev server
# Open http://localhost:5173
```

### Check the Console

Keep browser DevTools open. Watch for:
- TypeScript errors
- Runtime errors
- Performance warnings
- Network issues

### Performance Matters

Target metrics:
- **60 FPS** during jamming
- **< 50ms** audio latency
- **< 3s** initial load time

Use Chrome DevTools Performance tab to profile.

---

## Common Pitfalls

### 1. Web Audio Context

⚠️ **Web Audio requires user gesture to start**

```typescript
// ✅ CORRECT: Start on button click
<button onClick={async () => {
  await Tone.start();
  // Now you can play sounds
}}>START JAM</button>

// ❌ WRONG: Trying to play on page load
useEffect(() => {
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease('C4', '8n'); // Won't work!
}, []);
```

### 2. Memory Leaks

⚠️ **Always clean up resources**

```typescript
// ✅ CORRECT: Dispose in cleanup
useEffect(() => {
  const synth = new Tone.Synth().toDestination();
  return () => {
    synth.dispose(); // Clean up!
  };
}, []);
```

### 3. Seeded Random

⚠️ **Use SeededRandom class, not Math.random()**

```typescript
// ✅ CORRECT: Reproducible randomness
const rng = new SeededRandom(session.seed);
const color = rng.choice(colors);

// ❌ WRONG: Can't replay accurately
const color = colors[Math.floor(Math.random() * colors.length)];
```

### 4. Canvas State

⚠️ **Save/restore context around transforms**

```typescript
// ✅ CORRECT: Context isolated
ctx.save();
ctx.translate(x, y);
ctx.rotate(rotation);
// ... draw stuff ...
ctx.restore();

// ❌ WRONG: Transforms accumulate
ctx.translate(x, y);
// ... draw stuff ...
// Oops, next draw will be offset!
```

---

## Helpful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Test production build locally

# Linting
npm run lint             # Check for issues
npm run lint:fix         # Auto-fix issues

# Git
git status               # Check status
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git log --oneline        # View commit history

# Cloudflare Pages (after setup)
npm run build            # Build production bundle
npx wrangler pages deploy dist --project-name=dinkytime  # Deploy
# Or push to Git for automatic deployment
```

---

## Getting Help

### Documentation
1. **[WORK_INSTRUCTIONS.md](WORK_INSTRUCTIONS.md)** - Detailed step-by-step guide
2. **[TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)** - System design
3. **[PROJECT_SPEC.md](PROJECT_SPEC.md)** - Complete specification

### Library Docs
- **Tone.js**: https://tonejs.github.io/
- **Three.js**: https://threejs.org/docs/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/

### Ask Cursor AI
Use the `.cursorrules` file to get context-aware help:
- "How do I implement the KeyboardMapper?"
- "Debug this audio latency issue"
- "Optimize this canvas rendering code"

---

## Next Steps

1. ✅ Read this guide
2. ✅ Set up project (5 min quick start)
3. 📖 Read PROJECT_SPEC.md (30 min)
4. 📖 Read TECHNICAL_ARCHITECTURE.md (30 min)
5. 🛠️ Start Phase 0: Setup (3-4 hours)
6. 🛠️ Continue through phases in WORK_INSTRUCTIONS.md

---

## Success Mindset

### Remember:
- **Fun over perfection**: It's a baby app, embrace the chaos!
- **Ship Phase 1**: Don't get stuck perfecting details
- **Test with babies**: Real user feedback is invaluable
- **Iterate**: Phase 2 will improve everything

### You're Building:
- 🎨 A creative tool for the tiniest artists
- 🎵 A musical instrument for pure chaos
- 👶 An experience that captures fleeting baby moments
- ❤️ Something parents will love and cherish

---

**Ready? Let's build BabyTime!** 🚀👶🎨🎵

Start with: `npm run dev`

