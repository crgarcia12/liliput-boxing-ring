export enum AttackType {
  JAB = 'jab',
  HOOK = 'hook',
  FOOTWORK = 'footwork'
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Attack {
  type: AttackType;
  damage: number;
  hitbox: Box;
  staminaCost: number;
  canStagger: boolean;
}

export type AnimationState = 'idle' | 'attacking' | 'staggered' | 'footwork' | 'hurt';
