import { AIOpponent } from './ai-opponent';
import { AIAction, AIDifficulty, Boxer } from './types';

// Game state
let player: Boxer;
let aiBoxer: Boxer;
let aiController: AIOpponent;
let lastTime = 0;
let keys: { [key: string]: boolean } = {};

// Canvas setup
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// Initialize game
function init() {
  player = {
    x: 200,
    y: 200,
    health: 100,
    stamina: 100,
    isWindingUp: false,
    cooldowns: { jab: 0, hook: 0, dodge: 0 },
  };

  aiBoxer = {
    x: 600,
    y: 200,
    health: 100,
    stamina: 100,
    isWindingUp: false,
    cooldowns: { jab: 0, hook: 0, dodge: 0 },
  };

  aiController = new AIOpponent(AIDifficulty.MEDIUM);

  // Keyboard input
  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  requestAnimationFrame(gameLoop);
}

// Main game loop
function gameLoop(currentTime: number) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  update(deltaTime, currentTime);
  render();
  updateUI();

  requestAnimationFrame(gameLoop);
}

// Update game state
function update(deltaTime: number, currentTime: number) {
  // Update cooldowns
  const cd = deltaTime;
  player.cooldowns.jab = Math.max(0, player.cooldowns.jab - cd);
  player.cooldowns.hook = Math.max(0, player.cooldowns.hook - cd);
  player.cooldowns.dodge = Math.max(0, player.cooldowns.dodge - cd);
  
  aiBoxer.cooldowns.jab = Math.max(0, aiBoxer.cooldowns.jab - cd);
  aiBoxer.cooldowns.hook = Math.max(0, aiBoxer.cooldowns.hook - cd);
  aiBoxer.cooldowns.dodge = Math.max(0, aiBoxer.cooldowns.dodge - cd);

  // Recover stamina when idle
  player.stamina = Math.min(100, player.stamina + deltaTime * 0.01);
  aiBoxer.stamina = Math.min(100, aiBoxer.stamina + deltaTime * 0.01);

  // Player input
  handlePlayerInput();

  // AI decision making
  const aiAction = aiController.makeDecision(aiBoxer, player, currentTime);
  executeAIAction(aiAction, deltaTime);
}

// Handle player keyboard input
function handlePlayerInput() {
  const speed = 2;

  // Movement
  if (keys['a']) {
    player.x = Math.max(50, player.x - speed);
  }
  if (keys['d']) {
    player.x = Math.min(750, player.x + speed);
  }

  // Attacks
  if (keys['j'] && player.cooldowns.jab === 0 && player.stamina >= 20) {
    player.stamina -= 20;
    player.cooldowns.jab = 800;
    player.isWindingUp = true;
    setTimeout(() => player.isWindingUp = false, 200);
    
    // Check if hit lands
    const dist = Math.abs(player.x - aiBoxer.x);
    if (dist < 70) {
      aiBoxer.health = Math.max(0, aiBoxer.health - 5);
    }
  }

  if (keys['k'] && player.cooldowns.hook === 0 && player.stamina >= 30) {
    player.stamina -= 30;
    player.cooldowns.hook = 1500;
    player.isWindingUp = true;
    setTimeout(() => player.isWindingUp = false, 400);
    
    // Check if hit lands
    const dist = Math.abs(player.x - aiBoxer.x);
    if (dist < 50) {
      aiBoxer.health = Math.max(0, aiBoxer.health - 15);
    }
  }

  if (keys[' '] && player.cooldowns.dodge === 0 && player.stamina >= 15) {
    player.stamina -= 15;
    player.cooldowns.dodge = 1200;
  }
}

// Execute AI action
function executeAIAction(action: AIAction, deltaTime: number) {
  const speed = 1.5;

  switch (action) {
    case AIAction.JAB:
      if (aiBoxer.cooldowns.jab === 0 && aiBoxer.stamina >= 20) {
        aiBoxer.stamina -= 20;
        aiBoxer.cooldowns.jab = 800;
        aiBoxer.isWindingUp = true;
        setTimeout(() => aiBoxer.isWindingUp = false, 200);
        
        const dist = Math.abs(player.x - aiBoxer.x);
        if (dist < 70) {
          player.health = Math.max(0, player.health - 5);
        }
      }
      break;

    case AIAction.HOOK:
      if (aiBoxer.cooldowns.hook === 0 && aiBoxer.stamina >= 30) {
        aiBoxer.stamina -= 30;
        aiBoxer.cooldowns.hook = 1500;
        aiBoxer.isWindingUp = true;
        setTimeout(() => aiBoxer.isWindingUp = false, 400);
        
        const dist = Math.abs(player.x - aiBoxer.x);
        if (dist < 50) {
          player.health = Math.max(0, player.health - 15);
        }
      }
      break;

    case AIAction.DODGE:
      if (aiBoxer.cooldowns.dodge === 0 && aiBoxer.stamina >= 15) {
        aiBoxer.stamina -= 15;
        aiBoxer.cooldowns.dodge = 1200;
      }
      break;

    case AIAction.MOVE_FORWARD:
      if (aiBoxer.x > player.x) {
        aiBoxer.x = Math.max(50, aiBoxer.x - speed);
      } else {
        aiBoxer.x = Math.min(750, aiBoxer.x + speed);
      }
      break;

    case AIAction.MOVE_BACKWARD:
      if (aiBoxer.x > player.x) {
        aiBoxer.x = Math.min(750, aiBoxer.x + speed);
      } else {
        aiBoxer.x = Math.max(50, aiBoxer.x - speed);
      }
      break;

    case AIAction.CIRCLE_LEFT:
      aiBoxer.x = Math.max(50, aiBoxer.x - speed * 0.5);
      break;

    case AIAction.CIRCLE_RIGHT:
      aiBoxer.x = Math.min(750, aiBoxer.x + speed * 0.5);
      break;

    case AIAction.IDLE:
      // Do nothing
      break;
  }
}

// Render game
function render() {
  // Clear canvas
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw ring
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, 700, 300);

  // Draw player
  ctx.fillStyle = player.isWindingUp ? '#e74c3c' : '#3498db';
  ctx.beginPath();
  ctx.arc(player.x, player.y, 30, 0, Math.PI * 2);
  ctx.fill();
  
  // Player label
  ctx.fillStyle = '#fff';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PLAYER', player.x, player.y + 50);

  // Draw AI
  ctx.fillStyle = aiBoxer.isWindingUp ? '#e67e22' : '#e74c3c';
  ctx.beginPath();
  ctx.arc(aiBoxer.x, aiBoxer.y, 30, 0, Math.PI * 2);
  ctx.fill();
  
  // AI label
  ctx.fillStyle = '#fff';
  ctx.fillText('AI', aiBoxer.x, aiBoxer.y + 50);

  // Draw distance line
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(aiBoxer.x, aiBoxer.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw health bars
  drawHealthBar(player.x, player.y - 50, player.health, '#3498db');
  drawHealthBar(aiBoxer.x, aiBoxer.y - 50, aiBoxer.health, '#e74c3c');
}

// Draw health bar
function drawHealthBar(x: number, y: number, health: number, color: string) {
  const width = 60;
  const height = 8;
  
  // Background
  ctx.fillStyle = '#333';
  ctx.fillRect(x - width / 2, y, width, height);
  
  // Health
  ctx.fillStyle = color;
  ctx.fillRect(x - width / 2, y, (health / 100) * width, height);
  
  // Border
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - width / 2, y, width, height);
}

// Update UI
function updateUI() {
  document.getElementById('playerHealth')!.textContent = Math.round(player.health).toString();
  document.getElementById('playerStamina')!.textContent = Math.round(player.stamina).toString();
  document.getElementById('aiHealth')!.textContent = Math.round(aiBoxer.health).toString();
  document.getElementById('aiStamina')!.textContent = Math.round(aiBoxer.stamina).toString();
  document.getElementById('aiAction')!.textContent = aiController.getCurrentAction().toUpperCase();
}

// Start the game
init();
