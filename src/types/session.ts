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
  | 'math-flash'
  | 'animation-bounce'
  | 'animation-move'
  | 'animation-explode'
  | 'background-color'
  | 'background-effect'
  | 'shader-glitch';

