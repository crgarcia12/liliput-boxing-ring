import { Game } from './game'
import { Renderer } from './renderer'
import { HUD } from './hud'

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

const game = new Game()
const renderer = new Renderer(ctx)
const hud = new HUD(ctx, canvas)

let lastTime = Date.now()

function gameLoop() {
  const now = Date.now()
  const deltaTime = now - lastTime
  lastTime = now

  // Update game state
  game.update(deltaTime)

  // Render
  const state = game.getState()
  renderer.clear()
  renderer.drawRing()
  renderer.drawFighter(state.player)
  renderer.drawFighter(state.opponent)
  hud.draw(state.player, state.opponent, state.gameOver, state.winner)

  requestAnimationFrame(gameLoop)
}

// Input handlers
window.addEventListener('keydown', (e) => {
  game.handleKeyDown(e.key.toLowerCase())
})

window.addEventListener('keyup', (e) => {
  game.handleKeyUp(e.key.toLowerCase())
})

// Mouse click for restart button
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const state = game.getState()
  if (state.gameOver && hud.isRestartButtonClicked(x, y)) {
    game.reset()
  }
})

// Instructions
console.log('Controls:')
console.log('Movement: A/D or Arrow Keys')
console.log('Jump: W or Up Arrow')
console.log('Jab: J (fast, low damage)')
console.log('Hook: K (slow, high damage, staggers)')
console.log('Dodge: Space (i-frames)')

// Start game loop
gameLoop()
