import { useEffect, useRef, useState } from 'react';
import { AudioEngine } from '../core/AudioEngine';
import { VisualEngine } from '../core/VisualEngine';
import { KeyboardMapper } from '../core/KeyboardMapper';
import { getRandomScheme } from '../utils/colors';
import { SeededRandom } from '../utils/random';
import type { Session } from '../types/session';
import { CONFIG } from '../constants/config';

interface JamSessionProps {
  onStop: (session: Session) => void;
}

/**
 * JamSession - Where the MAGIC happens
 * 
 * A baby mashes keys, and the universe responds with wonder
 */
function JamSession({ onStop }: JamSessionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const visualEngineRef = useRef<VisualEngine | null>(null);
  const keyboardMapperRef = useRef<KeyboardMapper | null>(null);
  const [escapeProgress, setEscapeProgress] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState(1);
  const escapeStartRef = useRef<number | null>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const keypressCountRef = useRef(0);
  const seedRef = useRef(Math.floor(Math.random() * 1000000));

  useEffect(() => {
    const init = async () => {
      const seed = seedRef.current;
      const rng = new SeededRandom(seed);
      const colorScheme = getRandomScheme(rng);

      // Initialize engines
      audioEngineRef.current = new AudioEngine(seed);
      await audioEngineRef.current.init();

      if (canvasRef.current) {
        visualEngineRef.current = new VisualEngine(seed, colorScheme);
        visualEngineRef.current.init(canvasRef.current);
      }

      keyboardMapperRef.current = new KeyboardMapper(seed);

      console.log('🎉 JAM SESSION STARTED!');
      console.log(`Seed: ${seed}`);
      console.log(`Color Scheme: ${colorScheme.name}`);
      console.log('');
      console.log('👶 BABY MODE ACTIVE:');
      console.log('  🚫 System shortcuts blocked');
      console.log('  🔄 Auto-refocus enabled');
      console.log('  🔒 Context menu disabled');
      console.log('');
      console.log('💡 TIP: Press F11 (before baby) for fullscreen!');
      console.log('   (Or use browser fullscreen: Cmd+Ctrl+F on Mac)');
    };

    init();

    // Cleanup
    return () => {
      audioEngineRef.current?.dispose();
      visualEngineRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle SPACEBAR for drawing FIRST (before blocking!)
      if (e.code === 'Space') {
        // Let spacebar through for drawing - don't block it!
        return;
      }
      
      // AGGRESSIVE KEY BLOCKING for baby-proofing! 🍼
      e.preventDefault();
      e.stopPropagation();
      
      // Block ALL system shortcuts that might steal focus
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      
      // Block dangerous key combos
      if (modKey || e.altKey) {
        // Cmd/Ctrl + ANY key = BLOCKED (prevent browser shortcuts)
        console.log(`🚫 Blocked system shortcut: ${e.key}`);
        return;
      }
      
      // Block Tab (switches focus)
      if (e.key === 'Tab') {
        console.log('🚫 Blocked Tab');
        return;
      }
      
      // Block F-keys (fullscreen, devtools, etc.)
      if (e.key.startsWith('F') && e.key.length <= 3) {
        console.log(`🚫 Blocked F-key: ${e.key}`);
        return;
      }
      
      // Block Windows key
      if (e.key === 'Meta' || e.key === 'OS') {
        console.log('🚫 Blocked Windows/Command key');
        return;
      }

      const key = e.key.toLowerCase();

      // Handle ESCAPE hold
      if (key === 'escape') {
        if (!escapeStartRef.current) {
          escapeStartRef.current = Date.now();
        }
        
        const held = Date.now() - escapeStartRef.current;
        const progress = Math.min(100, (held / CONFIG.ESCAPE_HOLD_DURATION) * 100);
        setEscapeProgress(progress);
        
        if (held >= CONFIG.ESCAPE_HOLD_DURATION) {
          // STOP THE JAM
          stopJam();
        }
        return;
      }

      // Regular keypress
      escapeStartRef.current = null;
      setEscapeProgress(0);

      // 🎚️ LOOP CONTROL KEYS (QWEASD) - Handle audio controls FIRST
      const audioEngine = audioEngineRef.current;
      if (audioEngine) {
        switch (key) {
          case 'q':
            // Q = Play/Pause selected layer
            audioEngine.loopManager.togglePlayPause();
            break;
          case 'w':
            // W = Pitch Up
            audioEngine.loopManager.adjustPitch(1);
            break;
          case 'e':
            // E = Tempo Up
            audioEngine.loopManager.adjustTempo(1.1);
            break;
          case 'a':
            // A = Cycle layer (1→2→3→4→1)
            audioEngine.loopManager.cycleLayer();
            setSelectedLayer(audioEngine.loopManager.getSelectedLayer());
            break;
          case 's':
            // S = Pitch Down
            audioEngine.loopManager.adjustPitch(-1);
            break;
          case 'd':
            // D = Tempo Down
            audioEngine.loopManager.adjustTempo(0.9);
            break;
        }
      }

      // Get mapping (control keys still have visual effects!)
      const mapping = keyboardMapperRef.current?.getMapping(key);
      if (!mapping) return;

      keypressCountRef.current++;

      // Check for surprise key
      const isSurprise = keyboardMapperRef.current?.isSurpriseKey(key);

      // 🎭 COMBINATION EFFECTS! (40% chance to trigger MULTIPLE effects at once!)
      const isCombo = Math.random() < 0.4;
      
      // Track if we've spawned a visual element yet (prevent duplicates)
      let visualSpawned = false;
      
      // Execute functions
      mapping.functions.forEach(func => {
        // AUDIO FUNCTIONS
        if (func.includes('synth') || func === 'percussion') {
          audioEngineRef.current?.playNote(mapping.params.synthMode || 'melody');
        }

        // SOUND EFFECTS (honks, beeps, boops, animals!)
        if (func === 'sound-effect') {
          audioEngineRef.current?.playSoundEffect();
        }

        // BEAT LOOPS!
        if (func === 'beat-pattern') {
          if (Math.random() > 0.7) {
            // 30% chance to start a new loop
            audioEngineRef.current?.startBeatLoop();
          } else {
            // 70% chance to modify existing loops
            audioEngineRef.current?.modifyLoops();
          }
        }

        // VISUAL FUNCTIONS (ONLY SPAWN ONE per keypress!)
        if (!visualSpawned && (func.includes('shape') || func.includes('symbol') || 
            func.includes('word') || func.includes('animal') || func.includes('number'))) {
          const isAnimated = func.includes('animation');
          const elementType = mapping.params.elementType || 'shape';
          
          if (isAnimated) {
            // Check for explosion type
            if (func === 'animation-explode') {
              visualEngineRef.current?.addAnimatedElement(elementType, 'explode');
            } else {
              visualEngineRef.current?.addAnimatedElement(elementType);
            }
          } else {
            visualEngineRef.current?.addPermanentElement(elementType);
          }
          
          visualSpawned = true;
        }

        // BACKGROUND CHANGES
        if (func.includes('background-color') && visualEngineRef.current) {
          const rng = new SeededRandom(Date.now());
          const schemes = getRandomScheme(rng);
          visualEngineRef.current.setBackgroundColor(schemes.background);
        }
        
        // MATH FLASH! 🧮
        if (func === 'math-flash') {
          visualEngineRef.current?.flashMath();
        }
      });
      
      // 🎨 COMBO BONUS: Add extra effects!
      if (isCombo && !visualSpawned) {
        // Random temporary animation
        const comboTypes = ['shape', 'symbol', 'animal'];
        const comboType = comboTypes[Math.floor(Math.random() * comboTypes.length)];
        visualEngineRef.current?.addAnimatedElement(comboType, 'explode');
        visualSpawned = true;
      }
      
      // 🎵 COMBO BONUS: Extra sound!
      if (isCombo) {
        audioEngineRef.current?.playSoundEffect();
      }

      // CELEBRATION at milestones
      if (keypressCountRef.current === CONFIG.CELEBRATION_THRESHOLD) {
        celebrate();
      } else if (keypressCountRef.current % CONFIG.CELEBRATION_MILESTONE === 0) {
        celebrate();
      }

      // Surprise key magic
      if (isSurprise) {
        audioEngineRef.current?.playSurpriseChord();
        visualEngineRef.current?.burstParticles(30);
        console.log('✨ SURPRISE KEY ACTIVATED! ✨');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'escape') {
        escapeStartRef.current = null;
        setEscapeProgress(0);
      }
    };

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      console.log('🚫 Blocked right-click menu');
    };
    
    // Use capture phase to intercept ALL keyboard events before browser can handle them
    window.addEventListener('keydown', handleKeyDown, true); // Capture phase!
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // AUTO-REFOCUS: Keep focus on window (baby-proofing!)
  useEffect(() => {
    const handleBlur = () => {
      console.log('⚠️ Focus lost - refocusing window...');
      window.focus();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Tab visible again - refocusing...');
        window.focus();
      }
    };
    
    // Try to refocus every 500ms if focus is lost
    const refocusInterval = setInterval(() => {
      if (!document.hasFocus()) {
        console.log('🔄 Auto-refocus attempt...');
        window.focus();
      }
    }, 500);
    
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial focus
    window.focus();
    
    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refocusInterval);
    };
  }, []);

  // DRAWING with spacebar + cursor
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    
    const handleSpaceDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !visualEngineRef.current?.getIsDrawing()) {
        e.preventDefault();
        e.stopPropagation(); // Prevent any bubbling
        
        // Get current mouse position relative to canvas AND scale to internal canvas size
        const rect = canvasEl.getBoundingClientRect();
        const scaleX = canvasEl.width / rect.width;
        const scaleY = canvasEl.height / rect.height;
        const x = (lastMousePos.current.x - rect.left) * scaleX;
        const y = (lastMousePos.current.y - rect.top) * scaleY;
        visualEngineRef.current?.startDrawing(x, y);
      }
    };
    
    const handleSpaceUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation(); // Prevent any bubbling
        visualEngineRef.current?.endDrawing();
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      
      // Scale mouse coordinates to match internal canvas size
      const scaleX = canvasEl.width / rect.width;
      const scaleY = canvasEl.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      
      // Update last position (store screen coords)
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      
      // If drawing, add point (using scaled coords)
      if (visualEngineRef.current?.getIsDrawing()) {
        visualEngineRef.current.continueDrawing(x, y);
      }
    };
    
    // Use normal phase (not capture) so it runs AFTER the main handler returns
    window.addEventListener('keydown', handleSpaceDown);
    window.addEventListener('keyup', handleSpaceUp);
    canvasEl.addEventListener('mousemove', handleMouseMove);
    
    console.log('🖌️ Drawing mode initialized - Spacebar + mouse ready!');
    
    return () => {
      window.removeEventListener('keydown', handleSpaceDown);
      window.removeEventListener('keyup', handleSpaceUp);
      canvasEl.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const lastMousePos = useRef({ x: 0, y: 0 });

  const celebrate = () => {
    audioEngineRef.current?.playChord(['C4', 'E4', 'G4']);
    visualEngineRef.current?.burstParticles(50);
    console.log('🎉 CELEBRATION!');
  };

  const stopJam = () => {
    const session: Session = {
      id: `session_${seedRef.current}_${Date.now()}`,
      timestamp: new Date().toISOString(),
      duration: (Date.now() - sessionStartRef.current) / 1000,
      seed: seedRef.current,
      colorScheme: 'test',
      events: [],
    };

    onStop(session);
  };

  return (
    <div className="jam-session">
      <canvas ref={canvasRef} className="jam-canvas" />
      
      {/* Loop Layer Indicator */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: '#fff',
          fontSize: '14px',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      >
        <div style={{ marginBottom: '6px', opacity: 0.7, fontWeight: 'bold' }}>LOOP LAYER</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map(layer => (
            <div
              key={layer}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: layer === selectedLayer 
                  ? 'linear-gradient(135deg, #ff6b6b, #ffd93d)' 
                  : 'rgba(255, 255, 255, 0.1)',
                border: layer === selectedLayer ? '2px solid #fff' : '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '16px',
                color: layer === selectedLayer ? '#000' : '#fff',
              }}
            >
              {layer}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.5 }}>
          Q:Play | A:Layer | WE:Pitch | SD:Tempo
        </div>
      </div>
      
      {escapeProgress > 0 && (
        <div className="escape-progress">
          <div className="escape-progress-bar" style={{ width: `${escapeProgress}%` }} />
          <div className="escape-progress-text">
            Hold ESCAPE to exit...
          </div>
        </div>
      )}
    </div>
  );
}

export default JamSession;

