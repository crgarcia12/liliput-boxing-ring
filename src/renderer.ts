import type { Fighter } from './types'

export class Renderer {
  private ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  clear() {
    this.ctx.fillStyle = '#2a2a2a'
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }

  drawRing() {
    // Draw floor
    this.ctx.fillStyle = '#444'
    this.ctx.fillRect(0, 520, 800, 80)
    
    // Floor lines
    this.ctx.strokeStyle = '#666'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(0, 520)
    this.ctx.lineTo(800, 520)
    this.ctx.stroke()
  }

  drawFighter(fighter: Fighter) {
    this.ctx.save()

    // Fighter color
    if (fighter.isPlayer) {
      this.ctx.fillStyle = '#4488ff'
    } else {
      this.ctx.fillStyle = '#ff4444'
    }

    // Body
    this.ctx.fillRect(fighter.x, fighter.y, fighter.width, fighter.height)

    // Head
    this.ctx.fillStyle = fighter.isPlayer ? '#6699ff' : '#ff6666'
    this.ctx.beginPath()
    this.ctx.arc(fighter.x + fighter.width / 2, fighter.y - 15, 20, 0, Math.PI * 2)
    this.ctx.fill()

    // Attack indicator
    if (fighter.isAttacking) {
      this.ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'
      const punchX = fighter.isPlayer ? fighter.x + fighter.width : fighter.x - 40
      this.ctx.fillRect(punchX, fighter.y + 20, 40, 20)
    }

    // Dodge indicator
    if (fighter.isDodging) {
      this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'
      this.ctx.lineWidth = 3
      this.ctx.strokeRect(fighter.x - 5, fighter.y - 25, fighter.width + 10, fighter.height + 30)
    }

    // Stagger indicator
    if (fighter.staggered) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      this.ctx.fillRect(fighter.x, fighter.y, fighter.width, fighter.height)
    }

    this.ctx.restore()
  }
}
