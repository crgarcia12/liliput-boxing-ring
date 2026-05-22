import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameEngine } from '../GameEngine';

describe('GameEngine', () => {
  let canvas: HTMLCanvasElement;
  let engine: GameEngine;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    engine = new GameEngine(canvas);
  });

  it('should initialize with a canvas', () => {
    expect(engine).toBeDefined();
    expect(engine.canvas).toBe(canvas);
  });

  it('should have a rendering context', () => {
    expect(engine.ctx).toBeDefined();
  });

  it('should start the game loop', () => {
    const spy = vi.spyOn(window, 'requestAnimationFrame');
    engine.start();
    expect(spy).toHaveBeenCalled();
    engine.stop();
  });

  it('should stop the game loop', () => {
    engine.start();
    engine.stop();
    expect(engine.isRunning).toBe(false);
  });

  it('should track FPS', () => {
    engine.start();
    expect(engine.fps).toBeGreaterThanOrEqual(0);
    engine.stop();
  });

  it('should target 60 FPS', () => {
    expect(engine.targetFPS).toBe(60);
  });

  it('should have player boxer', () => {
    expect(engine.player).toBeDefined();
  });

  it('should have opponent boxer', () => {
    expect(engine.opponent).toBeDefined();
  });

  it('should update game state', () => {
    const initialTime = performance.now();
    engine.update(1/60);
    expect(engine).toBeDefined();
  });

  it('should render game state', () => {
    engine.render();
    expect(engine).toBeDefined();
  });
});
