import { SeededRandom } from '../utils/random';
import type { KeyMapping } from '../types/keyboard';
import type { FunctionType } from '../types/session';
import { FUNCTION_DISTRIBUTION } from '../constants/distributions';

/**
 * KeyboardMapper - The RANDOMIZER
 * 
 * Every session, keys are randomly assigned functions.
 * Same seed = same assignments = REPRODUCIBILITY
 */
export class KeyboardMapper {
  private mappings: Map<string, KeyMapping> = new Map();
  private rng: SeededRandom;
  private surpriseKey: string | null = null;

  constructor(seed: number) {
    this.rng = new SeededRandom(seed);
    this.generateMappings();
  }

  /**
   * Generate random mappings for all keyboard keys
   */
  private generateMappings(): void {
    // All the keys on a keyboard (letters, numbers, symbols)
    const allKeys = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
    
    // RESERVE QWEASD for loop controls (but still give them random visuals!)
    const controlKeys = ['q', 'w', 'e', 'a', 's', 'd'];
    const randomKeys = allKeys.filter(k => !controlKeys.includes(k));
    
    // Pick ONE surprise key (not a control key)
    this.surpriseKey = this.rng.choice(randomKeys);
    
    // Create weighted array for distribution
    const functionTypes: FunctionType[] = [];
    const weights: number[] = [];
    
    Object.entries(FUNCTION_DISTRIBUTION).forEach(([func, weight]) => {
      functionTypes.push(func as FunctionType);
      weights.push(weight);
    });
    
    // Assign functions to RANDOM keys (not control keys)
    randomKeys.forEach(key => {
      const numFunctions = this.rng.int(1, 2); // 1-2 functions per key
      const functions: FunctionType[] = [];
      
      for (let i = 0; i < numFunctions; i++) {
        const func = this.rng.weightedChoice(functionTypes, weights);
        if (!functions.includes(func)) {
          functions.push(func);
        }
      }
      
      this.mappings.set(key, {
        key,
        functions,
        params: this.generateParams(functions),
      });
    });
    
    // CONTROL KEYS get random VISUALS only (audio is handled specially)
    controlKeys.forEach(key => {
      // Pick visual-only functions (animations, shapes, etc)
      const visualOptions: FunctionType[] = [
        'animation-bounce',
        'animation-move',
        'animation-explode',
        'shape-permanent',
        'symbol-spawn',
        'animal-spawn',
      ];
      const visualFunctions: FunctionType[] = [this.rng.choice(visualOptions)];
      
      this.mappings.set(key, {
        key,
        functions: visualFunctions,
        params: this.generateParams(visualFunctions),
      });
    });
    
    console.log(`🎹 Keyboard Mapper initialized - QWEASD=controls, Surprise: ${this.surpriseKey}`);
  }

  /**
   * Generate parameters for functions
   */
  private generateParams(functions: FunctionType[]): Record<string, any> {
    const params: Record<string, any> = {};
    
    functions.forEach(func => {
      if (func.includes('synth') || func.includes('percussion')) {
        params.synthMode = this.rng.choice(['bass', 'melody', 'percussion', 'chaos', 'mixed']);
      }
      
      if (func.includes('shape') || func.includes('animation')) {
        params.shapeType = 'shape';
      }
      
      if (func.includes('symbol')) {
        params.elementType = 'symbol';
      }
      
      if (func.includes('word')) {
        params.elementType = 'word';
      }
      
      if (func.includes('animal')) {
        params.elementType = 'animal';
      }
      
      if (func.includes('number')) {
        params.elementType = 'number';
      }
    });
    
    return params;
  }

  /**
   * Get mapping for a key
   */
  getMapping(key: string): KeyMapping | null {
    return this.mappings.get(key.toLowerCase()) || null;
  }

  /**
   * Is this the surprise key?
   */
  isSurpriseKey(key: string): boolean {
    return key.toLowerCase() === this.surpriseKey;
  }

  /**
   * Get all mappings (for debugging)
   */
  getAllMappings(): Map<string, KeyMapping> {
    return this.mappings;
  }
}

