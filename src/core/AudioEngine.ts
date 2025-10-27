import * as Tone from 'tone';
import { SeededRandom } from '../utils/random';
import { CONFIG } from '../constants/config';
import { SCALES, ROOT_NOTES } from '../constants/distributions';
import { LoopLayerManager } from './LoopLayerManager';

export type SynthMode = 'bass' | 'melody' | 'percussion' | 'chaos' | 'mixed';

/**
 * AudioEngine - The SOUL of Sound
 * 
 * This creates music from chaos, harmony from keyboard mashing
 * Now with 4-layer loop control!
 */
export class AudioEngine {
  private bassSynth: Tone.AMSynth;
  private melodySynth: Tone.FMSynth;
  private percussionSynth: Tone.NoiseSynth;
  private chaosSynth: Tone.MetalSynth;
  private stringSynth: Tone.PolySynth;
  
  // LOOP LAYER SYSTEM!
  public loopManager: LoopLayerManager;
  
  private activeNotes: Set<string> = new Set();
  private initialized = false;
  private rng: SeededRandom;
  private scaleNotes: string[];

  constructor(seed: number) {
    this.rng = new SeededRandom(seed);
    this.loopManager = new LoopLayerManager(seed);
    
    // Setup synths with PERSONALITY
    this.bassSynth = new Tone.AMSynth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 },
    }).toDestination();
    
    this.melodySynth = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.4 },
    }).toDestination();
    
    this.percussionSynth = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
    }).toDestination();
    
    this.chaosSynth = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.4, release: 0.2 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination();
    
    // String synth for LUSH sounds
    this.stringSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.5, decay: 0.3, sustain: 0.7, release: 1.5 },
    }).toDestination();
    
    // Set volumes
    this.bassSynth.volume.value = -8;
    this.melodySynth.volume.value = -12;
    this.percussionSynth.volume.value = -15;
    this.chaosSynth.volume.value = -20;
    this.stringSynth.volume.value = -18;
    
    // Generate musical scale for harmony
    this.scaleNotes = this.generateScaleNotes();
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    
    await Tone.start();
    await this.loopManager.init();
    this.initialized = true;
    
    console.log('🎵 Audio Engine initialized - Let the music begin!');
  }

  /**
   * Generate scale notes for musical harmony
   */
  private generateScaleNotes(): string[] {
    const root = this.rng.choice(ROOT_NOTES);
    const scale = SCALES.pentatonic; // Pentatonic always sounds good!
    const rootMidi = Tone.Frequency(root).toMidi();
    
    const notes: string[] = [];
    // Generate 2 octaves
    for (let octave = 0; octave < 2; octave++) {
      scale.forEach(interval => {
        const midi = rootMidi + interval + (octave * 12);
        notes.push(Tone.Frequency(midi, 'midi').toNote());
      });
    }
    
    return notes;
  }

  /**
   * Play a note with EXPRESSION and SOUL
   */
  playNote(mode: SynthMode): void {
    if (!this.initialized) return;
    
    // Polyphony limit
    if (this.activeNotes.size >= CONFIG.MAX_POLYPHONY) {
      return;
    }
    
    const synth = this.getSynthForMode(mode);
    if (!synth) return;
    
    // Choose note from our musical scale
    const note = this.rng.choice(this.scaleNotes);
    
    // Duration with variation
    const durations = ['16n', '8n', '4n'];
    const duration = this.rng.choice(durations);
    
    // Velocity with organic variation
    const velocity = 0.6 + this.rng.next() * 0.4;
    
    // Organic detune for LIFE (only for synths that support it)
    const detune = (this.rng.next() - 0.5) * CONFIG.DETUNE_RANGE;
    if ('detune' in synth && synth.detune) {
      synth.detune.value = detune;
    }
    
    // Trigger!
    this.activeNotes.add(note);
    
    if (mode === 'percussion') {
      (synth as Tone.NoiseSynth).triggerAttackRelease(duration);
    } else {
      synth.triggerAttackRelease(note, duration, Tone.now(), velocity);
    }
    
    // Remove from active after duration
    setTimeout(() => {
      this.activeNotes.delete(note);
    }, Tone.Time(duration).toMilliseconds());
  }

  /**
   * Play SOUND EFFECTS - Honks, Beeps, Boops, Animals!
   */
  playSoundEffect(): void {
    if (!this.initialized) return;
    
    const effects = [
      () => this.honk(),
      () => this.beep(),
      () => this.boop(),
      () => this.animalSound(),
      () => this.whoosh(),
      () => this.zap(),
    ];
    
    const effect = this.rng.choice(effects);
    effect();
  }

  private honk(): void {
    // Classic HONK sound (low to high quick)
    const synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();
    
    synth.volume.value = -10;
    synth.triggerAttackRelease('A2', '0.2s');
    setTimeout(() => synth.dispose(), 300);
  }

  private beep(): void {
    // BEEP BEEP (short high pitched)
    const synth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
    }).toDestination();
    
    synth.volume.value = -12;
    synth.triggerAttackRelease('C5', '0.1s');
    setTimeout(() => synth.triggerAttackRelease('C5', '0.1s'), 150);
    setTimeout(() => synth.dispose(), 400);
  }

  private boop(): void {
    // Soft BOOP (like a bubble pop)
    const synth = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
    }).toDestination();
    
    synth.volume.value = -15;
    synth.triggerAttackRelease(this.rng.choice(['C3', 'E3', 'G3', 'C4']), '0.2s');
    setTimeout(() => synth.dispose(), 500);
  }

  private animalSound(): void {
    // Synthesized animal-ish sounds
    const sounds = [
      () => { // Meow-ish
        const synth = new Tone.FMSynth({
          harmonicity: 2,
          modulationIndex: 8,
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 },
        }).toDestination();
        synth.volume.value = -12;
        synth.triggerAttackRelease('E4', '0.3s');
        setTimeout(() => synth.dispose(), 500);
      },
      () => { // Woof-ish
        const synth = new Tone.NoiseSynth({
          noise: { type: 'brown' },
          envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
        }).toDestination();
        synth.volume.value = -10;
        synth.triggerAttackRelease('0.15s');
      },
    ];
    
    this.rng.choice(sounds)();
  }

  private whoosh(): void {
    // WHOOSH sound (noise sweep)
    const synth = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 },
    }).toDestination();
    
    synth.volume.value = -18;
    synth.triggerAttackRelease('0.4s');
  }

  private zap(): void {
    // ZAP sound (laser-ish)
    const synth = new Tone.Synth({
      oscillator: { type: 'square' },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination();
    
    synth.volume.value = -12;
    synth.triggerAttackRelease('E5', '0.2s');
    setTimeout(() => synth.triggerAttackRelease('E4', '0.1s'), 100);
    setTimeout(() => synth.dispose(), 400);
  }

  /**
   * START a beat loop - Adds to random layer, plays indefinitely! 🎵🎶
   */
  startBeatLoop(): void {
    if (!this.initialized) return;
    
    // 🎹 MELODIC PATTERNS (notes + pattern)
    const melodicPatterns = [
      { notes: ['C3', 'G3', 'C3', 'G3'], duration: '4n', synth: 'bass', name: 'Bass Bounce' },
      { notes: ['E4', 'G4', 'B4', 'G4'], duration: '8n', synth: 'melody', name: 'Melody Arp' },
      { notes: ['C3', 'C3', 'G3', 'F3'], duration: '8n', synth: 'bass', name: 'Bass Walk' },
      { notes: ['A4', 'C5', 'E5', 'C5'], duration: '16n', synth: 'melody', name: 'Fast Arp' },
      { notes: ['C4', 'E4', 'G4', 'C5'], duration: '4n', synth: 'string', name: 'String Pad' },
      { notes: ['D3', 'A3', 'F3', 'A3'], duration: '8n', synth: 'bass', name: 'Bass Groove' },
      { notes: ['G4', 'B4', 'D5', 'B4'], duration: '16n', synth: 'melody', name: 'Quick Melody' },
    ];
    
    // Choose random pattern
    const chosen = this.rng.choice(melodicPatterns);
    
    // Get the right synth
    const synth = chosen.synth === 'bass' ? this.bassSynth :
                  chosen.synth === 'string' ? this.stringSynth : this.melodySynth;
    
    // Add to a random layer (loops indefinitely now!)
    const layerNum = this.loopManager.addLoopToRandomLayer(
      synth as any,
      chosen.notes,
      chosen.duration
    );
    
    console.log(`🎹 ${chosen.name} → Layer ${layerNum}`);
  }

  /**
   * Modify active loops (DEPRECATED - Use loopManager controls now)
   */
  modifyLoops(): void {
    // Control loops now via loopManager.adjustPitch(), etc
    return;
    
    const modification = this.rng.choice([
      'tempo-up',
      'tempo-down',
      'tempo-random',
      'volume-boost',
      'volume-duck',
    ]);
    
    switch (modification) {
      case 'tempo-up':
        Tone.Transport.bpm.rampTo(Tone.Transport.bpm.value * 1.1, 0.5);
        console.log('⏩ Tempo UP!');
        break;
        
      case 'tempo-down':
        Tone.Transport.bpm.rampTo(Tone.Transport.bpm.value * 0.9, 0.5);
        console.log('⏪ Tempo DOWN!');
        break;
        
      case 'tempo-random':
        const newBPM = this.rng.range(80, 140);
        Tone.Transport.bpm.rampTo(newBPM, 1);
        console.log(`🎲 Tempo shift to ${newBPM.toFixed(0)} BPM`);
        break;
        
      case 'volume-boost':
        // Boost all synths temporarily
        [this.bassSynth, this.melodySynth, this.stringSynth].forEach(s => {
          const current = s.volume.value;
          s.volume.rampTo(current + 3, 0.1);
          setTimeout(() => s.volume.rampTo(current, 0.5), 2000);
        });
        console.log('📢 Volume BOOST!');
        break;
        
      case 'volume-duck':
        // Duck all synths temporarily
        [this.bassSynth, this.melodySynth, this.stringSynth].forEach(s => {
          const current = s.volume.value;
          s.volume.rampTo(current - 6, 0.1);
          setTimeout(() => s.volume.rampTo(current, 0.5), 1000);
        });
        console.log('🔇 Volume DIP!');
        break;
    }
  }

  /**
   * Play a chord for CELEBRATION
   */
  playChord(notes: string[]): void {
    if (!this.initialized) return;
    
    notes.forEach((note, i) => {
      const delay = i * 0.05; // Slight arpeggio
      this.melodySynth.triggerAttackRelease(note, '2n', Tone.now() + delay, 0.6);
    });
  }

  /**
   * Play surprise chord - PURE JOY
   */
  playSurpriseChord(): void {
    const root = this.rng.choice(ROOT_NOTES);
    const rootMidi = Tone.Frequency(root).toMidi();
    
    // Major chord
    const chord = [
      Tone.Frequency(rootMidi, 'midi').toNote(),
      Tone.Frequency(rootMidi + 4, 'midi').toNote(),
      Tone.Frequency(rootMidi + 7, 'midi').toNote(),
    ];
    
    this.playChord(chord);
  }

  private getSynthForMode(mode: SynthMode): Tone.AMSynth | Tone.FMSynth | Tone.NoiseSynth | Tone.MetalSynth | null {
    switch (mode) {
      case 'bass':
        return this.bassSynth;
      case 'melody':
        return this.melodySynth;
      case 'percussion':
        return this.percussionSynth;
      case 'chaos':
        return this.chaosSynth;
      case 'mixed':
        return this.rng.choice([
          this.bassSynth,
          this.melodySynth,
          this.chaosSynth,
        ]);
      default:
        return null;
    }
  }

  /**
   * Cleanup - IMPORTANT for memory!
   */
  dispose(): void {
    this.bassSynth.dispose();
    this.melodySynth.dispose();
    this.percussionSynth.dispose();
    this.chaosSynth.dispose();
    this.stringSynth.dispose();
    
    // Dispose loop layer manager
    this.loopManager.dispose();
    
    this.activeNotes.clear();
    Tone.Transport.stop();
    
    console.log('🎵 Audio Engine disposed - Silence falls');
  }

  stopAll(): void {
    // Tone.js doesn't have a direct "stop all" but we can fade out
    this.activeNotes.clear();
  }
}

