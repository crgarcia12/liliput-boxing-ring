import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResourceManager } from './ResourceManager';

describe('ResourceManager - Stamina', () => {
  let resources: ResourceManager;

  beforeEach(() => {
    resources = new ResourceManager();
  });

  it('should initialize with full stamina', () => {
    expect(resources.getStamina()).toBe(100);
    expect(resources.getMaxStamina()).toBe(100);
  });

  it('should consume stamina when performing actions', () => {
    resources.consumeStamina(20);
    expect(resources.getStamina()).toBe(80);
  });

  it('should not allow stamina to go below zero', () => {
    resources.consumeStamina(120);
    expect(resources.getStamina()).toBe(0);
  });

  it('should regenerate stamina over time', () => {
    resources.consumeStamina(50);
    expect(resources.getStamina()).toBe(50);
    
    resources.update(1.0); // 1 second passed
    expect(resources.getStamina()).toBeGreaterThan(50);
  });

  it('should not regenerate stamina above max', () => {
    resources.update(10.0); // 10 seconds
    expect(resources.getStamina()).toBe(100);
  });

  it('should block actions when stamina is insufficient', () => {
    const jabCost = 15;
    resources.consumeStamina(90); // 10 stamina left
    
    expect(resources.hasEnoughStamina(jabCost)).toBe(false);
    expect(resources.hasEnoughStamina(5)).toBe(true);
  });
});

describe('ResourceManager - Health', () => {
  let resources: ResourceManager;

  beforeEach(() => {
    resources = new ResourceManager();
  });

  it('should initialize with full health', () => {
    expect(resources.getHealth()).toBe(100);
    expect(resources.getMaxHealth()).toBe(100);
  });

  it('should reduce health when taking damage', () => {
    resources.takeDamage(25);
    expect(resources.getHealth()).toBe(75);
  });

  it('should not allow health to go below zero', () => {
    resources.takeDamage(150);
    expect(resources.getHealth()).toBe(0);
  });

  it('should not regenerate health automatically', () => {
    resources.takeDamage(30);
    resources.update(5.0);
    expect(resources.getHealth()).toBe(70);
  });
});

describe('ResourceManager - Win/Lose Conditions', () => {
  let resources: ResourceManager;

  beforeEach(() => {
    resources = new ResourceManager();
  });

  it('should detect when fighter is knocked out (health = 0)', () => {
    expect(resources.isKnockedOut()).toBe(false);
    
    resources.takeDamage(100);
    expect(resources.isKnockedOut()).toBe(true);
  });

  it('should detect when fighter is still alive', () => {
    resources.takeDamage(99);
    expect(resources.isAlive()).toBe(true);
    
    resources.takeDamage(1);
    expect(resources.isAlive()).toBe(false);
  });
});

describe('ResourceManager - Action Gating', () => {
  let resources: ResourceManager;

  beforeEach(() => {
    resources = new ResourceManager();
  });

  it('should allow action when stamina is sufficient', () => {
    const result = resources.tryConsumeStamina(30);
    expect(result).toBe(true);
    expect(resources.getStamina()).toBe(70);
  });

  it('should block action when stamina is insufficient', () => {
    resources.consumeStamina(95);
    const result = resources.tryConsumeStamina(30);
    expect(result).toBe(false);
    expect(resources.getStamina()).toBe(5); // No change
  });

  it('should support different stamina costs for different actions', () => {
    const JAB_COST = 10;
    const HOOK_COST = 25;
    const DODGE_COST = 20;

    expect(resources.hasEnoughStamina(JAB_COST)).toBe(true);
    expect(resources.hasEnoughStamina(HOOK_COST)).toBe(true);
    expect(resources.hasEnoughStamina(DODGE_COST)).toBe(true);

    resources.consumeStamina(80);
    expect(resources.hasEnoughStamina(JAB_COST)).toBe(true);
    expect(resources.hasEnoughStamina(HOOK_COST)).toBe(false);
    expect(resources.hasEnoughStamina(DODGE_COST)).toBe(false);
  });
});

describe('ResourceManager - Integration', () => {
  it('should handle a complete combat scenario', () => {
    const player = new ResourceManager();
    
    // Player throws jab (10 stamina)
    expect(player.tryConsumeStamina(10)).toBe(true);
    expect(player.getStamina()).toBe(90);
    
    // Player takes damage from counter
    player.takeDamage(15);
    expect(player.getHealth()).toBe(85);
    expect(player.isAlive()).toBe(true);
    
    // Time passes, stamina regenerates
    player.update(0.5);
    expect(player.getStamina()).toBeGreaterThan(90);
    
    // Player throws hook (25 stamina)
    expect(player.tryConsumeStamina(25)).toBe(true);
    
    // More combat...
    player.takeDamage(85); // Total 100 damage
    expect(player.isKnockedOut()).toBe(true);
    expect(player.isAlive()).toBe(false);
  });
});
