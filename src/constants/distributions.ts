/**
 * Function Distribution
 * 
 * Defines the probability of each function type being assigned to keys
 */

// 80% temporary/animated, 20% permanent - EXPLOSIONS & MAMA!
export const FUNCTION_DISTRIBUTION = {
  'synth-note': 0.10,
  'percussion': 0.06,
  'sound-effect': 0.12,  // MORE sound effects!
  'beat-pattern': 0.06,   // MORE loops!
  'shape-permanent': 0.03, // LESS permanent (20% total)
  'symbol-spawn': 0.04,
  'word-spawn': 0.05,    // MORE words! (especially MAMA)
  'animal-spawn': 0.10,  // MORE emojis!
  'number-spawn': 0.02,
  'math-flash': 0.06,    // Educational math!
  'animation-bounce': 0.10, // WAY MORE animations (80% total)
  'animation-move': 0.10,
  'animation-explode': 0.13, // WAY MORE EXPLOSIONS!
  'background-color': 0.01,
  'background-effect': 0.01,
  'shader-glitch': 0.01,
};

export const ANIMALS = [
  '🐱', '🐶', '🐦', '🐠', '🐰', '🐻', 
  '🐼', '🐨', '🐸', '🐷', '🐮', '🐵',
  '🦁', '🐯', '🦊', '🐔', '🦆', '🐝',
  '🦋', '🐛', '🐙', '🦀', '🐢', '🐘',
  '🌈', '⭐', '🌟', '💫', '✨', '🎈',
  '🎉', '🎊', '🎁', '🍎', '🍌', '🍓',
  '🌸', '🌺', '🌻', '🌼', '☀️', '🌙',
  '⚽', '🏀', '🎨', '🎭', '🎪', '🎡',
];
export const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart'];
export const SYMBOLS = ['★', '♥', '●', '■', '▲', '✿', '☀', '☾'];
export const BABY_WORDS = [
  'MAMA', 'MAMA', 'MAMA', // More MAMA!
  'BABA', 'BABA', 'DADA', 'DADA', // More family words
  'MUM', 'MUM', // NEW!
  'WOW', 'YAY', 'BOO', 
  'HI', 'BYE', 'UP', 'YES', 'FUN', 'HAPPY',
  'LOLA', 'DOODLE',
];
export const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

/**
 * Musical scales for harmony
 */
export const SCALES = {
  pentatonic: [0, 2, 4, 7, 9], // Always sounds good!
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
};

/**
 * Base notes to build scales from
 */
export const ROOT_NOTES = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3'];

