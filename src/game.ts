import type { Fighter, GameState } from './types'

const GROUND_Y = 500
const GRAVITY = 0.8
const STAMINA_REGEN = 0.5
const MOVE_SPEED = 5

export class Game {
  private state: GameState

  constructor() {
    this.state = this.createInitialState()
  }

  private createInitialState(): GameState {
    return {
      player: this.createFighter(150, GROUND_Y, true),
      opponent: this.createFighter(550, GROUND_Y, false),
      gameOver: false,
      winner: null,
      keys: new Set(),
      lastTime: Date.now()
    }
  }

  private createFighter(x: number, y: number, isPlayer: boolean): Fighter {
    return {
      x,
      y,
      width: 50,
      height: 80,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      isPlayer,
      velocityX: 0,
      velocityY: 0,
      isAttacking: false,
      attackCooldown: 0,
      isDodging: false,
      dodgeCooldown: 0,
      staggered: false,
      staggerTime: 0
    }
  }

  getState(): GameState {
    return this.state
  }

  reset() {
    this.state = this.createInitialState()
  }

  handleKeyDown(key: string) {
    this.state.keys.add(key)
  }

  handleKeyUp(key: string) {
    this.state.keys.delete(key)
  }

  update(deltaTime: number) {
    if (this.state.gameOver) return

    const dt = deltaTime / 16.67 // Normalize to 60fps

    // Update player
    this.updateFighter(this.state.player, dt)
    
    // Update opponent (simple AI)
    this.updateOpponentAI(dt)
    this.updateFighter(this.state.opponent, dt)

    // Check collisions
    this.checkAttackCollisions()

    // Check game over
    this.checkGameOver()
  }

  private updateFighter(fighter: Fighter, dt: number) {
    // Update cooldowns
    if (fighter.attackCooldown > 0) fighter.attackCooldown -= dt
    if (fighter.dodgeCooldown > 0) fighter.dodgeCooldown -= dt
    if (fighter.staggerTime > 0) {
      fighter.staggerTime -= dt
      if (fighter.staggerTime <= 0) fighter.staggered = false
    }

    // Stamina regeneration
    if (fighter.stamina < fighter.maxStamina && !fighter.isAttacking) {
      fighter.stamina = Math.min(fighter.maxStamina, fighter.stamina + STAMINA_REGEN * dt)
    }

    if (fighter.staggered) return

    // Handle player input
    if (fighter.isPlayer) {
      fighter.velocityX = 0

      if (this.state.keys.has('a') || this.state.keys.has('ArrowLeft')) {
        fighter.velocityX = -MOVE_SPEED
      }
      if (this.state.keys.has('d') || this.state.keys.has('ArrowRight')) {
        fighter.velocityX = MOVE_SPEED
      }

      // Jump
      if ((this.state.keys.has('w') || this.state.keys.has('ArrowUp')) && fighter.y >= GROUND_Y) {
        fighter.velocityY = -15
      }

      // Jab (J key)
      if (this.state.keys.has('j') && fighter.attackCooldown <= 0 && fighter.stamina >= 10) {
        fighter.isAttacking = true
        fighter.attackCooldown = 20
        fighter.stamina -= 10
        setTimeout(() => { fighter.isAttacking = false }, 200)
      }

      // Hook (K key)
      if (this.state.keys.has('k') && fighter.attackCooldown <= 0 && fighter.stamina >= 25) {
        fighter.isAttacking = true
        fighter.attackCooldown = 40
        fighter.stamina -= 25
        setTimeout(() => { fighter.isAttacking = false }, 400)
      }

      // Dodge (Space)
      if (this.state.keys.has(' ') && fighter.dodgeCooldown <= 0 && fighter.stamina >= 15) {
        fighter.isDodging = true
        fighter.dodgeCooldown = 60
        fighter.stamina -= 15
        setTimeout(() => { fighter.isDodging = false }, 300)
      }
    }

    // Apply physics
    fighter.x += fighter.velocityX * dt
    fighter.y += fighter.velocityY * dt
    fighter.velocityY += GRAVITY * dt

    // Ground collision
    if (fighter.y > GROUND_Y) {
      fighter.y = GROUND_Y
      fighter.velocityY = 0
    }

    // Boundaries
    fighter.x = Math.max(0, Math.min(750, fighter.x))
  }

  private updateOpponentAI(dt: number) {
    const opponent = this.state.opponent
    const player = this.state.player

    if (opponent.staggered) return

    const distance = Math.abs(opponent.x - player.x)

    // Simple AI: move towards player and attack when close
    if (distance > 100) {
      opponent.velocityX = player.x > opponent.x ? MOVE_SPEED * 0.7 : -MOVE_SPEED * 0.7
    } else {
      opponent.velocityX = 0
      
      // Attack randomly
      if (Math.random() < 0.02 && opponent.attackCooldown <= 0 && opponent.stamina >= 10) {
        opponent.isAttacking = true
        opponent.attackCooldown = 30
        opponent.stamina -= 10
        setTimeout(() => { opponent.isAttacking = false }, 300)
      }
    }
  }

  private checkAttackCollisions() {
    const player = this.state.player
    const opponent = this.state.opponent

    // Player hits opponent
    if (player.isAttacking && !opponent.isDodging) {
      const distance = Math.abs(player.x - opponent.x)
      if (distance < 100) {
        const damage = this.state.keys.has('k') ? 20 : 10
        opponent.health = Math.max(0, opponent.health - damage)
        
        if (this.state.keys.has('k')) {
          opponent.staggered = true
          opponent.staggerTime = 30
        }
        
        player.isAttacking = false
      }
    }

    // Opponent hits player
    if (opponent.isAttacking && !player.isDodging) {
      const distance = Math.abs(player.x - opponent.x)
      if (distance < 100) {
        player.health = Math.max(0, player.health - 12)
        opponent.isAttacking = false
      }
    }
  }

  private checkGameOver() {
    if (this.state.player.health <= 0) {
      this.state.gameOver = true
      this.state.winner = 'opponent'
    } else if (this.state.opponent.health <= 0) {
      this.state.gameOver = true
      this.state.winner = 'player'
    }
  }
}
