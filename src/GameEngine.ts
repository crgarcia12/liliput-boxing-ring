import { Boxer } from './Boxer';

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Boxer;
  opponent: Boxer;
  isRunning: boolean;
  targetFPS: number;
  fps: number;
  
  private lastFrameTime: number;
  private frameCount: number;
  private fpsUpdateTime: number;
  private animationFrameId: number | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    // Initialize boxers
    this.player = new Boxer(100, 400, '#3b82f6'); // Blue player on left
    this.opponent = new Boxer(660, 400, '#ef4444'); // Red opponent on right

    this.isRunning = false;
    this.targetFPS = 60;
    this.fps = 0;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fpsUpdateTime = 0;
    this.animationFrameId = null;
  }

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.fpsUpdateTime = this.lastFrameTime;
    this.gameLoop(this.lastFrameTime);
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private gameLoop = (currentTime: number): void => {
    if (!this.isRunning) return;

    // Calculate delta time (in seconds)
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    // Update FPS counter
    this.frameCount++;
    if (currentTime - this.fpsUpdateTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;
      
      // Update FPS display in DOM if element exists
      const fpsElement = document.getElementById('fps');
      if (fpsElement) {
        fpsElement.textContent = `FPS: ${this.fps}`;
      }
    }

    // Update game state
    this.update(deltaTime);

    // Render game
    this.render();

    // Request next frame
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  update(deltaTime: number): void {
    // Cap delta time to prevent large jumps
    const cappedDelta = Math.min(deltaTime, 1 / 30);

    // Update both boxers
    this.player.update(cappedDelta);
    this.opponent.update(cappedDelta);

    // Keep boxers within canvas bounds
    this.constrainToCanvas(this.player);
    this.constrainToCanvas(this.opponent);
  }

  private constrainToCanvas(boxer: Boxer): void {
    // Horizontal bounds
    if (boxer.x < 0) boxer.x = 0;
    if (boxer.x + boxer.width > this.canvas.width) {
      boxer.x = this.canvas.width - boxer.width;
    }

    // Vertical bounds (ground)
    if (boxer.y < 0) boxer.y = 0;
    if (boxer.y + boxer.height > this.canvas.height) {
      boxer.y = this.canvas.height - boxer.height;
    }
  }

  render(): void {
    // Clear canvas
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw boxing ring ground
    this.ctx.fillStyle = '#4a4a4a';
    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);

    // Draw center line
    this.ctx.strokeStyle = '#666';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([10, 10]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2, 0);
    this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Render boxers
    this.player.render(this.ctx);
    this.opponent.render(this.ctx);

    // Draw title
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('LILIPUT BOXING RING', this.canvas.width / 2, 40);

    // Draw player labels
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('PLAYER', this.player.x, this.player.y - 25);
    this.ctx.fillText('OPPONENT', this.opponent.x, this.opponent.y - 25);
  }
}
