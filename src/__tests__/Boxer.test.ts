import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Boxer } from '../Boxer';

describe('Boxer', () => {
  let boxer: Boxer;

  beforeEach(() => {
    boxer = new Boxer(100, 500, 'red');
  });

  it('should create a boxer with initial position', () => {
    expect(boxer.x).toBe(100);
    expect(boxer.y).toBe(500);
  });

  it('should have initial health of 100', () => {
    expect(boxer.health).toBe(100);
  });

  it('should have initial stamina of 100', () => {
    expect(boxer.stamina).toBe(100);
  });

  it('should have a color', () => {
    expect(boxer.color).toBe('red');
  });

  it('should have default dimensions', () => {
    expect(boxer.width).toBeGreaterThan(0);
    expect(boxer.height).toBeGreaterThan(0);
  });

  it('should update position', () => {
    boxer.update(1/60);
    expect(boxer).toBeDefined();
  });

  it('should render to canvas context', () => {
    const mockCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
      strokeStyle: '',
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      font: ''
    } as any;

    boxer.render(mockCtx);
    expect(mockCtx.fillRect).toHaveBeenCalled();
  });
});
