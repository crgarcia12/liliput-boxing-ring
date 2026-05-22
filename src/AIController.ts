import { Boxer, BoxerState } from './Boxer';

export class AIController {
  private lastDecisionTime: number = 0;
  private decisionCooldown: number = 500;
  private boxer: Boxer;
  private opponent: Boxer;

  constructor(boxer: Boxer, opponent: Boxer) {
    this.boxer = boxer;
    this.opponent = opponent;
  }

  update(currentTime: number): void {
    if (this.boxer.state !== BoxerState.IDLE) {
      return;
    }

    if (currentTime - this.lastDecisionTime < this.decisionCooldown) {
      return;
    }

    const distance = Math.abs(this.opponent.position.x - this.boxer.position.x);
    
    // Decision tree based on distance and stamina
    if (distance < 50) {
      // Close range - prefer hook or jab
      if (this.boxer.stamina >= 30 && Math.random() > 0.3) {
        this.boxer.executeHook(currentTime);
      } else if (this.boxer.stamina >= 15) {
        this.boxer.executeJab(currentTime);
      }
    } else if (distance < 100) {
      // Mid range - approach or jab
      if (this.boxer.stamina >= 15 && Math.random() > 0.5) {
        this.boxer.executeJab(currentTime);
      } else if (this.boxer.stamina >= 20) {
        this.boxer.executeFootwork(currentTime);
      }
    } else {
      // Far range - footwork to close distance
      if (this.boxer.stamina >= 20) {
        this.boxer.executeFootwork(currentTime);
      }
    }

    this.lastDecisionTime = currentTime;
    this.decisionCooldown = 500 + (Math.random() * 400 - 200);
  }
}
