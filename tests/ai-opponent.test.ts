import { describe, it, expect, beforeEach } from 'vitest';
import { AIOpponent } from '../src/ai-opponent';
import { AIAction, AIDifficulty, Boxer } from '../src/types';

describe('AI Opponent Decision Making', () => {
  let ai: AIOpponent;
  let aiBoxer: Boxer;
  let playerBoxer: Boxer;

  beforeEach(() => {
    ai = new AIOpponent(AIDifficulty.MEDIUM);
    
    // Default AI boxer state
    aiBoxer = {
      x: 100,
      y: 100,
      health: 100,
      stamina: 100,
      isWindingUp: false,
      cooldowns: {
        jab: 0,
        hook: 0,
        dodge: 0,
      },
    };

    // Default player boxer state
    playerBoxer = {
      x: 150,
      y: 100,
      health: 100,
      stamina: 100,
      isWindingUp: false,
      cooldowns: {
        jab: 0,
        hook: 0,
        dodge: 0,
      },
    };
  });

  describe('Scenario: AI jabs when player is at close range and AI has stamina', () => {
    it('should execute a jab', () => {
      // Given the player is at distance 50 pixels
      playerBoxer.x = 150;
      aiBoxer.x = 100;
      
      // And the AI has stamina greater than 20
      aiBoxer.stamina = 80;
      
      // And the jab cooldown is 0
      aiBoxer.cooldowns.jab = 0;

      // When the AI makes a decision
      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);

      // Then the AI should execute a jab
      expect(action).toBe(AIAction.JAB);
    });
  });

  describe('Scenario: AI hooks when player is at close range and hook is off cooldown', () => {
    it('should execute a hook', () => {
      // Given the player is at distance 40 pixels
      playerBoxer.x = 140;
      aiBoxer.x = 100;
      
      // And the AI has stamina greater than 30
      aiBoxer.stamina = 80;
      
      // And the hook cooldown is 0
      aiBoxer.cooldowns.hook = 0;

      // And the jab was used recently (to trigger hook preference)
      // When the AI makes a decision
      let action = ai.makeDecision(aiBoxer, playerBoxer, 0);
      
      // Multiple attempts since hook has randomness
      let hookUsed = false;
      for (let i = 0; i < 20; i++) {
        action = ai.makeDecision(aiBoxer, playerBoxer, 1000 + i * 200);
        if (action === AIAction.HOOK) {
          hookUsed = true;
          break;
        }
      }

      // Then the AI should be capable of executing a hook
      expect(hookUsed).toBe(true);
    });
  });

  describe('Scenario: AI moves forward when player is at far range', () => {
    it('should move forward', () => {
      // Given the player is at distance 200 pixels
      playerBoxer.x = 300;
      aiBoxer.x = 100;

      // When the AI makes a decision
      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);

      // Then the AI should move forward
      expect(action).toBe(AIAction.MOVE_FORWARD);
    });
  });

  describe('Scenario: AI dodges when player is winding up an attack', () => {
    it('should execute a dodge', () => {
      // Given the player is winding up an attack
      playerBoxer.isWindingUp = true;
      
      // And the AI has stamina greater than 15
      aiBoxer.stamina = 80;
      
      // And the dodge cooldown is 0
      aiBoxer.cooldowns.dodge = 0;

      // When the AI makes a decision
      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);

      // Then the AI should execute a dodge
      expect(action).toBe(AIAction.DODGE);
    });
  });

  describe('Scenario: AI backs away when stamina is low', () => {
    it('should move backward', () => {
      // Given the AI has stamina less than 25
      aiBoxer.stamina = 20;
      
      // And the player is at distance 60 pixels
      playerBoxer.x = 160;
      aiBoxer.x = 100;

      // When the AI makes a decision
      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);

      // Then the AI should move backward
      expect(action).toBe(AIAction.MOVE_BACKWARD);
    });
  });

  describe('Scenario: AI does not attack when on cooldown', () => {
    it('should move forward or backward instead of attacking', () => {
      // Given the player is at distance 50 pixels
      playerBoxer.x = 150;
      aiBoxer.x = 100;
      
      // And the jab cooldown is 500 milliseconds
      aiBoxer.cooldowns.jab = 500;
      
      // And the hook cooldown is 1000 milliseconds
      aiBoxer.cooldowns.hook = 1000;

      // When the AI makes a decision
      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);

      // Then the AI should not attack
      expect(action).not.toBe(AIAction.JAB);
      expect(action).not.toBe(AIAction.HOOK);
      
      // Should choose positioning action instead
      expect([
        AIAction.MOVE_FORWARD,
        AIAction.MOVE_BACKWARD,
        AIAction.CIRCLE_LEFT,
        AIAction.CIRCLE_RIGHT,
        AIAction.IDLE,
      ]).toContain(action);
    });
  });

  describe('Scenario: AI maintains optimal fighting distance', () => {
    it('should maintain position or circle', () => {
      // Given the player is at distance 80 pixels (optimal range)
      playerBoxer.x = 180;
      aiBoxer.x = 100;
      
      // And the AI has stamina greater than 50
      aiBoxer.stamina = 80;

      // When the AI makes a decision
      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);

      // Then the AI should maintain position or circle
      expect([
        AIAction.CIRCLE_LEFT,
        AIAction.CIRCLE_RIGHT,
        AIAction.IDLE,
        AIAction.JAB, // Can also attack from this range
      ]).toContain(action);
    });
  });

  describe('AI respects reaction delay based on difficulty', () => {
    it('should delay decisions on Easy difficulty', () => {
      const easyAI = new AIOpponent(AIDifficulty.EASY);
      playerBoxer.x = 150;
      
      const action1 = easyAI.makeDecision(aiBoxer, playerBoxer, 0);
      const action2 = easyAI.makeDecision(aiBoxer, playerBoxer, 100); // Too soon
      
      // Should return same action when within delay window
      expect(action1).toBe(action2);
    });

    it('should make new decisions after delay period', () => {
      const hardAI = new AIOpponent(AIDifficulty.HARD);
      playerBoxer.x = 150;
      
      hardAI.makeDecision(aiBoxer, playerBoxer, 0);
      
      // After 50ms delay (hard difficulty), should make new decision
      const action = hardAI.makeDecision(aiBoxer, playerBoxer, 100);
      expect(action).toBeDefined();
    });
  });

  describe('AI positioning logic', () => {
    it('should move backward when too close', () => {
      // Distance < 30 pixels
      playerBoxer.x = 120;
      aiBoxer.x = 100;

      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);
      expect(action).toBe(AIAction.MOVE_BACKWARD);
    });

    it('should move forward when too far', () => {
      // Distance > 150 pixels
      playerBoxer.x = 300;
      aiBoxer.x = 100;

      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);
      expect(action).toBe(AIAction.MOVE_FORWARD);
    });
  });

  describe('Priority system', () => {
    it('should prioritize dodge over attacks when player is winding up', () => {
      // Setup: in attack range but player is winding up
      playerBoxer.x = 150;
      playerBoxer.isWindingUp = true;
      aiBoxer.cooldowns.jab = 0;
      aiBoxer.cooldowns.dodge = 0;
      aiBoxer.stamina = 100;

      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);
      expect(action).toBe(AIAction.DODGE);
    });

    it('should prioritize retreat over attacks when stamina is low', () => {
      // Setup: in attack range but low stamina
      playerBoxer.x = 150;
      aiBoxer.stamina = 20; // Below threshold
      aiBoxer.cooldowns.jab = 0;

      const action = ai.makeDecision(aiBoxer, playerBoxer, 1000);
      expect(action).toBe(AIAction.MOVE_BACKWARD);
    });
  });
});
