import { describe, it, expect } from 'vitest';
import { CollisionDetector } from '../CollisionDetector';
import { Boxer } from '../Boxer';

describe('CollisionDetector', () => {
  it('should detect collision when hitboxes overlap', () => {
    const hitbox = { x: 10, y: 10, width: 20, height: 20 };
    const hurtbox = { x: 15, y: 15, width: 20, height: 20 };
    
    expect(CollisionDetector.checkCollision(hitbox, hurtbox)).toBe(true);
  });

  it('should not detect collision when hitboxes do not overlap', () => {
    const hitbox = { x: 10, y: 10, width: 20, height: 20 };
    const hurtbox = { x: 50, y: 50, width: 20, height: 20 };
    
    expect(CollisionDetector.checkCollision(hitbox, hurtbox)).toBe(false);
  });

  it('should detect hit between attacking and defending boxer', () => {
    // Player at x=100, facing right. Body is 50px wide (100-150).
    // Jab hitbox starts at x=150 (100+50), extends 40px to x=190
    // Defender hurtbox at x=155, width 50, so x=155-205
    // They should overlap
    const attacker = new Boxer(100, 100, true);
    const defender = new Boxer(155, 100, false);
    
    attacker.executeJab(Date.now());
    
    expect(CollisionDetector.checkHit(attacker, defender)).toBe(true);
  });

  it('should not detect hit when attacker is not attacking', () => {
    const attacker = new Boxer(100, 100, true);
    const defender = new Boxer(140, 100, false);
    
    expect(CollisionDetector.checkHit(attacker, defender)).toBe(false);
  });

  it('should not detect hit when boxers are too far apart', () => {
    const attacker = new Boxer(100, 100, true);
    const defender = new Boxer(300, 100, false);
    
    attacker.executeJab(Date.now());
    
    expect(CollisionDetector.checkHit(attacker, defender)).toBe(false);
  });
});
