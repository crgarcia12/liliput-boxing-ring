import { GameEngine } from './GameEngine';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
if (!canvas) {
  throw new Error('Canvas element not found');
}

const engine = new GameEngine(canvas);
engine.start();

// Make engine globally accessible for debugging
(window as any).gameEngine = engine;
