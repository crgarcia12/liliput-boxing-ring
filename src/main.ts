import './style.css';
import { Game } from './Game';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
if (!canvas) {
  throw new Error('Canvas element not found');
}

canvas.width = 800;
canvas.height = 400;

const game = new Game(canvas);
game.start();

// Expose game instance for testing
(window as any).game = game;
