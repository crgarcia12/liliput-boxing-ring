import { describe, it, expect, beforeEach } from 'vitest';
import { CombatSystem } from '../src/combat/CombatSystem';
import { Fighter } from '../src/entities/Fighter';
import { AttackType } from '../src/types/Combat';

describe('CombatSystem', () => {
  let combatSystem: CombatSystem;
  let player: Fighter;
  let opponent: Fighter;

  beforeEach(() => {
    combatSystem = new CombatSystem();
    player = new Fighter('player', 100, 100, 50, 50);
    opponent = new Fighter('opponent', 100, 100, 50, 50);
  });

  describe('Attack Types', () => {
    it('should handle jab attack (fast, low damage)', () => {
      const damage = combatSystem.calculateDamage(AttackType.JAB);
      expect(damage).toBeGreaterThan(0);
      expect(damage).toBeLessThanOrEqual(15);
    });

    it('should handle hook attack (slow, high damage, can stagger)', () => {
      const damage = combatSystem.calculateDamage(AttackType.HOOK);
      expect(damage).toBeGreaterThan(15);
      expect(damage).toBeLessThanOrEqual(30);
    });

    it('should handle footwork (lateral movement with dodge i-frames)', () => {
      player.performFootwork();
      expect(player.isInvulnerable()).toBe(true);
    });
  });

  describe('Collision Detection', () => {
    it('should detect hitbox collision when fighter attacks', () => {
      player.position.x = 50;
      opponent.position.x = 80;
      
      const attack = player.attack(AttackType.JAB);
      const collision = combatSystem.checkCollision(attack.hitbox, opponent.hurtbox);
      
      expect(collision).toBe(true);
    });

    it('should not detect collision when fighters are too far apart', () => {
      player.position.x = 50;
      opponent.position.x = 200;
      
      const attack = player.attack(AttackType.JAB);
      const collision = combatSystem.checkCollision(attack.hitbox, opponent.hurtbox);
      
      expect(collision).toBe(false);
    });

    it('should not apply damage when fighter has i-frames active', () => {
      opponent.performFootwork();
      const initialHealth = opponent.health;
      
      const attack = player.attack(AttackType.JAB);
      combatSystem.applyDamage(opponent, attack, combatSystem.checkCollision(attack.hitbox, opponent.hurtbox));
      
      expect(opponent.health).toBe(initialHealth);
    });
  });

  describe('Damage Application', () => {
    it('should reduce health when attack hits', () => {
      const initialHealth = opponent.health;
      const attack = player.attack(AttackType.JAB);
      
      combatSystem.applyDamage(opponent, attack, true);
      
      expect(opponent.health).toBeLessThan(initialHealth);
    });

    it('should apply stagger effect on hook hit', () => {
      const attack = player.attack(AttackType.HOOK);
      combatSystem.applyDamage(opponent, attack, true);
      
      expect(opponent.isStaggered()).toBe(true);
    });

    it('should consume stamina when attacking', () => {
      const initialStamina = player.stamina;
      player.attack(AttackType.HOOK);
      
      expect(player.stamina).toBeLessThan(initialStamina);
    });
  });

  describe('Animation State Machine', () => {
    it('should transition from idle to attacking', () => {
      expect(player.getAnimationState()).toBe('idle');
      
      player.attack(AttackType.JAB);
      
      expect(player.getAnimationState()).toBe('attacking');
    });

    it('should transition to staggered when hit by hook', () => {
      const attack = player.attack(AttackType.HOOK);
      combatSystem.applyDamage(opponent, attack, true);
      
      expect(opponent.getAnimationState()).toBe('staggered');
    });

    it('should return to idle after attack completes', () => {
      player.attack(AttackType.JAB);
      player.update(500);
      
      expect(player.getAnimationState()).toBe('idle');
    });

    it('should transition to footwork animation', () => {
      player.performFootwork();
      
      expect(player.getAnimationState()).toBe('footwork');
    });
  });
});
