export interface Fighter {
  x: number
  y: number
  width: number
  height: number
  health: number
  maxHealth: number
  stamina: number
  maxStamina: number
  isPlayer: boolean
  velocityX: number
  velocityY: number
  isAttacking: boolean
  attackCooldown: number
  isDodging: boolean
  dodgeCooldown: number
  staggered: boolean
  staggerTime: number
}

export interface GameState {
  player: Fighter
  opponent: Fighter
  gameOver: boolean
  winner: 'player' | 'opponent' | null
  keys: Set<string>
  lastTime: number
}
