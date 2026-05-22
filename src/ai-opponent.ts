import {
  AIAction,
  AIConfig,
  AIDifficulty,
  Boxer,
  DEFAULT_AI_CONFIG,
} from './types';

/**
 * AI Opponent Controller
 * Implements an autonomous decision tree for selecting boxing actions
 */
export class AIOpponent {
  private config: AIConfig;
  private lastJabTime: number = 0;
  private lastDecisionTime: number = 0;
  private currentAction: AIAction = AIAction.IDLE;

  constructor(difficulty: AIDifficulty = AIDifficulty.MEDIUM) {
    this.config = DEFAULT_AI_CONFIG[difficulty];
  }

  /**
   * Main decision-making function
   * Returns the next action for the AI to take
   */
  public makeDecision(ai: Boxer, player: Boxer, currentTime: number): AIAction {
    // Apply reaction delay based on difficulty
    if (currentTime - this.lastDecisionTime < this.config.reactionDelayMs) {
      return this.currentAction;
    }

    this.lastDecisionTime = currentTime;

    const distance = this.calculateDistance(ai, player);
    
    // Decision tree priority order:
    
    // 1. Emergency responses (highest priority)
    if (player.isWindingUp && ai.cooldowns.dodge === 0 && ai.stamina >= this.config.dodgeStaminaCost) {
      this.currentAction = AIAction.DODGE;
      return this.currentAction;
    }

    if (ai.stamina < this.config.lowStaminaThreshold && distance < 70) {
      this.currentAction = AIAction.MOVE_BACKWARD;
      return this.currentAction;
    }

    // 2. Offensive actions
    if (distance <= this.config.hookRange && 
        ai.cooldowns.hook === 0 && 
        ai.stamina >= this.config.hookStaminaCost &&
        this.shouldUseHook(currentTime)) {
      this.currentAction = AIAction.HOOK;
      return this.currentAction;
    }

    if (distance <= this.config.jabRange && 
        ai.cooldowns.jab === 0 && 
        ai.stamina >= this.config.jabStaminaCost) {
      this.lastJabTime = currentTime;
      this.currentAction = AIAction.JAB;
      return this.currentAction;
    }

    // 3. Positioning
    if (distance > 150) {
      this.currentAction = AIAction.MOVE_FORWARD;
      return this.currentAction;
    }

    if (distance < 30) {
      this.currentAction = AIAction.MOVE_BACKWARD;
      return this.currentAction;
    }

    // In optimal range - circle or maintain
    if (distance >= this.config.optimalRangeMin && distance <= this.config.optimalRangeMax) {
      const random = Math.random();
      if (random < 0.3) {
        this.currentAction = AIAction.CIRCLE_LEFT;
      } else if (random < 0.6) {
        this.currentAction = AIAction.CIRCLE_RIGHT;
      } else {
        this.currentAction = AIAction.IDLE;
      }
      return this.currentAction;
    }

    // 4. Default - maintain position
    this.currentAction = AIAction.IDLE;
    return this.currentAction;
  }

  /**
   * Calculate distance between AI and player
   */
  private calculateDistance(ai: Boxer, player: Boxer): number {
    const dx = ai.x - player.x;
    const dy = ai.y - player.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Determine if AI should use hook attack
   * Adds some randomness to avoid predictability
   */
  private shouldUseHook(currentTime: number): boolean {
    // Don't spam hooks - space them out
    const timeSinceLastJab = currentTime - this.lastJabTime;
    if (timeSinceLastJab < 1000) {
      // More likely to use hook after jab
      return Math.random() < 0.7;
    }
    return Math.random() < 0.3;
  }

  /**
   * Get current AI configuration
   */
  public getConfig(): AIConfig {
    return { ...this.config };
  }

  /**
   * Get current action
   */
  public getCurrentAction(): AIAction {
    return this.currentAction;
  }
}
