import { Boxer, BoxerState } from './Boxer';
import { AIController } from './AIController';
import { InputManager } from './InputManager';
import { CollisionDetector } from './CollisionDetector';
import { HUDRenderer } from './HUDRenderer';

export enum GameState {
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  DEFEAT = 'DEFEAT'
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Boxer;
  private ai: Boxer;
  private aiController: AIController;
  private inputManager: InputManager;
  private lastTime: number = 0;
  private gameState: GameState = GameState.PLAYING;
  private animationFrameId: number | null = null;
  private restartButton: HTMLButtonElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    // Initialize boxers
    this.player = new Boxer(100, 250, true);
    this.ai = new Boxer(650, 250, false);
    
    this.aiController = new AIController(this.ai, this.player);
    this.inputManager = new InputManager();

    this.setupInput();
    this.createRestartButton();
  }

  private setupInput(): void {
    this.inputManager.onKey('J', () => {
      if (this.gameState === GameState.PLAYING) {
        this.player.executeJab(Date.now());
      }
    });

    this.inputManager.onKey('H', () => {
      if (this.gameState === GameState.PLAYING) {
        this.player.executeHook(Date.now());
      }
    });

    this.inputManager.onKey('D', () => {
      if (this.gameState === GameState.PLAYING) {
        this.player.executeFootwork(Date.now());
      }
    });
  }

  private createRestartButton(): void {
    this.restartButton = document.createElement('button');
    this.restartButton.textContent = 'Restart';
    this.restartButton.style.position = 'absolute';
    this.restartButton.style.left = '50%';
    this.restartButton.style.top = '60%';
    this.restartButton.style.transform = 'translate(-50%, -50%)';
    this.restartButton.style.padding = '15px 30px';
    this.restartButton.style.fontSize = '20px';
    this.restartButton.style.cursor = 'pointer';
    this.restartButton.style.display = 'none';
    this.restartButton.style.zIndex = '1000';
    
    this.restartButton.addEventListener('click', () => {
      this.restart();
    });

    document.body.appendChild(this.restartButton);
  }

  restart(): void {
    this.player = new Boxer(100, 250, true);
    this.ai = new Boxer(650, 250, false);
    this.aiController = new AIController(this.ai, this.player);
    this.gameState = GameState.PLAYING;
    if (this.restartButton) {
      this.restartButton.style.display = 'none';
    }
  }

  start(): void {
    this.lastTime = performance.now();
    this.gameLoop(this.lastTime);
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private gameLoop(currentTime: number): void {
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime, currentTime);
    this.render();

    this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  private update(deltaTime: number, currentTime: number): void {
    if (this.gameState !== GameState.PLAYING) {
      return;
    }

    // Update boxers
    this.player.update(deltaTime, currentTime);
    this.ai.update(deltaTime, currentTime);

    // AI decision making
    this.aiController.update(currentTime);

    // Check collisions
    if (CollisionDetector.checkHit(this.player, this.ai)) {
      const damage = this.player.state === BoxerState.JAB ? 10 : 25;
      this.ai.takeDamage(damage);
      
      if (this.player.state === BoxerState.HOOK && this.ai.health > 0) {
        this.ai.setState(BoxerState.STAGGER, currentTime);
      } else if (this.ai.health > 0) {
        this.ai.setState(BoxerState.HIT_STUN, currentTime);
      }
    }

    if (CollisionDetector.checkHit(this.ai, this.player)) {
      const damage = this.ai.state === BoxerState.JAB ? 10 : 25;
      this.player.takeDamage(damage);
      
      if (this.ai.state === BoxerState.HOOK && this.player.health > 0) {
        this.player.setState(BoxerState.STAGGER, currentTime);
      } else if (this.player.health > 0) {
        this.player.setState(BoxerState.HIT_STUN, currentTime);
      }
    }

    // Check win/lose conditions
    if (this.ai.health <= 0) {
      this.gameState = GameState.VICTORY;
      if (this.restartButton) {
        this.restartButton.style.display = 'block';
      }
    } else if (this.player.health <= 0) {
      this.gameState = GameState.DEFEAT;
      if (this.restartButton) {
        this.restartButton.style.display = 'block';
      }
    }
  }

  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw floor
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 330, this.canvas.width, 70);

    // Render boxers
    this.player.render(this.ctx);
    this.ai.render(this.ctx);

    // Render HUD
    HUDRenderer.render(this.ctx, this.player, this.ai, this.canvas);

    // Render end screen
    if (this.gameState !== GameState.PLAYING) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = '#FFF';
      this.ctx.font = 'bold 48px Arial';
      this.ctx.textAlign = 'center';
      
      const message = this.gameState === GameState.VICTORY ? 'Victory!' : 'Defeat!';
      this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
      
      this.ctx.textAlign = 'left';
    }
  }

  // Getters for testing
  getPlayer(): Boxer {
    return this.player;
  }

  getAI(): Boxer {
    return this.ai;
  }

  getGameState(): GameState {
    return this.gameState;
  }
}
