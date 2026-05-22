import { describe, it, expect, beforeEach } from 'vitest';
import { Boxer, BoxerState } from '../Boxer';

describe('Boxer', () => {
  let boxer: Boxer;
  const currentTime = 1000;

  beforeEach(() => {
    boxer = new Boxer(100, 100, true);
  });

  it('should initialize with 100 health and stamina', () => {
    expect(boxer.health).toBe(100);
    expect(boxer.stamina).toBe(100);
    expect(boxer.state).toBe(BoxerState.IDLE);
  });

  describe('Jab', () => {
    it('should execute jab when stamina is sufficient', () => {
      const success = boxer.executeJab(currentTime);
      expect(success).toBe(true);
      expect(boxer.state).toBe(BoxerState.JAB);
      expect(boxer.stamina).toBe(85);
    });

    it('should not execute jab when stamina is insufficient', () => {
      boxer.stamina = 10;
      const initialStamina = boxer.stamina;
      const success = boxer.executeJab(currentTime);
      expect(success).toBe(false);
      expect(boxer.state).toBe(BoxerState.IDLE);
      expect(boxer.stamina).toBe(initialStamina);
    });
  });

  describe('Hook', () => {
    it('should execute hook when stamina is sufficient', () => {
      const success = boxer.executeHook(currentTime);
      expect(success).toBe(true);
      expect(boxer.state).toBe(BoxerState.HOOK);
      expect(boxer.stamina).toBe(70);
    });

    it('should not execute hook when stamina is insufficient', () => {
      boxer.stamina = 20;
      const success = boxer.executeHook(currentTime);
      expect(success).toBe(false);
      expect(boxer.state).toBe(BoxerState.IDLE);
    });
  });

  describe('Footwork', () => {
    it('should execute footwork and grant i-frames', () => {
      const beforeTime = Date.now();
      const success = boxer.executeFootwork(beforeTime);
      expect(success).toBe(true);
      expect(boxer.state).toBe(BoxerState.FOOTWORK);
      expect(boxer.stamina).toBe(80);
      expect(boxer.isInvulnerable()).toBe(true);
    });

    it('should lose i-frames after 200ms', async () => {
      const beforeTime = Date.now();
      boxer.executeFootwork(beforeTime);
      expect(boxer.isInvulnerable()).toBe(true);
      
      await new Promise(resolve => setTimeout(resolve, 250));
      expect(boxer.isInvulnerable()).toBe(false);
    });
  });

  describe('Damage', () => {
    it('should take damage when not invulnerable', () => {
      boxer.takeDamage(10);
      expect(boxer.health).toBe(90);
    });

    it('should not take damage during i-frames', () => {
      boxer.executeFootwork(Date.now());
      boxer.takeDamage(10);
      expect(boxer.health).toBe(100);
    });

    it('should transition to knocked out when health reaches 0', () => {
      boxer.health = 5;
      boxer.takeDamage(10);
      expect(boxer.health).toBe(0);
      expect(boxer.state).toBe(BoxerState.KNOCKED_OUT);
    });
  });

  describe('Stamina regeneration', () => {
    it('should regenerate stamina when idle', () => {
      boxer.stamina = 50;
      boxer.update(1000, currentTime); // 1 second
      expect(boxer.stamina).toBe(60);
    });

    it('should not regenerate stamina when not idle', () => {
      boxer.stamina = 50;
      boxer.executeJab(currentTime);
      const staminaAfterJab = boxer.stamina;
      boxer.update(100, currentTime + 100);
      expect(boxer.stamina).toBe(staminaAfterJab);
    });

    it('should not exceed 100 stamina', () => {
      boxer.stamina = 95;
      boxer.update(1000, currentTime);
      expect(boxer.stamina).toBe(100);
    });
  });

  describe('Hitbox', () => {
    it('should return hitbox during jab', () => {
      boxer.executeJab(currentTime);
      const hitbox = boxer.getHitbox();
      expect(hitbox).not.toBeNull();
      expect(hitbox?.width).toBe(40);
    });

    it('should return hitbox during hook', () => {
      boxer.executeHook(currentTime);
      const hitbox = boxer.getHitbox();
      expect(hitbox).not.toBeNull();
      expect(hitbox?.width).toBe(35);
    });

    it('should return null hitbox when idle', () => {
      const hitbox = boxer.getHitbox();
      expect(hitbox).toBeNull();
    });
  });

  describe('State transitions', () => {
    it('should transition from jab to idle after duration', () => {
      boxer.executeJab(currentTime);
      expect(boxer.state).toBe(BoxerState.JAB);
      
      // 20 frames at 60fps = ~333ms
      boxer.update(350, currentTime + 350);
      expect(boxer.state).toBe(BoxerState.IDLE);
    });

    it('should transition from stagger to idle after 1 second', () => {
      boxer.setState(BoxerState.STAGGER, currentTime);
      expect(boxer.state).toBe(BoxerState.STAGGER);
      
      boxer.update(1100, currentTime + 1100);
      expect(boxer.state).toBe(BoxerState.IDLE);
    });
  });
});
