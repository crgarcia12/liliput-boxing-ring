import { Boxer } from './Boxer';

export class HUDRenderer {
  static render(ctx: CanvasRenderingContext2D, player: Boxer, ai: Boxer, canvas: HTMLCanvasElement): void {
    const padding = 20;
    const barWidth = 200;
    const barHeight = 20;

    // Player health bar (left side)
    ctx.fillStyle = '#333';
    ctx.fillRect(padding, padding, barWidth, barHeight);
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(padding, padding, (player.health / 100) * barWidth, barHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(padding, padding, barWidth, barHeight);
    
    ctx.fillStyle = '#FFF';
    ctx.font = '14px Arial';
    ctx.fillText('Player HP: ' + Math.round(player.health), padding, padding - 5);

    // Player stamina bar (left side, below health)
    ctx.fillStyle = '#333';
    ctx.fillRect(padding, padding + 30, barWidth, barHeight);
    ctx.fillStyle = '#FFC107';
    ctx.fillRect(padding, padding + 30, (player.stamina / 100) * barWidth, barHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(padding, padding + 30, barWidth, barHeight);
    
    ctx.fillStyle = '#FFF';
    ctx.fillText('Stamina: ' + Math.round(player.stamina), padding, padding + 25);

    // AI health bar (right side)
    const rightX = canvas.width - padding - barWidth;
    ctx.fillStyle = '#333';
    ctx.fillRect(rightX, padding, barWidth, barHeight);
    ctx.fillStyle = '#F44336';
    ctx.fillRect(rightX, padding, (ai.health / 100) * barWidth, barHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(rightX, padding, barWidth, barHeight);
    
    ctx.fillStyle = '#FFF';
    ctx.fillText('AI HP: ' + Math.round(ai.health), rightX, padding - 5);

    // AI stamina bar (right side, below health)
    ctx.fillStyle = '#333';
    ctx.fillRect(rightX, padding + 30, barWidth, barHeight);
    ctx.fillStyle = '#FFC107';
    ctx.fillRect(rightX, padding + 30, (ai.stamina / 100) * barWidth, barHeight);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(rightX, padding + 30, barWidth, barHeight);
    
    ctx.fillStyle = '#FFF';
    ctx.fillText('Stamina: ' + Math.round(ai.stamina), rightX, padding + 25);
  }
}
