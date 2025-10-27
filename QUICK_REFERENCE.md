# BabyTime - Quick Reference Card

**Keep this handy during development!**

---

## 🚀 Quick Commands

```bash
# Setup
npm create vite@latest babytime -- --template react-ts
cd babytime
npm install
npm install tone three @types/three
npm install -D @types/node eslint prettier

# Development
npm run dev              # http://localhost:5173
npm run build            # Production build to /dist
npm run preview          # Test production build

# Deployment
npm run build            # Build for production
npx wrangler pages deploy dist --project-name=dinkytime  # Deploy to Cloudflare
# Or use Git integration (auto-deploy on push)
```

---

## 📋 Project Stats

- **Timeline**: 51-68 hours (1.5-2 weeks full-time)
- **Phase 1 Scope**: Core jamming only (no backend, no social)
- **Target Performance**: 60 FPS, <50ms audio latency
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Tech Stack**: React 18 + TypeScript 5 + Vite 5 + Tone.js 14 + Three.js

---

## 🗂️ File Structure

```
src/
├── components/       # React components (App, Modal, JamSession)
├── core/            # Engines (Audio, Visual, Shader, Recorder)
├── hooks/           # Custom React hooks (useAudioEngine, etc.)
├── shaders/         # GLSL fragment shaders (.frag files)
├── utils/           # Utilities (random, colors, shapes, easing)
├── types/           # TypeScript type definitions
├── constants/       # Config and distribution constants
└── styles/          # CSS (global, kidpix, modal)

public/
└── sounds/          # Audio samples
    ├── animals/
    ├── silly/
    └── percussion/
```

---

## 🎯 Core Concepts

### Seeded Random (Reproducibility)
```typescript
// ✅ Always use this for game logic
const rng = new SeededRandom(seed);
const value = rng.range(0, 100);

// ❌ Never use this for game logic
const value = Math.random() * 100;
```

### Audio Context (User Gesture Required)
```typescript
// ✅ Start audio on user interaction
<button onClick={async () => {
  await Tone.start();
  synth.triggerAttackRelease('C4', '8n');
}}>
```

### Resource Cleanup (No Memory Leaks)
```typescript
// ✅ Always dispose in cleanup
useEffect(() => {
  const synth = new Tone.Synth().toDestination();
  return () => synth.dispose();
}, []);
```

### Canvas Context (Save/Restore)
```typescript
// ✅ Isolate transforms
ctx.save();
ctx.translate(x, y);
ctx.rotate(rotation);
// ... draw ...
ctx.restore();
```

---

## 🎨 Key Features Checklist

### Audio
- [ ] Multiple synth modes (bass, melody, percussion, chaos)
- [ ] Sound effects (animals, silly sounds)
- [ ] Beat patterns (looping)
- [ ] Polyphony limit (8 simultaneous notes)
- [ ] Preload all samples

### Visual
- [ ] Canvas 2D rendering
- [ ] Permanent elements (shapes, emoji, text)
- [ ] Animated elements (bounce, spin, move)
- [ ] Background effects (colors, particles)
- [ ] KidPix aesthetic (4px black outlines)

### Shader
- [ ] Three.js WebGL renderer
- [ ] Post-processing effects
- [ ] Glitch, kaleidoscope, ripple, chromatic
- [ ] Graceful fallback if WebGL unavailable

### Recording
- [ ] Circular 3-minute buffer
- [ ] MediaRecorder for audio
- [ ] Keypress timestamps
- [ ] Canvas snapshots (10s intervals)
- [ ] Seed for reproducibility

### Playback
- [ ] Recreate from recorded events
- [ ] Audio-visual sync
- [ ] Same random seed = same output

---

## ⚡ Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Frame Rate | 60 FPS | Yes |
| Audio Latency | <50ms | Yes |
| Initial Load | <3s | No |
| Memory Growth | Stable | Yes |
| Max Animations | 20 simultaneous | Yes |
| Max Polyphony | 8 notes | Yes |

---

## 🐛 Common Issues & Fixes

### Audio doesn't play
```typescript
// Add await Tone.start() on user gesture
await Tone.start();
```

### Canvas is blank
```javascript
// Check canvas size is set
canvas.width = 2000;
canvas.height = 2000;
```

### WebGL errors
```typescript
// Add try-catch for graceful fallback
try {
  renderer = new THREE.WebGLRenderer();
} catch (e) {
  // Disable shader effects
  console.warn('WebGL unavailable, running without shaders');
}
```

### Memory leaks
```typescript
// Dispose ALL resources
synth.dispose();
geometry.dispose();
material.dispose();
texture.dispose();
```

### TypeScript errors
```bash
# Check types are installed
npm install @types/three @types/node
```

---

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tone": "^14.8.0",
    "three": "^0.158.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/three": "^0.158.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🎼 Function Distribution

| Function Type | Percentage |
|--------------|-----------|
| synth-note | 15% |
| percussion | 10% |
| sound-effect | 10% |
| beat-pattern | 5% |
| shape-permanent | 15% |
| symbol-spawn | 10% |
| word-spawn | 5% |
| animal-spawn | 10% |
| number-spawn | 5% |
| animation-bounce | 5% |
| animation-move | 5% |
| background-color | 3% |
| background-effect | 2% |
| shader-glitch | 3% |
| shader-distort | 2% |

---

## 🌈 Color Schemes

- **primary**: Red, blue, yellow, green, magenta
- **neon**: Hot pink, cyan, lime, magenta, yellow
- **pastel**: Soft pink, mint, baby blue, cream
- **earth**: Orange, brown, forest green, tan
- **ocean**: Teal, navy, aqua, steel blue
- **candy**: Magenta, purple, cyan, hot pink

---

## 📚 Essential Docs

1. **GETTING_STARTED.md** ⭐ Read first!
2. **PROJECT_SPEC.md** - What we're building
3. **TECHNICAL_ARCHITECTURE.md** - How it works
4. **WORK_INSTRUCTIONS.md** - Step-by-step guide
5. **DEPLOYMENT_CHECKLIST.md** - Pre-deploy verification

---

## 🎯 Phase Breakdown

| Phase | Hours | Focus |
|-------|-------|-------|
| 0: Setup | 3-4 | Config, folders, deps |
| 1: Utils | 2-3 | Types, random, colors |
| 2: Engines | 20-26 | Audio, Visual, Shader |
| 3: Hooks | 2-3 | React integration |
| 4: Components | 4-5 | UI, Modal, Jam |
| 5: Styling | 3-4 | CSS, KidPix look |
| 6: Assets | 2-3 | Sounds, fonts |
| 7: Testing | 5-7 | Cross-browser, perf |
| 8: Polish | 3-4 | UX, errors |
| 9: Deploy | 1-2 | Cloudflare Pages |
| **Total** | **50-67** | **1.5-2 weeks FT** |

---

## 💡 Pro Tips

1. **Test frequently**: Don't wait until everything is built
2. **Use Cursor AI**: .cursorrules file provides context
3. **Profile performance**: Chrome DevTools Performance tab
4. **Console is your friend**: Keep DevTools open always
5. **Commit often**: Small, atomic commits with good messages
6. **Read the specs**: Save time by understanding first
7. **Ask for help**: Use Cursor AI or documentation
8. **Embrace chaos**: This is art software, have fun!

---

## 🚨 Critical Rules

### ✅ ALWAYS
- Use SeededRandom for reproducible randomness
- Call Tone.start() on user gesture before audio
- Dispose resources (synths, geometries, materials)
- Save/restore canvas context around transforms
- Test cross-browser (Chrome, Firefox, Safari)
- Keep frame rate at 60 FPS

### ❌ NEVER
- Use Math.random() for game logic
- Start audio without user gesture
- Forget to clean up resources
- Skip testing on target browsers
- Deploy without checking DEPLOYMENT_CHECKLIST.md

---

## 📞 Get Help

- **Cursor AI**: Ask questions using .cursorrules context
- **Tone.js docs**: https://tonejs.github.io/
- **Three.js docs**: https://threejs.org/docs/
- **React docs**: https://react.dev/
- **Vite docs**: https://vitejs.dev/

---

**Print this card or keep it open in a tab!** 📌

_Last updated: October 24, 2025_

