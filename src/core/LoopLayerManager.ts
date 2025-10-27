import * as Tone from 'tone';
import { SeededRandom } from '../utils/random';

/**
 * LoopLayerManager - 4-Layer Loop Control System
 * 
 * Manages 4 independent loop layers with playback controls
 * Hidden controls: QWEASD
 */

export interface LoopLayer {
  id: number;
  loop: Tone.Loop | null;
  sequence: any; // Tone.Sequence
  playing: boolean;
  pitch: number; // Semitone offset (-12 to +12)
  tempo: number; // Tempo multiplier (0.5x to 2x)
  pattern: string[]; // The note pattern
}

export class LoopLayerManager {
  private layers: Map<number, LoopLayer> = new Map();
  private selectedLayer: number = 1;
  private rng: SeededRandom;
  private initialized = false;

  constructor(seed: number) {
    this.rng = new SeededRandom(seed);
    
    // Initialize 4 empty layers
    for (let i = 1; i <= 4; i++) {
      this.layers.set(i, {
        id: i,
        loop: null,
        sequence: null,
        playing: false,
        pitch: 0,
        tempo: 1.0,
        pattern: [],
      });
    }
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    console.log('🎚️ Loop Layer Manager initialized - 4 layers ready');
  }

  /**
   * Get current selected layer
   */
  getSelectedLayer(): number {
    return this.selectedLayer;
  }

  /**
   * Cycle to next layer (1→2→3→4→1)
   */
  cycleLayer(): void {
    this.selectedLayer = (this.selectedLayer % 4) + 1;
    console.log(`🎚️ Selected layer: ${this.selectedLayer}`);
  }

  /**
   * Add or replace a loop on a random layer
   */
  addLoopToRandomLayer(
    synth: Tone.Synth | Tone.PolySynth | Tone.FMSynth | Tone.AMSynth,
    notes: string[],
    duration: string = '8n'
  ): number {
    // Random layer assignment
    const layerNum = this.rng.int(1, 4);
    const layer = this.layers.get(layerNum)!;

    // Stop existing loop if any
    if (layer.loop) {
      layer.loop.stop();
      layer.loop.dispose();
    }
    if (layer.sequence) {
      layer.sequence.stop();
      layer.sequence.dispose();
    }

    // Create new looping sequence
    const sequence = new Tone.Sequence(
      (time, note) => {
        if (note && layer.playing) {
          // Apply pitch shift
          const freq = Tone.Frequency(note).transpose(layer.pitch).toNote();
          synth.triggerAttackRelease(freq, duration, time, 0.7);
        }
      },
      notes,
      duration
    );

    // Apply tempo
    sequence.playbackRate = layer.tempo;
    
    // Start immediately
    sequence.start(0);
    Tone.Transport.start();

    layer.sequence = sequence;
    layer.pattern = notes;
    layer.playing = true;

    console.log(`🔁 Loop added to layer ${layerNum}`);
    return layerNum;
  }

  /**
   * Toggle play/pause on selected layer
   */
  togglePlayPause(): void {
    const layer = this.layers.get(this.selectedLayer)!;
    
    if (!layer.sequence) {
      console.log(`⚠️ No loop on layer ${this.selectedLayer}`);
      return;
    }

    layer.playing = !layer.playing;
    
    if (layer.playing) {
      layer.sequence.start();
      console.log(`▶️  Layer ${this.selectedLayer} playing`);
    } else {
      layer.sequence.stop();
      console.log(`⏸️  Layer ${this.selectedLayer} paused`);
    }
  }

  /**
   * Adjust pitch of selected layer
   */
  adjustPitch(semitones: number): void {
    const layer = this.layers.get(this.selectedLayer)!;
    
    if (!layer.sequence) {
      console.log(`⚠️ No loop on layer ${this.selectedLayer}`);
      return;
    }

    layer.pitch = Math.max(-12, Math.min(12, layer.pitch + semitones));
    console.log(`🎵 Layer ${this.selectedLayer} pitch: ${layer.pitch > 0 ? '+' : ''}${layer.pitch}`);
  }

  /**
   * Adjust tempo of selected layer
   */
  adjustTempo(multiplier: number): void {
    const layer = this.layers.get(this.selectedLayer)!;
    
    if (!layer.sequence) {
      console.log(`⚠️ No loop on layer ${this.selectedLayer}`);
      return;
    }

    layer.tempo = Math.max(0.25, Math.min(4.0, layer.tempo * multiplier));
    layer.sequence.playbackRate = layer.tempo;
    
    console.log(`⏱️  Layer ${this.selectedLayer} tempo: ${layer.tempo.toFixed(2)}x`);
  }

  /**
   * Get layer info for UI display
   */
  getLayerInfo(): { layer: number; layers: LoopLayer[] } {
    return {
      layer: this.selectedLayer,
      layers: Array.from(this.layers.values()),
    };
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.layers.forEach(layer => {
      if (layer.loop) {
        layer.loop.stop();
        layer.loop.dispose();
      }
      if (layer.sequence) {
        layer.sequence.stop();
        layer.sequence.dispose();
      }
    });
    
    Tone.Transport.stop();
    console.log('🔇 Loop Layer Manager disposed');
  }
}

