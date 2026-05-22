import { AttackType, Attack, Box } from '../types/Combat';
import { Fighter } from '../entities/Fighter';

export class CombatSystem {
  calculateDamage(attackType: AttackType): number {
    switch (attackType) {
      case AttackType.JAB:
        return 10 + Math.random() * 5;
      case AttackType.HOOK:
        return 20 + Math.random() * 10;
      default:
        return 0;
    }
  }

  checkCollision(hitbox: Box, hurtbox: Box): boolean {
    return (
      hitbox.x < hurtbox.x + hurtbox.width &&
      hitbox.x + hitbox.width > hurtbox.x &&
      hitbox.y < hurtbox.y + hurtbox.height &&
      hitbox.y + hitbox.height > hurtbox.y
    );
  }

  applyDamage(target: Fighter, attack: Attack, collision: boolean): void {
    if (!collision || target.isInvulnerable()) {
      return;
    }

    target.takeDamage(attack.damage);

    if (attack.canStagger) {
      target.stagger();
    }
  }
}
