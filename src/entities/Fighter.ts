import { AttackType, Attack, Box, AnimationState } from '../types/Combat';

export class Fighter {
  id: string;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  position: { x: number; y: number };
  hurtbox: Box;
  private invulnerable: boolean = false;
  private staggered: boolean = false;
  private animationState: AnimationState = 'idle';
  private animationTimer: number = 0;
  private iFrameTimer: number = 0;
  private staggerTimer: number = 0;

  constructor(
    id: string,
    health: number,
    stamina: number,
    x: number,
    y: number
  ) {
    this.id = id;
    this.health = health;
    this.maxHealth = health;
    this.stamina = stamina;
    this.maxStamina = stamina;
    this.position = { x, y };
    this.hurtbox = { x, y, width: 40, height: 80 };
  }

  attack(type: AttackType): Attack {
    const staminaCost = type === AttackType.JAB ? 10 : 20;
    
    if (this.stamina >= staminaCost) {
      this.stamina -= staminaCost;
      this.animationState = 'attacking';
      this.animationTimer = type === AttackType.JAB ? 300 : 500;

      const hitboxOffset = type === AttackType.JAB ? 50 : 60;
      const hitboxWidth = type === AttackType.JAB ? 30 : 40;

      return {
        type,
        damage: type === AttackType.JAB ? 10 : 25,
        hitbox: {
          x: this.position.x + hitboxOffset,
          y: this.position.y + 20,
          width: hitboxWidth,
          height: 40
        },
        staminaCost,
        canStagger: type === AttackType.HOOK
      };
    }

    return {
      type,
      damage: 0,
      hitbox: { x: 0, y: 0, width: 0, height: 0 },
      staminaCost: 0,
      canStagger: false
    };
  }

  performFootwork(): void {
    const staminaCost = 15;
    if (this.stamina >= staminaCost) {
      this.stamina -= staminaCost;
      this.invulnerable = true;
      this.iFrameTimer = 300;
      this.animationState = 'footwork';
      this.animationTimer = 300;
      
      // Lateral movement
      this.position.x += Math.random() > 0.5 ? 30 : -30;
    }
  }

  takeDamage(amount: number): void {
    if (!this.invulnerable) {
      this.health = Math.max(0, this.health - amount);
      this.animationState = 'hurt';
      this.animationTimer = 200;
    }
  }

  stagger(): void {
    this.staggered = true;
    this.staggerTimer = 1000;
    this.animationState = 'staggered';
    this.animationTimer = 1000;
  }

  update(deltaTime: number): void {
    // Update animation timer
    if (this.animationTimer > 0) {
      this.animationTimer -= deltaTime;
      if (this.animationTimer <= 0) {
        this.animationState = 'idle';
      }
    }

    // Update i-frame timer
    if (this.iFrameTimer > 0) {
      this.iFrameTimer -= deltaTime;
      if (this.iFrameTimer <= 0) {
        this.invulnerable = false;
      }
    }

    // Update stagger timer
    if (this.staggerTimer > 0) {
      this.staggerTimer -= deltaTime;
      if (this.staggerTimer <= 0) {
        this.staggered = false;
      }
    }

    // Regenerate stamina
    this.stamina = Math.min(this.maxStamina, this.stamina + deltaTime * 0.02);

    // Update hurtbox position
    this.hurtbox.x = this.position.x;
    this.hurtbox.y = this.position.y;
  }

  isInvulnerable(): boolean {
    return this.invulnerable;
  }

  isStaggered(): boolean {
    return this.staggered;
  }

  getAnimationState(): AnimationState {
    return this.animationState;
  }
}
