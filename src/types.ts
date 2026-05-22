/**
 * Represents a boxer in the game
 */
export interface Boxer {
  x: number;
  y: number;
  health: number;
  stamina: number;
  isWindingUp: boolean;
  cooldowns: {
    jab: number;
    hook: number;
    dodge: number;
  };
}

/**
 * AI action types
 */
export enum AIAction {
  JAB = 'jab',
  HOOK = 'hook',
  DODGE = 'dodge',
  MOVE_FORWARD = 'move_forward',
  MOVE_BACKWARD = 'move_backward',
  CIRCLE_LEFT = 'circle_left',
  CIRCLE_RIGHT = 'circle_right',
  IDLE = 'idle',
}

/**
 * AI difficulty levels
 */
export enum AIDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

/**
 * Configuration for AI decision making
 */
export interface AIConfig {
  difficulty: AIDifficulty;
  jabRange: number;
  hookRange: number;
  optimalRangeMin: number;
  optimalRangeMax: number;
  jabStaminaCost: number;
  hookStaminaCost: number;
  dodgeStaminaCost: number;
  lowStaminaThreshold: number;
  reactionDelayMs: number;
}

/**
 * Default AI configuration by difficulty
 */
export const DEFAULT_AI_CONFIG: Record<AIDifficulty, AIConfig> = {
  [AIDifficulty.EASY]: {
    difficulty: AIDifficulty.EASY,
    jabRange: 70,
    hookRange: 50,
    optimalRangeMin: 50,
    optimalRangeMax: 100,
    jabStaminaCost: 20,
    hookStaminaCost: 30,
    dodgeStaminaCost: 15,
    lowStaminaThreshold: 25,
    reactionDelayMs: 300,
  },
  [AIDifficulty.MEDIUM]: {
    difficulty: AIDifficulty.MEDIUM,
    jabRange: 70,
    hookRange: 50,
    optimalRangeMin: 50,
    optimalRangeMax: 100,
    jabStaminaCost: 20,
    hookStaminaCost: 30,
    dodgeStaminaCost: 15,
    lowStaminaThreshold: 25,
    reactionDelayMs: 150,
  },
  [AIDifficulty.HARD]: {
    difficulty: AIDifficulty.HARD,
    jabRange: 70,
    hookRange: 50,
    optimalRangeMin: 50,
    optimalRangeMax: 100,
    jabStaminaCost: 20,
    hookStaminaCost: 30,
    dodgeStaminaCost: 15,
    lowStaminaThreshold: 25,
    reactionDelayMs: 50,
  },
};
