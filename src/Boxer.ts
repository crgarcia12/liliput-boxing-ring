export class Boxer {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  health: number;
  stamina: number;
  velocityX: number;
  velocityY: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 80;
    this.color = color;
    this.health = 100;
    this.stamina = 100;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  update(deltaTime: number): void {
    // Update position based on velocity
    this.x += this.velocityX * deltaTime * 60;
    this.y += this.velocityY * deltaTime * 60;

    // Regenerate stamina
    if (this.stamina < 100) {
      this.stamina = Math.min(100, this.stamina + deltaTime * 20);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw boxer body
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw boxer outline
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Draw health bar above boxer
    const healthBarWidth = this.width;
    const healthBarHeight = 5;
    const healthBarY = this.y - 10;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x, healthBarY, healthBarWidth, healthBarHeight);

    // Health
    ctx.fillStyle = this.health > 30 ? '#0f0' : '#f00';
    ctx.fillRect(this.x, healthBarY, (this.health / 100) * healthBarWidth, healthBarHeight);

    // Draw stamina bar below health
    const staminaBarY = this.y - 17;
    ctx.fillStyle = '#222';
    ctx.fillRect(this.x, staminaBarY, healthBarWidth, healthBarHeight);

    ctx.fillStyle = '#ff0';
    ctx.fillRect(this.x, staminaBarY, (this.stamina / 100) * healthBarWidth, healthBarHeight);
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  useStamina(amount: number): boolean {
    if (this.stamina >= amount) {
      this.stamina -= amount;
      return true;
    }
    return false;
  }
}
