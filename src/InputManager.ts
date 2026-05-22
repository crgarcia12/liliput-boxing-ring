export class InputManager {
  private keysPressed: Set<string> = new Set();
  private keyHandlers: Map<string, () => void> = new Map();

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (!this.keysPressed.has(e.key.toUpperCase())) {
        this.keysPressed.add(e.key.toUpperCase());
        const handler = this.keyHandlers.get(e.key.toUpperCase());
        if (handler) {
          handler();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed.delete(e.key.toUpperCase());
    });
  }

  onKey(key: string, handler: () => void): void {
    this.keyHandlers.set(key.toUpperCase(), handler);
  }

  isKeyPressed(key: string): boolean {
    return this.keysPressed.has(key.toUpperCase());
  }
}
