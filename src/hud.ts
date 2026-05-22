import type { Fighter } from './types'

export class HUD {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.ctx = ctx
    this.canvas = canvas
  }

  drawHealthBar(fighter: Fighter, x: number, y: number, label: string) {
    const barWidth = 200
    const barHeight = 20
    const healthPercent = fighter.health / fighter.maxHealth

    // Background
    this.ctx.fillStyle = '#333'
    this.ctx.fillRect(x, y, barWidth, barHeight)

    // Health fill
    this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffaa00' : '#ff0000'
    this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight)

    // Border
    this.ctx.strokeStyle = '#fff'
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(x, y, barWidth, barHeight)

    // Label
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '14px Arial'
    this.ctx.fillText(label, x, y - 5)

    // Health text
    this.ctx.fillText(`${Math.max(0, Math.floor(fighter.health))}/${fighter.maxHealth}`, x + 5, y + 15)
  }

  drawStaminaBar(fighter: Fighter, x: number, y: number) {
    const barWidth = 200
    const barHeight = 12
    const staminaPercent = fighter.stamina / fighter.maxStamina

    // Background
    this.ctx.fillStyle = '#222'
    this.ctx.fillRect(x, y, barWidth, barHeight)

    // Stamina fill
    this.ctx.fillStyle = '#00aaff'
    this.ctx.fillRect(x, y, barWidth * staminaPercent, barHeight)

    // Border
    this.ctx.strokeStyle = '#fff'
    this.ctx.lineWidth = 1
    this.ctx.strokeRect(x, y, barWidth, barHeight)
  }

  drawEndGameScreen(winner: 'player' | 'opponent') {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Message
    this.ctx.fillStyle = winner === 'player' ? '#00ff00' : '#ff0000'
    this.ctx.font = 'bold 48px Arial'
    this.ctx.textAlign = 'center'
    const message = winner === 'player' ? 'YOU WIN!' : 'YOU LOSE!'
    this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2 - 50)

    // Restart button
    this.ctx.fillStyle = '#444'
    this.ctx.fillRect(this.canvas.width / 2 - 100, this.canvas.height / 2 + 20, 200, 50)
    
    this.ctx.strokeStyle = '#fff'
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(this.canvas.width / 2 - 100, this.canvas.height / 2 + 20, 200, 50)

    this.ctx.fillStyle = '#fff'
    this.ctx.font = '20px Arial'
    this.ctx.fillText('RESTART', this.canvas.width / 2, this.canvas.height / 2 + 50)

    this.ctx.textAlign = 'left'
  }

  draw(player: Fighter, opponent: Fighter, gameOver: boolean, winner: 'player' | 'opponent' | null) {
    // Player HUD (top left)
    this.drawHealthBar(player, 20, 20, 'PLAYER')
    this.drawStaminaBar(player, 20, 50)

    // Opponent HUD (top right)
    this.drawHealthBar(opponent, this.canvas.width - 220, 20, 'OPPONENT')

    // End game screen
    if (gameOver && winner) {
      this.drawEndGameScreen(winner)
    }
  }

  isRestartButtonClicked(x: number, y: number): boolean {
    const buttonX = this.canvas.width / 2 - 100
    const buttonY = this.canvas.height / 2 + 20
    const buttonWidth = 200
    const buttonHeight = 50

    return x >= buttonX && x <= buttonX + buttonWidth &&
           y >= buttonY && y <= buttonY + buttonHeight
  }
}
