import { describe, it, expect, beforeEach, vi } from 'vitest'
import { HUD } from '../hud'
import type { Fighter } from '../types'

describe('HUD', () => {
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D
  let hud: HUD
  let player: Fighter
  let opponent: Fighter

  beforeEach(() => {
    canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    ctx = canvas.getContext('2d')!
    
    // Mock canvas context methods that are not implemented in jsdom
    if (!ctx.fillRect) ctx.fillRect = vi.fn()
    if (!ctx.strokeRect) ctx.strokeRect = vi.fn()
    if (!ctx.fillText) ctx.fillText = vi.fn()
    if (!ctx.beginPath) ctx.beginPath = vi.fn()
    if (!ctx.moveTo) ctx.moveTo = vi.fn()
    if (!ctx.lineTo) ctx.lineTo = vi.fn()
    if (!ctx.stroke) ctx.stroke = vi.fn()
    if (!ctx.arc) ctx.arc = vi.fn()
    if (!ctx.fill) ctx.fill = vi.fn()
    if (!ctx.save) ctx.save = vi.fn()
    if (!ctx.restore) ctx.restore = vi.fn()
    
    hud = new HUD(ctx, canvas)

    player = {
      x: 100,
      y: 500,
      width: 50,
      height: 80,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      isPlayer: true,
      velocityX: 0,
      velocityY: 0,
      isAttacking: false,
      attackCooldown: 0,
      isDodging: false,
      dodgeCooldown: 0,
      staggered: false,
      staggerTime: 0
    }

    opponent = {
      ...player,
      x: 600,
      isPlayer: false
    }
  })

  describe('Health bars', () => {
    it('should draw player health bar at top left', () => {
      const fillRectSpy = vi.spyOn(ctx, 'fillRect')
      
      hud.draw(player, opponent, false, null)
      
      // Check that health bar is drawn at position (20, 20)
      const healthBarCalls = fillRectSpy.mock.calls.filter(
        call => call[0] === 20 && call[1] === 20 && call[2] === 200 && call[3] === 20
      )
      expect(healthBarCalls.length).toBeGreaterThan(0)
    })

    it('should draw opponent health bar at top right', () => {
      const fillRectSpy = vi.spyOn(ctx, 'fillRect')
      
      hud.draw(player, opponent, false, null)
      
      // Check that health bar is drawn at position (580, 20) - canvas.width - 220
      const healthBarCalls = fillRectSpy.mock.calls.filter(
        call => call[0] === 580 && call[1] === 20 && call[2] === 200 && call[3] === 20
      )
      expect(healthBarCalls.length).toBeGreaterThan(0)
    })

    it('should show 100% fill for full health', () => {
      const fillRectSpy = vi.spyOn(ctx, 'fillRect')
      
      player.health = 100
      hud.draw(player, opponent, false, null)
      
      // Full health bar should be 200px wide
      const fullHealthBar = fillRectSpy.mock.calls.find(
        call => call[0] === 20 && call[1] === 20 && call[2] === 200
      )
      expect(fullHealthBar).toBeDefined()
    })

    it('should decrease proportionally when health decreases', () => {
      const fillRectSpy = vi.spyOn(ctx, 'fillRect')
      
      player.health = 50
      hud.draw(player, opponent, false, null)
      
      // 50% health should be 100px wide
      const halfHealthBar = fillRectSpy.mock.calls.find(
        call => call[0] === 20 && call[1] === 20 && call[2] === 100
      )
      expect(halfHealthBar).toBeDefined()
    })
  })

  describe('Stamina bar', () => {
    it('should draw player stamina bar below health bar', () => {
      const fillRectSpy = vi.spyOn(ctx, 'fillRect')
      
      hud.draw(player, opponent, false, null)
      
      // Stamina bar should be at position (20, 50)
      const staminaBarCalls = fillRectSpy.mock.calls.filter(
        call => call[0] === 20 && call[1] === 50 && call[2] === 200 && call[3] === 12
      )
      expect(staminaBarCalls.length).toBeGreaterThan(0)
    })

    it('should show 100% fill for full stamina', () => {
      const fillRectSpy = vi.spyOn(ctx, 'fillRect')
      
      player.stamina = 100
      hud.draw(player, opponent, false, null)
      
      // Full stamina bar should be 200px wide
      const fullStaminaBar = fillRectSpy.mock.calls.find(
        call => call[0] === 20 && call[1] === 50 && call[2] === 200 && call[3] === 12
      )
      expect(fullStaminaBar).toBeDefined()
    })

    it('should decrease when stamina decreases', () => {
      const fillRectSpy = vi.spyOn(ctx, 'fillRect')
      
      player.stamina = 75
      hud.draw(player, opponent, false, null)
      
      // 75% stamina should be 150px wide
      const partialStaminaBar = fillRectSpy.mock.calls.find(
        call => call[0] === 20 && call[1] === 50 && call[2] === 150 && call[3] === 12
      )
      expect(partialStaminaBar).toBeDefined()
    })
  })

  describe('End game screen', () => {
    it('should display "YOU WIN!" message on player victory', () => {
      const fillTextSpy = vi.spyOn(ctx, 'fillText')
      
      hud.draw(player, opponent, true, 'player')
      
      const winMessage = fillTextSpy.mock.calls.find(
        call => call[0] === 'YOU WIN!'
      )
      expect(winMessage).toBeDefined()
    })

    it('should display "YOU LOSE!" message on player defeat', () => {
      const fillTextSpy = vi.spyOn(ctx, 'fillText')
      
      hud.draw(player, opponent, true, 'opponent')
      
      const loseMessage = fillTextSpy.mock.calls.find(
        call => call[0] === 'YOU LOSE!'
      )
      expect(loseMessage).toBeDefined()
    })

    it('should show restart button on game over', () => {
      const fillTextSpy = vi.spyOn(ctx, 'fillText')
      
      hud.draw(player, opponent, true, 'player')
      
      const restartButton = fillTextSpy.mock.calls.find(
        call => call[0] === 'RESTART'
      )
      expect(restartButton).toBeDefined()
    })

    it('should not show end game screen when game is not over', () => {
      const fillTextSpy = vi.spyOn(ctx, 'fillText')
      
      hud.draw(player, opponent, false, null)
      
      const winMessage = fillTextSpy.mock.calls.find(
        call => call[0] === 'YOU WIN!' || call[0] === 'YOU LOSE!'
      )
      expect(winMessage).toBeUndefined()
    })
  })

  describe('Restart button', () => {
    it('should detect click on restart button', () => {
      const buttonX = canvas.width / 2 - 100
      const buttonY = canvas.height / 2 + 20
      
      const clicked = hud.isRestartButtonClicked(buttonX + 50, buttonY + 25)
      
      expect(clicked).toBe(true)
    })

    it('should not detect click outside restart button', () => {
      const clicked = hud.isRestartButtonClicked(10, 10)
      
      expect(clicked).toBe(false)
    })
  })
})
