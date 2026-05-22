import { Boxer, Hitbox } from './Boxer';

export class CollisionDetector {
  static checkCollision(hitbox: Hitbox, hurtbox: Hitbox): boolean {
    return (
      hitbox.x < hurtbox.x + hurtbox.width &&
      hitbox.x + hitbox.width > hurtbox.x &&
      hitbox.y < hurtbox.y + hurtbox.height &&
      hitbox.y + hitbox.height > hurtbox.y
    );
  }

  static checkHit(attacker: Boxer, defender: Boxer): boolean {
    const hitbox = attacker.getHitbox();
    if (!hitbox) {
      return false;
    }

    const hurtbox = defender.getHurtbox();
    return this.checkCollision(hitbox, hurtbox);
  }
}
