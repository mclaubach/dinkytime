/**
 * Configuration Constants
 * 
 * These numbers define the behavior of BabyTime
 */

export const CONFIG = {
  // Session
  SESSION_DURATION: 180, // 3 minutes in seconds
  
  // Performance
  MAX_ANIMATED_ELEMENTS: 20,
  MAX_POLYPHONY: 8,
  KEYPRESS_THROTTLE: 10, // ms
  TARGET_FPS: 60,
  
  // UI
  ESCAPE_HOLD_DURATION: 5000, // ms
  ESCAPE_PROGRESS_START: 2000, // ms - when to show progress
  
  // Canvas
  CANVAS_WIDTH: 2000,
  CANVAS_HEIGHT: 2000,
  
  // Artistic
  HEARTBEAT_INTERVAL: 3, // seconds
  BREATH_MIN_SCALE: 0.95,
  BREATH_MAX_SCALE: 1.05,
  GHOST_TRAIL_LENGTH: 8,
  CELEBRATION_THRESHOLD: 20, // first celebration at 20 keypresses
  CELEBRATION_MILESTONE: 50, // then every 50
  ECHO_CHANCE: 0.05, // 5%
  SURPRISE_CELEBRATION_CHANCE: 0.05, // 5%
  
  // Audio
  DETUNE_RANGE: 15, // ± cents
  ATTACK_VARIATION: 0.05, // ± seconds
};

