/**
 * ResourceManager handles stamina consumption/regeneration, health tracking,
 * action gating, and win/lose condition detection for a boxer.
 */
export class ResourceManager {
  private health: number;
  private maxHealth: number;
  private stamina: number;
  private maxStamina: number;
  private staminaRegenRate: number; // stamina per second

  constructor(
    maxHealth: number = 100,
    maxStamina: number = 100,
    staminaRegenRate: number = 20
  ) {
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.maxStamina = maxStamina;
    this.stamina = maxStamina;
    this.staminaRegenRate = staminaRegenRate;
  }

  // Stamina methods
  getStamina(): number {
    return this.stamina;
  }

  getMaxStamina(): number {
    return this.maxStamina;
  }

  /**
   * Consume stamina for an action (direct, no checking)
   */
  consumeStamina(amount: number): void {
    this.stamina = Math.max(0, this.stamina - amount);
  }

  /**
   * Check if there's enough stamina for an action
   */
  hasEnoughStamina(amount: number): boolean {
    return this.stamina >= amount;
  }

  /**
   * Try to consume stamina (returns false if insufficient)
   */
  tryConsumeStamina(amount: number): boolean {
    if (!this.hasEnoughStamina(amount)) {
      return false;
    }
    this.consumeStamina(amount);
    return true;
  }

  // Health methods
  getHealth(): number {
    return this.health;
  }

  getMaxHealth(): number {
    return this.maxHealth;
  }

  /**
   * Take damage and reduce health
   */
  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  // Win/Lose condition methods
  isKnockedOut(): boolean {
    return this.health <= 0;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Update stamina regeneration based on time delta
   * @param deltaTime Time elapsed in seconds
   */
  update(deltaTime: number): void {
    if (this.stamina < this.maxStamina) {
      this.stamina = Math.min(
        this.maxStamina,
        this.stamina + this.staminaRegenRate * deltaTime
      );
    }
  }
}
