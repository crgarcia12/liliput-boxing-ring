export enum BoxerState {
  IDLE = 'IDLE',
  JAB = 'JAB',
  HOOK = 'HOOK',
  FOOTWORK = 'FOOTWORK',
  HIT_STUN = 'HIT_STUN',
  STAGGER = 'STAGGER',
  KNOCKED_OUT = 'KNOCKED_OUT'
}

export interface Position {
  x: number;
  y: number;
}

export interface Hitbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Boxer {
  position: Position;
  health: number;
  stamina: number;
  state: BoxerState;
  velocity: Position;
  frameCounter: number;
  stateStartTime: number;
  iFrameEndTime: number;
  isPlayer: boolean;
  facingRight: boolean;

  constructor(x: number, y: number, isPlayer: boolean) {
    this.position = { x, y };
    this.health = 100;
    this.stamina = 100;
    this.state = BoxerState.IDLE;
    this.velocity = { x: 0, y: 0 };
    this.frameCounter = 0;
    this.stateStartTime = 0;
    this.iFrameEndTime = 0;
    this.isPlayer = isPlayer;
    this.facingRight = isPlayer; // Player faces right, AI faces left
  }

  update(deltaTime: number, currentTime: number): void {
    this.frameCounter++;

    // Regenerate stamina when idle
    if (this.state === BoxerState.IDLE && this.stamina < 100) {
      this.stamina = Math.min(100, this.stamina + 10 * (deltaTime / 1000));
    }

    // Handle state transitions based on animation frames
    const stateDuration = currentTime - this.stateStartTime;

    switch (this.state) {
      case BoxerState.JAB:
        if (stateDuration > 20 * (1000 / 60)) {
          this.setState(BoxerState.IDLE, currentTime);
        }
        break;
      case BoxerState.HOOK:
        if (stateDuration > 40 * (1000 / 60)) {
          this.setState(BoxerState.IDLE, currentTime);
        }
        break;
      case BoxerState.FOOTWORK:
        if (stateDuration > 30 * (1000 / 60)) {
          this.setState(BoxerState.IDLE, currentTime);
        }
        break;
      case BoxerState.HIT_STUN:
        if (stateDuration > 10 * (1000 / 60)) {
          this.setState(BoxerState.IDLE, currentTime);
        }
        break;
      case BoxerState.STAGGER:
        if (stateDuration > 1000) {
          this.setState(BoxerState.IDLE, currentTime);
        }
        break;
    }

    // Apply velocity
    this.position.x += this.velocity.x * (deltaTime / 1000);
    this.position.y += this.velocity.y * (deltaTime / 1000);
    this.velocity.x *= 0.9;
  }

  setState(newState: BoxerState, currentTime: number): void {
    this.state = newState;
    this.stateStartTime = currentTime;
    this.velocity.x = 0;
  }

  consumeStamina(amount: number): boolean {
    if (this.stamina >= amount) {
      this.stamina -= amount;
      return true;
    }
    return false;
  }

  takeDamage(amount: number): void {
    if (this.isInvulnerable()) {
      return;
    }
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      this.state = BoxerState.KNOCKED_OUT;
    }
  }

  isInvulnerable(): boolean {
    return Date.now() < this.iFrameEndTime;
  }

  executeJab(currentTime: number): boolean {
    if (this.state !== BoxerState.IDLE || !this.consumeStamina(15)) {
      return false;
    }
    this.setState(BoxerState.JAB, currentTime);
    return true;
  }

  executeHook(currentTime: number): boolean {
    if (this.state !== BoxerState.IDLE || !this.consumeStamina(30)) {
      return false;
    }
    this.setState(BoxerState.HOOK, currentTime);
    return true;
  }

  executeFootwork(currentTime: number): boolean {
    if (this.state !== BoxerState.IDLE || !this.consumeStamina(20)) {
      return false;
    }
    this.setState(BoxerState.FOOTWORK, currentTime);
    this.velocity.x = this.facingRight ? 100 : -100;
    this.iFrameEndTime = currentTime + 200;
    return true;
  }

  getHitbox(): Hitbox | null {
    const baseX = this.facingRight ? this.position.x + 50 : this.position.x - 40;
    
    switch (this.state) {
      case BoxerState.JAB:
        return {
          x: baseX,
          y: this.position.y + 10,
          width: 40,
          height: 20
        };
      case BoxerState.HOOK:
        return {
          x: baseX,
          y: this.position.y + 10,
          width: 35,
          height: 25
        };
      default:
        return null;
    }
  }

  getHurtbox(): Hitbox {
    return {
      x: this.position.x,
      y: this.position.y,
      width: 50,
      height: 80
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    const colors: Record<BoxerState, string> = {
      [BoxerState.IDLE]: this.isPlayer ? '#4CAF50' : '#F44336',
      [BoxerState.JAB]: '#FFC107',
      [BoxerState.HOOK]: '#FF5722',
      [BoxerState.FOOTWORK]: '#2196F3',
      [BoxerState.HIT_STUN]: '#9E9E9E',
      [BoxerState.STAGGER]: '#795548',
      [BoxerState.KNOCKED_OUT]: '#000000'
    };

    // Draw body
    ctx.fillStyle = colors[this.state];
    ctx.fillRect(this.position.x, this.position.y, 50, 80);

    // Draw hitbox if attacking
    const hitbox = this.getHitbox();
    if (hitbox) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }

    // Draw i-frame indicator
    if (this.isInvulnerable()) {
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 3;
      ctx.strokeRect(this.position.x - 5, this.position.y - 5, 60, 90);
    }
  }
}
